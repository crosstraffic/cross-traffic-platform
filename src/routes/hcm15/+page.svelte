<script type="text/javascript">
  import Row from '../Row/+page.svelte';
  import SubRow from '../SubRow/+page.svelte';
  import Calc from '../Calc/+page.svelte';
  import init, { WasmSegment, WasmSubSegment, WasmTwoLaneHighways } from "HCM-middleware";
  import { onMount } from "svelte";
  import { Command } from "@tauri-apps/api/shell";

  onMount(async() => {
    await init(); // init initializes memory addresses needed by WASM and that will be used by JS/TS
  });


  let count = 0;
  let columns = [
    'Active',
    'Segment',
    'Passing Type',
    'Length',
    'Grade',
    'Horizontal Curves',
    'HC Params',
    'Demand Volums',
    'Demand Volumns (O)',
    'Vertical Class',
  ];



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
    let sup_ele = new Array(rows.length);
    let speed = new Array(rows.length);
    let lane_width = new Array(rows.length);
    let num_lanes = new Array(rows.length);
    let Vi = new Array(rows.length);
    let Vo = new Array(rows.length);
    let phf = new Array(rows.length);
    let fdensity = new Array(rows.length);
    let bdensity = new Array(rows.length);
    let phv = new Array(rows.length);

    for (var i=0; i < rows.length; i++){
        rad[i] = new Array(rows[i].subrows.length+1);
        sup_ele[i] = new Array(rows[i].subrows.length+1);
    }

    for (let i=0; i<rows.length; i++) {

      // TODO: Return error if something missing
      let pass_type = document.getElementById('passing_type'+(i+1));
      let pt = pass_type.options[pass_type.selectedIndex].text;
      seg_x[i] = document.getElementById('seg_length'+(i+1)).value;
      seg_y[i] = 0.0;
      if (pt == 'Passing Lane')
        num_lanes[i] = 2;
      else
        num_lanes[i] = 1;
      speed[i] = document.getElementById('seg_Spl'+(i+1)).value;
      lane_width = document.getElementById('LW_input').value;
      Vi[i] = document.getElementById('vi_input'+(i+1)).value;
      Vo[i] = document.getElementById('vo_input'+(i+1)).value;
      phf[i] = document.getElementById('PHF_input'+(i+1)).value;
      fdensity[i] = Vi[i] / (speed[i] * 3.6)
      bdensity[i] = Vo[i] / (speed[i] * 3.6)
      phv[i] = document.getElementById('PHV_input'+(i+1)).value;

    }

    // Each argument must be states in one line and split with column.
    // - subsegment_num should be differed depending on the segment
    const set_command_list = [
      '--root_dir',
      "../sim-coordination/sumo",
      '--segment_num',
      rows.length.toString(),
      '--subsegment_num',
      rows[0].subrows.length.toString(),
      // '--seg_y',
      // seg_y_args.toString(),
      // // // '--rad ' + rad,
      // // // '--sup_ele ' + sup_ele,
      '--lane_width',
      lane_width.toString(),
      '--seg_x',
    ]
    // Add segment x
    for (let i=0; i<seg_x.length;i++) {
      set_command_list.push(seg_x[i].toString());
    }

    // Add segment y
    set_command_list.push('--seg_y');
    for (let i=0; i<rows.length;i++) {
      set_command_list.push(seg_y[i].toString());
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
    for (let i=0; i<rows.length; i++) {
      set_command_list.push(phv[i].toString());
    }


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

    if (rows.length == 1) {
      trip_command_list.push('--allow-fringe');
    }

    // for (let i=0; i<Vi.length;i++) {
      
    //   trip_command_list.push(Vi[i].toString());
    // }

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

    // also add image and caption
    var table = document.getElementById('seg_imgs');
    var img_row = table.rows[0];
    var cap_row = table.rows[1];

    var img = document.createElement('img');
    img.src = 'segment.jpg';
    img.height = 100;
    img.width = 100;
    img.setAttribute('id', 'seg_img' + rows.length);

    if (document.getElementById('passing_type' + rows.length) != null) {
      var cap = document.getElementById('passing_type' + rows.length).value;
    }

    // document.getElementById("seg_imgs").appendChild(img);
    img_row.insertCell(-1).appendChild(img);
    cap_row.insertCell(-1).innerHTML = cap;
  }

  function removeSegment() {
    var table = document.getElementById('seg_imgs');
    var img = document.getElementById('seg_img' + rows.length);
    var img_row = table.rows[0];
    var cap_row = table.rows[1];

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
    var table = document.getElementById('seg_imgs');
    var img_cap_row = table.rows[1];
    var img_cap = 'undefined';
    var img = document.getElementById('seg_img' + seg_num);

    // console.log(values.vd);
    var Vi = document.getElementById('vi_input' + seg_num);
    var Vo = document.getElementById('vo_input' + seg_num);
    var PT = document.getElementById('passing_type' + seg_num).value;

    // if (document.getElementById('passing_type' + seg_num) != null) {
    //   cap = document.getElementById('passing_type' + seg_num).value;
    //   console.log(cap);
    // }


    if (PT == 'Passing Zone') {
      Vi.value = '1000';
      Vo.value = '0';
      img.src = 'PassingZone.png';
      img.height = 100;
      img.width = 100;
      img.parentNode.width = 100;
      img_cap = 'Passing Zone';
    } else if (PT == 'Passing Constrained') {
      img.src = 'PassingConstrained.png';
      Vi.value = '1000';
      Vo.value = '1500';
      img.height = 100;
      img.width = 100;
      img.parentNode.width = 100;
      img_cap = 'Passing Constrained';
    } else if (PT == 'Passing Lane') {
      img.src = 'PassingLane.png';
      Vi.value = '1000';
      Vo.value = '0';
      img.height = 100;
      img.width = 150;
      img.parentNode.width = 150;
      img_cap = "Passing Lane";
    }

    img_cap_row.cells[seg_num - 1].innerHTML = img_cap;
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
    var is_hc = document.getElementById("is_hc" + (seg_num));
    var toggler = document.getElementById("hc_param" + (seg_num));
    var hc_table = document.getElementById("hc_table" + (seg_num));

    var subdesign_radius = document.getElementsByClassName("design_radius" + (subseg_num));

    // Only shows one sub table
    if (is_hc.checked){
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
    if (!is_hc.checked){
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
    document.getElementById('LW_input').value = lw;
    document.getElementById('SW_input').value = sw;
    document.getElementById('APD_input').value = apd;
    document.getElementById('PMHVFL_input').value = pmhvfl;

    // Segments
    for (let i=0; i<json.segments.length; i++) {
      if (i != 0) {
        addSegment();
      }
      setTimeout(function() {
        const pass_type = document.getElementById('passing_type'+(i+1))
        pass_type.options.item(json.segments[i].passing_type+1).selected = true;
        // Fire segment change
        changeSegment(i+1);
        document.getElementById('seg_length'+(i+1)).value = json.segments[i].length;
        document.getElementById('seg_grade'+(i+1)).value = json.segments[i].grade;
        document.getElementById('seg_Spl'+(i+1)).value = json.segments[i].spl;
        document.getElementById('is_hc'+(i+1)).checked = json.segments[i].is_hc;
        // document.getElementById('hc_param'+(i+1)).checked = json.segments[i].is_hc;
        document.getElementById('vi_input'+(i+1)).value = json.segments[i].volume;
        document.getElementById('vo_input'+(i+1)).value = json.segments[i].volume_op;
        document.getElementById('vc_select'+(i+1)).options.item(json.segments[i].vertical_class-1).selected = true;
        document.getElementById('PHF_input'+(i+1)).value = json.segments[i].phf;
        document.getElementById('PHV_input'+(i+1)).value = json.segments[i].phv;


        var hc_table = document.getElementById("hc_table"+(i+1));
        hc_table.style.display = 'none';
        toggle_seg = -1;

        // if (json.segments[i].is_hc) toggleHCParams(i+1);

        // SubSegments
        for (let j=0; j<json.segments[i].subsegments.length; j++) {
          if (j != 0) addSubSegment(i+1); 
          setTimeout(function() {
            document.getElementById("hc_table"+(i+1)).getElementsByClassName("subseg_len"+(j+1))[0].value = json.segments[i].subsegments[j].length;
            document.getElementById("hc_table"+(i+1)).getElementsByClassName("design_radius"+(j+1))[0].value = json.segments[i].subsegments[j].design_rad;
            document.getElementById("hc_table"+(i+1)).getElementsByClassName("superelevation"+(j+1))[0].value = json.segments[i].subsegments[j].sup_ele;
          }, 10);
        }
      }, 10);
    }

  }

  function jsonOutputHandler() {

    const jsonData = { "segments": [],
                      "lane_width": 0.0,
                      "shoulder_width": 0.0,
                      "apd": 0.0,
                      "pmhvfl": 0.0,
                      "l_de": 0.0
                    };
    jsonData["lane_width"] = document.getElementById('LW_input').value;
    jsonData["shoulder_width"] = document.getElementById('SW_input').value;
    jsonData["apd"] = document.getElementById('APD_input').value;
    jsonData["pmhvfl"] = document.getElementById('PMHVFL_input').value;

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
      jsonData.segments[i]["length"] = document.getElementById('seg_length'+(i+1)).value;
      jsonData.segments[i]["grade"] = document.getElementById('seg_grade'+(i+1)).value;
      jsonData.segments[i]["spl"] = document.getElementById('seg_Spl'+(i+1)).value;
      jsonData.segments[i]["is_hc"] = document.getElementById('is_hc'+(i+1)).checked;
      jsonData.segments[i]["volume"] = document.getElementById('vi_input'+(i+1)).value;
      jsonData.segments[i]["volume_op"] = document.getElementById('vo_input'+(i+1)).value;
      jsonData.segments[i]["vertical_class"] = ver_cls.options[ver_cls.selectedIndex].text;
      jsonData.segments[i]["phf"] = document.getElementById('PHF_input'+(i+1)).value;
      jsonData.segments[i]["phv"] = document.getElementById('PHV_input'+(i+1)).value;
      
      console.log(subseg_num);
      for (let j=0; j < subseg_num; j++) {
        const subsegments_dict = {
          "length": 0.0,
          "avg_speed": 0.0,
          "hor_class": 0,
          "design_rad": 0.0,
          "sup_ele": 0.0
        }

        jsonData.segments[i]["subsegments"].push(subsegments_dict);
        jsonData.segments[i]["subsegments"][j]["length"] = document.getElementById("hc_table"+(i+1)).getElementsByClassName("subseg_len"+(j+1))[0].value;
        jsonData.segments[i]["subsegments"][j]["design_rad"] = document.getElementById("hc_table"+(i+1)).getElementsByClassName("design_radius"+(j+1))[0].value;
        jsonData.segments[i]["subsegments"][j]["sup_ele"] = document.getElementById("hc_table"+(i+1)).getElementsByClassName("superelevation"+(j+1))[0].value;
      }

    }

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(jsonData));
    const jOut = document.getElementById('jsonOutput');
    jOut.setAttribute('href', dataStr);
    jOut.setAttribute('download', 'hcm15_output.json');
  }

  function resetParams() {
    window.location.reload();
  }

</script>


<div id="hcm15-container">

  <h1 class="text-3xl font-bold underline">HCM Calulator Chap15</h1>

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
          <Row seg_num={row.seg_num} subseg_num={row.subrows.length} changeSegment={changeSegment} changeHC={changeHC} toggleHCParams={toggleHCParams} />
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
                value="12"
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
                value="6"
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
                value="2"
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
                placeholder="Type here"
                class="input-label input w-full max-w-xs"
                value="0"
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
            <th>Superelevation</th>
          </tr>
        </thead>
        <tbody>
          {#each row.subrows as subrow}
            <SubRow subseg_num={subrow.subseg_num}/>
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
        <tr class="table_img"><td><img src="segment.jpg" alt="segment" id="seg_img1" height="100" width="100" /></td></tr>
        <tr class="table_p"><td>undefined</td></tr>
      </tbody>
    </table>
  </div>
  <div class="flex justify-end">
    <button class="btn" on:click={startSimulation} type="button">Launch SUMO</button>
    <a class="btn" on:click={jsonOutputHandler} type="submit" id="jsonOutput" on:change={jsonOutputHandler}>Export as JSON</a>
    <button class="btn" on:click={resetParams} type="button">Reset Params</button>
    <Calc rows_len={rows.length} rows={rows}/>
    <button class="btn" on:click={addSegment} type="button">Add Segment</button>
    <button class="btn" on:click={removeSegment} type="button">Remove Segment</button>
  </div>
  </form>

  <!-- <canvas id="simulation-canvas"></canvas> -->
  <pre id="simulation-canvas"></pre>

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
            <td id="ffs{row.seg_num}"></td>
          {/each}
        </tr>
        <tr>
          <th id="avgspd">Average Speed (mi/hr): </th>
          {#each rows as row}
            <td id="avgspd{row.seg_num}"></td>
          {/each}
        </tr>
        <tr>
          <th id="pf">Percent followers in the <br> analysis direction (%): </th>
          {#each rows as row}
            <td id="pf{row.seg_num}"></td>
          {/each}
        </tr>
        <tr>
          <th id="fd">Followers Density (followers/mi): </th>
          {#each rows as row}
            <td id="fd{row.seg_num}"></td>
          {/each}
        </tr>
        <tr>
          <th id="seglos">Segment LOS: </th>
          {#each rows as row}
            <td id="seglos{row.seg_num}"></td>
          {/each}
        </tr>
      </tbody>
    </table>
    <p id="los">Facility LOS: </p>
    <p id="fdF">Facility Follower Density: </p>
    <p id="error">Error Message: </p>
  </div>

</div>