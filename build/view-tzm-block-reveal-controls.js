(()=>{"use strict";var e={n:o=>{var r=o&&o.__esModule?()=>o.default:()=>o;return e.d(r,{a:r}),r},d:(o,r)=>{for(var t in r)e.o(r,t)&&!e.o(o,t)&&Object.defineProperty(o,t,{enumerable:!0,get:r[t]})},o:(e,o)=>Object.prototype.hasOwnProperty.call(e,o)};const o=window.wp.domReady,r={init:function(){if("IntersectionObserver"in window){const r={root:null,rootMargin:"0px",threshold:0};var e=document.querySelectorAll('[class*="tzm-block-reveal"]'),o=new IntersectionObserver(this.ioCallback,r);e.forEach((e=>{o.observe(e)}))}else e&&(console.warn("Your browser does not support IntersectionObserver."),e.forEach((e=>{e.classList.add("is-visible")})))},ioCallback:function(e,o){e.forEach((function(e){var o=e.target;e.isIntersecting?o.classList.add("is-visible"):o.classList.contains("tzm-block-reveal__permanent")||o.classList.remove("is-visible")}))}};e.n(o)()((function(){r.init()}))})();