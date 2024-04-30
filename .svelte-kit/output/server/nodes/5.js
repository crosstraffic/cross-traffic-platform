

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/SubRow/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/5.DWFFtCGF.js","_app/immutable/chunks/scheduler.DLmczG9q.js","_app/immutable/chunks/index.BCS5BNVK.js"];
export const stylesheets = [];
export const fonts = [];
