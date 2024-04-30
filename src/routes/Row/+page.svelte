<script>
    // throw new Error("@migration task: Add data prop (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292707)");

    export let seg_num;
    export let subseg_num;
    export let changeSegment;
    export let changeHC;
    export let toggleHCParams;

    // export let data;
    // let { seg_num, subseg_num, changeSegment, changeHC, toggleHCParams } = data;

    // const schema = yup.object().shape({
    //     pass_type: yup.string().required("Passing Type is required")
    // });

    // let errors = {};

    // export const handleSubmit = async () => {
    //     console.log("called");
    //     try {
    //         await schema.validate(values, { abortEarly: false });
    //         alert(JSON.stringify(values, null, 2));
    //         errors = {};
    //     } catch (err) {
    //         errors = err.inner.reduce((acc, err) => {
    //             return { ...acc, [err.path]: err.message };
    //     }, {});
    //     }
    // };
</script>
<tr class="subseg{seg_num}">
    <!-- <th>
        <label>
        <input type="checkbox" class="checkbox" id="active{seg_num}" name="active" bind:value={values.active} checked />
        </label>
    </th> -->
    <td>
        <p>{seg_num}</p> <!-- Increment -->
    </td>
    <td>
        <select class="select w-full max-w-xs passing_type" id="passing_type{seg_num}" name="pass_type" on:change={changeSegment(seg_num)} required>
        <!-- <select class="select w-full max-w-xs" id="passing_type{seg_num}" name="pass_type" bind:value={values.pass_type} on:change={changeSegment(seg_num)} required> -->
            <option value="" disabled selected>TYPE</option>
            <option>Passing Constrained</option>
            <option>Passing Zone</option>
            <option>Passing Lane</option>
        </select>
    </td>
    <td>
        <!-- <input type="text" id="seg_length{seg_num}" name="seg_len" bind:value={values.seg_len} placeholder="Type here" class="input input-label w-full max-w-xs" required/> -->
        <input 
            type="text" 
            id="seg_length{seg_num}" 
            name="seg_len" 
            placeholder="Type here" 
            class="input input-label w-full max-w-xs seg_length" 
            pattern="[+]?([0-9]|[0-9]*([.][0-9][0-9]*)|[1-9]|[1-9][0-9])$"
            autocomplete="off"
            required/>
        <label for="label">
        <span class="label-text-alt"></span>
        <span class="label-text-alt">mi.</span>
        </label>
    </td>
    <td>
        <!-- <input type="text" id="seg_grade{seg_num}" name="grade" bind:value={values.grade} placeholder="Type here" class="input input-label w-full max-w-xs" required/> -->
        <input 
            type="text"
            id="seg_grade{seg_num}" 
            name="grade" 
            placeholder="Type here" 
            class="input input-label w-full max-w-xs seg_grade" 
            pattern="[+\-]?([0-9]|[0-9]*([.][0-9]*)|[1-9]|[1-9][0-9])$"
            autocomplete="off" 
            required/>
        <label for="label">
        <span class="label-text-alt"></span>
        <span class="label-text-alt">%</span>
        </label>
    </td>
    <td>
        <!-- <input type="text" id="seg_grade{seg_num}" name="grade" bind:value={values.grade} placeholder="Type here" class="input input-label w-full max-w-xs" required/> -->
        <input 
            type="text"
            id="seg_Spl{seg_num}" 
            name="posted speed" 
            placeholder="Type here" 
            class="input input-label w-full max-w-xs seg_spl" 
            pattern="[+]?([1-9]|[1-9][0-9]|[1-9][0-9][0-9])$"
            autocomplete="off" 
            required/>
        <label for="label">
        <span class="label-text-alt"></span>
        <span class="label-text-alt">mph.</span>
        </label>
    </td>
    <td>
        <label>
        <!-- <input type="checkbox" class="checkbox" id="is_hc{seg_num}" name="hor_cur" bind:value={values.hor_cur} on:change={changeHC(seg_num)}/> -->
        <input type="checkbox" class="checkbox is_hc" id="is_hc{seg_num}" name="hor_cur" on:change={changeHC(seg_num, subseg_num)}/>
        </label>
    </td>
    <td>
        <!-- Lookup table -->
        <label>
            <!-- <input type="checkbox" class="toggle" id="hc_param{seg_num}" name="hc_param" bind:value={values.hc_param} on:change={toggleHCParams(seg_num)}/> -->
            <input type="checkbox" class="toggle hc_param" id="hc_param{seg_num}" name="hc_param" on:change={toggleHCParams(seg_num)}/>
        </label>
    </td>
    <td>
        <!-- <input type="text" id="vi_input{seg_num}" name="vd" bind:value={values.vd} placeholder="Type here" class="input input-label w-full max-w-xs" required/> -->
        <input
            type="text"
            id="vi_input{seg_num}"
            name="vd"
            placeholder="Type here"
            class="input input-label w-full max-w-xs vi_input" 
            pattern="[+]?([0-9]*|[1-9][0-9]|[1-9][0-9][0-9]|[1-9][0-9][0-9][0-9])$"
            autocomplete="off" 
            required/>
        <label for="label">
        <span class="label-text-alt"></span>
        <span class="label-text-alt">veh/hr</span>
        </label>
    </td>
    <td>
        <!-- <input type="text" id="vo_input{seg_num}" name="vo" bind:value={values.vo} placeholder="Type here" class="input input-label w-full max-w-xs" required/> -->
        <input 
            type="text" 
            id="vo_input{seg_num}" 
            name="vo" 
            placeholder="Type here" 
            class="input input-label w-full max-w-xs vo_input" 
            pattern="[+]?([0-9]*|[1-9][0-9]|[1-9][0-9][0-9]|[1-9][0-9][0-9][0-9])$"
            autocomplete="off" 
            required/>
        <label for="label">
        <span class="label-text-alt"></span>
        <span class="label-text-alt">veh/hr</span>
        </label>
    </td>
    <td>
        <!-- <select class="select w-full max-w-xs" id="vc_select{seg_num}" name="ver_cls" bind:value={values.ver_cls} required> -->
        <select class="select w-full max-w-xs" id="vc_select{seg_num}" name="ver_cls" required>
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
        </select>
    </td>
    <td>
        <input
            type="text"
            id="PHF_input{seg_num}"
            placeholder="Type here"
            class="input-label input w-full max-w-xs PHF_input"
            value="0.95"
            pattern="[+]?([0-9]*([.][0-9]*))$"
            autocomplete="off"
            required
        />
    </td>
    <td>
        <input
            type="text"
            id="PHV_input{seg_num}"
            placeholder="Type here"
            class="input-label input w-full max-w-xs PHV_input"
            value="5"
            pattern="[+]?([0-9]*([.][0-9]*)|[1-9]|[1-9][0-9])$"
            autocomplete="off"
            required
        />
        <label for="label">
        <span class="label-text-alt"></span>
        <span class="label-text-alt">%</span>
    </td>
</tr>
