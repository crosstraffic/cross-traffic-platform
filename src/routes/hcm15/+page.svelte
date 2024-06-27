<script type="text/javascript">
  import Row from '../Row/+page.svelte';
  import SubRow from '../SubRow/+page.svelte';
  import Calc from '../Calc/+page.svelte';
  import init, { WasmSegment, WasmSubSegment, WasmTwoLaneHighways } from "HCM-middleware";
  import { onMount } from "svelte";
  import { Command } from "@tauri-apps/api/shell";
  import { writeFile } from "@tauri-apps/api/fs";
  import { appDataDir } from "@tauri-apps/api/path";

  onMount(async() => {
    await init(); // init initializes memory addresses needed by WASM and that will be used by JS/TS
  });


  function isTauri() {
    return typeof window.__TAURI__ !== 'undefined';
  }


  let inputParams = {
    passing_type: ["undefined"],
    seg_length: [0],
    seg_grade: [0],
    seg_Spl: [0],
    is_hc: [false],
    vi_input: [0],
    vo_input: [0],
    vc_select: ["1"],
    phf: [0.95],
    phv: [5],
    lw: 12,
    sw: 6,
    apd: 2,
    pmhvfl: 0,
  }

  let inputSubParams = {
    subseg_length: [0],
    design_radius: [0],
    central_angle: [0],
    superelevation: [0],
  }

  let outputParams = {
    ffs: [0],
    pf: [0],
    avgspd: [0],
    fd: [0],
    seglos: [''],
    los: '',
    fdF: 0,
  }

  let imgParams = {
    src: ["segment.jpg"],
    width: [100],
    height: [100],
    td_width: [100],
    cap: ["undefined"]
  }

  let activeTab = 'calculation';

  function setActiveTab(tab) {
    activeTab = tab;
  }


  // export let data;
  // let { rows, subrows } = data;
  export let rows;
  export let subrows;
  let toggle_seg = -1;

  subrows = [{ subseg_num: 1 }];
  rows = [{ seg_num: 1, subrows }];


  // Show microsimulation
  async function startSimulation() {

    let seg_x = new Array(rows.length);
    let seg_y = new Array(rows.length);
    let rad = new Array(rows.length);
    let c_angl = new Array(rows.length);
    let sup_ele = new Array(rows.length);
    let speed = new Array(rows.length);
    let lane_width = inputParams.lw;
    let num_lanes = new Array(rows.length);
    let Vi = new Array(rows.length);
    let Vo = new Array(rows.length);
    let phf = new Array(rows.length);
    let fdensity = new Array(rows.length);
    let bdensity = new Array(rows.length);
    let phv = new Array(rows.length);

    // 2D initialization
    for (var i=0; i < rows.length; i++){
      seg_x[i] = new Array(rows[i].subrows.length+1);
      seg_y[i] = new Array(rows[i].subrows.length+1);
      rad[i] = new Array(rows[i].subrows.length+1);
      c_angl[i] = new Array(rows[i].subrows.length+1);
      sup_ele[i] = new Array(rows[i].subrows.length+1);
    }

    for (let i=0; i < rows.length; i++) {

      // TODO: Return error if something missing
      // let pass_type = document.getElementById('passing_type'+(i+1));
      // let pt = pass_type.options[pass_type.selectedIndex].text;
      let pt = inputParams.passing_type[i];
      // if (document.getElementById("is_hc"+(i+1)).checked) {
      console.log(rows[i].subrows.length);
      if (inputParams.is_hc[i]) {
        for (let j=0; j < rows[i].subrows.length; j++) {
          seg_x[i][j] = document.getElementById("hc_table"+(i+1)).getElementsByClassName('subseg_len'+(j+1))[0].value;
          seg_y[i][j] = 0.0;
          console.log(seg_x[i][j]);
          rad[i][j] = document.getElementById("hc_table"+(i+1)).getElementsByClassName("design_radius"+(j+1))[0].value;
          c_angl[i][j] = document.getElementById("hc_table"+(i+1)).getElementsByClassName("central_angle"+(j+1))[0].value;
          sup_ele[i][j] = document.getElementById("hc_table"+(i+1)).getElementsByClassName("superelevation"+(j+1))[0].value;
        }
      } else {
        // seg_x[i][0] = document.getElementById('seg_length'+(i+1)).value;
        seg_x[i][0] = inputParams.seg_length[i];
        seg_y[i][0] = 0.0;
      }
      if (pt == 'Passing Lane')
        num_lanes[i] = 2;
      else
        num_lanes[i] = 1;
      // speed[i] = document.getElementById('seg_Spl'+(i+1)).value;
      speed[i] = inputParams.seg_Spl[i];
      Vi[i] = inputParams.vi_input[i];
      Vo[i] = inputParams.vo_input[i];
      phf[i] = inputParams.phf[i];
      fdensity[i] = Vi[i] / (speed[i] * 3.6)
      bdensity[i] = Vo[i] / (speed[i] * 3.6)
      // phv[i] = document.getElementById('PHV_input'+(i+1)).value;
      phv[i] = inputParams.phv[i];

    }

    // Each argument must be states in one line and split with column.
    // - subsegment_num should be differed depending on the segment
    const set_command_list = [
      '--root_dir',
      "../sim-coordination/sumo",
      '--segment_num',
      rows.length.toString(),
      '--lane_width',
      lane_width.toString(),
      '--seg_x',
    ]

    // Add segment x
    let seg_x_str = "";
    for (let i=0; i < rows.length; i++) {
      // let sup_ele_list = new Array(rows.length);
      for (let j=0; j < rows[i].subrows.length; j++) {
        seg_x_str += seg_x[i][j].toString();
      }
      if (i != rows.length-1)
        seg_x_str += ";";
    }
    set_command_list.push(seg_x_str);

    // Add segment y
    set_command_list.push('--seg_y');
    let seg_y_str = "";
    for (let i=0; i < rows.length; i++) {
      for (let j=0; j < rows[i].subrows.length; j++) {
        seg_y_str += seg_y[i][j].toString();
      }
      if (i != rows.length-1)
        seg_y_str += ";";
    }
    set_command_list.push(seg_y_str);

    // Add number of subsegment
    set_command_list.push('--subsegment_num');
    for (let i=0; i < rows.length; i++) {
      set_command_list.push(rows[i].subrows.length.toString());
    }

    // Add Speed
    set_command_list.push('--speed');
    for (let i=0; i<rows.length; i++) {
      set_command_list.push(speed[i].toString());
    }

    // Add number of lanes
    set_command_list.push('--num_lanes');
    for (let i=0; i<rows.length; i++) {
      set_command_list.push(num_lanes[i].toString());
    }

    // Add density
    set_command_list.push('--fdensity');
    for (let i=0; i<rows.length; i++) {
      set_command_list.push(fdensity[i].toString());
    }

    set_command_list.push('--bdensity');
    for (let i=0; i<rows.length; i++) {
      set_command_list.push(bdensity[i].toString());
    }

    // Add volume
    set_command_list.push('--vi');
    for (let i=0; i<rows.length; i++) {
      set_command_list.push(Vi[i].toString());
    }

    set_command_list.push('--vo');
    for (let i=0; i<rows.length; i++) {
      set_command_list.push(Vo[i].toString());
    }

    // Add Percentage of Heavy Vehicle
    set_command_list.push('--phv');
    for (let i=0; i < rows.length; i++) {
      set_command_list.push(phv[i].toString());
    }

    // Add Radius
    set_command_list.push('--rad');
    let rad_str = "";
    for (let i=0; i < rows.length; i++) {
      if (inputParams.is_hc[i]) {
        for (let j=0; j < rows[i].subrows.length; j++) {
          rad_str += rad[i][j].toString();
        }
      } else {
          rad_str += "0.0";
      }
      if (i != rows.length-1)
        rad_str += ";";
    }
    set_command_list.push(rad_str);

    // Add Central Angle
    set_command_list.push('--ca');
    let c_angl_str = "";
    for (let i=0; i < rows.length; i++) {
      if (inputParams.is_hc[i]) {
        for (let j=0; j < rows[i].subrows.length; j++) {
          c_angl_str += c_angl[i][j].toString();
        }
      } else {
          c_angl_str += "0.0";
      }
      if (i != rows.length-1)
        c_angl_str += ";";
    }
    set_command_list.push(c_angl_str);

    // Add Super Elevation
    set_command_list.push('--sup_ele');
    let sup_ele_str = "";
    for (let i=0; i < rows.length; i++) {
      if (inputParams.is_hc[i]) {
        for (let j=0; j < rows[i].subrows.length; j++) {
          sup_ele_str += sup_ele[i][j].toString();
        }
      } else {
        sup_ele_str += "0.0";
      }
      if (i != rows.length-1)
        sup_ele_str += ";";
    }
    set_command_list.push(sup_ele_str);


    const set_command = Command.sidecar("../sim-coordination/sumo/make_netfile", set_command_list);
    console.log(set_command);
    const output = await set_command.execute();
    console.log(output);

    // Get index of Passing Zone, othersise, opposing flow is ignored in calculation.
    let vo_index = 0;
    for (let i=0; i<rows.length; i++) {
      if (num_lanes[i] == 2) {
        vo_index = i;
      }
    }

    const trip_command_list = [
      '--net-file',
      '../sim-coordination/sumo/hcm15.net.xml',
      '--route-file',
      '../sim-coordination/sumo/hcm15.rou.xml',
      '--output-trip-file',
      '../sim-coordination/sumo/hcm15.trips.xml',
      '--additional-files',
      '../sim-coordination/sumo/hcm15.add.vtype.xml',
      '--random-depart',
      '--period',
      phf[0].toString(),
      '--flows',
      Vi[0].toString(),
      '--op-flows',
      Vo[vo_index].toString(),
      '--fringe-factor',
      'max',
      '--speed-exponent',
      '1.0',
      '--num-segs',
      rows.length.toString(),
      '--trip-attributes',
      'departSpeed=\"max\" type=\"typedist1\"',
    ]


    trip_command_list.push('--num-subsegs');
    for (let i=0; i < rows.length; i++) {
      trip_command_list.push(rows[i].subrows.length.toString());
    }

    if (rows.length == 1) {
      trip_command_list.push('--allow-fringe');
    }

    // Reload tauri when updating new net file.
    const trip_command = Command.sidecar("../sim-coordination/sumo/randomTrip", trip_command_list)
    console.log(trip_command);
    const trip_output = await trip_command.execute();
    console.log(trip_output);

    const run_command = Command.sidecar("../sim-coordination/sumo/run_sumo");
    run_command.execute();

  }

  async function stopSimulation() {
    await fetch('/stopSimulation', { method: 'POST' });
  }


  function addSegment() {
    rows = [...rows, { seg_num: rows.length + 1, subrows }];

    imgParams.src.push('segment.jpg');
    imgParams.height.push(100);
    imgParams.width.push(100);
    imgParams.cap.push("undefined");
    inputParams.phf.push(0.94);
    inputParams.phv.push(5);
    inputParams.is_hc.push(false);
    inputParams.seg_length.push(0);
    inputParams.seg_grade.push(0);
    inputParams.seg_Spl.push(0);
    inputParams.vi_input.push(0);
    inputParams.vo_input.push(0);
    inputParams.vc_select.push("1");

    inputSubParams.subseg_length.push(0);
    inputSubParams.design_radius.push(0);
    inputSubParams.central_angle.push(0);
    inputSubParams.superelevation.push(0);
  }

  function removeSegment() {
    var table = document.getElementById('seg_imgs');
    var img = document.getElementById('seg_img' + rows.length);
    var img_row = table.rows[0];
    var cap_row = table.rows[1];

    inputParams.phf.pop();
    inputParams.phv.pop();

    if (rows.length > 1) {
      if (img != null) {
        // img.parentNode.removeChild(img);
        img_row.deleteCell(-1);
      }

      if (cap_row.length == img_row.length) {
        // cap_row.innerHTML = '';
        cap_row.deleteCell(-1);
      }

      rows = rows.slice(0, rows.length - 1);
    }
  }

  function changeSegment(seg_num) {
    let PT = inputParams.passing_type[seg_num-1];

    if (PT == 'Passing Zone') {
      inputParams.vi_input[seg_num-1] = 1000;
      inputParams.vo_input[seg_num-1] = 0;
      imgParams.src[seg_num-1] = 'PassingZone.png';
      imgParams.height[seg_num-1] = 100;
      imgParams.width[seg_num-1] = 100;
      imgParams.td_width[seg_num-1] = 100;
      imgParams.cap[seg_num-1] = 'Passing Zone';
    } else if (PT == 'Passing Constrained') {
      imgParams.src[seg_num-1] = 'PassingConstrained.png';
      inputParams.vi_input[seg_num-1] = 1000;
      inputParams.vo_input[seg_num-1] = 1500;
      imgParams.height[seg_num-1] = 100;
      imgParams.width[seg_num-1] = 100;
      imgParams.td_width[seg_num-1] = 100;
      imgParams.cap[seg_num-1] = 'Passing Constrained';
    } else if (PT == 'Passing Lane') {
      imgParams.src[seg_num-1] = 'PassingLane.png';
      inputParams.vi_input[seg_num-1] = 1000;
      inputParams.vo_input[seg_num-1] = 0;
      imgParams.height[seg_num-1] = 100;
      imgParams.width[seg_num-1] = 150;
      imgParams.td_width[seg_num-1] = 150;
      imgParams.cap[seg_num-1] = "Passing Lane";
    }
  }

  // function toggleActive(seg_num) {
  //   var table = document.getElementById('seg_imgs');
  //   var img = document.getElementById('seg_img' + rows.length);
  //   var img_row = table.rows[0];
  //   var cap_row = table.rows[1];
  //   var active = document.getElementById('active' + seg_num);

  // }

  // Toggle HC param slider
  function toggleHCParams(seg_num) {
    var toggler = document.getElementById('hc_param' + seg_num);
    var hc_table = document.getElementById('hc_table' + seg_num);

    // Only shows one sub table
    if (toggler.checked) {
      if (toggle_seg == -1) {
        hc_table.style.display = 'block';
        toggle_seg = seg_num;
      } else {
        console.log('Cannot toggle more than one');
      }
    } else {
      if (toggle_seg == seg_num) {
        hc_table.style.display = 'none';
        toggle_seg = -1;
      }
    }
  }

  // If check horizontal curves button
  function changeHC(seg_num, subseg_num){
    // var is_hc = document.getElementById("is_hc" + (seg_num));
    var is_hc = inputParams.is_hc[seg_num-1];
    var toggler = document.getElementById("hc_param" + (seg_num));
    var hc_table = document.getElementById("hc_table" + (seg_num));

    var subdesign_radius = document.getElementsByClassName("design_radius" + (subseg_num));

    // Only shows one sub table
    if (is_hc){
      // add required attribute to subsegment
      // subdesign_radius.required = true;
      // console.log(subdesign_radius.required);
      toggler.checked = true;
      toggleHCParams(seg_num);
    }
      // if (toggle_seg == -1){
      //   hc_table.style.display = 'block';
      //   toggle_seg = seg_num;
      // } else {
      //   console.log("Cannot out more than one");
      // }
    if (!is_hc){
      if (toggle_seg == seg_num){
        hc_table.style.display = 'none';
        toggle_seg = -1;
        toggler.checked = false;
      }
    }
  }

  function addSubSegment(_seg_num) {
    var temp_subrows = [...rows[_seg_num - 1].subrows, { subseg_num: rows[_seg_num - 1].subrows.length + 1 }];
    rows[_seg_num - 1] = { seg_num: _seg_num, subrows: temp_subrows };
  }

  function removeSubSegment(_seg_num) {
    if (rows[_seg_num - 1].subrows.length > 1)
      //   subrows = subrows.slice(0, subrows.length-1);
      rows[_seg_num - 1].subrows = rows[_seg_num - 1].subrows.slice(0, rows[_seg_num - 1].subrows.length - 1);
  }

  let hasError = false;
  let isSuccessVisible = false;
  let submitted = false;
  const errMessage = "Here is the error";
  function handleSubmit(e){
      isSuccessVisible = true;

      setTimeout(function(){
          isSuccessVisible = false;
      }, 4000);
  }

  let json;
	
	async function jsonInputHandler(e) {
		const file = e.target.files[0];
		if (file == null) {
			json = null;
			return;
		}
		
		json = await readJsonFile(file);

    fillInJsonValue(json);
	}

	function readJsonFile(file) {
		const reader = new FileReader();
		return new Promise((resolve, reject) => {
			reader.onload = () => resolve(JSON.parse(reader.result));
			reader.onerror = reject;
			reader.readAsText(file);
		});
	}

  async function fillInJsonValue(json) {

    let lw = json.lane_width;
    let sw = json.shoulder_width;
    let apd = json.apd;
    let pmhvfl = json.pmhvfl;

    // Two lane highway
    inputParams.lw = lw;
    inputParams.sw = sw;
    inputParams.apd = apd;
    inputParams.pmhvfl = pmhvfl;

    // Segments
    for (let i=0; i<json.segments.length; i++) {
      if (i != 0) {
        addSegment();
      }
      setTimeout(function() {
        // const pass_type = document.getElementById('passing_type'+(i+1))
        // pass_type.options.item(json.segments[i].passing_type+1).selected = true;
        if (json.segments[i].passing_type == 0)
          inputParams.passing_type[i] = "Passing Constrained";
        else if (json.segments[i].passing_type == 1)
          inputParams.passing_type[i] = "Passing Zone";
        else if (json.segments[i].passing_type == 2)
          inputParams.passing_type[i] = "Passing Lane";
        // Fire segment change
        changeSegment(i+1);
        inputParams.seg_length[i] = json.segments[i].length;
        inputParams.seg_grade[i] = json.segments[i].grade;
        inputParams.seg_Spl[i] = json.segments[i].spl;
        inputParams.is_hc[i] = json.segments[i].is_hc;
        inputParams.vi_input[i] = json.segments[i].volume;
        inputParams.vo_input[i] = json.segments[i].volume_op;
        inputParams.vc_select[i] = json.segments[i].vertical_class.toString();
        inputParams.phf[i] = json.segments[i].phf;
        inputParams.phv[i] = json.segments[i].phv;


        var hc_table = document.getElementById("hc_table"+(i+1));
        hc_table.style.display = 'none';
        toggle_seg = -1;

        // if (json.segments[i].is_hc) toggleHCParams(i+1);

        // SubSegments
        for (let j=0; j<json.segments[i].subsegments.length; j++) {
          if (j != 0) addSubSegment(i+1); 
          setTimeout(function() {
            inputSubParams.subseg_length[j] = json.segments[i].subsegments[j].length;
            inputSubParams.design_radius[j] = json.segments[i].subsegments[j].design_rad;
            inputSubParams.central_angle[j] = json.segments[i].subsegments[j].central_angle;
            inputSubParams.superelevation[j] = json.segments[i].subsegments[j].sup_ele;
          }, 10);
        }
      }, 10);
    }

  }

  async function jsonOutputHandler() {

    const jsonData = { "segments": [],
                      "lane_width": 0.0,
                      "shoulder_width": 0.0,
                      "apd": 0.0,
                      "pmhvfl": 0.0,
                      "l_de": 0.0
                    };
    jsonData["lane_width"] = parseInt(document.getElementById('LW_input').value);
    jsonData["shoulder_width"] = parseInt(document.getElementById('SW_input').value);
    jsonData["apd"] = parseInt(document.getElementById('APD_input').value);
    jsonData["pmhvfl"] = parseInt(document.getElementById('PMHVFL_input').value);

    let seg_num = rows.length;
    for (let i=0; i < seg_num; i++) {
      const segments_dict = {
        "passing_type": 0,
        "length": 0.0,
        "grade": 0.0,
        "spl": 0.0,
        "is_hc": false,
        "volume": 0.0,
        "volume_op": 0.0,
        "flow_rate": 0.0,
        "flow_rate_o": 0.0,
        "capacity": 0,
        "ffs": 0.0,
        "avg_speed": 0.0,
        "vertical_class": 1,
        "subsegments": [],
        "phf": 0.0,
        "phv": 0,
        "pf": 0.0,
        "fd": 0.0,
        "fd_mid": 0.0,
        "hor_class": 0
      }

      let subseg_num = rows[i].subrows.length;
      var pass_type = document.getElementById("passing_type"+(i+1));
      var p_type = pass_type.options[pass_type.selectedIndex].text;
      if (p_type == "Passing Constrained") pass_type = 0;
      else if (p_type == "Passing Zone") pass_type = 1;
      else if (p_type == "Passing Lane") pass_type = 2;
      var ver_cls = document.getElementById("vc_select"+(i+1));

      jsonData.segments.push(segments_dict);
      jsonData.segments[i].passing_type = pass_type;
      jsonData.segments[i]["length"] = parseFloat(inputParams.seg_length[i]);
      jsonData.segments[i]["grade"] = parseFloat(inputParams.seg_grade[i]);
      jsonData.segments[i]["spl"] = parseFloat(inputParams.seg_Spl[i]);
      jsonData.segments[i]["is_hc"] = inputParams.is_hc[i];
      jsonData.segments[i]["volume"] = inputParams.vi_input[i];
      jsonData.segments[i]["volume_op"] = inputParams.vo_input[i];
      jsonData.segments[i]["vertical_class"] = parseInt(inputParams.vc_select[i]);
      jsonData.segments[i]["phf"] = inputParams.phf[i];
      jsonData.segments[i]["phv"] = inputParams.phv[i];
      
      for (let j=0; j < subseg_num; j++) {
        const subsegments_dict = {
          "length": 0.0,
          "avg_speed": 0.0,
          "hor_class": 0,
          "design_rad": 0.0,
          "central_angle": 0.0,
          "sup_ele": 0.0
        }

        jsonData.segments[i]["subsegments"].push(subsegments_dict);
        jsonData.segments[i]["subsegments"][j]["length"] = parseFloat(document.getElementById("hc_table"+(i+1)).getElementsByClassName("subseg_len"+(j+1))[0].value);
        jsonData.segments[i]["subsegments"][j]["design_rad"] = parseFloat(document.getElementById("hc_table"+(i+1)).getElementsByClassName("design_radius"+(j+1))[0].value);
        jsonData.segments[i]["subsegments"][j]["central_angle"] = parseFloat(document.getElementById("hc_table"+(i+1)).getElementsByClassName("central_angle"+(j+1))[0].value);
        jsonData.segments[i]["subsegments"][j]["sup_ele"] = parseFloat(document.getElementById("hc_table"+(i+1)).getElementsByClassName("superelevation"+(j+1))[0].value);
      }

    }


    if (isTauri()) {
      try {
        const appDirectory = await appDataDir();
        const filePath = `${appDirectory}/hcm15_output.json`;

        await writeFile({
          path: filePath,
          contents: JSON.stringify(jsonData, null, 2)
        });

        console.log(`File saved successfully to ${filePath}`);
      } catch (error) {
        console.log('Error saving file:', error);
      }
    } else {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(jsonData));
      const jOut = document.getElementById('jsonOutput');
      jOut.setAttribute('href', dataStr);
      jOut.setAttribute('download', 'hcm15_output.json');

    }


  }

  function resetParams() {
    window.location.reload();
  }

</script>


<div id="hcm15-container">

  <h1 class="text-3xl font-bold underline">HCM Calulator Chap15</h1>

  <div role="tablist" class="m-3 text-sm font-medium text-center border-b text-gray-500 dark:text-gray-400 dark:border-gray-700">
    <ul class="flex flex-wrap -mb-px">
      <li class="me-2">
        <button role="tab" class="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300" class:active={activeTab == 'calculation'} on:click={() => setActiveTab('calculation')}>Calculation</button>
      </li>
      <li class="me-2">
        <button role="tab" class="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300" class:active={activeTab == 'results'} on:click={() => setActiveTab('results')}>Results</button>
      </li>
    </ul>
  </div>
  {#if activeTab == 'calculation'}

    <label>JSON Input</label> <input type="file" id="jsonInput" on:change={jsonInputHandler} accept=".json">
    <!-- {:else}
      {#if isSuccessVisible}	
        <p class="error-alert" transition:fade={{duration:150}}>Data updated successfully</p>
      {/if} -->

    {#if hasError == true}
      <p class="error-alert">{errMessage}</p>
    {/if}

    <form id="hcm15" class="mt-4" class:submitted on:submit|preventDefault={handleSubmit}>
      <div class="w-full overflow-x-auto">
        <table class="table w-full">
          <thead>
            <tr>
              <!-- <th>Active</th> -->
              <th>Segment</th>
              <th>Passing Type</th>
              <th>Length</th>
              <th>Grade</th>
              <th>Posted Speed Limit</th>
              <th>Horizontal Curves</th>
              <th>Horizontal Params</th>
              <th>Demand Volume</th>
              <th>Demand Volume (O)</th>
              <th>Vertical Class</th>
              <th>Peak Hour Factor</th>
              <th>Heavy Vehicle Per.</th>
            </tr>
          </thead>
          <tbody>
            {#each rows as row}
              <Row seg_num={row.seg_num} subseg_num={row.subrows.length} changeSegment={changeSegment} changeHC={changeHC} toggleHCParams={toggleHCParams} inputParams={inputParams}/>
            {/each}
          </tbody>
        </table>
      </div>
      <div class="grid auto-cols-max grid-flow-col md:grid-cols-2 sm:grid-cols-1 grid-cols-1">
        <div class="parameters flex justify-start overflow-x-auto">
          <table class="table w-full">
            <tbody>
              <tr>
                <td style="display: inline-block;">Lane Width (ft): </td>
                <td>
                  <input
                    type="text"
                    id="LW_input"
                    placeholder="Type here"
                    class="input-label input w-full max-w-xs"
                    bind:value={inputParams.lw}
                    pattern="[+]?([0-9]*([.][0-9]*)|[1-9]|[1-9][0-9])$"
                    autocomplete="off"
                    required
                  />
                </td>
              </tr>
              <tr>
                <td style="display: inline-block;">Shoulder Width (ft): </td>
                <td>
                  <input
                    type="text"
                    id="SW_input"
                    placeholder="Type here"
                    class="input-label input w-full max-w-xs"
                    bind:value={inputParams.sw}
                    pattern="[+]?([0-9]*([.][0-9]*)|[1-9]|[1-9][0-9])$"
                    autocomplete="off"
                    required
                  />
                </td>
              </tr>
              <tr>
                <td style="display: inline-block;">Access Point Density (access points/mi): </td>
                <td>
                  <input
                    type="text"
                    id="APD_input"
                    placeholder="Type here"
                    class="input-label input w-full max-w-xs"
                    bind:value={inputParams.apd}
                    pattern="[+]?([0-9]|[0-9]*([.][0-9]*)|[1-9]|[1-9][0-9])$"
                    autocomplete="off"
                    required
                  />
                </td>
              </tr>
              <tr>
                <td style="display: inline-block;">Percentage Multiplier for <br> Heavy Vehicles in the Faster / Passing Lane: <br>*Used only when Passing Lane included</td>
                <td>
                  <input
                    type="text"
                    id="PMHVFL_input"
                    bind:value={inputParams.pmhvfl}
                    placeholder="Type here"
                    class="input-label input w-full max-w-xs"
                    pattern="[+]?([0-9]|[0-9]*([.][0-9]*)|[1-9]|[1-9][0-9])$"
                    autocomplete="off"
                    required
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {#each rows as row}
        <div class="hc_table overflow-x-auto card card-compact w-full bg-base-100 shadow-xl" id="hc_table{row.seg_num}" style="display:none;">
          <div class="card-body">
          <table class="table table-compact">
            <thead>
              <caption class="flex justify-start"><b>Segment {row.seg_num}</b></caption>
              <tr>
                <th>Subsegment</th>
                <th>Length</th>
                <th>Design Radius</th>
                <th>Central Angle</th>
                <th>Superelevation</th>
              </tr>
            </thead>
            <tbody>
              {#each row.subrows as subrow}
                <SubRow subseg_num={subrow.subseg_num} inputSubParams={inputSubParams}/>
              {/each}
            </tbody>
            <div class="flex justify-end">
              <button class="btn btn-outline btn-sm" on:click={addSubSegment(row.seg_num)} type="button">Add</button>
              <button class="btn btn-outline btn-sm" on:click={removeSubSegment(row.seg_num)} type="button">Remove</button>
            </div>
        </div>
        </div>
        {/each}
      </div>
      <div class="overflow-x-auto">
        <table class="flex justify-start" id="seg_imgs">
          <tbody>
            <tr class="table_img">
              {#each rows as row}
                <td width={imgParams.td_width[row.seg_num-1]}><img src={imgParams.src[row.seg_num-1]} alt="segment" id="seg_img{row.seg_num}" height={imgParams.height[row.seg_num-1]} width={imgParams.width[row.seg_num-1]} /></td>
              {/each}
            </tr>
            <tr class="table_p">
              {#each rows as row}
                <td>{imgParams.cap[row.seg_num-1]}</td>
              {/each}
            </tr>
          </tbody>
        </table>
      </div>
      <div class="flex justify-end">
        <a class="btn" on:click={jsonOutputHandler} type="submit" id="jsonOutput" on:change={jsonOutputHandler}>Export as JSON</a>
        <button class="btn" on:click={resetParams} type="button">Reset Params</button>
        <Calc rows_len={rows.length} rows={rows} inputParams={inputParams} outputParams={outputParams}/>
        <button class="btn" on:click={addSegment} type="button">Add Segment</button>
        <button class="btn" on:click={removeSegment} type="button">Remove Segment</button>
      </div>
    </form>

    <!-- <canvas id="simulation-canvas"></canvas> -->
    <!-- <pre id="simulation-canvas"></pre> -->

    <div class="los overflow-x-auto">
      <h3>Outputs</h3>
      <table class="table w-full">
        <thead>
          <tr>
            <th></th>
            {#each rows as row}
              <th>Segment {row.seg_num}</th>
            {/each}
          </tr>
        </thead>

        <tbody>
          <tr>
            <th id="ffs">Free-flow Speed (mi/hr): </th>
            {#each rows as row}
              <td id="ffs{row.seg_num}">{outputParams.ffs[row.seg_num-1]}</td>
            {/each}
          </tr>
          <tr>
            <th id="avgspd">Average Speed (mi/hr): </th>
            {#each rows as row}
              <td id="avgspd{row.seg_num}">{outputParams.avgspd[row.seg_num-1]}</td>
            {/each}
          </tr>
          <tr>
            <th id="pf">Percent followers in the <br> analysis direction (%): </th>
            {#each rows as row}
              <td id="pf{row.seg_num}">{outputParams.pf[row.seg_num-1]}</td>
            {/each}
          </tr>
          <tr>
            <th id="fd">Followers Density (followers/mi): </th>
            {#each rows as row}
              <td id="fd{row.seg_num}">{outputParams.fd[row.seg_num-1]}</td>
            {/each}
          </tr>
          <tr>
            <th id="seglos">Segment LOS: </th>
            {#each rows as row}
              <td id="seglos{row.seg_num}">{outputParams.seglos[row.seg_num-1]}</td>
            {/each}
          </tr>
        </tbody>
      </table>
      <p id="los">Facility LOS: {outputParams.los}</p>
      <p id="fdF">Facility Follower Density: {outputParams.fdF}</p>
      <p id="error">Error Message: </p>
  </div>
  {:else if activeTab == 'results'}
  <div class="overflow-x-auto">
    <table class="flex justify-start table-fixed" id="seg_imgs">
      <tbody>
        <tr class="table_img">
          {#each rows as row}
            <td width={imgParams.td_width[row.seg_num-1]}><img src={imgParams.src[row.seg_num-1]} alt="segment" id="seg_img{row.seg_num}" height={imgParams.height[row.seg_num-1]} width={imgParams.width[row.seg_num-1]} /></td>
          {/each}
        </tr>
        <tr class="table_p">
          {#each rows as row}
            <td>{imgParams.cap[row.seg_num-1]}</td>
          {/each}
        </tr>
      </tbody>
    </table>
  </div>
  <div class="overflow-x-auto">
    <table class="table w-full">
      <thead>
        <tr>
          <th>Segment</th>
          <th>Passing Type</th>
          <th>Length</th>
          <th>Grade</th>
          <th>Posted Speed Limit</th>
          <th>Horizontal Curves</th>
          <th>Horizontal Params</th>
          <th>Demand Volume</th>
          <th>Demand Volume (O)</th>
          <th>Vertical Class</th>
          <th>Peak Hour Factor</th>
          <th>Heavy Vehicle Per.</th>
        </tr>
      </thead>
      <tbody>
        {#each rows as row, i}
        <tr>
            <th>{i+1}</th>
            <td>{inputParams.passing_type[i]}</td>
            <td>{inputParams.seg_length[i]}
              <label for="label">
              <span class="label-text-alt"></span>
              <span class="label-text-alt">mi</span>
            </td>
            <td>{inputParams.seg_grade[i]}
              <label for="label">
              <span class="label-text-alt"></span>
              <span class="label-text-alt">%</span>
            </td>
            <td>{inputParams.seg_Spl[i]}
              <label for="label">
              <span class="label-text-alt"></span>
              <span class="label-text-alt">mi</span>
            </td>
            <td>{inputParams.is_hc[i]}</td>
            <td>
                <!-- Lookup table -->
                <label>
                    <input type="checkbox" class="toggle hc_param" id="hc_param{row.seg_num}" name="hc_param" on:change={toggleHCParams(row.seg_num)}/>
                </label>
            </td>
            <td>{inputParams.vi_input[i]}
              <label for="label">
              <span class="label-text-alt"></span>
              <span class="label-text-alt">veh/hr</span>
            </td>
            <td>{inputParams.vo_input[i]}
              <label for="label">
              <span class="label-text-alt"></span>
              <span class="label-text-alt">veh/hr</span>
            </td>
            <td>{inputParams.vc_select[i]}</td>
            <td>{inputParams.phf[i]}</td>
            <td>{inputParams.phv[i]}
              <label for="label">
              <span class="label-text-alt"></span>
              <span class="label-text-alt">%</span>
            </td>
        </tr>
        {/each}
      </tbody>

          <!-- <td>

            <p>{inputParams.pmhvfl}</p>
          </td> -->
    </table>
    {#each rows as row}
    <div class="hc_table overflow-x-auto card card-compact w-full bg-base-100 shadow-xl" id="hc_table{row.seg_num}" style="display:none;">
      <div class="card-body">
      <table class="table table-compact">
        <thead>
          <caption class="flex justify-start"><b>Segment {row.seg_num}</b></caption>
          <tr>
            <th>Subsegment</th>
            <th>Length</th>
            <th>Design Radius</th>
            <th>Central Angle</th>
            <th>Superelevation</th>
          </tr>
        </thead>
        <tbody>
          {#each row.subrows as subrow}
            <SubRow subseg_num={subrow.subseg_num} inputSubParams={inputSubParams}/>
          {/each}
        </tbody>
        <div class="flex justify-end">
          <button class="btn btn-outline btn-sm" on:click={addSubSegment(row.seg_num)} type="button">Add</button>
          <button class="btn btn-outline btn-sm" on:click={removeSubSegment(row.seg_num)} type="button">Remove</button>
        </div>
      </div>
    </div>
    {/each}
  </div>
    <div class="los overflow-x-auto">
      <h3>Outputs</h3>
      <table class="table w-full">
        <thead>
          <tr>
            <th></th>
            {#each rows as row}
              <th>Segment {row.seg_num}</th>
            {/each}
          </tr>
        </thead>

        <tbody>
          <tr>
            <th id="ffs">Free-flow Speed (mi/hr): </th>
            {#each rows as row}
              <td id="ffs{row.seg_num}">{outputParams.ffs[row.seg_num-1]}</td>
            {/each}
          </tr>
          <tr>
            <th id="avgspd">Average Speed (mi/hr): </th>
            {#each rows as row}
              <td id="avgspd{row.seg_num}">{outputParams.avgspd[row.seg_num-1]}</td>
            {/each}
          </tr>
          <tr>
            <th id="pf">Percent followers in the <br> analysis direction (%): </th>
            {#each rows as row}
              <td id="pf{row.seg_num}">{outputParams.pf[row.seg_num-1]}</td>
            {/each}
          </tr>
          <tr>
            <th id="fd">Followers Density (followers/mi): </th>
            {#each rows as row}
              <td id="fd{row.seg_num}">{outputParams.fd[row.seg_num-1]}</td>
            {/each}
          </tr>
          <tr>
            <th id="seglos">Segment LOS: </th>
            {#each rows as row}
              <td id="seglos{row.seg_num}">{outputParams.seglos[row.seg_num-1]}</td>
            {/each}
          </tr>
        </tbody>
      </table>
      <p id="los">Facility LOS: {outputParams.los}</p>
      <p id="fdF">Facility Follower Density: {outputParams.fdF}</p>
      <p id="error">Error Message: </p>
  </div>
  <div class="flex justify-end">
    <!-- <button class="btn" on:click={startSimulation} type="button">Export as PDF</button> -->
    <button class="btn" on:click={startSimulation} type="button">Launch SUMO</button>
  </div>
  {/if}

</div>