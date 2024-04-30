<svelte:head>
  <title>HCM Calculator</title>
</svelte:head>

<script lang="ts">
  import { onMount } from "svelte";
  import init from "HCM-middleware";

  onMount(async() => {
    await init(); // init initializes memory addresses needed by WASM and that will be used by JS/TS
  })

</script>

<div id="routes-container">
  <div class="home grid h-screen place-items-center mt-20">
    <div class="home_div">

      <p>Welcome to <b>HCM Calculator</b>! This site is the third-party web site to support calculation along with Highway Capacity Manual (HCM).</p>
      <p>The HCM Calculator is to provide quick solutions for all of the calculations in HCM.</p>
      <p>It also illustrates the simple figures for full complement of the understandings.</p>

      <p>This site is launched in November 2022 by <a href="https://reis-portfolio.vercel.app" target="_blank">Rei Tamaru</a>, a PhD student at the University of Wisconsin-Madison.</p>

      <div class="w-48 carousel rounded-box hcmimg" style="float:right">
        <div class="carousel-item w-full">
          <img src="hcm7th.jpg" class="w-full" alt="HCM 7th edition" />
          <div class="middle">
            <div class="text"><a href="https://nap.nationalacademies.org/catalog/26432/highway-capacity-manual-7th-edition-a-guide-for-multimodal-mobility" target="_blank">+ See</a></div>
          </div>
          <!-- <caption>Highway Capacity Manual 7th Edition</caption> -->
        </div> 
      </div>

      <p>The latest HCM (7th Edition) can be found <a href="https://nap.nationalacademies.org/catalog/26432/highway-capacity-manual-7th-edition-a-guide-for-multimodal-mobility" target="_blank">here (National Academics)</a>.<br>
      Or you can find it on <a href="https://amzn.to/3ipmRXN" target="_blank">Amazon</a>.
      </p>

      <p>For the website inquires, please email <a href="mailto:tamaru@wisc.edu">to me</a>.</p>
    </div>
    <!-- add update thread and general usage -->
  </div>

</div>
