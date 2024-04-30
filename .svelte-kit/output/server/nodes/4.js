

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/Row/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/4.B9BK_bom.js","_app/immutable/chunks/scheduler.DLmczG9q.js","_app/immutable/chunks/index.BCS5BNVK.js"];
export const stylesheets = [];
export const fonts = [];
