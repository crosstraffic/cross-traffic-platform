import { c as create_ssr_component, d as add_attribute, b as escape } from "../../../chunks/ssr.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { subseg_num } = $$props;
  if ($$props.subseg_num === void 0 && $$bindings.subseg_num && subseg_num !== void 0)
    $$bindings.subseg_num(subseg_num);
  return `<tr${add_attribute("class", subseg_num, 0)}><th><p>${escape(subseg_num)}</p> </th> <td><input type="text" placeholder="Type here" id="${"subseg_len" + escape(subseg_num, true)}" name="subseg_len" class="${"subseg_len" + escape(subseg_num, true) + " input input-label w-2/3 max-w-xs"}" pattern="[+]?([0-9]*([.][0-9]*)|[1-9]|[1-9][0-9]|[1-9][0-9][0-9]|[1-9][0-9][0-9][0-9])$" value="0" autocomplete="off"> <label for="subseg_len" data-svelte-h="svelte-1t3nk1x"><span class="label-text-alt"></span> <span class="label-text-alt">ft.</span></label></td> <td><input type="text" placeholder="Type here" id="${"design_radius" + escape(subseg_num, true)}" class="${"design_radius" + escape(subseg_num, true) + " input input-label w-2/3 max-w-xs"}" pattern="[+]?([0-9]*([.][0-9]*)|[0-9]|[1-9][0-9]|[1-9][0-9][0-9]|[1-9][0-9][0-9][0-9])$" value="0" autocomplete="off"> <label for="design_radius" data-svelte-h="svelte-1uhunat"><span class="label-text-alt"></span> <span class="label-text-alt">ft.</span></label></td> <td><input type="text" placeholder="Type here" id="${"superelevation" + escape(subseg_num, true)}" class="${"superelevation" + escape(subseg_num, true) + " input input-label w-2/3 max-w-xs"}" pattern="[+\\-]?([0-9]*([.][0-9]*)|[0-9]|[1-9][0-9])$" value="0" autocomplete="off"> <label for="superelevation" data-svelte-h="svelte-p02ahv"><span class="label-text-alt"></span> <span class="label-text-alt">%</span></label></td></tr>`;
});
export {
  Page as default
};
