<script>
//   throw new Error("@migration task: Add data prop (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292707)");

  export let seg_num;
  export let subseg_num;
  export let inputSubParams;
//   export let data;
//   let subseg_num = data;
</script>

<tr class={subseg_num}>
    <th>
        <p>{subseg_num}</p> <!-- Increment -->
    </th>
    <td>
        <input 
            type="text" 
            placeholder="Type here" 
            id="subseg_len{subseg_num}"
            name="subseg_len"
            class="subseg_len{subseg_num} input input-label w-2/3 max-w-xs" 
            pattern="[+]?([0-9]*([.][0-9]*)|[1-9]|[1-9][0-9]|[1-9][0-9][0-9]|[1-9][0-9][0-9][0-9])$"
            bind:value={inputSubParams.subseg_length[seg_num-1][subseg_num-1]}
            autocomplete="off" />
        <label for="subseg_len">
            <span class="label-text-alt"></span>
            <span class="label-text-alt">ft.</span>
        </label>
    </td>
    <td>
        <input 
            type="text" 
            placeholder="Type here" 
            id="design_radius{subseg_num}"
            class="design_radius{subseg_num} input input-label w-2/3 max-w-xs" 
            pattern="[+]?([0-9]*([.][0-9]*)|[0-9]|[1-9][0-9]|[1-9][0-9][0-9]|[1-9][0-9][0-9][0-9])$"
            bind:value={inputSubParams.design_radius[seg_num-1][subseg_num-1]}
            autocomplete="off" />
        <label for="design_radius">
            <span class="label-text-alt"></span>
            <span class="label-text-alt">ft.</span>
        </label>
    </td>
    <td>
        <input 
            type="text" 
            placeholder="Type here" 
            id="central_angle{subseg_num}"
            class="central_angle{subseg_num} input input-label w-2/3 max-w-xs" 
            pattern="[+]?([0-9]*([.][0-9]*)|[0-9]|[1-9][0-9]|[1-9][0-9][0-9]|[1-9][0-9][0-9][0-9])$"
            bind:value={inputSubParams.central_angle[seg_num-1][subseg_num-1]}
            autocomplete="off" />
        <label for="central_angle">
            <span class="label-text-alt"></span>
            <span class="label-text-alt">ft.</span>
        </label>
    </td>
    <td>
        <input 
            type="text" 
            placeholder="Type here" 
            id="superelevation{subseg_num}"
            class="superelevation{subseg_num} input input-label w-2/3 max-w-xs" 
            pattern="[+\-]?([0-9]*([.][0-9]*)|[0-9]|[1-9][0-9])$"
            bind:value={inputSubParams.superelevation[seg_num-1][subseg_num-1]}
            autocomplete="off" />
        <label for="superelevation">
            <span class="label-text-alt"></span>
            <span class="label-text-alt">%</span>
        </label>
    </td>
</tr>
