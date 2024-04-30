

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/Calc/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.DjFQNmzY.js","_app/immutable/chunks/scheduler.DLmczG9q.js","_app/immutable/chunks/index.BCS5BNVK.js","_app/immutable/chunks/@vite-plugin-wasm-pack@HCM-middleware.CNXUF2vc.js"];
export const stylesheets = [];
export const fonts = [];
