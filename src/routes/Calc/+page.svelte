<script type="text/javascript">
  import init, { WasmSegment, WasmSubSegment, WasmTwoLaneHighways } from "HCM-middleware";
  import Error from "../+error.svelte";

    // Export variables
    export let rows_len;
    export let rows;
    export let outputParams;
    export let inputParams;
    // export let data;
    // let { rows_len, rows } = data;

    function callingFunc(){
        calculate(rows_len, rows);
    }

    // Main calculation function
    function calculate(rows_len, rows){

        // Initial input variable settings
        var passing_type = [];
        var vc = 0; // Vertical class
        var rad = [];
        var central_angle = [];
        var sup_ele = [];
        var is_hc = true;
        var Vi = 0;
        var Vo = 0;
        var PHF = 0;
        var PHV = 0;
        var Spl = 0;
        var seg_length = 0;
        var seg_grade = 0;
        var LW = 0;
        var SW = 0;
        var APD = 0;
        var PMHVFL = 0; // percentage multiplier for heavy vehicles in the faster / passing lane

        // Initial variable settings
        var pass_min = 0;
        var pass_max = 0;
        var vd = 0;
        var demandFlow_v = [];
        var demandFlow_o = 0;
        var capacity = 0;
        var cap = [];
        var ver_cls = 0; // After step 3
        var ver_class = 0; // User input
        var ffs = 0;
        var sub_s = 0;
        var hc = 0; // Horizontal class --> It changes to parameter selection
        var seg_len = [];
        var avg_S = 0;
        var fd = [];
        var pf = []; // percent followers
        var PL_idx = []; // store passing lane's location
        var FDadj = [];
        var calc_fd = [];
        var fdF_num = 0;
        var segLOS = [];
        var LOS = '';
        var out = '';
        var tot_len = 0;
        var LPL = 0; // length of passing lane
        var cnt = 0; // to avoid undefined element in the array

        // 1D array
        var sub_S = new Array(rows_len); // subsegment speed // --> Causes problem
        var HC = new Array(rows_len); // horizontal class list
        var subSeg_len = new Array(rows_len);
        var subseg = new Array(rows_len); // subsegment length for store values, thus tangent is counted as one subsegment
        var tot_sublen = new Array(rows_len);

        // 2D array
        for (var i=0; i < sub_S.length; i++){
            sub_S[i] = new Array(rows[i].subrows.length+1);
            HC[i] = new Array(rows[i].subrows.length+1);
            subSeg_len[i] = new Array(rows[i].subrows.length+1);
            subseg[i] = new Array(rows[i].subrows.length+1); 
        }

        // Fixed values for the entire segments
        // Spl = document.getElementById("Spl_input").value;
        LW = document.getElementById("LW_input").value;
        SW = document.getElementById("SW_input").value;
        APD = document.getElementById("APD_input").value;
        PMHVFL = document.getElementById("PMHVFL_input").value;

        // Error variables
        var error_str = "";
        var error_flg = 0;

        for(let i=0; i < rows_len; i++){
            tot_len += parseFloat(document.getElementById("seg_length"+(i+1)).value);
        }
        
        var wasmSegment = [];

        // Initialization
        for(let i=0; i < rows_len; i++) {
            var subrows_len = rows[i].subrows.length;
            // var pass_type = document.getElementById("passing_type"+(i+1));
            var pass_type = inputParams.passing_type[i];
            // pass_type = pass_type.options[pass_type.selectedIndex].text;
            if (pass_type == "Passing Constrained") passing_type[i] = 0;
            else if (pass_type == "Passing Zone") passing_type[i] = 1;
            else if (pass_type == "Passing Lane") passing_type[i] = 2;

            Spl = inputParams.seg_Spl[i];
            is_hc = inputParams.is_hc[i];
            Vi = inputParams.vi_input[i];
            Vo = inputParams.vo_input[i];
            seg_length = inputParams.seg_length[i];
            seg_grade = inputParams.seg_grade[i];
            PHF = inputParams.phf[i];
            PHV = inputParams.phv[i];
            ver_class = inputParams.vc_select[i];

            // Spl = document.getElementById("seg_Spl"+(i+1)).value;
            // vc = document.getElementById("vc_select"+(i+1)).value;
            // is_hc = document.getElementById("is_hc"+(i+1)).checked;
            // Vi = document.getElementById("vi_input"+(i+1)).value;
            // Vo = document.getElementById("vo_input"+(i+1)).value;
            // seg_length = document.getElementById("seg_length"+(i+1)).value;
            // seg_grade = document.getElementById("seg_grade"+(i+1)).value;
            // PHF = document.getElementById("PHF_input"+(i+1)).value;
            // PHV = document.getElementById("PHV_input"+(i+1)).value;
            // ver_class = document.getElementById("vc_select"+(i+1)).value;

            var wasmSubSegment = [];
            wasmSubSegment[0] = new WasmSubSegment(0.0, 0.0, 0, 0.0, 0.0, 0.0);

            if (is_hc == true && subrows_len > 0){
                for (let j=0; j < subrows_len; j++){
                    subSeg_len[i][j] = document.getElementById("hc_table"+(i+1)).getElementsByClassName("subseg_len"+(j+1))[0].value; // foot to mile
                    rad[j] = document.getElementById("hc_table"+(i+1)).getElementsByClassName("design_radius"+(j+1))[0].value;
                    central_angle[j] = document.getElementById("hc_table"+(i+1)).getElementsByClassName("central_angle"+(j+1))[0].value;
                    sup_ele[j] = document.getElementById("hc_table"+(i+1)).getElementsByClassName("superelevation"+(j+1))[0].value;
                    wasmSubSegment[j] = new WasmSubSegment(subSeg_len[i][j], 0.0, 0, rad[j], central_angle[j], sup_ele[j]);
                }
            }

            const inst_wasmSegment = new WasmSegment(parseInt(passing_type[i]), seg_length, seg_grade, Spl, is_hc, Vi, Vo, 0.0, 0.0, 0, 0.0,
                          0.0, ver_class, wasmSubSegment, PHF, PHV, 0.0, 0.0, 0.0, 0);
            wasmSegment.push(inst_wasmSegment);

            seg_len[i] = seg_length;
        }

        var wasmTwoLaneHighways = new WasmTwoLaneHighways(wasmSegment, LW, SW, APD, PMHVFL, 0.0);
        

        var fd_f = 0;
        var tot_len = 0;
        var s_tot = 0;
        var fd = 0;
        var fd_mid = 0;
        var fd_adj = 0;
        var fd_out = 0;
        for (let i=0; i < rows_len; i++) {
            [pass_min, pass_max] = wasmTwoLaneHighways.identify_vertical_class(i);
            [vd, demandFlow_o, capacity] = wasmTwoLaneHighways.determine_demand_flow(i);
            ver_cls = wasmTwoLaneHighways.determine_vertical_alignment(i);
            ffs = wasmTwoLaneHighways.determine_free_flow_speed(i);
            var [s, hor_class] = wasmTwoLaneHighways.estimate_average_speed(i);
            pf[i] = wasmTwoLaneHighways.estimate_percent_followers(i);

            if (wasmTwoLaneHighways.get_segments()[i].passing_type == 2) {
                [fd, fd_mid] = wasmTwoLaneHighways.determine_follower_density_pl(i);
                fd_out = fd_mid;
            } else {
                fd = wasmTwoLaneHighways.determine_follower_density_pc_pz(i);
                // If the segment is within the effective length of PL section
            }
            if (wasmTwoLaneHighways.get_segments()[i].passing_type == 2) {
                fd_adj = wasmTwoLaneHighways.determine_adjustment_to_follower_density(i);
                fd_out = fd_adj;
            } else if (wasmTwoLaneHighways.get_segments()[i].passing_type != 2) {
                if (fd_adj > 0.0) {
                    fd_out = fd_adj;
                } else {
                    fd_out = fd;
                }
            }
            fd_f += fd_out * wasmTwoLaneHighways.get_segments()[i].length;
            tot_len += wasmTwoLaneHighways.get_segments()[i].length;
            s_tot += s * wasmTwoLaneHighways.get_segments()[i].length;
            let los = wasmTwoLaneHighways.determine_segment_los(i, s, capacity);

            // console.log(wasmTwoLaneHighways.get_segments()[i].subsegments);

            outputParams.ffs[i] = Math.round(ffs*1000)/1000;
            outputParams.pf[i] = Math.round(pf[i]*1000)/1000;
            outputParams.avgspd[i] = Math.round(s*1000) / 1000;
            outputParams.fd[i] = Math.round(fd_out*1000) / 1000;
            outputParams.seglos[i] = los;
            document.getElementById("ffs" + (i+1)).innerHTML = "" + Math.round(ffs*1000)/1000;
            document.getElementById("pf" + (i+1)).innerHTML = "" + Math.round(pf[i]*1000)/1000;
            document.getElementById("avgspd" + (i+1)).innerHTML = "" + Math.round(s*1000) / 1000;
            document.getElementById("fd" + (i+1)).innerHTML = "" + Math.round(fd_out*1000) / 1000;
            document.getElementById("seglos" + (i+1)).innerHTML = "" + los;
        }
        fd_f = fd_f / tot_len;

        let average_speed = s_tot / tot_len;
        let fac_los = wasmTwoLaneHighways.determine_facility_los(fd_f, average_speed);

        // Output (LOS)
        document.getElementById("los").innerHTML = "Entire LOS: " + fac_los;
        outputParams.los = fac_los;
        // Facility Follower Density
        document.getElementById("fdF").innerHTML = "Facility Follower Density: " + Math.round(fd_f*1000)/1000;
        outputParams.fdF = Math.round(fd_f*1000)/1000;
        // Error
        document.getElementById("error").innerHTML = "Error message: " + out;

    }

</script>

<button type="submit" class="btn" on:click={() => callingFunc()}>Calculate</button>
 <!-- on:click={() => submitted = true} -->