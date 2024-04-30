

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/about/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/6.DnJoWpER.js","_app/immutable/chunks/scheduler.DLmczG9q.js","_app/immutable/chunks/index.BCS5BNVK.js"];
export const stylesheets = [];
export const fonts = [];
