import { c as create_ssr_component } from "../../chunks/ssr.js";
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<header data-svelte-h="svelte-n7l420">  <script>window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-LMH583TV33');<\/script> <div class="navbar bg-base-200"><div class="navbar-start"><div class="dropdown"><div tabindex="0" role="button" class="btn btn-ghost btn-circle"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"></path></svg></div> <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-300 rounded-box w-52"><li><a href="/">Home</a></li> <li><div class="justify-between">Chapters
            <svg class="fill-current" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"></path></svg></div> <ul class="p-2 bg-base-200"><li><a href="/hcm15">Chapter 15</a></li></ul></li></ul></div>  <a href="/" class="normal-case text-xl logo"><img src="hcm_calculator_logo.png" alt="logo" style="max-width:110px;height:100%"></a></div> <div class="navbar-center hidden lg:flex"><ul class="menu menu-horizontal p-0"><li><a class="home_button" href="/">Home</a></li>  <li><div class="chap_button">Chapters
          <svg class="fill-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"></path></svg></div> <ul class="p-2 bg-base-200 chap_button"><li><a href="/hcm15">Chapter 15</a></li></ul></li></ul></div> <div class="navbar-end"></div></div></header> <main>${slots.default ? slots.default({}) : ``}</main> <footer class="footer footer-center p-10 bg-base-200 text-base-content rounded" data-svelte-h="svelte-1u900lp"><div class="grid grid-flow-col gap-4"><a href="/" class="link link-hover">Home</a> <a href="terms" class="link link-hover">Terms &amp; Conditions</a></div> <div><p>Copyright © 2024 - All right reserved by Rei Tamaru and Jonathan Riel</p></div></footer>`;
});
export {
  Layout as default
};
