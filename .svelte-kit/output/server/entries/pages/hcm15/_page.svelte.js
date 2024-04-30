import { c as create_ssr_component, e as each, v as validate_component, b as escape } from "../../../chunks/ssr.js";
import Page$1 from "../Row/_page.svelte.js";
import Page$2 from "../SubRow/_page.svelte.js";
import Page$3 from "../Calc/_page.svelte.js";
import "../../../chunks/@vite-plugin-wasm-pack@HCM-middleware.js";
import "@tauri-apps/api/shell";
function changeSegment(seg_num) {
  var table = document.getElementById("seg_imgs");
  var img_cap_row = table.rows[1];
  var img_cap = "undefined";
  var img = document.getElementById("seg_img" + seg_num);
  var Vi = document.getElementById("vi_input" + seg_num);
  var Vo = document.getElementById("vo_input" + seg_num);
  var PT = document.getElementById("passing_type" + seg_num).value;
  if (PT == "Passing Zone") {
    Vi.value = "1000";
    Vo.value = "0";
    img.src = "PassingZone.png";
    img.height = 100;
    img.width = 100;
    img.parentNode.width = 100;
    img_cap = "Passing Zone";
  } else if (PT == "Passing Constrained") {
    img.src = "PassingConstrained.png";
    Vi.value = "1000";
    Vo.value = "1500";
    img.height = 100;
    img.width = 100;
    img.parentNode.width = 100;
    img_cap = "Passing Constrained";
  } else if (PT == "Passing Lane") {
    img.src = "PassingLane.png";
    Vi.value = "1000";
    Vo.value = "0";
    img.height = 100;
    img.width = 150;
    img.parentNode.width = 150;
    img_cap = "Passing Lane";
  }
  img_cap_row.cells[seg_num - 1].innerHTML = img_cap;
}
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { rows } = $$props;
  let { subrows } = $$props;
  let toggle_seg = -1;
  subrows = [{ subseg_num: 1 }];
  rows = [{ seg_num: 1, subrows }];
  function toggleHCParams(seg_num) {
    var toggler = document.getElementById("hc_param" + seg_num);
    var hc_table = document.getElementById("hc_table" + seg_num);
    if (toggler.checked) {
      if (toggle_seg == -1) {
        hc_table.style.display = "block";
        toggle_seg = seg_num;
      } else {
        console.log("Cannot toggle more than one");
      }
    } else {
      if (toggle_seg == seg_num) {
        hc_table.style.display = "none";
        toggle_seg = -1;
      }
    }
  }
  function changeHC(seg_num, subseg_num) {
    var is_hc = document.getElementById("is_hc" + seg_num);
    var toggler = document.getElementById("hc_param" + seg_num);
    var hc_table = document.getElementById("hc_table" + seg_num);
    document.getElementsByClassName("design_radius" + subseg_num);
    if (is_hc.checked) {
      toggler.checked = true;
      toggleHCParams(seg_num);
    }
    if (!is_hc.checked) {
      if (toggle_seg == seg_num) {
        hc_table.style.display = "none";
        toggle_seg = -1;
        toggler.checked = false;
      }
    }
  }
  if ($$props.rows === void 0 && $$bindings.rows && rows !== void 0)
    $$bindings.rows(rows);
  if ($$props.subrows === void 0 && $$bindings.subrows && subrows !== void 0)
    $$bindings.subrows(subrows);
  return `<div id="hcm15-container"><h1 class="text-3xl font-bold underline" data-svelte-h="svelte-7db19c">HCM Calulator Chap15</h1> <label data-svelte-h="svelte-18b90cm">JSON Input</label> <input type="file" id="jsonInput" accept=".json">  ${``} <form id="hcm15" class="${["mt-4", ""].join(" ").trim()}"><div class="w-full overflow-x-auto"><table class="table w-full"><thead data-svelte-h="svelte-a8ya75"><tr> <th>Segment</th> <th>Passing Type</th> <th>Length</th> <th>Grade</th> <th>Posted Speed Limit</th> <th>Horizontal Curves</th> <th>Horizontal Params</th> <th>Demand Volume</th> <th>Demand Volume (O)</th> <th>Vertical Class</th> <th>Peak Hour Factor</th> <th>Heavy Vehicle Per.</th></tr></thead> <tbody>${each(rows, (row) => {
    return `${validate_component(Page$1, "Row").$$render(
      $$result,
      {
        seg_num: row.seg_num,
        subseg_num: row.subrows.length,
        changeSegment,
        changeHC,
        toggleHCParams
      },
      {},
      {}
    )}`;
  })}</tbody></table></div> <div class="grid auto-cols-max grid-flow-col md:grid-cols-2 sm:grid-cols-1 grid-cols-1"><div class="parameters flex justify-start overflow-x-auto" data-svelte-h="svelte-ary4em"><table class="table w-full"><tbody><tr><td style="display: inline-block;">Lane Width (ft):</td> <td><input type="text" id="LW_input" placeholder="Type here" class="input-label input w-full max-w-xs" value="12" pattern="[+]?([0-9]*([.][0-9]*)|[1-9]|[1-9][0-9])$" autocomplete="off" required></td></tr> <tr><td style="display: inline-block;">Shoulder Width (ft):</td> <td><input type="text" id="SW_input" placeholder="Type here" class="input-label input w-full max-w-xs" value="6" pattern="[+]?([0-9]*([.][0-9]*)|[1-9]|[1-9][0-9])$" autocomplete="off" required></td></tr> <tr><td style="display: inline-block;">Access Point Density (access points/mi):</td> <td><input type="text" id="APD_input" placeholder="Type here" class="input-label input w-full max-w-xs" value="2" pattern="[+]?([0-9]|[0-9]*([.][0-9]*)|[1-9]|[1-9][0-9])$" autocomplete="off" required></td></tr> <tr><td style="display: inline-block;">Percentage Multiplier for <br> Heavy Vehicles in the Faster / Passing Lane: <br>*Used only when Passing Lane included</td> <td><input type="text" id="PMHVFL_input" placeholder="Type here" class="input-label input w-full max-w-xs" value="0" pattern="[+]?([0-9]|[0-9]*([.][0-9]*)|[1-9]|[1-9][0-9])$" autocomplete="off" required></td></tr></tbody></table></div> ${each(rows, (row) => {
    return `<div class="hc_table overflow-x-auto card card-compact w-full bg-base-100 shadow-xl" id="${"hc_table" + escape(row.seg_num, true)}" style="display:none;"><div class="card-body"><table class="table table-compact"><thead><caption class="flex justify-start"><b>Segment ${escape(row.seg_num)}</b></caption> <tr data-svelte-h="svelte-sbjh6j"><th>Subsegment</th> <th>Length</th> <th>Design Radius</th> <th>Superelevation</th> </tr></thead> <tbody>${each(row.subrows, (subrow) => {
      return `${validate_component(Page$2, "SubRow").$$render($$result, { subseg_num: subrow.subseg_num }, {}, {})}`;
    })}</tbody> <div class="flex justify-end"><button class="btn btn-outline btn-sm" type="button" data-svelte-h="svelte-3w0114">Add</button> <button class="btn btn-outline btn-sm" type="button" data-svelte-h="svelte-1bm910w">Remove</button></div> </table></div> </div>`;
  })}</div> <div class="overflow-x-auto" data-svelte-h="svelte-ogcc0f"><table class="flex justify-start" id="seg_imgs"><tbody><tr class="table_img"><td><img src="segment.jpg" alt="segment" id="seg_img1" height="100" width="100"></td></tr> <tr class="table_p"><td>undefined</td></tr></tbody></table></div> <div class="flex justify-end"><button class="btn" type="button" data-svelte-h="svelte-1cpbuam">Launch SUMO</button> <a class="btn" type="submit" id="jsonOutput" data-svelte-h="svelte-wstgn3">Export as JSON</a> <button class="btn" type="button" data-svelte-h="svelte-1ptbqe4">Reset Params</button> ${validate_component(Page$3, "Calc").$$render($$result, { rows_len: rows.length, rows }, {}, {})} <button class="btn" type="button" data-svelte-h="svelte-1xthk90">Add Segment</button> <button class="btn" type="button" data-svelte-h="svelte-3g99z6">Remove Segment</button></div></form>  <pre id="simulation-canvas"></pre> <div class="los overflow-x-auto"><h3 data-svelte-h="svelte-1erhcjg">Outputs</h3> <table class="table w-full"><thead><tr><th></th> ${each(rows, (row) => {
    return `<th>Segment ${escape(row.seg_num)}</th>`;
  })}</tr></thead> <tbody><tr><th id="ffs" data-svelte-h="svelte-hsq39t">Free-flow Speed (mi/hr):</th> ${each(rows, (row) => {
    return `<td id="${"ffs" + escape(row.seg_num, true)}"></td>`;
  })}</tr> <tr><th id="avgspd" data-svelte-h="svelte-1q5b8il">Average Speed (mi/hr):</th> ${each(rows, (row) => {
    return `<td id="${"avgspd" + escape(row.seg_num, true)}"></td>`;
  })}</tr> <tr><th id="pf" data-svelte-h="svelte-1xzberj">Percent followers in the <br> analysis direction (%):</th> ${each(rows, (row) => {
    return `<td id="${"pf" + escape(row.seg_num, true)}"></td>`;
  })}</tr> <tr><th id="fd" data-svelte-h="svelte-79l5nu">Followers Density (followers/mi):</th> ${each(rows, (row) => {
    return `<td id="${"fd" + escape(row.seg_num, true)}"></td>`;
  })}</tr> <tr><th id="seglos" data-svelte-h="svelte-t3rq9c">Segment LOS:</th> ${each(rows, (row) => {
    return `<td id="${"seglos" + escape(row.seg_num, true)}"></td>`;
  })}</tr></tbody></table> <p id="los" data-svelte-h="svelte-13z73v7">Facility LOS:</p> <p id="fdF" data-svelte-h="svelte-zmd8y9">Facility Follower Density:</p> <p id="error" data-svelte-h="svelte-4f23fz">Error Message:</p></div></div>`;
});
export {
  Page as default
};
