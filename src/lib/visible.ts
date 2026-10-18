// Which products appear. Drafts never do; 'comingSoon' designs (new models waiting on names,
// details and photos) appear on preview builds only, so Mitch and Nat can review them.
import { SHOW_SPOT_NUMBERS } from './photos';
export const IS_PREVIEW = SHOW_SPOT_NUMBERS;
export const listed = (data: { draft?: boolean; comingSoon?: boolean }) => !data.draft && (!data.comingSoon || IS_PREVIEW);
