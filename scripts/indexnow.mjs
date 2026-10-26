// Tell Bing (and through it ChatGPT search and Copilot), Yandex, Seznam and Naver that pages changed,
// so they re-crawl in hours instead of weeks (IndexNow, AI search pass 2026-10-27).
// Run ONLY against the live domain, after the DNS cutover and after a deploy that changed content:
//   node scripts/indexnow.mjs            # every URL in the live sitemap
//   node scripts/indexnow.mjs /prices/   # just these paths
// The key is public by design: IndexNow checks it at https://www.sunshinetinyhouses.com.au/<key>.txt
// (public/<key>.txt). Google does not use IndexNow; it reads the sitemap in Search Console.
const HOST = 'www.sunshinetinyhouses.com.au';
const KEY = '2529a493471ddcab694b63c962332cc6';

const paths = process.argv.slice(2);
let urls = paths.map((p) => `https://${HOST}${p}`);
if (!urls.length) {
  const index = await (await fetch(`https://${HOST}/sitemap-index.xml`)).text();
  for (const sm of index.matchAll(/<loc>(.*?)<\/loc>/g)) {
    const xml = await (await fetch(sm[1])).text();
    urls.push(...[...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]));
  }
}
const keyCheck = await fetch(`https://${HOST}/${KEY}.txt`);
if (!keyCheck.ok || (await keyCheck.text()).trim() !== KEY) {
  console.error(`Key file https://${HOST}/${KEY}.txt is missing or wrong: has the site been deployed to the live domain?`);
  process.exit(1);
}
const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: urls }),
});
console.log(`${urls.length} URLs sent: HTTP ${res.status} ${res.statusText} (200 or 202 = accepted)`);
if (!res.ok) process.exit(1);
