import{s as le,n as b}from"../chunks/scheduler.DLmczG9q.js";import{S as re,i as se,e as de,a as oe,g as me,b as K,f as ue,B as ie,d as ge}from"../chunks/index.BCS5BNVK.js";import{W as Q,a as ce,b as _e}from"../chunks/@vite-plugin-wasm-pack@HCM-middleware.CNXUF2vc.js";function ve(v){let n,u="Calculate",d,o;return{c(){n=de("button"),n.textContent=u,this.h()},l(s){n=oe(s,"BUTTON",{type:!0,class:!0,"data-svelte-h":!0}),me(n)!=="svelte-ntewo1"&&(n.textContent=u),this.h()},h(){K(n,"type","submit"),K(n,"class","btn")},m(s,h){ue(s,n,h),d||(o=ie(n,"click",v[3]),d=!0)},p:b,i:b,o:b,d(s){s&&ge(n),d=!1,o()}}}function fe(v,n,u){let{rows_len:d}=n,{rows:o}=n;function s(){h(d,o)}function h(a,i){var f=[],L=[],M=[],B=!0,P=0,T=0,A=0,C=0,F=0,S=0,W=0,x=0,V=0,N=0,j=0,X=0,Y=0,k=0,D=0,O=0,y=[],q=[],$="",c=0,z=new Array(a),ee=new Array(a),E=new Array(a),te=new Array(a);new Array(a);for(var r=0;r<z.length;r++)z[r]=new Array(i[r].subrows.length+1),ee[r]=new Array(i[r].subrows.length+1),E[r]=new Array(i[r].subrows.length+1),te[r]=new Array(i[r].subrows.length+1);x=document.getElementById("LW_input").value,V=document.getElementById("SW_input").value,N=document.getElementById("APD_input").value,j=document.getElementById("PMHVFL_input").value;for(let e=0;e<a;e++)c+=parseFloat(document.getElementById("seg_length"+(e+1)).value);var U=[];for(let e=0;e<a;e++){var Z=i[e].subrows.length,m=document.getElementById("passing_type"+(e+1));m=m.options[m.selectedIndex].text,m=="Passing Constrained"?f[e]=0:m=="Passing Zone"?f[e]=1:m=="Passing Lane"&&(f[e]=2),F=document.getElementById("seg_Spl"+(e+1)).value,document.getElementById("vc_select"+(e+1)).value,B=document.getElementById("is_hc"+(e+1)).checked,P=document.getElementById("vi_input"+(e+1)).value,T=document.getElementById("vo_input"+(e+1)).value,S=document.getElementById("seg_length"+(e+1)).value,W=document.getElementById("seg_grade"+(e+1)).value,A=document.getElementById("PHF_input"+(e+1)).value,C=document.getElementById("PHV_input"+(e+1)).value,D=document.getElementById("vc_select"+(e+1)).value;var p=[];if(p[0]=new Q(0,0,0,0,0),B==!0&&Z>0)for(let l=0;l<Z;l++)E[e][l]=document.getElementById("hc_table"+(e+1)).getElementsByClassName("subseg_len"+(l+1))[0].value,L[l]=document.getElementById("hc_table"+(e+1)).getElementsByClassName("design_radius"+(l+1))[0].value,M[l]=document.getElementById("hc_table"+(e+1)).getElementsByClassName("superelevation"+(l+1))[0].value,p[l]=new Q(E[e][l],0,0,L[l],M[l]);const H=new ce(parseInt(f[e]),S,W,F,B,P,T,0,0,0,0,0,D,p,A,C,0,0,0,0);U.push(H)}var t=new _e(U,x,V,N,j,0),g=0,c=0,G=0,y=0,J=0,I=0,_=0;for(let e=0;e<a;e++){t.identify_vertical_class(e),[X,Y,k]=t.determine_demand_flow(e),t.determine_vertical_alignment(e),O=t.determine_free_flow_speed(e);var[w,ye]=t.estimate_average_speed(e);q[e]=t.estimate_percent_followers(e),t.get_segments()[e].passing_type==2?([y,J]=t.determine_follower_density_pl(e),_=J):y=t.determine_follower_density_pc_pz(e),I=t.determine_adjustment_to_follower_density(e),t.get_segments()[e].passing_type!=2&&(I>0?_=I:_=y),g+=_*t.get_segments()[e].length,c+=t.get_segments()[e].length,G+=w*t.get_segments()[e].length;let H=t.determine_segment_los(e,w,k);document.getElementById("ffs"+(e+1)).innerHTML=""+Math.round(O*1e3)/1e3,document.getElementById("pf"+(e+1)).innerHTML=""+Math.round(q[e]*1e3)/1e3,document.getElementById("avgspd"+(e+1)).innerHTML=""+Math.round(w*1e3)/1e3,document.getElementById("fd"+(e+1)).innerHTML=""+Math.round(_*1e3)/1e3,document.getElementById("seglos"+(e+1)).innerHTML=""+H}g=g/c;let ne=G/c,ae=t.determine_facility_los(g,ne);document.getElementById("los").innerHTML="Entire LOS: "+ae,document.getElementById("fdF").innerHTML="Facility Follower Density: "+Math.round(g*1e3)/1e3,document.getElementById("error").innerHTML="Error message: "+$}const R=()=>s();return v.$$set=a=>{"rows_len"in a&&u(1,d=a.rows_len),"rows"in a&&u(2,o=a.rows)},[s,d,o,R]}class pe extends re{constructor(n){super(),se(this,n,fe,ve,le,{rows_len:1,rows:2})}}export{pe as component};