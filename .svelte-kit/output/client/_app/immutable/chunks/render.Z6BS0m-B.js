import{g as V,i as M,j as k,b as Y,H as q,h as v,k as H,l as A,s as m,m as b,c as h,o as C,q as N,r as S,t as B,u as F,v as P,w as $,x as j,y as z,z as W,a as G,p as J,A as K,e as Q,B as U}from"./runtime.aMMvh1H4.js";import{b as X}from"./disclose-version.DsA8IxDv.js";const I=new Set,R=new Set;function ne(e){for(var a=0;a<e.length;a++)I.add(e[a]);for(var s of R)s(e)}function T(e){var O;var a=this,s=a.ownerDocument,d=e.type,f=((O=e.composedPath)==null?void 0:O.call(e))||[],r=f[0]||e.target,l=0,y=e.__root;if(y){var u=f.indexOf(y);if(u!==-1&&(a===document||a===window)){e.__root=a;return}var c=f.indexOf(a);if(c===-1)return;u<=c&&(l=u)}if(r=f[l]||e.target,r!==a){V(e,"currentTarget",{configurable:!0,get(){return r||s}});try{for(var p,i=[];r!==null;){var n=r.assignedSlot||r.parentNode||r.host||null;try{var t=r["__"+d];if(t!==void 0&&!r.disabled)if(M(t)){var[_,...w]=t;_.apply(r,[e,...w])}else t.call(r,e)}catch(E){p?i.push(E):p=E}if(e.cancelBubble||n===a||n===null)break;r=n}if(p){for(let E of i)queueMicrotask(()=>{throw E});throw p}}finally{e.__root=a,delete e.currentTarget}}}let o;function Z(){o=void 0}function oe(e){let a=null,s=v;var d;if(v){for(a=h,o===void 0&&(o=C(document.head));o!==null&&(o.nodeType!==8||o.data!==H);)o=A(o);o===null?m(!1):o=b(A(o))}v||(d=document.head.appendChild(k()));try{Y(()=>e(d),q)}finally{s&&(m(!0),o=h,b(a))}}const x=["touchstart","touchmove"];function ee(e){return x.includes(e)}function se(e,a){a!==(e.__t??(e.__t=e.nodeValue))&&(e.__t=a,e.nodeValue=a==null?"":a+"")}function ae(e,a){return L(e,a)}function ie(e,a){N(),a.intro=a.intro??!1;const s=a.target,d=v,f=h;try{for(var r=C(s);r&&(r.nodeType!==8||r.data!==H);)r=A(r);if(!r)throw S;m(!0),b(r),B();const l=L(e,{...a,anchor:r});if(h===null||h.nodeType!==8||h.data!==F)throw P(),S;return m(!1),l}catch(l){if(l===S)return a.recover===!1&&$(),N(),j(s),m(!1),ae(e,a);throw l}finally{m(d),b(f),Z()}}const g=new Map;function L(e,{target:a,anchor:s,props:d={},events:f,context:r,intro:l=!0}){N();var y=new Set,u=i=>{for(var n=0;n<i.length;n++){var t=i[n];if(!y.has(t)){y.add(t);var _=ee(t);a.addEventListener(t,T,{passive:_});var w=g.get(t);w===void 0?(document.addEventListener(t,T,{passive:_}),g.set(t,1)):g.set(t,w+1)}}};u(z(I)),R.add(u);var c=void 0,p=W(()=>{var i=s??a.appendChild(k());return G(()=>{if(r){J({});var n=U;n.c=r}f&&(d.$$events=f),v&&X(i,null),c=e(i,d)||{},v&&(K.nodes_end=h),r&&Q()}),()=>{var _;for(var n of y){a.removeEventListener(n,T);var t=g.get(n);--t===0?(document.removeEventListener(n,T),g.delete(n)):g.set(n,t)}R.delete(u),D.delete(c),i!==s&&((_=i.parentNode)==null||_.removeChild(i))}});return D.set(c,p),c}let D=new WeakMap;function de(e){const a=D.get(e);a&&a()}export{oe as a,ne as d,ie as h,ae as m,se as s,de as u};