import * as universal from '../entries/pages/_layout.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.BE-8VuZk.js","_app/immutable/chunks/disclose-version.DsA8IxDv.js","_app/immutable/chunks/runtime.aMMvh1H4.js"];
export const stylesheets = [];
export const fonts = [];
