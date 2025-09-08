(self.webpackChunkai_engine=self.webpackChunkai_engine||[]).push([[121],{4300:(e,t,n)=>{"use strict";n.d(t,{A:()=>oe});var r=function(){function e(e){var t=this;this._insertTag=function(e){var n;n=0===t.tags.length?t.insertionPoint?t.insertionPoint.nextSibling:t.prepend?t.container.firstChild:t.before:t.tags[t.tags.length-1].nextSibling,t.container.insertBefore(e,n),t.tags.push(e)},this.isSpeedy=void 0===e.speedy||e.speedy,this.tags=[],this.ctr=0,this.nonce=e.nonce,this.key=e.key,this.container=e.container,this.prepend=e.prepend,this.insertionPoint=e.insertionPoint,this.before=null}var t=e.prototype;return t.hydrate=function(e){e.forEach(this._insertTag)},t.insert=function(e){this.ctr%(this.isSpeedy?65e3:1)==0&&this._insertTag(function(e){var t=document.createElement("style");return t.setAttribute("data-emotion",e.key),void 0!==e.nonce&&t.setAttribute("nonce",e.nonce),t.appendChild(document.createTextNode("")),t.setAttribute("data-s",""),t}(this));var t=this.tags[this.tags.length-1];if(this.isSpeedy){var n=function(e){if(e.sheet)return e.sheet;for(var t=0;t<document.styleSheets.length;t++)if(document.styleSheets[t].ownerNode===e)return document.styleSheets[t]}(t);try{n.insertRule(e,n.cssRules.length)}catch(e){0}}else t.appendChild(document.createTextNode(e));this.ctr++},t.flush=function(){this.tags.forEach((function(e){return e.parentNode&&e.parentNode.removeChild(e)})),this.tags=[],this.ctr=0},e}(),o=Math.abs,i=String.fromCharCode,a=Object.assign;function s(e){return e.trim()}function l(e,t,n){return e.replace(t,n)}function c(e,t){return e.indexOf(t)}function u(e,t){return 0|e.charCodeAt(t)}function d(e,t,n){return e.slice(t,n)}function h(e){return e.length}function p(e){return e.length}function f(e,t){return t.push(e),e}var m=1,g=1,y=0,b=0,v=0,x="";function k(e,t,n,r,o,i,a){return{value:e,root:t,parent:n,type:r,props:o,children:i,line:m,column:g,length:a,return:""}}function w(e,t){return a(k("",null,null,"",null,null,0),e,{length:-e.length},t)}function _(){return v=b>0?u(x,--b):0,g--,10===v&&(g=1,m--),v}function S(){return v=b<y?u(x,b++):0,g++,10===v&&(g=1,m++),v}function E(){return u(x,b)}function C(){return b}function A(e,t){return d(x,e,t)}function O(e){switch(e){case 0:case 9:case 10:case 13:case 32:return 5;case 33:case 43:case 44:case 47:case 62:case 64:case 126:case 59:case 123:case 125:return 4;case 58:return 3;case 34:case 39:case 40:case 91:return 2;case 41:case 93:return 1}return 0}function M(e){return m=g=1,y=h(x=e),b=0,[]}function R(e){return x="",e}function P(e){return s(A(b-1,j(91===e?e+2:40===e?e+1:e)))}function T(e){for(;(v=E())&&v<33;)S();return O(e)>2||O(v)>3?"":" "}function z(e,t){for(;--t&&S()&&!(v<48||v>102||v>57&&v<65||v>70&&v<97););return A(e,C()+(t<6&&32==E()&&32==S()))}function j(e){for(;S();)switch(v){case e:return b;case 34:case 39:34!==e&&39!==e&&j(v);break;case 40:41===e&&j(e);break;case 92:S()}return b}function I(e,t){for(;S()&&e+v!==57&&(e+v!==84||47!==E()););return"/*"+A(t,b-1)+"*"+i(47===e?e:S())}function N(e){for(;!O(E());)S();return A(e,b)}var $="-ms-",L="-moz-",D="-webkit-",F="comm",B="rule",W="decl",H="@keyframes";function q(e,t){for(var n="",r=p(e),o=0;o<r;o++)n+=t(e[o],o,e,t)||"";return n}function U(e,t,n,r){switch(e.type){case"@layer":if(e.children.length)break;case"@import":case W:return e.return=e.return||e.value;case F:return"";case H:return e.return=e.value+"{"+q(e.children,r)+"}";case B:e.value=e.props.join(",")}return h(n=q(e.children,r))?e.return=e.value+"{"+n+"}":""}function V(e){return R(K("",null,null,null,[""],e=M(e),0,[0],e))}function K(e,t,n,r,o,a,s,d,p){for(var m=0,g=0,y=s,b=0,v=0,x=0,k=1,w=1,A=1,O=0,M="",R=o,j=a,$=r,L=M;w;)switch(x=O,O=S()){case 40:if(108!=x&&58==u(L,y-1)){-1!=c(L+=l(P(O),"&","&\f"),"&\f")&&(A=-1);break}case 34:case 39:case 91:L+=P(O);break;case 9:case 10:case 13:case 32:L+=T(x);break;case 92:L+=z(C()-1,7);continue;case 47:switch(E()){case 42:case 47:f(Y(I(S(),C()),t,n),p);break;default:L+="/"}break;case 123*k:d[m++]=h(L)*A;case 125*k:case 59:case 0:switch(O){case 0:case 125:w=0;case 59+g:-1==A&&(L=l(L,/\f/g,"")),v>0&&h(L)-y&&f(v>32?G(L+";",r,n,y-1):G(l(L," ","")+";",r,n,y-2),p);break;case 59:L+=";";default:if(f($=Q(L,t,n,m,g,o,d,M,R=[],j=[],y),a),123===O)if(0===g)K(L,t,$,$,R,a,y,d,j);else switch(99===b&&110===u(L,3)?100:b){case 100:case 108:case 109:case 115:K(e,$,$,r&&f(Q(e,$,$,0,0,o,d,M,o,R=[],y),j),o,j,y,d,r?R:j);break;default:K(L,$,$,$,[""],j,0,d,j)}}m=g=v=0,k=A=1,M=L="",y=s;break;case 58:y=1+h(L),v=x;default:if(k<1)if(123==O)--k;else if(125==O&&0==k++&&125==_())continue;switch(L+=i(O),O*k){case 38:A=g>0?1:(L+="\f",-1);break;case 44:d[m++]=(h(L)-1)*A,A=1;break;case 64:45===E()&&(L+=P(S())),b=E(),g=y=h(M=L+=N(C())),O++;break;case 45:45===x&&2==h(L)&&(k=0)}}return a}function Q(e,t,n,r,i,a,c,u,h,f,m){for(var g=i-1,y=0===i?a:[""],b=p(y),v=0,x=0,w=0;v<r;++v)for(var _=0,S=d(e,g+1,g=o(x=c[v])),E=e;_<b;++_)(E=s(x>0?y[_]+" "+S:l(S,/&\f/g,y[_])))&&(h[w++]=E);return k(e,t,n,0===i?B:u,h,f,m)}function Y(e,t,n){return k(e,t,n,F,i(v),d(e,2,-2),0)}function G(e,t,n,r){return k(e,t,n,W,d(e,0,r),d(e,r+1,-1),r)}var X=function(e,t,n){for(var r=0,o=0;r=o,o=E(),38===r&&12===o&&(t[n]=1),!O(o);)S();return A(e,b)},Z=function(e,t){return R(function(e,t){var n=-1,r=44;do{switch(O(r)){case 0:38===r&&12===E()&&(t[n]=1),e[n]+=X(b-1,t,n);break;case 2:e[n]+=P(r);break;case 4:if(44===r){e[++n]=58===E()?"&\f":"",t[n]=e[n].length;break}default:e[n]+=i(r)}}while(r=S());return e}(M(e),t))},J=new WeakMap,ee=function(e){if("rule"===e.type&&e.parent&&!(e.length<1)){for(var t=e.value,n=e.parent,r=e.column===n.column&&e.line===n.line;"rule"!==n.type;)if(!(n=n.parent))return;if((1!==e.props.length||58===t.charCodeAt(0)||J.get(n))&&!r){J.set(e,!0);for(var o=[],i=Z(t,o),a=n.props,s=0,l=0;s<i.length;s++)for(var c=0;c<a.length;c++,l++)e.props[l]=o[s]?i[s].replace(/&\f/g,a[c]):a[c]+" "+i[s]}}},te=function(e){if("decl"===e.type){var t=e.value;108===t.charCodeAt(0)&&98===t.charCodeAt(2)&&(e.return="",e.value="")}};function ne(e,t){switch(function(e,t){return 45^u(e,0)?(((t<<2^u(e,0))<<2^u(e,1))<<2^u(e,2))<<2^u(e,3):0}(e,t)){case 5103:return D+"print-"+e+e;case 5737:case 4201:case 3177:case 3433:case 1641:case 4457:case 2921:case 5572:case 6356:case 5844:case 3191:case 6645:case 3005:case 6391:case 5879:case 5623:case 6135:case 4599:case 4855:case 4215:case 6389:case 5109:case 5365:case 5621:case 3829:return D+e+e;case 5349:case 4246:case 4810:case 6968:case 2756:return D+e+L+e+$+e+e;case 6828:case 4268:return D+e+$+e+e;case 6165:return D+e+$+"flex-"+e+e;case 5187:return D+e+l(e,/(\w+).+(:[^]+)/,D+"box-$1$2"+$+"flex-$1$2")+e;case 5443:return D+e+$+"flex-item-"+l(e,/flex-|-self/,"")+e;case 4675:return D+e+$+"flex-line-pack"+l(e,/align-content|flex-|-self/,"")+e;case 5548:return D+e+$+l(e,"shrink","negative")+e;case 5292:return D+e+$+l(e,"basis","preferred-size")+e;case 6060:return D+"box-"+l(e,"-grow","")+D+e+$+l(e,"grow","positive")+e;case 4554:return D+l(e,/([^-])(transform)/g,"$1"+D+"$2")+e;case 6187:return l(l(l(e,/(zoom-|grab)/,D+"$1"),/(image-set)/,D+"$1"),e,"")+e;case 5495:case 3959:return l(e,/(image-set\([^]*)/,D+"$1$`$1");case 4968:return l(l(e,/(.+:)(flex-)?(.*)/,D+"box-pack:$3"+$+"flex-pack:$3"),/s.+-b[^;]+/,"justify")+D+e+e;case 4095:case 3583:case 4068:case 2532:return l(e,/(.+)-inline(.+)/,D+"$1$2")+e;case 8116:case 7059:case 5753:case 5535:case 5445:case 5701:case 4933:case 4677:case 5533:case 5789:case 5021:case 4765:if(h(e)-1-t>6)switch(u(e,t+1)){case 109:if(45!==u(e,t+4))break;case 102:return l(e,/(.+:)(.+)-([^]+)/,"$1"+D+"$2-$3$1"+L+(108==u(e,t+3)?"$3":"$2-$3"))+e;case 115:return~c(e,"stretch")?ne(l(e,"stretch","fill-available"),t)+e:e}break;case 4949:if(115!==u(e,t+1))break;case 6444:switch(u(e,h(e)-3-(~c(e,"!important")&&10))){case 107:return l(e,":",":"+D)+e;case 101:return l(e,/(.+:)([^;!]+)(;|!.+)?/,"$1"+D+(45===u(e,14)?"inline-":"")+"box$3$1"+D+"$2$3$1"+$+"$2box$3")+e}break;case 5936:switch(u(e,t+11)){case 114:return D+e+$+l(e,/[svh]\w+-[tblr]{2}/,"tb")+e;case 108:return D+e+$+l(e,/[svh]\w+-[tblr]{2}/,"tb-rl")+e;case 45:return D+e+$+l(e,/[svh]\w+-[tblr]{2}/,"lr")+e}return D+e+$+e+e}return e}var re=[function(e,t,n,r){if(e.length>-1&&!e.return)switch(e.type){case W:e.return=ne(e.value,e.length);break;case H:return q([w(e,{value:l(e.value,"@","@"+D)})],r);case B:if(e.length)return function(e,t){return e.map(t).join("")}(e.props,(function(t){switch(function(e,t){return(e=t.exec(e))?e[0]:e}(t,/(::plac\w+|:read-\w+)/)){case":read-only":case":read-write":return q([w(e,{props:[l(t,/:(read-\w+)/,":-moz-$1")]})],r);case"::placeholder":return q([w(e,{props:[l(t,/:(plac\w+)/,":"+D+"input-$1")]}),w(e,{props:[l(t,/:(plac\w+)/,":-moz-$1")]}),w(e,{props:[l(t,/:(plac\w+)/,$+"input-$1")]})],r)}return""}))}}],oe=function(e){var t=e.key;if("css"===t){var n=document.querySelectorAll("style[data-emotion]:not([data-s])");Array.prototype.forEach.call(n,(function(e){-1!==e.getAttribute("data-emotion").indexOf(" ")&&(document.head.appendChild(e),e.setAttribute("data-s",""))}))}var o=e.stylisPlugins||re;var i,a,s={},l=[];i=e.container||document.head,Array.prototype.forEach.call(document.querySelectorAll('style[data-emotion^="'+t+' "]'),(function(e){for(var t=e.getAttribute("data-emotion").split(" "),n=1;n<t.length;n++)s[t[n]]=!0;l.push(e)}));var c,u,d,h,f=[U,(h=function(e){c.insert(e)},function(e){e.root||(e=e.return)&&h(e)})],m=(u=[ee,te].concat(o,f),d=p(u),function(e,t,n,r){for(var o="",i=0;i<d;i++)o+=u[i](e,t,n,r)||"";return o});a=function(e,t,n,r){c=n,q(V(e?e+"{"+t.styles+"}":t.styles),m),r&&(g.inserted[t.name]=!0)};var g={key:t,sheet:new r({key:t,container:i,nonce:e.nonce,speedy:e.speedy,prepend:e.prepend,insertionPoint:e.insertionPoint}),nonce:e.nonce,inserted:s,registered:{},insert:a};return g.sheet.hydrate(l),g}},6289:(e,t,n)=>{"use strict";function r(e){var t=Object.create(null);return function(n){return void 0===t[n]&&(t[n]=e(n)),t[n]}}n.d(t,{A:()=>r})},85:(e,t,n)=>{"use strict";n.d(t,{C:()=>d,E:()=>y,T:()=>p,c:()=>m,h:()=>c,i:()=>l,w:()=>h});var r=n(1594),o=n(4300),i=n(41),a=n(2142),s=n(1287),l=!0,c={}.hasOwnProperty,u=r.createContext("undefined"!=typeof HTMLElement?(0,o.A)({key:"css"}):null);var d=u.Provider,h=function(e){return(0,r.forwardRef)((function(t,n){var o=(0,r.useContext)(u);return e(t,o,n)}))};l||(h=function(e){return function(t){var n=(0,r.useContext)(u);return null===n?(n=(0,o.A)({key:"css"}),r.createElement(u.Provider,{value:n},e(t,n))):e(t,n)}});var p=r.createContext({});var f="__EMOTION_TYPE_PLEASE_DO_NOT_USE__",m=function(e,t){var n={};for(var r in t)c.call(t,r)&&(n[r]=t[r]);return n[f]=e,n},g=function(e){var t=e.cache,n=e.serialized,r=e.isStringTag;return(0,i.SF)(t,n,r),(0,s.s)((function(){return(0,i.sk)(t,n,r)})),null};var y=h((function(e,t,n){var o=e.css;"string"==typeof o&&void 0!==t.registered[o]&&(o=t.registered[o]);var s=e[f],l=[o],u="";"string"==typeof e.className?u=(0,i.Rk)(t.registered,l,e.className):null!=e.className&&(u=e.className+" ");var d=(0,a.J)(l,void 0,r.useContext(p));u+=t.key+"-"+d.name;var h={};for(var m in e)c.call(e,m)&&"css"!==m&&m!==f&&(h[m]=e[m]);return h.ref=n,h.className=u,r.createElement(r.Fragment,null,r.createElement(g,{cache:t,serialized:d,isStringTag:"string"==typeof s}),r.createElement(s,h))}))},7437:(e,t,n)=>{"use strict";n.d(t,{AH:()=>c,i7:()=>u,mL:()=>l});var r=n(85),o=n(1594),i=n(41),a=n(1287),s=n(2142),l=(n(4300),n(4146),(0,r.w)((function(e,t){var n=e.styles,l=(0,s.J)([n],void 0,o.useContext(r.T));if(!r.i){for(var c,u=l.name,d=l.styles,h=l.next;void 0!==h;)u+=" "+h.name,d+=h.styles,h=h.next;var p=!0===t.compat,f=t.insert("",{name:u,styles:d},t.sheet,p);return p?null:o.createElement("style",((c={})["data-emotion"]=t.key+"-global "+u,c.dangerouslySetInnerHTML={__html:f},c.nonce=t.sheet.nonce,c))}var m=o.useRef();return(0,a.i)((function(){var e=t.key+"-global",n=new t.sheet.constructor({key:e,nonce:t.sheet.nonce,container:t.sheet.container,speedy:t.sheet.isSpeedy}),r=!1,o=document.querySelector('style[data-emotion="'+e+" "+l.name+'"]');return t.sheet.tags.length&&(n.before=t.sheet.tags[0]),null!==o&&(r=!0,o.setAttribute("data-emotion",e),n.hydrate([o])),m.current=[n,r],function(){n.flush()}}),[t]),(0,a.i)((function(){var e=m.current,n=e[0];if(e[1])e[1]=!1;else{if(void 0!==l.next&&(0,i.sk)(t,l.next,!0),n.tags.length){var r=n.tags[n.tags.length-1].nextElementSibling;n.before=r,n.flush()}t.insert("",l,n,!1)}}),[t,l.name]),null})));function c(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return(0,s.J)(t)}var u=function(){var e=c.apply(void 0,arguments),t="animation-"+e.name;return{name:t,styles:"@keyframes "+t+"{"+e.styles+"}",anim:1,toString:function(){return"_EMO_"+this.name+"_"+this.styles+"_EMO_"}}}},2142:(e,t,n)=>{"use strict";n.d(t,{J:()=>f});var r=n(3969),o=n(6289),i=/[A-Z]|^ms/g,a=/_EMO_([^_]+?)_([^]*?)_EMO_/g,s=function(e){return 45===e.charCodeAt(1)},l=function(e){return null!=e&&"boolean"!=typeof e},c=(0,o.A)((function(e){return s(e)?e:e.replace(i,"-$&").toLowerCase()})),u=function(e,t){switch(e){case"animation":case"animationName":if("string"==typeof t)return t.replace(a,(function(e,t,n){return h={name:t,styles:n,next:h},t}))}return 1===r.A[e]||s(e)||"number"!=typeof t||0===t?t:t+"px"};function d(e,t,n){if(null==n)return"";if(void 0!==n.__emotion_styles)return n;switch(typeof n){case"boolean":return"";case"object":if(1===n.anim)return h={name:n.name,styles:n.styles,next:h},n.name;if(void 0!==n.styles){var r=n.next;if(void 0!==r)for(;void 0!==r;)h={name:r.name,styles:r.styles,next:h},r=r.next;return n.styles+";"}return function(e,t,n){var r="";if(Array.isArray(n))for(var o=0;o<n.length;o++)r+=d(e,t,n[o])+";";else for(var i in n){var a=n[i];if("object"!=typeof a)null!=t&&void 0!==t[a]?r+=i+"{"+t[a]+"}":l(a)&&(r+=c(i)+":"+u(i,a)+";");else if(!Array.isArray(a)||"string"!=typeof a[0]||null!=t&&void 0!==t[a[0]]){var s=d(e,t,a);switch(i){case"animation":case"animationName":r+=c(i)+":"+s+";";break;default:r+=i+"{"+s+"}"}}else for(var h=0;h<a.length;h++)l(a[h])&&(r+=c(i)+":"+u(i,a[h])+";")}return r}(e,t,n);case"function":if(void 0!==e){var o=h,i=n(e);return h=o,d(e,t,i)}}if(null==t)return n;var a=t[n];return void 0!==a?a:n}var h,p=/label:\s*([^\s;\n{]+)\s*(;|$)/g;var f=function(e,t,n){if(1===e.length&&"object"==typeof e[0]&&null!==e[0]&&void 0!==e[0].styles)return e[0];var r=!0,o="";h=void 0;var i=e[0];null==i||void 0===i.raw?(r=!1,o+=d(n,t,i)):o+=i[0];for(var a=1;a<e.length;a++)o+=d(n,t,e[a]),r&&(o+=i[a]);p.lastIndex=0;for(var s,l="";null!==(s=p.exec(o));)l+="-"+s[1];var c=function(e){for(var t,n=0,r=0,o=e.length;o>=4;++r,o-=4)t=1540483477*(65535&(t=255&e.charCodeAt(r)|(255&e.charCodeAt(++r))<<8|(255&e.charCodeAt(++r))<<16|(255&e.charCodeAt(++r))<<24))+(59797*(t>>>16)<<16),n=1540483477*(65535&(t^=t>>>24))+(59797*(t>>>16)<<16)^1540483477*(65535&n)+(59797*(n>>>16)<<16);switch(o){case 3:n^=(255&e.charCodeAt(r+2))<<16;case 2:n^=(255&e.charCodeAt(r+1))<<8;case 1:n=1540483477*(65535&(n^=255&e.charCodeAt(r)))+(59797*(n>>>16)<<16)}return(((n=1540483477*(65535&(n^=n>>>13))+(59797*(n>>>16)<<16))^n>>>15)>>>0).toString(36)}(o)+l;return{name:c,styles:o,next:h}}},3969:(e,t,n)=>{"use strict";n.d(t,{A:()=>r});var r={animationIterationCount:1,aspectRatio:1,borderImageOutset:1,borderImageSlice:1,borderImageWidth:1,boxFlex:1,boxFlexGroup:1,boxOrdinalGroup:1,columnCount:1,columns:1,flex:1,flexGrow:1,flexPositive:1,flexShrink:1,flexNegative:1,flexOrder:1,gridRow:1,gridRowEnd:1,gridRowSpan:1,gridRowStart:1,gridColumn:1,gridColumnEnd:1,gridColumnSpan:1,gridColumnStart:1,msGridRow:1,msGridRowSpan:1,msGridColumn:1,msGridColumnSpan:1,fontWeight:1,lineHeight:1,opacity:1,order:1,orphans:1,tabSize:1,widows:1,zIndex:1,zoom:1,WebkitLineClamp:1,fillOpacity:1,floodOpacity:1,stopOpacity:1,strokeDasharray:1,strokeDashoffset:1,strokeMiterlimit:1,strokeOpacity:1,strokeWidth:1}},1287:(e,t,n)=>{"use strict";n.d(t,{i:()=>a,s:()=>i});var r=n(1594),o=!!r.useInsertionEffect&&r.useInsertionEffect,i=o||function(e){return e()},a=o||r.useLayoutEffect},41:(e,t,n)=>{"use strict";n.d(t,{Rk:()=>r,SF:()=>o,sk:()=>i});function r(e,t,n){var r="";return n.split(" ").forEach((function(n){void 0!==e[n]?t.push(e[n]+";"):r+=n+" "})),r}var o=function(e,t,n){var r=e.key+"-"+t.name;!1===n&&void 0===e.registered[r]&&(e.registered[r]=t.styles)},i=function(e,t,n){o(e,t,n);var r=e.key+"-"+t.name;if(void 0===e.inserted[t.name]){var i=t;do{e.insert(t===i?"."+r:"",i,e.sheet,!0),i=i.next}while(void 0!==i)}}},9940:(e,t,n)=>{"use strict";n.d(t,{A:()=>i});n(1594);var r=n(7437),o=n(4848);function i(e){const{styles:t,defaultTheme:n={}}=e,i="function"==typeof t?e=>{return t(null==(r=e)||0===Object.keys(r).length?n:e);var r}:t;return(0,o.jsx)(r.mL,{styles:i})}},2532:(e,t,n)=>{"use strict";n.r(t),n.d(t,{GlobalStyles:()=>_.A,StyledEngineProvider:()=>w,ThemeContext:()=>l.T,css:()=>b.AH,default:()=>S,internal_processStyles:()=>E,keyframes:()=>b.i7});var r=n(8168),o=n(1594),i=n(6289),a=/^((children|dangerouslySetInnerHTML|key|ref|autoFocus|defaultValue|defaultChecked|innerHTML|suppressContentEditableWarning|suppressHydrationWarning|valueLink|abbr|accept|acceptCharset|accessKey|action|allow|allowUserMedia|allowPaymentRequest|allowFullScreen|allowTransparency|alt|async|autoComplete|autoPlay|capture|cellPadding|cellSpacing|challenge|charSet|checked|cite|classID|className|cols|colSpan|content|contentEditable|contextMenu|controls|controlsList|coords|crossOrigin|data|dateTime|decoding|default|defer|dir|disabled|disablePictureInPicture|disableRemotePlayback|download|draggable|encType|enterKeyHint|form|formAction|formEncType|formMethod|formNoValidate|formTarget|frameBorder|headers|height|hidden|high|href|hrefLang|htmlFor|httpEquiv|id|inputMode|integrity|is|keyParams|keyType|kind|label|lang|list|loading|loop|low|marginHeight|marginWidth|max|maxLength|media|mediaGroup|method|min|minLength|multiple|muted|name|nonce|noValidate|open|optimum|pattern|placeholder|playsInline|poster|preload|profile|radioGroup|readOnly|referrerPolicy|rel|required|reversed|role|rows|rowSpan|sandbox|scope|scoped|scrolling|seamless|selected|shape|size|sizes|slot|span|spellCheck|src|srcDoc|srcLang|srcSet|start|step|style|summary|tabIndex|target|title|translate|type|useMap|value|width|wmode|wrap|about|datatype|inlist|prefix|property|resource|typeof|vocab|autoCapitalize|autoCorrect|autoSave|color|incremental|fallback|inert|itemProp|itemScope|itemType|itemID|itemRef|on|option|results|security|unselectable|accentHeight|accumulate|additive|alignmentBaseline|allowReorder|alphabetic|amplitude|arabicForm|ascent|attributeName|attributeType|autoReverse|azimuth|baseFrequency|baselineShift|baseProfile|bbox|begin|bias|by|calcMode|capHeight|clip|clipPathUnits|clipPath|clipRule|colorInterpolation|colorInterpolationFilters|colorProfile|colorRendering|contentScriptType|contentStyleType|cursor|cx|cy|d|decelerate|descent|diffuseConstant|direction|display|divisor|dominantBaseline|dur|dx|dy|edgeMode|elevation|enableBackground|end|exponent|externalResourcesRequired|fill|fillOpacity|fillRule|filter|filterRes|filterUnits|floodColor|floodOpacity|focusable|fontFamily|fontSize|fontSizeAdjust|fontStretch|fontStyle|fontVariant|fontWeight|format|from|fr|fx|fy|g1|g2|glyphName|glyphOrientationHorizontal|glyphOrientationVertical|glyphRef|gradientTransform|gradientUnits|hanging|horizAdvX|horizOriginX|ideographic|imageRendering|in|in2|intercept|k|k1|k2|k3|k4|kernelMatrix|kernelUnitLength|kerning|keyPoints|keySplines|keyTimes|lengthAdjust|letterSpacing|lightingColor|limitingConeAngle|local|markerEnd|markerMid|markerStart|markerHeight|markerUnits|markerWidth|mask|maskContentUnits|maskUnits|mathematical|mode|numOctaves|offset|opacity|operator|order|orient|orientation|origin|overflow|overlinePosition|overlineThickness|panose1|paintOrder|pathLength|patternContentUnits|patternTransform|patternUnits|pointerEvents|points|pointsAtX|pointsAtY|pointsAtZ|preserveAlpha|preserveAspectRatio|primitiveUnits|r|radius|refX|refY|renderingIntent|repeatCount|repeatDur|requiredExtensions|requiredFeatures|restart|result|rotate|rx|ry|scale|seed|shapeRendering|slope|spacing|specularConstant|specularExponent|speed|spreadMethod|startOffset|stdDeviation|stemh|stemv|stitchTiles|stopColor|stopOpacity|strikethroughPosition|strikethroughThickness|string|stroke|strokeDasharray|strokeDashoffset|strokeLinecap|strokeLinejoin|strokeMiterlimit|strokeOpacity|strokeWidth|surfaceScale|systemLanguage|tableValues|targetX|targetY|textAnchor|textDecoration|textRendering|textLength|to|transform|u1|u2|underlinePosition|underlineThickness|unicode|unicodeBidi|unicodeRange|unitsPerEm|vAlphabetic|vHanging|vIdeographic|vMathematical|values|vectorEffect|version|vertAdvY|vertOriginX|vertOriginY|viewBox|viewTarget|visibility|widths|wordSpacing|writingMode|x|xHeight|x1|x2|xChannelSelector|xlinkActuate|xlinkArcrole|xlinkHref|xlinkRole|xlinkShow|xlinkTitle|xlinkType|xmlBase|xmlns|xmlnsXlink|xmlLang|xmlSpace|y|y1|y2|yChannelSelector|z|zoomAndPan|for|class|autofocus)|(([Dd][Aa][Tt][Aa]|[Aa][Rr][Ii][Aa]|x)-.*))$/,s=(0,i.A)((function(e){return a.test(e)||111===e.charCodeAt(0)&&110===e.charCodeAt(1)&&e.charCodeAt(2)<91})),l=n(85),c=n(41),u=n(2142),d=n(1287),h=s,p=function(e){return"theme"!==e},f=function(e){return"string"==typeof e&&e.charCodeAt(0)>96?h:p},m=function(e,t,n){var r;if(t){var o=t.shouldForwardProp;r=e.__emotion_forwardProp&&o?function(t){return e.__emotion_forwardProp(t)&&o(t)}:o}return"function"!=typeof r&&n&&(r=e.__emotion_forwardProp),r},g=function(e){var t=e.cache,n=e.serialized,r=e.isStringTag;return(0,c.SF)(t,n,r),(0,d.s)((function(){return(0,c.sk)(t,n,r)})),null},y=function e(t,n){var i,a,s=t.__emotion_real===t,d=s&&t.__emotion_base||t;void 0!==n&&(i=n.label,a=n.target);var h=m(t,n,s),p=h||f(d),y=!p("as");return function(){var b=arguments,v=s&&void 0!==t.__emotion_styles?t.__emotion_styles.slice(0):[];if(void 0!==i&&v.push("label:"+i+";"),null==b[0]||void 0===b[0].raw)v.push.apply(v,b);else{0,v.push(b[0][0]);for(var x=b.length,k=1;k<x;k++)v.push(b[k],b[0][k])}var w=(0,l.w)((function(e,t,n){var r=y&&e.as||d,i="",s=[],m=e;if(null==e.theme){for(var b in m={},e)m[b]=e[b];m.theme=o.useContext(l.T)}"string"==typeof e.className?i=(0,c.Rk)(t.registered,s,e.className):null!=e.className&&(i=e.className+" ");var x=(0,u.J)(v.concat(s),t.registered,m);i+=t.key+"-"+x.name,void 0!==a&&(i+=" "+a);var k=y&&void 0===h?f(r):p,w={};for(var _ in e)y&&"as"===_||k(_)&&(w[_]=e[_]);return w.className=i,w.ref=n,o.createElement(o.Fragment,null,o.createElement(g,{cache:t,serialized:x,isStringTag:"string"==typeof r}),o.createElement(r,w))}));return w.displayName=void 0!==i?i:"Styled("+("string"==typeof d?d:d.displayName||d.name||"Component")+")",w.defaultProps=t.defaultProps,w.__emotion_real=w,w.__emotion_base=d,w.__emotion_styles=v,w.__emotion_forwardProp=h,Object.defineProperty(w,"toString",{value:function(){return"."+a}}),w.withComponent=function(t,o){return e(t,(0,r.A)({},n,o,{shouldForwardProp:m(w,o,!0)})).apply(void 0,v)},w}}.bind();["a","abbr","address","area","article","aside","audio","b","base","bdi","bdo","big","blockquote","body","br","button","canvas","caption","cite","code","col","colgroup","data","datalist","dd","del","details","dfn","dialog","div","dl","dt","em","embed","fieldset","figcaption","figure","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","iframe","img","input","ins","kbd","keygen","label","legend","li","link","main","map","mark","marquee","menu","menuitem","meta","meter","nav","noscript","object","ol","optgroup","option","output","p","param","picture","pre","progress","q","rp","rt","ruby","s","samp","script","section","select","small","source","span","strong","style","sub","summary","sup","table","tbody","td","textarea","tfoot","th","thead","time","title","tr","track","u","ul","var","video","wbr","circle","clipPath","defs","ellipse","foreignObject","g","image","line","linearGradient","mask","path","pattern","polygon","polyline","radialGradient","rect","stop","svg","text","tspan"].forEach((function(e){y[e]=y(e)}));var b=n(7437),v=n(4300),x=n(4848);let k;function w(e){const{injectFirst:t,children:n}=e;return t&&k?(0,x.jsx)(l.C,{value:k,children:n}):n}"object"==typeof document&&(k=(0,v.A)({key:"css",prepend:!0}));var _=n(9940);function S(e,t){return y(e,t)}const E=(e,t)=>{Array.isArray(e.__emotion_styles)&&(e.__emotion_styles=t(e.__emotion_styles))}},771:(e,t,n)=>{"use strict";var r=n(4994);t.X4=p,t.e$=f,t.eM=function(e,t){const n=h(e),r=h(t);return(Math.max(n,r)+.05)/(Math.min(n,r)+.05)},t.a=m;var o=r(n(2108)),i=r(n(6379));function a(e,t=0,n=1){return(0,i.default)(e,t,n)}function s(e){e=e.slice(1);const t=new RegExp(`.{1,${e.length>=6?2:1}}`,"g");let n=e.match(t);return n&&1===n[0].length&&(n=n.map((e=>e+e))),n?`rgb${4===n.length?"a":""}(${n.map(((e,t)=>t<3?parseInt(e,16):Math.round(parseInt(e,16)/255*1e3)/1e3)).join(", ")})`:""}function l(e){if(e.type)return e;if("#"===e.charAt(0))return l(s(e));const t=e.indexOf("("),n=e.substring(0,t);if(-1===["rgb","rgba","hsl","hsla","color"].indexOf(n))throw new Error((0,o.default)(9,e));let r,i=e.substring(t+1,e.length-1);if("color"===n){if(i=i.split(" "),r=i.shift(),4===i.length&&"/"===i[3].charAt(0)&&(i[3]=i[3].slice(1)),-1===["srgb","display-p3","a98-rgb","prophoto-rgb","rec-2020"].indexOf(r))throw new Error((0,o.default)(10,r))}else i=i.split(",");return i=i.map((e=>parseFloat(e))),{type:n,values:i,colorSpace:r}}const c=e=>{const t=l(e);return t.values.slice(0,3).map(((e,n)=>-1!==t.type.indexOf("hsl")&&0!==n?`${e}%`:e)).join(" ")};function u(e){const{type:t,colorSpace:n}=e;let{values:r}=e;return-1!==t.indexOf("rgb")?r=r.map(((e,t)=>t<3?parseInt(e,10):e)):-1!==t.indexOf("hsl")&&(r[1]=`${r[1]}%`,r[2]=`${r[2]}%`),r=-1!==t.indexOf("color")?`${n} ${r.join(" ")}`:`${r.join(", ")}`,`${t}(${r})`}function d(e){e=l(e);const{values:t}=e,n=t[0],r=t[1]/100,o=t[2]/100,i=r*Math.min(o,1-o),a=(e,t=(e+n/30)%12)=>o-i*Math.max(Math.min(t-3,9-t,1),-1);let s="rgb";const c=[Math.round(255*a(0)),Math.round(255*a(8)),Math.round(255*a(4))];return"hsla"===e.type&&(s+="a",c.push(t[3])),u({type:s,values:c})}function h(e){let t="hsl"===(e=l(e)).type||"hsla"===e.type?l(d(e)).values:e.values;return t=t.map((t=>("color"!==e.type&&(t/=255),t<=.03928?t/12.92:((t+.055)/1.055)**2.4))),Number((.2126*t[0]+.7152*t[1]+.0722*t[2]).toFixed(3))}function p(e,t){return e=l(e),t=a(t),"rgb"!==e.type&&"hsl"!==e.type||(e.type+="a"),"color"===e.type?e.values[3]=`/${t}`:e.values[3]=t,u(e)}function f(e,t){if(e=l(e),t=a(t),-1!==e.type.indexOf("hsl"))e.values[2]*=1-t;else if(-1!==e.type.indexOf("rgb")||-1!==e.type.indexOf("color"))for(let n=0;n<3;n+=1)e.values[n]*=1-t;return u(e)}function m(e,t){if(e=l(e),t=a(t),-1!==e.type.indexOf("hsl"))e.values[2]+=(100-e.values[2])*t;else if(-1!==e.type.indexOf("rgb"))for(let n=0;n<3;n+=1)e.values[n]+=(255-e.values[n])*t;else if(-1!==e.type.indexOf("color"))for(let n=0;n<3;n+=1)e.values[n]+=(1-e.values[n])*t;return u(e)}},6461:(e,t,n)=>{"use strict";var r=n(4994);t.Ay=function(e={}){const{themeId:t,defaultTheme:n=m,rootShouldForwardProp:r=f,slotShouldForwardProp:l=f}=e,u=e=>(0,c.default)((0,o.default)({},e,{theme:y((0,o.default)({},e,{defaultTheme:n,themeId:t}))}));return u.__mui_systemSx=!0,(e,c={})=>{(0,a.internal_processStyles)(e,(e=>e.filter((e=>!(null!=e&&e.__mui_systemSx)))));const{name:d,slot:p,skipVariantsResolver:m,skipSx:x,overridesResolver:k=b(g(p))}=c,w=(0,i.default)(c,h),_=void 0!==m?m:p&&"Root"!==p&&"root"!==p||!1,S=x||!1;let E=f;"Root"===p||"root"===p?E=r:p?E=l:function(e){return"string"==typeof e&&e.charCodeAt(0)>96}(e)&&(E=void 0);const C=(0,a.default)(e,(0,o.default)({shouldForwardProp:E,label:undefined},w)),A=e=>"function"==typeof e&&e.__emotion_real!==e||(0,s.isPlainObject)(e)?r=>v(e,(0,o.default)({},r,{theme:y({theme:r.theme,defaultTheme:n,themeId:t})})):e,O=(r,...i)=>{let a=A(r);const s=i?i.map(A):[];d&&k&&s.push((e=>{const r=y((0,o.default)({},e,{defaultTheme:n,themeId:t}));if(!r.components||!r.components[d]||!r.components[d].styleOverrides)return null;const i=r.components[d].styleOverrides,a={};return Object.entries(i).forEach((([t,n])=>{a[t]=v(n,(0,o.default)({},e,{theme:r}))})),k(e,a)})),d&&!_&&s.push((e=>{var r;const i=y((0,o.default)({},e,{defaultTheme:n,themeId:t}));return v({variants:null==i||null==(r=i.components)||null==(r=r[d])?void 0:r.variants},(0,o.default)({},e,{theme:i}))})),S||s.push(u);const l=s.length-i.length;if(Array.isArray(r)&&l>0){const e=new Array(l).fill("");a=[...r,...e],a.raw=[...r.raw,...e]}const c=C(a,...s);return e.muiName&&(c.muiName=e.muiName),c};return C.withConfig&&(O.withConfig=C.withConfig),O}},t.MC=f;var o=r(n(4634)),i=r(n(4893)),a=function(e,t){if(!t&&e&&e.__esModule)return e;if(null===e||"object"!=typeof e&&"function"!=typeof e)return{default:e};var n=p(t);if(n&&n.has(e))return n.get(e);var r={__proto__:null},o=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var i in e)if("default"!==i&&Object.prototype.hasOwnProperty.call(e,i)){var a=o?Object.getOwnPropertyDescriptor(e,i):null;a&&(a.get||a.set)?Object.defineProperty(r,i,a):r[i]=e[i]}return r.default=e,n&&n.set(e,r),r}(n(2532)),s=n(819),l=(r(n(8217)),r(n(1172)),r(n(3142))),c=r(n(3857));const u=["ownerState"],d=["variants"],h=["name","slot","skipVariantsResolver","skipSx","overridesResolver"];function p(e){if("function"!=typeof WeakMap)return null;var t=new WeakMap,n=new WeakMap;return(p=function(e){return e?n:t})(e)}function f(e){return"ownerState"!==e&&"theme"!==e&&"sx"!==e&&"as"!==e}const m=(0,l.default)(),g=e=>e?e.charAt(0).toLowerCase()+e.slice(1):e;function y({defaultTheme:e,theme:t,themeId:n}){return r=t,0===Object.keys(r).length?e:t[n]||t;var r}function b(e){return e?(t,n)=>n[e]:null}function v(e,t){let{ownerState:n}=t,r=(0,i.default)(t,u);const a="function"==typeof e?e((0,o.default)({ownerState:n},r)):e;if(Array.isArray(a))return a.flatMap((e=>v(e,(0,o.default)({ownerState:n},r))));if(a&&"object"==typeof a&&Array.isArray(a.variants)){const{variants:e=[]}=a;let t=(0,i.default)(a,d);return e.forEach((e=>{let i=!0;"function"==typeof e.props?i=e.props((0,o.default)({ownerState:n},r,n)):Object.keys(e.props).forEach((t=>{(null==n?void 0:n[t])!==e.props[t]&&r[t]!==e.props[t]&&(i=!1)})),i&&(Array.isArray(t)||(t=[t]),t.push("function"==typeof e.style?e.style((0,o.default)({ownerState:n},r,n)):e.style))})),t}return a}},9452:(e,t,n)=>{"use strict";n.d(t,{EU:()=>a,NI:()=>i,vf:()=>s,zu:()=>r});const r={xs:0,sm:600,md:900,lg:1200,xl:1536},o={keys:["xs","sm","md","lg","xl"],up:e=>`@media (min-width:${r[e]}px)`};function i(e,t,n){const i=e.theme||{};if(Array.isArray(t)){const e=i.breakpoints||o;return t.reduce(((r,o,i)=>(r[e.up(e.keys[i])]=n(t[i]),r)),{})}if("object"==typeof t){const e=i.breakpoints||o;return Object.keys(t).reduce(((o,i)=>{if(-1!==Object.keys(e.values||r).indexOf(i)){o[e.up(i)]=n(t[i],i)}else{const e=i;o[e]=t[e]}return o}),{})}return n(t)}function a(e={}){var t;return(null==(t=e.keys)?void 0:t.reduce(((t,n)=>(t[e.up(n)]={},t)),{}))||{}}function s(e,t){return e.reduce(((e,t)=>{const n=e[t];return(!n||0===Object.keys(n).length)&&delete e[t],e}),t)}},8336:(e,t,n)=>{"use strict";function r(e,t){const n=this;if(n.vars&&"function"==typeof n.getColorSchemeSelector){return{[n.getColorSchemeSelector(e).replace(/(\[[^\]]+\])/,"*:where($1)")]:t}}return n.palette.mode===e?t:{}}n.d(t,{A:()=>r})},8094:(e,t,n)=>{"use strict";n.d(t,{A:()=>s});var r=n(8587),o=n(8168);const i=["values","unit","step"],a=e=>{const t=Object.keys(e).map((t=>({key:t,val:e[t]})))||[];return t.sort(((e,t)=>e.val-t.val)),t.reduce(((e,t)=>(0,o.A)({},e,{[t.key]:t.val})),{})};function s(e){const{values:t={xs:0,sm:600,md:900,lg:1200,xl:1536},unit:n="px",step:s=5}=e,l=(0,r.A)(e,i),c=a(t),u=Object.keys(c);function d(e){return`@media (min-width:${"number"==typeof t[e]?t[e]:e}${n})`}function h(e){return`@media (max-width:${("number"==typeof t[e]?t[e]:e)-s/100}${n})`}function p(e,r){const o=u.indexOf(r);return`@media (min-width:${"number"==typeof t[e]?t[e]:e}${n}) and (max-width:${(-1!==o&&"number"==typeof t[u[o]]?t[u[o]]:r)-s/100}${n})`}return(0,o.A)({keys:u,values:c,up:d,down:h,between:p,only:function(e){return u.indexOf(e)+1<u.length?p(e,u[u.indexOf(e)+1]):d(e)},not:function(e){const t=u.indexOf(e);return 0===t?d(u[1]):t===u.length-1?h(u[t]):p(e,u[u.indexOf(e)+1]).replace("@media","@media not all and")},unit:n},l)}},8749:(e,t,n)=>{"use strict";n.d(t,{A:()=>p});var r=n(8168),o=n(8587),i=n(4521),a=n(8094);const s={borderRadius:4};var l=n(8248);var c=n(3571),u=n(4188),d=n(8336);const h=["breakpoints","palette","spacing","shape"];const p=function(e={},...t){const{breakpoints:n={},palette:p={},spacing:f,shape:m={}}=e,g=(0,o.A)(e,h),y=(0,a.A)(n),b=function(e=8){if(e.mui)return e;const t=(0,l.LX)({spacing:e}),n=(...e)=>(0===e.length?[1]:e).map((e=>{const n=t(e);return"number"==typeof n?`${n}px`:n})).join(" ");return n.mui=!0,n}(f);let v=(0,i.A)({breakpoints:y,direction:"ltr",components:{},palette:(0,r.A)({mode:"light"},p),spacing:b,shape:(0,r.A)({},s,m)},g);return v.applyStyles=d.A,v=t.reduce(((e,t)=>(0,i.A)(e,t)),v),v.unstable_sxConfig=(0,r.A)({},u.A,null==g?void 0:g.unstable_sxConfig),v.unstable_sx=function(e){return(0,c.A)({sx:e,theme:this})},v}},3142:(e,t,n)=>{"use strict";n.r(t),n.d(t,{default:()=>r.A,private_createBreakpoints:()=>o.A,unstable_applyStyles:()=>i.A});var r=n(8749),o=n(8094),i=n(8336)},4620:(e,t,n)=>{"use strict";n.d(t,{A:()=>o});var r=n(4521);const o=function(e,t){return t?(0,r.A)(e,t,{clone:!1}):e}},8248:(e,t,n)=>{"use strict";n.d(t,{LX:()=>f,MA:()=>p,_W:()=>m,Lc:()=>b,Ms:()=>v});var r=n(9452),o=n(6481),i=n(4620);const a={m:"margin",p:"padding"},s={t:"Top",r:"Right",b:"Bottom",l:"Left",x:["Left","Right"],y:["Top","Bottom"]},l={marginX:"mx",marginY:"my",paddingX:"px",paddingY:"py"},c=function(e){const t={};return n=>(void 0===t[n]&&(t[n]=e(n)),t[n])}((e=>{if(e.length>2){if(!l[e])return[e];e=l[e]}const[t,n]=e.split(""),r=a[t],o=s[n]||"";return Array.isArray(o)?o.map((e=>r+e)):[r+o]})),u=["m","mt","mr","mb","ml","mx","my","margin","marginTop","marginRight","marginBottom","marginLeft","marginX","marginY","marginInline","marginInlineStart","marginInlineEnd","marginBlock","marginBlockStart","marginBlockEnd"],d=["p","pt","pr","pb","pl","px","py","padding","paddingTop","paddingRight","paddingBottom","paddingLeft","paddingX","paddingY","paddingInline","paddingInlineStart","paddingInlineEnd","paddingBlock","paddingBlockStart","paddingBlockEnd"],h=[...u,...d];function p(e,t,n,r){var i;const a=null!=(i=(0,o.Yn)(e,t,!1))?i:n;return"number"==typeof a?e=>"string"==typeof e?e:a*e:Array.isArray(a)?e=>"string"==typeof e?e:a[e]:"function"==typeof a?a:()=>{}}function f(e){return p(e,"spacing",8)}function m(e,t){if("string"==typeof t||null==t)return t;const n=e(Math.abs(t));return t>=0?n:"number"==typeof n?-n:`-${n}`}function g(e,t,n,o){if(-1===t.indexOf(n))return null;const i=function(e,t){return n=>e.reduce(((e,r)=>(e[r]=m(t,n),e)),{})}(c(n),o),a=e[n];return(0,r.NI)(e,a,i)}function y(e,t){const n=f(e.theme);return Object.keys(e).map((r=>g(e,t,r,n))).reduce(i.A,{})}function b(e){return y(e,u)}function v(e){return y(e,d)}function x(e){return y(e,h)}b.propTypes={},b.filterProps=u,v.propTypes={},v.filterProps=d,x.propTypes={},x.filterProps=h},6481:(e,t,n)=>{"use strict";n.d(t,{Ay:()=>s,BO:()=>a,Yn:()=>i});var r=n(8659),o=n(9452);function i(e,t,n=!0){if(!t||"string"!=typeof t)return null;if(e&&e.vars&&n){const n=`vars.${t}`.split(".").reduce(((e,t)=>e&&e[t]?e[t]:null),e);if(null!=n)return n}return t.split(".").reduce(((e,t)=>e&&null!=e[t]?e[t]:null),e)}function a(e,t,n,r=n){let o;return o="function"==typeof e?e(n):Array.isArray(e)?e[n]||r:i(e,n)||r,t&&(o=t(o,r,e)),o}const s=function(e){const{prop:t,cssProperty:n=e.prop,themeKey:s,transform:l}=e,c=e=>{if(null==e[t])return null;const c=e[t],u=i(e.theme,s)||{};return(0,o.NI)(e,c,(e=>{let o=a(u,l,e);return e===o&&"string"==typeof e&&(o=a(u,l,`${t}${"default"===e?"":(0,r.A)(e)}`,e)),!1===n?o:{[n]:o}}))};return c.propTypes={},c.filterProps=[t],c}},4188:(e,t,n)=>{"use strict";n.d(t,{A:()=>j});var r=n(8248),o=n(6481),i=n(4620);const a=function(...e){const t=e.reduce(((e,t)=>(t.filterProps.forEach((n=>{e[n]=t})),e)),{}),n=e=>Object.keys(e).reduce(((n,r)=>t[r]?(0,i.A)(n,t[r](e)):n),{});return n.propTypes={},n.filterProps=e.reduce(((e,t)=>e.concat(t.filterProps)),[]),n};var s=n(9452);function l(e){return"number"!=typeof e?e:`${e}px solid`}function c(e,t){return(0,o.Ay)({prop:e,themeKey:"borders",transform:t})}const u=c("border",l),d=c("borderTop",l),h=c("borderRight",l),p=c("borderBottom",l),f=c("borderLeft",l),m=c("borderColor"),g=c("borderTopColor"),y=c("borderRightColor"),b=c("borderBottomColor"),v=c("borderLeftColor"),x=c("outline",l),k=c("outlineColor"),w=e=>{if(void 0!==e.borderRadius&&null!==e.borderRadius){const t=(0,r.MA)(e.theme,"shape.borderRadius",4,"borderRadius"),n=e=>({borderRadius:(0,r._W)(t,e)});return(0,s.NI)(e,e.borderRadius,n)}return null};w.propTypes={},w.filterProps=["borderRadius"];a(u,d,h,p,f,m,g,y,b,v,w,x,k);const _=e=>{if(void 0!==e.gap&&null!==e.gap){const t=(0,r.MA)(e.theme,"spacing",8,"gap"),n=e=>({gap:(0,r._W)(t,e)});return(0,s.NI)(e,e.gap,n)}return null};_.propTypes={},_.filterProps=["gap"];const S=e=>{if(void 0!==e.columnGap&&null!==e.columnGap){const t=(0,r.MA)(e.theme,"spacing",8,"columnGap"),n=e=>({columnGap:(0,r._W)(t,e)});return(0,s.NI)(e,e.columnGap,n)}return null};S.propTypes={},S.filterProps=["columnGap"];const E=e=>{if(void 0!==e.rowGap&&null!==e.rowGap){const t=(0,r.MA)(e.theme,"spacing",8,"rowGap"),n=e=>({rowGap:(0,r._W)(t,e)});return(0,s.NI)(e,e.rowGap,n)}return null};E.propTypes={},E.filterProps=["rowGap"];a(_,S,E,(0,o.Ay)({prop:"gridColumn"}),(0,o.Ay)({prop:"gridRow"}),(0,o.Ay)({prop:"gridAutoFlow"}),(0,o.Ay)({prop:"gridAutoColumns"}),(0,o.Ay)({prop:"gridAutoRows"}),(0,o.Ay)({prop:"gridTemplateColumns"}),(0,o.Ay)({prop:"gridTemplateRows"}),(0,o.Ay)({prop:"gridTemplateAreas"}),(0,o.Ay)({prop:"gridArea"}));function C(e,t){return"grey"===t?t:e}a((0,o.Ay)({prop:"color",themeKey:"palette",transform:C}),(0,o.Ay)({prop:"bgcolor",cssProperty:"backgroundColor",themeKey:"palette",transform:C}),(0,o.Ay)({prop:"backgroundColor",themeKey:"palette",transform:C}));function A(e){return e<=1&&0!==e?100*e+"%":e}const O=(0,o.Ay)({prop:"width",transform:A}),M=e=>{if(void 0!==e.maxWidth&&null!==e.maxWidth){const t=t=>{var n,r;const o=(null==(n=e.theme)||null==(n=n.breakpoints)||null==(n=n.values)?void 0:n[t])||s.zu[t];return o?"px"!==(null==(r=e.theme)||null==(r=r.breakpoints)?void 0:r.unit)?{maxWidth:`${o}${e.theme.breakpoints.unit}`}:{maxWidth:o}:{maxWidth:A(t)}};return(0,s.NI)(e,e.maxWidth,t)}return null};M.filterProps=["maxWidth"];const R=(0,o.Ay)({prop:"minWidth",transform:A}),P=(0,o.Ay)({prop:"height",transform:A}),T=(0,o.Ay)({prop:"maxHeight",transform:A}),z=(0,o.Ay)({prop:"minHeight",transform:A}),j=((0,o.Ay)({prop:"size",cssProperty:"width",transform:A}),(0,o.Ay)({prop:"size",cssProperty:"height",transform:A}),a(O,M,R,P,T,z,(0,o.Ay)({prop:"boxSizing"})),{border:{themeKey:"borders",transform:l},borderTop:{themeKey:"borders",transform:l},borderRight:{themeKey:"borders",transform:l},borderBottom:{themeKey:"borders",transform:l},borderLeft:{themeKey:"borders",transform:l},borderColor:{themeKey:"palette"},borderTopColor:{themeKey:"palette"},borderRightColor:{themeKey:"palette"},borderBottomColor:{themeKey:"palette"},borderLeftColor:{themeKey:"palette"},outline:{themeKey:"borders",transform:l},outlineColor:{themeKey:"palette"},borderRadius:{themeKey:"shape.borderRadius",style:w},color:{themeKey:"palette",transform:C},bgcolor:{themeKey:"palette",cssProperty:"backgroundColor",transform:C},backgroundColor:{themeKey:"palette",transform:C},p:{style:r.Ms},pt:{style:r.Ms},pr:{style:r.Ms},pb:{style:r.Ms},pl:{style:r.Ms},px:{style:r.Ms},py:{style:r.Ms},padding:{style:r.Ms},paddingTop:{style:r.Ms},paddingRight:{style:r.Ms},paddingBottom:{style:r.Ms},paddingLeft:{style:r.Ms},paddingX:{style:r.Ms},paddingY:{style:r.Ms},paddingInline:{style:r.Ms},paddingInlineStart:{style:r.Ms},paddingInlineEnd:{style:r.Ms},paddingBlock:{style:r.Ms},paddingBlockStart:{style:r.Ms},paddingBlockEnd:{style:r.Ms},m:{style:r.Lc},mt:{style:r.Lc},mr:{style:r.Lc},mb:{style:r.Lc},ml:{style:r.Lc},mx:{style:r.Lc},my:{style:r.Lc},margin:{style:r.Lc},marginTop:{style:r.Lc},marginRight:{style:r.Lc},marginBottom:{style:r.Lc},marginLeft:{style:r.Lc},marginX:{style:r.Lc},marginY:{style:r.Lc},marginInline:{style:r.Lc},marginInlineStart:{style:r.Lc},marginInlineEnd:{style:r.Lc},marginBlock:{style:r.Lc},marginBlockStart:{style:r.Lc},marginBlockEnd:{style:r.Lc},displayPrint:{cssProperty:!1,transform:e=>({"@media print":{display:e}})},display:{},overflow:{},textOverflow:{},visibility:{},whiteSpace:{},flexBasis:{},flexDirection:{},flexWrap:{},justifyContent:{},alignItems:{},alignContent:{},order:{},flex:{},flexGrow:{},flexShrink:{},alignSelf:{},justifyItems:{},justifySelf:{},gap:{style:_},rowGap:{style:E},columnGap:{style:S},gridColumn:{},gridRow:{},gridAutoFlow:{},gridAutoColumns:{},gridAutoRows:{},gridTemplateColumns:{},gridTemplateRows:{},gridTemplateAreas:{},gridArea:{},position:{},zIndex:{themeKey:"zIndex"},top:{},right:{},bottom:{},left:{},boxShadow:{themeKey:"shadows"},width:{transform:A},maxWidth:{style:M},minWidth:{transform:A},height:{transform:A},maxHeight:{transform:A},minHeight:{transform:A},boxSizing:{},fontFamily:{themeKey:"typography"},fontSize:{themeKey:"typography"},fontStyle:{themeKey:"typography"},fontWeight:{themeKey:"typography"},letterSpacing:{},textTransform:{},lineHeight:{},textAlign:{},typography:{cssProperty:!1,themeKey:"typography"}})},9599:(e,t,n)=>{"use strict";n.d(t,{A:()=>c});var r=n(8168),o=n(8587),i=n(4521),a=n(4188);const s=["sx"],l=e=>{var t,n;const r={systemProps:{},otherProps:{}},o=null!=(t=null==e||null==(n=e.theme)?void 0:n.unstable_sxConfig)?t:a.A;return Object.keys(e).forEach((t=>{o[t]?r.systemProps[t]=e[t]:r.otherProps[t]=e[t]})),r};function c(e){const{sx:t}=e,n=(0,o.A)(e,s),{systemProps:a,otherProps:c}=l(n);let u;return u=Array.isArray(t)?[a,...t]:"function"==typeof t?(...e)=>{const n=t(...e);return(0,i.Q)(n)?(0,r.A)({},a,n):a}:(0,r.A)({},a,t),(0,r.A)({},c,{sx:u})}},3857:(e,t,n)=>{"use strict";n.r(t),n.d(t,{default:()=>r.A,extendSxProp:()=>o.A,unstable_createStyleFunctionSx:()=>r.k,unstable_defaultSxConfig:()=>i.A});var r=n(3571),o=n(9599),i=n(4188)},3571:(e,t,n)=>{"use strict";n.d(t,{A:()=>u,k:()=>l});var r=n(8659),o=n(4620),i=n(6481),a=n(9452),s=n(4188);function l(){function e(e,t,n,o){const s={[e]:t,theme:n},l=o[e];if(!l)return{[e]:t};const{cssProperty:c=e,themeKey:u,transform:d,style:h}=l;if(null==t)return null;if("typography"===u&&"inherit"===t)return{[e]:t};const p=(0,i.Yn)(n,u)||{};if(h)return h(s);return(0,a.NI)(s,t,(t=>{let n=(0,i.BO)(p,d,t);return t===n&&"string"==typeof t&&(n=(0,i.BO)(p,d,`${e}${"default"===t?"":(0,r.A)(t)}`,t)),!1===c?n:{[c]:n}}))}return function t(n){var r;const{sx:i,theme:l={}}=n||{};if(!i)return null;const c=null!=(r=l.unstable_sxConfig)?r:s.A;function u(n){let r=n;if("function"==typeof n)r=n(l);else if("object"!=typeof n)return n;if(!r)return null;const i=(0,a.EU)(l.breakpoints),s=Object.keys(i);let u=i;return Object.keys(r).forEach((n=>{const i=(s=r[n],d=l,"function"==typeof s?s(d):s);var s,d;if(null!=i)if("object"==typeof i)if(c[n])u=(0,o.A)(u,e(n,i,l,c));else{const e=(0,a.NI)({theme:l},i,(e=>({[n]:e})));!function(...e){const t=e.reduce(((e,t)=>e.concat(Object.keys(t))),[]),n=new Set(t);return e.every((e=>n.size===Object.keys(e).length))}(e,i)?u=(0,o.A)(u,e):u[n]=t({sx:i,theme:l})}else u=(0,o.A)(u,e(n,i,l,c))})),(0,a.vf)(s,u)}return Array.isArray(i)?i.map(u):u(i)}}const c=l();c.filterProps=["sx"];const u=c},8659:(e,t,n)=>{"use strict";n.d(t,{A:()=>o});var r=n(5697);function o(e){if("string"!=typeof e)throw new Error((0,r.A)(7));return e.charAt(0).toUpperCase()+e.slice(1)}},8217:(e,t,n)=>{"use strict";n.r(t),n.d(t,{default:()=>r.A});var r=n(8659)},6379:(e,t,n)=>{"use strict";n.r(t),n.d(t,{default:()=>r});const r=function(e,t=Number.MIN_SAFE_INTEGER,n=Number.MAX_SAFE_INTEGER){return Math.max(t,Math.min(e,n))}},4521:(e,t,n)=>{"use strict";n.d(t,{A:()=>a,Q:()=>o});var r=n(8168);function o(e){if("object"!=typeof e||null===e)return!1;const t=Object.getPrototypeOf(e);return!(null!==t&&t!==Object.prototype&&null!==Object.getPrototypeOf(t)||Symbol.toStringTag in e||Symbol.iterator in e)}function i(e){if(!o(e))return e;const t={};return Object.keys(e).forEach((n=>{t[n]=i(e[n])})),t}function a(e,t,n={clone:!0}){const s=n.clone?(0,r.A)({},e):e;return o(e)&&o(t)&&Object.keys(t).forEach((r=>{"__proto__"!==r&&(o(t[r])&&r in e&&o(e[r])?s[r]=a(e[r],t[r],n):n.clone?s[r]=o(t[r])?i(t[r]):t[r]:s[r]=t[r])})),s}},819:(e,t,n)=>{"use strict";n.r(t),n.d(t,{default:()=>r.A,isPlainObject:()=>r.Q});var r=n(4521)},5697:(e,t,n)=>{"use strict";function r(e){let t="https://mui.com/production-error/?code="+e;for(let e=1;e<arguments.length;e+=1)t+="&args[]="+encodeURIComponent(arguments[e]);return"Minified MUI error #"+e+"; visit "+t+" for the full message."}n.d(t,{A:()=>r})},2108:(e,t,n)=>{"use strict";n.r(t),n.d(t,{default:()=>r.A});var r=n(5697)},1172:(e,t,n)=>{"use strict";n.r(t),n.d(t,{default:()=>l,getFunctionName:()=>i});var r=n(5492);const o=/^\s*function(?:\s|\s*\/\*.*\*\/\s*)+([^(\s/]*)\s*/;function i(e){const t=`${e}`.match(o);return t&&t[1]||""}function a(e,t=""){return e.displayName||e.name||i(e)||t}function s(e,t,n){const r=a(t);return e.displayName||(""!==r?`${n}(${r})`:n)}function l(e){if(null!=e){if("string"==typeof e)return e;if("function"==typeof e)return a(e,"Component");if("object"==typeof e)switch(e.$$typeof){case r.ForwardRef:return s(e,e.render,"ForwardRef");case r.Memo:return s(e,e.type,"memo");default:return}}}},7064:(e,t)=>{"use strict";var n,r=Symbol.for("react.element"),o=Symbol.for("react.portal"),i=Symbol.for("react.fragment"),a=Symbol.for("react.strict_mode"),s=Symbol.for("react.profiler"),l=Symbol.for("react.provider"),c=Symbol.for("react.context"),u=Symbol.for("react.server_context"),d=Symbol.for("react.forward_ref"),h=Symbol.for("react.suspense"),p=Symbol.for("react.suspense_list"),f=Symbol.for("react.memo"),m=Symbol.for("react.lazy"),g=Symbol.for("react.offscreen");
/**
 * @license React
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function y(e){if("object"==typeof e&&null!==e){var t=e.$$typeof;switch(t){case r:switch(e=e.type){case i:case s:case a:case h:case p:return e;default:switch(e=e&&e.$$typeof){case u:case c:case d:case m:case f:case l:return e;default:return t}}case o:return t}}}n=Symbol.for("react.module.reference"),t.ForwardRef=d,t.Memo=f},5492:(e,t,n)=>{"use strict";e.exports=n(7064)},7861:e=>{"use strict";var t=Object.prototype.hasOwnProperty,n="~";function r(){}function o(e,t,n){this.fn=e,this.context=t,this.once=n||!1}function i(e,t,r,i,a){if("function"!=typeof r)throw new TypeError("The listener must be a function");var s=new o(r,i||e,a),l=n?n+t:t;return e._events[l]?e._events[l].fn?e._events[l]=[e._events[l],s]:e._events[l].push(s):(e._events[l]=s,e._eventsCount++),e}function a(e,t){0==--e._eventsCount?e._events=new r:delete e._events[t]}function s(){this._events=new r,this._eventsCount=0}Object.create&&(r.prototype=Object.create(null),(new r).__proto__||(n=!1)),s.prototype.eventNames=function(){var e,r,o=[];if(0===this._eventsCount)return o;for(r in e=this._events)t.call(e,r)&&o.push(n?r.slice(1):r);return Object.getOwnPropertySymbols?o.concat(Object.getOwnPropertySymbols(e)):o},s.prototype.listeners=function(e){var t=n?n+e:e,r=this._events[t];if(!r)return[];if(r.fn)return[r.fn];for(var o=0,i=r.length,a=new Array(i);o<i;o++)a[o]=r[o].fn;return a},s.prototype.listenerCount=function(e){var t=n?n+e:e,r=this._events[t];return r?r.fn?1:r.length:0},s.prototype.emit=function(e,t,r,o,i,a){var s=n?n+e:e;if(!this._events[s])return!1;var l,c,u=this._events[s],d=arguments.length;if(u.fn){switch(u.once&&this.removeListener(e,u.fn,void 0,!0),d){case 1:return u.fn.call(u.context),!0;case 2:return u.fn.call(u.context,t),!0;case 3:return u.fn.call(u.context,t,r),!0;case 4:return u.fn.call(u.context,t,r,o),!0;case 5:return u.fn.call(u.context,t,r,o,i),!0;case 6:return u.fn.call(u.context,t,r,o,i,a),!0}for(c=1,l=new Array(d-1);c<d;c++)l[c-1]=arguments[c];u.fn.apply(u.context,l)}else{var h,p=u.length;for(c=0;c<p;c++)switch(u[c].once&&this.removeListener(e,u[c].fn,void 0,!0),d){case 1:u[c].fn.call(u[c].context);break;case 2:u[c].fn.call(u[c].context,t);break;case 3:u[c].fn.call(u[c].context,t,r);break;case 4:u[c].fn.call(u[c].context,t,r,o);break;default:if(!l)for(h=1,l=new Array(d-1);h<d;h++)l[h-1]=arguments[h];u[c].fn.apply(u[c].context,l)}}return!0},s.prototype.on=function(e,t,n){return i(this,e,t,n,!1)},s.prototype.once=function(e,t,n){return i(this,e,t,n,!0)},s.prototype.removeListener=function(e,t,r,o){var i=n?n+e:e;if(!this._events[i])return this;if(!t)return a(this,i),this;var s=this._events[i];if(s.fn)s.fn!==t||o&&!s.once||r&&s.context!==r||a(this,i);else{for(var l=0,c=[],u=s.length;l<u;l++)(s[l].fn!==t||o&&!s[l].once||r&&s[l].context!==r)&&c.push(s[l]);c.length?this._events[i]=1===c.length?c[0]:c:a(this,i)}return this},s.prototype.removeAllListeners=function(e){var t;return e?(t=n?n+e:e,this._events[t]&&a(this,t)):(this._events=new r,this._eventsCount=0),this},s.prototype.off=s.prototype.removeListener,s.prototype.addListener=s.prototype.on,s.prefixed=n,s.EventEmitter=s,e.exports=s},5625:(e,t,n)=>{var r;
/*!
  Copyright (c) 2015 Jed Watson.
  Based on code that is Copyright 2013-2015, Facebook, Inc.
  All rights reserved.
*/!function(){"use strict";var o=!("undefined"==typeof window||!window.document||!window.document.createElement),i={canUseDOM:o,canUseWorkers:"undefined"!=typeof Worker,canUseEventListeners:o&&!(!window.addEventListener&&!window.attachEvent),canUseViewport:o&&!!window.screen};void 0===(r=function(){return i}.call(t,n,t,e))||(e.exports=r)}()},2673:(e,t,n)=>{"use strict";n.d(t,{A:()=>c});var r=n(1594);
/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const o=e=>{const t=(e=>e.replace(/^([A-Z])|[\s-_]+(\w)/g,((e,t,n)=>n?n.toUpperCase():t.toLowerCase())))(e);return t.charAt(0).toUpperCase()+t.slice(1)},i=(...e)=>e.filter(((e,t,n)=>Boolean(e)&&""!==e.trim()&&n.indexOf(e)===t)).join(" ").trim(),a=e=>{for(const t in e)if(t.startsWith("aria-")||"role"===t||"title"===t)return!0};
/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var s={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};
/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const l=(0,r.forwardRef)((({color:e="currentColor",size:t=24,strokeWidth:n=2,absoluteStrokeWidth:o,className:l="",children:c,iconNode:u,...d},h)=>(0,r.createElement)("svg",{ref:h,...s,width:t,height:t,stroke:e,strokeWidth:o?24*Number(n)/Number(t):n,className:i("lucide",l),...!c&&!a(d)&&{"aria-hidden":"true"},...d},[...u.map((([e,t])=>(0,r.createElement)(e,t))),...Array.isArray(c)?c:[c]]))),c=(e,t)=>{const n=(0,r.forwardRef)((({className:n,...a},s)=>{return(0,r.createElement)(l,{ref:s,iconNode:t,className:i(`lucide-${c=o(e),c.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${e}`,n),...a});var c}));return n.displayName=o(e),n}},2480:(e,t,n)=>{"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(2673).A)("chevron-down",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]])},8897:(e,t,n)=>{"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(2673).A)("chevron-left",[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]])},8744:(e,t,n)=>{"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(2673).A)("chevron-right",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]])},9685:(e,t,n)=>{"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(2673).A)("chevron-up",[["path",{d:"m18 15-6-6-6 6",key:"153udz"}]])},1422:(e,t,n)=>{"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(2673).A)("chevrons-left",[["path",{d:"m11 17-5-5 5-5",key:"13zhaf"}],["path",{d:"m18 17-5-5 5-5",key:"h8a8et"}]])},2297:(e,t,n)=>{"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(2673).A)("chevrons-right",[["path",{d:"m6 17 5-5-5-5",key:"xnjwq"}],["path",{d:"m13 17 5-5-5-5",key:"17xmmf"}]])},2973:(e,t,n)=>{"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(2673).A)("circle-alert",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]])},7192:(e,t,n)=>{"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(2673).A)("circle-check-big",[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]])},6190:(e,t,n)=>{"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(2673).A)("info",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]])},1546:(e,t,n)=>{"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(2673).A)("loader-circle",[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]])},8086:(e,t,n)=>{"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(2673).A)("pause",[["rect",{x:"14",y:"3",width:"5",height:"18",rx:"1",key:"kaeet6"}],["rect",{x:"5",y:"3",width:"5",height:"18",rx:"1",key:"1wsw3u"}]])},8160:(e,t,n)=>{"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(2673).A)("play",[["path",{d:"M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",key:"10ikf1"}]])},6535:(e,t,n)=>{"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(2673).A)("save",[["path",{d:"M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",key:"1c8476"}],["path",{d:"M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7",key:"1ydtos"}],["path",{d:"M7 3v4a1 1 0 0 0 1 1h7",key:"t51u73"}]])},8785:(e,t,n)=>{"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(2673).A)("square",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}]])},1666:(e,t,n)=>{"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(2673).A)("star",[["path",{d:"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",key:"r04s7s"}]])},812:(e,t,n)=>{"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(2673).A)("x",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]])},3005:e=>{"use strict";e.exports=(e,t)=>(t=t||(()=>{}),e.then((e=>new Promise((e=>{e(t())})).then((()=>e))),(e=>new Promise((e=>{e(t())})).then((()=>{throw e})))))},9171:(e,t,n)=>{"use strict";const r=n(7861),o=n(9761),i=n(7577),a=()=>{},s=new o.TimeoutError;t.A=class extends r{constructor(e){var t,n,r,o;if(super(),this._intervalCount=0,this._intervalEnd=0,this._pendingCount=0,this._resolveEmpty=a,this._resolveIdle=a,!("number"==typeof(e=Object.assign({carryoverConcurrencyCount:!1,intervalCap:1/0,interval:0,concurrency:1/0,autoStart:!0,queueClass:i.default},e)).intervalCap&&e.intervalCap>=1))throw new TypeError(`Expected \`intervalCap\` to be a number from 1 and up, got \`${null!==(n=null===(t=e.intervalCap)||void 0===t?void 0:t.toString())&&void 0!==n?n:""}\` (${typeof e.intervalCap})`);if(void 0===e.interval||!(Number.isFinite(e.interval)&&e.interval>=0))throw new TypeError(`Expected \`interval\` to be a finite number >= 0, got \`${null!==(o=null===(r=e.interval)||void 0===r?void 0:r.toString())&&void 0!==o?o:""}\` (${typeof e.interval})`);this._carryoverConcurrencyCount=e.carryoverConcurrencyCount,this._isIntervalIgnored=e.intervalCap===1/0||0===e.interval,this._intervalCap=e.intervalCap,this._interval=e.interval,this._queue=new e.queueClass,this._queueClass=e.queueClass,this.concurrency=e.concurrency,this._timeout=e.timeout,this._throwOnTimeout=!0===e.throwOnTimeout,this._isPaused=!1===e.autoStart}get _doesIntervalAllowAnother(){return this._isIntervalIgnored||this._intervalCount<this._intervalCap}get _doesConcurrentAllowAnother(){return this._pendingCount<this._concurrency}_next(){this._pendingCount--,this._tryToStartAnother(),this.emit("next")}_resolvePromises(){this._resolveEmpty(),this._resolveEmpty=a,0===this._pendingCount&&(this._resolveIdle(),this._resolveIdle=a,this.emit("idle"))}_onResumeInterval(){this._onInterval(),this._initializeIntervalIfNeeded(),this._timeoutId=void 0}_isIntervalPaused(){const e=Date.now();if(void 0===this._intervalId){const t=this._intervalEnd-e;if(!(t<0))return void 0===this._timeoutId&&(this._timeoutId=setTimeout((()=>{this._onResumeInterval()}),t)),!0;this._intervalCount=this._carryoverConcurrencyCount?this._pendingCount:0}return!1}_tryToStartAnother(){if(0===this._queue.size)return this._intervalId&&clearInterval(this._intervalId),this._intervalId=void 0,this._resolvePromises(),!1;if(!this._isPaused){const e=!this._isIntervalPaused();if(this._doesIntervalAllowAnother&&this._doesConcurrentAllowAnother){const t=this._queue.dequeue();return!!t&&(this.emit("active"),t(),e&&this._initializeIntervalIfNeeded(),!0)}}return!1}_initializeIntervalIfNeeded(){this._isIntervalIgnored||void 0!==this._intervalId||(this._intervalId=setInterval((()=>{this._onInterval()}),this._interval),this._intervalEnd=Date.now()+this._interval)}_onInterval(){0===this._intervalCount&&0===this._pendingCount&&this._intervalId&&(clearInterval(this._intervalId),this._intervalId=void 0),this._intervalCount=this._carryoverConcurrencyCount?this._pendingCount:0,this._processQueue()}_processQueue(){for(;this._tryToStartAnother(););}get concurrency(){return this._concurrency}set concurrency(e){if(!("number"==typeof e&&e>=1))throw new TypeError(`Expected \`concurrency\` to be a number from 1 and up, got \`${e}\` (${typeof e})`);this._concurrency=e,this._processQueue()}async add(e,t={}){return new Promise(((n,r)=>{this._queue.enqueue((async()=>{this._pendingCount++,this._intervalCount++;try{const i=void 0===this._timeout&&void 0===t.timeout?e():o.default(Promise.resolve(e()),void 0===t.timeout?this._timeout:t.timeout,(()=>{(void 0===t.throwOnTimeout?this._throwOnTimeout:t.throwOnTimeout)&&r(s)}));n(await i)}catch(e){r(e)}this._next()}),t),this._tryToStartAnother(),this.emit("add")}))}async addAll(e,t){return Promise.all(e.map((async e=>this.add(e,t))))}start(){return this._isPaused?(this._isPaused=!1,this._processQueue(),this):this}pause(){this._isPaused=!0}clear(){this._queue=new this._queueClass}async onEmpty(){if(0!==this._queue.size)return new Promise((e=>{const t=this._resolveEmpty;this._resolveEmpty=()=>{t(),e()}}))}async onIdle(){if(0!==this._pendingCount||0!==this._queue.size)return new Promise((e=>{const t=this._resolveIdle;this._resolveIdle=()=>{t(),e()}}))}get size(){return this._queue.size}sizeBy(e){return this._queue.filter(e).length}get pending(){return this._pendingCount}get isPaused(){return this._isPaused}get timeout(){return this._timeout}set timeout(e){this._timeout=e}}},8639:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t,n){let r=0,o=e.length;for(;o>0;){const i=o/2|0;let a=r+i;n(e[a],t)<=0?(r=++a,o-=i+1):o=i}return r}},7577:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0});const r=n(8639);t.default=class{constructor(){this._queue=[]}enqueue(e,t){const n={priority:(t=Object.assign({priority:0},t)).priority,run:e};if(this.size&&this._queue[this.size-1].priority>=t.priority)return void this._queue.push(n);const o=r.default(this._queue,n,((e,t)=>t.priority-e.priority));this._queue.splice(o,0,n)}dequeue(){const e=this._queue.shift();return null==e?void 0:e.run}filter(e){return this._queue.filter((t=>t.priority===e.priority)).map((e=>e.run))}get size(){return this._queue.length}}},9761:(e,t,n)=>{"use strict";const r=n(3005);class o extends Error{constructor(e){super(e),this.name="TimeoutError"}}const i=(e,t,n)=>new Promise(((i,a)=>{if("number"!=typeof t||t<0)throw new TypeError("Expected `milliseconds` to be a positive number");if(t===1/0)return void i(e);const s=setTimeout((()=>{if("function"==typeof n){try{i(n())}catch(e){a(e)}return}const r=n instanceof Error?n:new o("string"==typeof n?n:`Promise timed out after ${t} milliseconds`);"function"==typeof e.cancel&&e.cancel(),a(r)}),t);r(e.then(i,a),(()=>{clearTimeout(s)}))}));e.exports=i,e.exports.default=i,e.exports.TimeoutError=o},8043:(e,t,n)=>{"use strict";var r=n(3004);function o(){}function i(){}i.resetWarningCache=o,e.exports=function(){function e(e,t,n,o,i,a){if(a!==r){var s=new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");throw s.name="Invariant Violation",s}}function t(){return e}e.isRequired=e;var n={array:e,bigint:e,bool:e,func:e,number:e,object:e,string:e,symbol:e,any:e,arrayOf:t,element:e,elementType:e,instanceOf:t,node:e,objectOf:t,oneOf:t,oneOfType:t,shape:t,exact:t,checkPropTypes:i,resetWarningCache:o};return n.PropTypes=n,n}},7639:(e,t,n)=>{e.exports=n(8043)()},3004:e=>{"use strict";e.exports="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED"},4277:(e,t,n)=>{"use strict";function r(){var e=this.constructor.getDerivedStateFromProps(this.props,this.state);null!=e&&this.setState(e)}function o(e){this.setState(function(t){var n=this.constructor.getDerivedStateFromProps(e,t);return null!=n?n:null}.bind(this))}function i(e,t){try{var n=this.props,r=this.state;this.props=e,this.state=t,this.__reactInternalSnapshotFlag=!0,this.__reactInternalSnapshot=this.getSnapshotBeforeUpdate(n,r)}finally{this.props=n,this.state=r}}function a(e){var t=e.prototype;if(!t||!t.isReactComponent)throw new Error("Can only polyfill class components");if("function"!=typeof e.getDerivedStateFromProps&&"function"!=typeof t.getSnapshotBeforeUpdate)return e;var n=null,a=null,s=null;if("function"==typeof t.componentWillMount?n="componentWillMount":"function"==typeof t.UNSAFE_componentWillMount&&(n="UNSAFE_componentWillMount"),"function"==typeof t.componentWillReceiveProps?a="componentWillReceiveProps":"function"==typeof t.UNSAFE_componentWillReceiveProps&&(a="UNSAFE_componentWillReceiveProps"),"function"==typeof t.componentWillUpdate?s="componentWillUpdate":"function"==typeof t.UNSAFE_componentWillUpdate&&(s="UNSAFE_componentWillUpdate"),null!==n||null!==a||null!==s){var l=e.displayName||e.name,c="function"==typeof e.getDerivedStateFromProps?"getDerivedStateFromProps()":"getSnapshotBeforeUpdate()";throw Error("Unsafe legacy lifecycles will not be called for components using new component APIs.\n\n"+l+" uses "+c+" but also contains the following legacy lifecycles:"+(null!==n?"\n  "+n:"")+(null!==a?"\n  "+a:"")+(null!==s?"\n  "+s:"")+"\n\nThe above lifecycles should be removed. Learn more about this warning here:\nhttps://fb.me/react-async-component-lifecycle-hooks")}if("function"==typeof e.getDerivedStateFromProps&&(t.componentWillMount=r,t.componentWillReceiveProps=o),"function"==typeof t.getSnapshotBeforeUpdate){if("function"!=typeof t.componentDidUpdate)throw new Error("Cannot polyfill getSnapshotBeforeUpdate() for components that do not define componentDidUpdate() on the prototype");t.componentWillUpdate=i;var u=t.componentDidUpdate;t.componentDidUpdate=function(e,t,n){var r=this.__reactInternalSnapshotFlag?this.__reactInternalSnapshot:n;u.call(this,e,t,r)}}return e}n.r(t),n.d(t,{polyfill:()=>a}),r.__suppressDeprecationWarning=!0,o.__suppressDeprecationWarning=!0,i.__suppressDeprecationWarning=!0},2558:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.bodyOpenClassName=t.portalClassName=void 0;var r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},o=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),i=n(1594),a=f(i),s=f(n(5206)),l=f(n(7639)),c=f(n(9648)),u=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}(n(9976)),d=n(6244),h=f(d),p=n(4277);function f(e){return e&&e.__esModule?e:{default:e}}function m(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}var g=t.portalClassName="ReactModalPortal",y=t.bodyOpenClassName="ReactModal__Body--open",b=d.canUseDOM&&void 0!==s.default.createPortal,v=function(e){return document.createElement(e)},x=function(){return b?s.default.createPortal:s.default.unstable_renderSubtreeIntoContainer};function k(e){return e()}var w=function(e){function t(){var e,n,o;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);for(var i=arguments.length,l=Array(i),u=0;u<i;u++)l[u]=arguments[u];return n=o=m(this,(e=t.__proto__||Object.getPrototypeOf(t)).call.apply(e,[this].concat(l))),o.removePortal=function(){!b&&s.default.unmountComponentAtNode(o.node);var e=k(o.props.parentSelector);e&&e.contains(o.node)?e.removeChild(o.node):console.warn('React-Modal: "parentSelector" prop did not returned any DOM element. Make sure that the parent element is unmounted to avoid any memory leaks.')},o.portalRef=function(e){o.portal=e},o.renderPortal=function(e){var n=x()(o,a.default.createElement(c.default,r({defaultStyles:t.defaultStyles},e)),o.node);o.portalRef(n)},m(o,n)}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),o(t,[{key:"componentDidMount",value:function(){d.canUseDOM&&(b||(this.node=v("div")),this.node.className=this.props.portalClassName,k(this.props.parentSelector).appendChild(this.node),!b&&this.renderPortal(this.props))}},{key:"getSnapshotBeforeUpdate",value:function(e){return{prevParent:k(e.parentSelector),nextParent:k(this.props.parentSelector)}}},{key:"componentDidUpdate",value:function(e,t,n){if(d.canUseDOM){var r=this.props,o=r.isOpen,i=r.portalClassName;e.portalClassName!==i&&(this.node.className=i);var a=n.prevParent,s=n.nextParent;s!==a&&(a.removeChild(this.node),s.appendChild(this.node)),(e.isOpen||o)&&!b&&this.renderPortal(this.props)}}},{key:"componentWillUnmount",value:function(){if(d.canUseDOM&&this.node&&this.portal){var e=this.portal.state,t=Date.now(),n=e.isOpen&&this.props.closeTimeoutMS&&(e.closesAt||t+this.props.closeTimeoutMS);n?(e.beforeClose||this.portal.closeWithTimeout(),setTimeout(this.removePortal,n-t)):this.removePortal()}}},{key:"render",value:function(){return d.canUseDOM&&b?(!this.node&&b&&(this.node=v("div")),x()(a.default.createElement(c.default,r({ref:this.portalRef,defaultStyles:t.defaultStyles},this.props)),this.node)):null}}],[{key:"setAppElement",value:function(e){u.setElement(e)}}]),t}(i.Component);w.propTypes={isOpen:l.default.bool.isRequired,style:l.default.shape({content:l.default.object,overlay:l.default.object}),portalClassName:l.default.string,bodyOpenClassName:l.default.string,htmlOpenClassName:l.default.string,className:l.default.oneOfType([l.default.string,l.default.shape({base:l.default.string.isRequired,afterOpen:l.default.string.isRequired,beforeClose:l.default.string.isRequired})]),overlayClassName:l.default.oneOfType([l.default.string,l.default.shape({base:l.default.string.isRequired,afterOpen:l.default.string.isRequired,beforeClose:l.default.string.isRequired})]),appElement:l.default.oneOfType([l.default.instanceOf(h.default),l.default.instanceOf(d.SafeHTMLCollection),l.default.instanceOf(d.SafeNodeList),l.default.arrayOf(l.default.instanceOf(h.default))]),onAfterOpen:l.default.func,onRequestClose:l.default.func,closeTimeoutMS:l.default.number,ariaHideApp:l.default.bool,shouldFocusAfterRender:l.default.bool,shouldCloseOnOverlayClick:l.default.bool,shouldReturnFocusAfterClose:l.default.bool,preventScroll:l.default.bool,parentSelector:l.default.func,aria:l.default.object,data:l.default.object,role:l.default.string,contentLabel:l.default.string,shouldCloseOnEsc:l.default.bool,overlayRef:l.default.func,contentRef:l.default.func,id:l.default.string,overlayElement:l.default.func,contentElement:l.default.func},w.defaultProps={isOpen:!1,portalClassName:g,bodyOpenClassName:y,role:"dialog",ariaHideApp:!0,closeTimeoutMS:0,shouldFocusAfterRender:!0,shouldCloseOnEsc:!0,shouldCloseOnOverlayClick:!0,shouldReturnFocusAfterClose:!0,preventScroll:!1,parentSelector:function(){return document.body},overlayElement:function(e,t){return a.default.createElement("div",e,t)},contentElement:function(e,t){return a.default.createElement("div",e,t)}},w.defaultStyles={overlay:{position:"fixed",top:0,left:0,right:0,bottom:0,backgroundColor:"rgba(255, 255, 255, 0.75)"},content:{position:"absolute",top:"40px",left:"40px",right:"40px",bottom:"40px",border:"1px solid #ccc",background:"#fff",overflow:"auto",WebkitOverflowScrolling:"touch",borderRadius:"4px",outline:"none",padding:"20px"}},(0,p.polyfill)(w),t.default=w},9648:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},i=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),a=n(1594),s=g(n(7639)),l=m(n(1837)),c=g(n(2797)),u=m(n(9976)),d=m(n(5396)),h=n(6244),p=g(h),f=g(n(6974));function m(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}function g(e){return e&&e.__esModule?e:{default:e}}n(717);var y={overlay:"ReactModal__Overlay",content:"ReactModal__Content"},b=0,v=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var n=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.setOverlayRef=function(e){n.overlay=e,n.props.overlayRef&&n.props.overlayRef(e)},n.setContentRef=function(e){n.content=e,n.props.contentRef&&n.props.contentRef(e)},n.afterClose=function(){var e=n.props,t=e.appElement,r=e.ariaHideApp,o=e.htmlOpenClassName,i=e.bodyOpenClassName,a=e.parentSelector,s=a&&a().ownerDocument||document;i&&d.remove(s.body,i),o&&d.remove(s.getElementsByTagName("html")[0],o),r&&b>0&&0===(b-=1)&&u.show(t),n.props.shouldFocusAfterRender&&(n.props.shouldReturnFocusAfterClose?(l.returnFocus(n.props.preventScroll),l.teardownScopedFocus()):l.popWithoutFocus()),n.props.onAfterClose&&n.props.onAfterClose(),f.default.deregister(n)},n.open=function(){n.beforeOpen(),n.state.afterOpen&&n.state.beforeClose?(clearTimeout(n.closeTimer),n.setState({beforeClose:!1})):(n.props.shouldFocusAfterRender&&(l.setupScopedFocus(n.node),l.markForFocusLater()),n.setState({isOpen:!0},(function(){n.openAnimationFrame=requestAnimationFrame((function(){n.setState({afterOpen:!0}),n.props.isOpen&&n.props.onAfterOpen&&n.props.onAfterOpen({overlayEl:n.overlay,contentEl:n.content})}))})))},n.close=function(){n.props.closeTimeoutMS>0?n.closeWithTimeout():n.closeWithoutTimeout()},n.focusContent=function(){return n.content&&!n.contentHasFocus()&&n.content.focus({preventScroll:!0})},n.closeWithTimeout=function(){var e=Date.now()+n.props.closeTimeoutMS;n.setState({beforeClose:!0,closesAt:e},(function(){n.closeTimer=setTimeout(n.closeWithoutTimeout,n.state.closesAt-Date.now())}))},n.closeWithoutTimeout=function(){n.setState({beforeClose:!1,isOpen:!1,afterOpen:!1,closesAt:null},n.afterClose)},n.handleKeyDown=function(e){(function(e){return"Tab"===e.code||9===e.keyCode})(e)&&(0,c.default)(n.content,e),n.props.shouldCloseOnEsc&&function(e){return"Escape"===e.code||27===e.keyCode}(e)&&(e.stopPropagation(),n.requestClose(e))},n.handleOverlayOnClick=function(e){null===n.shouldClose&&(n.shouldClose=!0),n.shouldClose&&n.props.shouldCloseOnOverlayClick&&(n.ownerHandlesClose()?n.requestClose(e):n.focusContent()),n.shouldClose=null},n.handleContentOnMouseUp=function(){n.shouldClose=!1},n.handleOverlayOnMouseDown=function(e){n.props.shouldCloseOnOverlayClick||e.target!=n.overlay||e.preventDefault()},n.handleContentOnClick=function(){n.shouldClose=!1},n.handleContentOnMouseDown=function(){n.shouldClose=!1},n.requestClose=function(e){return n.ownerHandlesClose()&&n.props.onRequestClose(e)},n.ownerHandlesClose=function(){return n.props.onRequestClose},n.shouldBeClosed=function(){return!n.state.isOpen&&!n.state.beforeClose},n.contentHasFocus=function(){return document.activeElement===n.content||n.content.contains(document.activeElement)},n.buildClassName=function(e,t){var r="object"===(void 0===t?"undefined":o(t))?t:{base:y[e],afterOpen:y[e]+"--after-open",beforeClose:y[e]+"--before-close"},i=r.base;return n.state.afterOpen&&(i=i+" "+r.afterOpen),n.state.beforeClose&&(i=i+" "+r.beforeClose),"string"==typeof t&&t?i+" "+t:i},n.attributesFromObject=function(e,t){return Object.keys(t).reduce((function(n,r){return n[e+"-"+r]=t[r],n}),{})},n.state={afterOpen:!1,beforeClose:!1},n.shouldClose=null,n.moveFromContentToOverlay=null,n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),i(t,[{key:"componentDidMount",value:function(){this.props.isOpen&&this.open()}},{key:"componentDidUpdate",value:function(e,t){this.props.isOpen&&!e.isOpen?this.open():!this.props.isOpen&&e.isOpen&&this.close(),this.props.shouldFocusAfterRender&&this.state.isOpen&&!t.isOpen&&this.focusContent()}},{key:"componentWillUnmount",value:function(){this.state.isOpen&&this.afterClose(),clearTimeout(this.closeTimer),cancelAnimationFrame(this.openAnimationFrame)}},{key:"beforeOpen",value:function(){var e=this.props,t=e.appElement,n=e.ariaHideApp,r=e.htmlOpenClassName,o=e.bodyOpenClassName,i=e.parentSelector,a=i&&i().ownerDocument||document;o&&d.add(a.body,o),r&&d.add(a.getElementsByTagName("html")[0],r),n&&(b+=1,u.hide(t)),f.default.register(this)}},{key:"render",value:function(){var e=this.props,t=e.id,n=e.className,o=e.overlayClassName,i=e.defaultStyles,a=e.children,s=n?{}:i.content,l=o?{}:i.overlay;if(this.shouldBeClosed())return null;var c={ref:this.setOverlayRef,className:this.buildClassName("overlay",o),style:r({},l,this.props.style.overlay),onClick:this.handleOverlayOnClick,onMouseDown:this.handleOverlayOnMouseDown},u=r({id:t,ref:this.setContentRef,style:r({},s,this.props.style.content),className:this.buildClassName("content",n),tabIndex:"-1",onKeyDown:this.handleKeyDown,onMouseDown:this.handleContentOnMouseDown,onMouseUp:this.handleContentOnMouseUp,onClick:this.handleContentOnClick,role:this.props.role,"aria-label":this.props.contentLabel},this.attributesFromObject("aria",r({modal:!0},this.props.aria)),this.attributesFromObject("data",this.props.data||{}),{"data-testid":this.props.testId}),d=this.props.contentElement(u,a);return this.props.overlayElement(c,d)}}]),t}(a.Component);v.defaultProps={style:{overlay:{},content:{}},defaultStyles:{}},v.propTypes={isOpen:s.default.bool.isRequired,defaultStyles:s.default.shape({content:s.default.object,overlay:s.default.object}),style:s.default.shape({content:s.default.object,overlay:s.default.object}),className:s.default.oneOfType([s.default.string,s.default.object]),overlayClassName:s.default.oneOfType([s.default.string,s.default.object]),parentSelector:s.default.func,bodyOpenClassName:s.default.string,htmlOpenClassName:s.default.string,ariaHideApp:s.default.bool,appElement:s.default.oneOfType([s.default.instanceOf(p.default),s.default.instanceOf(h.SafeHTMLCollection),s.default.instanceOf(h.SafeNodeList),s.default.arrayOf(s.default.instanceOf(p.default))]),onAfterOpen:s.default.func,onAfterClose:s.default.func,onRequestClose:s.default.func,closeTimeoutMS:s.default.number,shouldFocusAfterRender:s.default.bool,shouldCloseOnOverlayClick:s.default.bool,shouldReturnFocusAfterClose:s.default.bool,preventScroll:s.default.bool,role:s.default.string,contentLabel:s.default.string,aria:s.default.object,data:s.default.object,children:s.default.node,shouldCloseOnEsc:s.default.bool,overlayRef:s.default.func,contentRef:s.default.func,id:s.default.string,overlayElement:s.default.func,contentElement:s.default.func,testId:s.default.string},t.default=v,e.exports=t.default},9976:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.resetState=function(){s&&(s.removeAttribute?s.removeAttribute("aria-hidden"):null!=s.length?s.forEach((function(e){return e.removeAttribute("aria-hidden")})):document.querySelectorAll(s).forEach((function(e){return e.removeAttribute("aria-hidden")})));s=null},t.log=function(){0},t.assertNodeList=l,t.setElement=function(e){var t=e;if("string"==typeof t&&a.canUseDOM){var n=document.querySelectorAll(t);l(n,t),t=n}return s=t||s},t.validateElement=c,t.hide=function(e){var t=!0,n=!1,r=void 0;try{for(var o,i=c(e)[Symbol.iterator]();!(t=(o=i.next()).done);t=!0){o.value.setAttribute("aria-hidden","true")}}catch(e){n=!0,r=e}finally{try{!t&&i.return&&i.return()}finally{if(n)throw r}}},t.show=function(e){var t=!0,n=!1,r=void 0;try{for(var o,i=c(e)[Symbol.iterator]();!(t=(o=i.next()).done);t=!0){o.value.removeAttribute("aria-hidden")}}catch(e){n=!0,r=e}finally{try{!t&&i.return&&i.return()}finally{if(n)throw r}}},t.documentNotReadyOrSSRTesting=function(){s=null};var r,o=n(9879),i=(r=o)&&r.__esModule?r:{default:r},a=n(6244);var s=null;function l(e,t){if(!e||!e.length)throw new Error("react-modal: No elements were found for selector "+t+".")}function c(e){var t=e||s;return t?Array.isArray(t)||t instanceof HTMLCollection||t instanceof NodeList?t:[t]:((0,i.default)(!1,["react-modal: App element is not defined.","Please use `Modal.setAppElement(el)` or set `appElement={el}`.","This is needed so screen readers don't see main content","when modal is opened. It is not recommended, but you can opt-out","by setting `ariaHideApp={false}`."].join(" ")),[])}},717:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.resetState=function(){for(var e=[a,s],t=0;t<e.length;t++){var n=e[t];n&&(n.parentNode&&n.parentNode.removeChild(n))}a=s=null,l=[]},t.log=function(){console.log("bodyTrap ----------"),console.log(l.length);for(var e=[a,s],t=0;t<e.length;t++){var n=e[t]||{};console.log(n.nodeName,n.className,n.id)}console.log("edn bodyTrap ----------")};var r,o=n(6974),i=(r=o)&&r.__esModule?r:{default:r};var a=void 0,s=void 0,l=[];function c(){0!==l.length&&l[l.length-1].focusContent()}i.default.subscribe((function(e,t){a||s||((a=document.createElement("div")).setAttribute("data-react-modal-body-trap",""),a.style.position="absolute",a.style.opacity="0",a.setAttribute("tabindex","0"),a.addEventListener("focus",c),(s=a.cloneNode()).addEventListener("focus",c)),(l=t).length>0?(document.body.firstChild!==a&&document.body.insertBefore(a,document.body.firstChild),document.body.lastChild!==s&&document.body.appendChild(s)):(a.parentElement&&a.parentElement.removeChild(a),s.parentElement&&s.parentElement.removeChild(s))}))},5396:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.resetState=function(){var e=document.getElementsByTagName("html")[0];for(var t in n)o(e,n[t]);var i=document.body;for(var a in r)o(i,r[a]);n={},r={}},t.log=function(){0};var n={},r={};function o(e,t){e.classList.remove(t)}t.add=function(e,t){return o=e.classList,i="html"==e.nodeName.toLowerCase()?n:r,void t.split(" ").forEach((function(e){!function(e,t){e[t]||(e[t]=0),e[t]+=1}(i,e),o.add(e)}));var o,i},t.remove=function(e,t){return o=e.classList,i="html"==e.nodeName.toLowerCase()?n:r,void t.split(" ").forEach((function(e){!function(e,t){e[t]&&(e[t]-=1)}(i,e),0===i[e]&&o.remove(e)}));var o,i}},1837:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.resetState=function(){a=[]},t.log=function(){0},t.handleBlur=c,t.handleFocus=u,t.markForFocusLater=function(){a.push(document.activeElement)},t.returnFocus=function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],t=null;try{return void(0!==a.length&&(t=a.pop()).focus({preventScroll:e}))}catch(e){console.warn(["You tried to return focus to",t,"but it is not in the DOM anymore"].join(" "))}},t.popWithoutFocus=function(){a.length>0&&a.pop()},t.setupScopedFocus=function(e){s=e,window.addEventListener?(window.addEventListener("blur",c,!1),document.addEventListener("focus",u,!0)):(window.attachEvent("onBlur",c),document.attachEvent("onFocus",u))},t.teardownScopedFocus=function(){s=null,window.addEventListener?(window.removeEventListener("blur",c),document.removeEventListener("focus",u)):(window.detachEvent("onBlur",c),document.detachEvent("onFocus",u))};var r,o=n(9505),i=(r=o)&&r.__esModule?r:{default:r};var a=[],s=null,l=!1;function c(){l=!0}function u(){if(l){if(l=!1,!s)return;setTimeout((function(){s.contains(document.activeElement)||((0,i.default)(s)[0]||s).focus()}),0)}}},6974:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.log=function(){console.log("portalOpenInstances ----------"),console.log(r.openInstances.length),r.openInstances.forEach((function(e){return console.log(e)})),console.log("end portalOpenInstances ----------")},t.resetState=function(){r=new n};var n=function e(){var t=this;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.register=function(e){-1===t.openInstances.indexOf(e)&&(t.openInstances.push(e),t.emit("register"))},this.deregister=function(e){var n=t.openInstances.indexOf(e);-1!==n&&(t.openInstances.splice(n,1),t.emit("deregister"))},this.subscribe=function(e){t.subscribers.push(e)},this.emit=function(e){t.subscribers.forEach((function(n){return n(e,t.openInstances.slice())}))},this.openInstances=[],this.subscribers=[]},r=new n;t.default=r},6244:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.canUseDOM=t.SafeNodeList=t.SafeHTMLCollection=void 0;var r,o=n(5625);var i=((r=o)&&r.__esModule?r:{default:r}).default,a=i.canUseDOM?window.HTMLElement:{};t.SafeHTMLCollection=i.canUseDOM?window.HTMLCollection:{},t.SafeNodeList=i.canUseDOM?window.NodeList:{},t.canUseDOM=i.canUseDOM;t.default=a},2797:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t){var n=(0,i.default)(e);if(!n.length)return void t.preventDefault();var r=void 0,o=t.shiftKey,s=n[0],l=n[n.length-1],c=a();if(e===c){if(!o)return;r=l}l!==c||o||(r=s);s===c&&o&&(r=l);if(r)return t.preventDefault(),void r.focus();var u=/(\bChrome\b|\bSafari\b)\//.exec(navigator.userAgent);if(null==u||"Chrome"==u[1]||null!=/\biPod\b|\biPad\b/g.exec(navigator.userAgent))return;var d=n.indexOf(c);d>-1&&(d+=o?-1:1);if(void 0===(r=n[d]))return t.preventDefault(),void(r=o?l:s).focus();t.preventDefault(),r.focus()};var r,o=n(9505),i=(r=o)&&r.__esModule?r:{default:r};function a(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:document;return e.activeElement.shadowRoot?a(e.activeElement.shadowRoot):e.activeElement}e.exports=t.default},9505:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function e(t){var n=[].slice.call(t.querySelectorAll("*"),0).reduce((function(t,n){return t.concat(n.shadowRoot?e(n.shadowRoot):[n])}),[]);return n.filter(s)};
/*!
 * Adapted from jQuery UI core
 *
 * http://jqueryui.com
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/category/ui-core/
 */
var n="none",r="contents",o=/^(input|select|textarea|button|object|iframe)$/;function i(e){var t=e.offsetWidth<=0&&e.offsetHeight<=0;if(t&&!e.innerHTML)return!0;try{var o=window.getComputedStyle(e),i=o.getPropertyValue("display");return t?i!==r&&function(e,t){return"visible"!==t.getPropertyValue("overflow")||e.scrollWidth<=0&&e.scrollHeight<=0}(e,o):i===n}catch(e){return console.warn("Failed to inspect element style"),!1}}function a(e,t){var n=e.nodeName.toLowerCase();return(o.test(n)&&!e.disabled||"a"===n&&e.href||t)&&function(e){for(var t=e,n=e.getRootNode&&e.getRootNode();t&&t!==document.body;){if(n&&t===n&&(t=n.host.parentNode),i(t))return!1;t=t.parentNode}return!0}(e)}function s(e){var t=e.getAttribute("tabindex");null===t&&(t=void 0);var n=isNaN(t);return(n||t>=0)&&a(e,!n)}e.exports=t.default},3062:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r,o=n(2558),i=(r=o)&&r.__esModule?r:{default:r};t.default=i.default,e.exports=t.default},9879:e=>{"use strict";var t=function(){};e.exports=t},2564:(e,t,n)=>{"use strict";n.d(t,{A:()=>l,z:()=>a});var r=n(3185);const o={white:"hsl(0 0% 100%)",black:"hsl(0 0% 0%)",blue:"hsl(204.25deg 100% 36.47%)",blue10:"hsl(206 100% 22%)",blue50:"hsl(206 90% 55%)",blue80:"hsl(206 80% 88%)",blue95:"hsl(206 100% 96%)",green:"hsl(165 100% 35%)",green90:"hsl(165 70% 92%)",red:"hsl(12 85% 45%)",red90:"hsl(12 90% 94%)",orange:"hsl(36 80% 55%)",yellow:"hsl(44 80% 54%)",purple:"hsl(270 40% 58%)",gray30:"hsl(210 11% 26%)",gray50:"hsl(210 10% 46%)",gray60:"hsl(210 9% 60%)",gray80:"hsl(210 14% 85%)",gray90:"hsl(210 16% 92%)",gray95:"hsl(210 20% 96%)",gray98:"hsl(210 25% 98%)"},i=r.DU`
  :root {
    /* Base colors */
    --neko-blue: ${o.blue};
    --neko-white: ${o.white};
    --neko-black: ${o.black};
    --neko-purple: ${o.purple};
    --neko-orange: ${o.orange};
    --neko-yellow: ${o.yellow};
    --neko-green: ${o.green};
    --neko-red: ${o.red};

    /* Gray scale */
    --neko-gray-30: ${o.gray30};
    --neko-gray-50: ${o.gray50};
    --neko-gray-60: ${o.gray60};
    --neko-gray-80: ${o.gray80};
    --neko-gray-90: ${o.gray90};
    --neko-gray-95: ${o.gray95};
    --neko-gray-98: ${o.gray98};

    /* Main color */
    --neko-main-color: var(--neko-blue);
    --neko-main-color-10: hsl(206deg 100% 22.35%);
    --neko-main-color-50: hsl(206deg 61.04% 54.71%);
    --neko-main-color-80: hsl(206deg 55.93% 88.43%);
    --neko-main-color-95: ${o.blue95};
    --neko-main-color-98: hsl(200deg 100% 98.82%);
    --neko-main-overlay-color: rgb(30 124 186 / 85%);

    /* Variants */
    --neko-success: var(--neko-green);
    --neko-primary: var(--neko-main-color);
    --neko-secondary: ${o.blue95};
    --neko-danger: var(--neko-red);
    --neko-lighten-green: ${o.green90};
    --neko-lighten-red: ${o.red90};

    /* Base styles */
    --neko-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    --neko-font-size: 13px; 
    --neko-small-font-size: 12px; 
    --neko-h1-font-size: 23px;
    --neko-h2-font-size: 20px;
    --neko-h3-font-size: 18px;
    --neko-h4-font-size: 16px;
    --neko-h5-font-size: 14px;
    --neko-h6-font-size: 13px;
    --neko-font-color: var(--neko-gray-30);

    /* Radii & Shadows */
    --neko-radius-sm: 6px;
    --neko-radius-md: 8px;
    --neko-radius-lg: 12px;
    --neko-shadow-xs: 0 1px 2px rgba(16, 24, 40, 0.06);
    --neko-shadow-sm: 0 1px 3px rgba(16, 24, 40, 0.08), 0 1px 2px rgba(16, 24, 40, 0.06);
    --neko-shadow-md: 0 4px 8px rgba(16, 24, 40, 0.08), 0 2px 4px rgba(16, 24, 40, 0.06);
    --neko-shadow-lg: 0 12px 16px rgba(16, 24, 40, 0.10), 0 4px 6px rgba(16, 24, 40, 0.06);
    --neko-focus-ring: 0 0 0 3px color-mix(in oklab, var(--neko-main-color) 25%, transparent);

    /* Neko UI */
    --neko-wp-background-color: #f0f0f1;
    --neko-background-color: var(--neko-wp-background-color);
    --neko-disabled-color: var(--neko-gray-60);
    --neko-main-color-alternative: var(--neko-main-color-10);
    --neko-main-color-disabled: var(--neko-main-color-50);
    --neko-input-background: var(--neko-gray-98);
    --neko-input-border: var(--neko-gray-90);
  }

  /* Base reset/typography and focus treatments */
  html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
  body {
    font-family: var(--neko-font-family);
    color: var(--neko-font-color);
    background-color: var(--neko-background-color);
  }
  :focus-visible { outline: none; box-shadow: var(--neko-focus-ring); }
`,a=()=>({colors:o}),s=({children:e})=>React.createElement(React.Fragment,null,React.createElement(i,{key:"neko-ui-styles"}),e),l=({children:e})=>React.createElement(s,null,e)},9296:(e,t,n)=>{"use strict";n.d(t,{M:()=>f});var r=n(1594),o=n.n(r),i=n(7639),a=n.n(i),s=n(3185),l=n(5484),c=n(1329),u=n(6897);function d(){return d=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},d.apply(this,arguments)}const h=(0,s.Ay)((e=>{let{className:t="primary",variant:n,disabled:i=!1,icon:a=null,color:s=null,onClick:h=(()=>{}),onStopClick:p=null,rounded:f,isBusy:m=!1,spinning:g=!1,disabledColor:y=null,busyText:b,hideBusyIcon:v=!1,busyIconSize:x,requirePro:k=!1,isPro:w=!1,small:_,large:S,width:E,height:C,fullWidth:A,startTime:O=null,progress:M=null,ai:R=!1,children:P,...T}=e;const z=o().useRef(null),j=o().useRef(null),[I,N]=o().useState(null);o().useLayoutEffect((()=>{z.current&&!j.current&&(j.current=z.current.offsetWidth)})),o().useEffect((()=>{if(!m&&!p){const e=setTimeout((()=>{N(null)}),300);return()=>clearTimeout(e)}}),[m,p]),o().useEffect((()=>{t&&["primary","primary-block","secondary","danger","success","header"].includes(t)&&!n&&console.warn(`NekoButton: Using 'className' prop for button variants is deprecated. Please use 'variant' prop instead. Found className="${t}"`)}),[t,n]);const $=n||(["primary","primary-block","secondary","danger","success","header"].includes(t)?t:"primary"),L=t&&!["primary","primary-block","secondary","danger","success","header"].includes(t)?t:"",D=i||k&&!w,F=!!a,B=k&&!w,W=!!p&&m,H=(0,r.useMemo)((()=>{let e=E??30;return _&&(e*=.8),S&&(e*=1.3),"header"===$||t&&t.includes("header")?20:f?e-12:e-14}),[E,f,_,S,$,t]),[q,U]=(0,r.useState)(null);(0,u.$$)((()=>U(new Date)),O?1e3:null),(0,r.useEffect)((()=>{O||U(null)}),[O]);const V=(0,r.useMemo)((()=>{if(!O||!q)return null;const e=Math.floor((q-O)/1e3),t=e%60;return`${Math.floor(e/60).toString().padStart(2,"0")}:${t.toString().padStart(2,"0")}`}),[q,O]),K=(0,u.gR)("neko-button",$,L,{"has-icon":F},{"custom-color":s},{small:_},{large:S},{rounded:f},{busy:m},{"is-pro":B},{full:A},{"has-stop":W},{ai:R});return o().createElement("button",d({ref:z,type:"button",className:K,onClick:e=>{if(!m&&z.current){const e=p&&j.current?j.current:z.current.offsetWidth;N(e)}D||W||h(),e.stopPropagation(),e.preventDefault()},disabled:D&&!(m&&W),style:m&&I?{minWidth:`${I}px`,width:`${I}px`}:void 0},T),m&&null!==M&&M>0&&o().createElement("div",{className:"progress-bar",style:{width:`${M}%`}}),m&&!W&&!v&&o().createElement("div",{className:"busy-wrapper"},o().createElement("div",{className:"busy-icon"},o().createElement(l.z,{raw:!0,icon:"sync",width:16,height:16}))),!m&&!W&&o().createElement("div",{className:"normal-content"},F&&o().createElement(l.z,{raw:!0,icon:a,width:H,height:H,spinning:g,style:f?{margin:"0 auto"}:{},strokeWidth:f&&_?2.5:void 0}),!!P&&o().createElement("span",{style:{marginLeft:F?"4px":0,marginRight:F?"2px":0}},P)),m&&!W&&V&&o().createElement("span",{className:"chrono-time"},V),W&&o().createElement(o().Fragment,null,o().createElement("div",{className:"busy-icon"},o().createElement(l.z,{raw:!0,icon:"sync",width:16,height:16})),o().createElement("div",{className:"stop-section",onClick:e=>{e.stopPropagation(),p()}},o().createElement(l.z,{raw:!0,icon:"stop",width:"14",height:"14"}))),B&&o().createElement(c.K,{style:{marginLeft:"8px"}}))}))`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  height: 30px;
  min-height: 30px;
  min-width: 40px;
  border: none;
  border-radius: var(--neko-radius-sm);
  text-align: center;
  padding: 0 15px;
  vertical-align: middle;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), transparent 50%), var(--neko-main-color);
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  transition: box-shadow 200ms ease,
              transform 220ms cubic-bezier(0.16, 1, 0.3, 1),
              filter 180ms ease;
  will-change: transform, box-shadow, filter;
  overflow: hidden;
  
  /* Progress bar styling */
  .progress-bar {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background-color: var(--neko-green);
    transition: width 0.3s ease;
    z-index: 0;
    opacity: 0.9;
  }
  
  /* Ensure content appears above progress bar */
  .busy-wrapper,
  .normal-content,
  .busy-icon,
  .stop-section {
    position: relative;
    z-index: 1;
  }

  span {
    white-space: nowrap;
    text-overflow: ellipsis;
    display: flex;
    align-items: center;
  }

  .chrono-time {
    font-size: 11px;
    margin-left: 5px;
  }

  &:not([disabled]):hover {
    cursor: pointer;
    filter: brightness(1.07);
    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.12), 0 2px 3px rgba(0, 0, 0, 0.08);
    transform: translateY(-0.5px);
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  &:focus {
    outline: none;
  }
  
  &:active:not([disabled]) {
    transform: translateY(0);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06), inset 0 1px 1px rgba(0, 0, 0, 0.04);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    &:not([disabled]):hover { transform: none; box-shadow: var(--neko-shadow-xs); }
  }


  &.is-pro {
    background-image: none;
    background-color: var(--neko-main-color-disabled);
    rgb(255 255 255 / 65%);
    align-items: center;
    opacity: 1;
  }

  &.has-icon {
    align-items: center;
    padding: 2.5px 8px;

    svg {
      color: white;
    }
  }

  &.secondary {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.35), transparent 50%), var(--neko-secondary);
    color: var(--neko-main-color);
    border: 1px solid var(--neko-input-border);
    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);

    svg {
      color: var(--neko-main-color);
    }

    &:hover {
      border: 1px solid var(--neko-input-border);
      filter: brightness(1.03);
      box-shadow: 0 3px 5px rgba(0, 0, 0, 0.08), 0 2px 3px rgba(0, 0, 0, 0.06);
      transform: translateY(-0.75px);
    }
  }

  &.danger {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), transparent 50%), var(--neko-danger);
    border-color: var(--neko-danger);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  }

  &.success {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), transparent 50%), var(--neko-green);
    border-color: var(--neko-green);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  }

  & + button {
    margin-left: .25rem;
  }

  &.small {
    font-size: var(--neko-small-font-size);
    height: 24px;
    min-height: 24px;
  }

  &.large {
    height: 50px;
    min-height: 50px;
    font-size: 16px;
    padding: 0 20px;
  }

  &.header {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), transparent 50%), var(--neko-main-color);
    filter: brightness(1.1);
    height: 40px;
    padding: 0 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);

    &:hover {
      filter: brightness(1.2);
      box-shadow: 0 3px 5px rgba(0, 0, 0, 0.12), 0 2px 3px rgba(0, 0, 0, 0.08);
    }
  }

  &.rounded {
    border-radius: 100%;
    min-width: 30px;
    height: ${e=>e.height??e.width??(e.large?50:30)}px;
    width: ${e=>e.width??(e.large?50:30)}px;
    padding: 3px;
    box-shadow: var(--neko-shadow-xs);

    &.small {
      height: 24px;
      width: 24px;
      min-width: 24px;
    }
  }

  /* Normal content animation */
  .normal-content {
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 1;
    transform: scale(1);
    transition: opacity 0.3s ease, transform 0.3s ease;
  }

  /* Busy state animations */
  &.busy:not(.has-stop) {
    pointer-events: none;
    overflow: hidden;
    
    .normal-content {
      opacity: 0;
      transform: scale(0.8);
      position: absolute;
      visibility: hidden;
    }
    
    .busy-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      animation: fadeIn 0.3s ease forwards;
      
      .busy-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        animation: slideInRotate 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        
        svg {
          animation: rotate 1.5s linear infinite;
        }
      }
    }
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  @keyframes slideInRotate {
    from {
      transform: translateX(-20px) rotate(-180deg) scale(0);
      opacity: 0;
    }
    to {
      transform: translateX(0) rotate(0deg) scale(1);
      opacity: 1;
    }
  }
  
  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  &.has-stop {
    position: relative;
    pointer-events: none;
    padding-right: 35px; /* Space for stop section */
    padding-left: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .busy-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1;
      animation: fadeIn 0.3s ease forwards;
      
      svg {
        animation: rotate 1.5s linear infinite;
        color: white;
      }
    }
    
    .stop-section {
      position: absolute;
      right: 0;
      top: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 10px;
      height: 100%;
      border-left: 1px solid rgba(255, 255, 255, 0.2);
      cursor: pointer;
      pointer-events: auto;
      transition: background-color 0.2s ease;
      
      svg {
        color: white;
        
        rect {
          transition: fill 0.2s ease;
        }
      }
      
      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
        
        svg {
          rect {
            fill: var(--neko-red);
          }
        }
      }
    }
  }

  &.full {
    width: 100%;
  }

  /* AI button with vibrant pop effect */
  &.ai {
    position: relative;
    background: 
      linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.25) 0%,
        transparent 50%
      ),
      linear-gradient(
        120deg,
        #818cf8,
        #a855f7,
        #ec4899,
        #818cf8
      );
    background-size: 100% 100%, 400% 400%;
    animation: aiFlow 6s ease infinite;
    box-shadow: 
      0 4px 8px rgba(168, 85, 247, 0.25),
      0 2px 4px rgba(236, 72, 153, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
    border: 1px solid rgba(168, 85, 247, 0.2);
    
    &:not(.rounded) {
      padding: 0 25px 0 15px;
    }
    
    @keyframes aiFlow {
      0%, 100% {
        background-position: 0% 50%, 0% 50%;
      }
      25% {
        background-position: 0% 50%, 100% 0%;
      }
      50% {
        background-position: 0% 50%, 100% 100%;
      }
      75% {
        background-position: 0% 50%, 0% 100%;
      }
    }
    
    /* Sparkle burst effect */
    &::before {
      content: '✦';
      position: absolute;
      top: 5px;
      right: 8px;
      font-size: 10px;
      color: rgba(255, 255, 255, 0.8);
      animation: sparkBurst 2s ease-in-out infinite;
      pointer-events: none;
      text-shadow: 0 0 4px rgba(236, 72, 153, 0.6);
      z-index: 3;
    }
    
    &.rounded {
      overflow: visible;
      
      &::before {
        top: -2px;
        right: -1px;
      }
      
      &.small::before {
        top: -2px;
        right: -1px;
        font-size: 8px;
      }
    }
    
    @keyframes sparkBurst {
      0%, 100% {
        transform: scale(0.8) rotate(0deg);
        opacity: 0.4;
      }
      50% {
        transform: scale(1.2) rotate(180deg);
        opacity: 1;
      }
    }
    
    /* Content styling */
    .normal-content {
      position: relative;
      z-index: 2;
    }
    
    /* Glowing border effect */
    &::after {
      content: '';
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      background: linear-gradient(
        45deg,
        #818cf8,
        #a855f7,
        #ec4899,
        #a855f7
      );
      background-size: 300% 300%;
      border-radius: inherit;
      opacity: 0.3;
      z-index: -1;
      animation: borderGlow 3s linear infinite;
      filter: blur(3px);
    }
    
    @keyframes borderGlow {
      0%, 100% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
    }
    
    &:hover:not(:disabled) {
      animation-duration: 3s;
      transform: translateY(-0.5px);
      filter: brightness(1.07);
      box-shadow: 
        0 3px 5px rgba(0, 0, 0, 0.12),
        0 2px 3px rgba(0, 0, 0, 0.08),
        0 0 12px rgba(168, 85, 247, 0.1);
      
      &::after {
        opacity: 0.15;
      }
      
      &::before {
        animation-duration: 1s;
      }
    }
  }
  
  @keyframes sparkle {
    0%, 100% {
      opacity: 0.9;
      transform: scale(1);
    }
    50% {
      opacity: 1;
      transform: scale(1.05);
    }
  }

  ${e=>p(e.color)}
`,p=e=>{if(e){const t=/^#|^rgb\(|^rgba\(|^hsl\(/.test(e),n=t?e:`var(--neko-${e})`;return`\n      &.custom-color {\n        background-color: ${n};\n        border: 1px solid ${t?e:`var(--neko-${e})`};\n\n        &:hover {\n          background-color: ${n};\n          filter: brightness(1.1);\n        }\n      }\n    `}},f=e=>o().createElement(h,e);f.propTypes={className:a().string,variant:a().oneOf(["primary","primary-block","secondary","danger","success","header"]),disabled:a().bool,icon:a().oneOfType([a().object,a().oneOf(["setting","edit","trash"])]),color:a().string,onClick:a().func.isRequired,onStopClick:a().func,rounded:a().bool,isBusy:a().bool,spinning:a().bool,busyText:a().string,hideBusyIcon:a().bool,busyIconSize:a().string,requirePro:a().bool,isPro:a().bool,disabledColor:a().string,small:a().bool,large:a().bool,progress:a().number,ai:a().bool}},8956:(e,t,n)=>{"use strict";n.d(t,{A:()=>p});var r=n(1594),o=n.n(r),i=n(3185),a=n(2673);
/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const s=(0,a.A)("panel-right-open",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M15 3v18",key:"14nvp0"}],["path",{d:"m10 15-3-3 3-3",key:"1pgupc"}]]),l=(0,a.A)("panel-right-close",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M15 3v18",key:"14nvp0"}],["path",{d:"m8 9 3 3-3 3",key:"12hl5m"}]]),c=(0,a.A)("panel-left-open",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M9 3v18",key:"fh3hqa"}],["path",{d:"m14 9 3 3-3 3",key:"8010ee"}]]),u=(0,a.A)("panel-left-close",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M9 3v18",key:"fh3hqa"}],["path",{d:"m16 15-3-3 3-3",key:"14y99z"}]]);function d(){return d=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},d.apply(this,arguments)}const h=i.Ay.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  color: ${e=>e.$isPrimary?"white":"var(--neko-font-color, #666)"};
  padding-left: ${e=>"left"===e.border?"8px":"0"};
  padding-right: ${e=>"right"===e.border?"8px":"0"};
  margin-left: ${e=>"left"===e.border?"5px":"0"};
  margin-right: ${e=>"right"===e.border?"5px":"0"};
  border-left: ${e=>"left"===e.border?e.$isPrimary?"1px solid rgba(255, 255, 255, 0.26)":"1px solid var(--neko-border-color, #e0e0e0)":"none"};
  border-right: ${e=>"right"===e.border?e.$isPrimary?"1px solid rgba(255, 255, 255, 0.26)":"1px solid var(--neko-border-color, #e0e0e0)":"none"};
  transition: opacity 0.2s ease;
  opacity: 0.7;

  &:hover {
    opacity: 1;
  }
`,p=({isCollapsed:e,onClick:t,border:n="left",direction:i="right",size:a=20,color:p,borderColor:f,title:m,className:g,style:y,...b})=>{const v=(0,r.useRef)(null),[x,k]=(0,r.useState)(!1);(0,r.useEffect)((()=>{if(v.current){const e=null!==v.current.closest(".primary");k(e)}}),[]);const w="right"===i?e?"Show Right Panel":"Hide Right Panel":e?"Show Left Panel":"Hide Left Panel";return o().createElement(h,d({ref:v,onClick:t,border:n,$isPrimary:x,title:m||w,className:g,style:{color:p||void 0,...y}},b),"right"===i?e?o().createElement(s,{size:a}):o().createElement(l,{size:a}):"left"===i?e?o().createElement(c,{size:a}):o().createElement(u,{size:a}):null)}},2557:(e,t,n)=>{"use strict";n.d(t,{A:()=>u});var r=n(1594),o=n.n(r),i=n(7639),a=n.n(i),s=n(6897);function l(){return l=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},l.apply(this,arguments)}const c=e=>{const{spinner:t=!0,busy:n=!1,overlayStyle:i}=e,[a,c]=(0,r.useState)(!0);(0,r.useEffect)((()=>{let e;return n?c(!0):e=setTimeout((()=>{c(!1),e=null}),250),()=>{e&&clearTimeout(e)}}),[n]);const u=(0,s.gR)("neko-overlay",{overlayHidden:!n}),d=a?o().createElement(o().Fragment,null,o().createElement("div",{className:u,style:i},Boolean(t)&&o().createElement("div",{className:"lds-ellipsis "+(n?"":"spinnerHidden")},o().createElement("div",null),o().createElement("div",null),o().createElement("div",null),o().createElement("div",null))),o().createElement("style",{jsx:"true"},"\n        .neko-overlay {\n          position: absolute;\n          top: 0;\n          left: 0;\n          bottom: 0;\n          width: 100%;\n          height: 100%;\n          background: var(--neko-main-overlay-color);\n          border-radius: 8px;\n          transition: opacity 1s ease-out;\n          z-index: 10;\n          display: flex;\n          align-items: center;\n          flex-direction: column;\n          justify-content: center;\n          overflow: hidden;\n        }\n\n        .overlayHidden {\n          opacity: 0;\n          transition: opacity 0.25s ease-out;\n        }\n        .spinnerHidden {\n          opacity: 0;\n          transition: opacity 0.25s ease-out;\n        }\n        .lds-ellipsis {\n          position: relative;\n          width: 80px;\n          height: 80px;\n          display: flex;\n          justify-items: center;\n          align-items: center;\n        }\n        .lds-ellipsis div {\n          position: absolute;\n          width: 13px;\n          height: 13px;\n          border-radius: 50%;\n          background: white;\n          animation-timing-function: cubic-bezier(0, 1, 1, 0);\n        }\n        .lds-ellipsis div:nth-child(1) {\n          left: 8px;\n          animation: lds-ellipsis1 0.6s infinite;\n        }\n        .lds-ellipsis div:nth-child(2) {\n          left: 8px;\n          animation: lds-ellipsis2 0.6s infinite;\n        }\n        .lds-ellipsis div:nth-child(3) {\n          left: 32px;\n          animation: lds-ellipsis2 0.6s infinite;\n        }\n        .lds-ellipsis div:nth-child(4) {\n          left: 56px;\n          animation: lds-ellipsis3 0.6s infinite;\n        }\n        @keyframes lds-ellipsis1 {\n          0% {\n            transform: scale(0);\n          }\n          100% {\n            transform: scale(1);\n          }\n        }\n        @keyframes lds-ellipsis3 {\n          0% {\n            transform: scale(1);\n          }\n          100% {\n            transform: scale(0);\n          }\n        }\n        @keyframes lds-ellipsis2 {\n          0% {\n            transform: translate(0, 0);\n          }\n          100% {\n            transform: translate(24px, 0);\n          }\n        }\n      ")):null,h={...e,busy:void 0,spinner:void 0};return o().createElement("div",l({style:{position:"relative"}},h),d,e.children)};c.propTypes={busy:a().bool.isRequired,spinner:a().bool,children:a().oneOfType([a().arrayOf(a().node),a().node]).isRequired};const u=c},5055:(e,t,n)=>{"use strict";n.d(t,{hS:()=>be,Ay:()=>ve,ho:()=>ye});var r=n(2673);
/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const o=(0,r.A)("copy",[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]]),i=(0,r.A)("lock-keyhole",[["circle",{cx:"12",cy:"16",r:"1",key:"1au0dj"}],["rect",{x:"3",y:"10",width:"18",height:"12",rx:"2",key:"6s8ecr"}],["path",{d:"M7 10V7a5 5 0 0 1 10 0v3",key:"1pqi11"}]]),a=(0,r.A)("lock-open",[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 9.9-1",key:"1mm8w8"}]]),s=(0,r.A)("file-x",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"m14.5 12.5-5 5",key:"b62r18"}],["path",{d:"m9.5 12.5 5 5",key:"1rk7el"}]]);var l=n(1422),c=n(2297),u=n(8897),d=n(8744),h=n(2480),p=n(9685),f=n(8086),m=n(8160);
/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const g=(0,r.A)("rotate-ccw",[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"1357e3"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}]]),y=(0,r.A)("check",[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]]);var b=n(7192),v=n(8785);
/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const x=(0,r.A)("trash-2",[["path",{d:"M10 11v6",key:"nco0om"}],["path",{d:"M14 11v6",key:"outv1u"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",key:"miytrc"}],["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",key:"e791ji"}]]),k=(0,r.A)("undo",[["path",{d:"M3 7v6h6",key:"1v2h90"}],["path",{d:"M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13",key:"1r6uu6"}]]);var w=n(2973);
/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const _=(0,r.A)("database",[["ellipse",{cx:"12",cy:"5",rx:"9",ry:"3",key:"msslwz"}],["path",{d:"M3 5V19A9 3 0 0 0 21 19V5",key:"1wlel7"}],["path",{d:"M3 12A9 3 0 0 0 21 12",key:"mv7ke4"}]]),S=(0,r.A)("wrench",[["path",{d:"M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z",key:"1ngwbx"}]]),E=(0,r.A)("settings",[["path",{d:"M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",key:"1i5ecw"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);var C=n(812);
/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const A=(0,r.A)("cat",[["path",{d:"M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58-.42 7-.42 7 .57 1.07 1 2.24 1 3.44C21 17.9 16.97 21 12 21s-9-3-9-7.56c0-1.25.5-2.4 1-3.44 0 0-1.89-6.42-.5-7 1.39-.58 4.72.23 6.5 2.23A9.04 9.04 0 0 1 12 5Z",key:"x6xyqk"}],["path",{d:"M8 14v.5",key:"1nzgdb"}],["path",{d:"M16 14v.5",key:"1lajdz"}],["path",{d:"M11.25 16.25h1.5L12 17l-.75-.75Z",key:"12kq1m"}]]),O=(0,r.A)("circle-arrow-up",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m16 12-4-4-4 4",key:"177agl"}],["path",{d:"M12 16V8",key:"1sbj14"}]]),M=(0,r.A)("pencil",[["path",{d:"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",key:"1a8usu"}],["path",{d:"m15 5 4 4",key:"1mk7zo"}]]),R=(0,r.A)("layout-dashboard",[["rect",{width:"7",height:"9",x:"3",y:"3",rx:"1",key:"10lvy0"}],["rect",{width:"7",height:"5",x:"14",y:"3",rx:"1",key:"16une8"}],["rect",{width:"7",height:"9",x:"14",y:"12",rx:"1",key:"1hutg5"}],["rect",{width:"7",height:"5",x:"3",y:"16",rx:"1",key:"ldoo1y"}]]),P=(0,r.A)("database-zap",[["ellipse",{cx:"12",cy:"5",rx:"9",ry:"3",key:"msslwz"}],["path",{d:"M3 5V19A9 3 0 0 0 15 21.84",key:"14ibmq"}],["path",{d:"M21 5V8",key:"1marbg"}],["path",{d:"M21 12L18 17H22L19 22",key:"zafso"}],["path",{d:"M3 12A9 3 0 0 0 14.59 14.87",key:"1y4wr8"}]]),T=(0,r.A)("folder",[["path",{d:"M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",key:"1kt360"}]]),z=(0,r.A)("folder-open",[["path",{d:"m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2",key:"usdka0"}]]),j=(0,r.A)("images",[["path",{d:"m22 11-1.296-1.296a2.4 2.4 0 0 0-3.408 0L11 16",key:"9kzy35"}],["path",{d:"M4 8a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2",key:"1t0f0t"}],["circle",{cx:"13",cy:"7",r:"1",fill:"currentColor",key:"1obus6"}],["rect",{x:"8",y:"2",width:"14",height:"14",rx:"2",key:"1gvhby"}]]),I=(0,r.A)("plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]),N=(0,r.A)("folder-plus",[["path",{d:"M12 10v6",key:"1bos4e"}],["path",{d:"M9 13h6",key:"1uhe8q"}],["path",{d:"M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",key:"1kt360"}]]),$=(0,r.A)("image-plus",[["path",{d:"M16 5h6",key:"1vod17"}],["path",{d:"M19 2v6",key:"4bpg5p"}],["path",{d:"M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5",key:"1ue2ih"}],["path",{d:"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",key:"1xmnt7"}],["circle",{cx:"9",cy:"9",r:"2",key:"af1f0g"}]]),L=(0,r.A)("grid-3x3",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M3 9h18",key:"1pudct"}],["path",{d:"M3 15h18",key:"5xshup"}],["path",{d:"M9 3v18",key:"fh3hqa"}],["path",{d:"M15 3v18",key:"14nvp0"}]]),D=(0,r.A)("list",[["path",{d:"M3 12h.01",key:"nlz23k"}],["path",{d:"M3 18h.01",key:"1tta3j"}],["path",{d:"M3 6h.01",key:"1rqtza"}],["path",{d:"M8 12h13",key:"1za7za"}],["path",{d:"M8 18h13",key:"1lx6n3"}],["path",{d:"M8 6h13",key:"ik3vkj"}]]),F=(0,r.A)("twitter",[["path",{d:"M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z",key:"pff0z6"}]]),B=(0,r.A)("instagram",[["rect",{width:"20",height:"20",x:"2",y:"2",rx:"5",ry:"5",key:"2e1cvw"}],["path",{d:"M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z",key:"9exkf1"}],["line",{x1:"17.5",x2:"17.51",y1:"6.5",y2:"6.5",key:"r4j83e"}]]),W=(0,r.A)("facebook",[["path",{d:"M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",key:"1jg4f8"}]]);var H=n(1666);
/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const q=(0,r.A)("timer",[["line",{x1:"10",x2:"14",y1:"2",y2:"2",key:"14vaq8"}],["line",{x1:"12",x2:"15",y1:"14",y2:"11",key:"17fdiu"}],["circle",{cx:"12",cy:"14",r:"8",key:"1e1u0o"}]]),U=(0,r.A)("link",[["path",{d:"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71",key:"1cjeqo"}],["path",{d:"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",key:"19qd67"}]]),V=(0,r.A)("linkedin",[["path",{d:"M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z",key:"c2jq9f"}],["rect",{width:"4",height:"12",x:"2",y:"9",key:"mk3on5"}],["circle",{cx:"4",cy:"4",r:"2",key:"bt5ra8"}]]),K=(0,r.A)("pin",[["path",{d:"M12 17v5",key:"bb1du9"}],["path",{d:"M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z",key:"1nkz8b"}]]),Q=(0,r.A)("zoom-in",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["line",{x1:"21",x2:"16.65",y1:"21",y2:"16.65",key:"13gj7c"}],["line",{x1:"11",x2:"11",y1:"8",y2:"14",key:"1vmskp"}],["line",{x1:"8",x2:"14",y1:"11",y2:"11",key:"durymu"}]]);var Y=n(6190);
/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const G=(0,r.A)("image-off",[["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}],["path",{d:"M10.41 10.41a2 2 0 1 1-2.83-2.83",key:"1bzlo9"}],["line",{x1:"13.5",x2:"6",y1:"13.5",y2:"21",key:"1q0aeu"}],["line",{x1:"18",x2:"21",y1:"12",y2:"15",key:"5mozeu"}],["path",{d:"M3.59 3.59A1.99 1.99 0 0 0 3 5v14a2 2 0 0 0 2 2h14c.55 0 1.052-.22 1.41-.59",key:"mmje98"}],["path",{d:"M21 15V5a2 2 0 0 0-2-2H9",key:"43el77"}]]),X=(0,r.A)("arrow-up",[["path",{d:"m5 12 7-7 7 7",key:"hav0vg"}],["path",{d:"M12 19V5",key:"x0mq9r"}]]),Z=(0,r.A)("arrow-down",[["path",{d:"M12 5v14",key:"s699le"}],["path",{d:"m19 12-7 7-7-7",key:"1idqje"}]]),J=(0,r.A)("arrow-up-down",[["path",{d:"m21 16-4 4-4-4",key:"f6ql7i"}],["path",{d:"M17 20V4",key:"1ejh1v"}],["path",{d:"m3 8 4-4 4 4",key:"11wl7u"}],["path",{d:"M7 4v16",key:"1glfcx"}]]),ee=(0,r.A)("eye",[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]),te=(0,r.A)("rocket",[["path",{d:"M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z",key:"m3kijz"}],["path",{d:"m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z",key:"1fmvmk"}],["path",{d:"M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0",key:"1f8sc4"}],["path",{d:"M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5",key:"qeys4"}]]),ne=(0,r.A)("calendar",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]]),re=(0,r.A)("wand-sparkles",[["path",{d:"m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72",key:"ul74o6"}],["path",{d:"m14 7 3 3",key:"1r5n42"}],["path",{d:"M5 6v4",key:"ilb8ba"}],["path",{d:"M19 14v4",key:"blhpug"}],["path",{d:"M10 2v2",key:"7u0qdc"}],["path",{d:"M7 8H3",key:"zfb6yr"}],["path",{d:"M21 16h-4",key:"1cnmox"}],["path",{d:"M11 3H9",key:"1obp7u"}]]),oe=(0,r.A)("at-sign",[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8",key:"7n84p3"}]]),ie=(0,r.A)("funnel",[["path",{d:"M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z",key:"sc7q7i"}]]),ae=(0,r.A)("circle-question-mark",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3",key:"1u773s"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);var se=n(1546);
/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const le=(0,r.A)("file-plus",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M9 15h6",key:"cctwl0"}],["path",{d:"M12 18v-6",key:"17g6i2"}]]);var ce=n(6535);
/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ue=(0,r.A)("rotate-cw",[["path",{d:"M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8",key:"1p45f6"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}]]),de=(0,r.A)("square-pen",[["path",{d:"M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7",key:"1m0v6g"}],["path",{d:"M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z",key:"ohrbg2"}]]),he=(0,r.A)("refresh-ccw",[["path",{d:"M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"14sxne"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}],["path",{d:"M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16",key:"1hlbsb"}],["path",{d:"M16 16h5v5",key:"ccwih5"}]]),pe=(0,r.A)("zap",[["path",{d:"M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",key:"1xq2db"}]]),fe=(0,r.A)("file-up",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M12 12v6",key:"3ahymv"}],["path",{d:"m15 15-3-3-3 3",key:"15xj92"}]]),me=(0,r.A)("sparkles",[["path",{d:"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",key:"1s2grr"}],["path",{d:"M20 2v4",key:"1rf3ol"}],["path",{d:"M22 4h-4",key:"gwowj6"}],["circle",{cx:"4",cy:"20",r:"2",key:"6kqj1y"}]]),ge={duplicate:o,lock:i,"lock-open":a,"file-undo":s,"chevron-double-left":l.A,"chevron-double-right":c.A,"chevron-left":u.A,"chevron-right":d.A,"chevron-down":h.A,"chevron-up":p.A,pause:f.A,play:m.A,replay:g,check:y,"check-circle":b.A,stop:v.A,delete:x,undo:k,alert:w.A,database:_,tools:S,cog:E,close:C.A,cat:A,upload:O,trash:x,pencil:M,dashboard:R,search:P,folder:T,"folder-open":z,"image-multiple-outline":j,plus:I,"folder-plus":N,"image-plus":$,"view-grid":L,"format-list-bulleted":D,twitter:F,instagram:B,facebook:W,star:H.A,"timer-outline":q,link:U,linkedin:V,pinterest:K,"zoom-in":Q,"info-outline":Y.A,"image-off-outline":G,"arrow-up":X,"arrow-down":Z,sort:J,eye:ee,"rocket-launch":te,"calendar-month":ne,wand:re,mastodon:oe,filter:ie,question:ae,loading:se.A,new:le,save:ce.A,reset:ue,rename:de,edit:de,sync:he,lightning:pe,zap:pe,refresh:he,"file-upload":fe,sparkles:me},ye={trash:"rgb(255 255 255 / 25%)",delete:"rgb(255 255 255 / 25%)",pencil:"rgb(255 255 255 / 25%)",filter:"rgb(255 255 255 / 25%)",lightning:"rgb(255 255 255 / 25%)",zap:"rgb(255 255 255 / 25%)",stop:"rgb(255 255 255 / 25%)",star:"rgb(255 255 255 / 25%)","file-upload":"rgb(255 255 255 / 25%)",cat:"rgb(255 255 255 / 25%)",pinterest:"rgb(255 255 255 / 25%)",instagram:"rgb(255 255 255 / 25%)",facebook:"rgb(255 255 255 / 25%)","rocket-launch":"rgb(255 255 255 / 25%)",upload:"rgb(255 255 255 / 25%)","zoom-in":"rgb(255 255 255 / 25%)",dashboard:"rgb(255 255 255 / 25%)",tools:"rgb(255 255 255 / 25%)",cog:"rgb(255 255 255 / 25%)",database:"rgb(255 255 255 / 25%)",folder:"rgb(255 255 255 / 25%)","lock-open":"rgb(255 255 255 / 25%)",lock:"rgb(255 255 255 / 25%)",question:"rgb(255 255 255 / 25%)","info-outline":"rgb(255 255 255 / 25%)",alert:"rgb(255 255 255 / 25%)",play:"rgb(255 255 255 / 25%)",sparkles:"rgb(255 255 255 / 25%)"},be={chevron:18,buttonRounded:18,buttonNormal:24,default:30},ve=ge},5263:(e,t,n)=>{"use strict";n.d(t,{R:()=>p});var r=n(1594),o=n.n(r),i=n(7639),a=n.n(i),s=n(3185),l=n(1329),c=n(6087),u=n(6897);function d(){return d=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},d.apply(this,arguments)}const h=s.Ay.div`
  user-select: none;
  transition: color 0.3s ease;
  
  ${({color:e,variant:t})=>"danger"===t?"\n        --checkbox-color: var(--neko-danger);\n      ":e?`\n      --checkbox-color: var(--neko-${e});\n    `:""}

  &.disabled {
    color: var(--neko-disabled-color);

    .neko-content {
      cursor: default;
    }

    .neko-checkbox-check-container, .neko-label, .description {
      opacity: 0.35;
    }
  }

  input {
    display: none;
  }

  .neko-content {
    cursor: pointer;
    display: flex;
  }

  .neko-checkbox-check-container {
    display: flex;
    padding-top: 2px;
    align-content: center;

    .neko-checkbox-busy-container {
      position: relative;
    }
  }

  .neko-checkbox-inner-container {
    margin-left: 6px;

    .neko-label-container {
      display: flex;
      margin-top: 5px;

      .neko-label {
        display: block;
        ${({checked:e,disabled:t,color:n,variant:r})=>{if(t)return"";if(e){return`color: ${"danger"===r||n?"var(--checkbox-color, var(--neko-main-color))":"var(--neko-main-color)"}; font-weight: 600;`}return""}}
      }
    }

    .neko-content {
      display: block;
      font-size: var(--neko-font-size);
      line-height: 28px;
    }

    .description {
      display: block;
      font-size: var(--neko-small-font-size);
      margin-top: 1px;
      line-height: 14px;
      color: var(--neko-gray-60);

      code {
        font-size: 9px;
        background: #016fba14;
        border-radius: 5px;
        padding: 2px 4px;
      }

      * {
        font-size: var(--neko-small-font-size);
        line-height: inherit;
        margin: 0;
      }
    }
  }

  .neko-checkbox {
    width: 22px;
    height: 22px;
    border: 2px solid var(--neko-input-border);
    border-radius: var(--neko-radius-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    transition: box-shadow 0.2s ease, background 0.2s ease;
    background: 
      linear-gradient(
        to bottom,
        rgba(255, 255, 255, 1) 0%,
        rgba(252, 252, 252, 1) 100%
      );
    box-shadow: 
      inset 0 1px 1px rgba(0, 0, 0, 0.02);

    .neko-checked-mark {
      position: absolute;
      opacity: 0;
      transition: opacity 0.2s ease-in-out;
      transform: rotate(45deg);
      transform-origin: center;
      margin-top: -8%;
      height: 45%;
      width: 18%;
      border-bottom: 2.5px solid white;
      border-right: 2.5px solid white;
    }

    &.small {
      width: 20px;
      height: 20px;
      border: 2px solid var(--neko-input-border);
      border-radius: var(--neko-radius-sm);

      .neko-checked-mark {
        border-bottom-width: 1.5px;
        border-right-width: 1.5px;
      }
    }

    .neko-indeterminate-mark {
      position: absolute;
      opacity: 0;
      transition: opacity 0.2s ease-in-out;
      width: 50%;
      border-bottom: 1.5px solid white;
      border-right: 1.5px solid white;
    }

    &.disabled {
      border: 1.5px solid var(--neko-disabled-color);
      cursor: not-allowed;
      filter: grayscale(1);
    }
  }

  .neko-checked {
    border: 2px solid color-mix(in srgb, var(--checkbox-color, var(--neko-main-color)) 90%, black);

    &.neko-checkbox {
      background: 
        linear-gradient(
          135deg,
          rgba(255, 255, 255, 0.1) 0%,
          transparent 50%
        ),
        linear-gradient(
          to bottom,
          var(--checkbox-color, var(--neko-main-color)),
          color-mix(in srgb, var(--checkbox-color, var(--neko-main-color)) 95%, black)
        );
      box-shadow: 
        var(--neko-shadow-xs),
        inset 0 1px 0 rgba(255, 255, 255, 0.08);

      .neko-checked-mark {
        opacity: 1;
      }
    }
  }

  .neko-indeterminate {
    &.neko-checkbox {
      background: 
        linear-gradient(
          135deg,
          rgba(255, 255, 255, 0.1) 0%,
          transparent 50%
        ),
        linear-gradient(
          to bottom,
          var(--checkbox-color, var(--neko-main-color)),
          color-mix(in srgb, var(--checkbox-color, var(--neko-main-color)) 95%, black)
        );

      .neko-indeterminate-mark {
        opacity: 1;
      }
    }
  }
  }
`,p=e=>{const{name:t,checked:n=!1,indeterminate:r=!1,onChange:i,label:a,description:s,isPro:p=!1,disabled:f,requirePro:m=!1,isBusy:g=!1,small:y=!1,color:b,variant:v,...x}=e,k=m&&!p,w=f||k,_=(0,u.gR)("neko-checkbox",e.className,{disabled:w},{small:y}),S=(0,u.gR)("neko-checkbox",{disabled:w,"neko-checked":n,"neko-indeterminate":r,small:y}),E=(0,u.gR)("neko-checked-mark"),C=(0,u.gR)("neko-indeterminate-mark");return o().createElement(h,d({className:_,checked:n,disabled:w,color:b,variant:v,onClick:e=>e.stopPropagation()},x),o().createElement("div",{className:"neko-checkbox-container"},o().createElement("div",{className:"neko-content",onClick:r=>{w||(i?i(!n,t,r):console.log("The onChange handler is not set for the NekoCheckbox.",e))}},o().createElement("div",{className:"neko-checkbox-check-container"},g&&o().createElement("div",{className:"neko-checkbox-busy-container"},o().createElement("div",{className:S},o().createElement(c.X,{type:"circle",size:"16px"}))),!g&&o().createElement(o().Fragment,null,o().createElement("div",{className:S},o().createElement("div",{className:E}),o().createElement("div",{className:C})))),(a||k||s)&&o().createElement("div",{className:"neko-checkbox-inner-container"},o().createElement("span",{className:"neko-label-container"},o().createElement("span",{className:"neko-label"},a),o().createElement(l.K,{className:"inline",show:k,style:{position:"relative",top:-1}})),s?"string"==typeof s?o().createElement("small",{className:"description",dangerouslySetInnerHTML:{__html:s}}):o().createElement("small",{className:"description"},s):null))))};p.propTypes={name:a().string,checked:a().bool,label:a().string,description:a().string,isPro:a().bool,requirePro:a().bool,isBusy:a().bool,small:a().bool,color:a().oneOf(["blue","purple","green","red","orange","yellow","gray"]),variant:a().oneOf(["danger"])}},4536:(e,t,n)=>{"use strict";n.d(t,{E:()=>l});var r=n(1594),o=n.n(r),i=n(7639),a=n.n(i);const s=(0,n(3185).Ay)((e=>{const{name:t,max:n=-1,isPro:r=!1}=e,i=o().Children.map(e.children,(e=>e.props.name?e:o().cloneElement(e,{name:t,isPro:r})));return o().createElement("div",{className:"neko-checkbox-group"},i)}))`
`,l=e=>o().createElement(s,e);l.propTypes={name:a().string,max:a().number,isPro:a().bool}},8573:(e,t,n)=>{"use strict";n.d(t,{V:()=>h});var r=n(1594),o=n.n(r),i=n(7639),a=n.n(i),s=n(3185),l=n(9296);const c=s.Ay.div`
  position: relative;

  .swatch {
    width: 24px;
    height: 24px;
    border: 3px solid #fff;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    border-radius: var(--neko-radius-sm);
    transition: transform 0.15s ease;
    background-image: 
      linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc),
      linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc);
    background-size: 6px 6px;
    background-position: 0 0, 3px 3px;
    position: relative;
    overflow: hidden;

    &:hover {
      transform: scale(1.1);
    }
  }
  
  .popover {
    position: fixed;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    z-index: 10066;
    border-radius: 8px;
    background: white;
    padding: 12px;
    width: 200px;
  }

  .color-picker-area {
    width: 100%;
    height: 150px;
    position: relative;
    border-radius: 4px;
    margin-bottom: 10px;
    background: linear-gradient(to right, #fff 0%, rgba(255, 255, 255, 0) 100%),
                linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, #000 100%);
    cursor: crosshair;
  }

  .color-picker-cursor {
    position: absolute;
    width: 12px;
    height: 12px;
    border: 2px solid white;
    border-radius: 50%;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2);
    transform: translate(-50%, -50%);
    pointer-events: none;
  }

  .hue-slider {
    width: 100%;
    height: 12px;
    border-radius: 6px;
    background: linear-gradient(to right, 
      #ff0000 0%, 
      #ffff00 17%, 
      #00ff00 33%, 
      #00ffff 50%, 
      #0000ff 67%, 
      #ff00ff 83%, 
      #ff0000 100%);
    position: relative;
    cursor: pointer;
    margin-bottom: 10px;
  }

  .alpha-slider {
    width: 100%;
    height: 12px;
    border-radius: 6px;
    position: relative;
    cursor: pointer;
    margin-bottom: 10px;
    background-image: 
      linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc),
      linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc);
    background-size: 8px 8px;
    background-position: 0 0, 4px 4px;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 6px;
      background: linear-gradient(to right, transparent 0%, var(--current-color) 100%);
    }
  }

  .hue-cursor, .alpha-cursor {
    position: absolute;
    width: 16px;
    height: 16px;
    border: 2px solid white;
    border-radius: 50%;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.3);
    top: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
  }

  .hex-input {
    width: 100%;
    font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
    font-size: 12px;
    border: 1.5px solid var(--neko-input-border);
    box-sizing: border-box;
    height: 28px;
    background: var(--neko-input-background);
    color: black;
    padding: 0 8px;
    border-radius: var(--neko-radius-sm);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 8px;
    text-align: center;

    &:focus {
      background-color: white;
      box-shadow: var(--neko-focus-ring);
      outline: none;
    }
  }
`,u=e=>{if(!e||""===e)return{h:0,s:0,v:0,a:100};3===(e=e.replace("#","")).length&&(e=e.split("").map((e=>e+e)).join(""));const t=parseInt(e.slice(0,2),16)/255||0,n=parseInt(e.slice(2,4),16)/255||0,r=parseInt(e.slice(4,6),16)/255||0,o=e.length>=8?parseInt(e.slice(6,8),16)/255:1,i=Math.max(t,n,r),a=Math.min(t,n,r),s=i-a;let l=0;const c=0===i?0:s/i,u=i;if(i!==a)switch(i){case t:l=((n-r)/s+(n<r?6:0))/6;break;case n:l=((r-t)/s+2)/6;break;case r:l=((t-n)/s+4)/6}return{h:360*l,s:100*c,v:100*u,a:100*o}},d=(e,t,n,r=100,o=null)=>{e/=360,t/=100,n/=100;const i=r/100,a=Math.floor(6*e),s=6*e-a,l=n*(1-t),c=n*(1-s*t),u=n*(1-(1-s)*t);let d,h,p;switch(a%6){case 0:d=n,h=u,p=l;break;case 1:d=c,h=n,p=l;break;case 2:d=l,h=n,p=u;break;case 3:d=l,h=c,p=n;break;case 4:d=u,h=l,p=n;break;case 5:d=n,h=l,p=c;break;default:d=0,h=0,p=0}const f=e=>{const t=Math.round(255*e).toString(16);return 1===t.length?"0"+t:t},m=(null!==o?o:i<.999)?f(i):"";return`#${f(d)}${f(h)}${f(p)}${m}`},h=({name:e,value:t="#000000",onChange:n,supportAlpha:i=!0})=>{const a=(0,r.useRef)(),s=(0,r.useRef)(),h=(0,r.useRef)(),p=(0,r.useRef)(),f=(0,r.useRef)(),[m,g]=(0,r.useState)(!1),[y,b]=(0,r.useState)(t),[v,x]=(0,r.useState)((()=>{const e=u(t);return i||(e.a=100),e})),[k,w]=(0,r.useState)(!1),[_,S]=(0,r.useState)(!1),[E,C]=(0,r.useState)(!1),[A,O]=(0,r.useState)({top:0,left:0});(0,r.useEffect)((()=>{b(t);const e=u(t);i||(e.a=100),x(e)}),[t,i]);const M=(0,r.useCallback)((()=>{y!==t&&n(y,e),g(!1)}),[y,t,n,e]);var R,P;R=a,P=M,(0,r.useEffect)((()=>{let e=!1,t=!1;const n=n=>{!e&&t&&R.current&&!R.current.contains(n.target)&&P(n)},r=n=>{t=R.current,e=R.current&&R.current.contains(n.target)};return document.addEventListener("mousedown",r),document.addEventListener("touchstart",r),document.addEventListener("click",n),()=>{document.removeEventListener("mousedown",r),document.removeEventListener("touchstart",r),document.removeEventListener("click",n)}}),[R,P]),(0,r.useEffect)((()=>{if(m&&s.current&&a.current){const e=s.current.getBoundingClientRect(),t=224,n=i?285:260;let r=e.top-n-8,o=e.left+e.width/2-t/2;r<10&&(r=e.bottom+8),o<10&&(o=10),o+t>window.innerWidth-10&&(o=window.innerWidth-t-10),r>e.bottom&&r+n>window.innerHeight-10&&(r=e.top-n-8),O({top:r,left:o})}}),[m,i]);const T=e=>{x(e);const t=d(e.h,e.s,e.v,e.a,!!i&&null);b(t)},z=e=>{if(!h.current)return;const t=h.current.getBoundingClientRect(),n=Math.max(0,Math.min(1,(e.clientX-t.left)/t.width)),r=Math.max(0,Math.min(1,(e.clientY-t.top)/t.height)),o={h:v.h,s:100*n,v:100*(1-r),a:v.a};T(o)},j=e=>{if(!p.current)return;const t=p.current.getBoundingClientRect(),n={h:360*Math.max(0,Math.min(1,(e.clientX-t.left)/t.width)),s:v.s,v:v.v,a:v.a};T(n)},I=e=>{if(!f.current)return;const t=f.current.getBoundingClientRect(),n=Math.max(0,Math.min(1,(e.clientX-t.left)/t.width)),r={h:v.h,s:v.s,v:v.v,a:100*n};T(r)};(0,r.useEffect)((()=>{const e=e=>{k?z(e):_?j(e):E&&I(e)},t=()=>{w(!1),S(!1),C(!1)};return(k||_||E)&&(document.addEventListener("mousemove",e),document.addEventListener("mouseup",t)),()=>{document.removeEventListener("mousemove",e),document.removeEventListener("mouseup",t)}}),[k,_,E,v]);const N=d(v.h,100,100,100),$=d(v.h,v.s,v.v,100);return o().createElement(c,{className:"neko-color-picker"},o().createElement("div",{className:"swatch",ref:s,onClick:()=>g(!0)},o().createElement("div",{style:{backgroundColor:y,position:"absolute",top:0,left:0,right:0,bottom:0}})),m&&o().createElement("div",{className:"popover",ref:a,style:{top:`${A.top}px`,left:`${A.left}px`}},o().createElement("div",{className:"color-picker-area",ref:h,style:{backgroundColor:N},onMouseDown:e=>{w(!0),z(e)}},o().createElement("div",{className:"color-picker-cursor",style:{left:`${v.s}%`,top:100-v.v+"%",backgroundColor:$}})),o().createElement("div",{className:"hue-slider",ref:p,onMouseDown:e=>{S(!0),j(e)}},o().createElement("div",{className:"hue-cursor",style:{left:v.h/360*100+"%",backgroundColor:N}})),i&&o().createElement("div",{className:"alpha-slider",ref:f,style:{"--current-color":$},onMouseDown:e=>{C(!0),I(e)}},o().createElement("div",{className:"alpha-cursor",style:{left:`${v.a}%`,backgroundColor:y}})),o().createElement("input",{type:"text",className:"hex-input",value:y,onChange:e=>{const t=e.target.value,n=i?9:7;if(/^#[0-9A-Fa-f]{0,8}$/.test(t)&&t.length<=n&&(b(t),7===t.length||i&&9===t.length)){const e=u(t);i||(e.a=100),x(e)}},maxLength:i?9:7,placeholder:i?"#RRGGBBAA":"#RRGGBB"}),o().createElement("div",{style:{display:"flex",padding:0}},o().createElement(l.M,{style:{flex:1},onClick:()=>n(y,e)},"Apply"))))};h.propTypes={name:a().string,value:a().string,onChange:a().func.isRequired,supportAlpha:a().bool}},8696:(e,t,n)=>{"use strict";n.d(t,{A:()=>f});var r=n(1594),o=n.n(r),i=n(7639),a=n.n(i),s=n(3185),l=n(5484),c=n(6897);function u(){return u=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},u.apply(this,arguments)}const d=e=>e.split(",").map((e=>e.trim())).filter((e=>e.length>0)),h=(e,t)=>{const{type:n="text",name:i,value:a="",description:s,placeholder:h="",onChange:p,onEnter:f,onBlur:m,onFinalChange:g,readOnly:y=!1,step:b=1,min:v=0,max:x=null,maxLength:k,natural:w=!1,onReset:_,isCommaSeparatedArray:S=!1,iconEmpty:E,iconFilled:C,onEmptyIconClick:A,onFilledIconClick:O,className:M,style:R,inputStyle:P,...T}=e,[z,j]=(0,r.useState)(a||0===a?a:""),I=!!p,N=k||("number"===n?3:void 0);(0,r.useEffect)((()=>{g&&(f||m)&&console.warn("NekoInput: Since onFinalChange is used, onEnter and onBlur are redundant.")}),[g,f,m]),(0,r.useEffect)((()=>{var e;I||j(S?(e=a,Array.isArray(e)||(console.warn("The provided value is not an array. Falling back to an empty array."),e=[]),e.join(", ")):a)}),[a]);const $=e=>{const t=e.target.value,n=S?d(t):t;e.stopPropagation(),e.preventDefault(),I?p(n,i):j(t)},L=e=>{if("Enter"===e.key){e.preventDefault();const t=e.target.value,n=S?d(t):t;g?g(n,i):f&&f(n,i)}},D=e=>{const t=e.target.value,n=S?d(t):t;(S?((e,t)=>{if(!Array.isArray(e)||!Array.isArray(t)||e.length!==t.length)return!1;for(let n=0;n<e.length;n++)if(e[n]!==t[n])return!1;return!0})(a,n):a===n)||(g?g(n,i):m&&m(n,i))},F=(0,c.gR)("neko-input",{natural:w}),B=()=>{const e=I?a:z;return S?!!Array.isArray(e)&&e.length>0:e&&""!==e},W=E||C,H=B()&&C,q=!B()&&E;return o().createElement("div",{className:M,style:R},o().createElement("div",{style:{position:"relative"}},"number"===n?o().createElement("input",u({ref:t,className:F,name:i,value:I?a:z,type:n,disabled:y,step:b,min:v,max:x,maxLength:N,autoComplete:"off","data-form-type":"other",placeholder:h,style:{...P,paddingRight:W?"30px":void 0},onChange:$,onKeyPress:L,onBlur:e=>{(e=>{const t=Number(e.target.value);v&&t<Number(v)?e.target.value=v:x&&t>Number(x)&&(e.target.value=x)})(e),D(e)},readOnly:y},T)):o().createElement("input",u({ref:t,className:F},T,{name:i,value:I?a:z,type:n,disabled:y,spellCheck:"false",autoComplete:"off","data-form-type":"other",placeholder:h,style:{...P,paddingRight:W?"30px":void 0},maxLength:N,onChange:$,onKeyPress:L,onBlur:D,readOnly:y},T)),!!a&&!!_&&o().createElement(l.z,{icon:"close",width:24,style:{position:"absolute",top:"3px",right:"3px"},variant:"blue",onClick:()=>_()}),q&&o().createElement(l.z,{icon:E,width:15,style:{position:"absolute",top:"50%",right:"8px",transform:"translateY(-50%)",pointerEvents:A?"auto":"none",cursor:A?"pointer":"default"},color:"#5a5a5a82",onClick:A}),H&&o().createElement(l.z,{icon:C,width:15,style:{position:"absolute",top:"50%",right:"8px",transform:"translateY(-50%)",pointerEvents:O?"auto":"none",cursor:O?"pointer":"default"},color:"var(--neko-blue)",onClick:O})),s&&("string"==typeof s?o().createElement("p",{className:"neko-input-description",dangerouslySetInnerHTML:{__html:s}}):o().createElement("p",{className:"neko-input-description"},s)))},p=(0,s.Ay)((0,r.forwardRef)(h))`
  .neko-input {
    font-family: var(--neko-font-family);
    font-size: var(--neko-font-size);
    border: 1.5px solid var(--neko-input-border);
    box-sizing: border-box;
    height: 30px;
    background: var(--neko-input-background);
    color: black;
    padding: 0 10px;
    width: 100%;
    border-radius: var(--neko-radius-md);
    box-shadow: var(--neko-shadow-xs);
    transition: background 0.3s ease, box-shadow 0.2s ease;

    &.natural {
      border-color: gray;
      border-width: 1px;
    }

    &::placeholder {
      color: rgba(0, 0, 0, 0.25);
    }

    &:focus { 
      background-color: white; 
      outline: none !important;
      box-shadow: none !important;
      border-color: var(--neko-input-border) !important;
    }
    
    &:focus-visible {
      outline: none !important;
      box-shadow: none !important;
      border-color: var(--neko-input-border) !important;
    }

    &:focus-within {
      outline: none !important;
      box-shadow: none !important;
      border-color: var(--neko-input-border) !important;
    }

    &:read-only {
      color: var(--neko-gray-60);
    }

    &:disabled {
      color: var(--neko-gray-60);
      background: var(--neko-gray-98);
      border: none;
      box-shadow: none;
    }
  }

  .neko-input-description {
    font-size: var(--neko-small-font-size);
    color: var(--neko-gray-60);
    line-height: 14px;
    margin-top: 5px;
    margin-bottom: 0;

    code {
      font-size: 9px;
      background: #016fba14;
      border-radius: 5px;
      padding: 2px 4px;
    }
  }
`,f=o().forwardRef(((e,t)=>o().createElement(p,u({ref:t},e))));f.propTypes={type:a().oneOf(["number","text"]),name:a().string,value:a().oneOfType([a().string,a().array]),description:a().string,placeholder:a().string,onChange:a().func,onEnter:a().func,onBlur:a().func,onFinalChange:a().func,readOnly:a().bool,step:a().number,min:a().number,max:a().number,maxLength:a().number,natural:a().bool,onReset:a().func,isCommaSeparatedArray:a().bool,iconEmpty:a().string,iconFilled:a().string,onEmptyIconClick:a().func,onFilledIconClick:a().func}},3516:(e,t,n)=>{"use strict";n.d(t,{j:()=>T,u:()=>P});var r=n(1594),o=n.n(r),i=n(7639),a=n.n(i),s=n(1329),l=n(6897),c=n(6087),u=n(5055),d=n(2480),h=n(2673);
/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const p=(0,h.A)("square-check-big",[["path",{d:"M21 10.656V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12.344",key:"2acyp4"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]]);var f=n(8785);
/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const m=(0,h.A)("circle-dot",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["circle",{cx:"12",cy:"12",r:"1",key:"41hilf"}]]),g=(0,h.A)("circle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]]);var y=n(5484),b=n(8696),v=n(374),x=n(3185);const k=x.Ay.div`
  position: relative;
  border-radius: 8px;
  user-select: none;
  cursor: pointer;
  transition: background 0.3s ease, color 0.3s ease;
  color: black;
  box-sizing: border-box;

  .neko-select-option-label {
    overflow: hidden;
    height: 100%;
    display: flex;
    align-items: center;
  }

  &.show-options {
    border-radius: 8px 8px 0 0;
  }

  &[data-is-disabled=true], &.disabled {
    cursor: none;
    pointer-events: none;
    color: var(--neko-gray-60);

    .neko-select-option {
      pointer-events: none;
      background: var(--neko-gray-98);
      border-color: var(--neko-gray-60);
    }
  }

  &.neko-dropdown-up {}
`,w=x.Ay.div`
  align-items: center;
  background-color: var(--neko-input-background);
  border: 1.5px solid var(--neko-input-border);
  border-radius: var(--neko-radius-md);
  display: flex;
  font-size: var(--neko-font-size); 
  padding: 0 5px 0 10px;
  box-sizing: border-box;
  height: 30px;
  box-shadow: var(--neko-shadow-xs);

  &.isBusy {
    padding-left: 5px;
  }

  .rightContent {
    align-items: center;
    display: flex;
    margin-left: auto;
  }

  /* Chevron hover animation */
  .rightContent .neko-chevron-wrap {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transform-origin: center;
    transition: transform 160ms cubic-bezier(0.2, 0.8, 0.2, 1);
    will-change: transform;
  }

  &:hover .rightContent .neko-chevron-wrap { transform: scale(1.06); }

  /* Chevron color transition */
  .rightContent .neko-select-chevron {
    color: var(--neko-font-color);
    transition: color 150ms ease;
  }

  &:hover .rightContent .neko-select-chevron { color: var(--neko-main-color); }
`,_=x.Ay.div`
  display: block;
  margin-top: 5px;
  font-size: var(--neko-small-font-size);
  line-height: 14px;
  color: var(--neko-gray-60);

  code {
    font-size: 9px;
    background: #016fba14;
    border-radius: 5px;
    padding: 2px 4px;
  }

  * {
    line-height: inherit;
    margin: 0;
  }
`,S=x.Ay.div`
  position: absolute;
  left: 0;
  z-index: 9999;
  border-radius: var(--neko-radius-md);
  overflow: hidden;
  min-width: 100%;
  width: max-content;
  max-width: 100vw;
  top: 100%;
  margin-top: 4px;
  background: var(--neko-white);
  border: 1px solid var(--neko-input-border);
  box-shadow: var(--neko-shadow-lg);
  
  &.neko-dropdown-up {
    top: auto;
    bottom: 100%;
  }
  
  &.hidden {
    opacity: 0;
  }
`,E=x.Ay.div`
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 320px;
  background-color: var(--neko-white);

  /* Custom scrollbar styling */
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
    border: 2px solid transparent;
    background-clip: content-box;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: rgba(255, 255, 255, 0.5);
  }

  &.neko-select-filter-container {
    background-color: var(--neko-white);
    position: relative;
    padding: 6px;
    margin-top: 0;
  }
`,C=x.Ay.div`
  margin-bottom: 0px;

  input {
    display: none;
  }

  label {
    cursor: pointer;
    display: flex;

    svg {
      flex-shrink: 0;
    }
  }

  .inner-container {
    margin-left: 4px;

    .label {
      display: block;
      font-size: var(--neko-font-size);
      line-height: 17px;
      padding-top: 4.5px;
      padding-bottom: 4px;
    }

    .description {
      display: block;
      font-size: var(--neko-small-font-size);
    }
  }

  &.disabled {
    color: var(--neko-disabled-color);

    label {
      cursor: default;
    }
  }
`,A=x.Ay.div`
  background-color: var(--neko-white);
  cursor: pointer;
  font-size: var(--neko-font-size); 
  padding: 7px 13px;
  transition: background-color 0.12s ease, box-shadow 0.2s ease;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: -60%;
    width: 120%;
    background: linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0) 100%);
    opacity: 0;
    pointer-events: none;
    transform: translateX(-120%) skewX(-15deg);
  }

  @keyframes nekoOptionGloss {
    0% { opacity: 0; transform: translateX(-120%) skewX(-15deg); }
    20% { opacity: .35; }
    100% { opacity: 0; transform: translateX(120%) skewX(-15deg); }
  }

  &:hover {
    background-color: var(--neko-main-color-95);
    box-shadow: var(--neko-shadow-xs);
  }

  &:hover::after { animation: nekoOptionGloss 650ms ease; }

  input {
    display: none;
  }

  .option {
    align-items: center;
    color: var(--neko-font-color);
    display: flex;
    justify-content: space-between;
    font-size: var(--neko-font-size); 
    line-height: 17px;

    .option-group {
      align-items: center;
      display: flex;
    }
  }

  &.disabled {
    background-color: var(--neko-gray-98);
    pointer-events: none;

    .option {
      color: var(--neko-gray-60);
    }
  }
`;function O(){return O=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},O.apply(this,arguments)}const M=e=>{const{name:t,description:n,scrolldown:i=!1,isPro:a=!1,onChange:h,isBusy:p=!1,chevronIconSize:f=u.hS.chevron,textFiltering:m,value:g,className:x,disabled:C,requirePro:A,multiple:M=!1,...R}=e;let P,T,z,j,I=15;if(M){const t=o().Children.toArray(e.children).filter((e=>(g||[]).includes(e.props.value)||e.props.checked)).map((e=>e.props));P=t.map((e=>e.label)).join(", ")||"Select",T=n,z=t.some((e=>e.requirePro))||A,j=null}else{var N;const t=null===(N=o().Children.toArray(e.children).find((e=>e.props.value===g||e.props.checked)))||void 0===N?void 0:N.props;P=(null==t?void 0:t.label)||"Select",T=(null==t?void 0:t.description)||n,z=(null==t?void 0:t.requirePro)||A,j=null==t?void 0:t.icon,I=(null==t?void 0:t.iconSize)||15}const[$,L]=(0,r.useState)(!1),[D,F]=(0,r.useState)(""),B=(0,r.useRef)(),W=z&&!a;(0,r.useEffect)((()=>{const e=e=>{"Escape"===e.key&&$&&L(!1)};if($)return document.addEventListener("keydown",e),()=>{document.removeEventListener("keydown",e)}}),[$]);const H=o().Children.map(e.children,(n=>n?o().cloneElement(n,{name:n.props.name||t,checked:M?(g||[]).includes(n.props.value)||n.props.checked:n.props.value===g||n.props.checked,onClick:r=>((n,r)=>{if(n.stopPropagation(),h)if(M){let e=Array.isArray(g)?[...g]:[];e.includes(r)?e=e.filter((e=>e!==r)):e.push(r),h(e,t)}else r!==g&&h(r,t),i&&L(!1);else console.log("The onChange handler is not set for this select.",e)})(r,n.props.value),scrolldown:i,isPro:a,disabled:C,multiple:M}):null)),q=(0,r.useMemo)((()=>{if(!D||!H.length)return H;const e=D.toLowerCase().split(" ").filter((e=>e.length>0));return o().Children.toArray(H).filter((t=>{const n=`${"string"==typeof t.props.label?t.props.label.toLowerCase():""} ${"string"==typeof t.props.value?t.props.value.toLowerCase():""}`;return e.every((e=>n.includes(e)))}))}),[H,D]),U=(0,l.gR)("neko-select",x,{"show-options":$,disabled:C||p}),V=(0,l.gR)("neko-select-options",{hidden:!$}),K=(0,l.gR)("neko-select-option",{isBusy:p});return i?o().createElement(k,O({name:t},R,{onClick:()=>{C||p||L(!$)},className:U,"data-is-disabled":C||p,ref:B}),o().createElement(w,{className:K},p?o().createElement(o().Fragment,null,o().createElement(c.X,{type:"circle",size:"20px"})):o().createElement(o().Fragment,null,j&&o().createElement(y.z,{icon:j,width:I,height:I,style:{marginRight:`${Math.max(I-15,4)}px`}}),o().createElement("span",{className:"neko-select-option-label"},P),o().createElement("div",{className:"rightContent"},W&&o().createElement(s.K,null),o().createElement("span",{className:"neko-chevron-wrap"},o().createElement(d.A,{size:f,className:"neko-select-chevron",style:{transform:$?"rotate(180deg)":"rotate(0deg)",transition:"transform 180ms cubic-bezier(0.2, 0.8, 0.2, 1)"}}))))),T&&("string"==typeof T?o().createElement(_,{dangerouslySetInnerHTML:{__html:T}}):o().createElement(_,null,T)),o().createElement(v.G,{visible:$,targetRef:B,onClose:()=>{$&&L(!1)}},o().createElement(S,{className:V},m&&o().createElement(E,{className:"neko-select-filter-container"},o().createElement(b.A,{value:D,placeholder:"Search...",onChange:e=>F(e),onClick:e=>e.stopPropagation(),style:{background:"var(--neko-white)",borderRadius:10,margin:"5px 7px",borderColor:"var(--neko-input-background)"},inputStyle:{margin:0,borderRadius:0},autoFocus:!0})),o().createElement(E,null,q)))):H},R=e=>{const{id:t,name:n,value:r,checked:i=!1,label:a,description:c,onClick:u,scrolldown:d=!1,isPro:h=!1,optionDisabled:b=!1,requirePro:v=!1,icon:x,iconSize:k=20,multiple:w=!1}=e,S=v&&!h,E=(0,l.gR)({"neko-radio":!d},{"neko-select-option":d},e.className,{disabled:S||b}),O=w?i?p:f.A:i?m:g,M=o().createElement(A,{className:E,onClick:e=>{u(e,r)}},o().createElement("div",{className:"option"},o().createElement("div",{className:"option-group"},w?o().createElement(O,{size:k,color:S?"var(--neko-disabled-color)":i?"var(--neko-main-color)":"var(--neko-input-border)",style:{marginRight:"8px"}}):o().createElement("div",{style:{position:"relative",width:k,height:k,flexShrink:0,marginRight:"8px"}},o().createElement(g,{size:k,color:S?"var(--neko-disabled-color)":"var(--neko-input-border)",strokeWidth:1.5}),i&&o().createElement("div",{style:{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)",width:.4*k,height:.4*k,borderRadius:"50%",backgroundColor:S?"var(--neko-disabled-color)":"var(--neko-main-color)"}})),x&&o().createElement(y.z,{icon:x,width:k,height:k,style:{marginRight:`${Math.max(k-11,4)}px`}}),a),o().createElement(s.K,{show:S}))),R=o().createElement(C,{className:E,onClick:e=>{u(e,r)}},o().createElement("label",{htmlFor:t},o().createElement("div",{style:{position:"relative",width:24,height:24,flexShrink:0}},o().createElement(g,{size:24,color:S?"var(--neko-disabled-color)":"var(--neko-input-border)",strokeWidth:1.5}),i&&o().createElement("div",{style:{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)",width:10,height:10,borderRadius:"50%",backgroundColor:S?"var(--neko-disabled-color)":"var(--neko-main-color)"}})),o().createElement("div",{className:"inner-container"},o().createElement("span",{className:"label"},a,o().createElement(s.K,{className:"inline",style:{top:-1},show:S})),c&&("string"==typeof c?o().createElement(_,{style:{marginTop:0},dangerouslySetInnerHTML:{__html:c}}):o().createElement(_,{style:{marginTop:0}},c)))));return d?M:R},P=e=>o().createElement(M,e);P.propTypes={name:a().string,description:a().string,scrolldown:a().bool,isPro:a().bool,onChange:a().func,isBusy:a().bool,chevronIconSize:a().number,textFiltering:a().bool,multiple:a().bool};const T=e=>o().createElement(R,e);T.propTypes={id:a().string,name:a().string,value:a().string,checked:a().bool,label:a().string,description:a().string,onClick:a().func,scrolldown:a().bool,isPro:a().bool,optionDisabled:a().bool,requirePro:a().bool,icon:a().string,iconSize:a().number,multiple:a().bool}},8051:(e,t,n)=>{"use strict";n.d(t,{$:()=>v});var r=n(1594),o=n.n(r),i=n(7639),a=n.n(i),s=n(3185);const l=s.Ay.div`
  position: relative;
  user-select: none;
  padding-top: 24px;
`,c=s.Ay.div`
  position: relative;
  height: 20px;
  cursor: pointer;
  padding: 0 10px;
`,u=s.Ay.div`
  position: absolute;
  top: 50%;
  left: 10px;
  right: 10px;
  height: 6px;
  background: ${e=>e.$disabled?"var(--neko-disabled-color)":"var(--neko-gray-90)"};
  border-radius: 3px;
  transform: translateY(-50%);
  opacity: ${e=>e.$disabled?.5:1};
  transition: background 0.3s ease, opacity 0.3s ease;
`,d=s.Ay.div`
  position: absolute;
  top: 50%;
  left: 10px;
  height: 6px;
  background: ${e=>e.$disabled?"var(--neko-disabled-color)":"var(--neko-main-color)"};
  border-radius: 3px;
  transform: translateY(-50%);
  pointer-events: none;
  transition: background 0.3s ease;
`,h=s.Ay.div`
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  background: ${e=>e.$disabled?"var(--neko-disabled-color)":"var(--neko-main-color)"};
  border-radius: 50%;
  cursor: ${e=>e.$disabled?"not-allowed":"grab"};
  transition: background 0.3s ease, box-shadow 0.2s ease;
  z-index: 2;

  &:hover {
    box-shadow: ${e=>e.$disabled?"none":"0 0 0 8px rgba(0, 123, 255, 0.1)"};
  }

  &:active {
    cursor: ${e=>e.$disabled?"not-allowed":"grabbing"};
    box-shadow: ${e=>e.$disabled?"none":"0 0 0 12px rgba(0, 123, 255, 0.15)"};
  }

  &.dragging {
    cursor: grabbing;
    box-shadow: 0 0 0 12px rgba(0, 123, 255, 0.15);
  }
`,p=s.Ay.div`
  position: absolute;
  top: 50%;
  width: 3px;
  height: 14px;
  background: var(--neko-green, #00b386);
  border-radius: 5px;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 1;
`,f=s.Ay.div`
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 10px;
  transform: translateY(-50%);
  pointer-events: none;
  opacity: ${e=>e.$visible?1:0};
  transition: opacity 0.2s ease;
`,m=s.Ay.div`
  position: absolute;
  top: 50%;
  width: 1px;
  height: 8px;
  background: var(--neko-gray-80);
  transform: translate(-50%, -50%);
`,g=s.Ay.div`
  position: absolute;
  top: 6px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: var(--neko-gray-70);
  pointer-events: none;
`,y=s.Ay.div`
  position: absolute;
  transform: translateX(-50%);
  white-space: nowrap;
  font-weight: ${e=>e.$isCurrent?"600":"400"};
  color: ${e=>e.$disabled?"var(--neko-gray-70)":e.$isCurrent&&!e.$disabled?"var(--neko-main-color)":e.$isRecommended&&!e.$disabled?"var(--neko-green, #00b386)":"var(--neko-gray-70)"};
  opacity: ${e=>e.$visible?1:0};
  transition: color 0.3s ease, opacity 0.2s ease;
`,b=s.Ay.div`
  margin-top: 5px;
  margin-bottom: 0;
  font-size: var(--neko-small-font-size);
  color: var(--neko-gray-60);
  line-height: 14px;
`,v=({name:e,value:t,min:n=0,max:i=100,step:a=1,marks:s,recommended:v,description:x,onChange:k,onFinalChange:w,disabled:_=!1,showLabels:S=!0,formatValue:E,labelFormatter:C,className:A,style:O})=>{const[M,R]=(0,r.useState)(t??n),[P,T]=(0,r.useState)(!1),z=(0,r.useRef)(null),j=(0,r.useRef)(null),I=void 0!==t,N=I?t:M;(0,r.useEffect)((()=>{I&&void 0!==t&&R(t)}),[t,I]);const $=(0,r.useCallback)((e=>{const t=Math.round(e/a)*a;return Math.max(n,Math.min(i,t))}),[n,i,a]),L=(0,r.useCallback)((e=>(e-n)/(i-n)*100),[n,i]),D=(0,r.useCallback)((e=>{if(!z.current)return N;const t=z.current.getBoundingClientRect(),r=t.width-20,o=e-t.left-10,a=Math.max(0,Math.min(1,o/r));return $(n+a*(i-n))}),[n,i,N,$]),F=(0,r.useCallback)((t=>{const n=$(t);I||R(n),k&&k(n,e)}),[I,k,e,$]),B=(0,r.useCallback)((t=>{w&&w(t,e)}),[w,e]),W=(0,r.useCallback)((e=>{if(_)return;e.preventDefault(),T(!0);let t=D(e.clientX);F(t);const n=e=>{t=D(e.clientX),F(t)},r=()=>{T(!1),B(t),document.removeEventListener("mousemove",n),document.removeEventListener("mouseup",r)};document.addEventListener("mousemove",n),document.addEventListener("mouseup",r)}),[_,D,F,B]),H=(0,r.useCallback)((e=>{if(_||e.target===j.current)return;const t=D(e.clientX);F(t),B(t)}),[_,D,F,B]),q=(0,r.useCallback)((e=>E?E(e):Number.isInteger(e)?e.toString():e.toFixed(1)),[E]),U=(0,r.useCallback)((e=>C?C(e):q(e)),[C,q]),V=(0,r.useMemo)((()=>{const e=i-n,t=[];if(s&&Array.isArray(s))s.forEach((r=>{if(r>n&&r<i){const o=(r-n)/e*100;t.push({value:r,position:o})}}));else{let r;r=e<=10?1:e<=50?5:e<=100?10:e<=500?50:e<=1e3?100:e<=5e3?500:Math.pow(10,Math.floor(Math.log10(e/5)));for(let o=n+r;o<i;o+=r){const r=(o-n)/e*100;t.push({value:o,position:r})}}return t}),[n,i,s]),K=L(N),Q=void 0!==v&&v>=n&&v<=i;return o().createElement(l,{className:A,style:O,$hasDescription:!!x},S&&o().createElement(g,null,o().createElement(y,{style:{left:"10px"},$visible:P},U(n)),Q&&!_&&o().createElement(y,{style:{left:`calc(10px + (100% - 20px) * ${L(v)/100})`},$isRecommended:!0,$visible:!0,$disabled:_},U(v)),o().createElement(y,{style:{left:`calc(10px + (100% - 20px) * ${K/100})`},$isCurrent:!0,$visible:!0,$disabled:_},U(N)),o().createElement(y,{style:{left:"calc(100% - 10px)"},$visible:P},U(i))),o().createElement(c,{ref:z,onClick:H},o().createElement(u,{$disabled:_}),o().createElement(f,{$visible:P},V.map(((e,t)=>o().createElement(m,{key:t,style:{left:`calc(10px + (100% - 20px) * ${e.position/100})`}})))),o().createElement(d,{style:{width:`calc((100% - 20px) * ${K/100})`},$disabled:_}),Q&&!_&&o().createElement(p,{style:{left:`calc(10px + (100% - 20px) * ${L(v)/100})`}}),o().createElement(h,{ref:j,className:P?"dragging":"",style:{left:`calc(10px + (100% - 20px) * ${K/100})`},onMouseDown:W,$disabled:_})),x&&o().createElement(b,null,x))};v.propTypes={name:a().string,value:a().number,min:a().number,max:a().number,step:a().number,marks:a().arrayOf(a().number),recommended:a().number,description:a().string,onChange:a().func,onFinalChange:a().func,disabled:a().bool,showLabels:a().bool,formatValue:a().func,labelFormatter:a().func,className:a().string,style:a().object}},8482:(e,t,n)=>{"use strict";n.d(t,{S:()=>d});var r=n(1594),o=n(7639),i=n.n(o),a=n(3185),s=n(6897);function l(){return l=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},l.apply(this,arguments)}function c(e){return"number"==typeof e?`${e}px`:e}const u=a.Ay.div`
  color: var(--neko-white);
  font-family: var(--neko-font-family);
  font-size: ${e=>e.fontSize};
  position: relative;
  display: inline-block;
  width: ${e=>c(e.width)};
  height: ${e=>c(e.height)};

  &[data-is-disabled=disabled] {
    opacity: 0.6;
    transition: opacity 160ms ease-in-out;

    .neko-slider {
      cursor: not-allowed;
      box-shadow: var(--neko-shadow-xs);
    }
  }

  input {
    opacity: 0;
    width: 0;
    height: 0;
    border: 0;
  }

  .neko-slider {
    background: 
      linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.1) 0%,
        transparent 40%
      ),
      linear-gradient(
        to bottom,
        ${e=>e.$offBackgroundColor||"var(--neko-disabled-color)"},
        color-mix(in srgb, ${e=>e.$offBackgroundColor||"var(--neko-disabled-color)"} 90%, black)
      );
    border-radius: 35px;
    align-items: center;
    cursor: pointer;
    display: inline-flex;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    transition: background 260ms ease-in-out, box-shadow 160ms ease-in-out;
    will-change: background, box-shadow;
    margin-bottom: -2px;
    box-shadow: 
      var(--neko-shadow-xs),
      inset 0 1px 0 rgba(255, 255, 255, 0.05),
      inset 0 -1px 0 rgba(0, 0, 0, 0.1);
  }

  .neko-slider:before {
    border-radius: 50%;
    position: absolute;
    content: "";
    height: ${e=>`calc(${c(e.height)} - 8px)`};
    width: ${e=>`calc(${c(e.height)} - 8px)`};
    left: 4px;
    top: 50%;
    background-color: white;
    transition: transform 220ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 160ms ease-in-out;
    box-shadow: 0 1px 2px rgba(16, 24, 40, 0.18);
    will-change: transform, box-shadow;
    transform: translate(0, -50%);
  }

  .neko-slider:after {
    content: "${e=>e.$offLabel}";
    margin-left: auto;
    margin-right: ${e=>`calc(${c(e.height)} / 2)`};
  }

  &.neko-checked .neko-slider {
    background: 
      linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.15) 0%,
        transparent 40%
      ),
      linear-gradient(
        to bottom,
        ${e=>e.$onBackgroundColor},
        color-mix(in srgb, ${e=>e.$onBackgroundColor} 85%, black)
      );
    box-shadow: 
      var(--neko-shadow-sm),
      inset 0 1px 0 rgba(255, 255, 255, 0.1),
      inset 0 -1px 0 rgba(0, 0, 0, 0.15);
  }

  &.neko-checked .neko-slider:before {
    transform: translate(${e=>`calc(${c(e.width)} - ${c(e.height)})`}, -50%);
    box-shadow: 0 1px 2px rgba(16, 24, 40, 0.18), 0 2px 4px rgba(16, 24, 40, 0.12);
  }

  &.neko-checked .neko-slider:after {
    content: "${e=>e.$onLabel}";
    margin-left: ${e=>`calc(${c(e.height)} / 2)`};
    margin-right: auto;
  }

  /* Hover/active states for a touch of life */
  &:not([data-is-disabled=disabled]) .neko-slider:hover { box-shadow: var(--neko-shadow-sm); }

  @media (prefers-reduced-motion: reduce) {
    .neko-slider { transition: none; }
    .neko-slider:before { transition: none; }
  }
`,d=e=>{let{width:t,height:n=24,fontSize:o="13px",onLabel:i="Yes",offLabel:a="No",onBackgroundColor:c="var(--neko-success)",offBackgroundColor:d="var(--neko-disabled-color)",onValue:h,offValue:p,small:f,checked:m=!1,onChange:g,disabled:y=!1,...b}=e;const v=(0,s.gR)("neko-switch",{small:f,"neko-checked":m}),x=(0,r.useCallback)((e=>{if(y)return;g(e?void 0===h||h:void 0!==p&&p)}),[h,p,g,y]);f&&(n=20,o="11px");const k=t||(i&&""!==i||a&&""!==a?70:40);return React.createElement(u,l({className:v,width:k,height:n,fontSize:o},b,{$offBackgroundColor:d,$onBackgroundColor:c,$onLabel:i,$offLabel:a,"data-is-disabled":y?"disabled":""}),React.createElement("span",{className:"neko-slider",onClick:()=>x(!m)}))};d.propTypes={width:i().number,height:i().number,fontSize:i().string,onValue:i().string,offValue:i().string,checked:i().bool,onBackgroundColor:i().string,offBackgroundColor:i().string,onLabel:i().string,offLabel:i().string}},3896:(e,t,n)=>{"use strict";n.d(t,{m:()=>d});var r=n(1594),o=n.n(r),i=n(7639),a=n.n(i),s=n(3185),l=n(6897);function c(){return c=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},c.apply(this,arguments)}const u=(0,s.Ay)((e=>{const{name:t,value:n="",rows:i=6,description:a,placeholder:s="",onEnter:u=null,onBlurForce:d=!1,readOnly:h=!1,avoidOnEnterWithShift:p=!1,fullHeight:f=!1,maxLength:m=null,className:g,style:y,textAreaStyle:b={},countable:v=!1,disabled:x,tabToSpaces:k,...w}=e,[_,S]=(0,r.useState)(n),[E,C]=(0,r.useState)(0),[A,O]=(0,r.useState)(!1),M=!!e.onChange,R=(0,r.useRef)(null),P=(0,r.useCallback)((e=>{if(k&&"Tab"===e.key){e.preventDefault();const t=R.current.selectionStart,n=R.current.selectionEnd,r=R.current.value;R.current.value=r.substring(0,t)+"  "+r.substring(n),R.current.selectionStart=R.current.selectionEnd=t+2}else O(e.shiftKey)}),[]),T=(0,r.useCallback)((()=>{O(!1)}),[]);(0,r.useEffect)((()=>(document.addEventListener("keydown",P,!1),document.addEventListener("keyup",T,!1),()=>{document.removeEventListener("keydown",P,!1),document.removeEventListener("keyup",T,!1)})),[]),(0,r.useEffect)((()=>{if(M||S(n),"words"===v){const e=n.split(" ").filter((e=>""!==e)).length;C(e)}else v&&C(n.length)}),[n,v,M]);const z=(0,r.useCallback)((n=>{const r=m?n.target.value.substr(0,m):n.target.value;n.stopPropagation(),M?e.onChange(r,t):S(r,t)}),[m,M,e,t]),j=(0,l.gR)(g,{disabled:x});return o().createElement("div",{className:j,style:y},o().createElement("div",{className:"neko-textarea-container"},o().createElement("textarea",c({ref:R,className:"neko-textarea",rows:i,disabled:x},w,{name:t,spellCheck:"false",placeholder:s,onChange:z,onKeyPress:n=>{if(u&&!n.shiftKey&&"Enter"===n.key){if(p&&A)return;n.preventDefault(),e.onEnter(n.target.value,t)}},onBlur:r=>{(d||e.onBlur&&n!==r.target.value)&&e.onBlur(r.target.value,t)},readOnly:h,style:{...b,height:f?"100%":b.height??void 0},value:M?n:_})),o().createElement("div",{className:"neko-text-area-extra"},a&&("string"==typeof a?o().createElement("div",{className:"neko-input-description",dangerouslySetInnerHTML:{__html:a}}):o().createElement("div",{className:"neko-input-description"},a)),v&&o().createElement("div",{className:"neko-textarea-count"},E,m?` / ${m}`:""," ","words"===v?"words":"chars"))))}))`
  .neko-textarea-container {
    position: relative;
    height: ${e=>e.fullHeight?"100%":void 0}
  }

  .neko-textarea {
    font-size: var(--neko-font-size);
    border: 1.5px solid var(--neko-input-border);
    box-sizing: border-box;
    background: var(--neko-input-background);
    color: black;
    padding: 5px 10px;
    width: 100%;

    &::placeholder {
      color: rgba(0, 0, 0, 0.25);
    }

    &:focus {
      background-color: white;
      outline: none !important;
      box-shadow: none !important;
      border-color: var(--neko-input-border) !important;
    }
    
    &:focus-visible {
      outline: none !important;
      box-shadow: none !important;
      border-color: var(--neko-input-border) !important;
    }

    &:focus-within {
      outline: none !important;
      box-shadow: none !important;
      border-color: var(--neko-input-border) !important;
    }

    :read-only {
      background-color: var(--neko-gray-60);
      border: none;
    }
  }

  .neko-text-area-extra {
    display: flex;
    justify-content: space-between;
    color: var(--neko-gray-60);
    font-size: var(--neko-small-font-size);
    line-height: 14px;

    .neko-textarea-count {
      margin: 5px 0 0 10px;
      text-align: right;
      min-width: 130px;
      display: block;
    }
  
    .neko-input-description {
      margin-top: 5px;
      margin-bottom: 0;
      flex: auto;
      font-size: var(--neko-small-font-size);

      code {
        font-size: 9px;
        background: #016fba14;
        border-radius: 5px;
        padding: 2px 4px;
      }
    }
  }

  &.disabled {
    .neko-textarea {
      border: 1.5px solid var(--neko-disabled-color);
      cursor: not-allowed;
      opacity: 0.35;
    }
  }
`,d=e=>o().createElement(u,e);d.propTypes={name:a().string,value:a().string,rows:a().number,description:a().string,placeholder:a().string,onChange:a().func,onEnter:a().func,onBlur:a().func,onBlurForce:a().bool,readOnly:a().bool,avoidOnEnterWithShift:a().bool,fullHeight:a().bool}},8135:(e,t,n)=>{"use strict";n.d(t,{YS:()=>f,z3:()=>d,IU:()=>c,F1:()=>s,Tb:()=>u,yy:()=>h,FE:()=>p});var r=n(1594),o=n.n(r);class i{constructor(e,t="",n=null,r=null,o={}){this.url=n,this.message=e,this.code=t,this.body=r,this.debug=o,this.cancelledByUser="USER-ABORTED"===t}}const a=e=>{let t=[];return(n,r)=>{if("object"==typeof r&&null!==r){if(-1!==t.indexOf(r)){if(!e)throw console.warn("Circular reference found.",{key:n,value:r,cache:t,cacheIndex:t.indexOf(r)}),new Error("Circular reference found. Cancelled.");return}t.push(r)}return r}};function s(e,t=null,n=!0){return JSON.stringify(e,a(n),t)}const l=async(e,t={})=>{let n=null,r={},o=null,a=null;try{if((t=t||{}).headers=t.headers?t.headers:{},t.headers.Pragma="no-cache",t.headers["Cache-Control"]="no-cache",a=await fetch(`${e}`,t),n=await a.text(),r=JSON.parse(n),!r.success){let t=!1===r.success?"NOT-SUCCESS":"N/A",s=r.message?r.message:"Unknown error. Check your Console Logs.";"rest_no_route"===r.code?(s="The API can't be accessed. Are you sure the WP REST API is enabled? Check this article: https://meowapps.com/fix-wordpress-rest-api/.",t="NO-ROUTE"):"internal_server_error"===r.code&&(s="Server error. Please check your PHP Error Logs.",t="SERVER-ERROR"),o=new i(s,t,e,n||a)}}catch(t){console.error("[nekoFetch]",t);let r="BROKEN-REPLY",s="The reply sent by the server is broken.";"AbortError"===t.name?(r="USER-ABORTED",s="The request was aborted by the user."):a&&a.status&&408===a.status&&(r="REQUEST-TIMEOUT",s="The request generated a timeout."),o=new i(s,r,e,n||a,t)}return o&&(r.success=!1,r.message=o.message,r.error=o),(e=>{if(!e.data)return e;if(Array.isArray(e.data)&&e.data.length>0&&e.data[0].meta)for(let t of e.data)try{t.meta=JSON.parse(t.meta)}catch(e){console.error("[JsonFetcher]","Could not decode meta.",t.meta)}else if(!Array.isArray(e.data)&&e.data.meta)try{e.data.meta=JSON.parse(e.data.meta)}catch(t){console.error("[JsonFetcher]","Could not decode meta.",e.data.meta)}return e})(r)},c=async(e,t={})=>{const{json:n=null,method:r="GET",signal:o,file:i,nonce:a,bearerToken:c}=t;if("GET"===r&&n)throw new Error(`NekoFetch: GET method does not support json argument (${e}).`);let u=i?new FormData:null;if(i){u.append("file",i);for(const[e,t]of Object.entries(n))u.append(e,t)}const d={};a&&(d["X-WP-Nonce"]=a),c&&(d.Authorization=`Bearer ${c}`),u||(d["Content-Type"]="application/json");const h={method:r,headers:d,body:u||(n?s(n):null),signal:o};let p=null;try{var f;if(p=await l(e,h),!p.success)throw new Error((null===(f=p)||void 0===f?void 0:f.message)??"Unknown error.");return p}catch(e){throw e}},u=async(e,t={})=>{const{json:n={},signal:r,file:o,nonce:i,bearerToken:a}=t;let c=o?new FormData:null;if(o){c.append("file",o);for(const[e,t]of Object.entries(n))c.append(e,t)}const u=i?{"X-WP-Nonce":i}:{};return a&&(u.Authorization=`Bearer ${a}`),c||(u["Content-Type"]="application/json"),l(e,{method:"POST",headers:u,body:c||s(n),signal:r})},d=(e,t=2)=>{const n=t<0?0:t,r=["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"];let o=e>0?Math.floor(Math.log(e)/Math.log(1024)):0;return"Bytes"===r[o]&&(o=1),(e=parseFloat((e/Math.pow(1024,o)).toFixed(n))).toFixed(Math.max(n,(e.toString().split(".")[1]||[]).length))+" "+r[o]};function h(e){return new Promise((t=>setTimeout(t,e)))}const p=e=>o().createElement("span",{style:{display:"inline"},dangerouslySetInnerHTML:{__html:e}});class f extends o().Component{constructor(e){super(e),this.state={hasError:!1}}static getDerivedStateFromError(e){return{hasError:e}}render(){if(this.state.hasError){let e="";return e="string"==typeof this.state.hasError?this.state.hasError:this.state.hasError.message?this.state.hasError.message:this.state.hasError.toString?this.state.hasError.toString():s(this.state.hasError),o().createElement(o().Fragment,null,o().createElement("div",{style:{background:"var(--neko-red)",color:"white",margin:15,padding:15,borderRadius:15}},o().createElement("pre",{style:{margin:0,whiteSpace:"pre-wrap"}},"⚠️ ",o().createElement("b",null,"Error"),o().createElement("br",null),"Sorry, an error occured! Don't worry, I will fix this, so simply let me know about it.",o().createElement("br",null),"Here is some information about it:",o().createElement("br",null),o().createElement("br",null),e)))}return this.props.children}}},6897:(e,t,n)=>{"use strict";n.d(t,{$$:()=>h,G8:()=>f,XS:()=>u,gR:()=>p,jz:()=>l,v_:()=>d});var r=n(1594),o=n(9171),i=n(8135),a=n(9794),s=n(9296);const l=(e,t)=>{const n=(0,r.useRef)(),o=t?Array.isArray(t)?t:[t]:[n],i=t=>{if(!e)return;let n=!1;for(const e of o)if(null!=e&&e.current&&e.current.contains(t.target)){n=!0;break}n||e()};return(0,r.useEffect)((()=>(document.addEventListener("mousedown",i),()=>{document.removeEventListener("mousedown",i)})),[e,t]),n};const c=!1,u=({i18n:e=null,onStop:t=(()=>{})}={})=>{const[n,l]=(0,r.useState)((()=>new o.A({concurrency:1,autoStart:!1}))),[u,d]=(0,r.useState)((()=>new AbortController)),h=(0,r.useRef)(!1),p=(0,r.useRef)(0),f=(0,r.useRef)(null),m=(0,r.useRef)(0),g=(0,r.useRef)(0),[y,b]=(0,r.useState)(!1),[v,x]=(0,r.useState)(null),[k,w]=(0,r.useState)(!1),[_,S]=(0,r.useState)(0),[E,C]=(0,r.useState)(!1),[A,O]=(0,r.useState)(!1),[M,R]=(0,r.useState)(0);async function P(e,t=!1){try{t&&(p.current--,R((e=>e-1))),f.current=e;const r=await e(u.signal);if(!1===(null==r?void 0:r.success))throw new Error(r.message);t&&(g.current=m.current,n.start())}catch(e){if("AbortError"===(null==e?void 0:e.name))return void console.log("[useNekoTasks] Aborted");if(p.current++,!h.current){if(z(),g.current>0)return void await T();C(e)}}finally{R((e=>e+1))}}async function T(){if(C(!1),w(!1),g.current>0){if(g.current<m.current){const e=5e3*(m.current-g.current);c,b(!0),await(0,i.yy)(e),b(!1)}g.current--}f.current&&await P(f.current,!0)}const z=(0,r.useCallback)((()=>{n.pause(),w(!0)}),[n]),j=(0,r.useCallback)(P,[u,z,n]),I=(0,r.useCallback)(T,[j]),N=(0,r.useCallback)((async()=>{const e=new AbortController;d(e),C(!1),p.current=0,h.current=!1,w(!1),O(!1),R(0),S(0),l(new o.A({concurrency:1,autoStart:!1}))}),[]),$=(0,r.useCallback)((()=>{C(!1),w(!1),n.start()}),[n]),L=(0,r.useCallback)((()=>{O(!0),x(!1)}),[]),D=(0,r.useCallback)((async e=>new Promise((async t=>{C(!1),m.current=0,g.current=0,p.current=0,h.current=!1,w(!1),O(!1),x(!0),H(e),n.start(),await n.onIdle(),L(),t()}))),[L,n]),F=(0,r.useCallback)(((e=5)=>{m.current=e,g.current=e,I()}),[I]),B=(0,r.useCallback)((()=>{n.pause(),u.abort(),x(!1),C(!1),O(!1),t()}),[u,t,n]),W=(0,r.useCallback)((e=>{n.add((()=>j(e))),S((e=>e+1))}),[j,n]),H=(0,r.useCallback)((e=>{n.clear(),e.forEach((e=>W(e))),R(0)}),[W,n]),q=(0,r.useCallback)((()=>{h.current=!0}),[]),U=(0,r.useCallback)((()=>p.current),[]),V=(0,r.useMemo)((()=>React.createElement(a.n,{isOpen:!!E,onRequestClose:B,title:e?e.COMMON.ERROR:"Error",content:React.createElement(React.Fragment,null,React.createElement("b",null,null!=E&&E.message?E.message:"Unknown error."),React.createElement("p",null)),customButtons:React.createElement("div",{style:{display:"flex",width:"100%",flexDirection:"column"}},React.createElement("div",{style:{display:"flex",alignItems:"center"}},React.createElement(s.M,{style:{flex:2},className:"primary",onClick:I},e?e.COMMON.RETRY:"Retry"),React.createElement(s.M,{style:{flex:1},className:"secondary",onClick:()=>F(10)},React.createElement("small",null,e?e.COMMON.AUTO_RETRY:"Auto Retry")),React.createElement(s.M,{style:{flex:2},className:"primary",onClick:$},e?e.COMMON.SKIP:"Skip"),React.createElement(s.M,{style:{flex:1},className:"secondary",onClick:()=>{q(),$()}},React.createElement("small",null,e?e.COMMON.AUTO_SKIP:"Auto Skip")),React.createElement(s.M,{style:{flex:2},className:"danger",onClick:B},e?e.COMMON.STOP:"Stop")),React.createElement("small",{style:{marginTop:10,lineHeight:"13px"}},e?e.COMMON.AUTO_RETRY_DESCRIPTION:"Auto Retry will retry the task 10 times."))})),[F,E,e,$,I,q,B]);return{start:D,stop:B,pause:z,resume:$,reset:N,retry:I,autoRetry:F,isSleeping:y,addTask:W,setAlwaysSkip:q,getErrorCount:U,TasksErrorModal:V,error:E,success:A,busy:v,paused:k,value:M,max:_}},d=()=>{const[e,t]=(0,r.useState)(!1),[n,o]=(0,r.useState)(!1),i=(0,r.useCallback)((e=>{t(e.shiftKey),o(e.ctrlKey||e.metaKey)}),[]),a=(0,r.useCallback)((()=>{t(!1),o(!1)}),[]);return(0,r.useEffect)((()=>(document.addEventListener("keydown",i,!1),document.addEventListener("keyup",a,!1),()=>{document.removeEventListener("keydown",i,!1),document.removeEventListener("keyup",a,!1)})),[]),{pressShift:e,pressControl:n}},h=(e,t)=>{const n=(0,r.useRef)();(0,r.useEffect)((()=>{n.current=e}),[e]),(0,r.useEffect)((()=>{if(null!==t){let e=setInterval((()=>{n.current()}),t);return()=>clearInterval(e)}}),[t])},p=(...e)=>(0,r.useMemo)((()=>{const t=[];return e.forEach((e=>{if("string"==typeof e){e.trim().split(" ").filter((e=>e.length>0)).forEach((e=>t.push(e)))}else if("object"==typeof e){Object.keys(e).forEach((n=>{e[n]&&t.push(n)}))}})),t.join(" ")}),[e]),f=(e,t)=>{const n=(0,r.useRef)(null);return(0,r.useEffect)((()=>()=>{n.current&&clearTimeout(n.current)}),[]),(0,r.useCallback)(((...r)=>{n.current&&clearTimeout(n.current),n.current=setTimeout((()=>{e(...r)}),t)}),[e,t])}},1329:(e,t,n)=>{"use strict";n.d(t,{K:()=>h});var r=n(1594),o=n.n(r),i=n(7639),a=n.n(i),s=n(3185),l=n(6897);function c(){return c=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},c.apply(this,arguments)}const u=s.Ay.a`
  background-color: var(--neko-yellow);
  position: relative;
  border-radius: 10px;
  color: white !important;
  font-size: 9px;
  line-height: 10px;
  padding: 5px 8px;
  text-transform: uppercase;
  text-decoration: none;
  white-space: nowrap;

  &:hover {
    filter: brightness(1.1);
  }

  &.inline {
    display: inline;
    margin-left: 5px;
    vertical-align: middle;
  }
`,d=e=>{const{show:t=!0,className:n,...r}=e,i=(0,l.gR)("neko-pro-only",n);return t?o().createElement(u,c({href:"https://meowapps.com",target:"_blank",className:i},r),"Pro Only"):null},h=e=>o().createElement(d,e);h.propTypes={show:a().bool,className:a().string}},4461:(e,t,n)=>{"use strict";n.d(t,{z:()=>f});var r=n(1594),o=n.n(r),i=n(7639),a=n.n(i),s=n(3185),l=n(4977),c=n(2557),u=n(6897);function d(){return d=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},d.apply(this,arguments)}const h=s.Ay.div`
  font-size: var(--neko-font-size);
  margin-bottom: 15px;

  .neko-block-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .neko-block-title {
    padding: 5px 10px;
    margin-bottom: 5px;
  }

  .neko-block-content {
    background: white;
    color: var(--neko-font-color);
    padding: 15px 15px;
    box-shadow: var(--neko-shadow-sm);
    border-radius: var(--neko-radius-md);
    border: 1px solid var(--neko-input-border);

    p:first-child {
      margin-top: 0;
    }

    p:last-child {
      margin-bottom: 0;
    }

    ul {
      list-style: disc;
    }

    ol {
      list-style: decimal;
    }

    .neko-toolbar {
      border: 2px solid var(--neko-input-border);
    }
  }

  .neko-block-action {
    margin-bottom: 5px;
    margin-right: 5px;
  }

  &.primary {
    padding: 8px;
    background-color: var(--neko-main-color);
    color: white;

    .neko-block-title {
      color: white;
    }

    .neko-block-content {
      background-color: white;
    }
  }

  &.standard {
    .neko-block-content {
      box-shadow: none;
    }
  }

  &.raw {
    padding: 8px;
    background-color: var(--neko-main-color);
    color: white;

    .neko-block-title {
      color: white;
    }

    .neko-block-content {
      padding: 0;
      background: none;
    }

    .neko-block-content {
      box-shadow: none;
    }
  }
`,p=e=>{const{title:t,children:n,className:r="",busy:i=!1,style:a={},contentStyle:s={},action:p,...f}=e,m=(0,u.gR)("neko-block",r);return o().createElement(h,d({className:m,style:a},f),t&&o().createElement("div",{className:"neko-block-header"},o().createElement(l.s,{h2:!0,className:"neko-block-title"},t),!!p&&o().createElement("div",{className:"neko-block-action"},p)),o().createElement(c.A,{busy:i},o().createElement("div",{className:"neko-block-content",style:s},n)))},f=e=>o().createElement(p,e);f.propTypes={title:a().string,className:a().oneOf(["","primary","standard","raw"]),style:a().object,action:a().element}},8668:(e,t,n)=>{"use strict";n.d(t,{Zc:()=>m,y2:()=>f});var r=n(1594),o=n.n(r),i=n(7639),a=n.n(i),s=n(3185);const l=s.Ay.div`
  margin-bottom: 10px;
`,c=s.Ay.div`
  margin-bottom: 0px;
  padding-bottom: 2px;
  border-bottom: 2px solid #d1e3f2;
  color: var(--neko-main-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  font-weight: 600;
`,u=s.Ay.span`
  border: solid var(--neko-main-color);
  border-width: 0 2px 2px 0;
  display: inline-block;
  padding: 3px;
  transform: ${e=>e.$isCollapsed?"rotate(45deg)":"rotate(-135deg)"};
  transition: transform 0.15s ease-in-out;
`,d=s.Ay.div`
  max-height: ${e=>e.$isCollapsed?"0":`${e.$contentHeight+15}px`};
  overflow: hidden;
  transition: ${e=>e.$animate?"max-height 0.15s ease-in-out":"none"};
`,h=({children:e,keepState:t})=>{const[n,i]=(0,r.useState)(t?JSON.parse(localStorage.getItem(t)):null);(0,r.useEffect)((()=>{t&&localStorage.setItem(t,JSON.stringify(n))}),[n,t]);return o().createElement("div",{className:"neko-accordions"},o().Children.map(e,((e,r)=>{var a;return(null==e?void 0:e.type)===p||(null==e?void 0:e.type)===f||(null==e?void 0:e.type)===g||"NekoCollapsableCategoryDeprecated"===(null==e||null===(a=e.type)||void 0===a?void 0:a.name)?o().cloneElement(e,{isCollapsed:n!==r,onClick:()=>{var e;i(n===(e=r)?null:e)},keepState:t?`${t}-${r}`:e.props.keepState}):e})))};h.propTypes={children:a().node.isRequired,keepState:a().string};const p=({isCollapsed:e=!1,children:t,onClick:n=(()=>{}),keepState:i,disabled:a=!1,hide:s=!1,title:h,style:p})=>{const[f,m]=(0,r.useState)(e),[g,y]=(0,r.useState)(!1),b=o().Children.count(t)>0,v=(0,r.useRef)(null),[x,k]=(0,r.useState)(0);var w,_;return w=v,_=()=>{v.current&&k(v.current.scrollHeight)},(0,r.useEffect)((()=>{const e=w.current;if(!e)return;const t=new ResizeObserver((e=>{_()}));return t.observe(e),()=>t.disconnect()}),[w,_]),(0,r.useEffect)((()=>{if(i){const t=JSON.parse(localStorage.getItem(i));m(null!==t?t:e)}}),[i,e]),(0,r.useEffect)((()=>{i&&localStorage.setItem(i,JSON.stringify(f))}),[f,i]),(0,r.useEffect)((()=>{m(e)}),[e]),s?null:o().createElement(l,{className:"neko-accordion",style:p},o().createElement(c,{onClick:()=>{b&&!a&&(y(!0),m(!f),n())},style:{opacity:a?.5:1,pointerEvents:a?"none":"auto"}},h,b&&o().createElement(u,{$isCollapsed:f})),o().createElement(d,{$isCollapsed:f,$contentHeight:x,$animate:g},o().createElement("div",{ref:v},t)))};p.propTypes={title:a().string.isRequired,isCollapsed:a().bool,children:a().node,onClick:a().func,keepState:a().string,disabled:a().bool,hide:a().bool};const f=p,m=h,g=e=>(console.warn("[NekoUI] NekoCollapsableCategory is deprecated. Please use NekoAccordion instead."),o().createElement(p,e));g.propTypes=p.propTypes},1543:(e,t,n)=>{"use strict";n.d(t,{L:()=>h});var r=n(1594),o=n.n(r),i=n(7639),a=n.n(i),s=n(3185),l=n(6897);const c=s.Ay.div`
  font-size: var(--neko-font-size);
  font-family: var(--neko-font-family);
  background-color: white;
  color: var(--neko-font-color);
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 25px;
  display: flex;
  flex-direction: column;

  &.primary {
    background-color: var(--neko-main-color);
  }

  p:first-child {
    margin-top: 0px;
  }

  p:last-child {
    margin-bottom: 0px;
  }

  .neko-container-content {
    padding: 20px 20px;
  }
`,u=s.Ay.div`
  justify-content: flex-start;
  background-color: var(--neko-gray-98);
  display: flex;
  align-items: center;
  padding: 8px 10px;

  &.align-right {
    justify-content: flex-end;
  }
`,d=e=>{const{header:t,headerAlign:n="left",footer:r,footerAlign:i="right",className:a,style:s={},contentStyle:d={},children:h}=e,p=(0,l.gR)("neko-container",a);return o().createElement(c,{className:p,style:s},t&&o().createElement(u,{className:`align-${n}`},t),o().createElement("div",{className:"neko-container-content",style:d},h),r&&o().createElement(o().Fragment,null,o().createElement("div",{style:{flex:"auto"}}),o().createElement(u,{className:`align-${i}`},r)))},h=e=>o().createElement(d,e);h.propTypes={header:a().element,headerAlign:a().oneOf(["left","right"]),footer:a().element,footerAlign:a().oneOf(["left","right"]),className:a().string,style:a().object,contentStyle:a().object}},6913:(e,t,n)=>{"use strict";n.d(t,{z:()=>h});var r=n(1594),o=n.n(r),i=n(7639),a=n.n(i),s=n(3185),l=n(9296),c=n(6897);const u=s.Ay.div`
  position: relative;
  margin-left: -20px;
  background: var(--neko-background-color);
  padding-bottom: 50px;
  margin-bottom: -26px;

  .neko-rest-error {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #1e232deb;
    z-index: 100;

    .container {
      color: white;
      padding: 5px 20px 15px 20px;
      min-width: 480px;
      max-width: 600px;
      border-radius: 20px;
      background: #883131;
      margin-left: 50%;
      transform: translateX(-50%);
      margin-top: 100px;

      h3 {
        color: white;
      }

      .neko-debug {
        padding: 5px 10px;
        background: #692426;
        border-radius: 10px;

        * {
          margin: 0px;
          padding: 0px;
        }
      }
    }
  }
`,d=e=>{const{className:t,children:n,nekoErrors:i=[],style:a={}}=e,[s,d]=(0,r.useState)(!1),[h,p]=(0,r.useState)(!1),f=(0,c.gR)("neko-page",t);if(i&&!s)for(let e of i)if(e){d(e);break}return o().createElement(u,{className:f,style:a},s&&o().createElement("div",{className:"neko-rest-error"},o().createElement("div",{className:"container"},!h&&o().createElement(o().Fragment,null,o().createElement("h3",null,"The Rest API is disabled or broken 😢"),o().createElement("p",null,"The Rest API is required for this plugin to work. It is enabled in WordPress by default since December 2016 and used by the Gutenberg Editor since 2019. In short, it allows more robustness and a much cleaner infrastructure. Soon, Wordpress will entirely depends on it, so it is important to keep it enabled."),o().createElement("p",null,o().createElement("i",null,"Last but not least: check your PHP Error Logs and your Debugging Console.")),o().createElement("p",{className:"neko-debug"},o().createElement("small",null,"URL: ",s.url,o().createElement("br",null),"CODE: ",s.code,o().createElement("br",null),"MESSAGE: ",s.message,o().createElement("br",null)))),s.body&&h&&o().createElement("p",{className:"neko-debug"},o().createElement("div",{dangerouslySetInnerHTML:{__html:s.body}})),s.body&&o().createElement(l.M,{color:"#a94242",onClick:()=>p(!h)},h?"Hide":"Display"," response from server"),o().createElement(l.M,{color:"#a94242",onClick:()=>{window.open("https://meowapps.com/fix-wordpress-rest-api/","_blank")}},"Learn about WordPress Debugging"))),n)},h=e=>o().createElement(d,e);h.propTypes={className:a().string,style:a().object,nekoErrors:a().bool}},7039:(e,t,n)=>{"use strict";n.d(t,{d:()=>d});var r=n(1594),o=n.n(r),i=n(7639),a=n.n(i),s=n(3185),l=n(6897);function c(){return c=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},c.apply(this,arguments)}const u=(0,s.Ay)((e=>{const{title:t="",contentAlign:n="left",titleStyle:r={},color:i,...a}=e,s=(0,l.gR)("neko-settings",e.className);return o().createElement("div",c({className:s},a),o().createElement("div",{className:"neko-settings-head",style:r},t||" "),o().createElement("div",{className:`neko-settings-content neko-settings-content-align-${n}`},e.children))}))`
  display: flex;
  font-family: var(--neko-font-family);
  
  ${({color:e})=>e?`\n      --settings-color: var(--neko-${e});\n    `:""}

  > .neko-settings-head {
    font-family: var(--neko-font-family);
    font-size: var(--neko-font-size); 
    line-height: 17px;
    width: 120px;
    margin-right: 16px;
    font-weight: 500;
    color: var(--settings-color, var(--neko-main-color));
  }

  /* Select, Checkbox, Input need to be a bit higher to be in front of the settings title */

  .neko-settings-content > .neko-select:first-child {
    position: relative;
    margin-top: -5px;
  }
  
  .neko-settings-content > div:first-child .neko-checkbox-container {
    margin-top: -5px;
  }

  .neko-settings-content > .neko-button:first-child {
    position: relative;
    margin-top: -5px;
  }

  .neko-settings-content > div:first-child > .neko-input {
    position: relative;
    margin-top: -5px;
  }

  > .neko-settings-content {
    flex: 1;

    &.neko-settings-content-align-right {
      flex: none;
      margin-left: auto;
    }

    input[type=text] {
      width: 100%;
    }


  }

  & + div {
    margin-top: 10px;
  }
`,d=e=>o().createElement(u,e);d.propTypes={title:a().string,className:a().string,contentAlign:a().string,titleStyle:a().object,color:a().oneOf(["blue","purple","green","red","orange","yellow","gray"])}},6734:(e,t,n)=>{"use strict";n.d(t,{g:()=>h});var r=n(1594),o=n.n(r),i=n(7639),a=n.n(i),s=n(3185);function l(){return l=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},l.apply(this,arguments)}const c=s.Ay.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: ${({height:e})=>`${e}px`};
`,u=s.Ay.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;

  hr {
    width: 100%;
    border: none;
    border-top: 1px solid var(--neko-secondary);
  }
`,d=s.Ay.span`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
  text-align: center;

  &::before,
  &::after {
    content: '';
    flex-grow: 1;
    border-top: ${({line:e})=>e?"1px solid var(--neko-secondary)":"none"};
    height: 0;
  }

  &::before {
    margin-right: 0.5em;
  }

  &::after {
    margin-left: 0.5em;
  }
`,h=e=>{let{height:t=null,tiny:n=!1,small:r=!0,medium:i=!1,large:a=!1,line:s=!1,style:h,children:p,...f}=e;return t||(p||i?t=30:n?t=5:a?t=45:r&&(t=15)),o().createElement(c,l({className:"neko-spacer",height:t,style:h},f),p&&o().createElement(d,{line:s},p),!p&&o().createElement(u,null,s&&o().createElement("hr",null)))};h.propTypes={height:a().number,line:a().bool,tiny:a().bool,small:a().bool,medium:a().bool,large:a().bool,style:a().object}},9425:(e,t,n)=>{"use strict";n.d(t,{J:()=>m});var r=n(1594),o=n.n(r),i=n(7639),a=n.n(i),s=n(3185),l=n(6897),c=n(8135);function u(){return u=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},u.apply(this,arguments)}const d=s.Ay.div`
  display: flex;
  flex-wrap: nowrap;
  position: relative;
  width: 100%;
  min-height: 400px;

  &.collapsed {
    .neko-splitview-sidebar {
      flex: 0 0 0;
      width: 0;
      min-width: 0;
      max-width: 0;
      padding: 0;
      overflow: hidden;
      opacity: 0;
    }

    .neko-splitview-main {
      flex: 1;
      max-width: 100%;
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;

    .neko-splitview-sidebar {
      width: 100% !important;
      max-width: 100%;
      flex: 1 1 auto !important;
    }

    .neko-splitview-main {
      width: 100%;
    }

    &.collapsed {
      .neko-splitview-sidebar {
        display: none;
      }
    }
  }
`,h=s.Ay.div`
  flex: ${e=>e.$flex||2};
  min-width: 0;
  padding: ${e=>e.$minimal?"0":"32px 30px"};
  transition: flex 0.3s ease;
  position: relative;

  .neko-block:not(:first-child) {
    margin-top: ${e=>e.$minimal?"0":"-20px"};
  }

  .neko-block:last-child {
    margin-bottom: 0px;
  }
`,p=s.Ay.div`
  flex: ${e=>e.$flex||1};
  min-width: 0;
  max-width: ${e=>e.$maxWidth||"400px"};
  padding: ${e=>e.$minimal?"0":"32px 30px"};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: var(--neko-sidebar-bg, transparent);
  opacity: 1;

  .neko-block:not(:first-child) {
    margin-top: ${e=>e.$minimal?"0":"-20px"};
  }

  .neko-block:last-child {
    margin-bottom: 0px;
  }
`,f=e=>{const{children:t,isCollapsible:n=!0,defaultCollapsed:i=!1,isCollapsed:a,onToggle:s,onCollapseChange:c,sidebarFlex:f=1,mainFlex:m=2,sidebarMaxWidth:g="400px",minimal:y=!1,className:b="",...v}=e,x=void 0!==a,[k,w]=(0,r.useState)(i),_=x?a:k,S=(0,l.gR)("neko-splitview",b,{collapsed:_}),E=o().Children.toArray(t),C=E[0],A=E[1];return o().createElement(d,u({className:S},v),o().createElement(h,{className:"neko-splitview-main",$flex:m,$minimal:y},C),o().createElement(p,{className:"neko-splitview-sidebar",$flex:f,$maxWidth:g,$minimal:y},A))},m=e=>o().createElement(c.YS,null,o().createElement(f,e)),g=({children:e})=>e,y=({children:e})=>e;m.Main=g,m.Sidebar=y,m.propTypes={isCollapsible:a().bool,defaultCollapsed:a().bool,isCollapsed:a().bool,onToggle:a().func,onCollapseChange:a().func,sidebarFlex:a().number,mainFlex:a().number,sidebarMaxWidth:a().string,minimal:a().bool,className:a().string,children:a().node.isRequired},g.propTypes={children:a().node},y.propTypes={children:a().node}},4547:(e,t,n)=>{"use strict";n.d(t,{N:()=>m,Y:()=>g});var r=n(1594),o=n.n(r),i=n(7639),a=n.n(i),s=n(3185),l=n(6897),c=n(8135);function u(){return u=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},u.apply(this,arguments)}const d=s.Ay.div`
  display: flex;
  flex-wrap: wrap;

  @media (max-width: 600px) {
    width: max-content;
    overflow-x: auto;
    padding-inline:  0 350px 0 0;

   .neko-tab-content {
      max-width: 1200px;
    }

    .neko-tabs.inversed {
      max-width: 500px;

      .neko-accordion {
        max-width: 450px;
        overflow-x: hidden;
      }
    }

    .neko-block {
       max-width: 500px;

       .neko-block-content {
         overflow-x: scroll;

         table {
          width: max-content;
          }
        }
    }
`,h=s.Ay.div`
  flex: ${e=>e.$flex||1};
  min-width: 0;
  padding: 32px 30px;

  .neko-block:not(:first-child) {
    margin-top: -20px;
  }

  .neko-block:last-child {
    margin-bottom: 0px;
  }

  &.minimal {
    padding: 0;
  }

  &.full {
    flex-basis: 100%;
    padding-bottom: 0;
  }

  & + .full {
    padding-bottom: 32px;
    padding-top: 0;
  }

  &:not(.full) + div:not(.full) {
    padding-left: 0;
  }
`,p=e=>{const{children:t,...n}=e;return o().createElement(d,u({className:"neko-wrapper"},n),t)},f=e=>{const{fullWidth:t,minimal:n,size:r,...i}=e,a=(0,l.gR)("neko-column",{full:t},{minimal:n}),s=r?{"1/2":1,"1/3":1,"2/3":2,"1/4":1,"3/4":3,"1/5":1,"2/5":2,"3/5":3,"4/5":4,"1/6":1,"5/6":5}[r]||parseFloat(r):void 0;return o().createElement(h,u({className:a,$flex:s},i),e.children)},m=e=>o().createElement(c.YS,null,o().createElement(p,e)),g=e=>o().createElement(c.YS,null,o().createElement(f,e));m.propTypes={},g.propTypes={fullWidth:a().any,minimal:a().bool,size:a().oneOfType([a().oneOf(["1/2","1/3","2/3","1/4","3/4","1/5","2/5","3/5","4/5","1/6","5/6"]),a().number,a().string])}},374:(e,t,n)=>{"use strict";n.d(t,{G:()=>u});var r=n(1594),o=n(5206),i=n.n(o),a=n(7639),s=n.n(a),l=n(6897),c=n(2564);const u=({children:e,visible:t=!1,targetRef:n,onClose:o,matchWidth:a=!0})=>{const s=(0,r.useRef)(),[u,d]=(0,r.useState)(0);(0,l.jz)((()=>{t&&o()}),[n,s]),(0,r.useEffect)((()=>{const e=document.createElement("div");return s.current=e,()=>{s.current=null}}),[]);const h=()=>{t&&s.current&&n.current&&requestAnimationFrame((()=>{const e=n.current.getBoundingClientRect(),t=window.innerHeight,r=window.innerWidth;let o=s.current.querySelector(".neko-portal-content");for(;o&&!o.offsetHeight;)o=o.firstChild;const i=o?o.offsetHeight:0,l=a?e.width:o?o.offsetWidth:0,c=t-e.bottom<i?e.top-i:e.bottom;let u=e.left;const d=r-l-5;Number.isFinite(d)&&(u=Math.min(u,d)),u=Math.max(u,5);const h={position:"fixed",top:`${c}px`,left:`${u}px`,width:a?`${e.width}px`:"auto",zIndex:"9999"};Object.assign(s.current.style,h)}))};if((0,r.useEffect)((()=>{if(t&&s.current){document.body.appendChild(s.current);const e=setTimeout((()=>{h(),d(1)}),5);return()=>clearTimeout(e)}if(s.current){const e=s.current.parentNode;e&&e.removeChild(s.current),d(0)}}),[t,s,n]),(0,r.useLayoutEffect)((()=>{h();const e=()=>h();return window.addEventListener("resize",e),window.addEventListener("scroll",e),()=>{window.removeEventListener("resize",e),window.removeEventListener("scroll",e)}}),[t,s,n]),!t||!s.current)return null;const p={opacity:u,transition:"opacity 0.2s cubic-bezier(0.22, 0.61, 0.36, 1)"};return i().createPortal(React.createElement("div",{className:"neko-portal-content",style:p},React.createElement(c.A,null,e)),s.current)};u.propTypes={children:s().node.isRequired,visible:s().bool,targetRef:s().object.isRequired,onClose:s().func,matchWidth:s().bool}},197:(e,t,n)=>{"use strict";n.d(t,{X:()=>l});var r=n(1594),o=n.n(r),i=n(7639),a=n.n(i);const s=n(3185).Ay.section`
  .mask {
    position: absolute;
    overflow: hidden;
    display: block;
    width: ${e=>e.width}px;
    height: ${e=>e.width/2}px;
  }

  .semi-circle {
    position: relative;
    display: block;
    width: ${e=>e.width}px;
    height: ${e=>e.width/2}px;
    background: linear-gradient(to right, #27b775 0%, #f3f32c 50%, #f71b1b 100%);
    border-radius: 50% 50% 50% 50% / 100% 100% 0% 0% ;

    &::before {
      content: "";
      position: absolute;
      bottom: 0;
      left: 50%;
      z-index: 2;
      display: block;
      width: 140px;
      height: 70px;
      margin-left: -70px;
      background: ${e=>e.backgroundColor};
      border-radius: 50% 50% 50% 50% / 100% 100% 0% 0% ;
    }      
  }

  .semi-circle--mask {
    position: absolute;
    top: 0;
    left: 0;
    width: ${e=>e.width}px;
    height: ${e=>e.width}px;
    background: transparent;
    transform-origin: center center;
    backface-visibility: hidden;
    transition: all .3s ease-in-out;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0%;
      z-index: 2;
      display: block;
      width: ${e=>e.width+2}px;
      height: ${e=>e.width/2+2}px;
      margin-top: -1px;
      margin-left: -1px;
      background: #5396c1d6;
      border-radius: 50% 50% 50% 50% / 100% 100% 0% 0% ;
    }      
  }

  .gauge { 
    width: ${e=>e.width}px;
    height: ${e=>e.width/2}px;
    
    .semi-circle--mask {
      transform: rotate(${e=>e.degrees}deg) translate3d(0,0,0);
    }
  }

  .child-container {
    position: absolute;
    font-size: 16px;
    display: flex;
    width: ${e=>e.width+2}px;
    height: ${e=>e.width/2}px;
    z-index: 10;

    .spacing {
      flex: auto;
    }

    .child {
      color: white;
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }
`,l=({value:e=1e3,min:t=0,max:n=2500,width:r=200,background:i="#007cba",children:a})=>{const l=180*(e<=n?e:n)/n;return o().createElement(s,{className:"neko-gauge",backgroundColor:i,degrees:l,width:r},o().createElement("div",{class:"gauge"},o().createElement("div",{class:"mask"},o().createElement("div",{class:"semi-circle"}),o().createElement("div",{class:"semi-circle--mask"})),o().createElement("div",{class:"child-container"},o().createElement("div",{class:"child"},o().createElement("div",{class:"spacing"}),a))))};l.propTypes={value:a().number,min:a().number,max:a().number,width:a().number,background:a().string}},1829:(e,t,n)=>{"use strict";n.d(t,{n:()=>p});var r=n(1594),o=n.n(r),i=n(7639),a=n.n(i),s=n(3185),l=n(9491),c=n(5484),u=n(6535);const d=s.Ay.div`
  position: relative;
  color: white;
  font-family: var(--neko-font-family);
  font-size: var(--neko-font-size);
  display: flex;
  height: 60px;
  overflow: hidden;
  align-items: center;
  padding: 15px 32px;
  background-color: var(--neko-main-color);
  display: flex;
  
  /* Diagonal stripe pattern */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0.1;
    background-image: repeating-linear-gradient(
      -45deg,
      transparent,
      transparent 20px,
      rgba(255, 255, 255, 0.3) 20px,
      rgba(255, 255, 255, 0.3) 40px
    );
    background-position: 0 0;
    background-size: 56.57px 56.57px; /* sqrt(40^2 + 40^2) for consistent tiling */
    pointer-events: none;
    z-index: 0;
  }

  .neko-header-logo-container {
    width: 40px;
    height: 40px;
    padding: 10px;
    margin-right: 15px;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 1;
  }

  .neko-header-title-container {
    flex-direction: column;
    display: flex;
    position: relative;
    z-index: 1;

    .neko-header-title-row {
      display: flex;
      align-items: center;
    }

    .neko-header-title {
      color: white;
      font-family: var(--neko-font-family);
      font-size: 23px;
      line-height: normal;
      margin: 0;
    }

    .neko-header-separator {
      color: rgba(255,255,255,0.3);
      margin: 0 12px;
      font-size: 20px;
      line-height: 1;
      align-self: center;
    }

    .neko-header-section {
      background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%);
      color: white;
      opacity: 0.9;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
      line-height: normal;
      padding: 6px 12px;
      border-radius: 20px;
      border: 1px solid rgba(255,255,255,0.1);
      align-self: center;
      position: relative;
      top: 1px;
    }

    .neko-header-subtitle {
      color: white;
      font-family: var(--neko-font-family);
      line-height: normal;
      margin-top: 2px;
      text-transform: uppercase;
      font-size: 10px;
      opacity: 0.65;
    }
  }

  .neko-header-extra-content {
    flex: 1;
    margin: 0 20px;
    position: relative;
    z-index: 1;
  }

  @media (max-width: 600px) {
    width: 100%;
    padding: 10px 20px;

    .neko-header-logo-container {
      display: none;
    }

    .neko-header-title-container {
      flex-direction: row;
      align-items: center;
      justify-content: center;
    }

    .neko-header-title { font-size: 12px !important; }
    .neko-header-section { font-size: 11px; }
    .neko-header-subtitle { display: none; }

    .neko-header-extra-content {

    }
  }
`,h=e=>{const{title:t="NekoUI",section:n=null,subtitle:r="By Meow Apps",children:i,saving:a=!1}=e;return o().createElement(d,{className:"neko-header"},o().createElement("div",{className:"neko-header-logo-container"},o().createElement(l.r,null)),o().createElement("div",{className:"neko-header-title-container"},o().createElement("div",{className:"neko-header-title-row"},o().createElement("h1",{className:"neko-header-title"},t),!!n&&o().createElement(o().Fragment,null,o().createElement("span",{className:"neko-header-separator"},"›"),o().createElement("span",{className:"neko-header-section"},n))),o().createElement("small",{className:"neko-header-subtitle"},o().createElement("a",{target:"_blank",href:"https://meowapps.com",style:{color:"white",textDecoration:"none"}},r))),o().createElement("div",{className:"neko-header-extra-content"},i),a&&o().createElement(c.z,{icon:u.A,width:"36",height:"36"}))},p=e=>o().createElement(h,e);p.propTypes={title:a().string,section:a().string,subtitle:a().string,saving:a().bool}},5484:(e,t,n)=>{"use strict";n.d(t,{z:()=>x});var r=n(1594),o=n.n(r),i=n(7639),a=n.n(i),s=n(3185),l=n(5055),c=n(1546),u=n(5206),d=n.n(u),h=n(6897);const p=s.Ay.div`
  display: inline-block;
`,f=s.Ay.div`
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 4px;
  color: var(--neko-white);
  font-family: var(--neko-font-family);
  font-weight: normal;
  font-size: var(--neko-font-size);
  padding: 8px 12px;
  max-width: ${e=>e.$maxWidth}px;
  width: max-content;
  word-break: break-word;
  white-space: normal;
  pointer-events: ${e=>e.visible?"auto":"none"};
  opacity: ${e=>e.visible?1:0};
  transition: opacity 0.15s ease-in-out, transform 0.25s ease-in-out;
  position: absolute;
  z-index: 100;
  transform: ${e=>{const t="5px",n="15px";if(e.visible)switch(e.position){case"top":return`translateX(-50%) translateY(calc(-100% - ${t}))`;case"bottom":return`translateX(-50%) translateY(${t})`;case"left":return`translateX(calc(-100% - ${t})) translateY(-50%)`;case"right":return`translateX(${t}) translateY(-50%)`;default:return""}else switch(e.position){case"top":return`translateX(-50%) translateY(calc(-100% - ${n}))`;case"bottom":return`translateX(-50%) translateY(${n})`;case"left":return`translateX(calc(-100% - ${n})) translateY(-50%)`;case"right":return`translateX(${n}) translateY(-50%)`;default:return""}}};
  &:before {
    content: '';
    position: absolute;
    border: 4px solid transparent;
    ${e=>{switch(e.position){case"top":return"\n            bottom: -8px;\n            left: 50%;\n            margin-left: -4px;\n            border-top: 4px solid rgba(0, 0, 0, 0.8);\n          ";case"bottom":return"\n            top: -8px;\n            left: 50%;\n            margin-left: -4px;\n            border-bottom: 4px solid rgba(0, 0, 0, 0.8);\n          ";case"left":return"\n            top: 50%;\n            right: -8px;\n            margin-top: -4px;\n            border-left: 4px solid rgba(0, 0, 0, 0.8);\n          ";case"right":return"\n            top: 50%;\n            left: -8px;\n            margin-top: -4px;\n            border-right: 4px solid rgba(0, 0, 0, 0.8);\n          ";default:return""}}}
  }
`,m=e=>{const{text:t="Hello world!",position:n="top",maxWidth:i=160}=e,[a,s]=(0,r.useState)(!1),l=(0,h.G8)((e=>s(e)),100),[c,u]=(0,r.useState)({top:0,left:0}),m=(0,r.useRef)(null);return(0,r.useEffect)((()=>{if(a&&m.current){const e=m.current.getBoundingClientRect();let t=0,r=0;const o=window.scrollY||window.pageYOffset,i=window.scrollX||window.pageXOffset;switch(n){case"top":t=e.top+o,r=e.left+e.width/2+i;break;case"bottom":t=e.bottom+o,r=e.left+e.width/2+i;break;case"left":t=e.top+e.height/2+o,r=e.left+i;break;case"right":t=e.top+e.height/2+o,r=e.right+i}u({top:t,left:r})}}),[a,n]),o().createElement(p,{className:"neko-tooltip",ref:m,onMouseEnter:()=>t&&l(!0),onMouseLeave:()=>l(!1)},e.children,d().createPortal(o().createElement(f,{visible:a,position:n,$maxWidth:i,style:{top:c.top,left:c.left}},"string"==typeof t?t.split("\n").map(((e,t)=>o().createElement(o().Fragment,{key:t},e,o().createElement("br",null)))):t),document.body))},g=e=>o().createElement(m,e);g.propTypes={text:a().string,position:a().oneOf(["top","right","bottom","left"]),maxWidth:a().number};const y=s.Ay.div`
  display: flex;
  align-items: center;

  &.neko-clickable {
    cursor: pointer;
  }

  &.spin svg {
    animation-name: spin;
    animation-duration: 700ms;
    animation-iteration-count: infinite;
    animation-timing-function: linear;

    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  }

  &.disabled {
    pointer-events: none;
    opacity: 0.35;
    cursor: default;
  }

  svg {
    color: ${e=>e.$color};
    transition: color 0.2s ease;
  }

  &:hover svg {
    color: ${e=>e.$hoverColor||e.$color};
    filter: ${e=>!e.$hoverColor&&e.$color?"brightness(1.1)":"none"};
  }
`,b=s.Ay.div`
  width: 25px;
  height: auto;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: auto !important;
    height: 25px !important;
  }
`,v={primary:{color:"var(--neko-blue)"},success:{color:"var(--neko-green)"},warning:{color:"var(--neko-yellow)"},danger:{color:"var(--neko-red)"}},x=e=>{let{icon:t,color:n,spinning:i=!1,className:a="",tooltip:s,raw:u,isBusy:d=!1,variant:p,title:f,containerStyle:m,hoverColor:x,disabled:k=!1,width:w,height:_,strokeWidth:S,...E}=e;const C=p&&v[p]?v[p].color:n,A=p&&v[p]?v[p].hoverColor:x,O="string"==typeof t&&l.ho[t]?l.ho[t]:void 0,M=w||_||30,R=(0,r.useMemo)((()=>"string"==typeof t&&l.Ay[t]?l.Ay[t]:t),[t]),P=(0,r.useMemo)((()=>!!l.Ay[t]||"function"==typeof R||"object"==typeof R),[t,R]),T=(0,h.gR)("neko-icon",a,{"neko-clickable":!!E.onClick},{spin:i||d},{disabled:k}),z=()=>{if(d&&!k)return o().createElement(c.A,{size:M,className:"spin",strokeWidth:S});if(P){const e=R,{width:t,height:n,fill:r,...i}=E;return o().createElement(e,{size:M,fill:O||r||"none",strokeWidth:S,...i})}return o().createElement(b,null,R)};if(s)return"string"==typeof s&&(s={text:s}),o().createElement(g,{text:s.text,position:s.position||"top"},o().createElement(y,{style:m,className:T,$color:C,$hoverColor:A,title:f},z()));if(u){if(P){const e=R,{width:t,height:n,fill:r,...i}=E;return o().createElement(e,{size:M,color:C,fill:O||r||"none",className:T,strokeWidth:S,...i})}return o().createElement(b,null,R)}return o().createElement(y,{style:m,title:f,className:T,$color:C,$hoverColor:A},z())};x.propTypes={icon:a().oneOfType([a().elementType,a().oneOf(["duplicate","lock","lock-open","file-undo","chevron-double-left","chevron-double-right","chevron-left","chevron-right","chevron-down","chevron-up","pause","play","replay","check","check-circle","stop","delete","undo","alert","database","tools","cog","close","cat","upload","trash","pencil","dashboard","search","folder","folder-open","image-multiple-outline","plus","folder-plus","image-plus","view-grid","format-list-bulleted","twitter","instagram","facebook","star","timer-outline","link","linkedin","pinterest","zoom-in","info-outline","image-off-outline","arrow-up","arrow-down","sort","eye","rocket-launch","calendar-month","wand","mastodon","filter","question","loading","new","save","reset","rename","edit"])]),color:a().string,spinning:a().bool,className:a().string,tooltip:a().string,raw:a().bool,isBusy:a().bool,variant:a().string}},5924:(e,t,n)=>{"use strict";n.d(t,{W:()=>c});var r=n(1594),o=n.n(r),i=n(3185),a=n(7639),s=n.n(a);const l=i.Ay.div`
  position: relative;
  border: 2px dashed orange;
  padding: 5px;
  background: #fff5e2;
  
  &::before {
    content: 'IN DEVELOPMENT';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: clamp(20px, 5vw, 60px);
    font-weight: bold;
    color: rgba(255, 165, 0, 0.1);
    white-space: nowrap;
    pointer-events: none;
    z-index: 0;
  }
  
  > * {
    position: relative;
    z-index: 1;
  }
`,c=({children:e,devMode:t=!1,...n})=>t?o().createElement(l,n,e):null;c.propTypes={children:s().node,devMode:s().bool}},1843:(e,t,n)=>{"use strict";n.d(t,{K:()=>m,o:()=>f});var r=n(1594),o=n.n(r),i=n(7639),a=n.n(i),s=n(3185),l=n(5484),c=n(6897);const u=s.Ay.div`
  display: flex;
  align-items: center;
`,d=s.Ay.span`
  color: var(--neko-main-color);
  cursor: pointer;
  font-family: var(--neko-font-family);
  font-style: normal;
  font-weight: normal;
  line-height: 17px;

  &:hover:not(.active) {
    filter: brightness(1.2);
  }

  &.active {
    cursor: default;
    color: var(--neko-gray-30);
    font-weight: bold;
  }

  &.inversed {
    color: var(--neko-main-color-80);

    &.active {
      color: var(--neko-white);
    }
  }

  &::after {
    content: "|";
    color: var(--neko-disabled-color);
    font-weight: normal;
    padding: 0 4px;
  }

  &:last-child::after {
    content: none;
  }

  span {
    color: var(--neko-disabled-color);
    font-weight: normal;
    margin-left: 4px;
  }
`,h=e=>{const{name:t,value:n,onChange:r,busy:i=!1,className:a,inversed:s}=e,l=(0,c.gR)("neko-quick-links",a,{inversed:s}),d=o().Children.toArray(e.children).filter((e=>!!e)).map((e=>o().cloneElement(e,{busy:i,inversed:s,isActive:e.props.value===n,onClick:e=>{e!==n&&r(e,t)}})));return o().createElement(u,{className:l},d)},p=e=>{const{title:t,value:n=0,count:r,onClick:i,busy:a,isActive:s=!1,className:u,inversed:h}=e,p=(0,c.gR)("neko-link",u,{active:s,inversed:h});return o().createElement(d,{onClick:()=>i(n),className:p},t,void 0===r?null:o().createElement("span",null,"(",a?o().createElement(l.z,{icon:"replay",spinning:!0,width:12,containerStyle:{display:"inline"}}):r,")"))},f=e=>o().createElement(h,e);f.propTypes={name:a().string,value:a().string,onChange:a().func,inversed:a().bool};const m=e=>o().createElement(p,e);m.propTypes={title:a().string,value:a().string,count:a().number,onClick:a().func,isActive:a().bool,inversed:a().bool}},7392:(e,t,n)=>{"use strict";n.d(t,{k:()=>u});var r=n(1594),o=n.n(r),i=n(7639),a=n.n(i),s=n(4461),l=n(9296);const c={marginTop:10,background:"rgb(0, 72, 88)",padding:10,color:"rgb(58, 212, 58)",maxHeight:400,minHeight:200,display:"block",fontFamily:"monospace",fontSize:12,whiteSpace:"pre",overflowX:"auto",borderRadius:10,textWrap:"balance"},u=({refreshQuery:e,clearQuery:t,onRefresh:n=null,onClear:i=null,i18n:a,refreshOnMount:u=!0,scrollToBottom:d=!1,blockMaxWidth:h=800})=>{const p=(0,r.useRef)(null),[f,m]=(0,r.useState)(""),[g,y]=(0,r.useState)(!1),b=async()=>{y(!0);const t=await e();n&&n(t),m(t),y(!1)};return(0,r.useEffect)((()=>{u&&b()}),[]),(0,r.useEffect)((()=>{d&&p.current&&p.current.scrollTo(0,p.current.scrollHeight)}),[f]),o().createElement(s.z,{title:a.COMMON.LOGS,busy:g,className:"primary neko-log",style:{maxWidth:h}},o().createElement(l.M,{onClick:()=>b()},a.COMMON.REFRESH_LOGS),o().createElement(l.M,{className:"danger",onClick:()=>(async()=>{y(!0);const e=await t();i&&i(e),m(""),y(!1)})()},a.COMMON.CLEAR_LOGS),o().createElement("div",{style:c,ref:p},f))};u.propTypes={refreshQuery:a().func,clearQuery:a().func,onRefresh:a().func,onClear:a().func,i18n:a().object,refreshOnMount:a().bool,scrollToBottom:a().bool,blockMaxWidth:a().number}},9491:(e,t,n)=>{"use strict";n.d(t,{r:()=>s});var r=n(1594),o=n.n(r);const i=n(3185).Ay.div`
  display: flex;
  max-width: 128px;
  max-height: 128px;

  & > * {
    width: 100%;
    height: auto;
    object-fit: contain;
  }
`,a=()=>o().createElement(i,{className:"neko-logo"},o().createElement("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 1434 947"},o().createElement("path",{fill:"#000",d:"M805 777a792 792 0 0 1-262-43 811 811 0 0 1-286-164A959 959 0 0 1 6 200 158 158 0 0 1 304 97c41 96 94 175 159 233a497 497 0 0 0 376 129 60 60 0 0 1 67 60l27 186c4 33-18 63-51 68-6 0-34 4-77 4ZM122 168l2 5a841 841 0 0 0 212 307 692 692 0 0 0 469 177l-11-76a616 616 0 0 1-412-162 769 769 0 0 1-188-276 38 38 0 0 0-50-20c-18 7-27 27-22 45Z"}),o().createElement("path",{fill:"#FDA960",d:"m64 184 4 12a900 900 0 0 0 228 329 752 752 0 0 0 577 188l-27-194a563 563 0 0 1-423-144 709 709 0 0 1-174-255 98 98 0 0 0-185 64Z"}),o().createElement("mask",{id:"a",width:"814",height:"657",x:"60",y:"60",maskUnits:"userSpaceOnUse"},o().createElement("path",{fill:"#fff",d:"m64 184 4 12a900 900 0 0 0 228 329 752 752 0 0 0 577 188l-27-194a563 563 0 0 1-423-144 709 709 0 0 1-174-255 98 98 0 0 0-185 64Z"})),o().createElement("g",{mask:"url(#a)"},o().createElement("path",{fill:"#804625",d:"M120 532c-41 0-84-5-130-15l31-145c101 21 180 12 233-27 70-51 80-141 80-142l149 13a363 363 0 0 1-139 248 351 351 0 0 1-224 68Zm369 175c47-31 84-71 110-116 32-56 46-123 42-192-3-51-15-87-16-91l-141 48a225 225 0 0 1-15 161c-33 58-101 99-203 120l30 146c76-16 141-41 193-76ZM62 269c64-4 122-22 174-53A413 413 0 0 0 421-47L184-92v-1s-16 71-73 103C92 21 70 27 44 29 7 31-37 24-86 8l-74 229a623 623 0 0 0 222 32Z"})),o().createElement("path",{fill:"#000",d:"M1373 947h-110c-33 0-60-27-60-60v-97l-36 87a62 62 0 0 1-56 37h-79c-25 0-46-14-56-37l-36-87v97c0 33-27 60-60 60H769c-33 0-60-27-60-60V316c0-33 27-60 60-60h141c24 0 46 15 55 37l106 258 107-258c9-22 31-37 55-37h140c34 0 60 27 60 60v571c0 33-26 60-60 60Zm-316-188 14 34 15-34-11 1h-7l-11-1Zm199-314h7c21 0 40 11 50 28v-97h-40l-29 70 12-1Zm-427-69v97c11-17 29-28 51-28h6l13 1-29-70h-41Z"}),o().createElement("path",{fill:"#fff",d:"M769 887V316h141l158 384h7l158-384h140v571h-110V505h-7l-145 349h-79L886 505h-6v382H769Z"}))),s=e=>o().createElement(a,e);s.propTypes={}},4618:(e,t,n)=>{"use strict";n.d(t,{X:()=>b});var r=n(1594),o=n.n(r),i=n(7639),a=n.n(i),s=n(3185),l=n(6897),c=n(2973),u=n(7192);
/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const d=(0,n(2673).A)("triangle-alert",[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);var h=n(1666),p=n(6190),f=n(812);function m(){return m=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},m.apply(this,arguments)}const g=s.Ay.div`
  padding: 15px 15px 15px 10px;
  color: white;
  border-radius: 5px;
  display: flex;
  align-items: center;
  gap: 15px;
  position: relative;
  overflow: hidden;
  border-left: 6px solid rgba(0, 0, 0, 0.2);

  /* Base diagonal stripe pattern */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0.1;
    background-image: repeating-linear-gradient(
      -45deg,
      transparent,
      transparent 20px,
      rgba(255, 255, 255, 0.3) 20px,
      rgba(255, 255, 255, 0.3) 40px
    );
    pointer-events: none;
  }

  &.danger {
    background: #ba341e;
  }

  &.success {
    background: var(--neko-green);
  }

  &.special {
    background: var(--neko-purple);
  }

  &.warning {
    background: var(--neko-orange);
  }

  &.info {
    background: var(--neko-blue);
  }

  &.disabled {
    background: #808080;
    opacity: 0.8;
  }

  a {
    color: white;
    font-weight: bold;
  }

  code {
    font-size: 9px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 5px;
    padding: 2px 4px;
  }

  .neko-message-icon {
    flex-shrink: 0;
    position: relative;
    z-index: 1;
  }

  .neko-message-content {
    flex: 1;
    position: relative;
    z-index: 1;
  }

  .neko-message-close {
    flex-shrink: 0;
    position: relative;
    z-index: 1;
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 0.2s ease;
    
    &:hover {
      opacity: 1;
    }
  }
`,y=e=>{let{variant:t,children:n,onClose:r,...i}=e;t||(t="info");const a=(0,l.gR)("neko-message",{danger:"danger"===t},{success:"success"===t},{info:"info"===t},{warning:"warning"===t},{special:"special"===t},{disabled:"disabled"===t});return o().createElement(g,m({className:a},i),o().createElement((()=>{switch(t){case"danger":return c.A;case"success":return u.A;case"warning":return d;case"special":return h.A;default:return p.A}})(),{size:20,className:"neko-message-icon"}),o().createElement("div",{className:"neko-message-content"},n),r&&o().createElement(f.A,{size:20,className:"neko-message-close",onClick:r}))},b=e=>o().createElement(y,e);b.propTypes={variant:a().string,children:a().node,onClose:a().func}},520:(e,t,n)=>{"use strict";n.d(t,{Q:()=>m});var r=n(1594),o=n.n(r),i=n(7639),a=n.n(i),s=n(3185),l=n(1422),c=n(8897),u=n(8744),d=n(2297),h=n(5055);const p=s.Ay.div`
  align-items: center;
  display: flex;
  user-select: none;

  .neko-paging-text {
    margin-right: 15px;
  }

  .neko-paging-controller {
    box-sizing: border-box;
    height: 30px;
    align-items: center;
    background: var(--neko-main-color);
    border-radius: 15px;
    display: flex;
    padding: 3px 5px;

    .nako-paging-controller-icon {
      background-color: white;
      border-radius: 50%;
      cursor: pointer;
      margin-right: 2px;
      height: 18px;
      width: 18px;
      min-width: 18px;
      min-height: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.1s ease-in;
      box-sizing: border-box;
      flex-shrink: 0;

      :last-child {
        margin-right: 0;
      }

      &.disabled {
        color: var(--neko-disabled-color);
        cursor: default;
        pointer-events: none;
      }

      &:hover {
        transform: scale(1.2) !important;
        z-index: 10;
        position: relative;
      }
    }

    .nako-paging-controller-text {
      color: white;
      font-family: var(--neko-font-family);
      font-style: normal;
      font-weight: normal;
      font-size: var(--neko-font-size);
      margin: 0 10px;
      user-select: none;
      white-space: nowrap;
      
      @media (min-width: 360px) {
        margin: 0 20px;
      }
      
      @media (min-width: 480px) {
        margin: 0 40px;
      }
    }

    span.neko-paging-current-page {
      cursor: pointer;
      text-decoration: underline;
    }

    input.neko-paging-current-page {
      width: 1.5rem;
    }
  }
`,f=e=>{const{currentPage:t,limit:n=0,onClick:i,total:a=0,onCurrentPageChanged:s,infinite:f=!1,maxInfinite:m=!1,controllerText:g,compact:y=!1}=e,b=!!s,v=(0,r.useMemo)((()=>f||m?0:Math.ceil(0===a?1:n>0?a/n:1)),[f,m,n,a]),x="nako-paging-controller-icon "+(f||1!==t?"":"disabled"),k="nako-paging-controller-icon "+(f||m||t!==v?"":"disabled"),[w,_]=(0,r.useState)(!1),[S,E]=(0,r.useState)(y),C=e=>{_(!1),i(e)},A=e=>{if(f)return e;const t=Number(e);return m?t<1?1:t:t>v?v:t<1?1:t},O=e=>{const t=e.target.value;isNaN(t)||s(A(t)),_(!1)},M=e=>{if("Enter"===event.key){e.preventDefault();const t=e.target.value;isNaN(t)||s(A(t)),_(!1)}},R=(0,r.useMemo)((()=>{if(!w){const e=()=>{b&&1!==v&&_(!0)},n=b&&v>1;return o().createElement("span",{className:n?"neko-paging-current-page":"",onClick:e},t)}return o().createElement("input",{autoFocus:!0,type:"text",className:b?"neko-paging-current-page":"",defaultValue:t,onBlur:O,onKeyPress:M})}),[t,w,s,v]),P=e=>{w&&e.target===e.currentTarget&&_(!1)},T=(0,r.useRef)(null);return(0,r.useEffect)((()=>{const e=()=>{if(T.current){const e=T.current.offsetWidth;E(y||e<280)}};return e(),window.addEventListener("resize",e),()=>window.removeEventListener("resize",e)}),[y]),o().createElement(p,{className:"neko-paging",ref:T},!!a&&o().createElement("span",{className:"neko-paging-text"},a," result",a>0?"s":""),o().createElement("div",{className:"neko-paging-controller",onClick:P},!f&&!m&&o().createElement(l.A,{className:x,onClick:()=>C(1),size:h.hS.chevron}),o().createElement(c.A,{className:x,onClick:()=>C(t-1),size:h.hS.chevron}),o().createElement("p",{className:"nako-paging-controller-text",onClick:P},g||(S?o().createElement(o().Fragment,null,R,"/",v):o().createElement(o().Fragment,null,"Page ",R," of ",v))),o().createElement(u.A,{className:k,onClick:()=>C(t+1),size:h.hS.chevron}),!f&&!m&&o().createElement(d.A,{className:k,onClick:()=>C(v),size:h.hS.chevron})))},m=e=>o().createElement(f,e);m.propTypes={currentPage:a().number,limit:a().number,total:a().number,onClick:a().func,lastPage:a().number,infinite:a().bool,maxInfinite:a().bool,controllerText:a().object}},851:(e,t,n)=>{"use strict";n.d(t,{j:()=>m});var r=n(1594),o=n.n(r),i=n(7639),a=n.n(i),s=n(3185),l=n(8160),c=n(8086),u=n(8785),d=n(6897);function h(){return h=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},h.apply(this,arguments)}const p=(0,s.Ay)((e=>{let{value:t=0,max:n=100,busy:r=!1,paused:i=!1,status:a,variant:s,className:p,...m}=e;t=Math.min(t,n);let g=parseFloat(t)/parseFloat(n);const y=Math.round(100*g),b=s||(y>=100?"success":"primary"),v=(0,d.gR)("neko-progress",p);return o().createElement("div",h({className:v},m),o().createElement(f,{ratio:g,busy:e.busy,status:a,variant:b}),o().createElement("div",{className:"neko-progress-buttons"},r&&e.onPauseClick&&o().createElement("div",{className:"neko-progress-button pause",onClick:e.onPauseClick},i?o().createElement(l.A,{size:14,fill:"rgb(255 255 255 / 25%)"}):o().createElement(c.A,{size:14,fill:"rgb(255 255 255 / 25%)"})),r&&e.onStopClick&&o().createElement("div",{className:"neko-progress-button stop",onClick:e.onStopClick},o().createElement(u.A,{size:14,fill:"rgb(255 255 255 / 25%)"}))))}))`
  position: relative;
  box-sizing: border-box;
  height: 30px;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.06) 0%,
    rgba(0, 0, 0, 0.02) 50%,
    rgba(0, 0, 0, 0.10) 100%
  );
  border-radius: 12px;

  .neko-progress-buttons {
    position: absolute;
    height: 100%;
    right: 0px;
    display: flex;
    align-items: center;
    padding-right: 5px;

    .neko-progress-button {
      border: none;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 2px;
      border-radius: 100%;
      color: white;
      padding: 2px;
      width: 18px;
      height: 18px;
      background-color: var(--neko-main-color);
      cursor: pointer;

      &.pause {
        &:hover {
          background-color: var(--neko-main-color);
          filter: brightness(1.1);
        }
      }

      &.stop {
        background: var(--neko-red);

        &:hover {
          background: var(--neko-red);
          filter: brightness(1.1);
        }
      }
    }
  }
`,f=(0,s.Ay)((e=>{const t=isNaN(e.ratio)?0:parseInt(Math.round(100*e.ratio)),n=typeof e.status,r=(0,d.gR)("neko-progress-current",e.className,e.variant);let i="undefined"!==n?"string"===n?e.status:e.status(t):`${t}%`;const a=i?8*i.length+20:50,s=t>0?`max(${a}px, ${`${t}%`})`:`${a}px`;return o().createElement("div",{className:r,style:{width:s,maxWidth:"100%"}},o().createElement("div",{style:{padding:"5px 10px",whiteSpace:"nowrap"}},i))}))`
  box-sizing: border-box;
  position: absolute;
  overflow: hidden;
  top: 0; left: 0;
  height: 100%;
  background-color: var(--neko-main-color);
  border-radius: 12px;
  text-align: center;
  padding: 0;
  vertical-align: middle;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: width 0.3s ease-out, min-width 0.3s ease-out, max-width 0.3s ease-out, background-color 0.5s ease;
  
  &.primary {
    background-color: var(--neko-main-color);
  }
  
  &.success {
    background-color: var(--neko-green);
  }
  
  &.warning {
    background-color: var(--neko-orange);
  }
  
  &.danger {
    background-color: var(--neko-red);
  }
  
  &.info {
    background-color: var(--neko-blue);
  }
  background-size: 30px 30px;
  background-image: linear-gradient(135deg, rgba(255, 255, 255, .15) 25%,
                    transparent 25%,
                    transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%,
                    transparent 75%, transparent);
  animation: ${e=>e.busy?"animate-stripes 1.6s linear infinite":"none"};

  @keyframes animate-stripes {
    0% { background-position: 0 0; }
    100% { background-position: 60px 0; }
  }
`,m=e=>o().createElement(p,e);m.propTypes={value:a().number,max:a().number,busy:a().bool,paused:a().bool,variant:a().oneOf(["primary","success","warning","danger","info"]),onPauseClick:a().func,onStopClick:a().func,status:a().oneOf([a().string,a().func])}},6087:(e,t,n)=>{"use strict";n.d(t,{X:()=>g});var r=n(1594),o=n.n(r),i=n(7639),a=n.n(i),s=n(3185),l=n(6897),c=n(5484);function u(){return u=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},u.apply(this,arguments)}const d=s.Ay.div`
  width: ${e=>e.size||"50%"};
  padding-top: ${e=>e.size||"50%"};
  position: relative;
  margin: 0 auto;

  .double-bounce1, .double-bounce2 {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: ${e=>e.color||"#333"};
    opacity: 0.6;
    position: absolute;
    top: 0;
    left: 0;

    -webkit-animation: sk-bounce 2.0s infinite ease-in-out;
    animation: sk-bounce 2.0s infinite ease-in-out;
  }

  .double-bounce2 {
    -webkit-animation-delay: -1.0s;
    animation-delay: -1.0s;
  }

  @-webkit-keyframes sk-bounce {
    0%, 100% { -webkit-transform: scale(0.0) }
    50% { -webkit-transform: scale(1.0) }
  }

  @keyframes sk-bounce {
    0%, 100% {
      transform: scale(0.0);
      -webkit-transform: scale(0.0);
    } 50% {
      transform: scale(1.0);
      -webkit-transform: scale(1.0);
    }
  }
`,h=({className:e,size:t,...n})=>{const r=(0,l.gR)("neko-spinner",n.className);return o().createElement(d,u({className:r,size:t},n),o().createElement("div",{className:"double-bounce1"}),o().createElement("div",{className:"double-bounce2"}))},p=s.Ay.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${e=>e.size||"24px"};
  height: ${e=>e.size||"24px"};
  
  .neko-icon {
    animation: rotate 1s linear infinite;
  }
  
  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`,f=({className:e,size:t="24px",color:n="#666",...r})=>{const i=(0,l.gR)("neko-spinner-icon",e),a=parseInt(t);return o().createElement(p,u({className:i,size:t},r),o().createElement(c.z,{icon:"loading",width:a,height:a,color:n,raw:!0}))},m=e=>{const{type:t="icon",...n}=e;return"circle"===t?o().createElement(h,n):o().createElement(f,n)},g=e=>o().createElement(m,e);g.propTypes={type:a().oneOf(["circle","icon"]),size:a().string,color:a().string}},4977:(e,t,n)=>{"use strict";n.d(t,{s:()=>k});var r=n(1594),o=n.n(r),i=n(7639),a=n.n(i),s=n(3185),l=n(6897);function c(){return c=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},c.apply(this,arguments)}const u="\n  font-family: var(--neko-font-family);\n  font-weight: normal;\n  line-height: normal;\n  margin-top: 0;\n  margin-bottom: 16px;\n  padding: 0;\n",d=s.Ay.h1`
  ${u}
  font-size: var(--neko-h1-font-size);
`,h=s.Ay.h2`
  ${u}
  font-size: var(--neko-h2-font-size);
`,p=s.Ay.h3`
  ${u}
  font-size: var(--neko-h3-font-size);
`,f=s.Ay.h4`
  ${u}
  font-size: var(--neko-h4-font-size);
`,m=s.Ay.h5`
  ${u}
  font-size: var(--neko-h5-font-size);
`,g=s.Ay.h6`
  ${u}
  font-size: var(--neko-h6-font-size);
`,y=s.Ay.p`
  font-family: var(--neko-font-family);
  font-size: var(--neko-font-size);
  line-height: normal;
  margin: 16px 0 24px;
  padding: 0;
`,b=s.Ay.span`
  font-family: var(--neko-font-family);
  font-size: var(--neko-font-size);
  line-height: normal;
  margin: 0;
  padding: 0;
`,v=s.Ay.label`
  font-family: var(--neko-font-family);
  font-size: var(--neko-font-size);
  line-height: normal;
  margin: 0;
  padding: 0;
`,x=e=>{const{children:t=null,style:n={},className:r="",bold:i=!1,h1:a,h2:s,h3:u,h4:x,h5:k,h6:w,p:_,span:S,label:E,...C}=e,A=i?{fontWeight:"bold"}:{},O=(0,l.gR)("neko-typo",r,{"neko-typo-h1":a},{"neko-typo-h2":s},{"neko-typo-h3":u},{"neko-typo-h4":x},{"neko-typo-h5":k},{"neko-typo-h6":w},{"neko-typo-p":_},{"neko-typo-label":E});return a?o().createElement(d,c({style:{...A,...n},className:O},C),t):s?o().createElement(h,c({style:{...A,...n},className:O},C),t):u?o().createElement(p,c({style:{...A,...n},className:O},C),t):x?o().createElement(f,c({style:{...A,...n},className:O},C),t):k?o().createElement(m,c({style:{...A,...n},className:O},C),t):w?o().createElement(g,c({style:{...A,...n},className:O},C),t):_?o().createElement(y,c({style:{...A,...n},className:O},C),t):E?o().createElement(v,c({style:{...A,...n},className:O},C),t):o().createElement(b,c({style:{...A,...n},className:O},C),t)},k=e=>o().createElement(x,e);k.propTypes={h1:a().any,h2:a().any,h3:a().any,h4:a().any,h5:a().any,h6:a().any,p:a().any,span:a().any,label:a().any,bold:a().bool,style:a().object,className:a().string,children:a().node}},209:(e,t,n)=>{"use strict";n.d(t,{Z:()=>p});var r=n(1594),o=n.n(r),i=n(7639),a=n.n(i),s=n(3185),l=n(8135),c=n(2557),u=n(6897);function d(){return d=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},d.apply(this,arguments)}const h=s.Ay.div`
  &.dropping {
    background: #a4d5ff;
  }
`,p=(0,r.forwardRef)(((e,t)=>{const{onSuccess:n=(()=>{}),onFailure:i=(()=>{}),apiUrl:a,onSelectFiles:s=(()=>{}),apiConfig:p,className:f,disabled:m=!1,children:g,multiple:y,accept:b="image/*",...v}=e,[x,k]=(0,r.useState)(!1),[w,_]=(0,r.useState)(!1),S=a,E=(0,r.useCallback)((async e=>{_(!0);const t=await Promise.all(e.map((async e=>await(async e=>(p.file=e,await(0,l.Tb)(a,p)))(e)))),r=t.filter((e=>e.success)),o=t.filter((e=>!e.success));r.length&&n(y?r:r[0]),o.length&&i(y?o:o[0]),_(!1)}),[a,y,p,n,i]),C=(0,r.useCallback)(((e,t)=>{t.preventDefault(),t.stopPropagation(),k(!1),S?E(e):s(e)}),[S,E]),A=(0,r.useCallback)((e=>{e.preventDefault(),e.stopPropagation()}),[]),O=(0,r.useCallback)((e=>{e.preventDefault(),e.stopPropagation(),m||k(!0)}),[m]),M=(0,r.useCallback)((e=>{e.preventDefault(),e.stopPropagation(),m||k(!1)}),[m]),R=(0,r.useCallback)((e=>{if(m)return;const t=[...e.dataTransfer.files];e.target.value=null,C(t,e)}),[m,C]),P=(0,r.useCallback)((e=>{const t=[...e.target.files];e.target.value=null,C(t,e)}),[C]),T=(0,u.gR)("neko-upload-drop-area",f,{dropping:x});return o().createElement(c.A,{busy:w},o().createElement("input",{type:"file",accept:".csv, .json, .jsonl, .txt",ref:t,onChange:P,style:{display:"none"},multiple:y,disabled:m}),o().createElement(h,d({className:T,onDragOver:A,onDragEnter:O,onDragLeave:M,onDrop:R},v),g))}));p.propTypes={ref:a().ref,onSuccess:a().func,onFailure:a().func,onSelectFiles:a().func,apiUrl:a().string,apiConfig:a().object,disabled:a().bool}},9794:(e,t,n)=>{"use strict";n.d(t,{n:()=>y});var r=n(1594),o=n.n(r),i=n(7639),a=n.n(i),s=n(3062),l=n.n(s),c=n(3185),u=n(9296),d=n(6897);function h(){return h=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},h.apply(this,arguments)}const p=c.DU`
  body.ReactModal__Body--open {
    overflow: hidden;
  }
  
  .ReactModal__Overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    backdrop-filter: blur(2px);
    background-color: rgba(0, 0, 0, 0.35) !important;
    opacity: 0;
    transition: opacity 200ms ease-in-out;
    overflow-y: auto;
  }
  .ReactModal__Overlay--after-open {
    opacity: 1;
  }
  .ReactModal__Overlay--before-close {
    opacity: 0;
  }
  .ReactModal__Overlay .neko-modal {
    opacity: 0;
    transform: scale(0.85);
    transition: all 200ms ease-in-out;
  }
  .ReactModal__Overlay--after-open .neko-modal {
    transform: scale(1);
    opacity: 1;
  }
  .ReactModal__Overlay--before-close .neko-modal {
    transform: scale(0.85);
    opacity: 0;
  }

  /* ──────────────────────────────────────────────────────────── */
  /* Base modal shell                                            */
  /* ──────────────────────────────────────────────────────────── */
  .neko-modal {
    background: white;
    color: var(--neko-font-color);
    position: relative;
    box-shadow: 0 1px 2px rgba(0,0,0,0.07),
                0 2px 4px rgba(0,0,0,0.07),
                0 4px 8px rgba(0,0,0,0.07),
                0 8px 16px rgba(0,0,0,0.07),
                0 16px 32px rgba(0,0,0,0.07),
                0 32px 64px rgba(0,0,0,0.07);
    outline: none;
    padding: 15px;
    max-width: 1200px;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
  }

  .neko-modal.large   { max-width: 700px; }
  .neko-modal.larger  { max-width: 900px; }
  .neko-modal.full-size {
    margin-top: 32px;
    padding: 15px 0 0 0;
    width: 90vw;
    height: 85vh;
    max-width: none;
    max-height: 85vh;
    overflow: hidden;
  }
`,f=c.Ay.div`
  /* Width adapts to the chosen size or explicit contentWidth */
  width: ${e=>{if("full-size"===e.size)return"100%";if(e.contentWidth)return e.contentWidth;switch(e.size){case"large":return"700px";case"larger":return"900px";default:return"518px"}}};
  flex: 1;
  display: flex;
  flex-direction: column;
  ${e=>"full-size"===e.size&&"\n    height: 100%;\n    overflow: hidden;\n  "}

  p { margin: 0; }

  .title {
    font-family: var(--neko-font-family);
    font-style: normal;
    font-weight: bold;
    font-size: 18px;
    line-height: 22px;
    margin-bottom: 15px;
  }

  .content-container {
    display: flex;
    position: relative;
    z-index: 1;
    flex: 1;
    overflow-y: ${e=>"full-size"===e.size?"auto":"clip"};

    .thumbnail {
      margin-right: 15px;
      width: 240px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .content {
      flex: auto;
      font-family: var(--neko-font-family);
      font-style: normal;
      font-weight: normal;
      font-size: var(--neko-font-size);
      line-height: 14px;
      width: 100%;
      margin: 0 !important;
      padding: 0 !important;
      ${e=>"full-size"===e.size&&"\n        overflow-y: auto;\n        padding: 0 15px !important;\n      "}
    }
  }

  /* Bottom‑footer buttons – new grey bar for better separation */
  .button-group {
    align-items: center;
    display: flex;
    justify-content: flex-end;
    font-size: inherit;
    white-space: normal;

    background: #f0f0f0;
    padding: 10px;
    margin: 15px -15px -15px -15px;
  }

  /* Header variation inside full‑size mode – no grey footer */
  .full-size-header .button-group {
    background: none;
    padding: 0;
    margin: 0;
  }

  .full-size-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    padding: 0 15px;

    .title { margin-bottom: 0; align-self: center; }
    .button-group { gap: 5px; }
  }
`,m=["disabled","ok","okOnClick","okDisabled","cancel","cancelOnClick","cancelDisabled"],g=e=>{const{className:t,style:n,contentStyle:i,title:a="",content:s="",contentWidth:c,customButtons:g=null,okOnEnter:y=!1,thumbnail:b,okButton:v={},cancelButton:x={},isOpen:k,children:w,customButtonsPosition:_="right",size:S="normal",fullSize:E=!1,...C}=e,A=S||(E?"full-size":"normal"),O="full-size"===A,M=(0,d.gR)("neko-modal",t,{large:"large"===A,larger:"larger"===A,"full-size":O,"custom-modal":n}),{label:R="OK",...P}=v,{label:T="Cancel",...z}=x;(0,r.useEffect)((()=>{const t=m.filter((t=>void 0!==e[t]));t.length&&console.warn(`[Deprecated] NekoUI: Button attributes ${t.join(", ")} are deprecated in NekoModal.\nPlease use: okButton={{ label, onClick, disabled }} and cancelButton={{ ... }}`,{props:e})}),[e]);const j=(0,r.useCallback)((({key:e})=>{"Enter"===e&&P.onClick&&P.onClick()}),[P]);(0,r.useEffect)((()=>{if(y&&k)return window.addEventListener("keyup",j),()=>window.removeEventListener("keyup",j)}),[y,k,j]);const I=()=>o().createElement(o().Fragment,null,g&&"left"===_&&g,z.onClick&&o().createElement(u.M,h({className:"danger"},z),T),P.onClick&&o().createElement(u.M,P,R),g&&"right"===_&&g),N=w||o().createElement(f,{size:A,contentWidth:c},O&&a&&o().createElement("div",{className:"full-size-header"},o().createElement("p",{className:"title"},a),o().createElement("div",{className:"button-group"},I())),!O&&a&&o().createElement("p",{className:"title"},a),o().createElement("div",{className:"content-container"},b&&o().createElement("div",{className:"thumbnail"},b),s&&o().createElement("div",{className:"content",style:i},s)),!O&&o().createElement("div",{className:"button-group"},I()));return o().createElement(o().Fragment,null,o().createElement(p,null),o().createElement(l(),h({ariaHideApp:!1,closeTimeoutMS:200,className:M,style:n,isOpen:k},C),N))},y=e=>o().createElement(g,e);y.propTypes={className:a().string,style:a().object,contentStyle:a().object,title:a().string,content:a().string,contentWidth:a().string,customButtons:a().object,okOnEnter:a().bool,thumbnail:a().element,okButton:a().object,cancelButton:a().object,size:a().oneOf(["normal","large","larger","full-size"]),fullSize:a().bool,isOpen:a().bool.isRequired}},5900:(e,t,n)=>{"use strict";n.d(t,{o:()=>P});var r=n(1594),o=n.n(r),i=n(7639),a=n.n(i),s=n(3185),l=n(2480),c=n(9685),u=n(5055),d=n(2557),h=n(5263),p=n(6897);var f=n(5484),m=n(374),g=n(4536),y=n(3516),b=n(9296),v=n(6734),x=n(8696);const k=s.Ay.div`
  min-width: 160px;
  padding: 8px;
  border-radius: 8px;
  overflow: hidden;
  background: var(--neko-main-color-alternative);
  color: white;
  
  .neko-context-content {
    max-height: 202px;
    overflow-y: auto;
  }

  .neko-checkbox {
    margin-bottom: 5px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .neko-radio:last-child {
    margin-bottom: 0;
  }

  svg {
    color: var(--neko-disabled-color);

    &.neko-active {
      color: white;
    }
  }
`,w=({accessor:e,options:t,type:n="checkbox",onChange:o,description:i,filters:a})=>{const[s,l]=(0,r.useState)(!1),[c,u]=(0,r.useState)(""),[d,p]=(0,r.useState)(""),w=(0,r.useRef)(null),_=(0,r.useRef)(null),S=a&&a.length>0||c.length>0,E="checkbox"===n,C="select"===n,A="text"===n,O=(t=void 0)=>{void 0!==t&&t!==c&&u((()=>t)),d!==c&&(o(e,d),u(d))};return(0,r.useEffect)((()=>{O(),s&&setTimeout((()=>{_.current&&_.current.focus()}),10)}),[s]),React.createElement(React.Fragment,null,React.createElement("div",{ref:w},React.createElement(f.z,{icon:"filter",className:S?"neko-active":"",onClick:()=>l(!s),width:16,height:16})),React.createElement(m.G,{visible:s,targetRef:w,onClose:()=>l(!1)},React.createElement(k,{className:"neko-table-filters"},React.createElement("div",{className:"neko-context-menu"},!!i&&React.createElement("p",{style:{marginTop:0,marginBottom:5}},i),React.createElement("div",{className:"neko-context-content"},E&&React.createElement(g.E,{name:"neko-context-menu-checkboxes"},t.map((t=>React.createElement(h.R,{small:!0,key:t.value,label:t.label,checked:null==a?void 0:a.includes(t.value),onChange:n=>{if(a)return o(e,n?[...a,t.value]:a.filter((e=>e!=t.value)));console.error("[NekoUI] filters needs to be set for the NekoTable.",{accessor:e,option:t.value})}})))),C&&React.createElement(y.u,{name:"neko-context-menu-select",onChange:t=>o(e,t)},t.map((e=>React.createElement(y.j,{id:e.value,key:e.value,label:e.label,value:e.value,checked:a===e.value}))))),A&&React.createElement(x.A,{ref:_,name:"neko-context-menu-text",value:d,onChange:e=>p(e),onEnter:e=>{O(e),l(!1)}}),React.createElement(v.g,{tiny:!0}),React.createElement("div",{className:"neko-context-menu-bottom-actions"},React.createElement(b.M,{fullWidth:!0,disabled:!S,onClick:()=>{o(e,E?[]:null),p(""),l(!1),u("")}},"Reset"))))))};function _(){return _=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},_.apply(this,arguments)}w.propTypes={accessor:a().string,options:a().array,type:a().oneOf(["checkbox","select","text"]),onChange:a().func,filters:a().oneOfType([a().string,a().array])};const S=s.Ay.table`
  font-family: var(--neko-font-family);
  border-spacing: 0;
  width: 100%;
  word-break: break-all;
  display: block;

  thead, tbody, tfoot {
    display: block;
  }
  
  /* Rounded corners for header row */
  thead tr th:first-child {
    border-radius: 5px 0 0 0;
  }
  
  thead tr th:last-child {
    border-radius: 0 5px 0 0;
  }
  
  /* Rounded corners for footer row */
  tfoot tr th:first-child {
    border-radius: 0 0 0 5px;
  }
  
  tfoot tr th:last-child {
    border-radius: 0 0 5px 0;
  }

  tr {
    display: grid;
    grid-template-columns: ${e=>e.$gridColumns||"repeat(auto-fit, minmax(0, 1fr))"};
  }

  th, td {
    margin: 0;
    padding: 5px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    border-right: 1px solid rgba(0, 0, 0, 0.05);
    overflow: hidden;
    text-overflow: ellipsis;
    display: flex;
    flex-direction: column;
    justify-content: center;

    a {
      text-decoration: none;
    }
  }

  th:last-child, td:last-child {
    border-right: 0;
  }

  th {
    height: 26px;
    background-color: var(--neko-main-color);
    color: var(--neko-white);
    font-style: normal;
    font-weight: normal;
    font-size: var(--neko-font-size);
    line-height: 16px;
    text-align: left;
    flex-direction: row;
    align-items: center;
    position: relative;
    overflow: hidden;
    
    /* Diagonal stripe pattern for headers */
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      opacity: 0.1;
      background-image: repeating-linear-gradient(
        -45deg,
        transparent,
        transparent 20px,
        rgba(255, 255, 255, 0.3) 20px,
        rgba(255, 255, 255, 0.3) 40px
      );
      pointer-events: none;
      z-index: 0;
    }
    

    > div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      height: 100%;
      position: relative;
      z-index: 1;

      .neko-column-action {
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 18px;
        height: 18px;
        flex-shrink: 0;
        
        svg {
          color: rgba(255, 255, 255, 0.5);
          display: block;
          width: 18px;
          height: 18px;
        }

        svg.neko-active {
          color: white;
        }
      }
    }
  }

  &.neko-table-raw {
    th, td {
      border: 0;

      .neko-column-action {

        > svg {
          color: black;
          opacity: 0.5;
        }

        > svg.neko-active {
          opacity: 1;
        }
      }
    }
  }

  &.neko-table-raw {
    th {
      font-weight: bold;
    }
    th {
      background-color: white;
      color: var(--neko-font-color);
    }
  }

  tbody {
    background-color: white;
    color: var(--neko-font-color);
    min-height: 40px;
    
    tr:nth-child(even) {
        background-color: var(--neko-gray-98);
    }

    tr.selected, tr.selected:nth-child(even) {
        background-color: var(--neko-main-color);
        filter: brightness(1.2);
        color: white;

        a {
          color: #81e8ff;
        }

        .neko-button {
          border: 1px solid white;
        }
    }
    
    img {
      vertical-align: bottom;
    }
}

  &.neko-table-raw {

    svg {
      &.neko-active {
        color: var(--neko-main-color) !important;
        opacity: 1;
      }
    }

    tbody {
      tr {
        &.selected, &.selected :nth-child(even) {
          background-color: white;
          color: var(--neko-black);
        }
      }
    }
  }

  tfoot tr:last-child {
    td {
      border-bottom: 0;
    }
  }

  .table-checkbox-cell {
    text-align: center;
    justify-content: center;

    svg {
      padding: 5px;
      cursor: pointer;
    }
  }

  &.neko-row-selectable {
    tbody tr {
      cursor: pointer;
    }
  }
`,E=e=>{const{checked:t,indeterminate:n,onSelect:r=(()=>{}),onUnselect:i=(()=>{}),isBusy:a=!1}=e;return o().createElement(h.R,{small:!0,onChange:(e,t,n)=>e?r(n):i(n),checked:t,indeterminate:n,isBusy:t&&a,disabled:a})},C={left:"start",center:"center",right:"end"},A=(e,t=!1)=>{let n={};return e.align&&(n={textAlign:e.align,justifyContent:C[e.align]}),t&&e.verticalAlign&&(n={...n,verticalAlign:e.verticalAlign}),e.style&&(n={...n,...e.style}),n},O=e=>!0===e?"#edf8ff":e,M=(e,t)=>{console.log("[NekoUI] Missing implementation for onFilterChange.",{filter:e,value:t})},R=e=>{const{data:t=[],selectedItems:n=[],selectedRow:i,filters:a,onFilterChange:s=M}=e,{columns:h=[],busy:f=!1,onSelect:m,onSelectRow:g,selectOnRowClick:y=!0,onUnselect:b,onSortChange:v=(()=>{}),variant:x="default",alternateRowColor:k=!1,sort:C,emptyMessage:R="Empty.",initialLoad:P=!1}=e;h.length;t.some((e=>void 0===e.id))&&(console.warn('Table data is missing the "id" field. Using the index as id instead, and disabling the row selection.'),t.forEach(((e,t)=>{e.id||(e.disabled_row=!0,e.id=-t)})));const T=(e=>e?{backgroundColor:O(e)}:{})(k),z=t.map((e=>{const t=h.map((t=>({value:e[t.accessor],style:A(t,!0)})));return{id:e.id,disabled_row:null==e?void 0:e.disabled_row,isBusy:e.isBusy||!1,cells:t}})),j=t.map((e=>({id:e.id}))),{onSelect:I}=(({list:e,selectedList:t,callback:n,key:o="id"})=>{const{pressShift:i}=(0,p.v_)(),a=(0,r.useMemo)((()=>{if(!i||!t.length)return null;const n=t[t.length-1];return e.findIndex((e=>e[o]===n))}),[o,e,i,t]);return{onSelect:(0,r.useCallback)((r=>{if(!n)return;if(null===a)return void n([...r]);const i=r[0],s=e.findIndex((e=>e[o]===i)),l=(a<s?a:s)+1,c=a<s?s:a,u=e.slice(l,c).map((e=>e[o])).filter((e=>!t.some((t=>t===e))));n([...u,...r])}),[a,e,n,t,o])}})({list:j,selectedList:n,callback:m}),N=z.map((e=>e.id)),$=0===N.length,L=N.filter((e=>n.includes(e))),D=!$&&L.length===N.length,F=!D&&n.length>0,B=h.reduce((function(e,t,n){return!1===t.visible&&e.push(n),e}),[]),W=!!m&&!$,H=o().createElement("tr",null,W&&o().createElement("th",{className:"table-checkbox-cell"},o().createElement(E,{checked:D,indeterminate:F,onSelect:e=>m(N,e),onUnselect:e=>{b(F?n:N,e)}})),h.filter(((e,t)=>!B.includes(t))).map((e=>{let t=C&&C.accessor===e.accessor,n=C&&"asc"===C.by;const r=A(e);return o().createElement("th",{style:r,key:e.accessor},o().createElement("div",null,o().createElement("div",null,e.title),o().createElement("div",{style:{flex:"auto"}}),e.filters&&o().createElement("div",{className:"neko-column-action"},o().createElement(w,_({accessor:e.accessor},e.filters,{onChange:(e,t)=>s(e,t),filters:(()=>{let t=(null==a?void 0:a.find((t=>t.accessor===e.accessor)))??null;return(null==t?void 0:t.value)??null})()}))),e.sortable&&o().createElement("div",{className:"neko-column-action",onClick:r=>{let o=C&&C.accessor!==e.accessor;v(e.accessor,o||t&&n?"desc":"asc",r)}},t?n?o().createElement(c.A,{className:"neko-active",size:u.hS.chevron}):o().createElement(l.A,{className:"neko-active",size:u.hS.chevron}):o().createElement(l.A,{className:t?"neko-active":"",size:u.hS.chevron}))))}))),q=(0,p.gR)("neko-table",`neko-table-${x}`,{"neko-row-selectable":!!g}),U=((e,t)=>{const n=e.filter((e=>!1!==e.visible)),r=t?["34px"]:[];return n.forEach((e=>{if(e.width)if(e.width.endsWith("%")){const t=parseFloat(e.width)/100;r.push(`${t}fr`)}else r.push(e.width);else r.push("1fr")})),r.join(" ")})(h,W);return o().createElement(d.A,{busy:f,overlaystyle:{top:"36px",height:"calc(100% - 76px)"}},o().createElement(S,{className:q,$gridColumns:U},o().createElement("thead",null,H),o().createElement("tbody",null,!z.length&&!f&&!P&&o().createElement("tr",null,o().createElement("td",{style:{gridColumn:"1 / -1",textAlign:"center",minHeight:40,color:"gray"}},R)),z.map(((e,t)=>{const r=t%2==0?T:{},a=!!i&&i===e.id||n.includes(e.id);return o().createElement("tr",{key:`neko-row-${e.id}`,className:a?"selected":"",style:r,onClick:t=>{t.stopPropagation(),g&&y&&g(e.id,t)}},W&&o().createElement("td",{className:"table-checkbox-cell"},o().createElement(E,{checked:n.includes(e.id),onSelect:t=>{t.stopPropagation(),I([e.id],t)},onUnselect:t=>{t.stopPropagation(),b([e.id],t)},isBusy:e.isBusy||(null==e?void 0:e.disabled_row)})),e.cells.filter(((e,t)=>!B.includes(t))).map(((n,r)=>o().createElement("td",{key:`${e.id}${t}${r}`,style:n.style},n.value))))}))),"default"===x&&o().createElement("tfoot",null,H)))},P=e=>o().createElement(R,e);P.propTypes={columns:a().arrayOf(a().any),data:a().arrayOf(a().any),busy:a().bool,onSelect:a().func,onSelectRow:a().func,selectOnRowClick:a().bool,onUnselect:a().func,selectedItems:a().arrayOf(a().any),onSortChange:a().func,variant:a().string,alternateRowColor:a().oneOfType([a().bool,a().string]),initialLoad:a().bool}},3676:(e,t,n)=>{"use strict";n.d(t,{V:()=>N,_:()=>I});var r=n(1594),o=n.n(r),i=n(7639),a=n.n(i),s=n(3185),l=n(1329),c=n(5484),u=n(374),d=n(8696),h=n(2480),p=n(6897),f=n(2557);function m(){return m=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},m.apply(this,arguments)}const g=320,y=120,b=72,v=5,x=2,k=44,w=12,_=.25,S=s.Ay.div`
  display: flex;
  align-items: stretch;
  position: relative;
  height: 39px;
`,E=s.Ay.div`
  display: flex;
  height: 39px;
  overflow-x: hidden;     /* we use overflow menu instead of horizontal scroll */
  flex-grow: 1;
  flex-shrink: 1;
  max-width: 100%;

  /* Hide scrollbars defensively */
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar { display: none; }
`,C=s.Ay.div`
  display: flex;
  align-items: center;
  height: 39px;
  margin-left: auto;
  flex-shrink: 0;
  gap: 6px;

  /* Chevron animation: scale on hover, rotate when open */
  .neko-tabs-chevron {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transform-origin: center;
    transition: transform 180ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity 120ms ease;
    will-change: transform;
  }

  .neko-tabs-chevron.open { transform: rotate(180deg); }
  .neko-tabs-chevron:hover { transform: scale(1.06); }
  .neko-tabs-chevron.open:hover { transform: scale(1.06) rotate(180deg); }
`,A=s.Ay.button`
  border-radius: 8px 8px 0 0;
  border: 0;
  background-color: var(--neko-tab-bg, var(--neko-main-color-disabled));
  color: rgb(255 255 255 / 65%);
  display: flex;
  align-items: center;
  cursor: pointer;
  text-align: left;
  padding: 12px 15px;
  box-sizing: border-box;
  white-space: nowrap;
  overflow: hidden;       /* allow the label to manage its own fade */
  text-overflow: ellipsis;
  margin: 0;              /* gaps are applied inline per instance */
  position: relative;     /* for the hover underline */
  transition: filter 140ms ease;
  will-change: filter;
  
  /* Subtle glass effect for non-active tabs */
  &:not(.active) {
    background: 
      linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.08) 0%,
        transparent 40%
      ),
      linear-gradient(
        to bottom,
        var(--neko-main-color-disabled),
        color-mix(in srgb, var(--neko-main-color-disabled) 95%, black)
      );
    box-shadow: 
      inset 0 1px 0 rgba(255, 255, 255, 0.1),
      inset 0 -1px 0 rgba(0, 0, 0, 0.05);
  }

  &:not(.active):not(.disabled):hover {
    background: 
      linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.1) 0%,
        transparent 50%
      ),
      linear-gradient(
        to bottom,
        color-mix(in srgb, var(--neko-main-color-disabled) 98%, var(--neko-main-color)),
        color-mix(in srgb, var(--neko-main-color-disabled) 96%, var(--neko-main-color))
      );
    
    .neko-tab-label {
      background: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0.8),
        rgba(255, 255, 255, 0.95),
        rgba(255, 255, 255, 0.8)
      );
      background-size: 200% auto;
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: shimmerText 2s linear infinite;
    }
  }
  
  @keyframes shimmerText {
    0% {
      background-position: -200% center;
    }
    100% {
      background-position: 200% center;
    }
  }

  &:focus { outline: none; }

  &.active {
    --neko-tab-bg: var(--neko-main-color);
    background-color: var(--neko-tab-bg);
    color: var(--neko-white);
    font-weight: inherit; /* avoid width jumps on selection */
  }

  &.disabled {
    cursor: default;
    display: inline-flex;
    padding-bottom: 7px;
    position: relative;
    overflow: hidden;
    background: linear-gradient(
      to bottom,
      #b8d4e8,
      #5a8fb8
    );
    
    /* Additional VERY OBVIOUS overlay for testing */
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        to bottom,
        rgba(255, 255, 255, 0.5) 0%,
        transparent 20%,
        rgba(0, 0, 0, 0.3) 80%,
        rgba(0, 0, 0, 0.6) 100%
      );
      pointer-events: none;
      z-index: 1;
    }
    
    /* Ensure content is above the gradient */
    > * {
      position: relative;
      z-index: 2;
    }
  }

  &.hidden { display: none; }

  &.inversed.active {
    --neko-tab-bg: var(--neko-white);
    background-color: var(--neko-tab-bg);
    color: var(--neko-font-color);
    font-weight: inherit;
  }

  .neko-tab-label {
    position: relative;
    display: block;
    overflow: hidden;
    white-space: nowrap;
    flex: 1 1 auto;
    -webkit-mask-image: none;
    mask-image: none;
  }

  /* Fade only when flexing (or when overflow exists) */
  &.needs-fade .neko-tab-label {
    -webkit-mask-image: linear-gradient(to right, black 72%, transparent 100%);
    mask-image: linear-gradient(to right, black 72%, transparent 100%);
  }

  /* Remove underline - we're using gradient animation instead */

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`,O=s.Ay.div`
  background-color: var(--neko-main-color);
  color: white;
  display: none;
  padding: 10px;
  border-radius: 0 0 8px 8px;
  box-shadow: 0px 8px 8px -8px rgba(0, 0, 0, 0.35);

  &.active { display: block; }

  &.inversed {
    background-color: var(--neko-white);
    color: var(--neko-black);
  }
`,M=s.Ay.div`
  background: var(--neko-white);
  border: 1px solid var(--neko-input-border);
  border-radius: var(--neko-radius-md);
  box-shadow: var(--neko-shadow-lg);
  min-width: 220px;
  overflow: hidden;
`,R=s.Ay.div`
  max-height: 300px;
  overflow-y: auto;
`,P=s.Ay.div`
  padding: 7px 12px;
  cursor: pointer;
  font-size: var(--neko-font-size);
  background: var(--neko-white);
  transition: background-color 0.12s ease, box-shadow 0.2s ease;

  &:hover {
    background-color: var(--neko-main-color-95);
    box-shadow: var(--neko-shadow-xs);
  }
`,T=(e=6)=>{const t="abcdefghijklmnopqrstuvwxyz0123456789";let n="";for(let r=0;r<e;r++)n+=t[36*Math.random()|0];return n},z=e=>{const{inversed:t,children:n,action:i,isPro:a,currentTab:s,onChange:f,keepTabOnReload:O=!1,callOnTabChangeFirst:z=!0,minWidth:j=b,idealWidth:I=y,maxWidth:N=g,gap:$=v,minGap:L=x,chevronReserve:D=k,layoutBuffer:F=w,ariaLabel:B="Tabs",...W}=e,H=(0,r.useRef)(`nt-${T(8)}`).current,q=(0,r.useRef)(null),U=(0,r.useRef)(null),V=(0,r.useRef)(null),K=(0,r.useRef)(null),Q=(0,r.useRef)([]),[Y,G]=(0,r.useState)([]),[X,Z]=(0,r.useState)(!1),[J,ee]=(0,r.useState)(""),[te,ne]=(0,r.useState)(!1),[re,oe]=(0,r.useState)($),[ie,ae]=(0,r.useState)((()=>{if("string"==typeof s)return s;if(O&&"undefined"!=typeof window)try{return new URL(window.location.href).searchParams.get("nekoTab")||""}catch{}return""})),se=(0,r.useRef)(!1);(0,r.useEffect)((()=>{oe($)}),[$]);const le=(0,r.useCallback)((e=>{var t;if("undefined"!=typeof window&&null!==(t=history)&&void 0!==t&&t.replaceState&&"string"==typeof e)try{const t=new URLSearchParams(window.location.search);t.set("nekoTab",e);const n=window.location.protocol+"//"+window.location.host+window.location.pathname+"?"+t.toString();window.history.replaceState({path:n},"",n)}catch{}}),[]),ce=(0,r.useMemo)((()=>{const e=[];return o().Children.forEach(n,(t=>{o().isValidElement(t)&&e.push(t)})),e}),[n]),ue=(0,r.useMemo)((()=>{const e=new Set;return ce.map(((t,n)=>{let r=t.key||((e,t)=>{const n=e.props||{};let r="tab-"+(t+1);return e.key?r=e.key:"string"==typeof n.title&&(r=n.title.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5\u3040-\u309f\u30a0-\u30ff\u2e80-\u2eff\u31f0-\u31ff\u3200-\u32ff\u3400-\u4dbf\uf900-\ufaff ]/gi,"").replace(/ /g,"-")),r})(t,n);e.has(r)&&(r=`${r}-${T()}`),e.add(r);const{title:o=`Untitled Tab ${n+1}`,requirePro:i=!1,hidden:s=!1,icon:l=null}=t.props||{};return{key:r,title:o,requirePro:!a&&i,hidden:s,icon:l}}))}),[ce,a]),de=(0,r.useMemo)((()=>ue.map((e=>e.key))),[ue]),he=(0,r.useCallback)(((e,t,n)=>{t&&!t.requirePro&&(void 0===s&&ie!==t.key&&ae(t.key),f&&f(e,t,n),O&&le(t.key))}),[s,ie,f,O,le]),pe=(0,r.useMemo)((()=>{const e=new Set(Y),t=[];for(let n=0;n<ue.length;n++){const r=ue[n];r&&(r.hidden||e.has(n)||t.push(n))}return t}),[Y,ue]),fe=(0,r.useCallback)((e=>{const t=Q.current[e];t&&t.focus&&t.focus({preventScroll:!0})}),[]),me=(0,r.useCallback)(((e,t)=>{if(!pe.length)return;const n=pe.indexOf(e),r=-1===n?0:(n+t+pe.length)%pe.length,o=pe[r],i=ue[o];i&&!i.requirePro&&(he(o,i),fe(o))}),[pe,ue,he,fe]),ge=(0,r.useCallback)((e=>t=>{switch(t.key){case"ArrowRight":t.preventDefault(),me(e,1);break;case"ArrowLeft":t.preventDefault(),me(e,-1);break;case"Home":if(t.preventDefault(),pe.length){const e=pe[0],t=ue[e];t&&!t.requirePro&&(he(e,t),fe(e))}break;case"End":if(t.preventDefault(),pe.length){const e=pe[pe.length-1],t=ue[e];t&&!t.requirePro&&(he(e,t),fe(e))}}}),[pe,ue,he,fe]),ye=(0,r.useCallback)((e=>{const t=Q.current[e];if(!t||"undefined"==typeof window)return I;const n=window.getComputedStyle(t);let r=(parseFloat(n.paddingLeft)||0)+(parseFloat(n.paddingRight)||0);const o=Array.from(t.children);for(const e of o){const t=e.getBoundingClientRect().width||0;if(e.classList&&e.classList.contains("neko-tab-label")){r+=Math.max(e.scrollWidth||0,t)}else r+=t}const i="number"==typeof N?N:Number.MAX_SAFE_INTEGER;return Math.min(r,i)}),[I,N]),be=(0,r.useCallback)((()=>{const e=q.current;if(!e)return;const t=e.clientWidth,n=K.current?K.current.offsetWidth:0,r=U.current?U.current.offsetWidth:0,o=[];Q.current.forEach(((e,t)=>{const n=ue[t];e&&n&&!n.hidden&&o.push(t)}));const i=o.length;if(0===i)return G((e=>e.length?[]:e)),ne(!1),void oe((e=>Math.abs(e-$)<_?e:$));const a=F,s=t-r-a,l=o.reduce(((e,t)=>e+ye(t)),0),c=K.current?1:0,u=l+n+(i-1+c)*$;if(u<=s)return ne(!1),G((e=>e.length?[]:e)),void oe((e=>Math.abs(e-$)<_?e:$));const d=i-1+c;if(d>0&&L<$){const e=u-s;if(e>0&&e<=d*($-L)+.5){const t=Math.max(L,$-e/d);return ne(!1),G((e=>e.length?[]:e)),void oe((e=>Math.abs(e-t)<_?e:t))}}if(Math.floor((s-n+$)/(j+$))>=i)return ne(!0),G((e=>e.length?[]:e)),void oe((e=>Math.abs(e-$)<_?e:$));const h=t-Math.max(r,D)-a;let p=Math.floor((h-n+$)/(j+$));p=Math.max(1,Math.min(p,i));let f=o.slice(0,p),m=o.slice(p);const g=ue.findIndex((e=>e&&e.key===ie));if(-1!==g&&!f.includes(g)&&o.includes(g)){f[f.length-1]=g;const e=new Set(f);m=o.filter((t=>!e.has(t)))}ne(!0),oe((e=>Math.abs(e-$)<_?e:$)),G((e=>e.length===m.length&&e.every(((e,t)=>e===m[t]))?e:m))}),[ue,ie,$,L,j,I,D,F,ye,i]);(0,r.useLayoutEffect)((()=>{be()}),[be]),(0,r.useEffect)((()=>{const e=q.current;if(!e)return;const t=()=>be();let n;return"undefined"!=typeof ResizeObserver?(n=new ResizeObserver(t),n.observe(e)):window.addEventListener("resize",t),()=>{n?n.disconnect():window.removeEventListener("resize",t)}}),[be]),(0,r.useEffect)((()=>{be()}),[ie,be]),(0,r.useEffect)((()=>{if(!ue.length)return;const e="string"==typeof s?s:ie;if(!de.includes(e)&&de.length>0){const t=ue.find((e=>!e.hidden));t&&e!==t.key&&ae(t.key)}else e!==ie&&ae(e)}),[s,ue,de,ie]),(0,r.useEffect)((()=>{const e=ue.find((e=>e.key===ie));if(e&&e.hidden){const e=ue.find((e=>!e.hidden));e&&ae(e.key)}}),[ue,ie]),(0,r.useLayoutEffect)((()=>{if(se.current)return;if(!ue.length)return;se.current=!0;let e=ie;if(!e){var t;const n=O&&"undefined"!=typeof window?new URL(window.location.href).searchParams.get("nekoTab"):null;e=(n&&de.includes(n)?n:null)||((null===(t=ue.find((e=>!e.hidden)))||void 0===t?void 0:t.key)??de[0]),ae(e)}if(z){const t=de.indexOf(e);-1!==t&&ue[t]&&he(t,ue[t])}}),[O,z,ue,de,ie,he]);const ve=(0,r.useMemo)((()=>o().Children.map(ce,((e,n)=>{const r=ue[n];if(!r)return null;const i=r.key===ie&&!r.hidden;return o().cloneElement(e,{isActive:i,inversed:t,key:r.key,_panelId:`panel-${H}-${n}`,_labelledById:`tab-${H}-${n}`})}))),[ce,ue,ie,t,H]),xe=(0,p.gR)("neko-tabs",{inversed:t});return o().createElement("div",m({className:xe},W),o().createElement(S,null,o().createElement(E,{ref:q,role:"tablist","aria-label":B},ue.map(((e,n)=>{const r=e.key===ie,i=(e.hidden||Y.includes(n))&&!r,a=`neko-tab-title ${r?"active":""} ${e.requirePro?"disabled":""} ${i?"hidden":""} ${t?"inversed":""} `+(te||Y.length>0?"needs-fade":""),s={...te?{minWidth:j,maxWidth:N,flex:`1 1 ${I}px`}:{flex:"0 0 auto"},marginRight:re};return o().createElement(A,{key:e.key,id:`tab-${H}-${n}`,ref:e=>Q.current[n]=e,role:"tab","aria-selected":r,"aria-controls":`panel-${H}-${n}`,"aria-disabled":e.requirePro?"true":"false",tabIndex:r?0:-1,onKeyDown:ge(n),onClick:t=>he(n,e,t),className:a,style:s,disabled:!!e.requirePro,"data-key":e.key},e.icon&&o().createElement(c.z,{icon:e.icon,width:15,height:15,style:{marginRight:5},raw:!0}),o().createElement("div",{className:"neko-tab-label",title:e.title},e.title),o().createElement(l.K,{className:"inline",show:e.requirePro,style:{marginLeft:10,marginRight:-5,top:-1}}))})),i&&o().createElement("span",{ref:K,style:{display:"inline-flex",alignItems:"center",marginLeft:re,flex:"0 0 auto"}},i)),o().createElement(C,{ref:U},Y.length>0&&o().createElement("div",{style:{display:"flex",alignItems:"center"}},o().createElement("span",{ref:V,role:"button",tabIndex:0,"aria-haspopup":"menu","aria-expanded":X?"true":"false","aria-label":"More tabs",onClick:()=>Z((e=>!e)),onKeyDown:e=>{"Enter"!==e.key&&" "!==e.key||(e.preventDefault(),Z((e=>!e)))},className:"neko-tabs-chevron "+(X?"open":""),style:{display:"inline-flex",alignItems:"center",marginLeft:20,marginRight:5,cursor:"pointer",color:t?"var(--neko-white)":"var(--neko-gray-60)"}},o().createElement(h.A,{size:22})),o().createElement(u.G,{visible:X,targetRef:V,onClose:()=>{Z(!1),ee("")},matchWidth:!1},o().createElement(M,null,Y.length>8&&o().createElement("div",{style:{padding:6}},o().createElement(d.A,{value:J,placeholder:"Search tabs...",onChange:e=>ee(e)})),o().createElement(R,{role:"menu"},Y.filter((e=>{var t;if(!J)return!0;return((null===(t=ue[e])||void 0===t?void 0:t.title)||"").toLowerCase().includes(J.toLowerCase())})).map((e=>{var t,n;return o().createElement(P,{key:(null===(t=ue[e])||void 0===t?void 0:t.key)||e,role:"menuitem",onClick:t=>{Z(!1),ee(""),he(e,ue[e],t)},className:"neko-tab-overflow-item"},(null===(n=ue[e])||void 0===n?void 0:n.title)||`Tab ${e+1}`)})))))))),ve)},j=e=>{const{children:t,isActive:n=!1,busy:r=!1,inversed:i,_panelId:a,_labelledById:s,title:l,icon:c,requirePro:u,key:d,...h}=e,m=(0,p.gR)("neko-tab-content",{active:n,inversed:i});return o().createElement(f.A,{busy:r},o().createElement(O,{id:a,role:"tabpanel","aria-labelledby":s,"aria-hidden":n?"false":"true",hidden:!n,className:m},n&&t))},I=e=>o().createElement(z,e);I.propTypes={isPro:a().bool,onChange:a().func,action:a().node,currentTab:a().string,keepTabOnReload:a().bool,callOnTabChangeFirst:a().bool,inversed:a().bool,minWidth:a().number,idealWidth:a().number,maxWidth:a().number,gap:a().number,minGap:a().number,chevronReserve:a().number,layoutBuffer:a().number,ariaLabel:a().string};const N=e=>o().createElement(j,e);N.propTypes={isActive:a().bool,requirePro:a().bool,title:a().string,icon:a().string,busy:a().bool}},7494:(e,t,n)=>{"use strict";n.d(t,{V:()=>u});var r=n(1594),o=n.n(r),i=n(7639),a=n.n(i);function s(){return s=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},s.apply(this,arguments)}const l=n(3185).Ay.div`
  box-sizing: border-box;
  display: flex;
  width: 100%;
  padding: 10px 10px;
  background: white;
  color: var(--neko-font-color);
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  align-items: center;

  &.neko-align-left {
    justify-content: flex-start;
  }

  &.neko-align-right {
    justify-content: flex-end;
  }

  > *:not(:last-child) {
    margin-right: 5px;
  }
`,c=({align:e="left",...t})=>o().createElement(l,s({className:`neko-toolbar neko-align-${e}`},t),t.children),u=e=>o().createElement(c,e);u.propTypes={align:a().oneOf(["left","right"])}},7965:(e,t,n)=>{"use strict";var r=n(6426),o={"text/plain":"Text","text/html":"Url",default:"Text"};e.exports=function(e,t){var n,i,a,s,l,c,u=!1;t||(t={}),n=t.debug||!1;try{if(a=r(),s=document.createRange(),l=document.getSelection(),(c=document.createElement("span")).textContent=e,c.ariaHidden="true",c.style.all="unset",c.style.position="fixed",c.style.top=0,c.style.clip="rect(0, 0, 0, 0)",c.style.whiteSpace="pre",c.style.webkitUserSelect="text",c.style.MozUserSelect="text",c.style.msUserSelect="text",c.style.userSelect="text",c.addEventListener("copy",(function(r){if(r.stopPropagation(),t.format)if(r.preventDefault(),void 0===r.clipboardData){n&&console.warn("unable to use e.clipboardData"),n&&console.warn("trying IE specific stuff"),window.clipboardData.clearData();var i=o[t.format]||o.default;window.clipboardData.setData(i,e)}else r.clipboardData.clearData(),r.clipboardData.setData(t.format,e);t.onCopy&&(r.preventDefault(),t.onCopy(r.clipboardData))})),document.body.appendChild(c),s.selectNodeContents(c),l.addRange(s),!document.execCommand("copy"))throw new Error("copy command was unsuccessful");u=!0}catch(r){n&&console.error("unable to copy using execCommand: ",r),n&&console.warn("trying IE specific stuff");try{window.clipboardData.setData(t.format||"text",e),t.onCopy&&t.onCopy(window.clipboardData),u=!0}catch(r){n&&console.error("unable to copy using clipboardData: ",r),n&&console.error("falling back to prompt"),i=function(e){var t=(/mac os x/i.test(navigator.userAgent)?"⌘":"Ctrl")+"+C";return e.replace(/#{\s*key\s*}/g,t)}("message"in t?t.message:"Copy to clipboard: #{key}, Enter"),window.prompt(i,e)}}finally{l&&("function"==typeof l.removeRange?l.removeRange(s):l.removeAllRanges()),c&&document.body.removeChild(c),a()}return u}},4146:(e,t,n)=>{"use strict";var r=n(4363),o={childContextTypes:!0,contextType:!0,contextTypes:!0,defaultProps:!0,displayName:!0,getDefaultProps:!0,getDerivedStateFromError:!0,getDerivedStateFromProps:!0,mixins:!0,propTypes:!0,type:!0},i={name:!0,length:!0,prototype:!0,caller:!0,callee:!0,arguments:!0,arity:!0},a={$$typeof:!0,compare:!0,defaultProps:!0,displayName:!0,propTypes:!0,type:!0},s={};function l(e){return r.isMemo(e)?a:s[e.$$typeof]||o}s[r.ForwardRef]={$$typeof:!0,render:!0,defaultProps:!0,displayName:!0,propTypes:!0},s[r.Memo]=a;var c=Object.defineProperty,u=Object.getOwnPropertyNames,d=Object.getOwnPropertySymbols,h=Object.getOwnPropertyDescriptor,p=Object.getPrototypeOf,f=Object.prototype;e.exports=function e(t,n,r){if("string"!=typeof n){if(f){var o=p(n);o&&o!==f&&e(t,o,r)}var a=u(n);d&&(a=a.concat(d(n)));for(var s=l(t),m=l(n),g=0;g<a.length;++g){var y=a[g];if(!(i[y]||r&&r[y]||m&&m[y]||s&&s[y])){var b=h(n,y);try{c(t,y,b)}catch(e){}}}}return t}},9407:(e,t,n)=>{"use strict";n.d(t,{A:()=>s});var r=n(1594);
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const o=(...e)=>e.filter(((e,t,n)=>Boolean(e)&&""!==e.trim()&&n.indexOf(e)===t)).join(" ").trim();
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var i={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const a=(0,r.forwardRef)((({color:e="currentColor",size:t=24,strokeWidth:n=2,absoluteStrokeWidth:a,className:s="",children:l,iconNode:c,...u},d)=>(0,r.createElement)("svg",{ref:d,...i,width:t,height:t,stroke:e,strokeWidth:a?24*Number(n)/Number(t):n,className:o("lucide",s),...u},[...c.map((([e,t])=>(0,r.createElement)(e,t))),...Array.isArray(l)?l:[l]]))),s=(e,t)=>{const n=(0,r.forwardRef)((({className:n,...i},s)=>{return(0,r.createElement)(a,{ref:s,iconNode:t,className:o(`lucide-${l=e,l.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,n),...i});var l}));return n.displayName=`${e}`,n}},6844:(e,t,n)=>{"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(9407).A)("Activity",[["path",{d:"M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",key:"169zse"}]])},7073:(e,t,n)=>{"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(9407).A)("Brain",[["path",{d:"M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z",key:"l5xja"}],["path",{d:"M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z",key:"ep3f8r"}],["path",{d:"M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4",key:"1p4c4q"}],["path",{d:"M17.599 6.5a3 3 0 0 0 .399-1.375",key:"tmeiqw"}],["path",{d:"M6.003 5.125A3 3 0 0 0 6.401 6.5",key:"105sqy"}],["path",{d:"M3.477 10.896a4 4 0 0 1 .585-.396",key:"ql3yin"}],["path",{d:"M19.938 10.5a4 4 0 0 1 .585.396",key:"1qfode"}],["path",{d:"M6 18a4 4 0 0 1-1.967-.516",key:"2e4loj"}],["path",{d:"M19.967 17.484A4 4 0 0 1 18 18",key:"159ez6"}]])},215:(e,t,n)=>{"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(9407).A)("Bug",[["path",{d:"m8 2 1.88 1.88",key:"fmnt4t"}],["path",{d:"M14.12 3.88 16 2",key:"qol33r"}],["path",{d:"M9 7.13v-1a3.003 3.003 0 1 1 6 0v1",key:"d7y7pr"}],["path",{d:"M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6",key:"xs1cw7"}],["path",{d:"M12 20v-9",key:"1qisl0"}],["path",{d:"M6.53 9C4.6 8.8 3 7.1 3 5",key:"32zzws"}],["path",{d:"M6 13H2",key:"82j7cp"}],["path",{d:"M3 21c0-2.1 1.7-3.9 3.8-4",key:"4p0ekp"}],["path",{d:"M20.97 5c0 2.1-1.6 3.8-3.5 4",key:"18gb23"}],["path",{d:"M22 13h-4",key:"1jl80f"}],["path",{d:"M17.2 17c2.1.1 3.8 1.9 3.8 4",key:"k3fwyw"}]])},718:(e,t,n)=>{"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(9407).A)("Captions",[["rect",{width:"18",height:"14",x:"3",y:"5",rx:"2",ry:"2",key:"12ruh7"}],["path",{d:"M7 15h4M15 15h2M7 11h2M13 11h4",key:"1ueiar"}]])},5773:(e,t,n)=>{"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(9407).A)("Check",[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]])},5107:(e,t,n)=>{"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(9407).A)("ChevronDown",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]])},7677:(e,t,n)=>{"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(9407).A)("ChevronRight",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]])},7946:(e,t,n)=>{"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(9407).A)("CircleAlert",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]])},1585:(e,t,n)=>{"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(9407).A)("Eraser",[["path",{d:"m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21",key:"182aya"}],["path",{d:"M22 21H7",key:"t4ddhn"}],["path",{d:"m5 11 9 9",key:"1mo9qw"}]])},9612:(e,t,n)=>{"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(9407).A)("Image",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2",key:"1m3agn"}],["circle",{cx:"9",cy:"9",r:"2",key:"af1f0g"}],["path",{d:"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",key:"1xmnt7"}]])},9798:(e,t,n)=>{"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(9407).A)("Loader",[["path",{d:"M12 2v4",key:"3427ic"}],["path",{d:"m16.2 7.8 2.9-2.9",key:"r700ao"}],["path",{d:"M18 12h4",key:"wj9ykh"}],["path",{d:"m16.2 16.2 2.9 2.9",key:"1bxg5t"}],["path",{d:"M12 18v4",key:"jadmvz"}],["path",{d:"m4.9 19.1 2.9-2.9",key:"bwix9q"}],["path",{d:"M2 12h4",key:"j09sii"}],["path",{d:"m4.9 4.9 2.9 2.9",key:"giyufr"}]])},3324:(e,t,n)=>{"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(9407).A)("Maximize2",[["polyline",{points:"15 3 21 3 21 9",key:"mznyad"}],["polyline",{points:"9 21 3 21 3 15",key:"1avn1i"}],["line",{x1:"21",x2:"14",y1:"3",y2:"10",key:"ota7mn"}],["line",{x1:"3",x2:"10",y1:"21",y2:"14",key:"1atl0r"}]])},8614:(e,t,n)=>{"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(9407).A)("Mic",[["path",{d:"M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z",key:"131961"}],["path",{d:"M19 10v2a7 7 0 0 1-14 0v-2",key:"1vc78b"}],["line",{x1:"12",x2:"12",y1:"19",y2:"22",key:"x3vr5v"}]])},942:(e,t,n)=>{"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(9407).A)("Minimize2",[["polyline",{points:"4 14 10 14 10 20",key:"11kfnr"}],["polyline",{points:"20 10 14 10 14 4",key:"rlmsce"}],["line",{x1:"14",x2:"21",y1:"10",y2:"3",key:"o5lafz"}],["line",{x1:"3",x2:"10",y1:"21",y2:"14",key:"1atl0r"}]])},8117:(e,t,n)=>{"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(9407).A)("Paperclip",[["path",{d:"m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48",key:"1u3ebp"}]])},7611:(e,t,n)=>{"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(9407).A)("Pause",[["rect",{x:"14",y:"4",width:"4",height:"16",rx:"1",key:"zuxfzm"}],["rect",{x:"6",y:"4",width:"4",height:"16",rx:"1",key:"1okwgv"}]])},5731:(e,t,n)=>{"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(9407).A)("Play",[["polygon",{points:"6 3 20 12 6 21 6 3",key:"1oa8hb"}]])},8445:(e,t,n)=>{"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(9407).A)("Search",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]])},9500:(e,t,n)=>{"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(9407).A)("SendHorizontal",[["path",{d:"M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z",key:"117uat"}],["path",{d:"M6 12h16",key:"s4cdu5"}]])},7775:(e,t,n)=>{"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(9407).A)("Send",[["path",{d:"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",key:"1ffxy3"}],["path",{d:"m21.854 2.147-10.94 10.939",key:"12cjpa"}]])},8834:(e,t,n)=>{"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(9407).A)("Square",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}]])},2708:(e,t,n)=>{"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(9407).A)("Trash2",[["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",key:"4alrt4"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",key:"v07s0e"}],["line",{x1:"10",x2:"10",y1:"11",y2:"17",key:"1uufr5"}],["line",{x1:"14",x2:"14",y1:"11",y2:"17",key:"xtxkd"}]])},3893:(e,t,n)=>{"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(9407).A)("Users",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["path",{d:"M16 3.13a4 4 0 0 1 0 7.75",key:"1da9ce"}]])},6816:(e,t,n)=>{"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(9407).A)("Wrench",[["path",{d:"M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z",key:"cbrjhi"}]])},8697:(e,t,n)=>{"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(9407).A)("X",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]])},4809:function(e,t){var n,r,o;
/* @license
Papa Parse
v5.4.1
https://github.com/mholt/PapaParse
License: MIT
*/r=[],n=function e(){"use strict";var t="undefined"!=typeof self?self:"undefined"!=typeof window?window:void 0!==t?t:{},n=!t.document&&!!t.postMessage,r=t.IS_PAPA_WORKER||!1,o={},i=0,a={parse:function(n,r){var s=(r=r||{}).dynamicTyping||!1;if(k(s)&&(r.dynamicTypingFunction=s,s={}),r.dynamicTyping=s,r.transform=!!k(r.transform)&&r.transform,r.worker&&a.WORKERS_SUPPORTED){var l=function(){if(!a.WORKERS_SUPPORTED)return!1;var n,r,s=(n=t.URL||t.webkitURL||null,r=e.toString(),a.BLOB_URL||(a.BLOB_URL=n.createObjectURL(new Blob(["var global = (function() { if (typeof self !== 'undefined') { return self; } if (typeof window !== 'undefined') { return window; } if (typeof global !== 'undefined') { return global; } return {}; })(); global.IS_PAPA_WORKER=true; ","(",r,")();"],{type:"text/javascript"})))),l=new t.Worker(s);return l.onmessage=g,l.id=i++,o[l.id]=l}();return l.userStep=r.step,l.userChunk=r.chunk,l.userComplete=r.complete,l.userError=r.error,r.step=k(r.step),r.chunk=k(r.chunk),r.complete=k(r.complete),r.error=k(r.error),delete r.worker,void l.postMessage({input:n,config:r,workerId:l.id})}var p=null;return a.NODE_STREAM_INPUT,"string"==typeof n?(n=function(e){return 65279===e.charCodeAt(0)?e.slice(1):e}(n),p=r.download?new c(r):new d(r)):!0===n.readable&&k(n.read)&&k(n.on)?p=new h(r):(t.File&&n instanceof File||n instanceof Object)&&(p=new u(r)),p.stream(n)},unparse:function(e,t){var n=!1,r=!0,o=",",i="\r\n",s='"',l=s+s,c=!1,u=null,d=!1;!function(){if("object"==typeof t){if("string"!=typeof t.delimiter||a.BAD_DELIMITERS.filter((function(e){return-1!==t.delimiter.indexOf(e)})).length||(o=t.delimiter),("boolean"==typeof t.quotes||"function"==typeof t.quotes||Array.isArray(t.quotes))&&(n=t.quotes),"boolean"!=typeof t.skipEmptyLines&&"string"!=typeof t.skipEmptyLines||(c=t.skipEmptyLines),"string"==typeof t.newline&&(i=t.newline),"string"==typeof t.quoteChar&&(s=t.quoteChar),"boolean"==typeof t.header&&(r=t.header),Array.isArray(t.columns)){if(0===t.columns.length)throw new Error("Option columns is empty");u=t.columns}void 0!==t.escapeChar&&(l=t.escapeChar+s),("boolean"==typeof t.escapeFormulae||t.escapeFormulae instanceof RegExp)&&(d=t.escapeFormulae instanceof RegExp?t.escapeFormulae:/^[=+\-@\t\r].*$/)}}();var h=new RegExp(f(s),"g");if("string"==typeof e&&(e=JSON.parse(e)),Array.isArray(e)){if(!e.length||Array.isArray(e[0]))return p(null,e,c);if("object"==typeof e[0])return p(u||Object.keys(e[0]),e,c)}else if("object"==typeof e)return"string"==typeof e.data&&(e.data=JSON.parse(e.data)),Array.isArray(e.data)&&(e.fields||(e.fields=e.meta&&e.meta.fields||u),e.fields||(e.fields=Array.isArray(e.data[0])?e.fields:"object"==typeof e.data[0]?Object.keys(e.data[0]):[]),Array.isArray(e.data[0])||"object"==typeof e.data[0]||(e.data=[e.data])),p(e.fields||[],e.data||[],c);throw new Error("Unable to serialize unrecognized input");function p(e,t,n){var a="";"string"==typeof e&&(e=JSON.parse(e)),"string"==typeof t&&(t=JSON.parse(t));var s=Array.isArray(e)&&0<e.length,l=!Array.isArray(t[0]);if(s&&r){for(var c=0;c<e.length;c++)0<c&&(a+=o),a+=m(e[c],c);0<t.length&&(a+=i)}for(var u=0;u<t.length;u++){var d=s?e.length:t[u].length,h=!1,p=s?0===Object.keys(t[u]).length:0===t[u].length;if(n&&!s&&(h="greedy"===n?""===t[u].join("").trim():1===t[u].length&&0===t[u][0].length),"greedy"===n&&s){for(var f=[],g=0;g<d;g++){var y=l?e[g]:g;f.push(t[u][y])}h=""===f.join("").trim()}if(!h){for(var b=0;b<d;b++){0<b&&!p&&(a+=o);var v=s&&l?e[b]:b;a+=m(t[u][v],b)}u<t.length-1&&(!n||0<d&&!p)&&(a+=i)}}return a}function m(e,t){if(null==e)return"";if(e.constructor===Date)return JSON.stringify(e).slice(1,25);var r=!1;d&&"string"==typeof e&&d.test(e)&&(e="'"+e,r=!0);var i=e.toString().replace(h,l);return(r=r||!0===n||"function"==typeof n&&n(e,t)||Array.isArray(n)&&n[t]||function(e,t){for(var n=0;n<t.length;n++)if(-1<e.indexOf(t[n]))return!0;return!1}(i,a.BAD_DELIMITERS)||-1<i.indexOf(o)||" "===i.charAt(0)||" "===i.charAt(i.length-1))?s+i+s:i}}};if(a.RECORD_SEP=String.fromCharCode(30),a.UNIT_SEP=String.fromCharCode(31),a.BYTE_ORDER_MARK="\ufeff",a.BAD_DELIMITERS=["\r","\n",'"',a.BYTE_ORDER_MARK],a.WORKERS_SUPPORTED=!n&&!!t.Worker,a.NODE_STREAM_INPUT=1,a.LocalChunkSize=10485760,a.RemoteChunkSize=5242880,a.DefaultDelimiter=",",a.Parser=m,a.ParserHandle=p,a.NetworkStreamer=c,a.FileStreamer=u,a.StringStreamer=d,a.ReadableStreamStreamer=h,t.jQuery){var s=t.jQuery;s.fn.parse=function(e){var n=e.config||{},r=[];return this.each((function(e){if("INPUT"!==s(this).prop("tagName").toUpperCase()||"file"!==s(this).attr("type").toLowerCase()||!t.FileReader||!this.files||0===this.files.length)return!0;for(var o=0;o<this.files.length;o++)r.push({file:this.files[o],inputElem:this,instanceConfig:s.extend({},n)})})),o(),this;function o(){if(0!==r.length){var t,n,o,l,c=r[0];if(k(e.before)){var u=e.before(c.file,c.inputElem);if("object"==typeof u){if("abort"===u.action)return t="AbortError",n=c.file,o=c.inputElem,l=u.reason,void(k(e.error)&&e.error({name:t},n,o,l));if("skip"===u.action)return void i();"object"==typeof u.config&&(c.instanceConfig=s.extend(c.instanceConfig,u.config))}else if("skip"===u)return void i()}var d=c.instanceConfig.complete;c.instanceConfig.complete=function(e){k(d)&&d(e,c.file,c.inputElem),i()},a.parse(c.file,c.instanceConfig)}else k(e.complete)&&e.complete()}function i(){r.splice(0,1),o()}}}function l(e){this._handle=null,this._finished=!1,this._completed=!1,this._halted=!1,this._input=null,this._baseIndex=0,this._partialLine="",this._rowCount=0,this._start=0,this._nextChunk=null,this.isFirstChunk=!0,this._completeResults={data:[],errors:[],meta:{}},function(e){var t=v(e);t.chunkSize=parseInt(t.chunkSize),e.step||e.chunk||(t.chunkSize=null),this._handle=new p(t),(this._handle.streamer=this)._config=t}.call(this,e),this.parseChunk=function(e,n){if(this.isFirstChunk&&k(this._config.beforeFirstChunk)){var o=this._config.beforeFirstChunk(e);void 0!==o&&(e=o)}this.isFirstChunk=!1,this._halted=!1;var i=this._partialLine+e;this._partialLine="";var s=this._handle.parse(i,this._baseIndex,!this._finished);if(!this._handle.paused()&&!this._handle.aborted()){var l=s.meta.cursor;this._finished||(this._partialLine=i.substring(l-this._baseIndex),this._baseIndex=l),s&&s.data&&(this._rowCount+=s.data.length);var c=this._finished||this._config.preview&&this._rowCount>=this._config.preview;if(r)t.postMessage({results:s,workerId:a.WORKER_ID,finished:c});else if(k(this._config.chunk)&&!n){if(this._config.chunk(s,this._handle),this._handle.paused()||this._handle.aborted())return void(this._halted=!0);s=void 0,this._completeResults=void 0}return this._config.step||this._config.chunk||(this._completeResults.data=this._completeResults.data.concat(s.data),this._completeResults.errors=this._completeResults.errors.concat(s.errors),this._completeResults.meta=s.meta),this._completed||!c||!k(this._config.complete)||s&&s.meta.aborted||(this._config.complete(this._completeResults,this._input),this._completed=!0),c||s&&s.meta.paused||this._nextChunk(),s}this._halted=!0},this._sendError=function(e){k(this._config.error)?this._config.error(e):r&&this._config.error&&t.postMessage({workerId:a.WORKER_ID,error:e,finished:!1})}}function c(e){var t;(e=e||{}).chunkSize||(e.chunkSize=a.RemoteChunkSize),l.call(this,e),this._nextChunk=n?function(){this._readChunk(),this._chunkLoaded()}:function(){this._readChunk()},this.stream=function(e){this._input=e,this._nextChunk()},this._readChunk=function(){if(this._finished)this._chunkLoaded();else{if(t=new XMLHttpRequest,this._config.withCredentials&&(t.withCredentials=this._config.withCredentials),n||(t.onload=x(this._chunkLoaded,this),t.onerror=x(this._chunkError,this)),t.open(this._config.downloadRequestBody?"POST":"GET",this._input,!n),this._config.downloadRequestHeaders){var e=this._config.downloadRequestHeaders;for(var r in e)t.setRequestHeader(r,e[r])}if(this._config.chunkSize){var o=this._start+this._config.chunkSize-1;t.setRequestHeader("Range","bytes="+this._start+"-"+o)}try{t.send(this._config.downloadRequestBody)}catch(e){this._chunkError(e.message)}n&&0===t.status&&this._chunkError()}},this._chunkLoaded=function(){4===t.readyState&&(t.status<200||400<=t.status?this._chunkError():(this._start+=this._config.chunkSize?this._config.chunkSize:t.responseText.length,this._finished=!this._config.chunkSize||this._start>=function(e){var t=e.getResponseHeader("Content-Range");return null===t?-1:parseInt(t.substring(t.lastIndexOf("/")+1))}(t),this.parseChunk(t.responseText)))},this._chunkError=function(e){var n=t.statusText||e;this._sendError(new Error(n))}}function u(e){var t,n;(e=e||{}).chunkSize||(e.chunkSize=a.LocalChunkSize),l.call(this,e);var r="undefined"!=typeof FileReader;this.stream=function(e){this._input=e,n=e.slice||e.webkitSlice||e.mozSlice,r?((t=new FileReader).onload=x(this._chunkLoaded,this),t.onerror=x(this._chunkError,this)):t=new FileReaderSync,this._nextChunk()},this._nextChunk=function(){this._finished||this._config.preview&&!(this._rowCount<this._config.preview)||this._readChunk()},this._readChunk=function(){var e=this._input;if(this._config.chunkSize){var o=Math.min(this._start+this._config.chunkSize,this._input.size);e=n.call(e,this._start,o)}var i=t.readAsText(e,this._config.encoding);r||this._chunkLoaded({target:{result:i}})},this._chunkLoaded=function(e){this._start+=this._config.chunkSize,this._finished=!this._config.chunkSize||this._start>=this._input.size,this.parseChunk(e.target.result)},this._chunkError=function(){this._sendError(t.error)}}function d(e){var t;l.call(this,e=e||{}),this.stream=function(e){return t=e,this._nextChunk()},this._nextChunk=function(){if(!this._finished){var e,n=this._config.chunkSize;return n?(e=t.substring(0,n),t=t.substring(n)):(e=t,t=""),this._finished=!t,this.parseChunk(e)}}}function h(e){l.call(this,e=e||{});var t=[],n=!0,r=!1;this.pause=function(){l.prototype.pause.apply(this,arguments),this._input.pause()},this.resume=function(){l.prototype.resume.apply(this,arguments),this._input.resume()},this.stream=function(e){this._input=e,this._input.on("data",this._streamData),this._input.on("end",this._streamEnd),this._input.on("error",this._streamError)},this._checkIsFinished=function(){r&&1===t.length&&(this._finished=!0)},this._nextChunk=function(){this._checkIsFinished(),t.length?this.parseChunk(t.shift()):n=!0},this._streamData=x((function(e){try{t.push("string"==typeof e?e:e.toString(this._config.encoding)),n&&(n=!1,this._checkIsFinished(),this.parseChunk(t.shift()))}catch(e){this._streamError(e)}}),this),this._streamError=x((function(e){this._streamCleanUp(),this._sendError(e)}),this),this._streamEnd=x((function(){this._streamCleanUp(),r=!0,this._streamData("")}),this),this._streamCleanUp=x((function(){this._input.removeListener("data",this._streamData),this._input.removeListener("end",this._streamEnd),this._input.removeListener("error",this._streamError)}),this)}function p(e){var t,n,r,o=Math.pow(2,53),i=-o,s=/^\s*-?(\d+\.?|\.\d+|\d+\.\d+)([eE][-+]?\d+)?\s*$/,l=/^((\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z)))$/,c=this,u=0,d=0,h=!1,p=!1,g=[],y={data:[],errors:[],meta:{}};if(k(e.step)){var b=e.step;e.step=function(t){if(y=t,_())w();else{if(w(),0===y.data.length)return;u+=t.data.length,e.preview&&u>e.preview?n.abort():(y.data=y.data[0],b(y,c))}}}function x(t){return"greedy"===e.skipEmptyLines?""===t.join("").trim():1===t.length&&0===t[0].length}function w(){return y&&r&&(E("Delimiter","UndetectableDelimiter","Unable to auto-detect delimiting character; defaulted to '"+a.DefaultDelimiter+"'"),r=!1),e.skipEmptyLines&&(y.data=y.data.filter((function(e){return!x(e)}))),_()&&function(){if(y)if(Array.isArray(y.data[0])){for(var t=0;_()&&t<y.data.length;t++)y.data[t].forEach(n);y.data.splice(0,1)}else y.data.forEach(n);function n(t,n){k(e.transformHeader)&&(t=e.transformHeader(t,n)),g.push(t)}}(),function(){if(!y||!e.header&&!e.dynamicTyping&&!e.transform)return y;function t(t,n){var r,o=e.header?{}:[];for(r=0;r<t.length;r++){var i=r,a=t[r];e.header&&(i=r>=g.length?"__parsed_extra":g[r]),e.transform&&(a=e.transform(a,i)),a=S(i,a),"__parsed_extra"===i?(o[i]=o[i]||[],o[i].push(a)):o[i]=a}return e.header&&(r>g.length?E("FieldMismatch","TooManyFields","Too many fields: expected "+g.length+" fields but parsed "+r,d+n):r<g.length&&E("FieldMismatch","TooFewFields","Too few fields: expected "+g.length+" fields but parsed "+r,d+n)),o}var n=1;return!y.data.length||Array.isArray(y.data[0])?(y.data=y.data.map(t),n=y.data.length):y.data=t(y.data,0),e.header&&y.meta&&(y.meta.fields=g),d+=n,y}()}function _(){return e.header&&0===g.length}function S(t,n){return r=t,e.dynamicTypingFunction&&void 0===e.dynamicTyping[r]&&(e.dynamicTyping[r]=e.dynamicTypingFunction(r)),!0===(e.dynamicTyping[r]||e.dynamicTyping)?"true"===n||"TRUE"===n||"false"!==n&&"FALSE"!==n&&(function(e){if(s.test(e)){var t=parseFloat(e);if(i<t&&t<o)return!0}return!1}(n)?parseFloat(n):l.test(n)?new Date(n):""===n?null:n):n;var r}function E(e,t,n,r){var o={type:e,code:t,message:n};void 0!==r&&(o.row=r),y.errors.push(o)}this.parse=function(o,i,s){var l=e.quoteChar||'"';if(e.newline||(e.newline=function(e,t){e=e.substring(0,1048576);var n=new RegExp(f(t)+"([^]*?)"+f(t),"gm"),r=(e=e.replace(n,"")).split("\r"),o=e.split("\n"),i=1<o.length&&o[0].length<r[0].length;if(1===r.length||i)return"\n";for(var a=0,s=0;s<r.length;s++)"\n"===r[s][0]&&a++;return a>=r.length/2?"\r\n":"\r"}(o,l)),r=!1,e.delimiter)k(e.delimiter)&&(e.delimiter=e.delimiter(o),y.meta.delimiter=e.delimiter);else{var c=function(t,n,r,o,i){var s,l,c,u;i=i||[",","\t","|",";",a.RECORD_SEP,a.UNIT_SEP];for(var d=0;d<i.length;d++){var h=i[d],p=0,f=0,g=0;c=void 0;for(var y=new m({comments:o,delimiter:h,newline:n,preview:10}).parse(t),b=0;b<y.data.length;b++)if(r&&x(y.data[b]))g++;else{var v=y.data[b].length;f+=v,void 0!==c?0<v&&(p+=Math.abs(v-c),c=v):c=v}0<y.data.length&&(f/=y.data.length-g),(void 0===l||p<=l)&&(void 0===u||u<f)&&1.99<f&&(l=p,s=h,u=f)}return{successful:!!(e.delimiter=s),bestDelimiter:s}}(o,e.newline,e.skipEmptyLines,e.comments,e.delimitersToGuess);c.successful?e.delimiter=c.bestDelimiter:(r=!0,e.delimiter=a.DefaultDelimiter),y.meta.delimiter=e.delimiter}var u=v(e);return e.preview&&e.header&&u.preview++,t=o,n=new m(u),y=n.parse(t,i,s),w(),h?{meta:{paused:!0}}:y||{meta:{paused:!1}}},this.paused=function(){return h},this.pause=function(){h=!0,n.abort(),t=k(e.chunk)?"":t.substring(n.getCharIndex())},this.resume=function(){c.streamer._halted?(h=!1,c.streamer.parseChunk(t,!0)):setTimeout(c.resume,3)},this.aborted=function(){return p},this.abort=function(){p=!0,n.abort(),y.meta.aborted=!0,k(e.complete)&&e.complete(y),t=""}}function f(e){return e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function m(e){var t,n=(e=e||{}).delimiter,r=e.newline,o=e.comments,i=e.step,s=e.preview,l=e.fastMode,c=t=void 0===e.quoteChar||null===e.quoteChar?'"':e.quoteChar;if(void 0!==e.escapeChar&&(c=e.escapeChar),("string"!=typeof n||-1<a.BAD_DELIMITERS.indexOf(n))&&(n=","),o===n)throw new Error("Comment character same as delimiter");!0===o?o="#":("string"!=typeof o||-1<a.BAD_DELIMITERS.indexOf(o))&&(o=!1),"\n"!==r&&"\r"!==r&&"\r\n"!==r&&(r="\n");var u=0,d=!1;this.parse=function(a,h,p){if("string"!=typeof a)throw new Error("Input must be a string");var m=a.length,g=n.length,y=r.length,b=o.length,v=k(i),x=[],w=[],_=[],S=u=0;if(!a)return V();if(e.header&&!h){var E=a.split(r)[0].split(n),C=[],A={},O=!1;for(var M in E){var R=E[M];k(e.transformHeader)&&(R=e.transformHeader(R,M));var P=R,T=A[R]||0;for(0<T&&(O=!0,P=R+"_"+T),A[R]=T+1;C.includes(P);)P=P+"_"+T;C.push(P)}if(O){var z=a.split(r);z[0]=C.join(n),a=z.join(r)}}if(l||!1!==l&&-1===a.indexOf(t)){for(var j=a.split(r),I=0;I<j.length;I++){if(_=j[I],u+=_.length,I!==j.length-1)u+=r.length;else if(p)return V();if(!o||_.substring(0,b)!==o){if(v){if(x=[],W(_.split(n)),K(),d)return V()}else W(_.split(n));if(s&&s<=I)return x=x.slice(0,s),V(!0)}}return V()}for(var N=a.indexOf(n,u),$=a.indexOf(r,u),L=new RegExp(f(c)+f(t),"g"),D=a.indexOf(t,u);;)if(a[u]!==t)if(o&&0===_.length&&a.substring(u,u+b)===o){if(-1===$)return V();u=$+y,$=a.indexOf(r,u),N=a.indexOf(n,u)}else if(-1!==N&&(N<$||-1===$))_.push(a.substring(u,N)),u=N+g,N=a.indexOf(n,u);else{if(-1===$)break;if(_.push(a.substring(u,$)),U($+y),v&&(K(),d))return V();if(s&&x.length>=s)return V(!0)}else for(D=u,u++;;){if(-1===(D=a.indexOf(t,D+1)))return p||w.push({type:"Quotes",code:"MissingQuotes",message:"Quoted field unterminated",row:x.length,index:u}),q();if(D===m-1)return q(a.substring(u,D).replace(L,t));if(t!==c||a[D+1]!==c){if(t===c||0===D||a[D-1]!==c){-1!==N&&N<D+1&&(N=a.indexOf(n,D+1)),-1!==$&&$<D+1&&($=a.indexOf(r,D+1));var F=H(-1===$?N:Math.min(N,$));if(a.substr(D+1+F,g)===n){_.push(a.substring(u,D).replace(L,t)),a[u=D+1+F+g]!==t&&(D=a.indexOf(t,u)),N=a.indexOf(n,u),$=a.indexOf(r,u);break}var B=H($);if(a.substring(D+1+B,D+1+B+y)===r){if(_.push(a.substring(u,D).replace(L,t)),U(D+1+B+y),N=a.indexOf(n,u),D=a.indexOf(t,u),v&&(K(),d))return V();if(s&&x.length>=s)return V(!0);break}w.push({type:"Quotes",code:"InvalidQuotes",message:"Trailing quote on quoted field is malformed",row:x.length,index:u}),D++}}else D++}return q();function W(e){x.push(e),S=u}function H(e){var t=0;if(-1!==e){var n=a.substring(D+1,e);n&&""===n.trim()&&(t=n.length)}return t}function q(e){return p||(void 0===e&&(e=a.substring(u)),_.push(e),u=m,W(_),v&&K()),V()}function U(e){u=e,W(_),_=[],$=a.indexOf(r,u)}function V(e){return{data:x,errors:w,meta:{delimiter:n,linebreak:r,aborted:d,truncated:!!e,cursor:S+(h||0)}}}function K(){i(V()),x=[],w=[]}},this.abort=function(){d=!0},this.getCharIndex=function(){return u}}function g(e){var t=e.data,n=o[t.workerId],r=!1;if(t.error)n.userError(t.error,t.file);else if(t.results&&t.results.data){var i={abort:function(){r=!0,y(t.workerId,{data:[],errors:[],meta:{aborted:!0}})},pause:b,resume:b};if(k(n.userStep)){for(var a=0;a<t.results.data.length&&(n.userStep({data:t.results.data[a],errors:t.results.errors,meta:t.results.meta},i),!r);a++);delete t.results}else k(n.userChunk)&&(n.userChunk(t.results,i,t.file),delete t.results)}t.finished&&!r&&y(t.workerId,t.results)}function y(e,t){var n=o[e];k(n.userComplete)&&n.userComplete(t),n.terminate(),delete o[e]}function b(){throw new Error("Not implemented.")}function v(e){if("object"!=typeof e||null===e)return e;var t=Array.isArray(e)?[]:{};for(var n in e)t[n]=v(e[n]);return t}function x(e,t){return function(){e.apply(t,arguments)}}function k(e){return"function"==typeof e}return r&&(t.onmessage=function(e){var n=e.data;if(void 0===a.WORKER_ID&&n&&(a.WORKER_ID=n.workerId),"string"==typeof n.input)t.postMessage({workerId:a.WORKER_ID,results:a.parse(n.input,n.config),finished:!0});else if(t.File&&n.input instanceof File||n.input instanceof Object){var r=a.parse(n.input,n.config);r&&t.postMessage({workerId:a.WORKER_ID,results:r,finished:!0})}}),(c.prototype=Object.create(l.prototype)).constructor=c,(u.prototype=Object.create(l.prototype)).constructor=u,(d.prototype=Object.create(d.prototype)).constructor=d,(h.prototype=Object.create(l.prototype)).constructor=h,a},void 0===(o="function"==typeof n?n.apply(t,r):n)||(e.exports=o)},2799:(e,t)=>{"use strict";
/** @license React v16.13.1
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var n="function"==typeof Symbol&&Symbol.for,r=n?Symbol.for("react.element"):60103,o=n?Symbol.for("react.portal"):60106,i=n?Symbol.for("react.fragment"):60107,a=n?Symbol.for("react.strict_mode"):60108,s=n?Symbol.for("react.profiler"):60114,l=n?Symbol.for("react.provider"):60109,c=n?Symbol.for("react.context"):60110,u=n?Symbol.for("react.async_mode"):60111,d=n?Symbol.for("react.concurrent_mode"):60111,h=n?Symbol.for("react.forward_ref"):60112,p=n?Symbol.for("react.suspense"):60113,f=n?Symbol.for("react.suspense_list"):60120,m=n?Symbol.for("react.memo"):60115,g=n?Symbol.for("react.lazy"):60116,y=n?Symbol.for("react.block"):60121,b=n?Symbol.for("react.fundamental"):60117,v=n?Symbol.for("react.responder"):60118,x=n?Symbol.for("react.scope"):60119;function k(e){if("object"==typeof e&&null!==e){var t=e.$$typeof;switch(t){case r:switch(e=e.type){case u:case d:case i:case s:case a:case p:return e;default:switch(e=e&&e.$$typeof){case c:case h:case g:case m:case l:return e;default:return t}}case o:return t}}}function w(e){return k(e)===d}t.AsyncMode=u,t.ConcurrentMode=d,t.ContextConsumer=c,t.ContextProvider=l,t.Element=r,t.ForwardRef=h,t.Fragment=i,t.Lazy=g,t.Memo=m,t.Portal=o,t.Profiler=s,t.StrictMode=a,t.Suspense=p,t.isAsyncMode=function(e){return w(e)||k(e)===u},t.isConcurrentMode=w,t.isContextConsumer=function(e){return k(e)===c},t.isContextProvider=function(e){return k(e)===l},t.isElement=function(e){return"object"==typeof e&&null!==e&&e.$$typeof===r},t.isForwardRef=function(e){return k(e)===h},t.isFragment=function(e){return k(e)===i},t.isLazy=function(e){return k(e)===g},t.isMemo=function(e){return k(e)===m},t.isPortal=function(e){return k(e)===o},t.isProfiler=function(e){return k(e)===s},t.isStrictMode=function(e){return k(e)===a},t.isSuspense=function(e){return k(e)===p},t.isValidElementType=function(e){return"string"==typeof e||"function"==typeof e||e===i||e===d||e===s||e===a||e===p||e===f||"object"==typeof e&&null!==e&&(e.$$typeof===g||e.$$typeof===m||e.$$typeof===l||e.$$typeof===c||e.$$typeof===h||e.$$typeof===b||e.$$typeof===v||e.$$typeof===x||e.$$typeof===y)},t.typeOf=k},4363:(e,t,n)=>{"use strict";e.exports=n(2799)},2192:(e,t,n)=>{"use strict";function r(){return r=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},r.apply(this,arguments)}n.d(t,{A:()=>v});var o=n(1594);const i=o.useLayoutEffect;var a=function(e,t){"function"!=typeof e?e.current=t:e(t)};const s=function(e,t){var n=(0,o.useRef)();return(0,o.useCallback)((function(r){e.current=r,n.current&&a(n.current,null),n.current=t,t&&a(t,r)}),[t])};var l={"min-height":"0","max-height":"none",height:"0",visibility:"hidden",overflow:"hidden",position:"absolute","z-index":"-1000",top:"0",right:"0"},c=function(e){Object.keys(l).forEach((function(t){e.style.setProperty(t,l[t],"important")}))},u=null,d=function(e,t){var n=e.scrollHeight;return"border-box"===t.sizingStyle.boxSizing?n+t.borderSize:n-t.paddingSize};var h=function(){},p=["borderBottomWidth","borderLeftWidth","borderRightWidth","borderTopWidth","boxSizing","fontFamily","fontSize","fontStyle","fontWeight","letterSpacing","lineHeight","paddingBottom","paddingLeft","paddingRight","paddingTop","tabSize","textIndent","textRendering","textTransform","width","wordBreak"],f=!!document.documentElement.currentStyle,m=function(e){var t=window.getComputedStyle(e);if(null===t)return null;var n,r=(n=t,p.reduce((function(e,t){return e[t]=n[t],e}),{})),o=r.boxSizing;return""===o?null:(f&&"border-box"===o&&(r.width=parseFloat(r.width)+parseFloat(r.borderRightWidth)+parseFloat(r.borderLeftWidth)+parseFloat(r.paddingRight)+parseFloat(r.paddingLeft)+"px"),{sizingStyle:r,paddingSize:parseFloat(r.paddingBottom)+parseFloat(r.paddingTop),borderSize:parseFloat(r.borderBottomWidth)+parseFloat(r.borderTopWidth)})};function g(e,t,n){var r,a,s=(r=n,a=o.useRef(r),i((function(){a.current=r})),a);o.useLayoutEffect((function(){var n=function(e){return s.current(e)};if(e)return e.addEventListener(t,n),function(){return e.removeEventListener(t,n)}}),[])}var y=["cacheMeasurements","maxRows","minRows","onChange","onHeightChange"],b=function(e,t){var n=e.cacheMeasurements,i=e.maxRows,a=e.minRows,l=e.onChange,p=void 0===l?h:l,f=e.onHeightChange,b=void 0===f?h:f,v=function(e,t){if(null==e)return{};var n,r,o={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,y),x=void 0!==v.value,k=o.useRef(null),w=s(k,t),_=o.useRef(0),S=o.useRef(),E=function(){var e=k.current,t=n&&S.current?S.current:m(e);if(t){S.current=t;var r=function(e,t,n,r){void 0===n&&(n=1),void 0===r&&(r=1/0),u||((u=document.createElement("textarea")).setAttribute("tabindex","-1"),u.setAttribute("aria-hidden","true"),c(u)),null===u.parentNode&&document.body.appendChild(u);var o=e.paddingSize,i=e.borderSize,a=e.sizingStyle,s=a.boxSizing;Object.keys(a).forEach((function(e){var t=e;u.style[t]=a[t]})),c(u),u.value=t;var l=d(u,e);u.value=t,l=d(u,e),u.value="x";var h=u.scrollHeight-o,p=h*n;"border-box"===s&&(p=p+o+i),l=Math.max(p,l);var f=h*r;return"border-box"===s&&(f=f+o+i),[l=Math.min(f,l),h]}(t,e.value||e.placeholder||"x",a,i),o=r[0],s=r[1];_.current!==o&&(_.current=o,e.style.setProperty("height",o+"px","important"),b(o,{rowHeight:s}))}};return o.useLayoutEffect(E),g(window,"resize",E),function(e){g(document.fonts,"loadingdone",e)}(E),o.createElement("textarea",r({},v,{onChange:function(e){x||E(),p(e)},ref:w}))},v=o.forwardRef(b)},1020:(e,t,n)=>{"use strict";
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var r=n(1594),o=Symbol.for("react.element"),i=Symbol.for("react.fragment"),a=Object.prototype.hasOwnProperty,s=r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,l={key:!0,ref:!0,__self:!0,__source:!0};function c(e,t,n){var r,i={},c=null,u=null;for(r in void 0!==n&&(c=""+n),void 0!==t.key&&(c=""+t.key),void 0!==t.ref&&(u=t.ref),t)a.call(t,r)&&!l.hasOwnProperty(r)&&(i[r]=t[r]);if(e&&e.defaultProps)for(r in t=e.defaultProps)void 0===i[r]&&(i[r]=t[r]);return{$$typeof:o,type:e,key:c,ref:u,props:i,_owner:s.current}}t.Fragment=i,t.jsx=c,t.jsxs=c},4848:(e,t,n)=>{"use strict";e.exports=n(1020)},2833:e=>{e.exports=function(e,t,n,r){var o=n?n.call(r,e,t):void 0;if(void 0!==o)return!!o;if(e===t)return!0;if("object"!=typeof e||!e||"object"!=typeof t||!t)return!1;var i=Object.keys(e),a=Object.keys(t);if(i.length!==a.length)return!1;for(var s=Object.prototype.hasOwnProperty.bind(t),l=0;l<i.length;l++){var c=i[l];if(!s(c))return!1;var u=e[c],d=t[c];if(!1===(o=n?n.call(r,u,d,c):void 0)||void 0===o&&u!==d)return!1}return!0}},3185:(e,t,n)=>{"use strict";n.d(t,{DU:()=>Jt,Ay:()=>Xt});var r=function(){return r=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var o in t=arguments[n])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e},r.apply(this,arguments)};Object.create;function o(e,t,n){if(n||2===arguments.length)for(var r,o=0,i=t.length;o<i;o++)!r&&o in t||(r||(r=Array.prototype.slice.call(t,0,o)),r[o]=t[o]);return e.concat(r||Array.prototype.slice.call(t))}Object.create;"function"==typeof SuppressedError&&SuppressedError;var i=n(1594),a=n.n(i),s=n(2833),l=n.n(s),c="-ms-",u="-moz-",d="-webkit-",h="comm",p="rule",f="decl",m="@import",g="@keyframes",y="@layer",b=Math.abs,v=String.fromCharCode,x=Object.assign;function k(e){return e.trim()}function w(e,t){return(e=t.exec(e))?e[0]:e}function _(e,t,n){return e.replace(t,n)}function S(e,t,n){return e.indexOf(t,n)}function E(e,t){return 0|e.charCodeAt(t)}function C(e,t,n){return e.slice(t,n)}function A(e){return e.length}function O(e){return e.length}function M(e,t){return t.push(e),e}function R(e,t){return e.filter((function(e){return!w(e,t)}))}var P=1,T=1,z=0,j=0,I=0,N="";function $(e,t,n,r,o,i,a,s){return{value:e,root:t,parent:n,type:r,props:o,children:i,line:P,column:T,length:a,return:"",siblings:s}}function L(e,t){return x($("",null,null,"",null,null,0,e.siblings),e,{length:-e.length},t)}function D(e){for(;e.root;)e=L(e.root,{children:[e]});M(e,e.siblings)}function F(){return I=j>0?E(N,--j):0,T--,10===I&&(T=1,P--),I}function B(){return I=j<z?E(N,j++):0,T++,10===I&&(T=1,P++),I}function W(){return E(N,j)}function H(){return j}function q(e,t){return C(N,e,t)}function U(e){switch(e){case 0:case 9:case 10:case 13:case 32:return 5;case 33:case 43:case 44:case 47:case 62:case 64:case 126:case 59:case 123:case 125:return 4;case 58:return 3;case 34:case 39:case 40:case 91:return 2;case 41:case 93:return 1}return 0}function V(e){return P=T=1,z=A(N=e),j=0,[]}function K(e){return N="",e}function Q(e){return k(q(j-1,X(91===e?e+2:40===e?e+1:e)))}function Y(e){for(;(I=W())&&I<33;)B();return U(e)>2||U(I)>3?"":" "}function G(e,t){for(;--t&&B()&&!(I<48||I>102||I>57&&I<65||I>70&&I<97););return q(e,H()+(t<6&&32==W()&&32==B()))}function X(e){for(;B();)switch(I){case e:return j;case 34:case 39:34!==e&&39!==e&&X(I);break;case 40:41===e&&X(e);break;case 92:B()}return j}function Z(e,t){for(;B()&&e+I!==57&&(e+I!==84||47!==W()););return"/*"+q(t,j-1)+"*"+v(47===e?e:B())}function J(e){for(;!U(W());)B();return q(e,j)}function ee(e,t){for(var n="",r=0;r<e.length;r++)n+=t(e[r],r,e,t)||"";return n}function te(e,t,n,r){switch(e.type){case y:if(e.children.length)break;case m:case f:return e.return=e.return||e.value;case h:return"";case g:return e.return=e.value+"{"+ee(e.children,r)+"}";case p:if(!A(e.value=e.props.join(",")))return""}return A(n=ee(e.children,r))?e.return=e.value+"{"+n+"}":""}function ne(e,t,n){switch(function(e,t){return 45^E(e,0)?(((t<<2^E(e,0))<<2^E(e,1))<<2^E(e,2))<<2^E(e,3):0}(e,t)){case 5103:return d+"print-"+e+e;case 5737:case 4201:case 3177:case 3433:case 1641:case 4457:case 2921:case 5572:case 6356:case 5844:case 3191:case 6645:case 3005:case 6391:case 5879:case 5623:case 6135:case 4599:case 4855:case 4215:case 6389:case 5109:case 5365:case 5621:case 3829:return d+e+e;case 4789:return u+e+e;case 5349:case 4246:case 4810:case 6968:case 2756:return d+e+u+e+c+e+e;case 5936:switch(E(e,t+11)){case 114:return d+e+c+_(e,/[svh]\w+-[tblr]{2}/,"tb")+e;case 108:return d+e+c+_(e,/[svh]\w+-[tblr]{2}/,"tb-rl")+e;case 45:return d+e+c+_(e,/[svh]\w+-[tblr]{2}/,"lr")+e}case 6828:case 4268:case 2903:return d+e+c+e+e;case 6165:return d+e+c+"flex-"+e+e;case 5187:return d+e+_(e,/(\w+).+(:[^]+)/,d+"box-$1$2"+c+"flex-$1$2")+e;case 5443:return d+e+c+"flex-item-"+_(e,/flex-|-self/g,"")+(w(e,/flex-|baseline/)?"":c+"grid-row-"+_(e,/flex-|-self/g,""))+e;case 4675:return d+e+c+"flex-line-pack"+_(e,/align-content|flex-|-self/g,"")+e;case 5548:return d+e+c+_(e,"shrink","negative")+e;case 5292:return d+e+c+_(e,"basis","preferred-size")+e;case 6060:return d+"box-"+_(e,"-grow","")+d+e+c+_(e,"grow","positive")+e;case 4554:return d+_(e,/([^-])(transform)/g,"$1"+d+"$2")+e;case 6187:return _(_(_(e,/(zoom-|grab)/,d+"$1"),/(image-set)/,d+"$1"),e,"")+e;case 5495:case 3959:return _(e,/(image-set\([^]*)/,d+"$1$`$1");case 4968:return _(_(e,/(.+:)(flex-)?(.*)/,d+"box-pack:$3"+c+"flex-pack:$3"),/s.+-b[^;]+/,"justify")+d+e+e;case 4200:if(!w(e,/flex-|baseline/))return c+"grid-column-align"+C(e,t)+e;break;case 2592:case 3360:return c+_(e,"template-","")+e;case 4384:case 3616:return n&&n.some((function(e,n){return t=n,w(e.props,/grid-\w+-end/)}))?~S(e+(n=n[t].value),"span",0)?e:c+_(e,"-start","")+e+c+"grid-row-span:"+(~S(n,"span",0)?w(n,/\d+/):+w(n,/\d+/)-+w(e,/\d+/))+";":c+_(e,"-start","")+e;case 4896:case 4128:return n&&n.some((function(e){return w(e.props,/grid-\w+-start/)}))?e:c+_(_(e,"-end","-span"),"span ","")+e;case 4095:case 3583:case 4068:case 2532:return _(e,/(.+)-inline(.+)/,d+"$1$2")+e;case 8116:case 7059:case 5753:case 5535:case 5445:case 5701:case 4933:case 4677:case 5533:case 5789:case 5021:case 4765:if(A(e)-1-t>6)switch(E(e,t+1)){case 109:if(45!==E(e,t+4))break;case 102:return _(e,/(.+:)(.+)-([^]+)/,"$1"+d+"$2-$3$1"+u+(108==E(e,t+3)?"$3":"$2-$3"))+e;case 115:return~S(e,"stretch",0)?ne(_(e,"stretch","fill-available"),t,n)+e:e}break;case 5152:case 5920:return _(e,/(.+?):(\d+)(\s*\/\s*(span)?\s*(\d+))?(.*)/,(function(t,n,r,o,i,a,s){return c+n+":"+r+s+(o?c+n+"-span:"+(i?a:+a-+r)+s:"")+e}));case 4949:if(121===E(e,t+6))return _(e,":",":"+d)+e;break;case 6444:switch(E(e,45===E(e,14)?18:11)){case 120:return _(e,/(.+:)([^;\s!]+)(;|(\s+)?!.+)?/,"$1"+d+(45===E(e,14)?"inline-":"")+"box$3$1"+d+"$2$3$1"+c+"$2box$3")+e;case 100:return _(e,":",":"+c)+e}break;case 5719:case 2647:case 2135:case 3927:case 2391:return _(e,"scroll-","scroll-snap-")+e}return e}function re(e,t,n,r){if(e.length>-1&&!e.return)switch(e.type){case f:return void(e.return=ne(e.value,e.length,n));case g:return ee([L(e,{value:_(e.value,"@","@"+d)})],r);case p:if(e.length)return function(e,t){return e.map(t).join("")}(n=e.props,(function(t){switch(w(t,r=/(::plac\w+|:read-\w+)/)){case":read-only":case":read-write":D(L(e,{props:[_(t,/:(read-\w+)/,":"+u+"$1")]})),D(L(e,{props:[t]})),x(e,{props:R(n,r)});break;case"::placeholder":D(L(e,{props:[_(t,/:(plac\w+)/,":"+d+"input-$1")]})),D(L(e,{props:[_(t,/:(plac\w+)/,":"+u+"$1")]})),D(L(e,{props:[_(t,/:(plac\w+)/,c+"input-$1")]})),D(L(e,{props:[t]})),x(e,{props:R(n,r)})}return""}))}}function oe(e){return K(ie("",null,null,null,[""],e=V(e),0,[0],e))}function ie(e,t,n,r,o,i,a,s,l){for(var c=0,u=0,d=a,h=0,p=0,f=0,m=1,g=1,y=1,x=0,k="",w=o,C=i,O=r,R=k;g;)switch(f=x,x=B()){case 40:if(108!=f&&58==E(R,d-1)){-1!=S(R+=_(Q(x),"&","&\f"),"&\f",b(c?s[c-1]:0))&&(y=-1);break}case 34:case 39:case 91:R+=Q(x);break;case 9:case 10:case 13:case 32:R+=Y(f);break;case 92:R+=G(H()-1,7);continue;case 47:switch(W()){case 42:case 47:M(se(Z(B(),H()),t,n,l),l);break;default:R+="/"}break;case 123*m:s[c++]=A(R)*y;case 125*m:case 59:case 0:switch(x){case 0:case 125:g=0;case 59+u:-1==y&&(R=_(R,/\f/g,"")),p>0&&A(R)-d&&M(p>32?le(R+";",r,n,d-1,l):le(_(R," ","")+";",r,n,d-2,l),l);break;case 59:R+=";";default:if(M(O=ae(R,t,n,c,u,o,s,k,w=[],C=[],d,i),i),123===x)if(0===u)ie(R,t,O,O,w,i,d,s,C);else switch(99===h&&110===E(R,3)?100:h){case 100:case 108:case 109:case 115:ie(e,O,O,r&&M(ae(e,O,O,0,0,o,s,k,o,w=[],d,C),C),o,C,d,s,r?w:C);break;default:ie(R,O,O,O,[""],C,0,s,C)}}c=u=p=0,m=y=1,k=R="",d=a;break;case 58:d=1+A(R),p=f;default:if(m<1)if(123==x)--m;else if(125==x&&0==m++&&125==F())continue;switch(R+=v(x),x*m){case 38:y=u>0?1:(R+="\f",-1);break;case 44:s[c++]=(A(R)-1)*y,y=1;break;case 64:45===W()&&(R+=Q(B())),h=W(),u=d=A(k=R+=J(H())),x++;break;case 45:45===f&&2==A(R)&&(m=0)}}return i}function ae(e,t,n,r,o,i,a,s,l,c,u,d){for(var h=o-1,f=0===o?i:[""],m=O(f),g=0,y=0,v=0;g<r;++g)for(var x=0,w=C(e,h+1,h=b(y=a[g])),S=e;x<m;++x)(S=k(y>0?f[x]+" "+w:_(w,/&\f/g,f[x])))&&(l[v++]=S);return $(e,t,n,0===o?p:s,l,c,u,d)}function se(e,t,n,r){return $(e,t,n,h,v(I),C(e,2,-2),0,r)}function le(e,t,n,r,o){return $(e,t,n,f,C(e,0,r),C(e,r+1,-1),r,o)}var ce=n(3969),ue="undefined"!=typeof process&&void 0!==process.env&&(process.env.REACT_APP_SC_ATTR||process.env.SC_ATTR)||"data-styled",de="active",he="data-styled-version",pe="6.1.12",fe="/*!sc*/\n",me="undefined"!=typeof window&&"HTMLElement"in window,ge=Boolean("boolean"==typeof SC_DISABLE_SPEEDY?SC_DISABLE_SPEEDY:"undefined"!=typeof process&&void 0!==process.env&&void 0!==process.env.REACT_APP_SC_DISABLE_SPEEDY&&""!==process.env.REACT_APP_SC_DISABLE_SPEEDY?"false"!==process.env.REACT_APP_SC_DISABLE_SPEEDY&&process.env.REACT_APP_SC_DISABLE_SPEEDY:"undefined"!=typeof process&&void 0!==process.env&&void 0!==process.env.SC_DISABLE_SPEEDY&&""!==process.env.SC_DISABLE_SPEEDY&&("false"!==process.env.SC_DISABLE_SPEEDY&&process.env.SC_DISABLE_SPEEDY)),ye={},be=(new Set,Object.freeze([])),ve=Object.freeze({});function xe(e,t,n){return void 0===n&&(n=ve),e.theme!==n.theme&&e.theme||t||n.theme}var ke=new Set(["a","abbr","address","area","article","aside","audio","b","base","bdi","bdo","big","blockquote","body","br","button","canvas","caption","cite","code","col","colgroup","data","datalist","dd","del","details","dfn","dialog","div","dl","dt","em","embed","fieldset","figcaption","figure","footer","form","h1","h2","h3","h4","h5","h6","header","hgroup","hr","html","i","iframe","img","input","ins","kbd","keygen","label","legend","li","link","main","map","mark","menu","menuitem","meta","meter","nav","noscript","object","ol","optgroup","option","output","p","param","picture","pre","progress","q","rp","rt","ruby","s","samp","script","section","select","small","source","span","strong","style","sub","summary","sup","table","tbody","td","textarea","tfoot","th","thead","time","tr","track","u","ul","use","var","video","wbr","circle","clipPath","defs","ellipse","foreignObject","g","image","line","linearGradient","marker","mask","path","pattern","polygon","polyline","radialGradient","rect","stop","svg","text","tspan"]),we=/[!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~-]+/g,_e=/(^-|-$)/g;function Se(e){return e.replace(we,"-").replace(_e,"")}var Ee=/(a)(d)/gi,Ce=52,Ae=function(e){return String.fromCharCode(e+(e>25?39:97))};function Oe(e){var t,n="";for(t=Math.abs(e);t>Ce;t=t/Ce|0)n=Ae(t%Ce)+n;return(Ae(t%Ce)+n).replace(Ee,"$1-$2")}var Me,Re=5381,Pe=function(e,t){for(var n=t.length;n;)e=33*e^t.charCodeAt(--n);return e},Te=function(e){return Pe(Re,e)};function ze(e){return Oe(Te(e)>>>0)}function je(e){return e.displayName||e.name||"Component"}function Ie(e){return"string"==typeof e&&!0}var Ne="function"==typeof Symbol&&Symbol.for,$e=Ne?Symbol.for("react.memo"):60115,Le=Ne?Symbol.for("react.forward_ref"):60112,De={childContextTypes:!0,contextType:!0,contextTypes:!0,defaultProps:!0,displayName:!0,getDefaultProps:!0,getDerivedStateFromError:!0,getDerivedStateFromProps:!0,mixins:!0,propTypes:!0,type:!0},Fe={name:!0,length:!0,prototype:!0,caller:!0,callee:!0,arguments:!0,arity:!0},Be={$$typeof:!0,compare:!0,defaultProps:!0,displayName:!0,propTypes:!0,type:!0},We=((Me={})[Le]={$$typeof:!0,render:!0,defaultProps:!0,displayName:!0,propTypes:!0},Me[$e]=Be,Me);function He(e){return("type"in(t=e)&&t.type.$$typeof)===$e?Be:"$$typeof"in e?We[e.$$typeof]:De;var t}var qe=Object.defineProperty,Ue=Object.getOwnPropertyNames,Ve=Object.getOwnPropertySymbols,Ke=Object.getOwnPropertyDescriptor,Qe=Object.getPrototypeOf,Ye=Object.prototype;function Ge(e,t,n){if("string"!=typeof t){if(Ye){var r=Qe(t);r&&r!==Ye&&Ge(e,r,n)}var o=Ue(t);Ve&&(o=o.concat(Ve(t)));for(var i=He(e),a=He(t),s=0;s<o.length;++s){var l=o[s];if(!(l in Fe||n&&n[l]||a&&l in a||i&&l in i)){var c=Ke(t,l);try{qe(e,l,c)}catch(e){}}}}return e}function Xe(e){return"function"==typeof e}function Ze(e){return"object"==typeof e&&"styledComponentId"in e}function Je(e,t){return e&&t?"".concat(e," ").concat(t):e||t||""}function et(e,t){if(0===e.length)return"";for(var n=e[0],r=1;r<e.length;r++)n+=t?t+e[r]:e[r];return n}function tt(e){return null!==e&&"object"==typeof e&&e.constructor.name===Object.name&&!("props"in e&&e.$$typeof)}function nt(e,t,n){if(void 0===n&&(n=!1),!n&&!tt(e)&&!Array.isArray(e))return t;if(Array.isArray(t))for(var r=0;r<t.length;r++)e[r]=nt(e[r],t[r]);else if(tt(t))for(var r in t)e[r]=nt(e[r],t[r]);return e}function rt(e,t){Object.defineProperty(e,"toString",{value:t})}function ot(e){for(var t=[],n=1;n<arguments.length;n++)t[n-1]=arguments[n];return new Error("An error occurred. See https://github.com/styled-components/styled-components/blob/main/packages/styled-components/src/utils/errors.md#".concat(e," for more information.").concat(t.length>0?" Args: ".concat(t.join(", ")):""))}var it=function(){function e(e){this.groupSizes=new Uint32Array(512),this.length=512,this.tag=e}return e.prototype.indexOfGroup=function(e){for(var t=0,n=0;n<e;n++)t+=this.groupSizes[n];return t},e.prototype.insertRules=function(e,t){if(e>=this.groupSizes.length){for(var n=this.groupSizes,r=n.length,o=r;e>=o;)if((o<<=1)<0)throw ot(16,"".concat(e));this.groupSizes=new Uint32Array(o),this.groupSizes.set(n),this.length=o;for(var i=r;i<o;i++)this.groupSizes[i]=0}for(var a=this.indexOfGroup(e+1),s=(i=0,t.length);i<s;i++)this.tag.insertRule(a,t[i])&&(this.groupSizes[e]++,a++)},e.prototype.clearGroup=function(e){if(e<this.length){var t=this.groupSizes[e],n=this.indexOfGroup(e),r=n+t;this.groupSizes[e]=0;for(var o=n;o<r;o++)this.tag.deleteRule(n)}},e.prototype.getGroup=function(e){var t="";if(e>=this.length||0===this.groupSizes[e])return t;for(var n=this.groupSizes[e],r=this.indexOfGroup(e),o=r+n,i=r;i<o;i++)t+="".concat(this.tag.getRule(i)).concat(fe);return t},e}(),at=new Map,st=new Map,lt=1,ct=function(e){if(at.has(e))return at.get(e);for(;st.has(lt);)lt++;var t=lt++;return at.set(e,t),st.set(t,e),t},ut=function(e,t){lt=t+1,at.set(e,t),st.set(t,e)},dt="style[".concat(ue,"][").concat(he,'="').concat(pe,'"]'),ht=new RegExp("^".concat(ue,'\\.g(\\d+)\\[id="([\\w\\d-]+)"\\].*?"([^"]*)')),pt=function(e,t,n){for(var r,o=n.split(","),i=0,a=o.length;i<a;i++)(r=o[i])&&e.registerName(t,r)},ft=function(e,t){for(var n,r=(null!==(n=t.textContent)&&void 0!==n?n:"").split(fe),o=[],i=0,a=r.length;i<a;i++){var s=r[i].trim();if(s){var l=s.match(ht);if(l){var c=0|parseInt(l[1],10),u=l[2];0!==c&&(ut(u,c),pt(e,u,l[3]),e.getTag().insertRules(c,o)),o.length=0}else o.push(s)}}},mt=function(e){for(var t=document.querySelectorAll(dt),n=0,r=t.length;n<r;n++){var o=t[n];o&&o.getAttribute(ue)!==de&&(ft(e,o),o.parentNode&&o.parentNode.removeChild(o))}};function gt(){return n.nc}var yt=function(e){var t=document.head,n=e||t,r=document.createElement("style"),o=function(e){var t=Array.from(e.querySelectorAll("style[".concat(ue,"]")));return t[t.length-1]}(n),i=void 0!==o?o.nextSibling:null;r.setAttribute(ue,de),r.setAttribute(he,pe);var a=gt();return a&&r.setAttribute("nonce",a),n.insertBefore(r,i),r},bt=function(){function e(e){this.element=yt(e),this.element.appendChild(document.createTextNode("")),this.sheet=function(e){if(e.sheet)return e.sheet;for(var t=document.styleSheets,n=0,r=t.length;n<r;n++){var o=t[n];if(o.ownerNode===e)return o}throw ot(17)}(this.element),this.length=0}return e.prototype.insertRule=function(e,t){try{return this.sheet.insertRule(t,e),this.length++,!0}catch(e){return!1}},e.prototype.deleteRule=function(e){this.sheet.deleteRule(e),this.length--},e.prototype.getRule=function(e){var t=this.sheet.cssRules[e];return t&&t.cssText?t.cssText:""},e}(),vt=function(){function e(e){this.element=yt(e),this.nodes=this.element.childNodes,this.length=0}return e.prototype.insertRule=function(e,t){if(e<=this.length&&e>=0){var n=document.createTextNode(t);return this.element.insertBefore(n,this.nodes[e]||null),this.length++,!0}return!1},e.prototype.deleteRule=function(e){this.element.removeChild(this.nodes[e]),this.length--},e.prototype.getRule=function(e){return e<this.length?this.nodes[e].textContent:""},e}(),xt=function(){function e(e){this.rules=[],this.length=0}return e.prototype.insertRule=function(e,t){return e<=this.length&&(this.rules.splice(e,0,t),this.length++,!0)},e.prototype.deleteRule=function(e){this.rules.splice(e,1),this.length--},e.prototype.getRule=function(e){return e<this.length?this.rules[e]:""},e}(),kt=me,wt={isServer:!me,useCSSOMInjection:!ge},_t=function(){function e(e,t,n){void 0===e&&(e=ve),void 0===t&&(t={});var o=this;this.options=r(r({},wt),e),this.gs=t,this.names=new Map(n),this.server=!!e.isServer,!this.server&&me&&kt&&(kt=!1,mt(this)),rt(this,(function(){return function(e){for(var t=e.getTag(),n=t.length,r="",o=function(n){var o=function(e){return st.get(e)}(n);if(void 0===o)return"continue";var i=e.names.get(o),a=t.getGroup(n);if(void 0===i||!i.size||0===a.length)return"continue";var s="".concat(ue,".g").concat(n,'[id="').concat(o,'"]'),l="";void 0!==i&&i.forEach((function(e){e.length>0&&(l+="".concat(e,","))})),r+="".concat(a).concat(s,'{content:"').concat(l,'"}').concat(fe)},i=0;i<n;i++)o(i);return r}(o)}))}return e.registerId=function(e){return ct(e)},e.prototype.rehydrate=function(){!this.server&&me&&mt(this)},e.prototype.reconstructWithOptions=function(t,n){return void 0===n&&(n=!0),new e(r(r({},this.options),t),this.gs,n&&this.names||void 0)},e.prototype.allocateGSInstance=function(e){return this.gs[e]=(this.gs[e]||0)+1},e.prototype.getTag=function(){return this.tag||(this.tag=(e=function(e){var t=e.useCSSOMInjection,n=e.target;return e.isServer?new xt(n):t?new bt(n):new vt(n)}(this.options),new it(e)));var e},e.prototype.hasNameForId=function(e,t){return this.names.has(e)&&this.names.get(e).has(t)},e.prototype.registerName=function(e,t){if(ct(e),this.names.has(e))this.names.get(e).add(t);else{var n=new Set;n.add(t),this.names.set(e,n)}},e.prototype.insertRules=function(e,t,n){this.registerName(e,t),this.getTag().insertRules(ct(e),n)},e.prototype.clearNames=function(e){this.names.has(e)&&this.names.get(e).clear()},e.prototype.clearRules=function(e){this.getTag().clearGroup(ct(e)),this.clearNames(e)},e.prototype.clearTag=function(){this.tag=void 0},e}(),St=/&/g,Et=/^\s*\/\/.*$/gm;function Ct(e,t){return e.map((function(e){return"rule"===e.type&&(e.value="".concat(t," ").concat(e.value),e.value=e.value.replaceAll(",",",".concat(t," ")),e.props=e.props.map((function(e){return"".concat(t," ").concat(e)}))),Array.isArray(e.children)&&"@keyframes"!==e.type&&(e.children=Ct(e.children,t)),e}))}function At(e){var t,n,r,o=void 0===e?ve:e,i=o.options,a=void 0===i?ve:i,s=o.plugins,l=void 0===s?be:s,c=function(e,r,o){return o.startsWith(n)&&o.endsWith(n)&&o.replaceAll(n,"").length>0?".".concat(t):e},u=l.slice();u.push((function(e){e.type===p&&e.value.includes("&")&&(e.props[0]=e.props[0].replace(St,n).replace(r,c))})),a.prefix&&u.push(re),u.push(te);var d=function(e,o,i,s){void 0===o&&(o=""),void 0===i&&(i=""),void 0===s&&(s="&"),t=s,n=o,r=new RegExp("\\".concat(n,"\\b"),"g");var l=e.replace(Et,""),c=oe(i||o?"".concat(i," ").concat(o," { ").concat(l," }"):l);a.namespace&&(c=Ct(c,a.namespace));var d,h,p,f=[];return ee(c,(d=u.concat((p=function(e){return f.push(e)},function(e){e.root||(e=e.return)&&p(e)})),h=O(d),function(e,t,n,r){for(var o="",i=0;i<h;i++)o+=d[i](e,t,n,r)||"";return o})),f};return d.hash=l.length?l.reduce((function(e,t){return t.name||ot(15),Pe(e,t.name)}),Re).toString():"",d}var Ot=new _t,Mt=At(),Rt=a().createContext({shouldForwardProp:void 0,styleSheet:Ot,stylis:Mt}),Pt=(Rt.Consumer,a().createContext(void 0));function Tt(){return(0,i.useContext)(Rt)}function zt(e){var t=(0,i.useState)(e.stylisPlugins),n=t[0],r=t[1],o=Tt().styleSheet,s=(0,i.useMemo)((function(){var t=o;return e.sheet?t=e.sheet:e.target&&(t=t.reconstructWithOptions({target:e.target},!1)),e.disableCSSOMInjection&&(t=t.reconstructWithOptions({useCSSOMInjection:!1})),t}),[e.disableCSSOMInjection,e.sheet,e.target,o]),c=(0,i.useMemo)((function(){return At({options:{namespace:e.namespace,prefix:e.enableVendorPrefixes},plugins:n})}),[e.enableVendorPrefixes,e.namespace,n]);(0,i.useEffect)((function(){l()(n,e.stylisPlugins)||r(e.stylisPlugins)}),[e.stylisPlugins]);var u=(0,i.useMemo)((function(){return{shouldForwardProp:e.shouldForwardProp,styleSheet:s,stylis:c}}),[e.shouldForwardProp,s,c]);return a().createElement(Rt.Provider,{value:u},a().createElement(Pt.Provider,{value:c},e.children))}var jt=function(){function e(e,t){var n=this;this.inject=function(e,t){void 0===t&&(t=Mt);var r=n.name+t.hash;e.hasNameForId(n.id,r)||e.insertRules(n.id,r,t(n.rules,r,"@keyframes"))},this.name=e,this.id="sc-keyframes-".concat(e),this.rules=t,rt(this,(function(){throw ot(12,String(n.name))}))}return e.prototype.getName=function(e){return void 0===e&&(e=Mt),this.name+e.hash},e}(),It=function(e){return e>="A"&&e<="Z"};function Nt(e){for(var t="",n=0;n<e.length;n++){var r=e[n];if(1===n&&"-"===r&&"-"===e[0])return e;It(r)?t+="-"+r.toLowerCase():t+=r}return t.startsWith("ms-")?"-"+t:t}var $t=function(e){return null==e||!1===e||""===e},Lt=function(e){var t,n,r=[];for(var i in e){var a=e[i];e.hasOwnProperty(i)&&!$t(a)&&(Array.isArray(a)&&a.isCss||Xe(a)?r.push("".concat(Nt(i),":"),a,";"):tt(a)?r.push.apply(r,o(o(["".concat(i," {")],Lt(a),!1),["}"],!1)):r.push("".concat(Nt(i),": ").concat((t=i,null==(n=a)||"boolean"==typeof n||""===n?"":"number"!=typeof n||0===n||t in ce.A||t.startsWith("--")?String(n).trim():"".concat(n,"px")),";")))}return r};function Dt(e,t,n,r){return $t(e)?[]:Ze(e)?[".".concat(e.styledComponentId)]:Xe(e)?!Xe(o=e)||o.prototype&&o.prototype.isReactComponent||!t?[e]:Dt(e(t),t,n,r):e instanceof jt?n?(e.inject(n,r),[e.getName(r)]):[e]:tt(e)?Lt(e):Array.isArray(e)?Array.prototype.concat.apply(be,e.map((function(e){return Dt(e,t,n,r)}))):[e.toString()];var o}function Ft(e){for(var t=0;t<e.length;t+=1){var n=e[t];if(Xe(n)&&!Ze(n))return!1}return!0}var Bt=Te(pe),Wt=function(){function e(e,t,n){this.rules=e,this.staticRulesId="",this.isStatic=(void 0===n||n.isStatic)&&Ft(e),this.componentId=t,this.baseHash=Pe(Bt,t),this.baseStyle=n,_t.registerId(t)}return e.prototype.generateAndInjectStyles=function(e,t,n){var r=this.baseStyle?this.baseStyle.generateAndInjectStyles(e,t,n):"";if(this.isStatic&&!n.hash)if(this.staticRulesId&&t.hasNameForId(this.componentId,this.staticRulesId))r=Je(r,this.staticRulesId);else{var o=et(Dt(this.rules,e,t,n)),i=Oe(Pe(this.baseHash,o)>>>0);if(!t.hasNameForId(this.componentId,i)){var a=n(o,".".concat(i),void 0,this.componentId);t.insertRules(this.componentId,i,a)}r=Je(r,i),this.staticRulesId=i}else{for(var s=Pe(this.baseHash,n.hash),l="",c=0;c<this.rules.length;c++){var u=this.rules[c];if("string"==typeof u)l+=u;else if(u){var d=et(Dt(u,e,t,n));s=Pe(s,d+c),l+=d}}if(l){var h=Oe(s>>>0);t.hasNameForId(this.componentId,h)||t.insertRules(this.componentId,h,n(l,".".concat(h),void 0,this.componentId)),r=Je(r,h)}}return r},e}(),Ht=a().createContext(void 0);Ht.Consumer;var qt={};new Set;function Ut(e,t,n){var o=Ze(e),s=e,l=!Ie(e),c=t.attrs,u=void 0===c?be:c,d=t.componentId,h=void 0===d?function(e,t){var n="string"!=typeof e?"sc":Se(e);qt[n]=(qt[n]||0)+1;var r="".concat(n,"-").concat(ze(pe+n+qt[n]));return t?"".concat(t,"-").concat(r):r}(t.displayName,t.parentComponentId):d,p=t.displayName,f=void 0===p?function(e){return Ie(e)?"styled.".concat(e):"Styled(".concat(je(e),")")}(e):p,m=t.displayName&&t.componentId?"".concat(Se(t.displayName),"-").concat(t.componentId):t.componentId||h,g=o&&s.attrs?s.attrs.concat(u).filter(Boolean):u,y=t.shouldForwardProp;if(o&&s.shouldForwardProp){var b=s.shouldForwardProp;if(t.shouldForwardProp){var v=t.shouldForwardProp;y=function(e,t){return b(e,t)&&v(e,t)}}else y=b}var x=new Wt(n,m,o?s.componentStyle:void 0);function k(e,t){return function(e,t,n){var o=e.attrs,s=e.componentStyle,l=e.defaultProps,c=e.foldedComponentIds,u=e.styledComponentId,d=e.target,h=a().useContext(Ht),p=Tt(),f=e.shouldForwardProp||p.shouldForwardProp,m=xe(t,h,l)||ve,g=function(e,t,n){for(var o,i=r(r({},t),{className:void 0,theme:n}),a=0;a<e.length;a+=1){var s=Xe(o=e[a])?o(i):o;for(var l in s)i[l]="className"===l?Je(i[l],s[l]):"style"===l?r(r({},i[l]),s[l]):s[l]}return t.className&&(i.className=Je(i.className,t.className)),i}(o,t,m),y=g.as||d,b={};for(var v in g)void 0===g[v]||"$"===v[0]||"as"===v||"theme"===v&&g.theme===m||("forwardedAs"===v?b.as=g.forwardedAs:f&&!f(v,y)||(b[v]=g[v]));var x=function(e,t){var n=Tt();return e.generateAndInjectStyles(t,n.styleSheet,n.stylis)}(s,g),k=Je(c,u);return x&&(k+=" "+x),g.className&&(k+=" "+g.className),b[Ie(y)&&!ke.has(y)?"class":"className"]=k,b.ref=n,(0,i.createElement)(y,b)}(w,e,t)}k.displayName=f;var w=a().forwardRef(k);return w.attrs=g,w.componentStyle=x,w.displayName=f,w.shouldForwardProp=y,w.foldedComponentIds=o?Je(s.foldedComponentIds,s.styledComponentId):"",w.styledComponentId=m,w.target=o?s.target:e,Object.defineProperty(w,"defaultProps",{get:function(){return this._foldedDefaultProps},set:function(e){this._foldedDefaultProps=o?function(e){for(var t=[],n=1;n<arguments.length;n++)t[n-1]=arguments[n];for(var r=0,o=t;r<o.length;r++)nt(e,o[r],!0);return e}({},s.defaultProps,e):e}}),rt(w,(function(){return".".concat(w.styledComponentId)})),l&&Ge(w,e,{attrs:!0,componentStyle:!0,displayName:!0,foldedComponentIds:!0,shouldForwardProp:!0,styledComponentId:!0,target:!0}),w}function Vt(e,t){for(var n=[e[0]],r=0,o=t.length;r<o;r+=1)n.push(t[r],e[r+1]);return n}var Kt=function(e){return Object.assign(e,{isCss:!0})};function Qt(e){for(var t=[],n=1;n<arguments.length;n++)t[n-1]=arguments[n];if(Xe(e)||tt(e))return Kt(Dt(Vt(be,o([e],t,!0))));var r=e;return 0===t.length&&1===r.length&&"string"==typeof r[0]?Dt(r):Kt(Dt(Vt(r,t)))}function Yt(e,t,n){if(void 0===n&&(n=ve),!t)throw ot(1,t);var i=function(r){for(var i=[],a=1;a<arguments.length;a++)i[a-1]=arguments[a];return e(t,n,Qt.apply(void 0,o([r],i,!1)))};return i.attrs=function(o){return Yt(e,t,r(r({},n),{attrs:Array.prototype.concat(n.attrs,o).filter(Boolean)}))},i.withConfig=function(o){return Yt(e,t,r(r({},n),o))},i}var Gt=function(e){return Yt(Ut,e)},Xt=Gt;ke.forEach((function(e){Xt[e]=Gt(e)}));var Zt=function(){function e(e,t){this.rules=e,this.componentId=t,this.isStatic=Ft(e),_t.registerId(this.componentId+1)}return e.prototype.createStyles=function(e,t,n,r){var o=r(et(Dt(this.rules,t,n,r)),""),i=this.componentId+e;n.insertRules(i,i,o)},e.prototype.removeStyles=function(e,t){t.clearRules(this.componentId+e)},e.prototype.renderStyles=function(e,t,n,r){e>2&&_t.registerId(this.componentId+e),this.removeStyles(e,n),this.createStyles(e,t,n,r)},e}();function Jt(e){for(var t=[],n=1;n<arguments.length;n++)t[n-1]=arguments[n];var i=Qt.apply(void 0,o([e],t,!1)),s="sc-global-".concat(ze(JSON.stringify(i))),l=new Zt(i,s),c=function(e){var t=Tt(),n=a().useContext(Ht),r=a().useRef(t.styleSheet.allocateGSInstance(s)).current;return t.styleSheet.server&&u(r,e,t.styleSheet,n,t.stylis),a().useLayoutEffect((function(){if(!t.styleSheet.server)return u(r,e,t.styleSheet,n,t.stylis),function(){return l.removeStyles(r,t.styleSheet)}}),[r,e,t.styleSheet,n,t.stylis]),null};function u(e,t,n,o,i){if(l.isStatic)l.renderStyles(e,ye,n,i);else{var a=r(r({},t),{theme:xe(t,o,c.defaultProps)});l.renderStyles(e,a,n,i)}}return a().memo(c)}(function(){function e(){var e=this;this._emitSheetCSS=function(){var t=e.instance.toString();if(!t)return"";var n=gt(),r=et([n&&'nonce="'.concat(n,'"'),"".concat(ue,'="true"'),"".concat(he,'="').concat(pe,'"')].filter(Boolean)," ");return"<style ".concat(r,">").concat(t,"</style>")},this.getStyleTags=function(){if(e.sealed)throw ot(2);return e._emitSheetCSS()},this.getStyleElement=function(){var t;if(e.sealed)throw ot(2);var n=e.instance.toString();if(!n)return[];var o=((t={})[ue]="",t[he]=pe,t.dangerouslySetInnerHTML={__html:n},t),i=gt();return i&&(o.nonce=i),[a().createElement("style",r({},o,{key:"sc-0-0"}))]},this.seal=function(){e.sealed=!0},this.instance=new _t({isServer:!0}),this.sealed=!1}e.prototype.collectStyles=function(e){if(this.sealed)throw ot(2);return a().createElement(zt,{sheet:this.instance},e)},e.prototype.interleaveWithNodeStream=function(e){throw ot(3)}})(),"__sc-".concat(ue,"__")},6426:e=>{e.exports=function(){var e=document.getSelection();if(!e.rangeCount)return function(){};for(var t=document.activeElement,n=[],r=0;r<e.rangeCount;r++)n.push(e.getRangeAt(r));switch(t.tagName.toUpperCase()){case"INPUT":case"TEXTAREA":t.blur();break;default:t=null}return e.removeAllRanges(),function(){"Caret"===e.type&&e.removeAllRanges(),e.rangeCount||n.forEach((function(t){e.addRange(t)})),t&&t.focus()}}},1063:(e,t,n)=>{"use strict";
/**
 * @license React
 * use-sync-external-store-shim.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var r=n(1594);var o="function"==typeof Object.is?Object.is:function(e,t){return e===t&&(0!==e||1/e==1/t)||e!=e&&t!=t},i=r.useState,a=r.useEffect,s=r.useLayoutEffect,l=r.useDebugValue;function c(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!o(e,n)}catch(e){return!0}}var u="undefined"==typeof window||void 0===window.document||void 0===window.document.createElement?function(e,t){return t()}:function(e,t){var n=t(),r=i({inst:{value:n,getSnapshot:t}}),o=r[0].inst,u=r[1];return s((function(){o.value=n,o.getSnapshot=t,c(o)&&u({inst:o})}),[e,n,t]),a((function(){return c(o)&&u({inst:o}),e((function(){c(o)&&u({inst:o})}))}),[e]),l(n),n};t.useSyncExternalStore=void 0!==r.useSyncExternalStore?r.useSyncExternalStore:u},8940:(e,t,n)=>{"use strict";
/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var r=n(1594),o=n(9888);var i="function"==typeof Object.is?Object.is:function(e,t){return e===t&&(0!==e||1/e==1/t)||e!=e&&t!=t},a=o.useSyncExternalStore,s=r.useRef,l=r.useEffect,c=r.useMemo,u=r.useDebugValue;t.useSyncExternalStoreWithSelector=function(e,t,n,r,o){var d=s(null);if(null===d.current){var h={hasValue:!1,value:null};d.current=h}else h=d.current;d=c((function(){function e(e){if(!l){if(l=!0,a=e,e=r(e),void 0!==o&&h.hasValue){var t=h.value;if(o(t,e))return s=t}return s=e}if(t=s,i(a,e))return t;var n=r(e);return void 0!==o&&o(t,n)?t:(a=e,s=n)}var a,s,l=!1,c=void 0===n?null:n;return[function(){return e(t())},null===c?void 0:function(){return e(c())}]}),[t,n,r,o]);var p=a(e,d[0],d[1]);return l((function(){h.hasValue=!0,h.value=p}),[p]),u(p),p}},9888:(e,t,n)=>{"use strict";e.exports=n(1063)},9242:(e,t,n)=>{"use strict";e.exports=n(8940)},4634:e=>{function t(){return e.exports=t=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},e.exports.__esModule=!0,e.exports.default=e.exports,t.apply(this,arguments)}e.exports=t,e.exports.__esModule=!0,e.exports.default=e.exports},4994:e=>{e.exports=function(e){return e&&e.__esModule?e:{default:e}},e.exports.__esModule=!0,e.exports.default=e.exports},4893:e=>{e.exports=function(e,t){if(null==e)return{};var n,r,o={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(o[n]=e[n]);return o},e.exports.__esModule=!0,e.exports.default=e.exports},8168:(e,t,n)=>{"use strict";function r(){return r=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},r.apply(this,arguments)}n.d(t,{A:()=>r})},8587:(e,t,n)=>{"use strict";function r(e,t){if(null==e)return{};var n,r,o={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}n.d(t,{A:()=>r})},9658:(e,t,n)=>{"use strict";n.d(t,{m:()=>i});var r=n(6500),o=n(4880),i=new class extends r.Q{#e;#t;#n;constructor(){super(),this.#n=e=>{if(!o.S$&&window.addEventListener){const t=()=>e();return window.addEventListener("visibilitychange",t,!1),()=>{window.removeEventListener("visibilitychange",t)}}}}onSubscribe(){this.#t||this.setEventListener(this.#n)}onUnsubscribe(){this.hasListeners()||(this.#t?.(),this.#t=void 0)}setEventListener(e){this.#n=e,this.#t?.(),this.#t=e((e=>{"boolean"==typeof e?this.setFocused(e):this.onFocus()}))}setFocused(e){this.#e!==e&&(this.#e=e,this.onFocus())}onFocus(){this.listeners.forEach((e=>{e()}))}isFocused(){return"boolean"==typeof this.#e?this.#e:"hidden"!==globalThis.document?.visibilityState}}},6158:(e,t,n)=>{"use strict";n.d(t,{$:()=>s,s:()=>a});var r=n(6261),o=n(1692),i=n(8904),a=class extends o.k{#r;#o;#i;#a;constructor(e){super(),this.mutationId=e.mutationId,this.#o=e.defaultOptions,this.#i=e.mutationCache,this.#r=[],this.state=e.state||{context:void 0,data:void 0,error:null,failureCount:0,failureReason:null,isPaused:!1,status:"idle",variables:void 0,submittedAt:0},this.setOptions(e.options),this.scheduleGc()}setOptions(e){this.options={...this.#o,...e},this.updateGcTime(this.options.gcTime)}get meta(){return this.options.meta}addObserver(e){this.#r.includes(e)||(this.#r.push(e),this.clearGcTimeout(),this.#i.notify({type:"observerAdded",mutation:this,observer:e}))}removeObserver(e){this.#r=this.#r.filter((t=>t!==e)),this.scheduleGc(),this.#i.notify({type:"observerRemoved",mutation:this,observer:e})}optionalRemove(){this.#r.length||("pending"===this.state.status?this.scheduleGc():this.#i.remove(this))}continue(){return this.#a?.continue()??this.execute(this.state.variables)}async execute(e){const t=()=>(this.#a=(0,i.II)({fn:()=>this.options.mutationFn?this.options.mutationFn(e):Promise.reject(new Error("No mutationFn found")),onFail:(e,t)=>{this.#s({type:"failed",failureCount:e,error:t})},onPause:()=>{this.#s({type:"pause"})},onContinue:()=>{this.#s({type:"continue"})},retry:this.options.retry??0,retryDelay:this.options.retryDelay,networkMode:this.options.networkMode}),this.#a.promise),n="pending"===this.state.status;try{if(!n){this.#s({type:"pending",variables:e}),await(this.#i.config.onMutate?.(e,this));const t=await(this.options.onMutate?.(e));t!==this.state.context&&this.#s({type:"pending",context:t,variables:e})}const r=await t();return await(this.#i.config.onSuccess?.(r,e,this.state.context,this)),await(this.options.onSuccess?.(r,e,this.state.context)),await(this.#i.config.onSettled?.(r,null,this.state.variables,this.state.context,this)),await(this.options.onSettled?.(r,null,e,this.state.context)),this.#s({type:"success",data:r}),r}catch(t){try{throw await(this.#i.config.onError?.(t,e,this.state.context,this)),await(this.options.onError?.(t,e,this.state.context)),await(this.#i.config.onSettled?.(void 0,t,this.state.variables,this.state.context,this)),await(this.options.onSettled?.(void 0,t,e,this.state.context)),t}finally{this.#s({type:"error",error:t})}}}#s(e){this.state=(t=>{switch(e.type){case"failed":return{...t,failureCount:e.failureCount,failureReason:e.error};case"pause":return{...t,isPaused:!0};case"continue":return{...t,isPaused:!1};case"pending":return{...t,context:e.context,data:void 0,failureCount:0,failureReason:null,error:null,isPaused:!(0,i.v_)(this.options.networkMode),status:"pending",variables:e.variables,submittedAt:Date.now()};case"success":return{...t,data:e.data,failureCount:0,failureReason:null,error:null,status:"success",isPaused:!1};case"error":return{...t,data:void 0,error:e.error,failureCount:t.failureCount+1,failureReason:e.error,isPaused:!1,status:"error"}}})(this.state),r.j.batch((()=>{this.#r.forEach((t=>{t.onMutationUpdate(e)})),this.#i.notify({mutation:this,type:"updated",action:e})}))}};function s(){return{context:void 0,data:void 0,error:null,failureCount:0,failureReason:null,isPaused:!1,status:"idle",variables:void 0,submittedAt:0}}},6261:(e,t,n)=>{"use strict";n.d(t,{j:()=>r});var r=function(){let e=[],t=0,n=e=>{e()},r=e=>{e()},o=e=>setTimeout(e,0);const i=r=>{t?e.push(r):o((()=>{n(r)}))},a=()=>{const t=e;e=[],t.length&&o((()=>{r((()=>{t.forEach((e=>{n(e)}))}))}))};return{batch:e=>{let n;t++;try{n=e()}finally{t--,t||a()}return n},batchCalls:e=>(...t)=>{i((()=>{e(...t)}))},schedule:i,setNotifyFunction:e=>{n=e},setBatchNotifyFunction:e=>{r=e},setScheduler:e=>{o=e}}}()},6035:(e,t,n)=>{"use strict";n.d(t,{t:()=>i});var r=n(6500),o=n(4880),i=new class extends r.Q{#l=!0;#t;#n;constructor(){super(),this.#n=e=>{if(!o.S$&&window.addEventListener){const t=()=>e(!0),n=()=>e(!1);return window.addEventListener("online",t,!1),window.addEventListener("offline",n,!1),()=>{window.removeEventListener("online",t),window.removeEventListener("offline",n)}}}}onSubscribe(){this.#t||this.setEventListener(this.#n)}onUnsubscribe(){this.hasListeners()||(this.#t?.(),this.#t=void 0)}setEventListener(e){this.#n=e,this.#t?.(),this.#t=e(this.setOnline.bind(this))}setOnline(e){this.#l!==e&&(this.#l=e,this.listeners.forEach((t=>{t(e)})))}isOnline(){return this.#l}}},5323:(e,t,n)=>{"use strict";n.d(t,{E:()=>y});var r=n(4880),o=n(6261),i=n(8904),a=n(1692),s=class extends a.k{#c;#u;#d;#h;#a;#r;#o;#p;constructor(e){super(),this.#p=!1,this.#o=e.defaultOptions,this.#f(e.options),this.#r=[],this.#d=e.cache,this.queryKey=e.queryKey,this.queryHash=e.queryHash,this.#c=e.state||function(e){const t="function"==typeof e.initialData?e.initialData():e.initialData,n=void 0!==t,r=n?"function"==typeof e.initialDataUpdatedAt?e.initialDataUpdatedAt():e.initialDataUpdatedAt:0;return{data:t,dataUpdateCount:0,dataUpdatedAt:n?r??Date.now():0,error:null,errorUpdateCount:0,errorUpdatedAt:0,fetchFailureCount:0,fetchFailureReason:null,fetchMeta:null,isInvalidated:!1,status:n?"success":"pending",fetchStatus:"idle"}}(this.options),this.state=this.#c,this.scheduleGc()}get meta(){return this.options.meta}#f(e){this.options={...this.#o,...e},this.updateGcTime(this.options.gcTime)}optionalRemove(){this.#r.length||"idle"!==this.state.fetchStatus||this.#d.remove(this)}setData(e,t){const n=(0,r.pl)(this.state.data,e,this.options);return this.#s({data:n,type:"success",dataUpdatedAt:t?.updatedAt,manual:t?.manual}),n}setState(e,t){this.#s({type:"setState",state:e,setStateOptions:t})}cancel(e){const t=this.#h;return this.#a?.cancel(e),t?t.then(r.lQ).catch(r.lQ):Promise.resolve()}destroy(){super.destroy(),this.cancel({silent:!0})}reset(){this.destroy(),this.setState(this.#c)}isActive(){return this.#r.some((e=>!1!==e.options.enabled))}isDisabled(){return this.getObserversCount()>0&&!this.isActive()}isStale(){return this.state.isInvalidated||void 0===this.state.data||this.#r.some((e=>e.getCurrentResult().isStale))}isStaleByTime(e=0){return this.state.isInvalidated||void 0===this.state.data||!(0,r.j3)(this.state.dataUpdatedAt,e)}onFocus(){const e=this.#r.find((e=>e.shouldFetchOnWindowFocus()));e?.refetch({cancelRefetch:!1}),this.#a?.continue()}onOnline(){const e=this.#r.find((e=>e.shouldFetchOnReconnect()));e?.refetch({cancelRefetch:!1}),this.#a?.continue()}addObserver(e){this.#r.includes(e)||(this.#r.push(e),this.clearGcTimeout(),this.#d.notify({type:"observerAdded",query:this,observer:e}))}removeObserver(e){this.#r.includes(e)&&(this.#r=this.#r.filter((t=>t!==e)),this.#r.length||(this.#a&&(this.#p?this.#a.cancel({revert:!0}):this.#a.cancelRetry()),this.scheduleGc()),this.#d.notify({type:"observerRemoved",query:this,observer:e}))}getObserversCount(){return this.#r.length}invalidate(){this.state.isInvalidated||this.#s({type:"invalidate"})}fetch(e,t){if("idle"!==this.state.fetchStatus)if(void 0!==this.state.data&&t?.cancelRefetch)this.cancel({silent:!0});else if(this.#h)return this.#a?.continueRetry(),this.#h;if(e&&this.#f(e),!this.options.queryFn){const e=this.#r.find((e=>e.options.queryFn));e&&this.#f(e.options)}const n=new AbortController,o={queryKey:this.queryKey,meta:this.meta},a=e=>{Object.defineProperty(e,"signal",{enumerable:!0,get:()=>(this.#p=!0,n.signal)})};a(o);const s={fetchOptions:t,options:this.options,queryKey:this.queryKey,state:this.state,fetchFn:()=>this.options.queryFn&&this.options.queryFn!==r.hT?(this.#p=!1,this.options.persister?this.options.persister(this.options.queryFn,o,this):this.options.queryFn(o)):Promise.reject(new Error(`Missing queryFn: '${this.options.queryHash}'`))};a(s),this.options.behavior?.onFetch(s,this),this.#u=this.state,"idle"!==this.state.fetchStatus&&this.state.fetchMeta===s.fetchOptions?.meta||this.#s({type:"fetch",meta:s.fetchOptions?.meta});const l=e=>{(0,i.wm)(e)&&e.silent||this.#s({type:"error",error:e}),(0,i.wm)(e)||(this.#d.config.onError?.(e,this),this.#d.config.onSettled?.(this.state.data,e,this)),this.isFetchingOptimistic||this.scheduleGc(),this.isFetchingOptimistic=!1};return this.#a=(0,i.II)({fn:s.fetchFn,abort:n.abort.bind(n),onSuccess:e=>{void 0!==e?(this.setData(e),this.#d.config.onSuccess?.(e,this),this.#d.config.onSettled?.(e,this.state.error,this),this.isFetchingOptimistic||this.scheduleGc(),this.isFetchingOptimistic=!1):l(new Error(`${this.queryHash} data is undefined`))},onError:l,onFail:(e,t)=>{this.#s({type:"failed",failureCount:e,error:t})},onPause:()=>{this.#s({type:"pause"})},onContinue:()=>{this.#s({type:"continue"})},retry:s.options.retry,retryDelay:s.options.retryDelay,networkMode:s.options.networkMode}),this.#h=this.#a.promise,this.#h}#s(e){this.state=(t=>{switch(e.type){case"failed":return{...t,fetchFailureCount:e.failureCount,fetchFailureReason:e.error};case"pause":return{...t,fetchStatus:"paused"};case"continue":return{...t,fetchStatus:"fetching"};case"fetch":return{...t,fetchFailureCount:0,fetchFailureReason:null,fetchMeta:e.meta??null,fetchStatus:(0,i.v_)(this.options.networkMode)?"fetching":"paused",...void 0===t.data&&{error:null,status:"pending"}};case"success":return{...t,data:e.data,dataUpdateCount:t.dataUpdateCount+1,dataUpdatedAt:e.dataUpdatedAt??Date.now(),error:null,isInvalidated:!1,status:"success",...!e.manual&&{fetchStatus:"idle",fetchFailureCount:0,fetchFailureReason:null}};case"error":const n=e.error;return(0,i.wm)(n)&&n.revert&&this.#u?{...this.#u,fetchStatus:"idle"}:{...t,error:n,errorUpdateCount:t.errorUpdateCount+1,errorUpdatedAt:Date.now(),fetchFailureCount:t.fetchFailureCount+1,fetchFailureReason:n,fetchStatus:"idle",status:"error"};case"invalidate":return{...t,isInvalidated:!0};case"setState":return{...t,...e.state}}})(this.state),o.j.batch((()=>{this.#r.forEach((e=>{e.onQueryUpdate()})),this.#d.notify({query:this,type:"updated",action:e})}))}};var l=n(6500),c=class extends l.Q{constructor(e={}){super(),this.config=e,this.#m=new Map}#m;build(e,t,n){const o=t.queryKey,i=t.queryHash??(0,r.F$)(o,t);let a=this.get(i);return a||(a=new s({cache:this,queryKey:o,queryHash:i,options:e.defaultQueryOptions(t),state:n,defaultOptions:e.getQueryDefaults(o)}),this.add(a)),a}add(e){this.#m.has(e.queryHash)||(this.#m.set(e.queryHash,e),this.notify({type:"added",query:e}))}remove(e){const t=this.#m.get(e.queryHash);t&&(e.destroy(),t===e&&this.#m.delete(e.queryHash),this.notify({type:"removed",query:e}))}clear(){o.j.batch((()=>{this.getAll().forEach((e=>{this.remove(e)}))}))}get(e){return this.#m.get(e)}getAll(){return[...this.#m.values()]}find(e){const t={exact:!0,...e};return this.getAll().find((e=>(0,r.MK)(t,e)))}findAll(e={}){const t=this.getAll();return Object.keys(e).length>0?t.filter((t=>(0,r.MK)(e,t))):t}notify(e){o.j.batch((()=>{this.listeners.forEach((t=>{t(e)}))}))}onFocus(){o.j.batch((()=>{this.getAll().forEach((e=>{e.onFocus()}))}))}onOnline(){o.j.batch((()=>{this.getAll().forEach((e=>{e.onOnline()}))}))}},u=n(6158),d=class extends l.Q{constructor(e={}){super(),this.config=e,this.#g=[],this.#y=0}#g;#y;#b;build(e,t,n){const r=new u.s({mutationCache:this,mutationId:++this.#y,options:e.defaultMutationOptions(t),state:n});return this.add(r),r}add(e){this.#g.push(e),this.notify({type:"added",mutation:e})}remove(e){this.#g=this.#g.filter((t=>t!==e)),this.notify({type:"removed",mutation:e})}clear(){o.j.batch((()=>{this.#g.forEach((e=>{this.remove(e)}))}))}getAll(){return this.#g}find(e){const t={exact:!0,...e};return this.#g.find((e=>(0,r.nJ)(t,e)))}findAll(e={}){return this.#g.filter((t=>(0,r.nJ)(e,t)))}notify(e){o.j.batch((()=>{this.listeners.forEach((t=>{t(e)}))}))}resumePausedMutations(){return this.#b=(this.#b??Promise.resolve()).then((()=>{const e=this.#g.filter((e=>e.state.isPaused));return o.j.batch((()=>e.reduce(((e,t)=>e.then((()=>t.continue().catch(r.lQ)))),Promise.resolve())))})).then((()=>{this.#b=void 0})),this.#b}},h=n(9658),p=n(6035);function f(e){return{onFetch:(t,n)=>{const o=async()=>{const n=t.options,o=t.fetchOptions?.meta?.fetchMore?.direction,i=t.state.data?.pages||[],a=t.state.data?.pageParams||[],s={pages:[],pageParams:[]};let l=!1;const c=t.options.queryFn&&t.options.queryFn!==r.hT?t.options.queryFn:()=>Promise.reject(new Error(`Missing queryFn: '${t.options.queryHash}'`)),u=async(e,n,o)=>{if(l)return Promise.reject();if(null==n&&e.pages.length)return Promise.resolve(e);const i={queryKey:t.queryKey,pageParam:n,direction:o?"backward":"forward",meta:t.options.meta};var a;a=i,Object.defineProperty(a,"signal",{enumerable:!0,get:()=>(t.signal.aborted?l=!0:t.signal.addEventListener("abort",(()=>{l=!0})),t.signal)});const s=await c(i),{maxPages:u}=t.options,d=o?r.ZZ:r.y9;return{pages:d(e.pages,s,u),pageParams:d(e.pageParams,n,u)}};let d;if(o&&i.length){const e="backward"===o,t={pages:i,pageParams:a},r=(e?g:m)(n,t);d=await u(t,r,e)}else{d=await u(s,a[0]??n.initialPageParam);const t=e??i.length;for(let e=1;e<t;e++){const e=m(n,d);d=await u(d,e)}}return d};t.options.persister?t.fetchFn=()=>t.options.persister?.(o,{queryKey:t.queryKey,meta:t.options.meta,signal:t.signal},n):t.fetchFn=o}}}function m(e,{pages:t,pageParams:n}){const r=t.length-1;return e.getNextPageParam(t[r],t,n[r],n)}function g(e,{pages:t,pageParams:n}){return e.getPreviousPageParam?.(t[0],t,n[0],n)}var y=class{#v;#i;#o;#x;#k;#w;#_;#S;constructor(e={}){this.#v=e.queryCache||new c,this.#i=e.mutationCache||new d,this.#o=e.defaultOptions||{},this.#x=new Map,this.#k=new Map,this.#w=0}mount(){this.#w++,1===this.#w&&(this.#_=h.m.subscribe((()=>{h.m.isFocused()&&(this.resumePausedMutations(),this.#v.onFocus())})),this.#S=p.t.subscribe((e=>{e&&(this.resumePausedMutations(),this.#v.onOnline())})))}unmount(){this.#w--,0===this.#w&&(this.#_?.(),this.#_=void 0,this.#S?.(),this.#S=void 0)}isFetching(e){return this.#v.findAll({...e,fetchStatus:"fetching"}).length}isMutating(e){return this.#i.findAll({...e,status:"pending"}).length}getQueryData(e){const t=this.defaultQueryOptions({queryKey:e});return this.#v.get(t.queryHash)?.state.data}ensureQueryData(e){const t=this.getQueryData(e.queryKey);return void 0!==t?Promise.resolve(t):this.fetchQuery(e)}getQueriesData(e){return this.getQueryCache().findAll(e).map((({queryKey:e,state:t})=>[e,t.data]))}setQueryData(e,t,n){const o=this.defaultQueryOptions({queryKey:e}),i=this.#v.get(o.queryHash),a=i?.state.data,s=(0,r.Zw)(t,a);if(void 0!==s)return this.#v.build(this,o).setData(s,{...n,manual:!0})}setQueriesData(e,t,n){return o.j.batch((()=>this.getQueryCache().findAll(e).map((({queryKey:e})=>[e,this.setQueryData(e,t,n)]))))}getQueryState(e){const t=this.defaultQueryOptions({queryKey:e});return this.#v.get(t.queryHash)?.state}removeQueries(e){const t=this.#v;o.j.batch((()=>{t.findAll(e).forEach((e=>{t.remove(e)}))}))}resetQueries(e,t){const n=this.#v,r={type:"active",...e};return o.j.batch((()=>(n.findAll(e).forEach((e=>{e.reset()})),this.refetchQueries(r,t))))}cancelQueries(e={},t={}){const n={revert:!0,...t},i=o.j.batch((()=>this.#v.findAll(e).map((e=>e.cancel(n)))));return Promise.all(i).then(r.lQ).catch(r.lQ)}invalidateQueries(e={},t={}){return o.j.batch((()=>{if(this.#v.findAll(e).forEach((e=>{e.invalidate()})),"none"===e.refetchType)return Promise.resolve();const n={...e,type:e.refetchType??e.type??"active"};return this.refetchQueries(n,t)}))}refetchQueries(e={},t){const n={...t,cancelRefetch:t?.cancelRefetch??!0},i=o.j.batch((()=>this.#v.findAll(e).filter((e=>!e.isDisabled())).map((e=>{let t=e.fetch(void 0,n);return n.throwOnError||(t=t.catch(r.lQ)),"paused"===e.state.fetchStatus?Promise.resolve():t}))));return Promise.all(i).then(r.lQ)}fetchQuery(e){const t=this.defaultQueryOptions(e);void 0===t.retry&&(t.retry=!1);const n=this.#v.build(this,t);return n.isStaleByTime(t.staleTime)?n.fetch(t):Promise.resolve(n.state.data)}prefetchQuery(e){return this.fetchQuery(e).then(r.lQ).catch(r.lQ)}fetchInfiniteQuery(e){return e.behavior=f(e.pages),this.fetchQuery(e)}prefetchInfiniteQuery(e){return this.fetchInfiniteQuery(e).then(r.lQ).catch(r.lQ)}resumePausedMutations(){return p.t.isOnline()?this.#i.resumePausedMutations():Promise.resolve()}getQueryCache(){return this.#v}getMutationCache(){return this.#i}getDefaultOptions(){return this.#o}setDefaultOptions(e){this.#o=e}setQueryDefaults(e,t){this.#x.set((0,r.EN)(e),{queryKey:e,defaultOptions:t})}getQueryDefaults(e){const t=[...this.#x.values()];let n={};return t.forEach((t=>{(0,r.Cp)(e,t.queryKey)&&(n={...n,...t.defaultOptions})})),n}setMutationDefaults(e,t){this.#k.set((0,r.EN)(e),{mutationKey:e,defaultOptions:t})}getMutationDefaults(e){const t=[...this.#k.values()];let n={};return t.forEach((t=>{(0,r.Cp)(e,t.mutationKey)&&(n={...n,...t.defaultOptions})})),n}defaultQueryOptions(e){if(e._defaulted)return e;const t={...this.#o.queries,...this.getQueryDefaults(e.queryKey),...e,_defaulted:!0};return t.queryHash||(t.queryHash=(0,r.F$)(t.queryKey,t)),void 0===t.refetchOnReconnect&&(t.refetchOnReconnect="always"!==t.networkMode),void 0===t.throwOnError&&(t.throwOnError=!!t.suspense),!t.networkMode&&t.persister&&(t.networkMode="offlineFirst"),!0!==t.enabled&&t.queryFn===r.hT&&(t.enabled=!1),t}defaultMutationOptions(e){return e?._defaulted?e:{...this.#o.mutations,...e?.mutationKey&&this.getMutationDefaults(e.mutationKey),...e,_defaulted:!0}}clear(){this.#v.clear(),this.#i.clear()}}},1692:(e,t,n)=>{"use strict";n.d(t,{k:()=>o});var r=n(4880),o=class{#E;destroy(){this.clearGcTimeout()}scheduleGc(){this.clearGcTimeout(),(0,r.gn)(this.gcTime)&&(this.#E=setTimeout((()=>{this.optionalRemove()}),this.gcTime))}updateGcTime(e){this.gcTime=Math.max(this.gcTime||0,e??(r.S$?1/0:3e5))}clearGcTimeout(){this.#E&&(clearTimeout(this.#E),this.#E=void 0)}}},8904:(e,t,n)=>{"use strict";n.d(t,{II:()=>u,v_:()=>s,wm:()=>c});var r=n(9658),o=n(6035),i=n(4880);function a(e){return Math.min(1e3*2**e,3e4)}function s(e){return"online"!==(e??"online")||o.t.isOnline()}var l=class{constructor(e){this.revert=e?.revert,this.silent=e?.silent}};function c(e){return e instanceof l}function u(e){let t,n,c,u=!1,d=0,h=!1;const p=new Promise(((e,t)=>{n=e,c=t})),f=()=>!r.m.isFocused()||"always"!==e.networkMode&&!o.t.isOnline(),m=r=>{h||(h=!0,e.onSuccess?.(r),t?.(),n(r))},g=n=>{h||(h=!0,e.onError?.(n),t?.(),c(n))},y=()=>new Promise((n=>{t=e=>{const t=h||!f();return t&&n(e),t},e.onPause?.()})).then((()=>{t=void 0,h||e.onContinue?.()})),b=()=>{if(h)return;let t;try{t=e.fn()}catch(e){t=Promise.reject(e)}Promise.resolve(t).then(m).catch((t=>{if(h)return;const n=e.retry??(i.S$?0:3),r=e.retryDelay??a,o="function"==typeof r?r(d,t):r,s=!0===n||"number"==typeof n&&d<n||"function"==typeof n&&n(d,t);!u&&s?(d++,e.onFail?.(d,t),(0,i.yy)(o).then((()=>{if(f())return y()})).then((()=>{u?g(t):b()}))):g(t)}))};return s(e.networkMode)?b():y().then(b),{promise:p,cancel:t=>{h||(g(new l(t)),e.abort?.())},continue:()=>{const e=t?.();return e?p:Promise.resolve()},cancelRetry:()=>{u=!0},continueRetry:()=>{u=!1}}}},6500:(e,t,n)=>{"use strict";n.d(t,{Q:()=>r});var r=class{constructor(){this.listeners=new Set,this.subscribe=this.subscribe.bind(this)}subscribe(e){return this.listeners.add(e),this.onSubscribe(),()=>{this.listeners.delete(e),this.onUnsubscribe()}}hasListeners(){return this.listeners.size>0}onSubscribe(){}onUnsubscribe(){}}},4880:(e,t,n)=>{"use strict";n.d(t,{Cp:()=>h,EN:()=>d,F$:()=>u,MK:()=>l,S$:()=>r,ZZ:()=>k,Zw:()=>i,f8:()=>f,gn:()=>a,hT:()=>w,j3:()=>s,lQ:()=>o,nJ:()=>c,pl:()=>v,y9:()=>x,yy:()=>b});var r="undefined"==typeof window||"Deno"in window;function o(){}function i(e,t){return"function"==typeof e?e(t):e}function a(e){return"number"==typeof e&&e>=0&&e!==1/0}function s(e,t){return Math.max(e+(t||0)-Date.now(),0)}function l(e,t){const{type:n="all",exact:r,fetchStatus:o,predicate:i,queryKey:a,stale:s}=e;if(a)if(r){if(t.queryHash!==u(a,t.options))return!1}else if(!h(t.queryKey,a))return!1;if("all"!==n){const e=t.isActive();if("active"===n&&!e)return!1;if("inactive"===n&&e)return!1}return("boolean"!=typeof s||t.isStale()===s)&&((!o||o===t.state.fetchStatus)&&!(i&&!i(t)))}function c(e,t){const{exact:n,status:r,predicate:o,mutationKey:i}=e;if(i){if(!t.options.mutationKey)return!1;if(n){if(d(t.options.mutationKey)!==d(i))return!1}else if(!h(t.options.mutationKey,i))return!1}return(!r||t.state.status===r)&&!(o&&!o(t))}function u(e,t){return(t?.queryKeyHashFn||d)(e)}function d(e){return JSON.stringify(e,((e,t)=>g(t)?Object.keys(t).sort().reduce(((e,n)=>(e[n]=t[n],e)),{}):t))}function h(e,t){return e===t||typeof e==typeof t&&(!(!e||!t||"object"!=typeof e||"object"!=typeof t)&&!Object.keys(t).some((n=>!h(e[n],t[n]))))}function p(e,t){if(e===t)return e;const n=m(e)&&m(t);if(n||g(e)&&g(t)){const r=n?e:Object.keys(e),o=r.length,i=n?t:Object.keys(t),a=i.length,s=n?[]:{};let l=0;for(let o=0;o<a;o++){const a=n?o:i[o];!n&&void 0===e[a]&&void 0===t[a]&&r.includes(a)?(s[a]=void 0,l++):(s[a]=p(e[a],t[a]),s[a]===e[a]&&void 0!==e[a]&&l++)}return o===a&&l===o?e:s}return t}function f(e,t){if(!t||Object.keys(e).length!==Object.keys(t).length)return!1;for(const n in e)if(e[n]!==t[n])return!1;return!0}function m(e){return Array.isArray(e)&&e.length===Object.keys(e).length}function g(e){if(!y(e))return!1;const t=e.constructor;if(void 0===t)return!0;const n=t.prototype;return!!y(n)&&!!n.hasOwnProperty("isPrototypeOf")}function y(e){return"[object Object]"===Object.prototype.toString.call(e)}function b(e){return new Promise((t=>{setTimeout(t,e)}))}function v(e,t,n){return"function"==typeof n.structuralSharing?n.structuralSharing(e,t):!1!==n.structuralSharing?p(e,t):t}function x(e,t,n=0){const r=[...e,t];return n&&r.length>n?r.slice(1):r}function k(e,t,n=0){const r=[t,...e];return n&&r.length>n?r.slice(0,-1):r}var w=Symbol()},7665:(e,t,n)=>{"use strict";n.d(t,{Ht:()=>s,jE:()=>a});var r=n(1594),o=n(4848),i=r.createContext(void 0),a=e=>{const t=r.useContext(i);if(e)return e;if(!t)throw new Error("No QueryClient set, use QueryClientProvider to set one");return t},s=({client:e,children:t})=>(r.useEffect((()=>(e.mount(),()=>{e.unmount()})),[e]),(0,o.jsx)(i.Provider,{value:e,children:t}))},7097:(e,t,n)=>{"use strict";n.d(t,{n:()=>d});var r=n(1594),o=n(6158),i=n(6261),a=n(6500),s=n(4880),l=class extends a.Q{#C;#A=void 0;#O;#M;constructor(e,t){super(),this.#C=e,this.setOptions(t),this.bindMethods(),this.#R()}bindMethods(){this.mutate=this.mutate.bind(this),this.reset=this.reset.bind(this)}setOptions(e){const t=this.options;this.options=this.#C.defaultMutationOptions(e),(0,s.f8)(this.options,t)||this.#C.getMutationCache().notify({type:"observerOptionsUpdated",mutation:this.#O,observer:this}),t?.mutationKey&&this.options.mutationKey&&(0,s.EN)(t.mutationKey)!==(0,s.EN)(this.options.mutationKey)?this.reset():this.#O?.setOptions(this.options)}onUnsubscribe(){this.hasListeners()||this.#O?.removeObserver(this)}onMutationUpdate(e){this.#R(),this.#P(e)}getCurrentResult(){return this.#A}reset(){this.#O?.removeObserver(this),this.#O=void 0,this.#R(),this.#P()}mutate(e,t){return this.#M=t,this.#O?.removeObserver(this),this.#O=this.#C.getMutationCache().build(this.#C,this.options),this.#O.addObserver(this),this.#O.execute(e)}#R(){const e=this.#O?.state??(0,o.$)();this.#A={...e,isPending:"pending"===e.status,isSuccess:"success"===e.status,isError:"error"===e.status,isIdle:"idle"===e.status,mutate:this.mutate,reset:this.reset}}#P(e){i.j.batch((()=>{if(this.#M&&this.hasListeners()){const t=this.#A.variables,n=this.#A.context;"success"===e?.type?(this.#M.onSuccess?.(e.data,t,n),this.#M.onSettled?.(e.data,null,t,n)):"error"===e?.type&&(this.#M.onError?.(e.error,t,n),this.#M.onSettled?.(void 0,e.error,t,n))}this.listeners.forEach((e=>{e(this.#A)}))}))}},c=n(7665),u=n(4362);function d(e,t){const n=(0,c.jE)(t),[o]=r.useState((()=>new l(n,e)));r.useEffect((()=>{o.setOptions(e)}),[o,e]);const a=r.useSyncExternalStore(r.useCallback((e=>o.subscribe(i.j.batchCalls(e))),[o]),(()=>o.getCurrentResult()),(()=>o.getCurrentResult())),s=r.useCallback(((e,t)=>{o.mutate(e,t).catch(u.l)}),[o]);if(a.error&&(0,u.G)(o.options.throwOnError,[a.error]))throw a.error;return{...a,mutate:s,mutateAsync:a.mutate}}},9270:(e,t,n)=>{"use strict";n.d(t,{I:()=>A});var r=n(4880),o=n(6261),i=n(9658),a=n(6500),s=n(8904),l=class extends a.Q{constructor(e,t){super(),this.options=t,this.#C=e,this.#T=null,this.bindMethods(),this.setOptions(t)}#C;#z=void 0;#j=void 0;#A=void 0;#I;#N;#T;#$;#L;#D;#F;#B;#W;#H=new Set;bindMethods(){this.refetch=this.refetch.bind(this)}onSubscribe(){1===this.listeners.size&&(this.#z.addObserver(this),c(this.#z,this.options)?this.#q():this.updateResult(),this.#U())}onUnsubscribe(){this.hasListeners()||this.destroy()}shouldFetchOnReconnect(){return u(this.#z,this.options,this.options.refetchOnReconnect)}shouldFetchOnWindowFocus(){return u(this.#z,this.options,this.options.refetchOnWindowFocus)}destroy(){this.listeners=new Set,this.#V(),this.#K(),this.#z.removeObserver(this)}setOptions(e,t){const n=this.options,o=this.#z;if(this.options=this.#C.defaultQueryOptions(e),void 0!==this.options.enabled&&"boolean"!=typeof this.options.enabled)throw new Error("Expected enabled to be a boolean");this.#Q(),(0,r.f8)(this.options,n)||this.#C.getQueryCache().notify({type:"observerOptionsUpdated",query:this.#z,observer:this});const i=this.hasListeners();i&&d(this.#z,o,this.options,n)&&this.#q(),this.updateResult(t),!i||this.#z===o&&this.options.enabled===n.enabled&&this.options.staleTime===n.staleTime||this.#Y();const a=this.#G();!i||this.#z===o&&this.options.enabled===n.enabled&&a===this.#W||this.#X(a)}getOptimisticResult(e){const t=this.#C.getQueryCache().build(this.#C,e),n=this.createResult(t,e);return function(e,t){if(!(0,r.f8)(e.getCurrentResult(),t))return!0;return!1}(this,n)&&(this.#A=n,this.#N=this.options,this.#I=this.#z.state),n}getCurrentResult(){return this.#A}trackResult(e,t){const n={};return Object.keys(e).forEach((r=>{Object.defineProperty(n,r,{configurable:!1,enumerable:!0,get:()=>(this.trackProp(r),t?.(r),e[r])})})),n}trackProp(e){this.#H.add(e)}getCurrentQuery(){return this.#z}refetch({...e}={}){return this.fetch({...e})}fetchOptimistic(e){const t=this.#C.defaultQueryOptions(e),n=this.#C.getQueryCache().build(this.#C,t);return n.isFetchingOptimistic=!0,n.fetch().then((()=>this.createResult(n,t)))}fetch(e){return this.#q({...e,cancelRefetch:e.cancelRefetch??!0}).then((()=>(this.updateResult(),this.#A)))}#q(e){this.#Q();let t=this.#z.fetch(this.options,e);return e?.throwOnError||(t=t.catch(r.lQ)),t}#Y(){if(this.#V(),r.S$||this.#A.isStale||!(0,r.gn)(this.options.staleTime))return;const e=(0,r.j3)(this.#A.dataUpdatedAt,this.options.staleTime)+1;this.#F=setTimeout((()=>{this.#A.isStale||this.updateResult()}),e)}#G(){return("function"==typeof this.options.refetchInterval?this.options.refetchInterval(this.#z):this.options.refetchInterval)??!1}#X(e){this.#K(),this.#W=e,!r.S$&&!1!==this.options.enabled&&(0,r.gn)(this.#W)&&0!==this.#W&&(this.#B=setInterval((()=>{(this.options.refetchIntervalInBackground||i.m.isFocused())&&this.#q()}),this.#W))}#U(){this.#Y(),this.#X(this.#G())}#V(){this.#F&&(clearTimeout(this.#F),this.#F=void 0)}#K(){this.#B&&(clearInterval(this.#B),this.#B=void 0)}createResult(e,t){const n=this.#z,o=this.options,i=this.#A,a=this.#I,l=this.#N,u=e!==n?e.state:this.#j,{state:p}=e;let f,{error:m,errorUpdatedAt:g,fetchStatus:y,status:b}=p,v=!1;if(t._optimisticResults){const r=this.hasListeners(),i=!r&&c(e,t),a=r&&d(e,n,t,o);(i||a)&&(y=(0,s.v_)(e.options.networkMode)?"fetching":"paused",void 0===p.data&&(b="pending")),"isRestoring"===t._optimisticResults&&(y="idle")}if(t.select&&void 0!==p.data)if(i&&p.data===a?.data&&t.select===this.#$)f=this.#L;else try{this.#$=t.select,f=t.select(p.data),f=(0,r.pl)(i?.data,f,t),this.#L=f,this.#T=null}catch(e){this.#T=e}else f=p.data;if(void 0!==t.placeholderData&&void 0===f&&"pending"===b){let e;if(i?.isPlaceholderData&&t.placeholderData===l?.placeholderData)e=i.data;else if(e="function"==typeof t.placeholderData?t.placeholderData(this.#D?.state.data,this.#D):t.placeholderData,t.select&&void 0!==e)try{e=t.select(e),this.#T=null}catch(e){this.#T=e}void 0!==e&&(b="success",f=(0,r.pl)(i?.data,e,t),v=!0)}this.#T&&(m=this.#T,f=this.#L,g=Date.now(),b="error");const x="fetching"===y,k="pending"===b,w="error"===b,_=k&&x,S=void 0!==p.data;return{status:b,fetchStatus:y,isPending:k,isSuccess:"success"===b,isError:w,isInitialLoading:_,isLoading:_,data:f,dataUpdatedAt:p.dataUpdatedAt,error:m,errorUpdatedAt:g,failureCount:p.fetchFailureCount,failureReason:p.fetchFailureReason,errorUpdateCount:p.errorUpdateCount,isFetched:p.dataUpdateCount>0||p.errorUpdateCount>0,isFetchedAfterMount:p.dataUpdateCount>u.dataUpdateCount||p.errorUpdateCount>u.errorUpdateCount,isFetching:x,isRefetching:x&&!k,isLoadingError:w&&!S,isPaused:"paused"===y,isPlaceholderData:v,isRefetchError:w&&S,isStale:h(e,t),refetch:this.refetch}}updateResult(e){const t=this.#A,n=this.createResult(this.#z,this.options);if(this.#I=this.#z.state,this.#N=this.options,void 0!==this.#I.data&&(this.#D=this.#z),(0,r.f8)(n,t))return;this.#A=n;const o={};!1!==e?.listeners&&(()=>{if(!t)return!0;const{notifyOnChangeProps:e}=this.options,n="function"==typeof e?e():e;if("all"===n||!n&&!this.#H.size)return!0;const r=new Set(n??this.#H);return this.options.throwOnError&&r.add("error"),Object.keys(this.#A).some((e=>{const n=e;return this.#A[n]!==t[n]&&r.has(n)}))})()&&(o.listeners=!0),this.#P({...o,...e})}#Q(){const e=this.#C.getQueryCache().build(this.#C,this.options);if(e===this.#z)return;const t=this.#z;this.#z=e,this.#j=e.state,this.hasListeners()&&(t?.removeObserver(this),e.addObserver(this))}onQueryUpdate(){this.updateResult(),this.hasListeners()&&this.#U()}#P(e){o.j.batch((()=>{e.listeners&&this.listeners.forEach((e=>{e(this.#A)})),this.#C.getQueryCache().notify({query:this.#z,type:"observerResultsUpdated"})}))}};function c(e,t){return function(e,t){return!1!==t.enabled&&void 0===e.state.data&&!("error"===e.state.status&&!1===t.retryOnMount)}(e,t)||void 0!==e.state.data&&u(e,t,t.refetchOnMount)}function u(e,t,n){if(!1!==t.enabled){const r="function"==typeof n?n(e):n;return"always"===r||!1!==r&&h(e,t)}return!1}function d(e,t,n,r){return!1!==n.enabled&&(e!==t||!1===r.enabled)&&(!n.suspense||"error"!==e.state.status)&&h(e,n)}function h(e,t){return e.isStaleByTime(t.staleTime)}var p=n(1594);n(4848);function f(){let e=!1;return{clearReset:()=>{e=!1},reset:()=>{e=!0},isReset:()=>e}}var m=p.createContext(f()),g=()=>p.useContext(m),y=n(7665),b=p.createContext(!1),v=()=>p.useContext(b),x=(b.Provider,n(4362)),k=(e,t)=>{(e.suspense||e.throwOnError)&&(t.isReset()||(e.retryOnMount=!1))},w=e=>{p.useEffect((()=>{e.clearReset()}),[e])},_=({result:e,errorResetBoundary:t,throwOnError:n,query:r})=>e.isError&&!t.isReset()&&!e.isFetching&&r&&(0,x.G)(n,[e.error,r]),S=e=>{e.suspense&&"number"!=typeof e.staleTime&&(e.staleTime=1e3)},E=(e,t)=>e?.suspense&&t.isPending,C=(e,t,n)=>t.fetchOptimistic(e).catch((()=>{n.clearReset()}));function A(e,t){return function(e,t,n){const r=(0,y.jE)(n),i=v(),a=g(),s=r.defaultQueryOptions(e);s._optimisticResults=i?"isRestoring":"optimistic",S(s),k(s,a),w(a);const[l]=p.useState((()=>new t(r,s))),c=l.getOptimisticResult(s);if(p.useSyncExternalStore(p.useCallback((e=>{const t=i?()=>{}:l.subscribe(o.j.batchCalls(e));return l.updateResult(),t}),[l,i]),(()=>l.getCurrentResult()),(()=>l.getCurrentResult())),p.useEffect((()=>{l.setOptions(s,{listeners:!1})}),[s,l]),E(s,c))throw C(s,l,a);if(_({result:c,errorResetBoundary:a,throwOnError:s.throwOnError,query:r.getQueryCache().get(s.queryHash)}))throw c.error;return s.notifyOnChangeProps?c:l.trackResult(c)}(e,l,t)}},4362:(e,t,n)=>{"use strict";function r(e,t){return"function"==typeof e?e(...t):!!e}function o(){}n.d(t,{G:()=>r,l:()=>o})},421:(e,t,n)=>{"use strict";n.d(t,{p2:()=>vn});var r=n(4848),o=n(85),i=n(1594),a=(n(4300),n(4146),n(2142),n(1287),r.Fragment);function s(e,t,n){return o.h.call(t,"css")?r.jsx(o.E,(0,o.c)(e,t),n):r.jsx(e,t,n)}function l(e,t,n){return o.h.call(t,"css")?r.jsxs(o.E,(0,o.c)(e,t),n):r.jsxs(e,t,n)}var c=n(8168),u=n(8587);function d(e){var t,n,r="";if("string"==typeof e||"number"==typeof e)r+=e;else if("object"==typeof e)if(Array.isArray(e)){var o=e.length;for(t=0;t<o;t++)e[t]&&(n=d(e[t]))&&(r&&(r+=" "),r+=n)}else for(n in e)e[n]&&(r&&(r+=" "),r+=n);return r}const h=function(){for(var e,t,n=0,r="",o=arguments.length;n<o;n++)(e=arguments[n])&&(t=d(e))&&(r&&(r+=" "),r+=t);return r};var p=n(2532),f=n(3571),m=n(9599),g=n(8749);const y=function(e=null){const t=i.useContext(o.T);return t&&(n=t,0!==Object.keys(n).length)?t:e;var n},b=(0,g.A)();const v=function(e=b){return y(e)},x=["className","component"];const k=e=>e,w=(()=>{let e=k;return{configure(t){e=t},generate:t=>e(t),reset(){e=k}}})();var _=n(5697),S=n(4521),E=n(4188);var C=n(771);const A={black:"#000",white:"#fff"},O={50:"#fafafa",100:"#f5f5f5",200:"#eeeeee",300:"#e0e0e0",400:"#bdbdbd",500:"#9e9e9e",600:"#757575",700:"#616161",800:"#424242",900:"#212121",A100:"#f5f5f5",A200:"#eeeeee",A400:"#bdbdbd",A700:"#616161"},M={50:"#f3e5f5",100:"#e1bee7",200:"#ce93d8",300:"#ba68c8",400:"#ab47bc",500:"#9c27b0",600:"#8e24aa",700:"#7b1fa2",800:"#6a1b9a",900:"#4a148c",A100:"#ea80fc",A200:"#e040fb",A400:"#d500f9",A700:"#aa00ff"},R={50:"#ffebee",100:"#ffcdd2",200:"#ef9a9a",300:"#e57373",400:"#ef5350",500:"#f44336",600:"#e53935",700:"#d32f2f",800:"#c62828",900:"#b71c1c",A100:"#ff8a80",A200:"#ff5252",A400:"#ff1744",A700:"#d50000"},P={50:"#fff3e0",100:"#ffe0b2",200:"#ffcc80",300:"#ffb74d",400:"#ffa726",500:"#ff9800",600:"#fb8c00",700:"#f57c00",800:"#ef6c00",900:"#e65100",A100:"#ffd180",A200:"#ffab40",A400:"#ff9100",A700:"#ff6d00"},T={50:"#e3f2fd",100:"#bbdefb",200:"#90caf9",300:"#64b5f6",400:"#42a5f5",500:"#2196f3",600:"#1e88e5",700:"#1976d2",800:"#1565c0",900:"#0d47a1",A100:"#82b1ff",A200:"#448aff",A400:"#2979ff",A700:"#2962ff"},z={50:"#e1f5fe",100:"#b3e5fc",200:"#81d4fa",300:"#4fc3f7",400:"#29b6f6",500:"#03a9f4",600:"#039be5",700:"#0288d1",800:"#0277bd",900:"#01579b",A100:"#80d8ff",A200:"#40c4ff",A400:"#00b0ff",A700:"#0091ea"},j={50:"#e8f5e9",100:"#c8e6c9",200:"#a5d6a7",300:"#81c784",400:"#66bb6a",500:"#4caf50",600:"#43a047",700:"#388e3c",800:"#2e7d32",900:"#1b5e20",A100:"#b9f6ca",A200:"#69f0ae",A400:"#00e676",A700:"#00c853"},I=["mode","contrastThreshold","tonalOffset"],N={text:{primary:"rgba(0, 0, 0, 0.87)",secondary:"rgba(0, 0, 0, 0.6)",disabled:"rgba(0, 0, 0, 0.38)"},divider:"rgba(0, 0, 0, 0.12)",background:{paper:A.white,default:A.white},action:{active:"rgba(0, 0, 0, 0.54)",hover:"rgba(0, 0, 0, 0.04)",hoverOpacity:.04,selected:"rgba(0, 0, 0, 0.08)",selectedOpacity:.08,disabled:"rgba(0, 0, 0, 0.26)",disabledBackground:"rgba(0, 0, 0, 0.12)",disabledOpacity:.38,focus:"rgba(0, 0, 0, 0.12)",focusOpacity:.12,activatedOpacity:.12}},$={text:{primary:A.white,secondary:"rgba(255, 255, 255, 0.7)",disabled:"rgba(255, 255, 255, 0.5)",icon:"rgba(255, 255, 255, 0.5)"},divider:"rgba(255, 255, 255, 0.12)",background:{paper:"#121212",default:"#121212"},action:{active:A.white,hover:"rgba(255, 255, 255, 0.08)",hoverOpacity:.08,selected:"rgba(255, 255, 255, 0.16)",selectedOpacity:.16,disabled:"rgba(255, 255, 255, 0.3)",disabledBackground:"rgba(255, 255, 255, 0.12)",disabledOpacity:.38,focus:"rgba(255, 255, 255, 0.12)",focusOpacity:.12,activatedOpacity:.24}};function L(e,t,n,r){const o=r.light||r,i=r.dark||1.5*r;e[t]||(e.hasOwnProperty(n)?e[t]=e[n]:"light"===t?e.light=(0,C.a)(e.main,o):"dark"===t&&(e.dark=(0,C.e$)(e.main,i)))}function D(e){const{mode:t="light",contrastThreshold:n=3,tonalOffset:r=.2}=e,o=(0,u.A)(e,I),i=e.primary||function(e="light"){return"dark"===e?{main:T[200],light:T[50],dark:T[400]}:{main:T[700],light:T[400],dark:T[800]}}(t),a=e.secondary||function(e="light"){return"dark"===e?{main:M[200],light:M[50],dark:M[400]}:{main:M[500],light:M[300],dark:M[700]}}(t),s=e.error||function(e="light"){return"dark"===e?{main:R[500],light:R[300],dark:R[700]}:{main:R[700],light:R[400],dark:R[800]}}(t),l=e.info||function(e="light"){return"dark"===e?{main:z[400],light:z[300],dark:z[700]}:{main:z[700],light:z[500],dark:z[900]}}(t),d=e.success||function(e="light"){return"dark"===e?{main:j[400],light:j[300],dark:j[700]}:{main:j[800],light:j[500],dark:j[900]}}(t),h=e.warning||function(e="light"){return"dark"===e?{main:P[400],light:P[300],dark:P[700]}:{main:"#ed6c02",light:P[500],dark:P[900]}}(t);function p(e){return(0,C.eM)(e,$.text.primary)>=n?$.text.primary:N.text.primary}const f=({color:e,name:t,mainShade:n=500,lightShade:o=300,darkShade:i=700})=>{if(!(e=(0,c.A)({},e)).main&&e[n]&&(e.main=e[n]),!e.hasOwnProperty("main"))throw new Error((0,_.A)(11,t?` (${t})`:"",n));if("string"!=typeof e.main)throw new Error((0,_.A)(12,t?` (${t})`:"",JSON.stringify(e.main)));return L(e,"light",o,r),L(e,"dark",i,r),e.contrastText||(e.contrastText=p(e.main)),e},m={dark:$,light:N};return(0,S.A)((0,c.A)({common:(0,c.A)({},A),mode:t,primary:f({color:i,name:"primary"}),secondary:f({color:a,name:"secondary",mainShade:"A400",lightShade:"A200",darkShade:"A700"}),error:f({color:s,name:"error"}),warning:f({color:h,name:"warning"}),info:f({color:l,name:"info"}),success:f({color:d,name:"success"}),grey:O,contrastThreshold:n,getContrastText:p,augmentColor:f,tonalOffset:r},m[t]),o)}const F=["fontFamily","fontSize","fontWeightLight","fontWeightRegular","fontWeightMedium","fontWeightBold","htmlFontSize","allVariants","pxToRem"];const B={textTransform:"uppercase"},W='"Roboto", "Helvetica", "Arial", sans-serif';function H(e,t){const n="function"==typeof t?t(e):t,{fontFamily:r=W,fontSize:o=14,fontWeightLight:i=300,fontWeightRegular:a=400,fontWeightMedium:s=500,fontWeightBold:l=700,htmlFontSize:d=16,allVariants:h,pxToRem:p}=n,f=(0,u.A)(n,F);const m=o/14,g=p||(e=>e/d*m+"rem"),y=(e,t,n,o,i)=>{return(0,c.A)({fontFamily:r,fontWeight:e,fontSize:g(t),lineHeight:n},r===W?{letterSpacing:(a=o/t,Math.round(1e5*a)/1e5)+"em"}:{},i,h);var a},b={h1:y(i,96,1.167,-1.5),h2:y(i,60,1.2,-.5),h3:y(a,48,1.167,0),h4:y(a,34,1.235,.25),h5:y(a,24,1.334,0),h6:y(s,20,1.6,.15),subtitle1:y(a,16,1.75,.15),subtitle2:y(s,14,1.57,.1),body1:y(a,16,1.5,.15),body2:y(a,14,1.43,.15),button:y(s,14,1.75,.4,B),caption:y(a,12,1.66,.4),overline:y(a,12,2.66,1,B),inherit:{fontFamily:"inherit",fontWeight:"inherit",fontSize:"inherit",lineHeight:"inherit",letterSpacing:"inherit"}};return(0,S.A)((0,c.A)({htmlFontSize:d,pxToRem:g,fontFamily:r,fontSize:o,fontWeightLight:i,fontWeightRegular:a,fontWeightMedium:s,fontWeightBold:l},b),f,{clone:!1})}function q(...e){return[`${e[0]}px ${e[1]}px ${e[2]}px ${e[3]}px rgba(0,0,0,0.2)`,`${e[4]}px ${e[5]}px ${e[6]}px ${e[7]}px rgba(0,0,0,0.14)`,`${e[8]}px ${e[9]}px ${e[10]}px ${e[11]}px rgba(0,0,0,0.12)`].join(",")}const U=["none",q(0,2,1,-1,0,1,1,0,0,1,3,0),q(0,3,1,-2,0,2,2,0,0,1,5,0),q(0,3,3,-2,0,3,4,0,0,1,8,0),q(0,2,4,-1,0,4,5,0,0,1,10,0),q(0,3,5,-1,0,5,8,0,0,1,14,0),q(0,3,5,-1,0,6,10,0,0,1,18,0),q(0,4,5,-2,0,7,10,1,0,2,16,1),q(0,5,5,-3,0,8,10,1,0,3,14,2),q(0,5,6,-3,0,9,12,1,0,3,16,2),q(0,6,6,-3,0,10,14,1,0,4,18,3),q(0,6,7,-4,0,11,15,1,0,4,20,3),q(0,7,8,-4,0,12,17,2,0,5,22,4),q(0,7,8,-4,0,13,19,2,0,5,24,4),q(0,7,9,-4,0,14,21,2,0,5,26,4),q(0,8,9,-5,0,15,22,2,0,6,28,5),q(0,8,10,-5,0,16,24,2,0,6,30,5),q(0,8,11,-5,0,17,26,2,0,6,32,5),q(0,9,11,-5,0,18,28,2,0,7,34,6),q(0,9,12,-6,0,19,29,2,0,7,36,6),q(0,10,13,-6,0,20,31,3,0,8,38,7),q(0,10,13,-6,0,21,33,3,0,8,40,7),q(0,10,14,-6,0,22,35,3,0,8,42,7),q(0,11,14,-7,0,23,36,3,0,9,44,8),q(0,11,15,-7,0,24,38,3,0,9,46,8)],V=["duration","easing","delay"],K={easeInOut:"cubic-bezier(0.4, 0, 0.2, 1)",easeOut:"cubic-bezier(0.0, 0, 0.2, 1)",easeIn:"cubic-bezier(0.4, 0, 1, 1)",sharp:"cubic-bezier(0.4, 0, 0.6, 1)"},Q={shortest:150,shorter:200,short:250,standard:300,complex:375,enteringScreen:225,leavingScreen:195};function Y(e){return`${Math.round(e)}ms`}function G(e){if(!e)return 0;const t=e/36;return Math.round(10*(4+15*t**.25+t/5))}function X(e){const t=(0,c.A)({},K,e.easing),n=(0,c.A)({},Q,e.duration);return(0,c.A)({getAutoHeightDuration:G,create:(e=["all"],r={})=>{const{duration:o=n.standard,easing:i=t.easeInOut,delay:a=0}=r;(0,u.A)(r,V);return(Array.isArray(e)?e:[e]).map((e=>`${e} ${"string"==typeof o?o:Y(o)} ${i} ${"string"==typeof a?a:Y(a)}`)).join(",")}},e,{easing:t,duration:n})}const Z={mobileStepper:1e3,fab:1050,speedDial:1050,appBar:1100,drawer:1200,modal:1300,snackbar:1400,tooltip:1500},J=["breakpoints","mixins","spacing","palette","transitions","typography","shape"];function ee(e={},...t){const{mixins:n={},palette:r={},transitions:o={},typography:i={}}=e,a=(0,u.A)(e,J);if(e.vars)throw new Error((0,_.A)(18));const s=D(r),l=(0,g.A)(e);let d=(0,S.A)(l,{mixins:(h=l.breakpoints,p=n,(0,c.A)({toolbar:{minHeight:56,[h.up("xs")]:{"@media (orientation: landscape)":{minHeight:48}},[h.up("sm")]:{minHeight:64}}},p)),palette:s,shadows:U.slice(),typography:H(s,i),transitions:X(o),zIndex:(0,c.A)({},Z)});var h,p;return d=(0,S.A)(d,a),d=t.reduce(((e,t)=>(0,S.A)(e,t)),d),d.unstable_sxConfig=(0,c.A)({},E.A,null==a?void 0:a.unstable_sxConfig),d.unstable_sx=function(e){return(0,f.A)({sx:e,theme:this})},d}const te=ee,ne="$$material",re={active:"active",checked:"checked",completed:"completed",disabled:"disabled",error:"error",expanded:"expanded",focused:"focused",focusVisible:"focusVisible",open:"open",readOnly:"readOnly",required:"required",selected:"selected"};function oe(e,t,n="Mui"){const r=re[t];return r?`${n}-${r}`:`${w.generate(e)}-${t}`}function ie(e,t,n="Mui"){const r={};return t.forEach((t=>{r[t]=oe(e,t,n)})),r}const ae=ie("MuiBox",["root"]),se=te(),le=function(e={}){const{themeId:t,defaultTheme:n,defaultClassName:o="MuiBox-root",generateClassName:a}=e,s=(0,p.default)("div",{shouldForwardProp:e=>"theme"!==e&&"sx"!==e&&"as"!==e})(f.A);return i.forwardRef((function(e,i){const l=v(n),d=(0,m.A)(e),{className:p,component:f="div"}=d,g=(0,u.A)(d,x);return(0,r.jsx)(s,(0,c.A)({as:f,ref:i,className:h(p,a?a(o):o),theme:t&&l[t]||l},g))}))}({themeId:ne,defaultTheme:se,defaultClassName:ae.root,generateClassName:w.generate}),ce=le;function ue(...e){return i.useMemo((()=>e.every((e=>null==e))?null:t=>{e.forEach((e=>{!function(e,t){"function"==typeof e?e(t):e&&(e.current=t)}(e,t)}))}),e)}function de(e){const t=function(e){return e&&e.ownerDocument||document}(e);return t.defaultView||window}const he="undefined"!=typeof window?i.useLayoutEffect:i.useEffect;const pe=["onChange","maxRows","minRows","style","value"];function fe(e){return parseInt(e,10)||0}const me={visibility:"hidden",position:"absolute",overflow:"hidden",height:0,top:0,left:0,transform:"translateZ(0)"};const ge=i.forwardRef((function(e,t){const{onChange:n,maxRows:o,minRows:a=1,style:s,value:l}=e,d=(0,u.A)(e,pe),{current:h}=i.useRef(null!=l),p=i.useRef(null),f=ue(t,p),m=i.useRef(null),g=i.useCallback((()=>{const t=p.current,n=de(t).getComputedStyle(t);if("0px"===n.width)return{outerHeightStyle:0,overflowing:!1};const r=m.current;r.style.width=n.width,r.value=t.value||e.placeholder||"x","\n"===r.value.slice(-1)&&(r.value+=" ");const i=n.boxSizing,s=fe(n.paddingBottom)+fe(n.paddingTop),l=fe(n.borderBottomWidth)+fe(n.borderTopWidth),c=r.scrollHeight;r.value="x";const u=r.scrollHeight;let d=c;a&&(d=Math.max(Number(a)*u,d)),o&&(d=Math.min(Number(o)*u,d)),d=Math.max(d,u);return{outerHeightStyle:d+("border-box"===i?s+l:0),overflowing:Math.abs(d-c)<=1}}),[o,a,e.placeholder]),y=i.useCallback((()=>{const e=g();if(null==(t=e)||0===Object.keys(t).length||0===t.outerHeightStyle&&!t.overflowing)return;var t;const n=p.current;n.style.height=`${e.outerHeightStyle}px`,n.style.overflow=e.overflowing?"hidden":""}),[g]);he((()=>{const e=()=>{y()};let t;const n=function(e,t=166){let n;function r(...r){clearTimeout(n),n=setTimeout((()=>{e.apply(this,r)}),t)}return r.clear=()=>{clearTimeout(n)},r}(e),r=p.current,o=de(r);let i;return o.addEventListener("resize",n),"undefined"!=typeof ResizeObserver&&(i=new ResizeObserver(e),i.observe(r)),()=>{n.clear(),cancelAnimationFrame(t),o.removeEventListener("resize",n),i&&i.disconnect()}}),[g,y]),he((()=>{y()}));return(0,r.jsxs)(i.Fragment,{children:[(0,r.jsx)("textarea",(0,c.A)({value:l,onChange:e=>{h||y(),n&&n(e)},ref:f,rows:a},d)),(0,r.jsx)("textarea",{"aria-hidden":!0,className:e.className,readOnly:!0,ref:m,tabIndex:-1,style:(0,c.A)({},me,s,{paddingTop:0,paddingBottom:0})})]})}));function ye(e){return"string"==typeof e}function be(e,t,n=void 0){const r={};return Object.keys(e).forEach((o=>{r[o]=e[o].reduce(((e,r)=>{if(r){const o=t(r);""!==o&&e.push(o),n&&n[r]&&e.push(n[r])}return e}),[]).join(" ")})),r}const ve=i.createContext(void 0);var xe=n(6461);const ke=te(),we=(0,xe.Ay)({themeId:ne,defaultTheme:ke,rootShouldForwardProp:e=>(0,xe.MC)(e)&&"classes"!==e});function _e(e,t){const n=(0,c.A)({},t);return Object.keys(e).forEach((r=>{if(r.toString().match(/^(components|slots)$/))n[r]=(0,c.A)({},e[r],n[r]);else if(r.toString().match(/^(componentsProps|slotProps)$/)){const o=e[r]||{},i=t[r];n[r]={},i&&Object.keys(i)?o&&Object.keys(o)?(n[r]=(0,c.A)({},i),Object.keys(o).forEach((e=>{n[r][e]=_e(o[e],i[e])}))):n[r]=i:n[r]=o}else void 0===n[r]&&(n[r]=e[r])})),n}function Se(e){const{theme:t,name:n,props:r}=e;return t&&t.components&&t.components[n]&&t.components[n].defaultProps?_e(t.components[n].defaultProps,r):r}function Ee({props:e,name:t}){return function({props:e,name:t,defaultTheme:n,themeId:r}){let o=v(n);return r&&(o=o[r]||o),Se({theme:o,name:t,props:e})}({props:e,name:t,defaultTheme:ke,themeId:ne})}const Ce=n(8659).A,Ae=ue,Oe=he;var Me=n(9940);const Re=function({styles:e,themeId:t,defaultTheme:n={}}){const o=v(n),i="function"==typeof e?e(t&&o[t]||o):e;return(0,r.jsx)(Me.A,{styles:i})};const Pe=function(e){return(0,r.jsx)(Re,(0,c.A)({},e,{defaultTheme:ke,themeId:ne}))};function Te(e){return null!=e&&!(Array.isArray(e)&&0===e.length)}function ze(e){return oe("MuiInputBase",e)}const je=ie("MuiInputBase",["root","formControl","focused","disabled","adornedStart","adornedEnd","error","sizeSmall","multiline","colorSecondary","fullWidth","hiddenLabel","readOnly","input","inputSizeSmall","inputMultiline","inputTypeSearch","inputAdornedStart","inputAdornedEnd","inputHiddenLabel"]),Ie=["aria-describedby","autoComplete","autoFocus","className","color","components","componentsProps","defaultValue","disabled","disableInjectingGlobalStyles","endAdornment","error","fullWidth","id","inputComponent","inputProps","inputRef","margin","maxRows","minRows","multiline","name","onBlur","onChange","onClick","onFocus","onKeyDown","onKeyUp","placeholder","readOnly","renderSuffix","rows","size","slotProps","slots","startAdornment","type","value"],Ne=we("div",{name:"MuiInputBase",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:n}=e;return[t.root,n.formControl&&t.formControl,n.startAdornment&&t.adornedStart,n.endAdornment&&t.adornedEnd,n.error&&t.error,"small"===n.size&&t.sizeSmall,n.multiline&&t.multiline,n.color&&t[`color${Ce(n.color)}`],n.fullWidth&&t.fullWidth,n.hiddenLabel&&t.hiddenLabel]}})((({theme:e,ownerState:t})=>(0,c.A)({},e.typography.body1,{color:(e.vars||e).palette.text.primary,lineHeight:"1.4375em",boxSizing:"border-box",position:"relative",cursor:"text",display:"inline-flex",alignItems:"center",[`&.${je.disabled}`]:{color:(e.vars||e).palette.text.disabled,cursor:"default"}},t.multiline&&(0,c.A)({padding:"4px 0 5px"},"small"===t.size&&{paddingTop:1}),t.fullWidth&&{width:"100%"}))),$e=we("input",{name:"MuiInputBase",slot:"Input",overridesResolver:(e,t)=>{const{ownerState:n}=e;return[t.input,"small"===n.size&&t.inputSizeSmall,n.multiline&&t.inputMultiline,"search"===n.type&&t.inputTypeSearch,n.startAdornment&&t.inputAdornedStart,n.endAdornment&&t.inputAdornedEnd,n.hiddenLabel&&t.inputHiddenLabel]}})((({theme:e,ownerState:t})=>{const n="light"===e.palette.mode,r=(0,c.A)({color:"currentColor"},e.vars?{opacity:e.vars.opacity.inputPlaceholder}:{opacity:n?.42:.5},{transition:e.transitions.create("opacity",{duration:e.transitions.duration.shorter})}),o={opacity:"0 !important"},i=e.vars?{opacity:e.vars.opacity.inputPlaceholder}:{opacity:n?.42:.5};return(0,c.A)({font:"inherit",letterSpacing:"inherit",color:"currentColor",padding:"4px 0 5px",border:0,boxSizing:"content-box",background:"none",height:"1.4375em",margin:0,WebkitTapHighlightColor:"transparent",display:"block",minWidth:0,width:"100%",animationName:"mui-auto-fill-cancel",animationDuration:"10ms","&::-webkit-input-placeholder":r,"&::-moz-placeholder":r,"&:-ms-input-placeholder":r,"&::-ms-input-placeholder":r,"&:focus":{outline:0},"&:invalid":{boxShadow:"none"},"&::-webkit-search-decoration":{WebkitAppearance:"none"},[`label[data-shrink=false] + .${je.formControl} &`]:{"&::-webkit-input-placeholder":o,"&::-moz-placeholder":o,"&:-ms-input-placeholder":o,"&::-ms-input-placeholder":o,"&:focus::-webkit-input-placeholder":i,"&:focus::-moz-placeholder":i,"&:focus:-ms-input-placeholder":i,"&:focus::-ms-input-placeholder":i},[`&.${je.disabled}`]:{opacity:1,WebkitTextFillColor:(e.vars||e).palette.text.disabled},"&:-webkit-autofill":{animationDuration:"5000s",animationName:"mui-auto-fill"}},"small"===t.size&&{paddingTop:1},t.multiline&&{height:"auto",resize:"none",padding:0,paddingTop:0},"search"===t.type&&{MozAppearance:"textfield"})})),Le=(0,r.jsx)(Pe,{styles:{"@keyframes mui-auto-fill":{from:{display:"block"}},"@keyframes mui-auto-fill-cancel":{from:{display:"block"}}}}),De=i.forwardRef((function(e,t){var n;const o=Ee({props:e,name:"MuiInputBase"}),{"aria-describedby":a,autoComplete:s,autoFocus:l,className:d,components:p={},componentsProps:f={},defaultValue:m,disabled:g,disableInjectingGlobalStyles:y,endAdornment:b,fullWidth:v=!1,id:x,inputComponent:k="input",inputProps:w={},inputRef:S,maxRows:E,minRows:C,multiline:A=!1,name:O,onBlur:M,onChange:R,onClick:P,onFocus:T,onKeyDown:z,onKeyUp:j,placeholder:I,readOnly:N,renderSuffix:$,rows:L,slotProps:D={},slots:F={},startAdornment:B,type:W="text",value:H}=o,q=(0,u.A)(o,Ie),U=null!=w.value?w.value:H,{current:V}=i.useRef(null!=U),K=i.useRef(),Q=i.useCallback((e=>{0}),[]),Y=Ae(K,S,w.ref,Q),[G,X]=i.useState(!1),Z=i.useContext(ve);const J=function({props:e,states:t,muiFormControl:n}){return t.reduce(((t,r)=>(t[r]=e[r],n&&void 0===e[r]&&(t[r]=n[r]),t)),{})}({props:o,muiFormControl:Z,states:["color","disabled","error","hiddenLabel","size","required","filled"]});J.focused=Z?Z.focused:G,i.useEffect((()=>{!Z&&g&&G&&(X(!1),M&&M())}),[Z,g,G,M]);const ee=Z&&Z.onFilled,te=Z&&Z.onEmpty,ne=i.useCallback((e=>{!function(e,t=!1){return e&&(Te(e.value)&&""!==e.value||t&&Te(e.defaultValue)&&""!==e.defaultValue)}(e)?te&&te():ee&&ee()}),[ee,te]);Oe((()=>{V&&ne({value:U})}),[U,ne,V]);i.useEffect((()=>{ne(K.current)}),[]);let re=k,oe=w;A&&"input"===re&&(oe=L?(0,c.A)({type:void 0,minRows:L,maxRows:L},oe):(0,c.A)({type:void 0,maxRows:E,minRows:C},oe),re=ge);i.useEffect((()=>{Z&&Z.setAdornedStart(Boolean(B))}),[Z,B]);const ie=(0,c.A)({},o,{color:J.color||"primary",disabled:J.disabled,endAdornment:b,error:J.error,focused:J.focused,formControl:Z,fullWidth:v,hiddenLabel:J.hiddenLabel,multiline:A,size:J.size,startAdornment:B,type:W}),ae=(e=>{const{classes:t,color:n,disabled:r,error:o,endAdornment:i,focused:a,formControl:s,fullWidth:l,hiddenLabel:c,multiline:u,readOnly:d,size:h,startAdornment:p,type:f}=e;return be({root:["root",`color${Ce(n)}`,r&&"disabled",o&&"error",l&&"fullWidth",a&&"focused",s&&"formControl",h&&"medium"!==h&&`size${Ce(h)}`,u&&"multiline",p&&"adornedStart",i&&"adornedEnd",c&&"hiddenLabel",d&&"readOnly"],input:["input",r&&"disabled","search"===f&&"inputTypeSearch",u&&"inputMultiline","small"===h&&"inputSizeSmall",c&&"inputHiddenLabel",p&&"inputAdornedStart",i&&"inputAdornedEnd",d&&"readOnly"]},ze,t)})(ie),se=F.root||p.Root||Ne,le=D.root||f.root||{},ce=F.input||p.Input||$e;return oe=(0,c.A)({},oe,null!=(n=D.input)?n:f.input),(0,r.jsxs)(i.Fragment,{children:[!y&&Le,(0,r.jsxs)(se,(0,c.A)({},le,!ye(se)&&{ownerState:(0,c.A)({},ie,le.ownerState)},{ref:t,onClick:e=>{K.current&&e.currentTarget===e.target&&K.current.focus(),P&&P(e)}},q,{className:h(ae.root,le.className,d,N&&"MuiInputBase-readOnly"),children:[B,(0,r.jsx)(ve.Provider,{value:null,children:(0,r.jsx)(ce,(0,c.A)({ownerState:ie,"aria-invalid":J.error,"aria-describedby":a,autoComplete:s,autoFocus:l,defaultValue:m,disabled:J.disabled,id:x,onAnimationStart:e=>{ne("mui-auto-fill-cancel"===e.animationName?K.current:{value:"x"})},name:O,placeholder:I,readOnly:N,required:J.required,rows:L,value:U,onKeyDown:z,onKeyUp:j,type:W},oe,!ye(ce)&&{as:re,ownerState:(0,c.A)({},ie,oe.ownerState)},{ref:Y,className:h(ae.input,oe.className,N&&"MuiInputBase-readOnly"),onBlur:e=>{M&&M(e),w.onBlur&&w.onBlur(e),Z&&Z.onBlur?Z.onBlur(e):X(!1)},onChange:(e,...t)=>{if(!V){const t=e.target||K.current;if(null==t)throw new Error((0,_.A)(1));ne({value:t.value})}w.onChange&&w.onChange(e,...t),R&&R(e,...t)},onFocus:e=>{J.disabled?e.stopPropagation():(T&&T(e),w.onFocus&&w.onFocus(e),Z&&Z.onFocus?Z.onFocus(e):X(!0))}}))}),b,$?$((0,c.A)({},J,{startAdornment:B})):null]}))]})}));function Fe(e){const{children:t,defer:n=!1,fallback:o=null}=e,[a,s]=i.useState(!1);return he((()=>{n||s(!0)}),[n]),i.useEffect((()=>{n&&s(!0)}),[n]),(0,r.jsx)(i.Fragment,{children:a?t:o})}function Be(e){return oe("MuiSvgIcon",e)}ie("MuiSvgIcon",["root","colorPrimary","colorSecondary","colorAction","colorError","colorDisabled","fontSizeInherit","fontSizeSmall","fontSizeMedium","fontSizeLarge"]);const We=["children","className","color","component","fontSize","htmlColor","inheritViewBox","titleAccess","viewBox"],He=we("svg",{name:"MuiSvgIcon",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:n}=e;return[t.root,"inherit"!==n.color&&t[`color${Ce(n.color)}`],t[`fontSize${Ce(n.fontSize)}`]]}})((({theme:e,ownerState:t})=>{var n,r,o,i,a,s,l,c,u,d,h,p,f;return{userSelect:"none",width:"1em",height:"1em",display:"inline-block",fill:t.hasSvgAsChild?void 0:"currentColor",flexShrink:0,transition:null==(n=e.transitions)||null==(r=n.create)?void 0:r.call(n,"fill",{duration:null==(o=e.transitions)||null==(o=o.duration)?void 0:o.shorter}),fontSize:{inherit:"inherit",small:(null==(i=e.typography)||null==(a=i.pxToRem)?void 0:a.call(i,20))||"1.25rem",medium:(null==(s=e.typography)||null==(l=s.pxToRem)?void 0:l.call(s,24))||"1.5rem",large:(null==(c=e.typography)||null==(u=c.pxToRem)?void 0:u.call(c,35))||"2.1875rem"}[t.fontSize],color:null!=(d=null==(h=(e.vars||e).palette)||null==(h=h[t.color])?void 0:h.main)?d:{action:null==(p=(e.vars||e).palette)||null==(p=p.action)?void 0:p.active,disabled:null==(f=(e.vars||e).palette)||null==(f=f.action)?void 0:f.disabled,inherit:void 0}[t.color]}})),qe=i.forwardRef((function(e,t){const n=Ee({props:e,name:"MuiSvgIcon"}),{children:o,className:a,color:s="inherit",component:l="svg",fontSize:d="medium",htmlColor:p,inheritViewBox:f=!1,titleAccess:m,viewBox:g="0 0 24 24"}=n,y=(0,u.A)(n,We),b=i.isValidElement(o)&&"svg"===o.type,v=(0,c.A)({},n,{color:s,component:l,fontSize:d,instanceFontSize:e.fontSize,inheritViewBox:f,viewBox:g,hasSvgAsChild:b}),x={};f||(x.viewBox=g);const k=(e=>{const{color:t,fontSize:n,classes:r}=e;return be({root:["root","inherit"!==t&&`color${Ce(t)}`,`fontSize${Ce(n)}`]},Be,r)})(v);return(0,r.jsxs)(He,(0,c.A)({as:l,className:h(k.root,a),focusable:"false",color:p,"aria-hidden":!m||void 0,role:m?"img":void 0,ref:t},x,y,b&&o.props,{ownerState:v,children:[b?o.props.children:o,m?(0,r.jsx)("title",{children:m}):null]}))}));qe.muiName="SvgIcon";const Ue=qe,Ve=e=>{let t;return t=e<1?5.11916*e**2:4.5*Math.log(e+1)+2,(t/100).toFixed(2)};function Ke(e){return oe("MuiPaper",e)}ie("MuiPaper",["root","rounded","outlined","elevation","elevation0","elevation1","elevation2","elevation3","elevation4","elevation5","elevation6","elevation7","elevation8","elevation9","elevation10","elevation11","elevation12","elevation13","elevation14","elevation15","elevation16","elevation17","elevation18","elevation19","elevation20","elevation21","elevation22","elevation23","elevation24"]);const Qe=["className","component","elevation","square","variant"],Ye=we("div",{name:"MuiPaper",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:n}=e;return[t.root,t[n.variant],!n.square&&t.rounded,"elevation"===n.variant&&t[`elevation${n.elevation}`]]}})((({theme:e,ownerState:t})=>{var n;return(0,c.A)({backgroundColor:(e.vars||e).palette.background.paper,color:(e.vars||e).palette.text.primary,transition:e.transitions.create("box-shadow")},!t.square&&{borderRadius:e.shape.borderRadius},"outlined"===t.variant&&{border:`1px solid ${(e.vars||e).palette.divider}`},"elevation"===t.variant&&(0,c.A)({boxShadow:(e.vars||e).shadows[t.elevation]},!e.vars&&"dark"===e.palette.mode&&{backgroundImage:`linear-gradient(${(0,C.X4)("#fff",Ve(t.elevation))}, ${(0,C.X4)("#fff",Ve(t.elevation))})`},e.vars&&{backgroundImage:null==(n=e.vars.overlays)?void 0:n[t.elevation]}))})),Ge=i.forwardRef((function(e,t){const n=Ee({props:e,name:"MuiPaper"}),{className:o,component:i="div",elevation:a=1,square:s=!1,variant:l="elevation"}=n,d=(0,u.A)(n,Qe),p=(0,c.A)({},n,{component:i,elevation:a,square:s,variant:l}),f=(e=>{const{square:t,elevation:n,variant:r,classes:o}=e;return be({root:["root",r,!t&&"rounded","elevation"===r&&`elevation${n}`]},Ke,o)})(p);return(0,r.jsx)(Ye,(0,c.A)({as:i,ownerState:p,className:h(f.root,o),ref:t},d))}));const Xe=i.createContext(null);function Ze(){return i.useContext(Xe)}const Je="function"==typeof Symbol&&Symbol.for?Symbol.for("mui.nested"):"__THEME_NESTED__";const et=function(e){const{children:t,theme:n}=e,o=Ze(),a=i.useMemo((()=>{const e=null===o?n:function(e,t){if("function"==typeof t)return t(e);return(0,c.A)({},e,t)}(o,n);return null!=e&&(e[Je]=null!==o),e}),[n,o]);return(0,r.jsx)(Xe.Provider,{value:a,children:t})},tt={};function nt(e,t,n,r=!1){return i.useMemo((()=>{const o=e&&t[e]||t;if("function"==typeof n){const i=n(o),a=e?(0,c.A)({},t,{[e]:i}):i;return r?()=>a:a}return e?(0,c.A)({},t,{[e]:n}):(0,c.A)({},t,n)}),[e,t,n,r])}const rt=function(e){const{children:t,theme:n,themeId:i}=e,a=y(tt),s=Ze()||tt,l=nt(i,a,n),c=nt(i,s,n,!0);return(0,r.jsx)(et,{theme:c,children:(0,r.jsx)(o.T.Provider,{value:l,children:t})})},ot=["theme"];function it(e){let{theme:t}=e,n=(0,u.A)(e,ot);const o=t[ne];return(0,r.jsx)(rt,(0,c.A)({},n,{themeId:o?ne:void 0,theme:o||t}))}const at=e=>{let t;const n=new Set,r=(e,r)=>{const o="function"==typeof e?e(t):e;if(!Object.is(o,t)){const e=t;t=(null!=r?r:"object"!=typeof o||null===o)?o:Object.assign({},t,o),n.forEach((n=>n(t,e)))}},o=()=>t,i={setState:r,getState:o,getInitialState:()=>a,subscribe:e=>(n.add(e),()=>n.delete(e)),destroy:()=>{console.warn("[DEPRECATED] The `destroy` method will be unsupported in a future version. Instead use unsubscribe function returned by subscribe. Everything will be garbage-collected if store is garbage-collected."),n.clear()}},a=t=e(r,o,i);return i},st=e=>e?at(e):at;var lt=n(9242);const{useDebugValue:ct}=i,{useSyncExternalStoreWithSelector:ut}=lt;let dt=!1;const ht=e=>e;function pt(e,t=ht,n){n&&!dt&&(console.warn("[DEPRECATED] Use `createWithEqualityFn` instead of `create` or use `useStoreWithEqualityFn` instead of `useStore`. They can be imported from 'zustand/traditional'. https://github.com/pmndrs/zustand/discussions/1937"),dt=!0);const r=ut(e.subscribe,e.getState,e.getServerState||e.getInitialState,t,n);return ct(r),r}const ft=e=>{"function"!=typeof e&&console.warn("[DEPRECATED] Passing a vanilla store will be unsupported in a future version. Instead use `import { useStore } from 'zustand'`.");const t="function"==typeof e?st(e):e,n=(e,n)=>pt(t,e,n);return Object.assign(n,t),n},mt=e=>e?ft(e):ft;var gt=n(7965);function yt(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function bt(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{},r=Object.keys(n);"function"==typeof Object.getOwnPropertySymbols&&(r=r.concat(Object.getOwnPropertySymbols(n).filter((function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable})))),r.forEach((function(t){yt(e,t,n[t])}))}return e}function vt(e,t){return t=null!=t?t:{},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):function(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))})),e}function xt(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function kt(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}function wt(e,t){if(e){if("string"==typeof e)return xt(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(n):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?xt(e,t):void 0}}function _t(e){return function(e){if(Array.isArray(e))return xt(e)}(e)||kt(e)||wt(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function St(e){var t,n,r="";if("string"==typeof e||"number"==typeof e)r+=e;else if("object"==typeof e)if(Array.isArray(e))for(t=0;t<e.length;t++)e[t]&&(n=St(e[t]))&&(r&&(r+=" "),r+=n);else for(t in e)e[t]&&(r&&(r+=" "),r+=t);return r}function Et(){for(var e,t,n=0,r="";n<arguments.length;)(e=arguments[n++])&&(t=St(e))&&(r&&(r+=" "),r+=t);return r}function Ct(e){if(Array.isArray(e))return e}function At(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function Ot(e,t){return Ct(e)||function(e,t){var n=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var r,o,i=[],a=!0,s=!1;try{for(n=n.call(e);!(a=(r=n.next()).done)&&(i.push(r.value),!t||i.length!==t);a=!0);}catch(e){s=!0,o=e}finally{try{a||null==n.return||n.return()}finally{if(s)throw o}}return i}}(e,t)||wt(e,t)||At()}function Mt(e){return e&&"undefined"!=typeof Symbol&&e.constructor===Symbol?"symbol":typeof e}var Rt={scheme:"Light Theme",author:"mac gainor (https://github.com/mac-s-g)",base00:"rgba(0, 0, 0, 0)",base01:"rgb(245, 245, 245)",base02:"rgb(235, 235, 235)",base03:"#93a1a1",base04:"rgba(0, 0, 0, 0.3)",base05:"#586e75",base06:"#073642",base07:"#002b36",base08:"#d33682",base09:"#cb4b16",base0A:"#ffd500",base0B:"#859900",base0C:"#6c71c4",base0D:"#586e75",base0E:"#2aa198",base0F:"#268bd2"},Pt={scheme:"Dark Theme",author:"Chris Kempson (http://chriskempson.com)",base00:"#181818",base01:"#282828",base02:"#383838",base03:"#585858",base04:"#b8b8b8",base05:"#d8d8d8",base06:"#e8e8e8",base07:"#f8f8f8",base08:"#ab4642",base09:"#dc9656",base0A:"#f7ca88",base0B:"#a1b56c",base0C:"#86c1b9",base0D:"#7cafc2",base0E:"#ba8baf",base0F:"#a16946"},Tt=function(){return null};Tt.when=function(){return!1};var zt=(0,i.createContext)(void 0);zt.Provider;var jt=function(e,t){return pt((0,i.useContext)(zt),e,t)},It=function(){return jt((function(e){return e.colorspace.base07}))};function Nt(e,t,n,r,o,i,a){try{var s=e[i](a),l=s.value}catch(e){return void n(e)}s.done?t(l):Promise.resolve(l).then(r,o)}function $t(e){return function(){var t=this,n=arguments;return new Promise((function(r,o){var i=e.apply(t,n);function a(e){Nt(i,r,o,a,s,"next",e)}function s(e){Nt(i,r,o,a,s,"throw",e)}a(void 0)}))}}function Lt(e,t){var n,r,o,i,a={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function s(s){return function(l){return function(s){if(n)throw new TypeError("Generator is already executing.");for(;i&&(i=0,s[0]&&(a=0)),a;)try{if(n=1,r&&(o=2&s[0]?r.return:s[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,s[1])).done)return o;switch(r=0,o&&(s=[2&s[0],o.value]),s[0]){case 0:case 1:o=s;break;case 4:return a.label++,{value:s[1],done:!1};case 5:a.label++,r=s[1],s=[0];continue;case 7:s=a.ops.pop(),a.trys.pop();continue;default:if(!(o=a.trys,(o=o.length>0&&o[o.length-1])||6!==s[0]&&2!==s[0])){a=0;continue}if(3===s[0]&&(!o||s[1]>o[0]&&s[1]<o[3])){a.label=s[1];break}if(6===s[0]&&a.label<o[1]){a.label=o[1],o=s;break}if(o&&a.label<o[2]){a.label=o[2],a.ops.push(s);break}o[2]&&a.ops.pop(),a.trys.pop();continue}s=t.call(e,a)}catch(e){s=[6,e],r=0}finally{n=o=0}if(5&s[0])throw s[1];return{value:s[0]?s[1]:void 0,done:!0}}([s,l])}}}function Dt(e,t){return null!=t&&"undefined"!=typeof Symbol&&t[Symbol.hasInstance]?!!t[Symbol.hasInstance](e):e instanceof t}Object.prototype.constructor.toString();var Ft=function(e,t,n){if(null===e||null===n)return!1;if("object"!=typeof e)return!1;if("object"!=typeof n)return!1;if(Object.is(e,n)&&0!==t.length)return"";for(var r=[],o=_t(t),i=e;i!==n||0!==o.length;){if("object"!=typeof i||null===i)return!1;if(Object.is(i,n))return r.reduce((function(e,t,n){return"number"==typeof t?e+"[".concat(t,"]"):e+"".concat(0===n?"":".").concat(t)}),"");var a=o.shift();r.push(a),i=i[a]}return!1};function Bt(e){return null===e?0:Array.isArray(e)?e.length:Dt(e,Map)||Dt(e,Set)?e.size:Dt(e,Date)?1:"object"==typeof e?Object.keys(e).length:"string"==typeof e?e.length:1}function Wt(e,t){for(var n=[],r=0;r<e.length;)n.push(e.slice(r,r+t)),r+=t;return n}function Ht(e){return qt.apply(this,arguments)}function qt(){return(qt=$t((function(e){return Lt(this,(function(t){switch(t.label){case 0:if(!("clipboard"in navigator))return[3,4];t.label=1;case 1:return t.trys.push([1,3,,4]),[4,navigator.clipboard.writeText(e)];case 2:case 3:return t.sent(),[3,4];case 4:return gt(e),[2]}}))}))).apply(this,arguments)}function Ut(){var e=(arguments.length>0&&void 0!==arguments[0]?arguments[0]:{}).timeout,t=void 0===e?2e3:e,n=Ot((0,i.useState)(!1),2),r=n[0],o=n[1],a=(0,i.useRef)(null),s=(0,i.useCallback)((function(e){var n=a.current;n&&window.clearTimeout(n),a.current=window.setTimeout((function(){return o(!1)}),t),o(e)}),[t]),l=jt((function(e){return e.onCopy})),c=(0,i.useCallback)(function(){var e=$t((function(e,t){var n,r,o;return Lt(this,(function(i){switch(i.label){case 0:if("function"!=typeof l)return[3,5];i.label=1;case 1:return i.trys.push([1,3,,4]),[4,l(e,t,Ht)];case 2:return i.sent(),s(!0),[3,4];case 3:return n=i.sent(),console.error("error when copy ".concat(0===e.length?"src":"src[".concat(e.join(".")),"]"),n),[3,4];case 4:return[3,8];case 5:return i.trys.push([5,7,,8]),a="function"==typeof t?t.toString():t,c="  ",u=[],r=JSON.stringify(a,(function(e,t){if("bigint"===(void 0===t?"undefined":Mt(t)))return t.toString();if(Dt(t,Map)){if("toJSON"in t&&"function"==typeof t.toJSON)return t.toJSON();if(0===t.size)return{};if(u.includes(t))return"[Circular]";u.push(t);var n=Array.from(t.entries());return n.every((function(e){var t=Ot(e,1)[0];return"string"==typeof t||"number"==typeof t}))?Object.fromEntries(n):{}}if(Dt(t,Set))return"toJSON"in t&&"function"==typeof t.toJSON?t.toJSON():u.includes(t)?"[Circular]":(u.push(t),Array.from(t.values()));if("object"==typeof t&&null!==t&&Object.keys(t).length){var r=u.length;if(r){for(var o=r-1;o>=0&&u[o][e]!==t;--o)u.pop();if(u.includes(t))return"[Circular]"}u.push(t)}return t}),c),[4,Ht(r)];case 6:return i.sent(),s(!0),[3,8];case 7:return o=i.sent(),console.error("error when copy ".concat(0===e.length?"src":"src[".concat(e.join(".")),"]"),o),[3,8];case 8:return[2]}var a,c,u}))}));return function(t,n){return e.apply(this,arguments)}}(),[s,l]);return{copy:c,reset:(0,i.useCallback)((function(){o(!1),a.current&&clearTimeout(a.current)}),[]),copied:r}}function Vt(e,t){var n=jt((function(e){return e.value}));return(0,i.useMemo)((function(){return Ft(n,e,t)}),[e,t,n])}var Kt=function(e){return s(ce,vt(bt({component:"div"},e),{sx:bt({display:"inline-block"},e.sx)}))},Qt=function(e){var t=e.dataType,n=e.enable;return void 0===n||n?s(Kt,{className:"data-type-label",sx:{mx:.5,fontSize:"0.7rem",opacity:.8,userSelect:"none"},children:t}):null};function Yt(e,t,n){var r=n.fromString,o=n.colorKey,a=n.displayTypeLabel,c=void 0===a||a,u=(0,i.memo)(t),d=function(t){var n=jt((function(e){return e.displayDataTypes})),r=jt((function(e){return e.colorspace[o]})),i=jt((function(e){return e.onSelect}));return l(Kt,{onClick:function(){return null==i?void 0:i(t.path,t.value)},sx:{color:r},children:[c&&n&&s(Qt,{dataType:e}),s(Kt,{className:"".concat(e,"-value"),children:s(u,{value:t.value})})]})};if(d.displayName="easy-".concat(e,"-type"),!r)return{Component:d};var h=function(e){var t=e.value,n=e.setValue,a=jt((function(e){return e.colorspace[o]}));return s(De,{value:t,onChange:(0,i.useCallback)((function(e){var t=r(e.target.value);n(t)}),[n]),size:"small",multiline:!0,sx:{color:a,padding:.5,borderStyle:"solid",borderColor:"black",borderWidth:1,fontSize:"0.8rem",fontFamily:"monospace",display:"inline-flex"}})};return h.displayName="easy-".concat(e,"-type-editor"),{Component:d,Editor:h}}var Gt=function(e){return l(Fe,{children:[s(Qt,{dataType:"function"}),l(ce,{component:"span",className:"data-function-start",sx:{letterSpacing:.5},children:[(t=e.value,n=t.toString(),-1!==n.indexOf("function")?n.substring(8,n.indexOf("{")).trim():n.substring(0,n.indexOf("=>")+2).trim())," ","{"]})]});var t,n},Xt=function(){return s(Fe,{children:s(ce,{component:"span",className:"data-function-end",children:"}"})})},Zt=function(e){var t,n,r,o,i,a=jt((function(e){return e.colorspace.base05}));return s(Fe,{children:s(ce,{className:"data-function",sx:{display:e.inspect?"block":"inline-block",pl:e.inspect?2:0,color:a},children:e.inspect?(t=e.value,n=t.toString(),r=!0,o=n.indexOf(")"),i=n.indexOf("=>"),-1!==i&&i>o&&(r=!1),r?n.substring(n.indexOf("{",o)+1,n.lastIndexOf("}")):n.substring(n.indexOf("=>")+2)):s(ce,{component:"span",className:"data-function-body",onClick:function(){return e.setInspect(!0)},sx:{"&:hover":{cursor:"pointer"},padding:.5},children:"…"})})})};function Jt(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var en=function(e){var t=e.d,n=Jt(e,["d"]);return s(Ue,vt(bt({},n),{children:s("path",{d:t})}))},tn=function(e){return s(en,bt({d:"M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"},e))},nn=function(e){return s(en,bt({d:"M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"},e))},rn=function(e){return s(en,bt({d:"M 12 2 C 10.615 1.998 9.214625 2.2867656 7.890625 2.8847656 L 8.9003906 4.6328125 C 9.9043906 4.2098125 10.957 3.998 12 4 C 15.080783 4 17.738521 5.7633175 19.074219 8.3222656 L 17.125 9 L 21.25 11 L 22.875 7 L 20.998047 7.6523438 C 19.377701 4.3110398 15.95585 2 12 2 z M 6.5097656 4.4882812 L 2.2324219 5.0820312 L 3.734375 6.3808594 C 1.6515335 9.4550558 1.3615962 13.574578 3.3398438 17 C 4.0308437 18.201 4.9801562 19.268234 6.1601562 20.115234 L 7.1699219 18.367188 C 6.3019219 17.710187 5.5922656 16.904 5.0722656 16 C 3.5320014 13.332354 3.729203 10.148679 5.2773438 7.7128906 L 6.8398438 9.0625 L 6.5097656 4.4882812 z M 19.929688 13 C 19.794687 14.08 19.450734 15.098 18.927734 16 C 17.386985 18.668487 14.531361 20.090637 11.646484 19.966797 L 12.035156 17.9375 L 8.2402344 20.511719 L 10.892578 23.917969 L 11.265625 21.966797 C 14.968963 22.233766 18.681899 20.426323 20.660156 17 C 21.355156 15.801 21.805219 14.445 21.949219 13 L 19.929688 13 z"},e))},on=function(e){return s(en,bt({d:"M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"},e))},an=function(e){return s(en,bt({d:"M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"},e))},sn=function(e){return s(en,bt({d:"M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"},e))},ln=function(e){return s(en,bt({d:"M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6z"},e))};function cn(e){var t=Bt(e),n="";return(Dt(e,Map)||Dt(e,Set))&&(n=e[Symbol.toStringTag]),Object.prototype.hasOwnProperty.call(e,Symbol.toStringTag)&&(n=e[Symbol.toStringTag]),"".concat(t," Items").concat(n?" (".concat(n,")"):"")}var un=(0,i.createContext)(void 0);un.Provider;var dn=function(e,t){return pt((0,i.useContext)(un),e,t)},hn={is:function(e){return"object"==typeof e},Component:function(e){var t=It(),n=jt((function(e){return e.colorspace.base02})),r=jt((function(e){return e.groupArraysAfterLength})),o=Vt(e.path,e.value),a=Ot((0,i.useState)(jt((function(e){return e.maxDisplayLength}))),2),c=a[0],u=a[1],d=jt((function(e){return e.objectSortKeys})),h=(0,i.useMemo)((function(){if(!e.inspect)return null;var n=e.value,o=function(e){return"function"==typeof(null==e?void 0:e[Symbol.iterator])}(n);if(o&&!Array.isArray(n)){var i=[];if(Dt(n,Map))n.forEach((function(t,n){var r=n.toString(),o=_t(e.path).concat([r]);i.push(s(mn,{path:o,value:t,prevValue:Dt(e.prevValue,Map)?e.prevValue.get(n):void 0,editable:!1},r))}));else for(var a=n[Symbol.iterator](),h=a.next(),p=0;!h.done;)i.push(s(mn,{path:_t(e.path).concat(["iterator:".concat(p)]),value:h.value,nestedIndex:p,editable:!1},p)),p++,h=a.next();return i}if(Array.isArray(n)){if(n.length<=r){var f=n.slice(0,c).map((function(t,n){var r=_t(e.path).concat([n]);return s(mn,{path:r,value:t,prevValue:Array.isArray(e.prevValue)?e.prevValue[n]:void 0},n)}));if(n.length>c){var m=n.length-c;f.push(l(Kt,{sx:{cursor:"pointer",lineHeight:1.5,color:t,letterSpacing:.5,opacity:.8,userSelect:"none"},onClick:function(){return u((function(e){return 2*e}))},children:["hidden ",m," items…"]},"last"))}return f}var g=Wt(n,r),y=Array.isArray(e.prevValue)?Wt(e.prevValue,r):void 0;return g.map((function(t,n){var r=_t(e.path);return s(mn,{path:r,value:t,nestedIndex:n,prevValue:null==y?void 0:y[n]},n)}))}var b=Object.entries(n);d&&(b=!0===d?b.sort((function(e,t){var n=Ot(e,1)[0],r=Ot(t,1)[0];return n.localeCompare(r)})):b.sort((function(e,t){var n=Ot(e,1)[0],r=Ot(t,1)[0];return d(n,r)})));var v=b.slice(0,c).map((function(t){var n,r=Ot(t,2),o=r[0],i=r[1],a=_t(e.path).concat([o]);return s(mn,{path:a,value:i,prevValue:null===(n=e.prevValue)||void 0===n?void 0:n[o]},o)}));if(b.length>c){var x=b.length-c;v.push(l(Kt,{sx:{cursor:"pointer",lineHeight:1.5,color:t,letterSpacing:.5,opacity:.8,userSelect:"none"},onClick:function(){return u((function(e){return 2*e}))},children:["hidden ",x," items…"]},"last"))}return v}),[e.inspect,e.value,e.prevValue,e.path,r,c,t,d]),p=e.inspect?.6:0,f=jt((function(e){return e.indentWidth})),m=e.inspect?f-p:f;return(0,i.useMemo)((function(){return 0===Bt(e.value)}),[e.value])?null:s(ce,{className:"data-object",sx:{display:e.inspect?"block":"inline-block",pl:e.inspect?m-.6:0,marginLeft:p,color:t,borderLeft:e.inspect?"1px solid ".concat(n):"none"},children:e.inspect?h:!o&&s(ce,{component:"span",className:"data-object-body",onClick:function(){return e.setInspect(!0)},sx:{"&:hover":{cursor:"pointer"},padding:.5,userSelect:"none"},children:"…"})})},PreComponent:function(e){var t=jt((function(e){return e.colorspace.base04})),n=It(),r=(0,i.useMemo)((function(){return Array.isArray(e.value)}),[e.value]),o=(0,i.useMemo)((function(){return 0===Bt(e.value)}),[e.value]),c=(0,i.useMemo)((function(){return cn(e.value)}),[e.value]),u=jt((function(e){return e.displayObjectSize})),d=Vt(e.path,e.value);return l(ce,{component:"span",className:"data-object-start",sx:{letterSpacing:.5},children:[r?"[":"{",u&&e.inspect&&!o&&s(ce,{component:"span",sx:{pl:.5,fontStyle:"italic",color:t,userSelect:"none"},children:c}),d&&!e.inspect&&l(a,{children:[s(rn,{sx:{fontSize:12,color:n,mx:.5}}),d]})]})},PostComponent:function(e){var t=jt((function(e){return e.colorspace.base04})),n=(0,i.useMemo)((function(){return Array.isArray(e.value)}),[e.value]),r=jt((function(e){return e.displayObjectSize})),o=(0,i.useMemo)((function(){return 0===Bt(e.value)}),[e.value]),a=(0,i.useMemo)((function(){return cn(e.value)}),[e.value]);return l(ce,{component:"span",className:"data-object-end",children:[n?"]":"}",!r||!o&&e.inspect?null:s(ce,{component:"span",sx:{pl:.5,fontStyle:"italic",color:t,userSelect:"none"},children:a})]})}};function pn(e,t){var n=dn((function(e){return e.registry}));return(0,i.useMemo)((function(){return function(e,t,n){var r,o=!0,i=!1,a=void 0;try{for(var s,l=n[Symbol.iterator]();!(o=(s=l.next()).done);o=!0){var c=s.value;if(c.is(e,t)&&(r=c,"object"==typeof e))return c}}catch(e){i=!0,a=e}finally{try{o||null==l.return||l.return()}finally{if(i)throw a}}if(void 0===r){if("object"==typeof e)return hn;throw new Error("this is not possible")}return r}(e,t,n)}),[e,t,n])}var fn=function(e){return s(ce,vt(bt({component:"span"},e),{sx:bt({cursor:"pointer",paddingLeft:"0.7rem"},e.sx)}))},mn=function(e){var t,n=e.value,r=e.prevValue,o=e.path,c=e.nestedIndex,u=null!==(t=e.editable)&&void 0!==t?t:void 0,d=jt((function(e){return e.editable})),h=(0,i.useMemo)((function(){return!1!==d&&(!1!==u&&("function"==typeof d?!!d(o,n):d))}),[o,u,d,n]),p=Ot((0,i.useState)("function"==typeof n?function(){return n}:n),2),f=p[0],m=p[1],g=o.length,y=o[g-1],b=jt((function(e){return e.hoverPath})),v=(0,i.useMemo)((function(){return b&&o.every((function(e,t){return e===b.path[t]&&c===b.nestedIndex}))}),[b,o,c]),x=jt((function(e){return e.setHover})),k=jt((function(e){return e.value})),w=Ot(function(e,t,n){var r=e.length,o=Vt(e,t),a=jt((function(e){return e.getInspectCache})),s=jt((function(e){return e.setInspectCache})),l=jt((function(e){return e.defaultInspectDepth}));(0,i.useEffect)((function(){void 0===a(e,n)&&(void 0!==n?s(e,!1,n):s(e,!o&&r<l))}),[l,r,a,o,n,e,s]);var c=Ot((0,i.useState)((function(){var t=a(e,n);return void 0!==t?t:void 0===n&&!o&&r<l})),2),u=c[0],d=c[1];return[u,(0,i.useCallback)((function(t){d((function(r){var o="boolean"==typeof t?t:t(r);return s(e,o,n),o}))}),[n,e,s])]}(o,n,c),2),_=w[0],S=w[1],E=Ot((0,i.useState)(!1),2),C=E[0],A=E[1],O=jt((function(e){return e.onChange})),M=It(),R=jt((function(e){return e.colorspace.base0C})),P=jt((function(e){return e.colorspace.base0A})),T=pn(n,o),z=T.Component,j=T.PreComponent,I=T.PostComponent,N=T.Editor,$=jt((function(e){return e.quotesOnKeys})),L=jt((function(e){return e.rootName})),D=k===n,F=Number.isInteger(Number(y)),B=jt((function(e){return e.enableClipboard})),W=Ut(),H=W.copy,q=W.copied,U=jt((function(e){return e.highlightUpdates})),V=(0,i.useMemo)((function(){return!(!U||void 0===r)&&((void 0===n?"undefined":Mt(n))!==(void 0===r?"undefined":Mt(r))||("number"==typeof n?(!isNaN(n)||!isNaN(r))&&n!==r:Array.isArray(n)!==Array.isArray(r)||"object"!=typeof n&&"function"!=typeof n&&n!==r))}),[U,r,n]),K=(0,i.useRef)();(0,i.useEffect)((function(){K.current&&V&&"animate"in K.current&&K.current.animate([{backgroundColor:P},{backgroundColor:""}],{duration:1e3,easing:"ease-in"})}),[P,V,r,n]);var Q=(0,i.useMemo)((function(){return l(a,C?{children:[s(fn,{children:s(on,{sx:{fontSize:".8rem"},onClick:function(){A(!1),m(n)}})}),s(fn,{children:s(tn,{sx:{fontSize:".8rem"},onClick:function(){A(!1),O(o,n,f)}})})]}:{children:[B&&s(fn,{onClick:function(e){e.preventDefault();try{H(o,n,Ht)}catch(e){console.error(e)}},children:s(q?tn:an,{sx:{fontSize:".8rem"}})}),N&&h&&s(fn,{onClick:function(e){e.preventDefault(),A(!0),m(n)},children:s(sn,{sx:{fontSize:".8rem"}})})]})}),[N,q,H,h,C,B,O,o,f,n]),Y=(0,i.useMemo)((function(){return 0===Bt(n)}),[n]),G=!Y&&!(!j||!I),X=jt((function(e){return e.keyRenderer})),Z=(0,i.useMemo)((function(){return{path:o,inspect:_,setInspect:S,value:n,prevValue:r}}),[_,o,S,n,r]);return l(ce,{className:"data-key-pair","data-testid":"data-key-pair"+o.join("."),sx:{userSelect:"text"},onMouseEnter:(0,i.useCallback)((function(){return x(o,c)}),[x,o,c]),children:[l(Kt,{component:"span",className:"data-key",sx:{lineHeight:1.5,color:M,letterSpacing:.5,opacity:.8},onClick:(0,i.useCallback)((function(e){e.isDefaultPrevented()||Y||S((function(e){return!e}))}),[Y,S]),children:[G?s(_?ln:nn,{sx:{fontSize:".8rem","&:hover":{cursor:"pointer"}}}):null,s(ce,{ref:K,component:"span",children:D?!1!==L?$?l(a,{children:['"',L,'"']}):s(a,{children:L}):null:X.when(Z)?s(X,bt({},Z)):void 0===c&&(F?s(ce,{component:"span",style:{color:R},children:y}):$?l(a,{children:['"',y,'"']}):s(a,{children:y}))}),D?!1!==L&&s(Kt,{sx:{mr:.5},children:":"}):void 0===c&&s(Kt,{sx:{mr:.5},children:":"}),j&&s(j,bt({},Z)),v&&G&&_&&Q]}),C&&h?N&&s(N,{value:f,setValue:m}):z?s(z,bt({},Z)):s(ce,{component:"span",className:"data-value-fallback",children:"fallback: ".concat(n)}),I&&s(I,bt({},Z)),v&&G&&!_&&Q,v&&!G&&Q]})},gn="(prefers-color-scheme: dark)";function yn(e,t){var n=(0,i.useContext)(zt).setState;(0,i.useEffect)((function(){void 0!==t&&n(yt({},e,t))}),[e,t,n])}var bn=function(e){var t=(0,i.useContext)(zt).setState;(0,i.useEffect)((function(){t((function(t){return{prevValue:t.value,value:e.value}}))}),[e.value,t]),yn("editable",e.editable),yn("indentWidth",e.indentWidth),yn("onChange",e.onChange),yn("groupArraysAfterLength",e.groupArraysAfterLength),yn("keyRenderer",e.keyRenderer),yn("maxDisplayLength",e.maxDisplayLength),yn("enableClipboard",e.enableClipboard),yn("highlightUpdates",e.highlightUpdates),yn("rootName",e.rootName),yn("displayDataTypes",e.displayDataTypes),yn("displayObjectSize",e.displayObjectSize),yn("onCopy",e.onCopy),yn("onSelect",e.onSelect),(0,i.useEffect)((function(){"light"===e.theme?t({colorspace:Rt}):"dark"===e.theme?t({colorspace:Pt}):"object"==typeof e.theme&&t({colorspace:e.theme})}),[t,e.theme]);var n=(0,i.useMemo)((function(){return"object"==typeof e.theme?"json-viewer-theme-custom":"dark"===e.theme?"json-viewer-theme-dark":"json-viewer-theme-light"}),[e.theme]),r=(0,i.useRef)(!0),o=(0,i.useMemo)((function(){return function(){var e=function(e){function n(e,t){var n,r;return Object.is(e.value,t.value)&&e.inspect&&t.inspect&&(null===(n=e.path)||void 0===n?void 0:n.join("."))===(null===(r=t.path)||void 0===r?void 0:r.join("."))}e.Component=(0,i.memo)(e.Component,n),e.Editor&&(e.Editor=(0,i.memo)(e.Editor,(function(e,t){return Object.is(e.value,t.value)}))),e.PreComponent&&(e.PreComponent=(0,i.memo)(e.PreComponent,n)),e.PostComponent&&(e.PostComponent=(0,i.memo)(e.PostComponent,n)),t.push(e)},t=[];e(bt({is:function(e){return"boolean"==typeof e}},Yt("bool",(function(e){var t=e.value;return s(a,{children:t?"true":"false"})}),{colorKey:"base0E",fromString:function(e){return Boolean(e)}})));var n={weekday:"short",year:"numeric",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"};e(bt({is:function(e){return Dt(e,Date)}},Yt("date",(function(e){var t=e.value;return s(a,{children:t.toLocaleTimeString("en-us",n)})}),{colorKey:"base0D"}))),e(bt({is:function(e){return null===e}},Yt("null",(function(){var e=jt((function(e){return e.colorspace.base02}));return s(ce,{sx:{fontSize:"0.8rem",backgroundColor:e,fontWeight:"bold",borderRadius:"3px",padding:"0.5px 2px"},children:"NULL"})}),{colorKey:"base08",displayTypeLabel:!1}))),e(bt({is:function(e){return void 0===e}},Yt("undefined",(function(){var e=jt((function(e){return e.colorspace.base02}));return s(ce,{sx:{fontSize:"0.7rem",backgroundColor:e,borderRadius:"3px",padding:"0.5px 2px"},children:"undefined"})}),{colorKey:"base05",displayTypeLabel:!1}))),e(bt({is:function(e){return"string"==typeof e}},Yt("string",(function(e){var t=Ot((0,i.useState)(!1),2),n=t[0],r=t[1],o=jt((function(e){return e.collapseStringsAfterLength})),a=n?e.value:e.value.slice(0,o),c=e.value.length>o;return l(ce,{component:"span",sx:{overflowWrap:"anywhere",cursor:c?"pointer":"inherit"},onClick:function(){c&&r((function(e){return!e}))},children:['"',a,c&&!n&&s(ce,{component:"span",sx:{padding:.5},children:"…"}),'"']})}),{colorKey:"base09",fromString:function(e){return e}}))),e({is:function(e){return"function"==typeof e},Component:Zt,PreComponent:Gt,PostComponent:Xt});var r=function(e){return e%1==0};return e(bt({is:function(e){return"number"==typeof e&&isNaN(e)}},Yt("NaN",(function(){var e=jt((function(e){return e.colorspace.base02}));return s(ce,{sx:{backgroundColor:e,fontSize:"0.8rem",fontWeight:"bold",borderRadius:"3px"},children:"NaN"})}),{colorKey:"base08",displayTypeLabel:!1}))),e(bt({is:function(e){return"number"==typeof e&&!r(e)}},Yt("float",(function(e){var t=e.value;return s(a,{children:t})}),{colorKey:"base0B",fromString:function(e){return parseFloat(e)}}))),e(bt({is:function(e){return"number"==typeof e&&r(e)}},Yt("int",(function(e){var t=e.value;return s(a,{children:t})}),{colorKey:"base0F",fromString:function(e){return parseInt(e)}}))),e(bt({is:function(e){return"bigint"===(void 0===e?"undefined":Mt(e))}},Yt("bigint",(function(e){var t=e.value;return s(a,{children:"".concat(t,"n")})}),{colorKey:"base0F",fromString:function(e){return BigInt(e.replace(/\D/g,""))}}))),t}()}),[]),c=dn((function(e){return e.registerTypes}));if(r.current){var u=e.valueTypes?_t(o).concat(_t(e.valueTypes)):_t(o);c(u),r.current=!1}(0,i.useEffect)((function(){var t=e.valueTypes?_t(o).concat(_t(e.valueTypes)):_t(o);c(t)}),[e.valueTypes,o,c]);var d=jt((function(e){return e.value})),h=jt((function(e){return e.prevValue})),p=jt((function(e){return e.setHover})),f=(0,i.useCallback)((function(){return p(null)}),[p]);return s(Ge,{elevation:0,className:Et(n,e.className),style:e.style,sx:bt({fontFamily:"monospace",userSelect:"none",contentVisibility:"auto"},e.sx),onMouseLeave:f,children:s(mn,{value:d,prevValue:h,path:(0,i.useMemo)((function(){return[]}),[])})})},vn=function(e){var t,n,r,o,a=(t=Ot((0,i.useState)(!1),2),n=t[0],r=t[1],(0,i.useEffect)((function(){var e=function(e){r(e.matches)};r(window.matchMedia(gn).matches);var t=window.matchMedia(gn);return t.addEventListener("change",e),function(){return t.removeEventListener("change",e)}}),[]),n),l=(0,i.useMemo)((function(){return"auto"===e.theme?a?"light":"dark":null!==(o=e.theme)&&void 0!==o?o:"light"}),[a,e.theme]),c=(0,i.useMemo)((function(){var e="object"==typeof l?l.base00:"dark"===l?Pt.base00:Rt.base00;return te({components:{MuiPaper:{styleOverrides:{root:{backgroundColor:e}}}},palette:{mode:"dark"===l?"dark":"light",background:{default:e}}})}),[l]),u=vt(bt({},e),{theme:l}),d=(0,i.useMemo)((function(){return function(e){var t,n,r,o,i,a,s,l,c,u,d,h,p,f,m,g,y;return mt()((function(b,v){return{enableClipboard:null===(t=e.enableClipboard)||void 0===t||t,highlightUpdates:null!==(n=e.highlightUpdates)&&void 0!==n&&n,indentWidth:null!==(r=e.indentWidth)&&void 0!==r?r:3,groupArraysAfterLength:null!==(o=e.groupArraysAfterLength)&&void 0!==o?o:100,collapseStringsAfterLength:!1===e.collapseStringsAfterLength?Number.MAX_VALUE:null!==(i=e.collapseStringsAfterLength)&&void 0!==i?i:50,maxDisplayLength:null!==(a=e.maxDisplayLength)&&void 0!==a?a:30,rootName:null!==(s=e.rootName)&&void 0!==s?s:"root",onChange:null!==(l=e.onChange)&&void 0!==l?l:function(){},onCopy:null!==(c=e.onCopy)&&void 0!==c?c:void 0,onSelect:null!==(u=e.onSelect)&&void 0!==u?u:void 0,keyRenderer:null!==(d=e.keyRenderer)&&void 0!==d?d:Tt,editable:null!==(h=e.editable)&&void 0!==h&&h,defaultInspectDepth:null!==(p=e.defaultInspectDepth)&&void 0!==p?p:5,objectSortKeys:null!==(f=e.objectSortKeys)&&void 0!==f&&f,quotesOnKeys:null===(m=e.quotesOnKeys)||void 0===m||m,displayDataTypes:null===(g=e.displayDataTypes)||void 0===g||g,inspectCache:{},hoverPath:null,colorspace:Rt,value:e.value,prevValue:void 0,displayObjectSize:null===(y=e.displayObjectSize)||void 0===y||y,getInspectCache:function(e,t){var n=void 0!==t?e.join(".")+"[".concat(t,"]nt"):e.join(".");return v().inspectCache[n]},setInspectCache:function(e,t,n){var r=void 0!==n?e.join(".")+"[".concat(n,"]nt"):e.join(".");b((function(e){return{inspectCache:vt(bt({},e.inspectCache),yt({},r,"function"==typeof t?t(e.inspectCache[r]):t))}}))},setHover:function(e,t){b({hoverPath:e?{path:e,nestedIndex:t}:null})}}}))}(e)}),[]),h=(0,i.useMemo)((function(){return st()((function(e){return{registry:[],registerTypes:function(t){e((function(e){return{registry:"function"==typeof t?t(e.registry):t}}))}}}))}),[]);return s(it,{theme:c,children:s(un.Provider,{value:h,children:s(zt.Provider,{value:d,children:s(bn,bt({},u))})})})}},2262:(e,t,n)=>{"use strict";
/*!
 * @kurkle/color v0.3.2
 * https://github.com/kurkle/color#readme
 * (c) 2023 Jukka Kurkela
 * Released under the MIT License
 */
function r(e){return e+.5|0}n.d(t,{A6:()=>On,E8:()=>so,PP:()=>Ro,t1:()=>Jr,s$:()=>ho,kc:()=>jo,m_:()=>Ao});const o=(e,t,n)=>Math.max(Math.min(e,n),t);function i(e){return o(r(2.55*e),0,255)}function a(e){return o(r(255*e),0,255)}function s(e){return o(r(e/2.55)/100,0,1)}function l(e){return o(r(100*e),0,100)}const c={0:0,1:1,2:2,3:3,4:4,5:5,6:6,7:7,8:8,9:9,A:10,B:11,C:12,D:13,E:14,F:15,a:10,b:11,c:12,d:13,e:14,f:15},u=[..."0123456789ABCDEF"],d=e=>u[15&e],h=e=>u[(240&e)>>4]+u[15&e],p=e=>(240&e)>>4==(15&e);function f(e){var t=(e=>p(e.r)&&p(e.g)&&p(e.b)&&p(e.a))(e)?d:h;return e?"#"+t(e.r)+t(e.g)+t(e.b)+((e,t)=>e<255?t(e):"")(e.a,t):void 0}const m=/^(hsla?|hwb|hsv)\(\s*([-+.e\d]+)(?:deg)?[\s,]+([-+.e\d]+)%[\s,]+([-+.e\d]+)%(?:[\s,]+([-+.e\d]+)(%)?)?\s*\)$/;function g(e,t,n){const r=t*Math.min(n,1-n),o=(t,o=(t+e/30)%12)=>n-r*Math.max(Math.min(o-3,9-o,1),-1);return[o(0),o(8),o(4)]}function y(e,t,n){const r=(r,o=(r+e/60)%6)=>n-n*t*Math.max(Math.min(o,4-o,1),0);return[r(5),r(3),r(1)]}function b(e,t,n){const r=g(e,1,.5);let o;for(t+n>1&&(o=1/(t+n),t*=o,n*=o),o=0;o<3;o++)r[o]*=1-t-n,r[o]+=t;return r}function v(e){const t=e.r/255,n=e.g/255,r=e.b/255,o=Math.max(t,n,r),i=Math.min(t,n,r),a=(o+i)/2;let s,l,c;return o!==i&&(c=o-i,l=a>.5?c/(2-o-i):c/(o+i),s=function(e,t,n,r,o){return e===o?(t-n)/r+(t<n?6:0):t===o?(n-e)/r+2:(e-t)/r+4}(t,n,r,c,o),s=60*s+.5),[0|s,l||0,a]}function x(e,t,n,r){return(Array.isArray(t)?e(t[0],t[1],t[2]):e(t,n,r)).map(a)}function k(e,t,n){return x(g,e,t,n)}function w(e){return(e%360+360)%360}function _(e){const t=m.exec(e);let n,r=255;if(!t)return;t[5]!==n&&(r=t[6]?i(+t[5]):a(+t[5]));const o=w(+t[2]),s=+t[3]/100,l=+t[4]/100;return n="hwb"===t[1]?function(e,t,n){return x(b,e,t,n)}(o,s,l):"hsv"===t[1]?function(e,t,n){return x(y,e,t,n)}(o,s,l):k(o,s,l),{r:n[0],g:n[1],b:n[2],a:r}}const S={x:"dark",Z:"light",Y:"re",X:"blu",W:"gr",V:"medium",U:"slate",A:"ee",T:"ol",S:"or",B:"ra",C:"lateg",D:"ights",R:"in",Q:"turquois",E:"hi",P:"ro",O:"al",N:"le",M:"de",L:"yello",F:"en",K:"ch",G:"arks",H:"ea",I:"ightg",J:"wh"},E={OiceXe:"f0f8ff",antiquewEte:"faebd7",aqua:"ffff",aquamarRe:"7fffd4",azuY:"f0ffff",beige:"f5f5dc",bisque:"ffe4c4",black:"0",blanKedOmond:"ffebcd",Xe:"ff",XeviTet:"8a2be2",bPwn:"a52a2a",burlywood:"deb887",caMtXe:"5f9ea0",KartYuse:"7fff00",KocTate:"d2691e",cSO:"ff7f50",cSnflowerXe:"6495ed",cSnsilk:"fff8dc",crimson:"dc143c",cyan:"ffff",xXe:"8b",xcyan:"8b8b",xgTMnPd:"b8860b",xWay:"a9a9a9",xgYF:"6400",xgYy:"a9a9a9",xkhaki:"bdb76b",xmagFta:"8b008b",xTivegYF:"556b2f",xSange:"ff8c00",xScEd:"9932cc",xYd:"8b0000",xsOmon:"e9967a",xsHgYF:"8fbc8f",xUXe:"483d8b",xUWay:"2f4f4f",xUgYy:"2f4f4f",xQe:"ced1",xviTet:"9400d3",dAppRk:"ff1493",dApskyXe:"bfff",dimWay:"696969",dimgYy:"696969",dodgerXe:"1e90ff",fiYbrick:"b22222",flSOwEte:"fffaf0",foYstWAn:"228b22",fuKsia:"ff00ff",gaRsbSo:"dcdcdc",ghostwEte:"f8f8ff",gTd:"ffd700",gTMnPd:"daa520",Way:"808080",gYF:"8000",gYFLw:"adff2f",gYy:"808080",honeyMw:"f0fff0",hotpRk:"ff69b4",RdianYd:"cd5c5c",Rdigo:"4b0082",ivSy:"fffff0",khaki:"f0e68c",lavFMr:"e6e6fa",lavFMrXsh:"fff0f5",lawngYF:"7cfc00",NmoncEffon:"fffacd",ZXe:"add8e6",ZcSO:"f08080",Zcyan:"e0ffff",ZgTMnPdLw:"fafad2",ZWay:"d3d3d3",ZgYF:"90ee90",ZgYy:"d3d3d3",ZpRk:"ffb6c1",ZsOmon:"ffa07a",ZsHgYF:"20b2aa",ZskyXe:"87cefa",ZUWay:"778899",ZUgYy:"778899",ZstAlXe:"b0c4de",ZLw:"ffffe0",lime:"ff00",limegYF:"32cd32",lRF:"faf0e6",magFta:"ff00ff",maPon:"800000",VaquamarRe:"66cdaa",VXe:"cd",VScEd:"ba55d3",VpurpN:"9370db",VsHgYF:"3cb371",VUXe:"7b68ee",VsprRggYF:"fa9a",VQe:"48d1cc",VviTetYd:"c71585",midnightXe:"191970",mRtcYam:"f5fffa",mistyPse:"ffe4e1",moccasR:"ffe4b5",navajowEte:"ffdead",navy:"80",Tdlace:"fdf5e6",Tive:"808000",TivedBb:"6b8e23",Sange:"ffa500",SangeYd:"ff4500",ScEd:"da70d6",pOegTMnPd:"eee8aa",pOegYF:"98fb98",pOeQe:"afeeee",pOeviTetYd:"db7093",papayawEp:"ffefd5",pHKpuff:"ffdab9",peru:"cd853f",pRk:"ffc0cb",plum:"dda0dd",powMrXe:"b0e0e6",purpN:"800080",YbeccapurpN:"663399",Yd:"ff0000",Psybrown:"bc8f8f",PyOXe:"4169e1",saddNbPwn:"8b4513",sOmon:"fa8072",sandybPwn:"f4a460",sHgYF:"2e8b57",sHshell:"fff5ee",siFna:"a0522d",silver:"c0c0c0",skyXe:"87ceeb",UXe:"6a5acd",UWay:"708090",UgYy:"708090",snow:"fffafa",sprRggYF:"ff7f",stAlXe:"4682b4",tan:"d2b48c",teO:"8080",tEstN:"d8bfd8",tomato:"ff6347",Qe:"40e0d0",viTet:"ee82ee",JHt:"f5deb3",wEte:"ffffff",wEtesmoke:"f5f5f5",Lw:"ffff00",LwgYF:"9acd32"};let C;function A(e){C||(C=function(){const e={},t=Object.keys(E),n=Object.keys(S);let r,o,i,a,s;for(r=0;r<t.length;r++){for(a=s=t[r],o=0;o<n.length;o++)i=n[o],s=s.replace(i,S[i]);i=parseInt(E[a],16),e[s]=[i>>16&255,i>>8&255,255&i]}return e}(),C.transparent=[0,0,0,0]);const t=C[e.toLowerCase()];return t&&{r:t[0],g:t[1],b:t[2],a:4===t.length?t[3]:255}}const O=/^rgba?\(\s*([-+.\d]+)(%)?[\s,]+([-+.e\d]+)(%)?[\s,]+([-+.e\d]+)(%)?(?:[\s,/]+([-+.e\d]+)(%)?)?\s*\)$/;const M=e=>e<=.0031308?12.92*e:1.055*Math.pow(e,1/2.4)-.055,R=e=>e<=.04045?e/12.92:Math.pow((e+.055)/1.055,2.4);function P(e,t,n){if(e){let r=v(e);r[t]=Math.max(0,Math.min(r[t]+r[t]*n,0===t?360:1)),r=k(r),e.r=r[0],e.g=r[1],e.b=r[2]}}function T(e,t){return e?Object.assign(t||{},e):e}function z(e){var t={r:0,g:0,b:0,a:255};return Array.isArray(e)?e.length>=3&&(t={r:e[0],g:e[1],b:e[2],a:255},e.length>3&&(t.a=a(e[3]))):(t=T(e,{r:0,g:0,b:0,a:1})).a=a(t.a),t}function j(e){return"r"===e.charAt(0)?function(e){const t=O.exec(e);let n,r,a,s=255;if(t){if(t[7]!==n){const e=+t[7];s=t[8]?i(e):o(255*e,0,255)}return n=+t[1],r=+t[3],a=+t[5],n=255&(t[2]?i(n):o(n,0,255)),r=255&(t[4]?i(r):o(r,0,255)),a=255&(t[6]?i(a):o(a,0,255)),{r:n,g:r,b:a,a:s}}}(e):_(e)}class I{constructor(e){if(e instanceof I)return e;const t=typeof e;let n;var r,o,i;"object"===t?n=z(e):"string"===t&&(i=(r=e).length,"#"===r[0]&&(4===i||5===i?o={r:255&17*c[r[1]],g:255&17*c[r[2]],b:255&17*c[r[3]],a:5===i?17*c[r[4]]:255}:7!==i&&9!==i||(o={r:c[r[1]]<<4|c[r[2]],g:c[r[3]]<<4|c[r[4]],b:c[r[5]]<<4|c[r[6]],a:9===i?c[r[7]]<<4|c[r[8]]:255})),n=o||A(e)||j(e)),this._rgb=n,this._valid=!!n}get valid(){return this._valid}get rgb(){var e=T(this._rgb);return e&&(e.a=s(e.a)),e}set rgb(e){this._rgb=z(e)}rgbString(){return this._valid?(e=this._rgb)&&(e.a<255?`rgba(${e.r}, ${e.g}, ${e.b}, ${s(e.a)})`:`rgb(${e.r}, ${e.g}, ${e.b})`):void 0;var e}hexString(){return this._valid?f(this._rgb):void 0}hslString(){return this._valid?function(e){if(!e)return;const t=v(e),n=t[0],r=l(t[1]),o=l(t[2]);return e.a<255?`hsla(${n}, ${r}%, ${o}%, ${s(e.a)})`:`hsl(${n}, ${r}%, ${o}%)`}(this._rgb):void 0}mix(e,t){if(e){const n=this.rgb,r=e.rgb;let o;const i=t===o?.5:t,a=2*i-1,s=n.a-r.a,l=((a*s==-1?a:(a+s)/(1+a*s))+1)/2;o=1-l,n.r=255&l*n.r+o*r.r+.5,n.g=255&l*n.g+o*r.g+.5,n.b=255&l*n.b+o*r.b+.5,n.a=i*n.a+(1-i)*r.a,this.rgb=n}return this}interpolate(e,t){return e&&(this._rgb=function(e,t,n){const r=R(s(e.r)),o=R(s(e.g)),i=R(s(e.b));return{r:a(M(r+n*(R(s(t.r))-r))),g:a(M(o+n*(R(s(t.g))-o))),b:a(M(i+n*(R(s(t.b))-i))),a:e.a+n*(t.a-e.a)}}(this._rgb,e._rgb,t)),this}clone(){return new I(this.rgb)}alpha(e){return this._rgb.a=a(e),this}clearer(e){return this._rgb.a*=1-e,this}greyscale(){const e=this._rgb,t=r(.3*e.r+.59*e.g+.11*e.b);return e.r=e.g=e.b=t,this}opaquer(e){return this._rgb.a*=1+e,this}negate(){const e=this._rgb;return e.r=255-e.r,e.g=255-e.g,e.b=255-e.b,this}lighten(e){return P(this._rgb,2,e),this}darken(e){return P(this._rgb,2,-e),this}saturate(e){return P(this._rgb,1,e),this}desaturate(e){return P(this._rgb,1,-e),this}rotate(e){return function(e,t){var n=v(e);n[0]=w(n[0]+t),n=k(n),e.r=n[0],e.g=n[1],e.b=n[2]}(this._rgb,e),this}}
/*!
 * Chart.js v4.4.4
 * https://www.chartjs.org
 * (c) 2024 Chart.js Contributors
 * Released under the MIT License
 */
function N(){}const $=(()=>{let e=0;return()=>e++})();function L(e){return null==e}function D(e){if(Array.isArray&&Array.isArray(e))return!0;const t=Object.prototype.toString.call(e);return"[object"===t.slice(0,7)&&"Array]"===t.slice(-6)}function F(e){return null!==e&&"[object Object]"===Object.prototype.toString.call(e)}function B(e){return("number"==typeof e||e instanceof Number)&&isFinite(+e)}function W(e,t){return B(e)?e:t}function H(e,t){return void 0===e?t:e}const q=(e,t)=>"string"==typeof e&&e.endsWith("%")?parseFloat(e)/100*t:+e;function U(e,t,n){if(e&&"function"==typeof e.call)return e.apply(n,t)}function V(e,t,n,r){let o,i,a;if(D(e))if(i=e.length,r)for(o=i-1;o>=0;o--)t.call(n,e[o],o);else for(o=0;o<i;o++)t.call(n,e[o],o);else if(F(e))for(a=Object.keys(e),i=a.length,o=0;o<i;o++)t.call(n,e[a[o]],a[o])}function K(e,t){let n,r,o,i;if(!e||!t||e.length!==t.length)return!1;for(n=0,r=e.length;n<r;++n)if(o=e[n],i=t[n],o.datasetIndex!==i.datasetIndex||o.index!==i.index)return!1;return!0}function Q(e){if(D(e))return e.map(Q);if(F(e)){const t=Object.create(null),n=Object.keys(e),r=n.length;let o=0;for(;o<r;++o)t[n[o]]=Q(e[n[o]]);return t}return e}function Y(e){return-1===["__proto__","prototype","constructor"].indexOf(e)}function G(e,t,n,r){if(!Y(e))return;const o=t[e],i=n[e];F(o)&&F(i)?X(o,i,r):t[e]=Q(i)}function X(e,t,n){const r=D(t)?t:[t],o=r.length;if(!F(e))return e;const i=(n=n||{}).merger||G;let a;for(let t=0;t<o;++t){if(a=r[t],!F(a))continue;const o=Object.keys(a);for(let t=0,r=o.length;t<r;++t)i(o[t],e,a,n)}return e}function Z(e,t){return X(e,t,{merger:J})}function J(e,t,n){if(!Y(e))return;const r=t[e],o=n[e];F(r)&&F(o)?Z(r,o):Object.prototype.hasOwnProperty.call(t,e)||(t[e]=Q(o))}const ee={"":e=>e,x:e=>e.x,y:e=>e.y};function te(e,t){const n=ee[t]||(ee[t]=function(e){const t=function(e){const t=e.split("."),n=[];let r="";for(const e of t)r+=e,r.endsWith("\\")?r=r.slice(0,-1)+".":(n.push(r),r="");return n}(e);return e=>{for(const n of t){if(""===n)break;e=e&&e[n]}return e}}(t));return n(e)}function ne(e){return e.charAt(0).toUpperCase()+e.slice(1)}const re=e=>void 0!==e,oe=e=>"function"==typeof e,ie=(e,t)=>{if(e.size!==t.size)return!1;for(const n of e)if(!t.has(n))return!1;return!0};const ae=Math.PI,se=2*ae,le=Number.POSITIVE_INFINITY,ce=ae/180,ue=ae/2,de=ae/4,he=2*ae/3,pe=Math.log10,fe=Math.sign;function me(e,t,n){return Math.abs(e-t)<n}function ge(e){const t=Math.round(e);e=me(e,t,e/1e3)?t:e;const n=Math.pow(10,Math.floor(pe(e))),r=e/n;return(r<=1?1:r<=2?2:r<=5?5:10)*n}function ye(e){return!isNaN(parseFloat(e))&&isFinite(e)}function be(e,t,n){let r,o,i;for(r=0,o=e.length;r<o;r++)i=e[r][n],isNaN(i)||(t.min=Math.min(t.min,i),t.max=Math.max(t.max,i))}function ve(e){return e*(ae/180)}function xe(e){return e*(180/ae)}function ke(e){if(!B(e))return;let t=1,n=0;for(;Math.round(e*t)/t!==e;)t*=10,n++;return n}function we(e,t){const n=t.x-e.x,r=t.y-e.y,o=Math.sqrt(n*n+r*r);let i=Math.atan2(r,n);return i<-.5*ae&&(i+=se),{angle:i,distance:o}}function _e(e,t){return Math.sqrt(Math.pow(t.x-e.x,2)+Math.pow(t.y-e.y,2))}function Se(e){return(e%se+se)%se}function Ee(e,t,n,r){const o=Se(e),i=Se(t),a=Se(n),s=Se(i-o),l=Se(a-o),c=Se(o-i),u=Se(o-a);return o===i||o===a||r&&i===a||s>l&&c<u}function Ce(e,t,n){return Math.max(t,Math.min(n,e))}function Ae(e,t,n,r=1e-6){return e>=Math.min(t,n)-r&&e<=Math.max(t,n)+r}function Oe(e,t,n){n=n||(n=>e[n]<t);let r,o=e.length-1,i=0;for(;o-i>1;)r=i+o>>1,n(r)?i=r:o=r;return{lo:i,hi:o}}const Me=(e,t,n,r)=>Oe(e,n,r?r=>{const o=e[r][t];return o<n||o===n&&e[r+1][t]===n}:r=>e[r][t]<n),Re=(e,t,n)=>Oe(e,n,(r=>e[r][t]>=n));const Pe=["push","pop","shift","splice","unshift"];function Te(e,t){const n=e._chartjs;if(!n)return;const r=n.listeners,o=r.indexOf(t);-1!==o&&r.splice(o,1),r.length>0||(Pe.forEach((t=>{delete e[t]})),delete e._chartjs)}function ze(e){const t=new Set(e);return t.size===e.length?e:Array.from(t)}const je="undefined"==typeof window?function(e){return e()}:window.requestAnimationFrame;function Ie(e,t){let n=[],r=!1;return function(...o){n=o,r||(r=!0,je.call(window,(()=>{r=!1,e.apply(t,n)})))}}const Ne=e=>"start"===e?"left":"end"===e?"right":"center",$e=(e,t,n)=>"start"===e?t:"end"===e?n:(t+n)/2;const Le=e=>0===e||1===e,De=(e,t,n)=>-Math.pow(2,10*(e-=1))*Math.sin((e-t)*se/n),Fe=(e,t,n)=>Math.pow(2,-10*e)*Math.sin((e-t)*se/n)+1,Be={linear:e=>e,easeInQuad:e=>e*e,easeOutQuad:e=>-e*(e-2),easeInOutQuad:e=>(e/=.5)<1?.5*e*e:-.5*(--e*(e-2)-1),easeInCubic:e=>e*e*e,easeOutCubic:e=>(e-=1)*e*e+1,easeInOutCubic:e=>(e/=.5)<1?.5*e*e*e:.5*((e-=2)*e*e+2),easeInQuart:e=>e*e*e*e,easeOutQuart:e=>-((e-=1)*e*e*e-1),easeInOutQuart:e=>(e/=.5)<1?.5*e*e*e*e:-.5*((e-=2)*e*e*e-2),easeInQuint:e=>e*e*e*e*e,easeOutQuint:e=>(e-=1)*e*e*e*e+1,easeInOutQuint:e=>(e/=.5)<1?.5*e*e*e*e*e:.5*((e-=2)*e*e*e*e+2),easeInSine:e=>1-Math.cos(e*ue),easeOutSine:e=>Math.sin(e*ue),easeInOutSine:e=>-.5*(Math.cos(ae*e)-1),easeInExpo:e=>0===e?0:Math.pow(2,10*(e-1)),easeOutExpo:e=>1===e?1:1-Math.pow(2,-10*e),easeInOutExpo:e=>Le(e)?e:e<.5?.5*Math.pow(2,10*(2*e-1)):.5*(2-Math.pow(2,-10*(2*e-1))),easeInCirc:e=>e>=1?e:-(Math.sqrt(1-e*e)-1),easeOutCirc:e=>Math.sqrt(1-(e-=1)*e),easeInOutCirc:e=>(e/=.5)<1?-.5*(Math.sqrt(1-e*e)-1):.5*(Math.sqrt(1-(e-=2)*e)+1),easeInElastic:e=>Le(e)?e:De(e,.075,.3),easeOutElastic:e=>Le(e)?e:Fe(e,.075,.3),easeInOutElastic(e){const t=.1125;return Le(e)?e:e<.5?.5*De(2*e,t,.45):.5+.5*Fe(2*e-1,t,.45)},easeInBack(e){const t=1.70158;return e*e*((t+1)*e-t)},easeOutBack(e){const t=1.70158;return(e-=1)*e*((t+1)*e+t)+1},easeInOutBack(e){let t=1.70158;return(e/=.5)<1?e*e*((1+(t*=1.525))*e-t)*.5:.5*((e-=2)*e*((1+(t*=1.525))*e+t)+2)},easeInBounce:e=>1-Be.easeOutBounce(1-e),easeOutBounce(e){const t=7.5625,n=2.75;return e<1/n?t*e*e:e<2/n?t*(e-=1.5/n)*e+.75:e<2.5/n?t*(e-=2.25/n)*e+.9375:t*(e-=2.625/n)*e+.984375},easeInOutBounce:e=>e<.5?.5*Be.easeInBounce(2*e):.5*Be.easeOutBounce(2*e-1)+.5};function We(e){if(e&&"object"==typeof e){const t=e.toString();return"[object CanvasPattern]"===t||"[object CanvasGradient]"===t}return!1}function He(e){return We(e)?e:new I(e)}function qe(e){return We(e)?e:new I(e).saturate(.5).darken(.1).hexString()}const Ue=["x","y","borderWidth","radius","tension"],Ve=["color","borderColor","backgroundColor"];const Ke=new Map;function Qe(e,t,n){return function(e,t){t=t||{};const n=e+JSON.stringify(t);let r=Ke.get(n);return r||(r=new Intl.NumberFormat(e,t),Ke.set(n,r)),r}(t,n).format(e)}const Ye={values:e=>D(e)?e:""+e,numeric(e,t,n){if(0===e)return"0";const r=this.chart.options.locale;let o,i=e;if(n.length>1){const t=Math.max(Math.abs(n[0].value),Math.abs(n[n.length-1].value));(t<1e-4||t>1e15)&&(o="scientific"),i=function(e,t){let n=t.length>3?t[2].value-t[1].value:t[1].value-t[0].value;Math.abs(n)>=1&&e!==Math.floor(e)&&(n=e-Math.floor(e));return n}(e,n)}const a=pe(Math.abs(i)),s=isNaN(a)?1:Math.max(Math.min(-1*Math.floor(a),20),0),l={notation:o,minimumFractionDigits:s,maximumFractionDigits:s};return Object.assign(l,this.options.ticks.format),Qe(e,r,l)},logarithmic(e,t,n){if(0===e)return"0";const r=n[t].significand||e/Math.pow(10,Math.floor(pe(e)));return[1,2,3,5,10,15].includes(r)||t>.8*n.length?Ye.numeric.call(this,e,t,n):""}};var Ge={formatters:Ye};const Xe=Object.create(null),Ze=Object.create(null);function Je(e,t){if(!t)return e;const n=t.split(".");for(let t=0,r=n.length;t<r;++t){const r=n[t];e=e[r]||(e[r]=Object.create(null))}return e}function et(e,t,n){return"string"==typeof t?X(Je(e,t),n):X(Je(e,""),t)}class tt{constructor(e,t){this.animation=void 0,this.backgroundColor="rgba(0,0,0,0.1)",this.borderColor="rgba(0,0,0,0.1)",this.color="#666",this.datasets={},this.devicePixelRatio=e=>e.chart.platform.getDevicePixelRatio(),this.elements={},this.events=["mousemove","mouseout","click","touchstart","touchmove"],this.font={family:"'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",size:12,style:"normal",lineHeight:1.2,weight:null},this.hover={},this.hoverBackgroundColor=(e,t)=>qe(t.backgroundColor),this.hoverBorderColor=(e,t)=>qe(t.borderColor),this.hoverColor=(e,t)=>qe(t.color),this.indexAxis="x",this.interaction={mode:"nearest",intersect:!0,includeInvisible:!1},this.maintainAspectRatio=!0,this.onHover=null,this.onClick=null,this.parsing=!0,this.plugins={},this.responsive=!0,this.scale=void 0,this.scales={},this.showLine=!0,this.drawActiveElementsOnTop=!0,this.describe(e),this.apply(t)}set(e,t){return et(this,e,t)}get(e){return Je(this,e)}describe(e,t){return et(Ze,e,t)}override(e,t){return et(Xe,e,t)}route(e,t,n,r){const o=Je(this,e),i=Je(this,n),a="_"+t;Object.defineProperties(o,{[a]:{value:o[t],writable:!0},[t]:{enumerable:!0,get(){const e=this[a],t=i[r];return F(e)?Object.assign({},t,e):H(e,t)},set(e){this[a]=e}}})}apply(e){e.forEach((e=>e(this)))}}var nt=new tt({_scriptable:e=>!e.startsWith("on"),_indexable:e=>"events"!==e,hover:{_fallback:"interaction"},interaction:{_scriptable:!1,_indexable:!1}},[function(e){e.set("animation",{delay:void 0,duration:1e3,easing:"easeOutQuart",fn:void 0,from:void 0,loop:void 0,to:void 0,type:void 0}),e.describe("animation",{_fallback:!1,_indexable:!1,_scriptable:e=>"onProgress"!==e&&"onComplete"!==e&&"fn"!==e}),e.set("animations",{colors:{type:"color",properties:Ve},numbers:{type:"number",properties:Ue}}),e.describe("animations",{_fallback:"animation"}),e.set("transitions",{active:{animation:{duration:400}},resize:{animation:{duration:0}},show:{animations:{colors:{from:"transparent"},visible:{type:"boolean",duration:0}}},hide:{animations:{colors:{to:"transparent"},visible:{type:"boolean",easing:"linear",fn:e=>0|e}}}})},function(e){e.set("layout",{autoPadding:!0,padding:{top:0,right:0,bottom:0,left:0}})},function(e){e.set("scale",{display:!0,offset:!1,reverse:!1,beginAtZero:!1,bounds:"ticks",clip:!0,grace:0,grid:{display:!0,lineWidth:1,drawOnChartArea:!0,drawTicks:!0,tickLength:8,tickWidth:(e,t)=>t.lineWidth,tickColor:(e,t)=>t.color,offset:!1},border:{display:!0,dash:[],dashOffset:0,width:1},title:{display:!1,text:"",padding:{top:4,bottom:4}},ticks:{minRotation:0,maxRotation:50,mirror:!1,textStrokeWidth:0,textStrokeColor:"",padding:3,display:!0,autoSkip:!0,autoSkipPadding:3,labelOffset:0,callback:Ge.formatters.values,minor:{},major:{},align:"center",crossAlign:"near",showLabelBackdrop:!1,backdropColor:"rgba(255, 255, 255, 0.75)",backdropPadding:2}}),e.route("scale.ticks","color","","color"),e.route("scale.grid","color","","borderColor"),e.route("scale.border","color","","borderColor"),e.route("scale.title","color","","color"),e.describe("scale",{_fallback:!1,_scriptable:e=>!e.startsWith("before")&&!e.startsWith("after")&&"callback"!==e&&"parser"!==e,_indexable:e=>"borderDash"!==e&&"tickBorderDash"!==e&&"dash"!==e}),e.describe("scales",{_fallback:"scale"}),e.describe("scale.ticks",{_scriptable:e=>"backdropPadding"!==e&&"callback"!==e,_indexable:e=>"backdropPadding"!==e})}]);function rt(e,t,n,r,o){let i=t[o];return i||(i=t[o]=e.measureText(o).width,n.push(o)),i>r&&(r=i),r}function ot(e,t,n){const r=e.currentDevicePixelRatio,o=0!==n?Math.max(n/2,.5):0;return Math.round((t-o)*r)/r+o}function it(e,t){(t||e)&&((t=t||e.getContext("2d")).save(),t.resetTransform(),t.clearRect(0,0,e.width,e.height),t.restore())}function at(e,t,n,r){st(e,t,n,r,null)}function st(e,t,n,r,o){let i,a,s,l,c,u,d,h;const p=t.pointStyle,f=t.rotation,m=t.radius;let g=(f||0)*ce;if(p&&"object"==typeof p&&(i=p.toString(),"[object HTMLImageElement]"===i||"[object HTMLCanvasElement]"===i))return e.save(),e.translate(n,r),e.rotate(g),e.drawImage(p,-p.width/2,-p.height/2,p.width,p.height),void e.restore();if(!(isNaN(m)||m<=0)){switch(e.beginPath(),p){default:o?e.ellipse(n,r,o/2,m,0,0,se):e.arc(n,r,m,0,se),e.closePath();break;case"triangle":u=o?o/2:m,e.moveTo(n+Math.sin(g)*u,r-Math.cos(g)*m),g+=he,e.lineTo(n+Math.sin(g)*u,r-Math.cos(g)*m),g+=he,e.lineTo(n+Math.sin(g)*u,r-Math.cos(g)*m),e.closePath();break;case"rectRounded":c=.516*m,l=m-c,a=Math.cos(g+de)*l,d=Math.cos(g+de)*(o?o/2-c:l),s=Math.sin(g+de)*l,h=Math.sin(g+de)*(o?o/2-c:l),e.arc(n-d,r-s,c,g-ae,g-ue),e.arc(n+h,r-a,c,g-ue,g),e.arc(n+d,r+s,c,g,g+ue),e.arc(n-h,r+a,c,g+ue,g+ae),e.closePath();break;case"rect":if(!f){l=Math.SQRT1_2*m,u=o?o/2:l,e.rect(n-u,r-l,2*u,2*l);break}g+=de;case"rectRot":d=Math.cos(g)*(o?o/2:m),a=Math.cos(g)*m,s=Math.sin(g)*m,h=Math.sin(g)*(o?o/2:m),e.moveTo(n-d,r-s),e.lineTo(n+h,r-a),e.lineTo(n+d,r+s),e.lineTo(n-h,r+a),e.closePath();break;case"crossRot":g+=de;case"cross":d=Math.cos(g)*(o?o/2:m),a=Math.cos(g)*m,s=Math.sin(g)*m,h=Math.sin(g)*(o?o/2:m),e.moveTo(n-d,r-s),e.lineTo(n+d,r+s),e.moveTo(n+h,r-a),e.lineTo(n-h,r+a);break;case"star":d=Math.cos(g)*(o?o/2:m),a=Math.cos(g)*m,s=Math.sin(g)*m,h=Math.sin(g)*(o?o/2:m),e.moveTo(n-d,r-s),e.lineTo(n+d,r+s),e.moveTo(n+h,r-a),e.lineTo(n-h,r+a),g+=de,d=Math.cos(g)*(o?o/2:m),a=Math.cos(g)*m,s=Math.sin(g)*m,h=Math.sin(g)*(o?o/2:m),e.moveTo(n-d,r-s),e.lineTo(n+d,r+s),e.moveTo(n+h,r-a),e.lineTo(n-h,r+a);break;case"line":a=o?o/2:Math.cos(g)*m,s=Math.sin(g)*m,e.moveTo(n-a,r-s),e.lineTo(n+a,r+s);break;case"dash":e.moveTo(n,r),e.lineTo(n+Math.cos(g)*(o?o/2:m),r+Math.sin(g)*m);break;case!1:e.closePath()}e.fill(),t.borderWidth>0&&e.stroke()}}function lt(e,t,n){return n=n||.5,!t||e&&e.x>t.left-n&&e.x<t.right+n&&e.y>t.top-n&&e.y<t.bottom+n}function ct(e,t){e.save(),e.beginPath(),e.rect(t.left,t.top,t.right-t.left,t.bottom-t.top),e.clip()}function ut(e){e.restore()}function dt(e,t,n,r,o){if(o.strikethrough||o.underline){const i=e.measureText(r),a=t-i.actualBoundingBoxLeft,s=t+i.actualBoundingBoxRight,l=n-i.actualBoundingBoxAscent,c=n+i.actualBoundingBoxDescent,u=o.strikethrough?(l+c)/2:c;e.strokeStyle=e.fillStyle,e.beginPath(),e.lineWidth=o.decorationWidth||2,e.moveTo(a,u),e.lineTo(s,u),e.stroke()}}function ht(e,t){const n=e.fillStyle;e.fillStyle=t.color,e.fillRect(t.left,t.top,t.width,t.height),e.fillStyle=n}function pt(e,t,n,r,o,i={}){const a=D(t)?t:[t],s=i.strokeWidth>0&&""!==i.strokeColor;let l,c;for(e.save(),e.font=o.string,function(e,t){t.translation&&e.translate(t.translation[0],t.translation[1]),L(t.rotation)||e.rotate(t.rotation),t.color&&(e.fillStyle=t.color),t.textAlign&&(e.textAlign=t.textAlign),t.textBaseline&&(e.textBaseline=t.textBaseline)}(e,i),l=0;l<a.length;++l)c=a[l],i.backdrop&&ht(e,i.backdrop),s&&(i.strokeColor&&(e.strokeStyle=i.strokeColor),L(i.strokeWidth)||(e.lineWidth=i.strokeWidth),e.strokeText(c,n,r,i.maxWidth)),e.fillText(c,n,r,i.maxWidth),dt(e,n,r,c,i),r+=Number(o.lineHeight);e.restore()}function ft(e,t){const{x:n,y:r,w:o,h:i,radius:a}=t;e.arc(n+a.topLeft,r+a.topLeft,a.topLeft,1.5*ae,ae,!0),e.lineTo(n,r+i-a.bottomLeft),e.arc(n+a.bottomLeft,r+i-a.bottomLeft,a.bottomLeft,ae,ue,!0),e.lineTo(n+o-a.bottomRight,r+i),e.arc(n+o-a.bottomRight,r+i-a.bottomRight,a.bottomRight,ue,0,!0),e.lineTo(n+o,r+a.topRight),e.arc(n+o-a.topRight,r+a.topRight,a.topRight,0,-ue,!0),e.lineTo(n+a.topLeft,r)}const mt=/^(normal|(\d+(?:\.\d+)?)(px|em|%)?)$/,gt=/^(normal|italic|initial|inherit|unset|(oblique( -?[0-9]?[0-9]deg)?))$/;function yt(e,t){const n=(""+e).match(mt);if(!n||"normal"===n[1])return 1.2*t;switch(e=+n[2],n[3]){case"px":return e;case"%":e/=100}return t*e}const bt=e=>+e||0;function vt(e,t){const n={},r=F(t),o=r?Object.keys(t):t,i=F(e)?r?n=>H(e[n],e[t[n]]):t=>e[t]:()=>e;for(const e of o)n[e]=bt(i(e));return n}function xt(e){return vt(e,{top:"y",right:"x",bottom:"y",left:"x"})}function kt(e){return vt(e,["topLeft","topRight","bottomLeft","bottomRight"])}function wt(e){const t=xt(e);return t.width=t.left+t.right,t.height=t.top+t.bottom,t}function _t(e,t){e=e||{},t=t||nt.font;let n=H(e.size,t.size);"string"==typeof n&&(n=parseInt(n,10));let r=H(e.style,t.style);r&&!(""+r).match(gt)&&(console.warn('Invalid font style specified: "'+r+'"'),r=void 0);const o={family:H(e.family,t.family),lineHeight:yt(H(e.lineHeight,t.lineHeight),n),size:n,style:r,weight:H(e.weight,t.weight),string:""};return o.string=function(e){return!e||L(e.size)||L(e.family)?null:(e.style?e.style+" ":"")+(e.weight?e.weight+" ":"")+e.size+"px "+e.family}(o),o}function St(e,t,n,r){let o,i,a,s=!0;for(o=0,i=e.length;o<i;++o)if(a=e[o],void 0!==a&&(void 0!==t&&"function"==typeof a&&(a=a(t),s=!1),void 0!==n&&D(a)&&(a=a[n%a.length],s=!1),void 0!==a))return r&&!s&&(r.cacheable=!1),a}function Et(e,t){return Object.assign(Object.create(e),t)}function Ct(e,t=[""],n,r,o=(()=>e[0])){const i=n||e;void 0===r&&(r=$t("_fallback",e));const a={[Symbol.toStringTag]:"Object",_cacheable:!0,_scopes:e,_rootScopes:i,_fallback:r,_getTarget:o,override:n=>Ct([n,...e],t,i,r)};return new Proxy(a,{deleteProperty:(t,n)=>(delete t[n],delete t._keys,delete e[0][n],!0),get:(n,r)=>Pt(n,r,(()=>function(e,t,n,r){let o;for(const i of t)if(o=$t(Mt(i,e),n),void 0!==o)return Rt(e,o)?It(n,r,e,o):o}(r,t,e,n))),getOwnPropertyDescriptor:(e,t)=>Reflect.getOwnPropertyDescriptor(e._scopes[0],t),getPrototypeOf:()=>Reflect.getPrototypeOf(e[0]),has:(e,t)=>Lt(e).includes(t),ownKeys:e=>Lt(e),set(e,t,n){const r=e._storage||(e._storage=o());return e[t]=r[t]=n,delete e._keys,!0}})}function At(e,t,n,r){const o={_cacheable:!1,_proxy:e,_context:t,_subProxy:n,_stack:new Set,_descriptors:Ot(e,r),setContext:t=>At(e,t,n,r),override:o=>At(e.override(o),t,n,r)};return new Proxy(o,{deleteProperty:(t,n)=>(delete t[n],delete e[n],!0),get:(e,t,n)=>Pt(e,t,(()=>function(e,t,n){const{_proxy:r,_context:o,_subProxy:i,_descriptors:a}=e;let s=r[t];oe(s)&&a.isScriptable(t)&&(s=function(e,t,n,r){const{_proxy:o,_context:i,_subProxy:a,_stack:s}=n;if(s.has(e))throw new Error("Recursion detected: "+Array.from(s).join("->")+"->"+e);s.add(e);let l=t(i,a||r);s.delete(e),Rt(e,l)&&(l=It(o._scopes,o,e,l));return l}(t,s,e,n));D(s)&&s.length&&(s=function(e,t,n,r){const{_proxy:o,_context:i,_subProxy:a,_descriptors:s}=n;if(void 0!==i.index&&r(e))return t[i.index%t.length];if(F(t[0])){const n=t,r=o._scopes.filter((e=>e!==n));t=[];for(const l of n){const n=It(r,o,e,l);t.push(At(n,i,a&&a[e],s))}}return t}(t,s,e,a.isIndexable));Rt(t,s)&&(s=At(s,o,i&&i[t],a));return s}(e,t,n))),getOwnPropertyDescriptor:(t,n)=>t._descriptors.allKeys?Reflect.has(e,n)?{enumerable:!0,configurable:!0}:void 0:Reflect.getOwnPropertyDescriptor(e,n),getPrototypeOf:()=>Reflect.getPrototypeOf(e),has:(t,n)=>Reflect.has(e,n),ownKeys:()=>Reflect.ownKeys(e),set:(t,n,r)=>(e[n]=r,delete t[n],!0)})}function Ot(e,t={scriptable:!0,indexable:!0}){const{_scriptable:n=t.scriptable,_indexable:r=t.indexable,_allKeys:o=t.allKeys}=e;return{allKeys:o,scriptable:n,indexable:r,isScriptable:oe(n)?n:()=>n,isIndexable:oe(r)?r:()=>r}}const Mt=(e,t)=>e?e+ne(t):t,Rt=(e,t)=>F(t)&&"adapters"!==e&&(null===Object.getPrototypeOf(t)||t.constructor===Object);function Pt(e,t,n){if(Object.prototype.hasOwnProperty.call(e,t)||"constructor"===t)return e[t];const r=n();return e[t]=r,r}function Tt(e,t,n){return oe(e)?e(t,n):e}const zt=(e,t)=>!0===e?t:"string"==typeof e?te(t,e):void 0;function jt(e,t,n,r,o){for(const i of t){const t=zt(n,i);if(t){e.add(t);const i=Tt(t._fallback,n,o);if(void 0!==i&&i!==n&&i!==r)return i}else if(!1===t&&void 0!==r&&n!==r)return null}return!1}function It(e,t,n,r){const o=t._rootScopes,i=Tt(t._fallback,n,r),a=[...e,...o],s=new Set;s.add(r);let l=Nt(s,a,n,i||n,r);return null!==l&&((void 0===i||i===n||(l=Nt(s,a,i,l,r),null!==l))&&Ct(Array.from(s),[""],o,i,(()=>function(e,t,n){const r=e._getTarget();t in r||(r[t]={});const o=r[t];if(D(o)&&F(n))return n;return o||{}}(t,n,r))))}function Nt(e,t,n,r,o){for(;n;)n=jt(e,t,n,r,o);return n}function $t(e,t){for(const n of t){if(!n)continue;const t=n[e];if(void 0!==t)return t}}function Lt(e){let t=e._keys;return t||(t=e._keys=function(e){const t=new Set;for(const n of e)for(const e of Object.keys(n).filter((e=>!e.startsWith("_"))))t.add(e);return Array.from(t)}(e._scopes)),t}Number.EPSILON;function Dt(){return"undefined"!=typeof window&&"undefined"!=typeof document}function Ft(e){let t=e.parentNode;return t&&"[object ShadowRoot]"===t.toString()&&(t=t.host),t}function Bt(e,t,n){let r;return"string"==typeof e?(r=parseInt(e,10),-1!==e.indexOf("%")&&(r=r/100*t.parentNode[n])):r=e,r}const Wt=e=>e.ownerDocument.defaultView.getComputedStyle(e,null);const Ht=["top","right","bottom","left"];function qt(e,t,n){const r={};n=n?"-"+n:"";for(let o=0;o<4;o++){const i=Ht[o];r[i]=parseFloat(e[t+"-"+i+n])||0}return r.width=r.left+r.right,r.height=r.top+r.bottom,r}const Ut=(e,t,n)=>(e>0||t>0)&&(!n||!n.shadowRoot);function Vt(e,t){if("native"in e)return e;const{canvas:n,currentDevicePixelRatio:r}=t,o=Wt(n),i="border-box"===o.boxSizing,a=qt(o,"padding"),s=qt(o,"border","width"),{x:l,y:c,box:u}=function(e,t){const n=e.touches,r=n&&n.length?n[0]:e,{offsetX:o,offsetY:i}=r;let a,s,l=!1;if(Ut(o,i,e.target))a=o,s=i;else{const e=t.getBoundingClientRect();a=r.clientX-e.left,s=r.clientY-e.top,l=!0}return{x:a,y:s,box:l}}(e,n),d=a.left+(u&&s.left),h=a.top+(u&&s.top);let{width:p,height:f}=t;return i&&(p-=a.width+s.width,f-=a.height+s.height),{x:Math.round((l-d)/p*n.width/r),y:Math.round((c-h)/f*n.height/r)}}const Kt=e=>Math.round(10*e)/10;function Qt(e,t,n,r){const o=Wt(e),i=qt(o,"margin"),a=Bt(o.maxWidth,e,"clientWidth")||le,s=Bt(o.maxHeight,e,"clientHeight")||le,l=function(e,t,n){let r,o;if(void 0===t||void 0===n){const i=e&&Ft(e);if(i){const e=i.getBoundingClientRect(),a=Wt(i),s=qt(a,"border","width"),l=qt(a,"padding");t=e.width-l.width-s.width,n=e.height-l.height-s.height,r=Bt(a.maxWidth,i,"clientWidth"),o=Bt(a.maxHeight,i,"clientHeight")}else t=e.clientWidth,n=e.clientHeight}return{width:t,height:n,maxWidth:r||le,maxHeight:o||le}}(e,t,n);let{width:c,height:u}=l;if("content-box"===o.boxSizing){const e=qt(o,"border","width"),t=qt(o,"padding");c-=t.width+e.width,u-=t.height+e.height}c=Math.max(0,c-i.width),u=Math.max(0,r?c/r:u-i.height),c=Kt(Math.min(c,a,l.maxWidth)),u=Kt(Math.min(u,s,l.maxHeight)),c&&!u&&(u=Kt(c/2));return(void 0!==t||void 0!==n)&&r&&l.height&&u>l.height&&(u=l.height,c=Kt(Math.floor(u*r))),{width:c,height:u}}function Yt(e,t,n){const r=t||1,o=Math.floor(e.height*r),i=Math.floor(e.width*r);e.height=Math.floor(e.height),e.width=Math.floor(e.width);const a=e.canvas;return a.style&&(n||!a.style.height&&!a.style.width)&&(a.style.height=`${e.height}px`,a.style.width=`${e.width}px`),(e.currentDevicePixelRatio!==r||a.height!==o||a.width!==i)&&(e.currentDevicePixelRatio=r,a.height=o,a.width=i,e.ctx.setTransform(r,0,0,r,0,0),!0)}const Gt=function(){let e=!1;try{const t={get passive(){return e=!0,!1}};Dt()&&(window.addEventListener("test",null,t),window.removeEventListener("test",null,t))}catch(e){}return e}();function Xt(e,t){const n=function(e,t){return Wt(e).getPropertyValue(t)}(e,t),r=n&&n.match(/^(\d+)(\.\d+)?px$/);return r?+r[1]:void 0}function Zt(e,t,n){return e?function(e,t){return{x:n=>e+e+t-n,setWidth(e){t=e},textAlign:e=>"center"===e?e:"right"===e?"left":"right",xPlus:(e,t)=>e-t,leftForLtr:(e,t)=>e-t}}(t,n):{x:e=>e,setWidth(e){},textAlign:e=>e,xPlus:(e,t)=>e+t,leftForLtr:(e,t)=>e}}function Jt(e,t){let n,r;"ltr"!==t&&"rtl"!==t||(n=e.canvas.style,r=[n.getPropertyValue("direction"),n.getPropertyPriority("direction")],n.setProperty("direction",t,"important"),e.prevTextDirection=r)}function en(e,t){void 0!==t&&(delete e.prevTextDirection,e.canvas.style.setProperty("direction",t[0],t[1]))}
/*!
 * Chart.js v4.4.4
 * https://www.chartjs.org
 * (c) 2024 Chart.js Contributors
 * Released under the MIT License
 */
class tn{constructor(){this._request=null,this._charts=new Map,this._running=!1,this._lastDate=void 0}_notify(e,t,n,r){const o=t.listeners[r],i=t.duration;o.forEach((r=>r({chart:e,initial:t.initial,numSteps:i,currentStep:Math.min(n-t.start,i)})))}_refresh(){this._request||(this._running=!0,this._request=je.call(window,(()=>{this._update(),this._request=null,this._running&&this._refresh()})))}_update(e=Date.now()){let t=0;this._charts.forEach(((n,r)=>{if(!n.running||!n.items.length)return;const o=n.items;let i,a=o.length-1,s=!1;for(;a>=0;--a)i=o[a],i._active?(i._total>n.duration&&(n.duration=i._total),i.tick(e),s=!0):(o[a]=o[o.length-1],o.pop());s&&(r.draw(),this._notify(r,n,e,"progress")),o.length||(n.running=!1,this._notify(r,n,e,"complete"),n.initial=!1),t+=o.length})),this._lastDate=e,0===t&&(this._running=!1)}_getAnims(e){const t=this._charts;let n=t.get(e);return n||(n={running:!1,initial:!0,items:[],listeners:{complete:[],progress:[]}},t.set(e,n)),n}listen(e,t,n){this._getAnims(e).listeners[t].push(n)}add(e,t){t&&t.length&&this._getAnims(e).items.push(...t)}has(e){return this._getAnims(e).items.length>0}start(e){const t=this._charts.get(e);t&&(t.running=!0,t.start=Date.now(),t.duration=t.items.reduce(((e,t)=>Math.max(e,t._duration)),0),this._refresh())}running(e){if(!this._running)return!1;const t=this._charts.get(e);return!!(t&&t.running&&t.items.length)}stop(e){const t=this._charts.get(e);if(!t||!t.items.length)return;const n=t.items;let r=n.length-1;for(;r>=0;--r)n[r].cancel();t.items=[],this._notify(e,t,Date.now(),"complete")}remove(e){return this._charts.delete(e)}}var nn=new tn;const rn="transparent",on={boolean:(e,t,n)=>n>.5?t:e,color(e,t,n){const r=He(e||rn),o=r.valid&&He(t||rn);return o&&o.valid?o.mix(r,n).hexString():t},number:(e,t,n)=>e+(t-e)*n};class an{constructor(e,t,n,r){const o=t[n];r=St([e.to,r,o,e.from]);const i=St([e.from,o,r]);this._active=!0,this._fn=e.fn||on[e.type||typeof i],this._easing=Be[e.easing]||Be.linear,this._start=Math.floor(Date.now()+(e.delay||0)),this._duration=this._total=Math.floor(e.duration),this._loop=!!e.loop,this._target=t,this._prop=n,this._from=i,this._to=r,this._promises=void 0}active(){return this._active}update(e,t,n){if(this._active){this._notify(!1);const r=this._target[this._prop],o=n-this._start,i=this._duration-o;this._start=n,this._duration=Math.floor(Math.max(i,e.duration)),this._total+=o,this._loop=!!e.loop,this._to=St([e.to,t,r,e.from]),this._from=St([e.from,r,t])}}cancel(){this._active&&(this.tick(Date.now()),this._active=!1,this._notify(!1))}tick(e){const t=e-this._start,n=this._duration,r=this._prop,o=this._from,i=this._loop,a=this._to;let s;if(this._active=o!==a&&(i||t<n),!this._active)return this._target[r]=a,void this._notify(!0);t<0?this._target[r]=o:(s=t/n%2,s=i&&s>1?2-s:s,s=this._easing(Math.min(1,Math.max(0,s))),this._target[r]=this._fn(o,a,s))}wait(){const e=this._promises||(this._promises=[]);return new Promise(((t,n)=>{e.push({res:t,rej:n})}))}_notify(e){const t=e?"res":"rej",n=this._promises||[];for(let e=0;e<n.length;e++)n[e][t]()}}class sn{constructor(e,t){this._chart=e,this._properties=new Map,this.configure(t)}configure(e){if(!F(e))return;const t=Object.keys(nt.animation),n=this._properties;Object.getOwnPropertyNames(e).forEach((r=>{const o=e[r];if(!F(o))return;const i={};for(const e of t)i[e]=o[e];(D(o.properties)&&o.properties||[r]).forEach((e=>{e!==r&&n.has(e)||n.set(e,i)}))}))}_animateOptions(e,t){const n=t.options,r=function(e,t){if(!t)return;let n=e.options;if(!n)return void(e.options=t);n.$shared&&(e.options=n=Object.assign({},n,{$shared:!1,$animations:{}}));return n}(e,n);if(!r)return[];const o=this._createAnimations(r,n);return n.$shared&&function(e,t){const n=[],r=Object.keys(t);for(let t=0;t<r.length;t++){const o=e[r[t]];o&&o.active()&&n.push(o.wait())}return Promise.all(n)}(e.options.$animations,n).then((()=>{e.options=n}),(()=>{})),o}_createAnimations(e,t){const n=this._properties,r=[],o=e.$animations||(e.$animations={}),i=Object.keys(t),a=Date.now();let s;for(s=i.length-1;s>=0;--s){const l=i[s];if("$"===l.charAt(0))continue;if("options"===l){r.push(...this._animateOptions(e,t));continue}const c=t[l];let u=o[l];const d=n.get(l);if(u){if(d&&u.active()){u.update(d,c,a);continue}u.cancel()}d&&d.duration?(o[l]=u=new an(d,e,l,c),r.push(u)):e[l]=c}return r}update(e,t){if(0===this._properties.size)return void Object.assign(e,t);const n=this._createAnimations(e,t);return n.length?(nn.add(this._chart,n),!0):void 0}}function ln(e,t){const n=e&&e.options||{},r=n.reverse,o=void 0===n.min?t:0,i=void 0===n.max?t:0;return{start:r?i:o,end:r?o:i}}function cn(e,t){const n=[],r=e._getSortedDatasetMetas(t);let o,i;for(o=0,i=r.length;o<i;++o)n.push(r[o].index);return n}function un(e,t,n,r={}){const o=e.keys,i="single"===r.mode;let a,s,l,c;if(null!==t){for(a=0,s=o.length;a<s;++a){if(l=+o[a],l===n){if(r.all)continue;break}c=e.values[l],B(c)&&(i||0===t||fe(t)===fe(c))&&(t+=c)}return t}}function dn(e,t){const n=e&&e.options.stacked;return n||void 0===n&&void 0!==t.stack}function hn(e,t,n){const r=e[t]||(e[t]={});return r[n]||(r[n]={})}function pn(e,t,n,r){for(const o of t.getMatchingVisibleMetas(r).reverse()){const t=e[o.index];if(n&&t>0||!n&&t<0)return o.index}return null}function fn(e,t){const{chart:n,_cachedMeta:r}=e,o=n._stacks||(n._stacks={}),{iScale:i,vScale:a,index:s}=r,l=i.axis,c=a.axis,u=function(e,t,n){return`${e.id}.${t.id}.${n.stack||n.type}`}(i,a,r),d=t.length;let h;for(let e=0;e<d;++e){const n=t[e],{[l]:i,[c]:d}=n;h=(n._stacks||(n._stacks={}))[c]=hn(o,u,i),h[s]=d,h._top=pn(h,a,!0,r.type),h._bottom=pn(h,a,!1,r.type);(h._visualValues||(h._visualValues={}))[s]=d}}function mn(e,t){const n=e.scales;return Object.keys(n).filter((e=>n[e].axis===t)).shift()}function gn(e,t){const n=e.controller.index,r=e.vScale&&e.vScale.axis;if(r){t=t||e._parsed;for(const e of t){const t=e._stacks;if(!t||void 0===t[r]||void 0===t[r][n])return;delete t[r][n],void 0!==t[r]._visualValues&&void 0!==t[r]._visualValues[n]&&delete t[r]._visualValues[n]}}}const yn=e=>"reset"===e||"none"===e,bn=(e,t)=>t?e:Object.assign({},e);class vn{static defaults={};static datasetElementType=null;static dataElementType=null;constructor(e,t){this.chart=e,this._ctx=e.ctx,this.index=t,this._cachedDataOpts={},this._cachedMeta=this.getMeta(),this._type=this._cachedMeta.type,this.options=void 0,this._parsing=!1,this._data=void 0,this._objectData=void 0,this._sharedOptions=void 0,this._drawStart=void 0,this._drawCount=void 0,this.enableOptionSharing=!1,this.supportsDecimation=!1,this.$context=void 0,this._syncList=[],this.datasetElementType=new.target.datasetElementType,this.dataElementType=new.target.dataElementType,this.initialize()}initialize(){const e=this._cachedMeta;this.configure(),this.linkScales(),e._stacked=dn(e.vScale,e),this.addElements(),this.options.fill&&!this.chart.isPluginEnabled("filler")&&console.warn("Tried to use the 'fill' option without the 'Filler' plugin enabled. Please import and register the 'Filler' plugin and make sure it is not disabled in the options")}updateIndex(e){this.index!==e&&gn(this._cachedMeta),this.index=e}linkScales(){const e=this.chart,t=this._cachedMeta,n=this.getDataset(),r=(e,t,n,r)=>"x"===e?t:"r"===e?r:n,o=t.xAxisID=H(n.xAxisID,mn(e,"x")),i=t.yAxisID=H(n.yAxisID,mn(e,"y")),a=t.rAxisID=H(n.rAxisID,mn(e,"r")),s=t.indexAxis,l=t.iAxisID=r(s,o,i,a),c=t.vAxisID=r(s,i,o,a);t.xScale=this.getScaleForId(o),t.yScale=this.getScaleForId(i),t.rScale=this.getScaleForId(a),t.iScale=this.getScaleForId(l),t.vScale=this.getScaleForId(c)}getDataset(){return this.chart.data.datasets[this.index]}getMeta(){return this.chart.getDatasetMeta(this.index)}getScaleForId(e){return this.chart.scales[e]}_getOtherScale(e){const t=this._cachedMeta;return e===t.iScale?t.vScale:t.iScale}reset(){this._update("reset")}_destroy(){const e=this._cachedMeta;this._data&&Te(this._data,this),e._stacked&&gn(e)}_dataCheck(){const e=this.getDataset(),t=e.data||(e.data=[]),n=this._data;if(F(t)){const e=this._cachedMeta;this._data=function(e,t){const{iScale:n,vScale:r}=t,o="x"===n.axis?"x":"y",i="x"===r.axis?"x":"y",a=Object.keys(e),s=new Array(a.length);let l,c,u;for(l=0,c=a.length;l<c;++l)u=a[l],s[l]={[o]:u,[i]:e[u]};return s}(t,e)}else if(n!==t){if(n){Te(n,this);const e=this._cachedMeta;gn(e),e._parsed=[]}t&&Object.isExtensible(t)&&(o=this,(r=t)._chartjs?r._chartjs.listeners.push(o):(Object.defineProperty(r,"_chartjs",{configurable:!0,enumerable:!1,value:{listeners:[o]}}),Pe.forEach((e=>{const t="_onData"+ne(e),n=r[e];Object.defineProperty(r,e,{configurable:!0,enumerable:!1,value(...e){const o=n.apply(this,e);return r._chartjs.listeners.forEach((n=>{"function"==typeof n[t]&&n[t](...e)})),o}})})))),this._syncList=[],this._data=t}var r,o}addElements(){const e=this._cachedMeta;this._dataCheck(),this.datasetElementType&&(e.dataset=new this.datasetElementType)}buildOrUpdateElements(e){const t=this._cachedMeta,n=this.getDataset();let r=!1;this._dataCheck();const o=t._stacked;t._stacked=dn(t.vScale,t),t.stack!==n.stack&&(r=!0,gn(t),t.stack=n.stack),this._resyncElements(e),(r||o!==t._stacked)&&fn(this,t._parsed)}configure(){const e=this.chart.config,t=e.datasetScopeKeys(this._type),n=e.getOptionScopes(this.getDataset(),t,!0);this.options=e.createResolver(n,this.getContext()),this._parsing=this.options.parsing,this._cachedDataOpts={}}parse(e,t){const{_cachedMeta:n,_data:r}=this,{iScale:o,_stacked:i}=n,a=o.axis;let s,l,c,u=0===e&&t===r.length||n._sorted,d=e>0&&n._parsed[e-1];if(!1===this._parsing)n._parsed=r,n._sorted=!0,c=r;else{c=D(r[e])?this.parseArrayData(n,r,e,t):F(r[e])?this.parseObjectData(n,r,e,t):this.parsePrimitiveData(n,r,e,t);const o=()=>null===l[a]||d&&l[a]<d[a];for(s=0;s<t;++s)n._parsed[s+e]=l=c[s],u&&(o()&&(u=!1),d=l);n._sorted=u}i&&fn(this,c)}parsePrimitiveData(e,t,n,r){const{iScale:o,vScale:i}=e,a=o.axis,s=i.axis,l=o.getLabels(),c=o===i,u=new Array(r);let d,h,p;for(d=0,h=r;d<h;++d)p=d+n,u[d]={[a]:c||o.parse(l[p],p),[s]:i.parse(t[p],p)};return u}parseArrayData(e,t,n,r){const{xScale:o,yScale:i}=e,a=new Array(r);let s,l,c,u;for(s=0,l=r;s<l;++s)c=s+n,u=t[c],a[s]={x:o.parse(u[0],c),y:i.parse(u[1],c)};return a}parseObjectData(e,t,n,r){const{xScale:o,yScale:i}=e,{xAxisKey:a="x",yAxisKey:s="y"}=this._parsing,l=new Array(r);let c,u,d,h;for(c=0,u=r;c<u;++c)d=c+n,h=t[d],l[c]={x:o.parse(te(h,a),d),y:i.parse(te(h,s),d)};return l}getParsed(e){return this._cachedMeta._parsed[e]}getDataElement(e){return this._cachedMeta.data[e]}applyStack(e,t,n){const r=this.chart,o=this._cachedMeta,i=t[e.axis];return un({keys:cn(r,!0),values:t._stacks[e.axis]._visualValues},i,o.index,{mode:n})}updateRangeFromParsed(e,t,n,r){const o=n[t.axis];let i=null===o?NaN:o;const a=r&&n._stacks[t.axis];r&&a&&(r.values=a,i=un(r,o,this._cachedMeta.index)),e.min=Math.min(e.min,i),e.max=Math.max(e.max,i)}getMinMax(e,t){const n=this._cachedMeta,r=n._parsed,o=n._sorted&&e===n.iScale,i=r.length,a=this._getOtherScale(e),s=((e,t,n)=>e&&!t.hidden&&t._stacked&&{keys:cn(n,!0),values:null})(t,n,this.chart),l={min:Number.POSITIVE_INFINITY,max:Number.NEGATIVE_INFINITY},{min:c,max:u}=function(e){const{min:t,max:n,minDefined:r,maxDefined:o}=e.getUserBounds();return{min:r?t:Number.NEGATIVE_INFINITY,max:o?n:Number.POSITIVE_INFINITY}}(a);let d,h;function p(){h=r[d];const t=h[a.axis];return!B(h[e.axis])||c>t||u<t}for(d=0;d<i&&(p()||(this.updateRangeFromParsed(l,e,h,s),!o));++d);if(o)for(d=i-1;d>=0;--d)if(!p()){this.updateRangeFromParsed(l,e,h,s);break}return l}getAllParsedValues(e){const t=this._cachedMeta._parsed,n=[];let r,o,i;for(r=0,o=t.length;r<o;++r)i=t[r][e.axis],B(i)&&n.push(i);return n}getMaxOverflow(){return!1}getLabelAndValue(e){const t=this._cachedMeta,n=t.iScale,r=t.vScale,o=this.getParsed(e);return{label:n?""+n.getLabelForValue(o[n.axis]):"",value:r?""+r.getLabelForValue(o[r.axis]):""}}_update(e){const t=this._cachedMeta;this.update(e||"default"),t._clip=function(e){let t,n,r,o;return F(e)?(t=e.top,n=e.right,r=e.bottom,o=e.left):t=n=r=o=e,{top:t,right:n,bottom:r,left:o,disabled:!1===e}}(H(this.options.clip,function(e,t,n){if(!1===n)return!1;const r=ln(e,n),o=ln(t,n);return{top:o.end,right:r.end,bottom:o.start,left:r.start}}(t.xScale,t.yScale,this.getMaxOverflow())))}update(e){}draw(){const e=this._ctx,t=this.chart,n=this._cachedMeta,r=n.data||[],o=t.chartArea,i=[],a=this._drawStart||0,s=this._drawCount||r.length-a,l=this.options.drawActiveElementsOnTop;let c;for(n.dataset&&n.dataset.draw(e,o,a,s),c=a;c<a+s;++c){const t=r[c];t.hidden||(t.active&&l?i.push(t):t.draw(e,o))}for(c=0;c<i.length;++c)i[c].draw(e,o)}getStyle(e,t){const n=t?"active":"default";return void 0===e&&this._cachedMeta.dataset?this.resolveDatasetElementOptions(n):this.resolveDataElementOptions(e||0,n)}getContext(e,t,n){const r=this.getDataset();let o;if(e>=0&&e<this._cachedMeta.data.length){const t=this._cachedMeta.data[e];o=t.$context||(t.$context=function(e,t,n){return Et(e,{active:!1,dataIndex:t,parsed:void 0,raw:void 0,element:n,index:t,mode:"default",type:"data"})}(this.getContext(),e,t)),o.parsed=this.getParsed(e),o.raw=r.data[e],o.index=o.dataIndex=e}else o=this.$context||(this.$context=function(e,t){return Et(e,{active:!1,dataset:void 0,datasetIndex:t,index:t,mode:"default",type:"dataset"})}(this.chart.getContext(),this.index)),o.dataset=r,o.index=o.datasetIndex=this.index;return o.active=!!t,o.mode=n,o}resolveDatasetElementOptions(e){return this._resolveElementOptions(this.datasetElementType.id,e)}resolveDataElementOptions(e,t){return this._resolveElementOptions(this.dataElementType.id,t,e)}_resolveElementOptions(e,t="default",n){const r="active"===t,o=this._cachedDataOpts,i=e+"-"+t,a=o[i],s=this.enableOptionSharing&&re(n);if(a)return bn(a,s);const l=this.chart.config,c=l.datasetElementScopeKeys(this._type,e),u=r?[`${e}Hover`,"hover",e,""]:[e,""],d=l.getOptionScopes(this.getDataset(),c),h=Object.keys(nt.elements[e]),p=l.resolveNamedOptions(d,h,(()=>this.getContext(n,r,t)),u);return p.$shared&&(p.$shared=s,o[i]=Object.freeze(bn(p,s))),p}_resolveAnimations(e,t,n){const r=this.chart,o=this._cachedDataOpts,i=`animation-${t}`,a=o[i];if(a)return a;let s;if(!1!==r.options.animation){const r=this.chart.config,o=r.datasetAnimationScopeKeys(this._type,t),i=r.getOptionScopes(this.getDataset(),o);s=r.createResolver(i,this.getContext(e,n,t))}const l=new sn(r,s&&s.animations);return s&&s._cacheable&&(o[i]=Object.freeze(l)),l}getSharedOptions(e){if(e.$shared)return this._sharedOptions||(this._sharedOptions=Object.assign({},e))}includeOptions(e,t){return!t||yn(e)||this.chart._animationsDisabled}_getSharedOptions(e,t){const n=this.resolveDataElementOptions(e,t),r=this._sharedOptions,o=this.getSharedOptions(n),i=this.includeOptions(t,o)||o!==r;return this.updateSharedOptions(o,t,n),{sharedOptions:o,includeOptions:i}}updateElement(e,t,n,r){yn(r)?Object.assign(e,n):this._resolveAnimations(t,r).update(e,n)}updateSharedOptions(e,t,n){e&&!yn(t)&&this._resolveAnimations(void 0,t).update(e,n)}_setStyle(e,t,n,r){e.active=r;const o=this.getStyle(t,r);this._resolveAnimations(t,n,r).update(e,{options:!r&&this.getSharedOptions(o)||o})}removeHoverStyle(e,t,n){this._setStyle(e,n,"active",!1)}setHoverStyle(e,t,n){this._setStyle(e,n,"active",!0)}_removeDatasetHoverStyle(){const e=this._cachedMeta.dataset;e&&this._setStyle(e,void 0,"active",!1)}_setDatasetHoverStyle(){const e=this._cachedMeta.dataset;e&&this._setStyle(e,void 0,"active",!0)}_resyncElements(e){const t=this._data,n=this._cachedMeta.data;for(const[e,t,n]of this._syncList)this[e](t,n);this._syncList=[];const r=n.length,o=t.length,i=Math.min(o,r);i&&this.parse(0,i),o>r?this._insertElements(r,o-r,e):o<r&&this._removeElements(o,r-o)}_insertElements(e,t,n=!0){const r=this._cachedMeta,o=r.data,i=e+t;let a;const s=e=>{for(e.length+=t,a=e.length-1;a>=i;a--)e[a]=e[a-t]};for(s(o),a=e;a<i;++a)o[a]=new this.dataElementType;this._parsing&&s(r._parsed),this.parse(e,t),n&&this.updateElements(o,e,t,"reset")}updateElements(e,t,n,r){}_removeElements(e,t){const n=this._cachedMeta;if(this._parsing){const r=n._parsed.splice(e,t);n._stacked&&gn(n,r)}n.data.splice(e,t)}_sync(e){if(this._parsing)this._syncList.push(e);else{const[t,n,r]=e;this[t](n,r)}this.chart._dataChanges.push([this.index,...e])}_onDataPush(){const e=arguments.length;this._sync(["_insertElements",this.getDataset().data.length-e,e])}_onDataPop(){this._sync(["_removeElements",this._cachedMeta.data.length-1,1])}_onDataShift(){this._sync(["_removeElements",0,1])}_onDataSplice(e,t){t&&this._sync(["_removeElements",e,t]);const n=arguments.length-2;n&&this._sync(["_insertElements",e,n])}_onDataUnshift(){this._sync(["_insertElements",0,arguments.length])}}function xn(e){const t=e.iScale,n=function(e,t){if(!e._cache.$bar){const n=e.getMatchingVisibleMetas(t);let r=[];for(let t=0,o=n.length;t<o;t++)r=r.concat(n[t].controller.getAllParsedValues(e));e._cache.$bar=ze(r.sort(((e,t)=>e-t)))}return e._cache.$bar}(t,e.type);let r,o,i,a,s=t._length;const l=()=>{32767!==i&&-32768!==i&&(re(a)&&(s=Math.min(s,Math.abs(i-a)||s)),a=i)};for(r=0,o=n.length;r<o;++r)i=t.getPixelForValue(n[r]),l();for(a=void 0,r=0,o=t.ticks.length;r<o;++r)i=t.getPixelForTick(r),l();return s}function kn(e,t,n,r){return D(e)?function(e,t,n,r){const o=n.parse(e[0],r),i=n.parse(e[1],r),a=Math.min(o,i),s=Math.max(o,i);let l=a,c=s;Math.abs(a)>Math.abs(s)&&(l=s,c=a),t[n.axis]=c,t._custom={barStart:l,barEnd:c,start:o,end:i,min:a,max:s}}(e,t,n,r):t[n.axis]=n.parse(e,r),t}function wn(e,t,n,r){const o=e.iScale,i=e.vScale,a=o.getLabels(),s=o===i,l=[];let c,u,d,h;for(c=n,u=n+r;c<u;++c)h=t[c],d={},d[o.axis]=s||o.parse(a[c],c),l.push(kn(h,d,i,c));return l}function _n(e){return e&&void 0!==e.barStart&&void 0!==e.barEnd}function Sn(e,t,n,r){let o=t.borderSkipped;const i={};if(!o)return void(e.borderSkipped=i);if(!0===o)return void(e.borderSkipped={top:!0,right:!0,bottom:!0,left:!0});const{start:a,end:s,reverse:l,top:c,bottom:u}=function(e){let t,n,r,o,i;return e.horizontal?(t=e.base>e.x,n="left",r="right"):(t=e.base<e.y,n="bottom",r="top"),t?(o="end",i="start"):(o="start",i="end"),{start:n,end:r,reverse:t,top:o,bottom:i}}(e);"middle"===o&&n&&(e.enableBorderRadius=!0,(n._top||0)===r?o=c:(n._bottom||0)===r?o=u:(i[En(u,a,s,l)]=!0,o=c)),i[En(o,a,s,l)]=!0,e.borderSkipped=i}function En(e,t,n,r){var o,i,a;return r?(a=n,e=Cn(e=(o=e)===(i=t)?a:o===a?i:o,n,t)):e=Cn(e,t,n),e}function Cn(e,t,n){return"start"===e?t:"end"===e?n:e}function An(e,{inflateAmount:t},n){e.inflateAmount="auto"===t?1===n?.33:0:t}class On extends vn{static id="bar";static defaults={datasetElementType:!1,dataElementType:"bar",categoryPercentage:.8,barPercentage:.9,grouped:!0,animations:{numbers:{type:"number",properties:["x","y","base","width","height"]}}};static overrides={scales:{_index_:{type:"category",offset:!0,grid:{offset:!0}},_value_:{type:"linear",beginAtZero:!0}}};parsePrimitiveData(e,t,n,r){return wn(e,t,n,r)}parseArrayData(e,t,n,r){return wn(e,t,n,r)}parseObjectData(e,t,n,r){const{iScale:o,vScale:i}=e,{xAxisKey:a="x",yAxisKey:s="y"}=this._parsing,l="x"===o.axis?a:s,c="x"===i.axis?a:s,u=[];let d,h,p,f;for(d=n,h=n+r;d<h;++d)f=t[d],p={},p[o.axis]=o.parse(te(f,l),d),u.push(kn(te(f,c),p,i,d));return u}updateRangeFromParsed(e,t,n,r){super.updateRangeFromParsed(e,t,n,r);const o=n._custom;o&&t===this._cachedMeta.vScale&&(e.min=Math.min(e.min,o.min),e.max=Math.max(e.max,o.max))}getMaxOverflow(){return 0}getLabelAndValue(e){const t=this._cachedMeta,{iScale:n,vScale:r}=t,o=this.getParsed(e),i=o._custom,a=_n(i)?"["+i.start+", "+i.end+"]":""+r.getLabelForValue(o[r.axis]);return{label:""+n.getLabelForValue(o[n.axis]),value:a}}initialize(){this.enableOptionSharing=!0,super.initialize();this._cachedMeta.stack=this.getDataset().stack}update(e){const t=this._cachedMeta;this.updateElements(t.data,0,t.data.length,e)}updateElements(e,t,n,r){const o="reset"===r,{index:i,_cachedMeta:{vScale:a}}=this,s=a.getBasePixel(),l=a.isHorizontal(),c=this._getRuler(),{sharedOptions:u,includeOptions:d}=this._getSharedOptions(t,r);for(let h=t;h<t+n;h++){const t=this.getParsed(h),n=o||L(t[a.axis])?{base:s,head:s}:this._calculateBarValuePixels(h),p=this._calculateBarIndexPixels(h,c),f=(t._stacks||{})[a.axis],m={horizontal:l,base:n.base,enableBorderRadius:!f||_n(t._custom)||i===f._top||i===f._bottom,x:l?n.head:p.center,y:l?p.center:n.head,height:l?p.size:Math.abs(n.size),width:l?Math.abs(n.size):p.size};d&&(m.options=u||this.resolveDataElementOptions(h,e[h].active?"active":r));const g=m.options||e[h].options;Sn(m,g,f,i),An(m,g,c.ratio),this.updateElement(e[h],h,m,r)}}_getStacks(e,t){const{iScale:n}=this._cachedMeta,r=n.getMatchingVisibleMetas(this._type).filter((e=>e.controller.options.grouped)),o=n.options.stacked,i=[],a=this._cachedMeta.controller.getParsed(t),s=a&&a[n.axis],l=e=>{const t=e._parsed.find((e=>e[n.axis]===s)),r=t&&t[e.vScale.axis];if(L(r)||isNaN(r))return!0};for(const n of r)if((void 0===t||!l(n))&&((!1===o||-1===i.indexOf(n.stack)||void 0===o&&void 0===n.stack)&&i.push(n.stack),n.index===e))break;return i.length||i.push(void 0),i}_getStackCount(e){return this._getStacks(void 0,e).length}_getStackIndex(e,t,n){const r=this._getStacks(e,n),o=void 0!==t?r.indexOf(t):-1;return-1===o?r.length-1:o}_getRuler(){const e=this.options,t=this._cachedMeta,n=t.iScale,r=[];let o,i;for(o=0,i=t.data.length;o<i;++o)r.push(n.getPixelForValue(this.getParsed(o)[n.axis],o));const a=e.barThickness;return{min:a||xn(t),pixels:r,start:n._startPixel,end:n._endPixel,stackCount:this._getStackCount(),scale:n,grouped:e.grouped,ratio:a?1:e.categoryPercentage*e.barPercentage}}_calculateBarValuePixels(e){const{_cachedMeta:{vScale:t,_stacked:n,index:r},options:{base:o,minBarLength:i}}=this,a=o||0,s=this.getParsed(e),l=s._custom,c=_n(l);let u,d,h=s[t.axis],p=0,f=n?this.applyStack(t,s,n):h;f!==h&&(p=f-h,f=h),c&&(h=l.barStart,f=l.barEnd-l.barStart,0!==h&&fe(h)!==fe(l.barEnd)&&(p=0),p+=h);const m=L(o)||c?p:o;let g=t.getPixelForValue(m);if(u=this.chart.getDataVisibility(e)?t.getPixelForValue(p+f):g,d=u-g,Math.abs(d)<i){d=function(e,t,n){return 0!==e?fe(e):(t.isHorizontal()?1:-1)*(t.min>=n?1:-1)}(d,t,a)*i,h===a&&(g-=d/2);const e=t.getPixelForDecimal(0),o=t.getPixelForDecimal(1),l=Math.min(e,o),p=Math.max(e,o);g=Math.max(Math.min(g,p),l),u=g+d,n&&!c&&(s._stacks[t.axis]._visualValues[r]=t.getValueForPixel(u)-t.getValueForPixel(g))}if(g===t.getPixelForValue(a)){const e=fe(d)*t.getLineWidthForValue(a)/2;g+=e,d-=e}return{size:d,base:g,head:u,center:u+d/2}}_calculateBarIndexPixels(e,t){const n=t.scale,r=this.options,o=r.skipNull,i=H(r.maxBarThickness,1/0);let a,s;if(t.grouped){const n=o?this._getStackCount(e):t.stackCount,l="flex"===r.barThickness?function(e,t,n,r){const o=t.pixels,i=o[e];let a=e>0?o[e-1]:null,s=e<o.length-1?o[e+1]:null;const l=n.categoryPercentage;null===a&&(a=i-(null===s?t.end-t.start:s-i)),null===s&&(s=i+i-a);const c=i-(i-Math.min(a,s))/2*l;return{chunk:Math.abs(s-a)/2*l/r,ratio:n.barPercentage,start:c}}(e,t,r,n):function(e,t,n,r){const o=n.barThickness;let i,a;return L(o)?(i=t.min*n.categoryPercentage,a=n.barPercentage):(i=o*r,a=1),{chunk:i/r,ratio:a,start:t.pixels[e]-i/2}}(e,t,r,n),c=this._getStackIndex(this.index,this._cachedMeta.stack,o?e:void 0);a=l.start+l.chunk*c+l.chunk/2,s=Math.min(i,l.chunk*l.ratio)}else a=n.getPixelForValue(this.getParsed(e)[n.axis],e),s=Math.min(i,t.min*t.ratio);return{base:a-s/2,head:a+s/2,center:a,size:s}}draw(){const e=this._cachedMeta,t=e.vScale,n=e.data,r=n.length;let o=0;for(;o<r;++o)null===this.getParsed(o)[t.axis]||n[o].hidden||n[o].draw(this._ctx)}}function Mn(e,t,n,r){const{controller:o,data:i,_sorted:a}=e,s=o._cachedMeta.iScale;if(s&&t===s.axis&&"r"!==t&&a&&i.length){const e=s._reversePixels?Re:Me;if(!r)return e(i,t,n);if(o._sharedOptions){const r=i[0],o="function"==typeof r.getRange&&r.getRange(t);if(o){const r=e(i,t,n-o),a=e(i,t,n+o);return{lo:r.lo,hi:a.hi}}}}return{lo:0,hi:i.length-1}}function Rn(e,t,n,r,o){const i=e.getSortedVisibleDatasetMetas(),a=n[t];for(let e=0,n=i.length;e<n;++e){const{index:n,data:s}=i[e],{lo:l,hi:c}=Mn(i[e],t,a,o);for(let e=l;e<=c;++e){const t=s[e];t.skip||r(t,n,e)}}}function Pn(e,t,n,r,o){const i=[];if(!o&&!e.isPointInArea(t))return i;return Rn(e,n,t,(function(n,a,s){(o||lt(n,e.chartArea,0))&&n.inRange(t.x,t.y,r)&&i.push({element:n,datasetIndex:a,index:s})}),!0),i}function Tn(e,t,n,r,o,i){let a=[];const s=function(e){const t=-1!==e.indexOf("x"),n=-1!==e.indexOf("y");return function(e,r){const o=t?Math.abs(e.x-r.x):0,i=n?Math.abs(e.y-r.y):0;return Math.sqrt(Math.pow(o,2)+Math.pow(i,2))}}(n);let l=Number.POSITIVE_INFINITY;return Rn(e,n,t,(function(n,c,u){const d=n.inRange(t.x,t.y,o);if(r&&!d)return;const h=n.getCenterPoint(o);if(!(!!i||e.isPointInArea(h))&&!d)return;const p=s(t,h);p<l?(a=[{element:n,datasetIndex:c,index:u}],l=p):p===l&&a.push({element:n,datasetIndex:c,index:u})})),a}function zn(e,t,n,r,o,i){return i||e.isPointInArea(t)?"r"!==n||r?Tn(e,t,n,r,o,i):function(e,t,n,r){let o=[];return Rn(e,n,t,(function(e,n,i){const{startAngle:a,endAngle:s}=e.getProps(["startAngle","endAngle"],r),{angle:l}=we(e,{x:t.x,y:t.y});Ee(l,a,s)&&o.push({element:e,datasetIndex:n,index:i})})),o}(e,t,n,o):[]}function jn(e,t,n,r,o){const i=[],a="x"===n?"inXRange":"inYRange";let s=!1;return Rn(e,n,t,((e,r,l)=>{e[a]&&e[a](t[n],o)&&(i.push({element:e,datasetIndex:r,index:l}),s=s||e.inRange(t.x,t.y,o))})),r&&!s?[]:i}var In={evaluateInteractionItems:Rn,modes:{index(e,t,n,r){const o=Vt(t,e),i=n.axis||"x",a=n.includeInvisible||!1,s=n.intersect?Pn(e,o,i,r,a):zn(e,o,i,!1,r,a),l=[];return s.length?(e.getSortedVisibleDatasetMetas().forEach((e=>{const t=s[0].index,n=e.data[t];n&&!n.skip&&l.push({element:n,datasetIndex:e.index,index:t})})),l):[]},dataset(e,t,n,r){const o=Vt(t,e),i=n.axis||"xy",a=n.includeInvisible||!1;let s=n.intersect?Pn(e,o,i,r,a):zn(e,o,i,!1,r,a);if(s.length>0){const t=s[0].datasetIndex,n=e.getDatasetMeta(t).data;s=[];for(let e=0;e<n.length;++e)s.push({element:n[e],datasetIndex:t,index:e})}return s},point:(e,t,n,r)=>Pn(e,Vt(t,e),n.axis||"xy",r,n.includeInvisible||!1),nearest(e,t,n,r){const o=Vt(t,e),i=n.axis||"xy",a=n.includeInvisible||!1;return zn(e,o,i,n.intersect,r,a)},x:(e,t,n,r)=>jn(e,Vt(t,e),"x",n.intersect,r),y:(e,t,n,r)=>jn(e,Vt(t,e),"y",n.intersect,r)}};const Nn=["left","top","right","bottom"];function $n(e,t){return e.filter((e=>e.pos===t))}function Ln(e,t){return e.filter((e=>-1===Nn.indexOf(e.pos)&&e.box.axis===t))}function Dn(e,t){return e.sort(((e,n)=>{const r=t?n:e,o=t?e:n;return r.weight===o.weight?r.index-o.index:r.weight-o.weight}))}function Fn(e,t){const n=function(e){const t={};for(const n of e){const{stack:e,pos:r,stackWeight:o}=n;if(!e||!Nn.includes(r))continue;const i=t[e]||(t[e]={count:0,placed:0,weight:0,size:0});i.count++,i.weight+=o}return t}(e),{vBoxMaxWidth:r,hBoxMaxHeight:o}=t;let i,a,s;for(i=0,a=e.length;i<a;++i){s=e[i];const{fullSize:a}=s.box,l=n[s.stack],c=l&&s.stackWeight/l.weight;s.horizontal?(s.width=c?c*r:a&&t.availableWidth,s.height=o):(s.width=r,s.height=c?c*o:a&&t.availableHeight)}return n}function Bn(e,t,n,r){return Math.max(e[n],t[n])+Math.max(e[r],t[r])}function Wn(e,t){e.top=Math.max(e.top,t.top),e.left=Math.max(e.left,t.left),e.bottom=Math.max(e.bottom,t.bottom),e.right=Math.max(e.right,t.right)}function Hn(e,t,n,r){const{pos:o,box:i}=n,a=e.maxPadding;if(!F(o)){n.size&&(e[o]-=n.size);const t=r[n.stack]||{size:0,count:1};t.size=Math.max(t.size,n.horizontal?i.height:i.width),n.size=t.size/t.count,e[o]+=n.size}i.getPadding&&Wn(a,i.getPadding());const s=Math.max(0,t.outerWidth-Bn(a,e,"left","right")),l=Math.max(0,t.outerHeight-Bn(a,e,"top","bottom")),c=s!==e.w,u=l!==e.h;return e.w=s,e.h=l,n.horizontal?{same:c,other:u}:{same:u,other:c}}function qn(e,t){const n=t.maxPadding;function r(e){const r={left:0,top:0,right:0,bottom:0};return e.forEach((e=>{r[e]=Math.max(t[e],n[e])})),r}return r(e?["left","right"]:["top","bottom"])}function Un(e,t,n,r){const o=[];let i,a,s,l,c,u;for(i=0,a=e.length,c=0;i<a;++i){s=e[i],l=s.box,l.update(s.width||t.w,s.height||t.h,qn(s.horizontal,t));const{same:a,other:d}=Hn(t,n,s,r);c|=a&&o.length,u=u||d,l.fullSize||o.push(s)}return c&&Un(o,t,n,r)||u}function Vn(e,t,n,r,o){e.top=n,e.left=t,e.right=t+r,e.bottom=n+o,e.width=r,e.height=o}function Kn(e,t,n,r){const o=n.padding;let{x:i,y:a}=t;for(const s of e){const e=s.box,l=r[s.stack]||{count:1,placed:0,weight:1},c=s.stackWeight/l.weight||1;if(s.horizontal){const r=t.w*c,i=l.size||e.height;re(l.start)&&(a=l.start),e.fullSize?Vn(e,o.left,a,n.outerWidth-o.right-o.left,i):Vn(e,t.left+l.placed,a,r,i),l.start=a,l.placed+=r,a=e.bottom}else{const r=t.h*c,a=l.size||e.width;re(l.start)&&(i=l.start),e.fullSize?Vn(e,i,o.top,a,n.outerHeight-o.bottom-o.top):Vn(e,i,t.top+l.placed,a,r),l.start=i,l.placed+=r,i=e.right}}t.x=i,t.y=a}var Qn={addBox(e,t){e.boxes||(e.boxes=[]),t.fullSize=t.fullSize||!1,t.position=t.position||"top",t.weight=t.weight||0,t._layers=t._layers||function(){return[{z:0,draw(e){t.draw(e)}}]},e.boxes.push(t)},removeBox(e,t){const n=e.boxes?e.boxes.indexOf(t):-1;-1!==n&&e.boxes.splice(n,1)},configure(e,t,n){t.fullSize=n.fullSize,t.position=n.position,t.weight=n.weight},update(e,t,n,r){if(!e)return;const o=wt(e.options.layout.padding),i=Math.max(t-o.width,0),a=Math.max(n-o.height,0),s=function(e){const t=function(e){const t=[];let n,r,o,i,a,s;for(n=0,r=(e||[]).length;n<r;++n)o=e[n],({position:i,options:{stack:a,stackWeight:s=1}}=o),t.push({index:n,box:o,pos:i,horizontal:o.isHorizontal(),weight:o.weight,stack:a&&i+a,stackWeight:s});return t}(e),n=Dn(t.filter((e=>e.box.fullSize)),!0),r=Dn($n(t,"left"),!0),o=Dn($n(t,"right")),i=Dn($n(t,"top"),!0),a=Dn($n(t,"bottom")),s=Ln(t,"x"),l=Ln(t,"y");return{fullSize:n,leftAndTop:r.concat(i),rightAndBottom:o.concat(l).concat(a).concat(s),chartArea:$n(t,"chartArea"),vertical:r.concat(o).concat(l),horizontal:i.concat(a).concat(s)}}(e.boxes),l=s.vertical,c=s.horizontal;V(e.boxes,(e=>{"function"==typeof e.beforeLayout&&e.beforeLayout()}));const u=l.reduce(((e,t)=>t.box.options&&!1===t.box.options.display?e:e+1),0)||1,d=Object.freeze({outerWidth:t,outerHeight:n,padding:o,availableWidth:i,availableHeight:a,vBoxMaxWidth:i/2/u,hBoxMaxHeight:a/2}),h=Object.assign({},o);Wn(h,wt(r));const p=Object.assign({maxPadding:h,w:i,h:a,x:o.left,y:o.top},o),f=Fn(l.concat(c),d);Un(s.fullSize,p,d,f),Un(l,p,d,f),Un(c,p,d,f)&&Un(l,p,d,f),function(e){const t=e.maxPadding;function n(n){const r=Math.max(t[n]-e[n],0);return e[n]+=r,r}e.y+=n("top"),e.x+=n("left"),n("right"),n("bottom")}(p),Kn(s.leftAndTop,p,d,f),p.x+=p.w,p.y+=p.h,Kn(s.rightAndBottom,p,d,f),e.chartArea={left:p.left,top:p.top,right:p.left+p.w,bottom:p.top+p.h,height:p.h,width:p.w},V(s.chartArea,(t=>{const n=t.box;Object.assign(n,e.chartArea),n.update(p.w,p.h,{left:0,top:0,right:0,bottom:0})}))}};class Yn{acquireContext(e,t){}releaseContext(e){return!1}addEventListener(e,t,n){}removeEventListener(e,t,n){}getDevicePixelRatio(){return 1}getMaximumSize(e,t,n,r){return t=Math.max(0,t||e.width),n=n||e.height,{width:t,height:Math.max(0,r?Math.floor(t/r):n)}}isAttached(e){return!0}updateConfig(e){}}class Gn extends Yn{acquireContext(e){return e&&e.getContext&&e.getContext("2d")||null}updateConfig(e){e.options.animation=!1}}const Xn="$chartjs",Zn={touchstart:"mousedown",touchmove:"mousemove",touchend:"mouseup",pointerenter:"mouseenter",pointerdown:"mousedown",pointermove:"mousemove",pointerup:"mouseup",pointerleave:"mouseout",pointerout:"mouseout"},Jn=e=>null===e||""===e;const er=!!Gt&&{passive:!0};function tr(e,t,n){e&&e.canvas&&e.canvas.removeEventListener(t,n,er)}function nr(e,t){for(const n of e)if(n===t||n.contains(t))return!0}function rr(e,t,n){const r=e.canvas,o=new MutationObserver((e=>{let t=!1;for(const n of e)t=t||nr(n.addedNodes,r),t=t&&!nr(n.removedNodes,r);t&&n()}));return o.observe(document,{childList:!0,subtree:!0}),o}function or(e,t,n){const r=e.canvas,o=new MutationObserver((e=>{let t=!1;for(const n of e)t=t||nr(n.removedNodes,r),t=t&&!nr(n.addedNodes,r);t&&n()}));return o.observe(document,{childList:!0,subtree:!0}),o}const ir=new Map;let ar=0;function sr(){const e=window.devicePixelRatio;e!==ar&&(ar=e,ir.forEach(((t,n)=>{n.currentDevicePixelRatio!==e&&t()})))}function lr(e,t,n){const r=e.canvas,o=r&&Ft(r);if(!o)return;const i=Ie(((e,t)=>{const r=o.clientWidth;n(e,t),r<o.clientWidth&&n()}),window),a=new ResizeObserver((e=>{const t=e[0],n=t.contentRect.width,r=t.contentRect.height;0===n&&0===r||i(n,r)}));return a.observe(o),function(e,t){ir.size||window.addEventListener("resize",sr),ir.set(e,t)}(e,i),a}function cr(e,t,n){n&&n.disconnect(),"resize"===t&&function(e){ir.delete(e),ir.size||window.removeEventListener("resize",sr)}(e)}function ur(e,t,n){const r=e.canvas,o=Ie((t=>{null!==e.ctx&&n(function(e,t){const n=Zn[e.type]||e.type,{x:r,y:o}=Vt(e,t);return{type:n,chart:t,native:e,x:void 0!==r?r:null,y:void 0!==o?o:null}}(t,e))}),e);return function(e,t,n){e&&e.addEventListener(t,n,er)}(r,t,o),o}class dr extends Yn{acquireContext(e,t){const n=e&&e.getContext&&e.getContext("2d");return n&&n.canvas===e?(function(e,t){const n=e.style,r=e.getAttribute("height"),o=e.getAttribute("width");if(e[Xn]={initial:{height:r,width:o,style:{display:n.display,height:n.height,width:n.width}}},n.display=n.display||"block",n.boxSizing=n.boxSizing||"border-box",Jn(o)){const t=Xt(e,"width");void 0!==t&&(e.width=t)}if(Jn(r))if(""===e.style.height)e.height=e.width/(t||2);else{const t=Xt(e,"height");void 0!==t&&(e.height=t)}}(e,t),n):null}releaseContext(e){const t=e.canvas;if(!t[Xn])return!1;const n=t[Xn].initial;["height","width"].forEach((e=>{const r=n[e];L(r)?t.removeAttribute(e):t.setAttribute(e,r)}));const r=n.style||{};return Object.keys(r).forEach((e=>{t.style[e]=r[e]})),t.width=t.width,delete t[Xn],!0}addEventListener(e,t,n){this.removeEventListener(e,t);const r=e.$proxies||(e.$proxies={}),o={attach:rr,detach:or,resize:lr}[t]||ur;r[t]=o(e,t,n)}removeEventListener(e,t){const n=e.$proxies||(e.$proxies={}),r=n[t];if(!r)return;({attach:cr,detach:cr,resize:cr}[t]||tr)(e,t,r),n[t]=void 0}getDevicePixelRatio(){return window.devicePixelRatio}getMaximumSize(e,t,n,r){return Qt(e,t,n,r)}isAttached(e){const t=e&&Ft(e);return!(!t||!t.isConnected)}}class hr{static defaults={};static defaultRoutes=void 0;x;y;active=!1;options;$animations;tooltipPosition(e){const{x:t,y:n}=this.getProps(["x","y"],e);return{x:t,y:n}}hasValue(){return ye(this.x)&&ye(this.y)}getProps(e,t){const n=this.$animations;if(!t||!n)return this;const r={};return e.forEach((e=>{r[e]=n[e]&&n[e].active()?n[e]._to:this[e]})),r}}function pr(e,t){const n=e.options.ticks,r=function(e){const t=e.options.offset,n=e._tickSize(),r=e._length/n+(t?0:1),o=e._maxLength/n;return Math.floor(Math.min(r,o))}(e),o=Math.min(n.maxTicksLimit||r,r),i=n.major.enabled?function(e){const t=[];let n,r;for(n=0,r=e.length;n<r;n++)e[n].major&&t.push(n);return t}(t):[],a=i.length,s=i[0],l=i[a-1],c=[];if(a>o)return function(e,t,n,r){let o,i=0,a=n[0];for(r=Math.ceil(r),o=0;o<e.length;o++)o===a&&(t.push(e[o]),i++,a=n[i*r])}(t,c,i,a/o),c;const u=function(e,t,n){const r=function(e){const t=e.length;let n,r;if(t<2)return!1;for(r=e[0],n=1;n<t;++n)if(e[n]-e[n-1]!==r)return!1;return r}(e),o=t.length/n;if(!r)return Math.max(o,1);const i=function(e){const t=[],n=Math.sqrt(e);let r;for(r=1;r<n;r++)e%r==0&&(t.push(r),t.push(e/r));return n===(0|n)&&t.push(n),t.sort(((e,t)=>e-t)).pop(),t}(r);for(let e=0,t=i.length-1;e<t;e++){const t=i[e];if(t>o)return t}return Math.max(o,1)}(i,t,o);if(a>0){let e,n;const r=a>1?Math.round((l-s)/(a-1)):null;for(fr(t,c,u,L(r)?0:s-r,s),e=0,n=a-1;e<n;e++)fr(t,c,u,i[e],i[e+1]);return fr(t,c,u,l,L(r)?t.length:l+r),c}return fr(t,c,u),c}function fr(e,t,n,r,o){const i=H(r,0),a=Math.min(H(o,e.length),e.length);let s,l,c,u=0;for(n=Math.ceil(n),o&&(s=o-r,n=s/Math.floor(s/n)),c=i;c<0;)u++,c=Math.round(i+u*n);for(l=Math.max(i,0);l<a;l++)l===c&&(t.push(e[l]),u++,c=Math.round(i+u*n))}const mr=(e,t,n)=>"top"===t||"left"===t?e[t]+n:e[t]-n,gr=(e,t)=>Math.min(t||e,e);function yr(e,t){const n=[],r=e.length/t,o=e.length;let i=0;for(;i<o;i+=r)n.push(e[Math.floor(i)]);return n}function br(e,t,n){const r=e.ticks.length,o=Math.min(t,r-1),i=e._startPixel,a=e._endPixel,s=1e-6;let l,c=e.getPixelForTick(o);if(!(n&&(l=1===r?Math.max(c-i,a-c):0===t?(e.getPixelForTick(1)-c)/2:(c-e.getPixelForTick(o-1))/2,c+=o<t?l:-l,c<i-s||c>a+s)))return c}function vr(e){return e.drawTicks?e.tickLength:0}function xr(e,t){if(!e.display)return 0;const n=_t(e.font,t),r=wt(e.padding);return(D(e.text)?e.text.length:1)*n.lineHeight+r.height}function kr(e,t,n){let r=Ne(e);return(n&&"right"!==t||!n&&"right"===t)&&(r=(e=>"left"===e?"right":"right"===e?"left":e)(r)),r}class wr extends hr{constructor(e){super(),this.id=e.id,this.type=e.type,this.options=void 0,this.ctx=e.ctx,this.chart=e.chart,this.top=void 0,this.bottom=void 0,this.left=void 0,this.right=void 0,this.width=void 0,this.height=void 0,this._margins={left:0,right:0,top:0,bottom:0},this.maxWidth=void 0,this.maxHeight=void 0,this.paddingTop=void 0,this.paddingBottom=void 0,this.paddingLeft=void 0,this.paddingRight=void 0,this.axis=void 0,this.labelRotation=void 0,this.min=void 0,this.max=void 0,this._range=void 0,this.ticks=[],this._gridLineItems=null,this._labelItems=null,this._labelSizes=null,this._length=0,this._maxLength=0,this._longestTextCache={},this._startPixel=void 0,this._endPixel=void 0,this._reversePixels=!1,this._userMax=void 0,this._userMin=void 0,this._suggestedMax=void 0,this._suggestedMin=void 0,this._ticksLength=0,this._borderValue=0,this._cache={},this._dataLimitsCached=!1,this.$context=void 0}init(e){this.options=e.setContext(this.getContext()),this.axis=e.axis,this._userMin=this.parse(e.min),this._userMax=this.parse(e.max),this._suggestedMin=this.parse(e.suggestedMin),this._suggestedMax=this.parse(e.suggestedMax)}parse(e,t){return e}getUserBounds(){let{_userMin:e,_userMax:t,_suggestedMin:n,_suggestedMax:r}=this;return e=W(e,Number.POSITIVE_INFINITY),t=W(t,Number.NEGATIVE_INFINITY),n=W(n,Number.POSITIVE_INFINITY),r=W(r,Number.NEGATIVE_INFINITY),{min:W(e,n),max:W(t,r),minDefined:B(e),maxDefined:B(t)}}getMinMax(e){let t,{min:n,max:r,minDefined:o,maxDefined:i}=this.getUserBounds();if(o&&i)return{min:n,max:r};const a=this.getMatchingVisibleMetas();for(let s=0,l=a.length;s<l;++s)t=a[s].controller.getMinMax(this,e),o||(n=Math.min(n,t.min)),i||(r=Math.max(r,t.max));return n=i&&n>r?r:n,r=o&&n>r?n:r,{min:W(n,W(r,n)),max:W(r,W(n,r))}}getPadding(){return{left:this.paddingLeft||0,top:this.paddingTop||0,right:this.paddingRight||0,bottom:this.paddingBottom||0}}getTicks(){return this.ticks}getLabels(){const e=this.chart.data;return this.options.labels||(this.isHorizontal()?e.xLabels:e.yLabels)||e.labels||[]}getLabelItems(e=this.chart.chartArea){return this._labelItems||(this._labelItems=this._computeLabelItems(e))}beforeLayout(){this._cache={},this._dataLimitsCached=!1}beforeUpdate(){U(this.options.beforeUpdate,[this])}update(e,t,n){const{beginAtZero:r,grace:o,ticks:i}=this.options,a=i.sampleSize;this.beforeUpdate(),this.maxWidth=e,this.maxHeight=t,this._margins=n=Object.assign({left:0,right:0,top:0,bottom:0},n),this.ticks=null,this._labelSizes=null,this._gridLineItems=null,this._labelItems=null,this.beforeSetDimensions(),this.setDimensions(),this.afterSetDimensions(),this._maxLength=this.isHorizontal()?this.width+n.left+n.right:this.height+n.top+n.bottom,this._dataLimitsCached||(this.beforeDataLimits(),this.determineDataLimits(),this.afterDataLimits(),this._range=function(e,t,n){const{min:r,max:o}=e,i=q(t,(o-r)/2),a=(e,t)=>n&&0===e?0:e+t;return{min:a(r,-Math.abs(i)),max:a(o,i)}}(this,o,r),this._dataLimitsCached=!0),this.beforeBuildTicks(),this.ticks=this.buildTicks()||[],this.afterBuildTicks();const s=a<this.ticks.length;this._convertTicksToLabels(s?yr(this.ticks,a):this.ticks),this.configure(),this.beforeCalculateLabelRotation(),this.calculateLabelRotation(),this.afterCalculateLabelRotation(),i.display&&(i.autoSkip||"auto"===i.source)&&(this.ticks=pr(this,this.ticks),this._labelSizes=null,this.afterAutoSkip()),s&&this._convertTicksToLabels(this.ticks),this.beforeFit(),this.fit(),this.afterFit(),this.afterUpdate()}configure(){let e,t,n=this.options.reverse;this.isHorizontal()?(e=this.left,t=this.right):(e=this.top,t=this.bottom,n=!n),this._startPixel=e,this._endPixel=t,this._reversePixels=n,this._length=t-e,this._alignToPixels=this.options.alignToPixels}afterUpdate(){U(this.options.afterUpdate,[this])}beforeSetDimensions(){U(this.options.beforeSetDimensions,[this])}setDimensions(){this.isHorizontal()?(this.width=this.maxWidth,this.left=0,this.right=this.width):(this.height=this.maxHeight,this.top=0,this.bottom=this.height),this.paddingLeft=0,this.paddingTop=0,this.paddingRight=0,this.paddingBottom=0}afterSetDimensions(){U(this.options.afterSetDimensions,[this])}_callHooks(e){this.chart.notifyPlugins(e,this.getContext()),U(this.options[e],[this])}beforeDataLimits(){this._callHooks("beforeDataLimits")}determineDataLimits(){}afterDataLimits(){this._callHooks("afterDataLimits")}beforeBuildTicks(){this._callHooks("beforeBuildTicks")}buildTicks(){return[]}afterBuildTicks(){this._callHooks("afterBuildTicks")}beforeTickToLabelConversion(){U(this.options.beforeTickToLabelConversion,[this])}generateTickLabels(e){const t=this.options.ticks;let n,r,o;for(n=0,r=e.length;n<r;n++)o=e[n],o.label=U(t.callback,[o.value,n,e],this)}afterTickToLabelConversion(){U(this.options.afterTickToLabelConversion,[this])}beforeCalculateLabelRotation(){U(this.options.beforeCalculateLabelRotation,[this])}calculateLabelRotation(){const e=this.options,t=e.ticks,n=gr(this.ticks.length,e.ticks.maxTicksLimit),r=t.minRotation||0,o=t.maxRotation;let i,a,s,l=r;if(!this._isVisible()||!t.display||r>=o||n<=1||!this.isHorizontal())return void(this.labelRotation=r);const c=this._getLabelSizes(),u=c.widest.width,d=c.highest.height,h=Ce(this.chart.width-u,0,this.maxWidth);i=e.offset?this.maxWidth/n:h/(n-1),u+6>i&&(i=h/(n-(e.offset?.5:1)),a=this.maxHeight-vr(e.grid)-t.padding-xr(e.title,this.chart.options.font),s=Math.sqrt(u*u+d*d),l=xe(Math.min(Math.asin(Ce((c.highest.height+6)/i,-1,1)),Math.asin(Ce(a/s,-1,1))-Math.asin(Ce(d/s,-1,1)))),l=Math.max(r,Math.min(o,l))),this.labelRotation=l}afterCalculateLabelRotation(){U(this.options.afterCalculateLabelRotation,[this])}afterAutoSkip(){}beforeFit(){U(this.options.beforeFit,[this])}fit(){const e={width:0,height:0},{chart:t,options:{ticks:n,title:r,grid:o}}=this,i=this._isVisible(),a=this.isHorizontal();if(i){const i=xr(r,t.options.font);if(a?(e.width=this.maxWidth,e.height=vr(o)+i):(e.height=this.maxHeight,e.width=vr(o)+i),n.display&&this.ticks.length){const{first:t,last:r,widest:o,highest:i}=this._getLabelSizes(),s=2*n.padding,l=ve(this.labelRotation),c=Math.cos(l),u=Math.sin(l);if(a){const t=n.mirror?0:u*o.width+c*i.height;e.height=Math.min(this.maxHeight,e.height+t+s)}else{const t=n.mirror?0:c*o.width+u*i.height;e.width=Math.min(this.maxWidth,e.width+t+s)}this._calculatePadding(t,r,u,c)}}this._handleMargins(),a?(this.width=this._length=t.width-this._margins.left-this._margins.right,this.height=e.height):(this.width=e.width,this.height=this._length=t.height-this._margins.top-this._margins.bottom)}_calculatePadding(e,t,n,r){const{ticks:{align:o,padding:i},position:a}=this.options,s=0!==this.labelRotation,l="top"!==a&&"x"===this.axis;if(this.isHorizontal()){const a=this.getPixelForTick(0)-this.left,c=this.right-this.getPixelForTick(this.ticks.length-1);let u=0,d=0;s?l?(u=r*e.width,d=n*t.height):(u=n*e.height,d=r*t.width):"start"===o?d=t.width:"end"===o?u=e.width:"inner"!==o&&(u=e.width/2,d=t.width/2),this.paddingLeft=Math.max((u-a+i)*this.width/(this.width-a),0),this.paddingRight=Math.max((d-c+i)*this.width/(this.width-c),0)}else{let n=t.height/2,r=e.height/2;"start"===o?(n=0,r=e.height):"end"===o&&(n=t.height,r=0),this.paddingTop=n+i,this.paddingBottom=r+i}}_handleMargins(){this._margins&&(this._margins.left=Math.max(this.paddingLeft,this._margins.left),this._margins.top=Math.max(this.paddingTop,this._margins.top),this._margins.right=Math.max(this.paddingRight,this._margins.right),this._margins.bottom=Math.max(this.paddingBottom,this._margins.bottom))}afterFit(){U(this.options.afterFit,[this])}isHorizontal(){const{axis:e,position:t}=this.options;return"top"===t||"bottom"===t||"x"===e}isFullSize(){return this.options.fullSize}_convertTicksToLabels(e){let t,n;for(this.beforeTickToLabelConversion(),this.generateTickLabels(e),t=0,n=e.length;t<n;t++)L(e[t].label)&&(e.splice(t,1),n--,t--);this.afterTickToLabelConversion()}_getLabelSizes(){let e=this._labelSizes;if(!e){const t=this.options.ticks.sampleSize;let n=this.ticks;t<n.length&&(n=yr(n,t)),this._labelSizes=e=this._computeLabelSizes(n,n.length,this.options.ticks.maxTicksLimit)}return e}_computeLabelSizes(e,t,n){const{ctx:r,_longestTextCache:o}=this,i=[],a=[],s=Math.floor(t/gr(t,n));let l,c,u,d,h,p,f,m,g,y,b,v=0,x=0;for(l=0;l<t;l+=s){if(d=e[l].label,h=this._resolveTickFontOptions(l),r.font=p=h.string,f=o[p]=o[p]||{data:{},gc:[]},m=h.lineHeight,g=y=0,L(d)||D(d)){if(D(d))for(c=0,u=d.length;c<u;++c)b=d[c],L(b)||D(b)||(g=rt(r,f.data,f.gc,g,b),y+=m)}else g=rt(r,f.data,f.gc,g,d),y=m;i.push(g),a.push(y),v=Math.max(g,v),x=Math.max(y,x)}!function(e,t){V(e,(e=>{const n=e.gc,r=n.length/2;let o;if(r>t){for(o=0;o<r;++o)delete e.data[n[o]];n.splice(0,r)}}))}(o,t);const k=i.indexOf(v),w=a.indexOf(x),_=e=>({width:i[e]||0,height:a[e]||0});return{first:_(0),last:_(t-1),widest:_(k),highest:_(w),widths:i,heights:a}}getLabelForValue(e){return e}getPixelForValue(e,t){return NaN}getValueForPixel(e){}getPixelForTick(e){const t=this.ticks;return e<0||e>t.length-1?null:this.getPixelForValue(t[e].value)}getPixelForDecimal(e){this._reversePixels&&(e=1-e);const t=this._startPixel+e*this._length;return Ce(this._alignToPixels?ot(this.chart,t,0):t,-32768,32767)}getDecimalForPixel(e){const t=(e-this._startPixel)/this._length;return this._reversePixels?1-t:t}getBasePixel(){return this.getPixelForValue(this.getBaseValue())}getBaseValue(){const{min:e,max:t}=this;return e<0&&t<0?t:e>0&&t>0?e:0}getContext(e){const t=this.ticks||[];if(e>=0&&e<t.length){const n=t[e];return n.$context||(n.$context=function(e,t,n){return Et(e,{tick:n,index:t,type:"tick"})}(this.getContext(),e,n))}return this.$context||(this.$context=Et(this.chart.getContext(),{scale:this,type:"scale"}))}_tickSize(){const e=this.options.ticks,t=ve(this.labelRotation),n=Math.abs(Math.cos(t)),r=Math.abs(Math.sin(t)),o=this._getLabelSizes(),i=e.autoSkipPadding||0,a=o?o.widest.width+i:0,s=o?o.highest.height+i:0;return this.isHorizontal()?s*n>a*r?a/n:s/r:s*r<a*n?s/n:a/r}_isVisible(){const e=this.options.display;return"auto"!==e?!!e:this.getMatchingVisibleMetas().length>0}_computeGridLineItems(e){const t=this.axis,n=this.chart,r=this.options,{grid:o,position:i,border:a}=r,s=o.offset,l=this.isHorizontal(),c=this.ticks.length+(s?1:0),u=vr(o),d=[],h=a.setContext(this.getContext()),p=h.display?h.width:0,f=p/2,m=function(e){return ot(n,e,p)};let g,y,b,v,x,k,w,_,S,E,C,A;if("top"===i)g=m(this.bottom),k=this.bottom-u,_=g-f,E=m(e.top)+f,A=e.bottom;else if("bottom"===i)g=m(this.top),E=e.top,A=m(e.bottom)-f,k=g+f,_=this.top+u;else if("left"===i)g=m(this.right),x=this.right-u,w=g-f,S=m(e.left)+f,C=e.right;else if("right"===i)g=m(this.left),S=e.left,C=m(e.right)-f,x=g+f,w=this.left+u;else if("x"===t){if("center"===i)g=m((e.top+e.bottom)/2+.5);else if(F(i)){const e=Object.keys(i)[0],t=i[e];g=m(this.chart.scales[e].getPixelForValue(t))}E=e.top,A=e.bottom,k=g+f,_=k+u}else if("y"===t){if("center"===i)g=m((e.left+e.right)/2);else if(F(i)){const e=Object.keys(i)[0],t=i[e];g=m(this.chart.scales[e].getPixelForValue(t))}x=g-f,w=x-u,S=e.left,C=e.right}const O=H(r.ticks.maxTicksLimit,c),M=Math.max(1,Math.ceil(c/O));for(y=0;y<c;y+=M){const e=this.getContext(y),t=o.setContext(e),r=a.setContext(e),i=t.lineWidth,c=t.color,u=r.dash||[],h=r.dashOffset,p=t.tickWidth,f=t.tickColor,m=t.tickBorderDash||[],g=t.tickBorderDashOffset;b=br(this,y,s),void 0!==b&&(v=ot(n,b,i),l?x=w=S=C=v:k=_=E=A=v,d.push({tx1:x,ty1:k,tx2:w,ty2:_,x1:S,y1:E,x2:C,y2:A,width:i,color:c,borderDash:u,borderDashOffset:h,tickWidth:p,tickColor:f,tickBorderDash:m,tickBorderDashOffset:g}))}return this._ticksLength=c,this._borderValue=g,d}_computeLabelItems(e){const t=this.axis,n=this.options,{position:r,ticks:o}=n,i=this.isHorizontal(),a=this.ticks,{align:s,crossAlign:l,padding:c,mirror:u}=o,d=vr(n.grid),h=d+c,p=u?-c:h,f=-ve(this.labelRotation),m=[];let g,y,b,v,x,k,w,_,S,E,C,A,O="middle";if("top"===r)k=this.bottom-p,w=this._getXAxisLabelAlignment();else if("bottom"===r)k=this.top+p,w=this._getXAxisLabelAlignment();else if("left"===r){const e=this._getYAxisLabelAlignment(d);w=e.textAlign,x=e.x}else if("right"===r){const e=this._getYAxisLabelAlignment(d);w=e.textAlign,x=e.x}else if("x"===t){if("center"===r)k=(e.top+e.bottom)/2+h;else if(F(r)){const e=Object.keys(r)[0],t=r[e];k=this.chart.scales[e].getPixelForValue(t)+h}w=this._getXAxisLabelAlignment()}else if("y"===t){if("center"===r)x=(e.left+e.right)/2-h;else if(F(r)){const e=Object.keys(r)[0],t=r[e];x=this.chart.scales[e].getPixelForValue(t)}w=this._getYAxisLabelAlignment(d).textAlign}"y"===t&&("start"===s?O="top":"end"===s&&(O="bottom"));const M=this._getLabelSizes();for(g=0,y=a.length;g<y;++g){b=a[g],v=b.label;const e=o.setContext(this.getContext(g));_=this.getPixelForTick(g)+o.labelOffset,S=this._resolveTickFontOptions(g),E=S.lineHeight,C=D(v)?v.length:1;const t=C/2,n=e.color,s=e.textStrokeColor,c=e.textStrokeWidth;let d,h=w;if(i?(x=_,"inner"===w&&(h=g===y-1?this.options.reverse?"left":"right":0===g?this.options.reverse?"right":"left":"center"),A="top"===r?"near"===l||0!==f?-C*E+E/2:"center"===l?-M.highest.height/2-t*E+E:-M.highest.height+E/2:"near"===l||0!==f?E/2:"center"===l?M.highest.height/2-t*E:M.highest.height-C*E,u&&(A*=-1),0===f||e.showLabelBackdrop||(x+=E/2*Math.sin(f))):(k=_,A=(1-C)*E/2),e.showLabelBackdrop){const t=wt(e.backdropPadding),n=M.heights[g],r=M.widths[g];let o=A-t.top,i=0-t.left;switch(O){case"middle":o-=n/2;break;case"bottom":o-=n}switch(w){case"center":i-=r/2;break;case"right":i-=r;break;case"inner":g===y-1?i-=r:g>0&&(i-=r/2)}d={left:i,top:o,width:r+t.width,height:n+t.height,color:e.backdropColor}}m.push({label:v,font:S,textOffset:A,options:{rotation:f,color:n,strokeColor:s,strokeWidth:c,textAlign:h,textBaseline:O,translation:[x,k],backdrop:d}})}return m}_getXAxisLabelAlignment(){const{position:e,ticks:t}=this.options;if(-ve(this.labelRotation))return"top"===e?"left":"right";let n="center";return"start"===t.align?n="left":"end"===t.align?n="right":"inner"===t.align&&(n="inner"),n}_getYAxisLabelAlignment(e){const{position:t,ticks:{crossAlign:n,mirror:r,padding:o}}=this.options,i=e+o,a=this._getLabelSizes().widest.width;let s,l;return"left"===t?r?(l=this.right+o,"near"===n?s="left":"center"===n?(s="center",l+=a/2):(s="right",l+=a)):(l=this.right-i,"near"===n?s="right":"center"===n?(s="center",l-=a/2):(s="left",l=this.left)):"right"===t?r?(l=this.left+o,"near"===n?s="right":"center"===n?(s="center",l-=a/2):(s="left",l-=a)):(l=this.left+i,"near"===n?s="left":"center"===n?(s="center",l+=a/2):(s="right",l=this.right)):s="right",{textAlign:s,x:l}}_computeLabelArea(){if(this.options.ticks.mirror)return;const e=this.chart,t=this.options.position;return"left"===t||"right"===t?{top:0,left:this.left,bottom:e.height,right:this.right}:"top"===t||"bottom"===t?{top:this.top,left:0,bottom:this.bottom,right:e.width}:void 0}drawBackground(){const{ctx:e,options:{backgroundColor:t},left:n,top:r,width:o,height:i}=this;t&&(e.save(),e.fillStyle=t,e.fillRect(n,r,o,i),e.restore())}getLineWidthForValue(e){const t=this.options.grid;if(!this._isVisible()||!t.display)return 0;const n=this.ticks.findIndex((t=>t.value===e));if(n>=0){return t.setContext(this.getContext(n)).lineWidth}return 0}drawGrid(e){const t=this.options.grid,n=this.ctx,r=this._gridLineItems||(this._gridLineItems=this._computeGridLineItems(e));let o,i;const a=(e,t,r)=>{r.width&&r.color&&(n.save(),n.lineWidth=r.width,n.strokeStyle=r.color,n.setLineDash(r.borderDash||[]),n.lineDashOffset=r.borderDashOffset,n.beginPath(),n.moveTo(e.x,e.y),n.lineTo(t.x,t.y),n.stroke(),n.restore())};if(t.display)for(o=0,i=r.length;o<i;++o){const e=r[o];t.drawOnChartArea&&a({x:e.x1,y:e.y1},{x:e.x2,y:e.y2},e),t.drawTicks&&a({x:e.tx1,y:e.ty1},{x:e.tx2,y:e.ty2},{color:e.tickColor,width:e.tickWidth,borderDash:e.tickBorderDash,borderDashOffset:e.tickBorderDashOffset})}}drawBorder(){const{chart:e,ctx:t,options:{border:n,grid:r}}=this,o=n.setContext(this.getContext()),i=n.display?o.width:0;if(!i)return;const a=r.setContext(this.getContext(0)).lineWidth,s=this._borderValue;let l,c,u,d;this.isHorizontal()?(l=ot(e,this.left,i)-i/2,c=ot(e,this.right,a)+a/2,u=d=s):(u=ot(e,this.top,i)-i/2,d=ot(e,this.bottom,a)+a/2,l=c=s),t.save(),t.lineWidth=o.width,t.strokeStyle=o.color,t.beginPath(),t.moveTo(l,u),t.lineTo(c,d),t.stroke(),t.restore()}drawLabels(e){if(!this.options.ticks.display)return;const t=this.ctx,n=this._computeLabelArea();n&&ct(t,n);const r=this.getLabelItems(e);for(const e of r){const n=e.options,r=e.font;pt(t,e.label,0,e.textOffset,r,n)}n&&ut(t)}drawTitle(){const{ctx:e,options:{position:t,title:n,reverse:r}}=this;if(!n.display)return;const o=_t(n.font),i=wt(n.padding),a=n.align;let s=o.lineHeight/2;"bottom"===t||"center"===t||F(t)?(s+=i.bottom,D(n.text)&&(s+=o.lineHeight*(n.text.length-1))):s+=i.top;const{titleX:l,titleY:c,maxWidth:u,rotation:d}=function(e,t,n,r){const{top:o,left:i,bottom:a,right:s,chart:l}=e,{chartArea:c,scales:u}=l;let d,h,p,f=0;const m=a-o,g=s-i;if(e.isHorizontal()){if(h=$e(r,i,s),F(n)){const e=Object.keys(n)[0],r=n[e];p=u[e].getPixelForValue(r)+m-t}else p="center"===n?(c.bottom+c.top)/2+m-t:mr(e,n,t);d=s-i}else{if(F(n)){const e=Object.keys(n)[0],r=n[e];h=u[e].getPixelForValue(r)-g+t}else h="center"===n?(c.left+c.right)/2-g+t:mr(e,n,t);p=$e(r,a,o),f="left"===n?-ue:ue}return{titleX:h,titleY:p,maxWidth:d,rotation:f}}(this,s,t,a);pt(e,n.text,0,0,o,{color:n.color,maxWidth:u,rotation:d,textAlign:kr(a,t,r),textBaseline:"middle",translation:[l,c]})}draw(e){this._isVisible()&&(this.drawBackground(),this.drawGrid(e),this.drawBorder(),this.drawTitle(),this.drawLabels(e))}_layers(){const e=this.options,t=e.ticks&&e.ticks.z||0,n=H(e.grid&&e.grid.z,-1),r=H(e.border&&e.border.z,0);return this._isVisible()&&this.draw===wr.prototype.draw?[{z:n,draw:e=>{this.drawBackground(),this.drawGrid(e),this.drawTitle()}},{z:r,draw:()=>{this.drawBorder()}},{z:t,draw:e=>{this.drawLabels(e)}}]:[{z:t,draw:e=>{this.draw(e)}}]}getMatchingVisibleMetas(e){const t=this.chart.getSortedVisibleDatasetMetas(),n=this.axis+"AxisID",r=[];let o,i;for(o=0,i=t.length;o<i;++o){const i=t[o];i[n]!==this.id||e&&i.type!==e||r.push(i)}return r}_resolveTickFontOptions(e){return _t(this.options.ticks.setContext(this.getContext(e)).font)}_maxDigits(){const e=this._resolveTickFontOptions(0).lineHeight;return(this.isHorizontal()?this.width:this.height)/e}}class _r{constructor(e,t,n){this.type=e,this.scope=t,this.override=n,this.items=Object.create(null)}isForType(e){return Object.prototype.isPrototypeOf.call(this.type.prototype,e.prototype)}register(e){const t=Object.getPrototypeOf(e);let n;(function(e){return"id"in e&&"defaults"in e})(t)&&(n=this.register(t));const r=this.items,o=e.id,i=this.scope+"."+o;if(!o)throw new Error("class does not have id: "+e);return o in r||(r[o]=e,function(e,t,n){const r=X(Object.create(null),[n?nt.get(n):{},nt.get(t),e.defaults]);nt.set(t,r),e.defaultRoutes&&function(e,t){Object.keys(t).forEach((n=>{const r=n.split("."),o=r.pop(),i=[e].concat(r).join("."),a=t[n].split("."),s=a.pop(),l=a.join(".");nt.route(i,o,l,s)}))}(t,e.defaultRoutes);e.descriptors&&nt.describe(t,e.descriptors)}(e,i,n),this.override&&nt.override(e.id,e.overrides)),i}get(e){return this.items[e]}unregister(e){const t=this.items,n=e.id,r=this.scope;n in t&&delete t[n],r&&n in nt[r]&&(delete nt[r][n],this.override&&delete Xe[n])}}class Sr{constructor(){this.controllers=new _r(vn,"datasets",!0),this.elements=new _r(hr,"elements"),this.plugins=new _r(Object,"plugins"),this.scales=new _r(wr,"scales"),this._typedRegistries=[this.controllers,this.scales,this.elements]}add(...e){this._each("register",e)}remove(...e){this._each("unregister",e)}addControllers(...e){this._each("register",e,this.controllers)}addElements(...e){this._each("register",e,this.elements)}addPlugins(...e){this._each("register",e,this.plugins)}addScales(...e){this._each("register",e,this.scales)}getController(e){return this._get(e,this.controllers,"controller")}getElement(e){return this._get(e,this.elements,"element")}getPlugin(e){return this._get(e,this.plugins,"plugin")}getScale(e){return this._get(e,this.scales,"scale")}removeControllers(...e){this._each("unregister",e,this.controllers)}removeElements(...e){this._each("unregister",e,this.elements)}removePlugins(...e){this._each("unregister",e,this.plugins)}removeScales(...e){this._each("unregister",e,this.scales)}_each(e,t,n){[...t].forEach((t=>{const r=n||this._getRegistryForType(t);n||r.isForType(t)||r===this.plugins&&t.id?this._exec(e,r,t):V(t,(t=>{const r=n||this._getRegistryForType(t);this._exec(e,r,t)}))}))}_exec(e,t,n){const r=ne(e);U(n["before"+r],[],n),t[e](n),U(n["after"+r],[],n)}_getRegistryForType(e){for(let t=0;t<this._typedRegistries.length;t++){const n=this._typedRegistries[t];if(n.isForType(e))return n}return this.plugins}_get(e,t,n){const r=t.get(e);if(void 0===r)throw new Error('"'+e+'" is not a registered '+n+".");return r}}var Er=new Sr;class Cr{constructor(){this._init=[]}notify(e,t,n,r){"beforeInit"===t&&(this._init=this._createDescriptors(e,!0),this._notify(this._init,e,"install"));const o=r?this._descriptors(e).filter(r):this._descriptors(e),i=this._notify(o,e,t,n);return"afterDestroy"===t&&(this._notify(o,e,"stop"),this._notify(this._init,e,"uninstall")),i}_notify(e,t,n,r){r=r||{};for(const o of e){const e=o.plugin;if(!1===U(e[n],[t,r,o.options],e)&&r.cancelable)return!1}return!0}invalidate(){L(this._cache)||(this._oldCache=this._cache,this._cache=void 0)}_descriptors(e){if(this._cache)return this._cache;const t=this._cache=this._createDescriptors(e);return this._notifyStateChanges(e),t}_createDescriptors(e,t){const n=e&&e.config,r=H(n.options&&n.options.plugins,{}),o=function(e){const t={},n=[],r=Object.keys(Er.plugins.items);for(let e=0;e<r.length;e++)n.push(Er.getPlugin(r[e]));const o=e.plugins||[];for(let e=0;e<o.length;e++){const r=o[e];-1===n.indexOf(r)&&(n.push(r),t[r.id]=!0)}return{plugins:n,localIds:t}}(n);return!1!==r||t?function(e,{plugins:t,localIds:n},r,o){const i=[],a=e.getContext();for(const s of t){const t=s.id,l=Ar(r[t],o);null!==l&&i.push({plugin:s,options:Or(e.config,{plugin:s,local:n[t]},l,a)})}return i}(e,o,r,t):[]}_notifyStateChanges(e){const t=this._oldCache||[],n=this._cache,r=(e,t)=>e.filter((e=>!t.some((t=>e.plugin.id===t.plugin.id))));this._notify(r(t,n),e,"stop"),this._notify(r(n,t),e,"start")}}function Ar(e,t){return t||!1!==e?!0===e?{}:e:null}function Or(e,{plugin:t,local:n},r,o){const i=e.pluginScopeKeys(t),a=e.getOptionScopes(r,i);return n&&t.defaults&&a.push(t.defaults),e.createResolver(a,o,[""],{scriptable:!1,indexable:!1,allKeys:!0})}function Mr(e,t){const n=nt.datasets[e]||{};return((t.datasets||{})[e]||{}).indexAxis||t.indexAxis||n.indexAxis||"x"}function Rr(e){if("x"===e||"y"===e||"r"===e)return e}function Pr(e,...t){if(Rr(e))return e;for(const r of t){const t=r.axis||("top"===(n=r.position)||"bottom"===n?"x":"left"===n||"right"===n?"y":void 0)||e.length>1&&Rr(e[0].toLowerCase());if(t)return t}var n;throw new Error(`Cannot determine type of '${e}' axis. Please provide 'axis' or 'position' option.`)}function Tr(e,t,n){if(n[t+"AxisID"]===e)return{axis:t}}function zr(e,t){const n=Xe[e.type]||{scales:{}},r=t.scales||{},o=Mr(e.type,t),i=Object.create(null);return Object.keys(r).forEach((t=>{const a=r[t];if(!F(a))return console.error(`Invalid scale configuration for scale: ${t}`);if(a._proxy)return console.warn(`Ignoring resolver passed as options for scale: ${t}`);const s=Pr(t,a,function(e,t){if(t.data&&t.data.datasets){const n=t.data.datasets.filter((t=>t.xAxisID===e||t.yAxisID===e));if(n.length)return Tr(e,"x",n[0])||Tr(e,"y",n[0])}return{}}(t,e),nt.scales[a.type]),l=function(e,t){return e===t?"_index_":"_value_"}(s,o),c=n.scales||{};i[t]=Z(Object.create(null),[{axis:s},a,c[s],c[l]])})),e.data.datasets.forEach((n=>{const o=n.type||e.type,a=n.indexAxis||Mr(o,t),s=(Xe[o]||{}).scales||{};Object.keys(s).forEach((e=>{const t=function(e,t){let n=e;return"_index_"===e?n=t:"_value_"===e&&(n="x"===t?"y":"x"),n}(e,a),o=n[t+"AxisID"]||t;i[o]=i[o]||Object.create(null),Z(i[o],[{axis:t},r[o],s[e]])}))})),Object.keys(i).forEach((e=>{const t=i[e];Z(t,[nt.scales[t.type],nt.scale])})),i}function jr(e){const t=e.options||(e.options={});t.plugins=H(t.plugins,{}),t.scales=zr(e,t)}function Ir(e){return(e=e||{}).datasets=e.datasets||[],e.labels=e.labels||[],e}const Nr=new Map,$r=new Set;function Lr(e,t){let n=Nr.get(e);return n||(n=t(),Nr.set(e,n),$r.add(n)),n}const Dr=(e,t,n)=>{const r=te(t,n);void 0!==r&&e.add(r)};class Fr{constructor(e){this._config=function(e){return(e=e||{}).data=Ir(e.data),jr(e),e}(e),this._scopeCache=new Map,this._resolverCache=new Map}get platform(){return this._config.platform}get type(){return this._config.type}set type(e){this._config.type=e}get data(){return this._config.data}set data(e){this._config.data=Ir(e)}get options(){return this._config.options}set options(e){this._config.options=e}get plugins(){return this._config.plugins}update(){const e=this._config;this.clearCache(),jr(e)}clearCache(){this._scopeCache.clear(),this._resolverCache.clear()}datasetScopeKeys(e){return Lr(e,(()=>[[`datasets.${e}`,""]]))}datasetAnimationScopeKeys(e,t){return Lr(`${e}.transition.${t}`,(()=>[[`datasets.${e}.transitions.${t}`,`transitions.${t}`],[`datasets.${e}`,""]]))}datasetElementScopeKeys(e,t){return Lr(`${e}-${t}`,(()=>[[`datasets.${e}.elements.${t}`,`datasets.${e}`,`elements.${t}`,""]]))}pluginScopeKeys(e){const t=e.id;return Lr(`${this.type}-plugin-${t}`,(()=>[[`plugins.${t}`,...e.additionalOptionScopes||[]]]))}_cachedScopes(e,t){const n=this._scopeCache;let r=n.get(e);return r&&!t||(r=new Map,n.set(e,r)),r}getOptionScopes(e,t,n){const{options:r,type:o}=this,i=this._cachedScopes(e,n),a=i.get(t);if(a)return a;const s=new Set;t.forEach((t=>{e&&(s.add(e),t.forEach((t=>Dr(s,e,t)))),t.forEach((e=>Dr(s,r,e))),t.forEach((e=>Dr(s,Xe[o]||{},e))),t.forEach((e=>Dr(s,nt,e))),t.forEach((e=>Dr(s,Ze,e)))}));const l=Array.from(s);return 0===l.length&&l.push(Object.create(null)),$r.has(t)&&i.set(t,l),l}chartOptionScopes(){const{options:e,type:t}=this;return[e,Xe[t]||{},nt.datasets[t]||{},{type:t},nt,Ze]}resolveNamedOptions(e,t,n,r=[""]){const o={$shared:!0},{resolver:i,subPrefixes:a}=Br(this._resolverCache,e,r);let s=i;if(function(e,t){const{isScriptable:n,isIndexable:r}=Ot(e);for(const o of t){const t=n(o),i=r(o),a=(i||t)&&e[o];if(t&&(oe(a)||Wr(a))||i&&D(a))return!0}return!1}(i,t)){o.$shared=!1;s=At(i,n=oe(n)?n():n,this.createResolver(e,n,a))}for(const e of t)o[e]=s[e];return o}createResolver(e,t,n=[""],r){const{resolver:o}=Br(this._resolverCache,e,n);return F(t)?At(o,t,void 0,r):o}}function Br(e,t,n){let r=e.get(t);r||(r=new Map,e.set(t,r));const o=n.join();let i=r.get(o);if(!i){i={resolver:Ct(t,n),subPrefixes:n.filter((e=>!e.toLowerCase().includes("hover")))},r.set(o,i)}return i}const Wr=e=>F(e)&&Object.getOwnPropertyNames(e).some((t=>oe(e[t])));const Hr=["top","bottom","left","right","chartArea"];function qr(e,t){return"top"===e||"bottom"===e||-1===Hr.indexOf(e)&&"x"===t}function Ur(e,t){return function(n,r){return n[e]===r[e]?n[t]-r[t]:n[e]-r[e]}}function Vr(e){const t=e.chart,n=t.options.animation;t.notifyPlugins("afterRender"),U(n&&n.onComplete,[e],t)}function Kr(e){const t=e.chart,n=t.options.animation;U(n&&n.onProgress,[e],t)}function Qr(e){return Dt()&&"string"==typeof e?e=document.getElementById(e):e&&e.length&&(e=e[0]),e&&e.canvas&&(e=e.canvas),e}const Yr={},Gr=e=>{const t=Qr(e);return Object.values(Yr).filter((e=>e.canvas===t)).pop()};function Xr(e,t,n){const r=Object.keys(e);for(const o of r){const r=+o;if(r>=t){const i=e[o];delete e[o],(n>0||r>t)&&(e[r+n]=i)}}}function Zr(e,t,n){return e.options.clip?e[n]:t[n]}class Jr{static defaults=nt;static instances=Yr;static overrides=Xe;static registry=Er;static version="4.4.4";static getChart=Gr;static register(...e){Er.add(...e),eo()}static unregister(...e){Er.remove(...e),eo()}constructor(e,t){const n=this.config=new Fr(t),r=Qr(e),o=Gr(r);if(o)throw new Error("Canvas is already in use. Chart with ID '"+o.id+"' must be destroyed before the canvas with ID '"+o.canvas.id+"' can be reused.");const i=n.createResolver(n.chartOptionScopes(),this.getContext());this.platform=new(n.platform||function(e){return!Dt()||"undefined"!=typeof OffscreenCanvas&&e instanceof OffscreenCanvas?Gn:dr}(r)),this.platform.updateConfig(n);const a=this.platform.acquireContext(r,i.aspectRatio),s=a&&a.canvas,l=s&&s.height,c=s&&s.width;this.id=$(),this.ctx=a,this.canvas=s,this.width=c,this.height=l,this._options=i,this._aspectRatio=this.aspectRatio,this._layers=[],this._metasets=[],this._stacks=void 0,this.boxes=[],this.currentDevicePixelRatio=void 0,this.chartArea=void 0,this._active=[],this._lastEvent=void 0,this._listeners={},this._responsiveListeners=void 0,this._sortedMetasets=[],this.scales={},this._plugins=new Cr,this.$proxies={},this._hiddenIndices={},this.attached=!1,this._animationsDisabled=void 0,this.$context=void 0,this._doResize=function(e,t){let n;return function(...r){return t?(clearTimeout(n),n=setTimeout(e,t,r)):e.apply(this,r),t}}((e=>this.update(e)),i.resizeDelay||0),this._dataChanges=[],Yr[this.id]=this,a&&s?(nn.listen(this,"complete",Vr),nn.listen(this,"progress",Kr),this._initialize(),this.attached&&this.update()):console.error("Failed to create chart: can't acquire context from the given item")}get aspectRatio(){const{options:{aspectRatio:e,maintainAspectRatio:t},width:n,height:r,_aspectRatio:o}=this;return L(e)?t&&o?o:r?n/r:null:e}get data(){return this.config.data}set data(e){this.config.data=e}get options(){return this._options}set options(e){this.config.options=e}get registry(){return Er}_initialize(){return this.notifyPlugins("beforeInit"),this.options.responsive?this.resize():Yt(this,this.options.devicePixelRatio),this.bindEvents(),this.notifyPlugins("afterInit"),this}clear(){return it(this.canvas,this.ctx),this}stop(){return nn.stop(this),this}resize(e,t){nn.running(this)?this._resizeBeforeDraw={width:e,height:t}:this._resize(e,t)}_resize(e,t){const n=this.options,r=this.canvas,o=n.maintainAspectRatio&&this.aspectRatio,i=this.platform.getMaximumSize(r,e,t,o),a=n.devicePixelRatio||this.platform.getDevicePixelRatio(),s=this.width?"resize":"attach";this.width=i.width,this.height=i.height,this._aspectRatio=this.aspectRatio,Yt(this,a,!0)&&(this.notifyPlugins("resize",{size:i}),U(n.onResize,[this,i],this),this.attached&&this._doResize(s)&&this.render())}ensureScalesHaveIDs(){V(this.options.scales||{},((e,t)=>{e.id=t}))}buildOrUpdateScales(){const e=this.options,t=e.scales,n=this.scales,r=Object.keys(n).reduce(((e,t)=>(e[t]=!1,e)),{});let o=[];t&&(o=o.concat(Object.keys(t).map((e=>{const n=t[e],r=Pr(e,n),o="r"===r,i="x"===r;return{options:n,dposition:o?"chartArea":i?"bottom":"left",dtype:o?"radialLinear":i?"category":"linear"}})))),V(o,(t=>{const o=t.options,i=o.id,a=Pr(i,o),s=H(o.type,t.dtype);void 0!==o.position&&qr(o.position,a)===qr(t.dposition)||(o.position=t.dposition),r[i]=!0;let l=null;if(i in n&&n[i].type===s)l=n[i];else{l=new(Er.getScale(s))({id:i,type:s,ctx:this.ctx,chart:this}),n[l.id]=l}l.init(o,e)})),V(r,((e,t)=>{e||delete n[t]})),V(n,(e=>{Qn.configure(this,e,e.options),Qn.addBox(this,e)}))}_updateMetasets(){const e=this._metasets,t=this.data.datasets.length,n=e.length;if(e.sort(((e,t)=>e.index-t.index)),n>t){for(let e=t;e<n;++e)this._destroyDatasetMeta(e);e.splice(t,n-t)}this._sortedMetasets=e.slice(0).sort(Ur("order","index"))}_removeUnreferencedMetasets(){const{_metasets:e,data:{datasets:t}}=this;e.length>t.length&&delete this._stacks,e.forEach(((e,n)=>{0===t.filter((t=>t===e._dataset)).length&&this._destroyDatasetMeta(n)}))}buildOrUpdateControllers(){const e=[],t=this.data.datasets;let n,r;for(this._removeUnreferencedMetasets(),n=0,r=t.length;n<r;n++){const r=t[n];let o=this.getDatasetMeta(n);const i=r.type||this.config.type;if(o.type&&o.type!==i&&(this._destroyDatasetMeta(n),o=this.getDatasetMeta(n)),o.type=i,o.indexAxis=r.indexAxis||Mr(i,this.options),o.order=r.order||0,o.index=n,o.label=""+r.label,o.visible=this.isDatasetVisible(n),o.controller)o.controller.updateIndex(n),o.controller.linkScales();else{const t=Er.getController(i),{datasetElementType:r,dataElementType:a}=nt.datasets[i];Object.assign(t,{dataElementType:Er.getElement(a),datasetElementType:r&&Er.getElement(r)}),o.controller=new t(this,n),e.push(o.controller)}}return this._updateMetasets(),e}_resetElements(){V(this.data.datasets,((e,t)=>{this.getDatasetMeta(t).controller.reset()}),this)}reset(){this._resetElements(),this.notifyPlugins("reset")}update(e){const t=this.config;t.update();const n=this._options=t.createResolver(t.chartOptionScopes(),this.getContext()),r=this._animationsDisabled=!n.animation;if(this._updateScales(),this._checkEventBindings(),this._updateHiddenIndices(),this._plugins.invalidate(),!1===this.notifyPlugins("beforeUpdate",{mode:e,cancelable:!0}))return;const o=this.buildOrUpdateControllers();this.notifyPlugins("beforeElementsUpdate");let i=0;for(let e=0,t=this.data.datasets.length;e<t;e++){const{controller:t}=this.getDatasetMeta(e),n=!r&&-1===o.indexOf(t);t.buildOrUpdateElements(n),i=Math.max(+t.getMaxOverflow(),i)}i=this._minPadding=n.layout.autoPadding?i:0,this._updateLayout(i),r||V(o,(e=>{e.reset()})),this._updateDatasets(e),this.notifyPlugins("afterUpdate",{mode:e}),this._layers.sort(Ur("z","_idx"));const{_active:a,_lastEvent:s}=this;s?this._eventHandler(s,!0):a.length&&this._updateHoverStyles(a,a,!0),this.render()}_updateScales(){V(this.scales,(e=>{Qn.removeBox(this,e)})),this.ensureScalesHaveIDs(),this.buildOrUpdateScales()}_checkEventBindings(){const e=this.options,t=new Set(Object.keys(this._listeners)),n=new Set(e.events);ie(t,n)&&!!this._responsiveListeners===e.responsive||(this.unbindEvents(),this.bindEvents())}_updateHiddenIndices(){const{_hiddenIndices:e}=this,t=this._getUniformDataChanges()||[];for(const{method:n,start:r,count:o}of t){Xr(e,r,"_removeElements"===n?-o:o)}}_getUniformDataChanges(){const e=this._dataChanges;if(!e||!e.length)return;this._dataChanges=[];const t=this.data.datasets.length,n=t=>new Set(e.filter((e=>e[0]===t)).map(((e,t)=>t+","+e.splice(1).join(",")))),r=n(0);for(let e=1;e<t;e++)if(!ie(r,n(e)))return;return Array.from(r).map((e=>e.split(","))).map((e=>({method:e[1],start:+e[2],count:+e[3]})))}_updateLayout(e){if(!1===this.notifyPlugins("beforeLayout",{cancelable:!0}))return;Qn.update(this,this.width,this.height,e);const t=this.chartArea,n=t.width<=0||t.height<=0;this._layers=[],V(this.boxes,(e=>{n&&"chartArea"===e.position||(e.configure&&e.configure(),this._layers.push(...e._layers()))}),this),this._layers.forEach(((e,t)=>{e._idx=t})),this.notifyPlugins("afterLayout")}_updateDatasets(e){if(!1!==this.notifyPlugins("beforeDatasetsUpdate",{mode:e,cancelable:!0})){for(let e=0,t=this.data.datasets.length;e<t;++e)this.getDatasetMeta(e).controller.configure();for(let t=0,n=this.data.datasets.length;t<n;++t)this._updateDataset(t,oe(e)?e({datasetIndex:t}):e);this.notifyPlugins("afterDatasetsUpdate",{mode:e})}}_updateDataset(e,t){const n=this.getDatasetMeta(e),r={meta:n,index:e,mode:t,cancelable:!0};!1!==this.notifyPlugins("beforeDatasetUpdate",r)&&(n.controller._update(t),r.cancelable=!1,this.notifyPlugins("afterDatasetUpdate",r))}render(){!1!==this.notifyPlugins("beforeRender",{cancelable:!0})&&(nn.has(this)?this.attached&&!nn.running(this)&&nn.start(this):(this.draw(),Vr({chart:this})))}draw(){let e;if(this._resizeBeforeDraw){const{width:e,height:t}=this._resizeBeforeDraw;this._resizeBeforeDraw=null,this._resize(e,t)}if(this.clear(),this.width<=0||this.height<=0)return;if(!1===this.notifyPlugins("beforeDraw",{cancelable:!0}))return;const t=this._layers;for(e=0;e<t.length&&t[e].z<=0;++e)t[e].draw(this.chartArea);for(this._drawDatasets();e<t.length;++e)t[e].draw(this.chartArea);this.notifyPlugins("afterDraw")}_getSortedDatasetMetas(e){const t=this._sortedMetasets,n=[];let r,o;for(r=0,o=t.length;r<o;++r){const o=t[r];e&&!o.visible||n.push(o)}return n}getSortedVisibleDatasetMetas(){return this._getSortedDatasetMetas(!0)}_drawDatasets(){if(!1===this.notifyPlugins("beforeDatasetsDraw",{cancelable:!0}))return;const e=this.getSortedVisibleDatasetMetas();for(let t=e.length-1;t>=0;--t)this._drawDataset(e[t]);this.notifyPlugins("afterDatasetsDraw")}_drawDataset(e){const t=this.ctx,n=e._clip,r=!n.disabled,o=function(e,t){const{xScale:n,yScale:r}=e;return n&&r?{left:Zr(n,t,"left"),right:Zr(n,t,"right"),top:Zr(r,t,"top"),bottom:Zr(r,t,"bottom")}:t}(e,this.chartArea),i={meta:e,index:e.index,cancelable:!0};!1!==this.notifyPlugins("beforeDatasetDraw",i)&&(r&&ct(t,{left:!1===n.left?0:o.left-n.left,right:!1===n.right?this.width:o.right+n.right,top:!1===n.top?0:o.top-n.top,bottom:!1===n.bottom?this.height:o.bottom+n.bottom}),e.controller.draw(),r&&ut(t),i.cancelable=!1,this.notifyPlugins("afterDatasetDraw",i))}isPointInArea(e){return lt(e,this.chartArea,this._minPadding)}getElementsAtEventForMode(e,t,n,r){const o=In.modes[t];return"function"==typeof o?o(this,e,n,r):[]}getDatasetMeta(e){const t=this.data.datasets[e],n=this._metasets;let r=n.filter((e=>e&&e._dataset===t)).pop();return r||(r={type:null,data:[],dataset:null,controller:null,hidden:null,xAxisID:null,yAxisID:null,order:t&&t.order||0,index:e,_dataset:t,_parsed:[],_sorted:!1},n.push(r)),r}getContext(){return this.$context||(this.$context=Et(null,{chart:this,type:"chart"}))}getVisibleDatasetCount(){return this.getSortedVisibleDatasetMetas().length}isDatasetVisible(e){const t=this.data.datasets[e];if(!t)return!1;const n=this.getDatasetMeta(e);return"boolean"==typeof n.hidden?!n.hidden:!t.hidden}setDatasetVisibility(e,t){this.getDatasetMeta(e).hidden=!t}toggleDataVisibility(e){this._hiddenIndices[e]=!this._hiddenIndices[e]}getDataVisibility(e){return!this._hiddenIndices[e]}_updateVisibility(e,t,n){const r=n?"show":"hide",o=this.getDatasetMeta(e),i=o.controller._resolveAnimations(void 0,r);re(t)?(o.data[t].hidden=!n,this.update()):(this.setDatasetVisibility(e,n),i.update(o,{visible:n}),this.update((t=>t.datasetIndex===e?r:void 0)))}hide(e,t){this._updateVisibility(e,t,!1)}show(e,t){this._updateVisibility(e,t,!0)}_destroyDatasetMeta(e){const t=this._metasets[e];t&&t.controller&&t.controller._destroy(),delete this._metasets[e]}_stop(){let e,t;for(this.stop(),nn.remove(this),e=0,t=this.data.datasets.length;e<t;++e)this._destroyDatasetMeta(e)}destroy(){this.notifyPlugins("beforeDestroy");const{canvas:e,ctx:t}=this;this._stop(),this.config.clearCache(),e&&(this.unbindEvents(),it(e,t),this.platform.releaseContext(t),this.canvas=null,this.ctx=null),delete Yr[this.id],this.notifyPlugins("afterDestroy")}toBase64Image(...e){return this.canvas.toDataURL(...e)}bindEvents(){this.bindUserEvents(),this.options.responsive?this.bindResponsiveEvents():this.attached=!0}bindUserEvents(){const e=this._listeners,t=this.platform,n=(n,r)=>{t.addEventListener(this,n,r),e[n]=r},r=(e,t,n)=>{e.offsetX=t,e.offsetY=n,this._eventHandler(e)};V(this.options.events,(e=>n(e,r)))}bindResponsiveEvents(){this._responsiveListeners||(this._responsiveListeners={});const e=this._responsiveListeners,t=this.platform,n=(n,r)=>{t.addEventListener(this,n,r),e[n]=r},r=(n,r)=>{e[n]&&(t.removeEventListener(this,n,r),delete e[n])},o=(e,t)=>{this.canvas&&this.resize(e,t)};let i;const a=()=>{r("attach",a),this.attached=!0,this.resize(),n("resize",o),n("detach",i)};i=()=>{this.attached=!1,r("resize",o),this._stop(),this._resize(0,0),n("attach",a)},t.isAttached(this.canvas)?a():i()}unbindEvents(){V(this._listeners,((e,t)=>{this.platform.removeEventListener(this,t,e)})),this._listeners={},V(this._responsiveListeners,((e,t)=>{this.platform.removeEventListener(this,t,e)})),this._responsiveListeners=void 0}updateHoverStyle(e,t,n){const r=n?"set":"remove";let o,i,a,s;for("dataset"===t&&(o=this.getDatasetMeta(e[0].datasetIndex),o.controller["_"+r+"DatasetHoverStyle"]()),a=0,s=e.length;a<s;++a){i=e[a];const t=i&&this.getDatasetMeta(i.datasetIndex).controller;t&&t[r+"HoverStyle"](i.element,i.datasetIndex,i.index)}}getActiveElements(){return this._active||[]}setActiveElements(e){const t=this._active||[],n=e.map((({datasetIndex:e,index:t})=>{const n=this.getDatasetMeta(e);if(!n)throw new Error("No dataset found at index "+e);return{datasetIndex:e,element:n.data[t],index:t}}));!K(n,t)&&(this._active=n,this._lastEvent=null,this._updateHoverStyles(n,t))}notifyPlugins(e,t,n){return this._plugins.notify(this,e,t,n)}isPluginEnabled(e){return 1===this._plugins._cache.filter((t=>t.plugin.id===e)).length}_updateHoverStyles(e,t,n){const r=this.options.hover,o=(e,t)=>e.filter((e=>!t.some((t=>e.datasetIndex===t.datasetIndex&&e.index===t.index)))),i=o(t,e),a=n?e:o(e,t);i.length&&this.updateHoverStyle(i,r.mode,!1),a.length&&r.mode&&this.updateHoverStyle(a,r.mode,!0)}_eventHandler(e,t){const n={event:e,replay:t,cancelable:!0,inChartArea:this.isPointInArea(e)},r=t=>(t.options.events||this.options.events).includes(e.native.type);if(!1===this.notifyPlugins("beforeEvent",n,r))return;const o=this._handleEvent(e,t,n.inChartArea);return n.cancelable=!1,this.notifyPlugins("afterEvent",n,r),(o||n.changed)&&this.render(),this}_handleEvent(e,t,n){const{_active:r=[],options:o}=this,i=t,a=this._getActiveElements(e,r,n,i),s=function(e){return"mouseup"===e.type||"click"===e.type||"contextmenu"===e.type}(e),l=function(e,t,n,r){return n&&"mouseout"!==e.type?r?t:e:null}(e,this._lastEvent,n,s);n&&(this._lastEvent=null,U(o.onHover,[e,a,this],this),s&&U(o.onClick,[e,a,this],this));const c=!K(a,r);return(c||t)&&(this._active=a,this._updateHoverStyles(a,r,t)),this._lastEvent=l,c}_getActiveElements(e,t,n,r){if("mouseout"===e.type)return[];if(!n)return t;const o=this.options.hover;return this.getElementsAtEventForMode(e,o.mode,o,r)}}function eo(){return V(Jr.instances,(e=>e._plugins.invalidate()))}function to(e,t){const{x:n,y:r,base:o,width:i,height:a}=e.getProps(["x","y","base","width","height"],t);let s,l,c,u,d;return e.horizontal?(d=a/2,s=Math.min(n,o),l=Math.max(n,o),c=r-d,u=r+d):(d=i/2,s=n-d,l=n+d,c=Math.min(r,o),u=Math.max(r,o)),{left:s,top:c,right:l,bottom:u}}function no(e,t,n,r){return e?0:Ce(t,n,r)}function ro(e){const t=to(e),n=t.right-t.left,r=t.bottom-t.top,o=function(e,t,n){const r=e.options.borderWidth,o=e.borderSkipped,i=xt(r);return{t:no(o.top,i.top,0,n),r:no(o.right,i.right,0,t),b:no(o.bottom,i.bottom,0,n),l:no(o.left,i.left,0,t)}}(e,n/2,r/2),i=function(e,t,n){const{enableBorderRadius:r}=e.getProps(["enableBorderRadius"]),o=e.options.borderRadius,i=kt(o),a=Math.min(t,n),s=e.borderSkipped,l=r||F(o);return{topLeft:no(!l||s.top||s.left,i.topLeft,0,a),topRight:no(!l||s.top||s.right,i.topRight,0,a),bottomLeft:no(!l||s.bottom||s.left,i.bottomLeft,0,a),bottomRight:no(!l||s.bottom||s.right,i.bottomRight,0,a)}}(e,n/2,r/2);return{outer:{x:t.left,y:t.top,w:n,h:r,radius:i},inner:{x:t.left+o.l,y:t.top+o.t,w:n-o.l-o.r,h:r-o.t-o.b,radius:{topLeft:Math.max(0,i.topLeft-Math.max(o.t,o.l)),topRight:Math.max(0,i.topRight-Math.max(o.t,o.r)),bottomLeft:Math.max(0,i.bottomLeft-Math.max(o.b,o.l)),bottomRight:Math.max(0,i.bottomRight-Math.max(o.b,o.r))}}}}function oo(e,t,n,r){const o=null===t,i=null===n,a=e&&!(o&&i)&&to(e,r);return a&&(o||Ae(t,a.left,a.right))&&(i||Ae(n,a.top,a.bottom))}function io(e,t){e.rect(t.x,t.y,t.w,t.h)}function ao(e,t,n={}){const r=e.x!==n.x?-t:0,o=e.y!==n.y?-t:0,i=(e.x+e.w!==n.x+n.w?t:0)-r,a=(e.y+e.h!==n.y+n.h?t:0)-o;return{x:e.x+r,y:e.y+o,w:e.w+i,h:e.h+a,radius:e.radius}}class so extends hr{static id="bar";static defaults={borderSkipped:"start",borderWidth:0,borderRadius:0,inflateAmount:"auto",pointStyle:void 0};static defaultRoutes={backgroundColor:"backgroundColor",borderColor:"borderColor"};constructor(e){super(),this.options=void 0,this.horizontal=void 0,this.base=void 0,this.width=void 0,this.height=void 0,this.inflateAmount=void 0,e&&Object.assign(this,e)}draw(e){const{inflateAmount:t,options:{borderColor:n,backgroundColor:r}}=this,{inner:o,outer:i}=ro(this),a=(s=i.radius).topLeft||s.topRight||s.bottomLeft||s.bottomRight?ft:io;var s;e.save(),i.w===o.w&&i.h===o.h||(e.beginPath(),a(e,ao(i,t,o)),e.clip(),a(e,ao(o,-t,i)),e.fillStyle=n,e.fill("evenodd")),e.beginPath(),a(e,ao(o,t)),e.fillStyle=r,e.fill(),e.restore()}inRange(e,t,n){return oo(this,e,t,n)}inXRange(e,t){return oo(this,e,null,t)}inYRange(e,t){return oo(this,null,e,t)}getCenterPoint(e){const{x:t,y:n,base:r,horizontal:o}=this.getProps(["x","y","base","horizontal"],e);return{x:o?(t+r)/2:t,y:o?n:(n+r)/2}}getRange(e){return"x"===e?this.width/2:this.height/2}}const lo=(e,t)=>{let{boxHeight:n=t,boxWidth:r=t}=e;return e.usePointStyle&&(n=Math.min(n,t),r=e.pointStyleWidth||Math.min(r,t)),{boxWidth:r,boxHeight:n,itemHeight:Math.max(t,n)}};class co extends hr{constructor(e){super(),this._added=!1,this.legendHitBoxes=[],this._hoveredItem=null,this.doughnutMode=!1,this.chart=e.chart,this.options=e.options,this.ctx=e.ctx,this.legendItems=void 0,this.columnSizes=void 0,this.lineWidths=void 0,this.maxHeight=void 0,this.maxWidth=void 0,this.top=void 0,this.bottom=void 0,this.left=void 0,this.right=void 0,this.height=void 0,this.width=void 0,this._margins=void 0,this.position=void 0,this.weight=void 0,this.fullSize=void 0}update(e,t,n){this.maxWidth=e,this.maxHeight=t,this._margins=n,this.setDimensions(),this.buildLabels(),this.fit()}setDimensions(){this.isHorizontal()?(this.width=this.maxWidth,this.left=this._margins.left,this.right=this.width):(this.height=this.maxHeight,this.top=this._margins.top,this.bottom=this.height)}buildLabels(){const e=this.options.labels||{};let t=U(e.generateLabels,[this.chart],this)||[];e.filter&&(t=t.filter((t=>e.filter(t,this.chart.data)))),e.sort&&(t=t.sort(((t,n)=>e.sort(t,n,this.chart.data)))),this.options.reverse&&t.reverse(),this.legendItems=t}fit(){const{options:e,ctx:t}=this;if(!e.display)return void(this.width=this.height=0);const n=e.labels,r=_t(n.font),o=r.size,i=this._computeTitleHeight(),{boxWidth:a,itemHeight:s}=lo(n,o);let l,c;t.font=r.string,this.isHorizontal()?(l=this.maxWidth,c=this._fitRows(i,o,a,s)+10):(c=this.maxHeight,l=this._fitCols(i,r,a,s)+10),this.width=Math.min(l,e.maxWidth||this.maxWidth),this.height=Math.min(c,e.maxHeight||this.maxHeight)}_fitRows(e,t,n,r){const{ctx:o,maxWidth:i,options:{labels:{padding:a}}}=this,s=this.legendHitBoxes=[],l=this.lineWidths=[0],c=r+a;let u=e;o.textAlign="left",o.textBaseline="middle";let d=-1,h=-c;return this.legendItems.forEach(((e,p)=>{const f=n+t/2+o.measureText(e.text).width;(0===p||l[l.length-1]+f+2*a>i)&&(u+=c,l[l.length-(p>0?0:1)]=0,h+=c,d++),s[p]={left:0,top:h,row:d,width:f,height:r},l[l.length-1]+=f+a})),u}_fitCols(e,t,n,r){const{ctx:o,maxHeight:i,options:{labels:{padding:a}}}=this,s=this.legendHitBoxes=[],l=this.columnSizes=[],c=i-e;let u=a,d=0,h=0,p=0,f=0;return this.legendItems.forEach(((e,i)=>{const{itemWidth:m,itemHeight:g}=function(e,t,n,r,o){const i=function(e,t,n,r){let o=e.text;o&&"string"!=typeof o&&(o=o.reduce(((e,t)=>e.length>t.length?e:t)));return t+n.size/2+r.measureText(o).width}(r,e,t,n),a=function(e,t,n){let r=e;"string"!=typeof t.text&&(r=uo(t,n));return r}(o,r,t.lineHeight);return{itemWidth:i,itemHeight:a}}(n,t,o,e,r);i>0&&h+g+2*a>c&&(u+=d+a,l.push({width:d,height:h}),p+=d+a,f++,d=h=0),s[i]={left:p,top:h,col:f,width:m,height:g},d=Math.max(d,m),h+=g+a})),u+=d,l.push({width:d,height:h}),u}adjustHitBoxes(){if(!this.options.display)return;const e=this._computeTitleHeight(),{legendHitBoxes:t,options:{align:n,labels:{padding:r},rtl:o}}=this,i=Zt(o,this.left,this.width);if(this.isHorizontal()){let o=0,a=$e(n,this.left+r,this.right-this.lineWidths[o]);for(const s of t)o!==s.row&&(o=s.row,a=$e(n,this.left+r,this.right-this.lineWidths[o])),s.top+=this.top+e+r,s.left=i.leftForLtr(i.x(a),s.width),a+=s.width+r}else{let o=0,a=$e(n,this.top+e+r,this.bottom-this.columnSizes[o].height);for(const s of t)s.col!==o&&(o=s.col,a=$e(n,this.top+e+r,this.bottom-this.columnSizes[o].height)),s.top=a,s.left+=this.left+r,s.left=i.leftForLtr(i.x(s.left),s.width),a+=s.height+r}}isHorizontal(){return"top"===this.options.position||"bottom"===this.options.position}draw(){if(this.options.display){const e=this.ctx;ct(e,this),this._draw(),ut(e)}}_draw(){const{options:e,columnSizes:t,lineWidths:n,ctx:r}=this,{align:o,labels:i}=e,a=nt.color,s=Zt(e.rtl,this.left,this.width),l=_t(i.font),{padding:c}=i,u=l.size,d=u/2;let h;this.drawTitle(),r.textAlign=s.textAlign("left"),r.textBaseline="middle",r.lineWidth=.5,r.font=l.string;const{boxWidth:p,boxHeight:f,itemHeight:m}=lo(i,u),g=this.isHorizontal(),y=this._computeTitleHeight();h=g?{x:$e(o,this.left+c,this.right-n[0]),y:this.top+c+y,line:0}:{x:this.left+c,y:$e(o,this.top+y+c,this.bottom-t[0].height),line:0},Jt(this.ctx,e.textDirection);const b=m+c;this.legendItems.forEach(((v,x)=>{r.strokeStyle=v.fontColor,r.fillStyle=v.fontColor;const k=r.measureText(v.text).width,w=s.textAlign(v.textAlign||(v.textAlign=i.textAlign)),_=p+d+k;let S=h.x,E=h.y;s.setWidth(this.width),g?x>0&&S+_+c>this.right&&(E=h.y+=b,h.line++,S=h.x=$e(o,this.left+c,this.right-n[h.line])):x>0&&E+b>this.bottom&&(S=h.x=S+t[h.line].width+c,h.line++,E=h.y=$e(o,this.top+y+c,this.bottom-t[h.line].height));if(function(e,t,n){if(isNaN(p)||p<=0||isNaN(f)||f<0)return;r.save();const o=H(n.lineWidth,1);if(r.fillStyle=H(n.fillStyle,a),r.lineCap=H(n.lineCap,"butt"),r.lineDashOffset=H(n.lineDashOffset,0),r.lineJoin=H(n.lineJoin,"miter"),r.lineWidth=o,r.strokeStyle=H(n.strokeStyle,a),r.setLineDash(H(n.lineDash,[])),i.usePointStyle){const a={radius:f*Math.SQRT2/2,pointStyle:n.pointStyle,rotation:n.rotation,borderWidth:o},l=s.xPlus(e,p/2);st(r,a,l,t+d,i.pointStyleWidth&&p)}else{const i=t+Math.max((u-f)/2,0),a=s.leftForLtr(e,p),l=kt(n.borderRadius);r.beginPath(),Object.values(l).some((e=>0!==e))?ft(r,{x:a,y:i,w:p,h:f,radius:l}):r.rect(a,i,p,f),r.fill(),0!==o&&r.stroke()}r.restore()}(s.x(S),E,v),S=((e,t,n,r)=>e===(r?"left":"right")?n:"center"===e?(t+n)/2:t)(w,S+p+d,g?S+_:this.right,e.rtl),function(e,t,n){pt(r,n.text,e,t+m/2,l,{strikethrough:n.hidden,textAlign:s.textAlign(n.textAlign)})}(s.x(S),E,v),g)h.x+=_+c;else if("string"!=typeof v.text){const e=l.lineHeight;h.y+=uo(v,e)+c}else h.y+=b})),en(this.ctx,e.textDirection)}drawTitle(){const e=this.options,t=e.title,n=_t(t.font),r=wt(t.padding);if(!t.display)return;const o=Zt(e.rtl,this.left,this.width),i=this.ctx,a=t.position,s=n.size/2,l=r.top+s;let c,u=this.left,d=this.width;if(this.isHorizontal())d=Math.max(...this.lineWidths),c=this.top+l,u=$e(e.align,u,this.right-d);else{const t=this.columnSizes.reduce(((e,t)=>Math.max(e,t.height)),0);c=l+$e(e.align,this.top,this.bottom-t-e.labels.padding-this._computeTitleHeight())}const h=$e(a,u,u+d);i.textAlign=o.textAlign(Ne(a)),i.textBaseline="middle",i.strokeStyle=t.color,i.fillStyle=t.color,i.font=n.string,pt(i,t.text,h,c,n)}_computeTitleHeight(){const e=this.options.title,t=_t(e.font),n=wt(e.padding);return e.display?t.lineHeight+n.height:0}_getLegendItemAt(e,t){let n,r,o;if(Ae(e,this.left,this.right)&&Ae(t,this.top,this.bottom))for(o=this.legendHitBoxes,n=0;n<o.length;++n)if(r=o[n],Ae(e,r.left,r.left+r.width)&&Ae(t,r.top,r.top+r.height))return this.legendItems[n];return null}handleEvent(e){const t=this.options;if(!function(e,t){if(("mousemove"===e||"mouseout"===e)&&(t.onHover||t.onLeave))return!0;if(t.onClick&&("click"===e||"mouseup"===e))return!0;return!1}(e.type,t))return;const n=this._getLegendItemAt(e.x,e.y);if("mousemove"===e.type||"mouseout"===e.type){const i=this._hoveredItem,a=(o=n,null!==(r=i)&&null!==o&&r.datasetIndex===o.datasetIndex&&r.index===o.index);i&&!a&&U(t.onLeave,[e,i,this],this),this._hoveredItem=n,n&&!a&&U(t.onHover,[e,n,this],this)}else n&&U(t.onClick,[e,n,this],this);var r,o}}function uo(e,t){return t*(e.text?e.text.length:0)}var ho={id:"legend",_element:co,start(e,t,n){const r=e.legend=new co({ctx:e.ctx,options:n,chart:e});Qn.configure(e,r,n),Qn.addBox(e,r)},stop(e){Qn.removeBox(e,e.legend),delete e.legend},beforeUpdate(e,t,n){const r=e.legend;Qn.configure(e,r,n),r.options=n},afterUpdate(e){const t=e.legend;t.buildLabels(),t.adjustHitBoxes()},afterEvent(e,t){t.replay||e.legend.handleEvent(t.event)},defaults:{display:!0,position:"top",align:"center",fullSize:!0,reverse:!1,weight:1e3,onClick(e,t,n){const r=t.datasetIndex,o=n.chart;o.isDatasetVisible(r)?(o.hide(r),t.hidden=!0):(o.show(r),t.hidden=!1)},onHover:null,onLeave:null,labels:{color:e=>e.chart.options.color,boxWidth:40,padding:10,generateLabels(e){const t=e.data.datasets,{labels:{usePointStyle:n,pointStyle:r,textAlign:o,color:i,useBorderRadius:a,borderRadius:s}}=e.legend.options;return e._getSortedDatasetMetas().map((e=>{const l=e.controller.getStyle(n?0:void 0),c=wt(l.borderWidth);return{text:t[e.index].label,fillStyle:l.backgroundColor,fontColor:i,hidden:!e.visible,lineCap:l.borderCapStyle,lineDash:l.borderDash,lineDashOffset:l.borderDashOffset,lineJoin:l.borderJoinStyle,lineWidth:(c.width+c.height)/4,strokeStyle:l.borderColor,pointStyle:r||l.pointStyle,rotation:l.rotation,textAlign:o||l.textAlign,borderRadius:a&&(s||l.borderRadius),datasetIndex:e.index}}),this)}},title:{color:e=>e.chart.options.color,display:!1,position:"center",text:""}},descriptors:{_scriptable:e=>!e.startsWith("on"),labels:{_scriptable:e=>!["generateLabels","filter","sort"].includes(e)}}};new WeakMap;const po={average(e){if(!e.length)return!1;let t,n,r=new Set,o=0,i=0;for(t=0,n=e.length;t<n;++t){const n=e[t].element;if(n&&n.hasValue()){const e=n.tooltipPosition();r.add(e.x),o+=e.y,++i}}if(0===i||0===r.size)return!1;return{x:[...r].reduce(((e,t)=>e+t))/r.size,y:o/i}},nearest(e,t){if(!e.length)return!1;let n,r,o,i=t.x,a=t.y,s=Number.POSITIVE_INFINITY;for(n=0,r=e.length;n<r;++n){const r=e[n].element;if(r&&r.hasValue()){const e=_e(t,r.getCenterPoint());e<s&&(s=e,o=r)}}if(o){const e=o.tooltipPosition();i=e.x,a=e.y}return{x:i,y:a}}};function fo(e,t){return t&&(D(t)?Array.prototype.push.apply(e,t):e.push(t)),e}function mo(e){return("string"==typeof e||e instanceof String)&&e.indexOf("\n")>-1?e.split("\n"):e}function go(e,t){const{element:n,datasetIndex:r,index:o}=t,i=e.getDatasetMeta(r).controller,{label:a,value:s}=i.getLabelAndValue(o);return{chart:e,label:a,parsed:i.getParsed(o),raw:e.data.datasets[r].data[o],formattedValue:s,dataset:i.getDataset(),dataIndex:o,datasetIndex:r,element:n}}function yo(e,t){const n=e.chart.ctx,{body:r,footer:o,title:i}=e,{boxWidth:a,boxHeight:s}=t,l=_t(t.bodyFont),c=_t(t.titleFont),u=_t(t.footerFont),d=i.length,h=o.length,p=r.length,f=wt(t.padding);let m=f.height,g=0,y=r.reduce(((e,t)=>e+t.before.length+t.lines.length+t.after.length),0);if(y+=e.beforeBody.length+e.afterBody.length,d&&(m+=d*c.lineHeight+(d-1)*t.titleSpacing+t.titleMarginBottom),y){m+=p*(t.displayColors?Math.max(s,l.lineHeight):l.lineHeight)+(y-p)*l.lineHeight+(y-1)*t.bodySpacing}h&&(m+=t.footerMarginTop+h*u.lineHeight+(h-1)*t.footerSpacing);let b=0;const v=function(e){g=Math.max(g,n.measureText(e).width+b)};return n.save(),n.font=c.string,V(e.title,v),n.font=l.string,V(e.beforeBody.concat(e.afterBody),v),b=t.displayColors?a+2+t.boxPadding:0,V(r,(e=>{V(e.before,v),V(e.lines,v),V(e.after,v)})),b=0,n.font=u.string,V(e.footer,v),n.restore(),g+=f.width,{width:g,height:m}}function bo(e,t,n,r){const{x:o,width:i}=n,{width:a,chartArea:{left:s,right:l}}=e;let c="center";return"center"===r?c=o<=(s+l)/2?"left":"right":o<=i/2?c="left":o>=a-i/2&&(c="right"),function(e,t,n,r){const{x:o,width:i}=r,a=n.caretSize+n.caretPadding;return"left"===e&&o+i+a>t.width||"right"===e&&o-i-a<0||void 0}(c,e,t,n)&&(c="center"),c}function vo(e,t,n){const r=n.yAlign||t.yAlign||function(e,t){const{y:n,height:r}=t;return n<r/2?"top":n>e.height-r/2?"bottom":"center"}(e,n);return{xAlign:n.xAlign||t.xAlign||bo(e,t,n,r),yAlign:r}}function xo(e,t,n,r){const{caretSize:o,caretPadding:i,cornerRadius:a}=e,{xAlign:s,yAlign:l}=n,c=o+i,{topLeft:u,topRight:d,bottomLeft:h,bottomRight:p}=kt(a);let f=function(e,t){let{x:n,width:r}=e;return"right"===t?n-=r:"center"===t&&(n-=r/2),n}(t,s);const m=function(e,t,n){let{y:r,height:o}=e;return"top"===t?r+=n:r-="bottom"===t?o+n:o/2,r}(t,l,c);return"center"===l?"left"===s?f+=c:"right"===s&&(f-=c):"left"===s?f-=Math.max(u,h)+o:"right"===s&&(f+=Math.max(d,p)+o),{x:Ce(f,0,r.width-t.width),y:Ce(m,0,r.height-t.height)}}function ko(e,t,n){const r=wt(n.padding);return"center"===t?e.x+e.width/2:"right"===t?e.x+e.width-r.right:e.x+r.left}function wo(e){return fo([],mo(e))}function _o(e,t){const n=t&&t.dataset&&t.dataset.tooltip&&t.dataset.tooltip.callbacks;return n?e.override(n):e}const So={beforeTitle:N,title(e){if(e.length>0){const t=e[0],n=t.chart.data.labels,r=n?n.length:0;if(this&&this.options&&"dataset"===this.options.mode)return t.dataset.label||"";if(t.label)return t.label;if(r>0&&t.dataIndex<r)return n[t.dataIndex]}return""},afterTitle:N,beforeBody:N,beforeLabel:N,label(e){if(this&&this.options&&"dataset"===this.options.mode)return e.label+": "+e.formattedValue||e.formattedValue;let t=e.dataset.label||"";t&&(t+=": ");const n=e.formattedValue;return L(n)||(t+=n),t},labelColor(e){const t=e.chart.getDatasetMeta(e.datasetIndex).controller.getStyle(e.dataIndex);return{borderColor:t.borderColor,backgroundColor:t.backgroundColor,borderWidth:t.borderWidth,borderDash:t.borderDash,borderDashOffset:t.borderDashOffset,borderRadius:0}},labelTextColor(){return this.options.bodyColor},labelPointStyle(e){const t=e.chart.getDatasetMeta(e.datasetIndex).controller.getStyle(e.dataIndex);return{pointStyle:t.pointStyle,rotation:t.rotation}},afterLabel:N,afterBody:N,beforeFooter:N,footer:N,afterFooter:N};function Eo(e,t,n,r){const o=e[t].call(n,r);return void 0===o?So[t].call(n,r):o}class Co extends hr{static positioners=po;constructor(e){super(),this.opacity=0,this._active=[],this._eventPosition=void 0,this._size=void 0,this._cachedAnimations=void 0,this._tooltipItems=[],this.$animations=void 0,this.$context=void 0,this.chart=e.chart,this.options=e.options,this.dataPoints=void 0,this.title=void 0,this.beforeBody=void 0,this.body=void 0,this.afterBody=void 0,this.footer=void 0,this.xAlign=void 0,this.yAlign=void 0,this.x=void 0,this.y=void 0,this.height=void 0,this.width=void 0,this.caretX=void 0,this.caretY=void 0,this.labelColors=void 0,this.labelPointStyles=void 0,this.labelTextColors=void 0}initialize(e){this.options=e,this._cachedAnimations=void 0,this.$context=void 0}_resolveAnimations(){const e=this._cachedAnimations;if(e)return e;const t=this.chart,n=this.options.setContext(this.getContext()),r=n.enabled&&t.options.animation&&n.animations,o=new sn(this.chart,r);return r._cacheable&&(this._cachedAnimations=Object.freeze(o)),o}getContext(){return this.$context||(this.$context=(e=this.chart.getContext(),t=this,n=this._tooltipItems,Et(e,{tooltip:t,tooltipItems:n,type:"tooltip"})));var e,t,n}getTitle(e,t){const{callbacks:n}=t,r=Eo(n,"beforeTitle",this,e),o=Eo(n,"title",this,e),i=Eo(n,"afterTitle",this,e);let a=[];return a=fo(a,mo(r)),a=fo(a,mo(o)),a=fo(a,mo(i)),a}getBeforeBody(e,t){return wo(Eo(t.callbacks,"beforeBody",this,e))}getBody(e,t){const{callbacks:n}=t,r=[];return V(e,(e=>{const t={before:[],lines:[],after:[]},o=_o(n,e);fo(t.before,mo(Eo(o,"beforeLabel",this,e))),fo(t.lines,Eo(o,"label",this,e)),fo(t.after,mo(Eo(o,"afterLabel",this,e))),r.push(t)})),r}getAfterBody(e,t){return wo(Eo(t.callbacks,"afterBody",this,e))}getFooter(e,t){const{callbacks:n}=t,r=Eo(n,"beforeFooter",this,e),o=Eo(n,"footer",this,e),i=Eo(n,"afterFooter",this,e);let a=[];return a=fo(a,mo(r)),a=fo(a,mo(o)),a=fo(a,mo(i)),a}_createItems(e){const t=this._active,n=this.chart.data,r=[],o=[],i=[];let a,s,l=[];for(a=0,s=t.length;a<s;++a)l.push(go(this.chart,t[a]));return e.filter&&(l=l.filter(((t,r,o)=>e.filter(t,r,o,n)))),e.itemSort&&(l=l.sort(((t,r)=>e.itemSort(t,r,n)))),V(l,(t=>{const n=_o(e.callbacks,t);r.push(Eo(n,"labelColor",this,t)),o.push(Eo(n,"labelPointStyle",this,t)),i.push(Eo(n,"labelTextColor",this,t))})),this.labelColors=r,this.labelPointStyles=o,this.labelTextColors=i,this.dataPoints=l,l}update(e,t){const n=this.options.setContext(this.getContext()),r=this._active;let o,i=[];if(r.length){const e=po[n.position].call(this,r,this._eventPosition);i=this._createItems(n),this.title=this.getTitle(i,n),this.beforeBody=this.getBeforeBody(i,n),this.body=this.getBody(i,n),this.afterBody=this.getAfterBody(i,n),this.footer=this.getFooter(i,n);const t=this._size=yo(this,n),a=Object.assign({},e,t),s=vo(this.chart,n,a),l=xo(n,a,s,this.chart);this.xAlign=s.xAlign,this.yAlign=s.yAlign,o={opacity:1,x:l.x,y:l.y,width:t.width,height:t.height,caretX:e.x,caretY:e.y}}else 0!==this.opacity&&(o={opacity:0});this._tooltipItems=i,this.$context=void 0,o&&this._resolveAnimations().update(this,o),e&&n.external&&n.external.call(this,{chart:this.chart,tooltip:this,replay:t})}drawCaret(e,t,n,r){const o=this.getCaretPosition(e,n,r);t.lineTo(o.x1,o.y1),t.lineTo(o.x2,o.y2),t.lineTo(o.x3,o.y3)}getCaretPosition(e,t,n){const{xAlign:r,yAlign:o}=this,{caretSize:i,cornerRadius:a}=n,{topLeft:s,topRight:l,bottomLeft:c,bottomRight:u}=kt(a),{x:d,y:h}=e,{width:p,height:f}=t;let m,g,y,b,v,x;return"center"===o?(v=h+f/2,"left"===r?(m=d,g=m-i,b=v+i,x=v-i):(m=d+p,g=m+i,b=v-i,x=v+i),y=m):(g="left"===r?d+Math.max(s,c)+i:"right"===r?d+p-Math.max(l,u)-i:this.caretX,"top"===o?(b=h,v=b-i,m=g-i,y=g+i):(b=h+f,v=b+i,m=g+i,y=g-i),x=b),{x1:m,x2:g,x3:y,y1:b,y2:v,y3:x}}drawTitle(e,t,n){const r=this.title,o=r.length;let i,a,s;if(o){const l=Zt(n.rtl,this.x,this.width);for(e.x=ko(this,n.titleAlign,n),t.textAlign=l.textAlign(n.titleAlign),t.textBaseline="middle",i=_t(n.titleFont),a=n.titleSpacing,t.fillStyle=n.titleColor,t.font=i.string,s=0;s<o;++s)t.fillText(r[s],l.x(e.x),e.y+i.lineHeight/2),e.y+=i.lineHeight+a,s+1===o&&(e.y+=n.titleMarginBottom-a)}}_drawColorBox(e,t,n,r,o){const i=this.labelColors[n],a=this.labelPointStyles[n],{boxHeight:s,boxWidth:l}=o,c=_t(o.bodyFont),u=ko(this,"left",o),d=r.x(u),h=s<c.lineHeight?(c.lineHeight-s)/2:0,p=t.y+h;if(o.usePointStyle){const t={radius:Math.min(l,s)/2,pointStyle:a.pointStyle,rotation:a.rotation,borderWidth:1},n=r.leftForLtr(d,l)+l/2,c=p+s/2;e.strokeStyle=o.multiKeyBackground,e.fillStyle=o.multiKeyBackground,at(e,t,n,c),e.strokeStyle=i.borderColor,e.fillStyle=i.backgroundColor,at(e,t,n,c)}else{e.lineWidth=F(i.borderWidth)?Math.max(...Object.values(i.borderWidth)):i.borderWidth||1,e.strokeStyle=i.borderColor,e.setLineDash(i.borderDash||[]),e.lineDashOffset=i.borderDashOffset||0;const t=r.leftForLtr(d,l),n=r.leftForLtr(r.xPlus(d,1),l-2),a=kt(i.borderRadius);Object.values(a).some((e=>0!==e))?(e.beginPath(),e.fillStyle=o.multiKeyBackground,ft(e,{x:t,y:p,w:l,h:s,radius:a}),e.fill(),e.stroke(),e.fillStyle=i.backgroundColor,e.beginPath(),ft(e,{x:n,y:p+1,w:l-2,h:s-2,radius:a}),e.fill()):(e.fillStyle=o.multiKeyBackground,e.fillRect(t,p,l,s),e.strokeRect(t,p,l,s),e.fillStyle=i.backgroundColor,e.fillRect(n,p+1,l-2,s-2))}e.fillStyle=this.labelTextColors[n]}drawBody(e,t,n){const{body:r}=this,{bodySpacing:o,bodyAlign:i,displayColors:a,boxHeight:s,boxWidth:l,boxPadding:c}=n,u=_t(n.bodyFont);let d=u.lineHeight,h=0;const p=Zt(n.rtl,this.x,this.width),f=function(n){t.fillText(n,p.x(e.x+h),e.y+d/2),e.y+=d+o},m=p.textAlign(i);let g,y,b,v,x,k,w;for(t.textAlign=i,t.textBaseline="middle",t.font=u.string,e.x=ko(this,m,n),t.fillStyle=n.bodyColor,V(this.beforeBody,f),h=a&&"right"!==m?"center"===i?l/2+c:l+2+c:0,v=0,k=r.length;v<k;++v){for(g=r[v],y=this.labelTextColors[v],t.fillStyle=y,V(g.before,f),b=g.lines,a&&b.length&&(this._drawColorBox(t,e,v,p,n),d=Math.max(u.lineHeight,s)),x=0,w=b.length;x<w;++x)f(b[x]),d=u.lineHeight;V(g.after,f)}h=0,d=u.lineHeight,V(this.afterBody,f),e.y-=o}drawFooter(e,t,n){const r=this.footer,o=r.length;let i,a;if(o){const s=Zt(n.rtl,this.x,this.width);for(e.x=ko(this,n.footerAlign,n),e.y+=n.footerMarginTop,t.textAlign=s.textAlign(n.footerAlign),t.textBaseline="middle",i=_t(n.footerFont),t.fillStyle=n.footerColor,t.font=i.string,a=0;a<o;++a)t.fillText(r[a],s.x(e.x),e.y+i.lineHeight/2),e.y+=i.lineHeight+n.footerSpacing}}drawBackground(e,t,n,r){const{xAlign:o,yAlign:i}=this,{x:a,y:s}=e,{width:l,height:c}=n,{topLeft:u,topRight:d,bottomLeft:h,bottomRight:p}=kt(r.cornerRadius);t.fillStyle=r.backgroundColor,t.strokeStyle=r.borderColor,t.lineWidth=r.borderWidth,t.beginPath(),t.moveTo(a+u,s),"top"===i&&this.drawCaret(e,t,n,r),t.lineTo(a+l-d,s),t.quadraticCurveTo(a+l,s,a+l,s+d),"center"===i&&"right"===o&&this.drawCaret(e,t,n,r),t.lineTo(a+l,s+c-p),t.quadraticCurveTo(a+l,s+c,a+l-p,s+c),"bottom"===i&&this.drawCaret(e,t,n,r),t.lineTo(a+h,s+c),t.quadraticCurveTo(a,s+c,a,s+c-h),"center"===i&&"left"===o&&this.drawCaret(e,t,n,r),t.lineTo(a,s+u),t.quadraticCurveTo(a,s,a+u,s),t.closePath(),t.fill(),r.borderWidth>0&&t.stroke()}_updateAnimationTarget(e){const t=this.chart,n=this.$animations,r=n&&n.x,o=n&&n.y;if(r||o){const n=po[e.position].call(this,this._active,this._eventPosition);if(!n)return;const i=this._size=yo(this,e),a=Object.assign({},n,this._size),s=vo(t,e,a),l=xo(e,a,s,t);r._to===l.x&&o._to===l.y||(this.xAlign=s.xAlign,this.yAlign=s.yAlign,this.width=i.width,this.height=i.height,this.caretX=n.x,this.caretY=n.y,this._resolveAnimations().update(this,l))}}_willRender(){return!!this.opacity}draw(e){const t=this.options.setContext(this.getContext());let n=this.opacity;if(!n)return;this._updateAnimationTarget(t);const r={width:this.width,height:this.height},o={x:this.x,y:this.y};n=Math.abs(n)<.001?0:n;const i=wt(t.padding),a=this.title.length||this.beforeBody.length||this.body.length||this.afterBody.length||this.footer.length;t.enabled&&a&&(e.save(),e.globalAlpha=n,this.drawBackground(o,e,r,t),Jt(e,t.textDirection),o.y+=i.top,this.drawTitle(o,e,t),this.drawBody(o,e,t),this.drawFooter(o,e,t),en(e,t.textDirection),e.restore())}getActiveElements(){return this._active||[]}setActiveElements(e,t){const n=this._active,r=e.map((({datasetIndex:e,index:t})=>{const n=this.chart.getDatasetMeta(e);if(!n)throw new Error("Cannot find a dataset at index "+e);return{datasetIndex:e,element:n.data[t],index:t}})),o=!K(n,r),i=this._positionChanged(r,t);(o||i)&&(this._active=r,this._eventPosition=t,this._ignoreReplayEvents=!0,this.update(!0))}handleEvent(e,t,n=!0){if(t&&this._ignoreReplayEvents)return!1;this._ignoreReplayEvents=!1;const r=this.options,o=this._active||[],i=this._getActiveElements(e,o,t,n),a=this._positionChanged(i,e),s=t||!K(i,o)||a;return s&&(this._active=i,(r.enabled||r.external)&&(this._eventPosition={x:e.x,y:e.y},this.update(!0,t))),s}_getActiveElements(e,t,n,r){const o=this.options;if("mouseout"===e.type)return[];if(!r)return t.filter((e=>this.chart.data.datasets[e.datasetIndex]&&void 0!==this.chart.getDatasetMeta(e.datasetIndex).controller.getParsed(e.index)));const i=this.chart.getElementsAtEventForMode(e,o.mode,o,n);return o.reverse&&i.reverse(),i}_positionChanged(e,t){const{caretX:n,caretY:r,options:o}=this,i=po[o.position].call(this,e,t);return!1!==i&&(n!==i.x||r!==i.y)}}var Ao={id:"tooltip",_element:Co,positioners:po,afterInit(e,t,n){n&&(e.tooltip=new Co({chart:e,options:n}))},beforeUpdate(e,t,n){e.tooltip&&e.tooltip.initialize(n)},reset(e,t,n){e.tooltip&&e.tooltip.initialize(n)},afterDraw(e){const t=e.tooltip;if(t&&t._willRender()){const n={tooltip:t};if(!1===e.notifyPlugins("beforeTooltipDraw",{...n,cancelable:!0}))return;t.draw(e.ctx),e.notifyPlugins("afterTooltipDraw",n)}},afterEvent(e,t){if(e.tooltip){const n=t.replay;e.tooltip.handleEvent(t.event,n,t.inChartArea)&&(t.changed=!0)}},defaults:{enabled:!0,external:null,position:"average",backgroundColor:"rgba(0,0,0,0.8)",titleColor:"#fff",titleFont:{weight:"bold"},titleSpacing:2,titleMarginBottom:6,titleAlign:"left",bodyColor:"#fff",bodySpacing:2,bodyFont:{},bodyAlign:"left",footerColor:"#fff",footerSpacing:2,footerMarginTop:6,footerFont:{weight:"bold"},footerAlign:"left",padding:6,caretPadding:2,caretSize:5,cornerRadius:6,boxHeight:(e,t)=>t.bodyFont.size,boxWidth:(e,t)=>t.bodyFont.size,multiKeyBackground:"#fff",displayColors:!0,boxPadding:0,borderColor:"rgba(0,0,0,0)",borderWidth:0,animation:{duration:400,easing:"easeOutQuart"},animations:{numbers:{type:"number",properties:["x","y","width","height","caretX","caretY"]},opacity:{easing:"linear",duration:200}},callbacks:So},defaultRoutes:{bodyFont:"font",footerFont:"font",titleFont:"font"},descriptors:{_scriptable:e=>"filter"!==e&&"itemSort"!==e&&"external"!==e,_indexable:!1,callbacks:{_scriptable:!1,_indexable:!1},animation:{_fallback:!1},animations:{_fallback:"animation"}},additionalOptionScopes:["interaction"]};function Oo(e,t,n,r){const o=e.indexOf(t);if(-1===o)return((e,t,n,r)=>("string"==typeof t?(n=e.push(t)-1,r.unshift({index:n,label:t})):isNaN(t)&&(n=null),n))(e,t,n,r);return o!==e.lastIndexOf(t)?n:o}function Mo(e){const t=this.getLabels();return e>=0&&e<t.length?t[e]:e}class Ro extends wr{static id="category";static defaults={ticks:{callback:Mo}};constructor(e){super(e),this._startValue=void 0,this._valueRange=0,this._addedLabels=[]}init(e){const t=this._addedLabels;if(t.length){const e=this.getLabels();for(const{index:n,label:r}of t)e[n]===r&&e.splice(n,1);this._addedLabels=[]}super.init(e)}parse(e,t){if(L(e))return null;const n=this.getLabels();return((e,t)=>null===e?null:Ce(Math.round(e),0,t))(t=isFinite(t)&&n[t]===e?t:Oo(n,e,H(t,e),this._addedLabels),n.length-1)}determineDataLimits(){const{minDefined:e,maxDefined:t}=this.getUserBounds();let{min:n,max:r}=this.getMinMax(!0);"ticks"===this.options.bounds&&(e||(n=0),t||(r=this.getLabels().length-1)),this.min=n,this.max=r}buildTicks(){const e=this.min,t=this.max,n=this.options.offset,r=[];let o=this.getLabels();o=0===e&&t===o.length-1?o:o.slice(e,t+1),this._valueRange=Math.max(o.length-(n?0:1),1),this._startValue=this.min-(n?.5:0);for(let n=e;n<=t;n++)r.push({value:n});return r}getLabelForValue(e){return Mo.call(this,e)}configure(){super.configure(),this.isHorizontal()||(this._reversePixels=!this._reversePixels)}getPixelForValue(e){return"number"!=typeof e&&(e=this.parse(e)),null===e?NaN:this.getPixelForDecimal((e-this._startValue)/this._valueRange)}getPixelForTick(e){const t=this.ticks;return e<0||e>t.length-1?null:this.getPixelForValue(t[e].value)}getValueForPixel(e){return Math.round(this._startValue+this.getDecimalForPixel(e)*this._valueRange)}getBasePixel(){return this.bottom}}function Po(e,t){const n=[],{bounds:r,step:o,min:i,max:a,precision:s,count:l,maxTicks:c,maxDigits:u,includeBounds:d}=e,h=o||1,p=c-1,{min:f,max:m}=t,g=!L(i),y=!L(a),b=!L(l),v=(m-f)/(u+1);let x,k,w,_,S=ge((m-f)/p/h)*h;if(S<1e-14&&!g&&!y)return[{value:f},{value:m}];_=Math.ceil(m/S)-Math.floor(f/S),_>p&&(S=ge(_*S/p/h)*h),L(s)||(x=Math.pow(10,s),S=Math.ceil(S*x)/x),"ticks"===r?(k=Math.floor(f/S)*S,w=Math.ceil(m/S)*S):(k=f,w=m),g&&y&&o&&function(e,t){const n=Math.round(e);return n-t<=e&&n+t>=e}((a-i)/o,S/1e3)?(_=Math.round(Math.min((a-i)/S,c)),S=(a-i)/_,k=i,w=a):b?(k=g?i:k,w=y?a:w,_=l-1,S=(w-k)/_):(_=(w-k)/S,_=me(_,Math.round(_),S/1e3)?Math.round(_):Math.ceil(_));const E=Math.max(ke(S),ke(k));x=Math.pow(10,L(s)?E:s),k=Math.round(k*x)/x,w=Math.round(w*x)/x;let C=0;for(g&&(d&&k!==i?(n.push({value:i}),k<i&&C++,me(Math.round((k+C*S)*x)/x,i,To(i,v,e))&&C++):k<i&&C++);C<_;++C){const e=Math.round((k+C*S)*x)/x;if(y&&e>a)break;n.push({value:e})}return y&&d&&w!==a?n.length&&me(n[n.length-1].value,a,To(a,v,e))?n[n.length-1].value=a:n.push({value:a}):y&&w!==a||n.push({value:w}),n}function To(e,t,{horizontal:n,minRotation:r}){const o=ve(r),i=(n?Math.sin(o):Math.cos(o))||.001,a=.75*t*(""+e).length;return Math.min(t/i,a)}class zo extends wr{constructor(e){super(e),this.start=void 0,this.end=void 0,this._startValue=void 0,this._endValue=void 0,this._valueRange=0}parse(e,t){return L(e)||("number"==typeof e||e instanceof Number)&&!isFinite(+e)?null:+e}handleTickRangeOptions(){const{beginAtZero:e}=this.options,{minDefined:t,maxDefined:n}=this.getUserBounds();let{min:r,max:o}=this;const i=e=>r=t?r:e,a=e=>o=n?o:e;if(e){const e=fe(r),t=fe(o);e<0&&t<0?a(0):e>0&&t>0&&i(0)}if(r===o){let t=0===o?1:Math.abs(.05*o);a(o+t),e||i(r-t)}this.min=r,this.max=o}getTickLimit(){const e=this.options.ticks;let t,{maxTicksLimit:n,stepSize:r}=e;return r?(t=Math.ceil(this.max/r)-Math.floor(this.min/r)+1,t>1e3&&(console.warn(`scales.${this.id}.ticks.stepSize: ${r} would result generating up to ${t} ticks. Limiting to 1000.`),t=1e3)):(t=this.computeTickLimit(),n=n||11),n&&(t=Math.min(n,t)),t}computeTickLimit(){return Number.POSITIVE_INFINITY}buildTicks(){const e=this.options,t=e.ticks;let n=this.getTickLimit();n=Math.max(2,n);const r=Po({maxTicks:n,bounds:e.bounds,min:e.min,max:e.max,precision:t.precision,step:t.stepSize,count:t.count,maxDigits:this._maxDigits(),horizontal:this.isHorizontal(),minRotation:t.minRotation||0,includeBounds:!1!==t.includeBounds},this._range||this);return"ticks"===e.bounds&&be(r,this,"value"),e.reverse?(r.reverse(),this.start=this.max,this.end=this.min):(this.start=this.min,this.end=this.max),r}configure(){const e=this.ticks;let t=this.min,n=this.max;if(super.configure(),this.options.offset&&e.length){const r=(n-t)/Math.max(e.length-1,1)/2;t-=r,n+=r}this._startValue=t,this._endValue=n,this._valueRange=n-t}getLabelForValue(e){return Qe(e,this.chart.options.locale,this.options.ticks.format)}}class jo extends zo{static id="linear";static defaults={ticks:{callback:Ge.formatters.numeric}};determineDataLimits(){const{min:e,max:t}=this.getMinMax(!0);this.min=B(e)?e:0,this.max=B(t)?t:1,this.handleTickRangeOptions()}computeTickLimit(){const e=this.isHorizontal(),t=e?this.width:this.height,n=ve(this.options.ticks.minRotation),r=(e?Math.sin(n):Math.cos(n))||.001,o=this._resolveTickFontOptions(0);return Math.ceil(t/Math.min(40,o.lineHeight/r))}getPixelForValue(e){return null===e?NaN:this.getPixelForDecimal((e-this._startValue)/this._valueRange)}getValueForPixel(e){return this._startValue+this.getDecimalForPixel(e)*this._valueRange}}Ge.formatters.logarithmic;Ge.formatters.numeric},6841:(e,t,n)=>{"use strict";n.d(t,{Ay:()=>Ge,cx:()=>Ye});var r=n(1594);function o(){return o=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},o.apply(this,arguments)}const i=["children","options"],a={blockQuote:"0",breakLine:"1",breakThematic:"2",codeBlock:"3",codeFenced:"4",codeInline:"5",footnote:"6",footnoteReference:"7",gfmTask:"8",heading:"9",headingSetext:"10",htmlBlock:"11",htmlComment:"12",htmlSelfClosing:"13",image:"14",link:"15",linkAngleBraceStyleDetector:"16",linkBareUrlDetector:"17",linkMailtoDetector:"18",newlineCoalescer:"19",orderedList:"20",paragraph:"21",ref:"22",refImage:"23",refLink:"24",table:"25",tableSeparator:"26",text:"27",textBolded:"28",textEmphasized:"29",textEscaped:"30",textMarked:"31",textStrikethroughed:"32",unorderedList:"33"};var s;!function(e){e[e.MAX=0]="MAX",e[e.HIGH=1]="HIGH",e[e.MED=2]="MED",e[e.LOW=3]="LOW",e[e.MIN=4]="MIN"}(s||(s={}));const l=["allowFullScreen","allowTransparency","autoComplete","autoFocus","autoPlay","cellPadding","cellSpacing","charSet","className","classId","colSpan","contentEditable","contextMenu","crossOrigin","encType","formAction","formEncType","formMethod","formNoValidate","formTarget","frameBorder","hrefLang","inputMode","keyParams","keyType","marginHeight","marginWidth","maxLength","mediaGroup","minLength","noValidate","radioGroup","readOnly","rowSpan","spellCheck","srcDoc","srcLang","srcSet","tabIndex","useMap"].reduce(((e,t)=>(e[t.toLowerCase()]=t,e)),{for:"htmlFor"}),c={amp:"&",apos:"'",gt:">",lt:"<",nbsp:" ",quot:"“"},u=["style","script"],d=/([-A-Z0-9_:]+)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|(?:\{((?:\\.|{[^}]*?}|[^}])*)\})))?/gi,h=/mailto:/i,p=/\n{2,}$/,f=/^(\s*>[\s\S]*?)(?=\n{2,})/,m=/^ *> ?/gm,g=/^ {2,}\n/,y=/^(?:( *[-*_])){3,} *(?:\n *)+\n/,b=/^\s*(`{3,}|~{3,}) *(\S+)?([^\n]*?)?\n([\s\S]+?)\s*\1 *(?:\n *)*\n?/,v=/^(?: {4}[^\n]+\n*)+(?:\n *)+\n?/,x=/^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,k=/^(?:\n *)*\n/,w=/\r\n?/g,_=/^\[\^([^\]]+)](:(.*)((\n+ {4,}.*)|(\n(?!\[\^).+))*)/,S=/^\[\^([^\]]+)]/,E=/\f/g,C=/^---[ \t]*\n(.|\n)*\n---[ \t]*\n/,A=/^\s*?\[(x|\s)\]/,O=/^ *(#{1,6}) *([^\n]+?)(?: +#*)?(?:\n *)*(?:\n|$)/,M=/^ *(#{1,6}) +([^\n]+?)(?: +#*)?(?:\n *)*(?:\n|$)/,R=/^([^\n]+)\n *(=|-){3,} *(?:\n *)+\n/,P=/^ *(?!<[a-z][^ >/]* ?\/>)<([a-z][^ >/]*) ?((?:[^>]*[^/])?)>\n?(\s*(?:<\1[^>]*?>[\s\S]*?<\/\1>|(?!<\1\b)[\s\S])*?)<\/\1>(?!<\/\1>)\n*/i,T=/&([a-z0-9]+|#[0-9]{1,6}|#x[0-9a-fA-F]{1,6});/gi,z=/^<!--[\s\S]*?(?:-->)/,j=/^(data|aria|x)-[a-z_][a-z\d_.-]*$/,I=/^ *<([a-z][a-z0-9:]*)(?:\s+((?:<.*?>|[^>])*))?\/?>(?!<\/\1>)(\s*\n)?/i,N=/^\{.*\}$/,$=/^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,L=/^<([^ >]+@[^ >]+)>/,D=/^<([^ >]+:\/[^ >]+)>/,F=/-([a-z])?/gi,B=/^(.*\|.*)\n(?: *(\|? *[-:]+ *\|[-| :]*)\n((?:.*\|.*\n)*))?\n?/,W=/^\[([^\]]*)\]:\s+<?([^\s>]+)>?\s*("([^"]*)")?/,H=/^!\[([^\]]*)\] ?\[([^\]]*)\]/,q=/^\[([^\]]*)\] ?\[([^\]]*)\]/,U=/(\[|\])/g,V=/(\n|^[-*]\s|^#|^ {2,}|^-{2,}|^>\s)/,K=/\t/g,Q=/(^ *\||\| *$)/g,Y=/^ *:-+: *$/,G=/^ *:-+ *$/,X=/^ *-+: *$/,Z="((?:\\[.*?\\][([].*?[)\\]]|<.*?>(?:.*?<.*?>)?|`.*?`|~~.*?~~|==.*?==|.|\\n)*?)",J=new RegExp(`^([*_])\\1${Z}\\1\\1(?!\\1)`),ee=new RegExp(`^([*_])${Z}\\1(?!\\1|\\w)`),te=new RegExp(`^==${Z}==`),ne=new RegExp(`^~~${Z}~~`),re=/^\\([^0-9A-Za-z\s])/,oe=/^[\s\S]+?(?=[^0-9A-Z\s\u00c0-\uffff&#;.()'"]|\d+\.|\n\n| {2,}\n|\w+:\S|$)/i,ie=/^\n+/,ae=/^([ \t]*)/,se=/\\([^\\])/g,le=/ *\n+$/,ce=/(?:^|\n)( *)$/,ue="(?:\\d+\\.)",de="(?:[*+-])";function he(e){return"( *)("+(1===e?ue:de)+") +"}const pe=he(1),fe=he(2);function me(e){return new RegExp("^"+(1===e?pe:fe))}const ge=me(1),ye=me(2);function be(e){return new RegExp("^"+(1===e?pe:fe)+"[^\\n]*(?:\\n(?!\\1"+(1===e?ue:de)+" )[^\\n]*)*(\\n|$)","gm")}const ve=be(1),xe=be(2);function ke(e){const t=1===e?ue:de;return new RegExp("^( *)("+t+") [\\s\\S]+?(?:\\n{2,}(?! )(?!\\1"+t+" (?!"+t+" ))\\n*|\\s*\\n*$)")}const we=ke(1),_e=ke(2);function Se(e,t){const n=1===t,r=n?we:_e,o=n?ve:xe,i=n?ge:ye;return{match(e,t,n){const o=ce.exec(n);return o&&(t.list||!t.inline&&!t.simple)?r.exec(e=o[1]+e):null},order:1,parse(e,t,r){const a=n?+e[2]:void 0,s=e[0].replace(p,"\n").match(o);let l=!1;return{items:s.map((function(e,n){const o=i.exec(e)[0].length,a=new RegExp("^ {1,"+o+"}","gm"),c=e.replace(a,"").replace(i,""),u=n===s.length-1,d=-1!==c.indexOf("\n\n")||u&&l;l=d;const h=r.inline,p=r.list;let f;r.list=!0,d?(r.inline=!1,f=c.replace(le,"\n\n")):(r.inline=!0,f=c.replace(le,""));const m=t(f,r);return r.inline=h,r.list=p,m})),ordered:n,start:a}},render:(t,n,r)=>e(t.ordered?"ol":"ul",{key:r.key,start:t.type===a.orderedList?t.start:void 0},t.items.map((function(t,o){return e("li",{key:o},n(t,r))})))}}const Ee=new RegExp("^\\[((?:\\[[^\\]]*\\]|[^\\[\\]]|\\](?=[^\\[]*\\]))*)\\]\\(\\s*<?((?:\\([^)]*\\)|[^\\s\\\\]|\\\\.)*?)>?(?:\\s+['\"]([\\s\\S]*?)['\"])?\\s*\\)"),Ce=/^!\[(.*?)\]\( *((?:\([^)]*\)|[^() ])*) *"?([^)"]*)?"?\)/,Ae=[f,b,v,O,R,M,z,B,ve,we,xe,_e],Oe=[...Ae,/^[^\n]+(?:  \n|\n{2,})/,P,I];function Me(e){return e.replace(/[ÀÁÂÃÄÅàáâãäåæÆ]/g,"a").replace(/[çÇ]/g,"c").replace(/[ðÐ]/g,"d").replace(/[ÈÉÊËéèêë]/g,"e").replace(/[ÏïÎîÍíÌì]/g,"i").replace(/[Ññ]/g,"n").replace(/[øØœŒÕõÔôÓóÒò]/g,"o").replace(/[ÜüÛûÚúÙù]/g,"u").replace(/[ŸÿÝý]/g,"y").replace(/[^a-z0-9- ]/gi,"").replace(/ /gi,"-").toLowerCase()}function Re(e){return X.test(e)?"right":Y.test(e)?"center":G.test(e)?"left":null}function Pe(e,t,n,r){const o=n.inTable;n.inTable=!0;let i=e.trim().split(/( *(?:`[^`]*`|<.*?>.*?<\/.*?>(?!<\/.*?>)|\\\||\|) *)/).reduce(((e,o)=>("|"===o.trim()?e.push(r?{type:a.tableSeparator}:{type:a.text,text:o}):""!==o&&e.push.apply(e,t(o,n)),e)),[]);n.inTable=o;let s=[[]];return i.forEach((function(e,t){e.type===a.tableSeparator?0!==t&&t!==i.length-1&&s.push([]):(e.type!==a.text||null!=i[t+1]&&i[t+1].type!==a.tableSeparator||(e.text=e.text.trimEnd()),s[s.length-1].push(e))})),s}function Te(e,t,n){n.inline=!0;const r=e[2]?e[2].replace(Q,"").split("|").map(Re):[],o=e[3]?function(e,t,n){return e.trim().split("\n").map((function(e){return Pe(e,t,n,!0)}))}(e[3],t,n):[],i=Pe(e[1],t,n,!!o.length);return n.inline=!1,o.length?{align:r,cells:o,header:i,type:a.table}:{children:i,type:a.paragraph}}function ze(e,t){return null==e.align[t]?{}:{textAlign:e.align[t]}}function je(e){return function(t,n){return n.inline?e.exec(t):null}}function Ie(e){return function(t,n){return n.inline||n.simple?e.exec(t):null}}function Ne(e){return function(t,n){return n.inline||n.simple?null:e.exec(t)}}function $e(e){return function(t){return e.exec(t)}}function Le(e,t,n){if(t.inline||t.simple)return null;if(n&&!n.endsWith("\n"))return null;let r="";e.split("\n").every((e=>!Ae.some((t=>t.test(e)))&&(r+=e+"\n",e.trim())));const o=r.trimEnd();return""==o?null:[r,o]}function De(e){try{if(decodeURIComponent(e).replace(/[^A-Za-z0-9/:]/g,"").match(/^\s*(javascript|vbscript|data(?!:image)):/i))return null}catch(e){return null}return e}function Fe(e){return e.replace(se,"$1")}function Be(e,t,n){const r=n.inline||!1,o=n.simple||!1;n.inline=!0,n.simple=!0;const i=e(t,n);return n.inline=r,n.simple=o,i}function We(e,t,n){const r=n.inline||!1,o=n.simple||!1;n.inline=!1,n.simple=!0;const i=e(t,n);return n.inline=r,n.simple=o,i}function He(e,t,n){const r=n.inline||!1;n.inline=!1;const o=e(t,n);return n.inline=r,o}const qe=(e,t,n)=>({children:Be(t,e[1],n)});function Ue(){return{}}function Ve(){return null}function Ke(...e){return e.filter(Boolean).join(" ")}function Qe(e,t,n){let r=e;const o=t.split(".");for(;o.length&&(r=r[o[0]],void 0!==r);)o.shift();return r||n}function Ye(e="",t={}){function n(e,n,...r){const i=Qe(t.overrides,`${e}.props`,{});return t.createElement(function(e,t){const n=Qe(t,e);return n?"function"==typeof n||"object"==typeof n&&"render"in n?n:Qe(t,`${e}.component`,e):e}(e,t.overrides),o({},n,i,{className:Ke(null==n?void 0:n.className,i.className)||void 0}),...r)}function i(e){e=e.replace(C,"");let o=!1;t.forceInline?o=!0:t.forceBlock||(o=!1===V.test(e));const i=X(G(o?e:`${e.trimEnd().replace(ie,"")}\n\n`,{inline:o}));for(;"string"==typeof i[i.length-1]&&!i[i.length-1].trim();)i.pop();if(null===t.wrapper)return i;const a=t.wrapper||(o?"span":"div");let s;if(i.length>1||t.forceWrapper)s=i;else{if(1===i.length)return s=i[0],"string"==typeof s?n("span",{key:"outer"},s):s;s=null}return r.createElement(a,{key:"outer"},s)}function s(e,n){const o=n.match(d);return o?o.reduce((function(n,o,a){const s=o.indexOf("=");if(-1!==s){const c=function(e){return-1!==e.indexOf("-")&&null===e.match(j)&&(e=e.replace(F,(function(e,t){return t.toUpperCase()}))),e}(o.slice(0,s)).trim(),u=function(e){const t=e[0];return('"'===t||"'"===t)&&e.length>=2&&e[e.length-1]===t?e.slice(1,-1):e}(o.slice(s+1).trim()),d=l[c]||c,h=n[d]=function(e,t,n,r){return"style"===t?n.split(/;\s?/).reduce((function(e,t){const n=t.slice(0,t.indexOf(":"));return e[n.trim().replace(/(-[a-z])/g,(e=>e[1].toUpperCase()))]=t.slice(n.length+1).trim(),e}),{}):"href"===t||"src"===t?r(n,e,t):(n.match(N)&&(n=n.slice(1,n.length-1)),"true"===n||"false"!==n&&n)}(e,c,u,t.sanitizer);"string"==typeof h&&(P.test(h)||I.test(h))&&(n[d]=r.cloneElement(i(h.trim()),{key:a}))}else"style"!==o&&(n[l[o]||o]=!0);return n}),{}):null}t.overrides=t.overrides||{},t.sanitizer=t.sanitizer||De,t.slugify=t.slugify||Me,t.namedCodesToUnicode=t.namedCodesToUnicode?o({},c,t.namedCodesToUnicode):c,t.createElement=t.createElement||r.createElement;const p=[],Q={},Y={[a.blockQuote]:{match:Ne(f),order:1,parse:(e,t,n)=>({children:t(e[0].replace(m,""),n)}),render:(e,t,r)=>n("blockquote",{key:r.key},t(e.children,r))},[a.breakLine]:{match:$e(g),order:1,parse:Ue,render:(e,t,r)=>n("br",{key:r.key})},[a.breakThematic]:{match:Ne(y),order:1,parse:Ue,render:(e,t,r)=>n("hr",{key:r.key})},[a.codeBlock]:{match:Ne(v),order:0,parse:e=>({lang:void 0,text:e[0].replace(/^ {4}/gm,"").replace(/\n+$/,"")}),render:(e,t,r)=>n("pre",{key:r.key},n("code",o({},e.attrs,{className:e.lang?`lang-${e.lang}`:""}),e.text))},[a.codeFenced]:{match:Ne(b),order:0,parse:e=>({attrs:s("code",e[3]||""),lang:e[2]||void 0,text:e[4],type:a.codeBlock})},[a.codeInline]:{match:Ie(x),order:3,parse:e=>({text:e[2]}),render:(e,t,r)=>n("code",{key:r.key},e.text)},[a.footnote]:{match:Ne(_),order:0,parse:e=>(p.push({footnote:e[2],identifier:e[1]}),{}),render:Ve},[a.footnoteReference]:{match:je(S),order:1,parse:e=>({target:`#${t.slugify(e[1],Me)}`,text:e[1]}),render:(e,r,o)=>n("a",{key:o.key,href:t.sanitizer(e.target,"a","href")},n("sup",{key:o.key},e.text))},[a.gfmTask]:{match:je(A),order:1,parse:e=>({completed:"x"===e[1].toLowerCase()}),render:(e,t,r)=>n("input",{checked:e.completed,key:r.key,readOnly:!0,type:"checkbox"})},[a.heading]:{match:Ne(t.enforceAtxHeadings?M:O),order:1,parse:(e,n,r)=>({children:Be(n,e[2],r),id:t.slugify(e[2],Me),level:e[1].length}),render:(e,t,r)=>n(`h${e.level}`,{id:e.id,key:r.key},t(e.children,r))},[a.headingSetext]:{match:Ne(R),order:0,parse:(e,t,n)=>({children:Be(t,e[1],n),level:"="===e[2]?1:2,type:a.heading})},[a.htmlBlock]:{match:$e(P),order:1,parse(e,t,n){const[,r]=e[3].match(ae),o=new RegExp(`^${r}`,"gm"),i=e[3].replace(o,""),a=(l=i,Oe.some((e=>e.test(l)))?He:Be);var l;const c=e[1].toLowerCase(),d=-1!==u.indexOf(c),h=(d?c:e[1]).trim(),p={attrs:s(h,e[2]),noInnerParse:d,tag:h};return n.inAnchor=n.inAnchor||"a"===c,d?p.text=e[3]:p.children=a(t,i,n),n.inAnchor=!1,p},render:(e,t,r)=>n(e.tag,o({key:r.key},e.attrs),e.text||t(e.children,r))},[a.htmlSelfClosing]:{match:$e(I),order:1,parse(e){const t=e[1].trim();return{attrs:s(t,e[2]||""),tag:t}},render:(e,t,r)=>n(e.tag,o({},e.attrs,{key:r.key}))},[a.htmlComment]:{match:$e(z),order:1,parse:()=>({}),render:Ve},[a.image]:{match:Ie(Ce),order:1,parse:e=>({alt:e[1],target:Fe(e[2]),title:e[3]}),render:(e,r,o)=>n("img",{key:o.key,alt:e.alt||void 0,title:e.title||void 0,src:t.sanitizer(e.target,"img","src")})},[a.link]:{match:je(Ee),order:3,parse:(e,t,n)=>({children:We(t,e[1],n),target:Fe(e[2]),title:e[3]}),render:(e,r,o)=>n("a",{key:o.key,href:t.sanitizer(e.target,"a","href"),title:e.title},r(e.children,o))},[a.linkAngleBraceStyleDetector]:{match:je(D),order:0,parse:e=>({children:[{text:e[1],type:a.text}],target:e[1],type:a.link})},[a.linkBareUrlDetector]:{match:(e,t)=>t.inAnchor?null:je($)(e,t),order:0,parse:e=>({children:[{text:e[1],type:a.text}],target:e[1],title:void 0,type:a.link})},[a.linkMailtoDetector]:{match:je(L),order:0,parse(e){let t=e[1],n=e[1];return h.test(n)||(n="mailto:"+n),{children:[{text:t.replace("mailto:",""),type:a.text}],target:n,type:a.link}}},[a.orderedList]:Se(n,1),[a.unorderedList]:Se(n,2),[a.newlineCoalescer]:{match:Ne(k),order:3,parse:Ue,render:()=>"\n"},[a.paragraph]:{match:Le,order:3,parse:qe,render:(e,t,r)=>n("p",{key:r.key},t(e.children,r))},[a.ref]:{match:je(W),order:0,parse:e=>(Q[e[1]]={target:e[2],title:e[4]},{}),render:Ve},[a.refImage]:{match:Ie(H),order:0,parse:e=>({alt:e[1]||void 0,ref:e[2]}),render:(e,r,o)=>Q[e.ref]?n("img",{key:o.key,alt:e.alt,src:t.sanitizer(Q[e.ref].target,"img","src"),title:Q[e.ref].title}):null},[a.refLink]:{match:je(q),order:0,parse:(e,t,n)=>({children:t(e[1],n),fallbackChildren:t(e[0].replace(U,"\\$1"),n),ref:e[2]}),render:(e,r,o)=>Q[e.ref]?n("a",{key:o.key,href:t.sanitizer(Q[e.ref].target,"a","href"),title:Q[e.ref].title},r(e.children,o)):n("span",{key:o.key},r(e.fallbackChildren,o))},[a.table]:{match:Ne(B),order:1,parse:Te,render(e,t,r){const o=e;return n("table",{key:r.key},n("thead",null,n("tr",null,o.header.map((function(e,i){return n("th",{key:i,style:ze(o,i)},t(e,r))})))),n("tbody",null,o.cells.map((function(e,i){return n("tr",{key:i},e.map((function(e,i){return n("td",{key:i,style:ze(o,i)},t(e,r))})))}))))}},[a.text]:{match:$e(oe),order:4,parse:e=>({text:e[0].replace(T,((e,n)=>t.namedCodesToUnicode[n]?t.namedCodesToUnicode[n]:e))}),render:e=>e.text},[a.textBolded]:{match:Ie(J),order:2,parse:(e,t,n)=>({children:t(e[2],n)}),render:(e,t,r)=>n("strong",{key:r.key},t(e.children,r))},[a.textEmphasized]:{match:Ie(ee),order:3,parse:(e,t,n)=>({children:t(e[2],n)}),render:(e,t,r)=>n("em",{key:r.key},t(e.children,r))},[a.textEscaped]:{match:Ie(re),order:1,parse:e=>({text:e[1],type:a.text})},[a.textMarked]:{match:Ie(te),order:3,parse:qe,render:(e,t,r)=>n("mark",{key:r.key},t(e.children,r))},[a.textStrikethroughed]:{match:Ie(ne),order:3,parse:qe,render:(e,t,r)=>n("del",{key:r.key},t(e.children,r))}};!0===t.disableParsingRawHTML&&(delete Y[a.htmlBlock],delete Y[a.htmlSelfClosing]);const G=function(e){let t=Object.keys(e);function n(r,o){let i=[],a="";for(;r;){let s=0;for(;s<t.length;){const l=t[s],c=e[l],u=c.match(r,o,a);if(u){const e=u[0];r=r.substring(e.length);const t=c.parse(u,n,o);null==t.type&&(t.type=l),i.push(t),a=e;break}s++}}return i}return t.sort((function(t,n){let r=e[t].order,o=e[n].order;return r!==o?r-o:t<n?-1:1})),function(e,t){return n(function(e){return e.replace(w,"\n").replace(E,"").replace(K,"    ")}(e),t)}}(Y),X=(Z=function(e,t){return function(n,r,o){const i=e[n.type].render;return t?t((()=>i(n,r,o)),n,r,o):i(n,r,o)}}(Y,t.renderRule),function e(t,n={}){if(Array.isArray(t)){const r=n.key,o=[];let i=!1;for(let r=0;r<t.length;r++){n.key=r;const a=e(t[r],n),s="string"==typeof a;s&&i?o[o.length-1]+=a:null!==a&&o.push(a),i=s}return n.key=r,o}return Z(t,e,n)});var Z;const se=i(e);return p.length?n("div",null,se,n("footer",{key:"footer"},p.map((function(e){return n("div",{id:t.slugify(e.identifier,Me),key:e.identifier},e.identifier,X(G(e.footnote,{inline:!0})))})))):se}const Ge=e=>{let{children:t="",options:n}=e,o=function(e,t){if(null==e)return{};var n,r,o={},i=Object.keys(e);for(r=0;r<i.length;r++)t.indexOf(n=i[r])>=0||(o[n]=e[n]);return o}(e,i);return r.cloneElement(Ye(t,n),o)}},4731:(e,t,n)=>{"use strict";n.d(t,{yP:()=>p});var r=n(1594),o=n(2262);const i="label";function a(e,t){"function"==typeof e?e(t):e&&(e.current=t)}function s(e,t){e.labels=t}function l(e,t){let n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:i;const r=[];e.datasets=t.map((t=>{const o=e.datasets.find((e=>e[n]===t[n]));return o&&t.data&&!r.includes(o)?(r.push(o),Object.assign(o,t),o):{...t}}))}function c(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:i;const n={labels:[],datasets:[]};return s(n,e.labels),l(n,e.datasets,t),n}function u(e,t){const{height:n=150,width:i=300,redraw:u=!1,datasetIdKey:d,type:h,data:p,options:f,plugins:m=[],fallbackContent:g,updateMode:y,...b}=e,v=(0,r.useRef)(null),x=(0,r.useRef)(),k=()=>{v.current&&(x.current=new o.t1(v.current,{type:h,data:c(p,d),options:f&&{...f},plugins:m}),a(t,x.current))},w=()=>{a(t,null),x.current&&(x.current.destroy(),x.current=null)};return(0,r.useEffect)((()=>{!u&&x.current&&f&&function(e,t){const n=e.options;n&&t&&Object.assign(n,t)}(x.current,f)}),[u,f]),(0,r.useEffect)((()=>{!u&&x.current&&s(x.current.config.data,p.labels)}),[u,p.labels]),(0,r.useEffect)((()=>{!u&&x.current&&p.datasets&&l(x.current.config.data,p.datasets,d)}),[u,p.datasets]),(0,r.useEffect)((()=>{x.current&&(u?(w(),setTimeout(k)):x.current.update(y))}),[u,f,p.labels,p.datasets,y]),(0,r.useEffect)((()=>{x.current&&(w(),setTimeout(k))}),[h]),(0,r.useEffect)((()=>(k(),()=>w())),[]),r.createElement("canvas",Object.assign({ref:v,role:"img",height:n,width:i},b),g)}const d=(0,r.forwardRef)(u);function h(e,t){return o.t1.register(t),(0,r.forwardRef)(((t,n)=>r.createElement(d,Object.assign({},t,{ref:n,type:e}))))}const p=h("bar",o.A6)}}]);