import{s as K,n as J}from"../chunks/scheduler.DLmczG9q.js";import{S as O,i as Q,e as p,o as V,s as x,a as o,j as w,p as W,d as T,c as L,g as j,b as e,f as X,A as l,q as Y}from"../chunks/index.BCS5BNVK.js";function Z(u){let a,_,d,c,I,f,n,E,H,N,h,k='<span class="label-text-alt"></span> <span class="label-text-alt">ft.</span>',U,m,r,M,P,$,b,R='<span class="label-text-alt"></span> <span class="label-text-alt">ft.</span>',q,v,i,y,A,S,g,z='<span class="label-text-alt"></span> <span class="label-text-alt">%</span>';return{c(){a=p("tr"),_=p("th"),d=p("p"),c=V(u[0]),I=x(),f=p("td"),n=p("input"),N=x(),h=p("label"),h.innerHTML=k,U=x(),m=p("td"),r=p("input"),$=x(),b=p("label"),b.innerHTML=R,q=x(),v=p("td"),i=p("input"),S=x(),g=p("label"),g.innerHTML=z,this.h()},l(s){a=o(s,"TR",{class:!0});var t=w(a);_=o(t,"TH",{});var F=w(_);d=o(F,"P",{});var G=w(d);c=W(G,u[0]),G.forEach(T),F.forEach(T),I=L(t),f=o(t,"TD",{});var C=w(f);n=o(C,"INPUT",{type:!0,placeholder:!0,id:!0,name:!0,class:!0,pattern:!0,autocomplete:!0}),N=L(C),h=o(C,"LABEL",{for:!0,"data-svelte-h":!0}),j(h)!=="svelte-1t3nk1x"&&(h.innerHTML=k),C.forEach(T),U=L(t),m=o(t,"TD",{});var B=w(m);r=o(B,"INPUT",{type:!0,placeholder:!0,id:!0,class:!0,pattern:!0,autocomplete:!0}),$=L(B),b=o(B,"LABEL",{for:!0,"data-svelte-h":!0}),j(b)!=="svelte-1uhunat"&&(b.innerHTML=R),B.forEach(T),q=L(t),v=o(t,"TD",{});var D=w(v);i=o(D,"INPUT",{type:!0,placeholder:!0,id:!0,class:!0,pattern:!0,autocomplete:!0}),S=L(D),g=o(D,"LABEL",{for:!0,"data-svelte-h":!0}),j(g)!=="svelte-p02ahv"&&(g.innerHTML=z),D.forEach(T),t.forEach(T),this.h()},h(){e(n,"type","text"),e(n,"placeholder","Type here"),e(n,"id",E="subseg_len"+u[0]),e(n,"name","subseg_len"),e(n,"class",H="subseg_len"+u[0]+" input input-label w-2/3 max-w-xs"),e(n,"pattern","[+]?([0-9]*([.][0-9]*)|[1-9]|[1-9][0-9]|[1-9][0-9][0-9]|[1-9][0-9][0-9][0-9])$"),n.value="0",e(n,"autocomplete","off"),e(h,"for","subseg_len"),e(r,"type","text"),e(r,"placeholder","Type here"),e(r,"id",M="design_radius"+u[0]),e(r,"class",P="design_radius"+u[0]+" input input-label w-2/3 max-w-xs"),e(r,"pattern","[+]?([0-9]*([.][0-9]*)|[0-9]|[1-9][0-9]|[1-9][0-9][0-9]|[1-9][0-9][0-9][0-9])$"),r.value="0",e(r,"autocomplete","off"),e(b,"for","design_radius"),e(i,"type","text"),e(i,"placeholder","Type here"),e(i,"id",y="superelevation"+u[0]),e(i,"class",A="superelevation"+u[0]+" input input-label w-2/3 max-w-xs"),e(i,"pattern","[+\\-]?([0-9]*([.][0-9]*)|[0-9]|[1-9][0-9])$"),i.value="0",e(i,"autocomplete","off"),e(g,"for","superelevation"),e(a,"class",u[0])},m(s,t){X(s,a,t),l(a,_),l(_,d),l(d,c),l(a,I),l(a,f),l(f,n),l(f,N),l(f,h),l(a,U),l(a,m),l(m,r),l(m,$),l(m,b),l(a,q),l(a,v),l(v,i),l(v,S),l(v,g)},p(s,[t]){t&1&&Y(c,s[0]),t&1&&E!==(E="subseg_len"+s[0])&&e(n,"id",E),t&1&&H!==(H="subseg_len"+s[0]+" input input-label w-2/3 max-w-xs")&&e(n,"class",H),t&1&&M!==(M="design_radius"+s[0])&&e(r,"id",M),t&1&&P!==(P="design_radius"+s[0]+" input input-label w-2/3 max-w-xs")&&e(r,"class",P),t&1&&y!==(y="superelevation"+s[0])&&e(i,"id",y),t&1&&A!==(A="superelevation"+s[0]+" input input-label w-2/3 max-w-xs")&&e(i,"class",A),t&1&&e(a,"class",s[0])},i:J,o:J,d(s){s&&T(a)}}}function ee(u,a,_){let{subseg_num:d}=a;return u.$$set=c=>{"subseg_num"in c&&_(0,d=c.subseg_num)},[d]}class le extends O{constructor(a){super(),Q(this,a,ee,Z,K,{subseg_num:0})}}export{le as component};