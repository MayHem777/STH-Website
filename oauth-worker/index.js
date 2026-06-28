/**
 * GitHub OAuth proxy for Decap CMS
 * Handles two routes:
 *   GET /auth     — redirect browser to GitHub OAuth consent screen
 *   GET /callback — exchange code for token, post back to Decap popup
 *
 * Required Worker secrets (set via wrangler secret put):
 *   GITHUB_CLIENT_ID
 *   GITHUB_CLIENT_SECRET
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    // Step 1: redirect to GitHub
    if (url.pathname === '/auth') {
      const params = new URLSearchParams({
        client_id: env.GITHUB_CLIENT_ID,
        scope: 'repo,user',
        redirect_uri: `${url.origin}/callback`,
      });
      return Response.redirect(
        `https://github.com/login/oauth/authorize?${params}`,
        302,
      );
    }

    // Step 2: exchange code for token, return to Decap popup
    if (url.pathname === '/callback') {
      const code = url.searchParams.get('code');
      if (!code) {
        return errorPage('Missing OAuth code');
      }

      const tokenRes = await fetch(
        'https://github.com/login/oauth/access_token',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            client_id: env.GITHUB_CLIENT_ID,
            client_secret: env.GITHUB_CLIENT_SECRET,
            code,
          }),
        },
      );

      const data = await tokenRes.json();

      if (data.error || !data.access_token) {
        return errorPage(data.error_description ?? data.error ?? 'Unknown error');
      }

      // Decap CMS two-step handshake:
      // 1. Popup announces itself with "authorizing:github"
      // 2. Decap echoes it back so popup knows the opener origin
      // 3. Popup sends the token to that exact origin
      const token = data.access_token;

      const html = `<!doctype html>
<html><head><meta charset="utf-8"></head>
<body>
<script>
(function(){
  var token = ${JSON.stringify(token)};
  var authMsg = 'authorization:github:success:' + JSON.stringify({ token: token, provider: 'github' });

  function receiveMessage(e) {
    if (typeof e.data !== 'string' || !e.data.startsWith('authorizing:')) return;
    window.removeEventListener('message', receiveMessage, false);
    window.opener.postMessage(authMsg, e.origin);
    setTimeout(function(){ window.close(); }, 500);
  }

  window.addEventListener('message', receiveMessage, false);
  window.opener.postMessage('authorizing:github', '*');
})();
</script>
</body></html>`;

      return new Response(html, {
        headers: { 'Content-Type': 'text/html;charset=utf-8' },
      });
    }

    return new Response('Not found', { status: 404 });
  },
};

function errorPage(message) {
  const html = `<!doctype html>
<html><head><meta charset="utf-8"></head>
<body>
<script>
(function(){
  var msg = 'authorization:github:error:' + ${JSON.stringify(JSON.stringify({ message }))};
  if (window.opener) window.opener.postMessage(msg, '*');
  window.close();
})();
</script>
</body></html>`;
  return new Response(html, {
    status: 400,
    headers: { 'Content-Type': 'text/html;charset=utf-8' },
  });
}
