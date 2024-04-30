import { c as create_ssr_component } from "../../../chunks/ssr.js";
import "../../../chunks/@vite-plugin-wasm-pack@HCM-middleware.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { rows_len } = $$props;
  let { rows } = $$props;
  if ($$props.rows_len === void 0 && $$bindings.rows_len && rows_len !== void 0)
    $$bindings.rows_len(rows_len);
  if ($$props.rows === void 0 && $$bindings.rows && rows !== void 0)
    $$bindings.rows(rows);
  return `<button type="submit" class="btn" data-svelte-h="svelte-ntewo1">Calculate</button> `;
});
export {
  Page as default
};
