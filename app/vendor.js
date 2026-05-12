(self.wpJsonMwai=self.wpJsonMwai||[]).push([[121],{2096(e,t,n){"use strict";n.d(t,{A:()=>oe});var r=function(){function e(e){var t=this;this._insertTag=function(e){var n;n=0===t.tags.length?t.insertionPoint?t.insertionPoint.nextSibling:t.prepend?t.container.firstChild:t.before:t.tags[t.tags.length-1].nextSibling,t.container.insertBefore(e,n),t.tags.push(e)},this.isSpeedy=void 0===e.speedy||e.speedy,this.tags=[],this.ctr=0,this.nonce=e.nonce,this.key=e.key,this.container=e.container,this.prepend=e.prepend,this.insertionPoint=e.insertionPoint,this.before=null}var t=e.prototype;return t.hydrate=function(e){e.forEach(this._insertTag)},t.insert=function(e){this.ctr%(this.isSpeedy?65e3:1)==0&&this._insertTag(function(e){var t=document.createElement("style");return t.setAttribute("data-emotion",e.key),void 0!==e.nonce&&t.setAttribute("nonce",e.nonce),t.appendChild(document.createTextNode("")),t.setAttribute("data-s",""),t}(this));var t=this.tags[this.tags.length-1];if(this.isSpeedy){var n=function(e){if(e.sheet)return e.sheet;for(var t=0;t<document.styleSheets.length;t++)if(document.styleSheets[t].ownerNode===e)return document.styleSheets[t]}(t);try{n.insertRule(e,n.cssRules.length)}catch(e){}}else t.appendChild(document.createTextNode(e));this.ctr++},t.flush=function(){this.tags.forEach((function(e){var t;return null==(t=e.parentNode)?void 0:t.removeChild(e)})),this.tags=[],this.ctr=0},e}(),o=Math.abs,a=String.fromCharCode,i=Object.assign;function s(e){return e.trim()}function l(e,t,n){return e.replace(t,n)}function c(e,t){return e.indexOf(t)}function u(e,t){return 0|e.charCodeAt(t)}function d(e,t,n){return e.slice(t,n)}function p(e){return e.length}function h(e){return e.length}function f(e,t){return t.push(e),e}var m=1,g=1,y=0,b=0,v=0,k="";function x(e,t,n,r,o,a,i){return{value:e,root:t,parent:n,type:r,props:o,children:a,line:m,column:g,length:i,return:""}}function w(e,t){return i(x("",null,null,"",null,null,0),e,{length:-e.length},t)}function C(){return v=b>0?u(k,--b):0,g--,10===v&&(g=1,m--),v}function E(){return v=b<y?u(k,b++):0,g++,10===v&&(g=1,m++),v}function A(){return u(k,b)}function S(){return b}function O(e,t){return d(k,e,t)}function M(e){switch(e){case 0:case 9:case 10:case 13:case 32:return 5;case 33:case 43:case 44:case 47:case 62:case 64:case 126:case 59:case 123:case 125:return 4;case 58:return 3;case 34:case 39:case 40:case 91:return 2;case 41:case 93:return 1}return 0}function R(e){return m=g=1,y=p(k=e),b=0,[]}function _(e){return k="",e}function $(e){return s(O(b-1,T(91===e?e+2:40===e?e+1:e)))}function N(e){for(;(v=A())&&v<33;)E();return M(e)>2||M(v)>3?"":" "}function z(e,t){for(;--t&&E()&&!(v<48||v>102||v>57&&v<65||v>70&&v<97););return O(e,S()+(t<6&&32==A()&&32==E()))}function T(e){for(;E();)switch(v){case e:return b;case 34:case 39:34!==e&&39!==e&&T(v);break;case 40:41===e&&T(e);break;case 92:E()}return b}function P(e,t){for(;E()&&e+v!==57&&(e+v!==84||47!==A()););return"/*"+O(t,b-1)+"*"+a(47===e?e:E())}function j(e){for(;!M(A());)E();return O(e,b)}var I="-ms-",L="-moz-",F="-webkit-",q="comm",D="rule",B="decl",W="@keyframes";function H(e,t){for(var n="",r=h(e),o=0;o<r;o++)n+=t(e[o],o,e,t)||"";return n}function U(e,t,n,r){switch(e.type){case"@layer":if(e.children.length)break;case"@import":case B:return e.return=e.return||e.value;case q:return"";case W:return e.return=e.value+"{"+H(e.children,r)+"}";case D:e.value=e.props.join(",")}return p(n=H(e.children,r))?e.return=e.value+"{"+n+"}":""}function Q(e){return _(K("",null,null,null,[""],e=R(e),0,[0],e))}function K(e,t,n,r,o,i,s,d,h){for(var m=0,g=0,y=s,b=0,v=0,k=0,x=1,w=1,O=1,M=0,R="",_=o,T=i,I=r,L=R;w;)switch(k=M,M=E()){case 40:if(108!=k&&58==u(L,y-1)){-1!=c(L+=l($(M),"&","&\f"),"&\f")&&(O=-1);break}case 34:case 39:case 91:L+=$(M);break;case 9:case 10:case 13:case 32:L+=N(k);break;case 92:L+=z(S()-1,7);continue;case 47:switch(A()){case 42:case 47:f(V(P(E(),S()),t,n),h);break;default:L+="/"}break;case 123*x:d[m++]=p(L)*O;case 125*x:case 59:case 0:switch(M){case 0:case 125:w=0;case 59+g:-1==O&&(L=l(L,/\f/g,"")),v>0&&p(L)-y&&f(v>32?X(L+";",r,n,y-1):X(l(L," ","")+";",r,n,y-2),h);break;case 59:L+=";";default:if(f(I=G(L,t,n,m,g,o,d,R,_=[],T=[],y),i),123===M)if(0===g)K(L,t,I,I,_,i,y,d,T);else switch(99===b&&110===u(L,3)?100:b){case 100:case 108:case 109:case 115:K(e,I,I,r&&f(G(e,I,I,0,0,o,d,R,o,_=[],y),T),o,T,y,d,r?_:T);break;default:K(L,I,I,I,[""],T,0,d,T)}}m=g=v=0,x=O=1,R=L="",y=s;break;case 58:y=1+p(L),v=k;default:if(x<1)if(123==M)--x;else if(125==M&&0==x++&&125==C())continue;switch(L+=a(M),M*x){case 38:O=g>0?1:(L+="\f",-1);break;case 44:d[m++]=(p(L)-1)*O,O=1;break;case 64:45===A()&&(L+=$(E())),b=A(),g=y=p(R=L+=j(S())),M++;break;case 45:45===k&&2==p(L)&&(x=0)}}return i}function G(e,t,n,r,a,i,c,u,p,f,m){for(var g=a-1,y=0===a?i:[""],b=h(y),v=0,k=0,w=0;v<r;++v)for(var C=0,E=d(e,g+1,g=o(k=c[v])),A=e;C<b;++C)(A=s(k>0?y[C]+" "+E:l(E,/&\f/g,y[C])))&&(p[w++]=A);return x(e,t,n,0===a?D:u,p,f,m)}function V(e,t,n){return x(e,t,n,q,a(v),d(e,2,-2),0)}function X(e,t,n,r){return x(e,t,n,B,d(e,0,r),d(e,r+1,-1),r)}var Y=function(e,t,n){for(var r=0,o=0;r=o,o=A(),38===r&&12===o&&(t[n]=1),!M(o);)E();return O(e,b)},Z=function(e,t){return _(function(e,t){var n=-1,r=44;do{switch(M(r)){case 0:38===r&&12===A()&&(t[n]=1),e[n]+=Y(b-1,t,n);break;case 2:e[n]+=$(r);break;case 4:if(44===r){e[++n]=58===A()?"&\f":"",t[n]=e[n].length;break}default:e[n]+=a(r)}}while(r=E());return e}(R(e),t))},J=new WeakMap,ee=function(e){if("rule"===e.type&&e.parent&&!(e.length<1)){for(var t=e.value,n=e.parent,r=e.column===n.column&&e.line===n.line;"rule"!==n.type;)if(!(n=n.parent))return;if((1!==e.props.length||58===t.charCodeAt(0)||J.get(n))&&!r){J.set(e,!0);for(var o=[],a=Z(t,o),i=n.props,s=0,l=0;s<a.length;s++)for(var c=0;c<i.length;c++,l++)e.props[l]=o[s]?a[s].replace(/&\f/g,i[c]):i[c]+" "+a[s]}}},te=function(e){if("decl"===e.type){var t=e.value;108===t.charCodeAt(0)&&98===t.charCodeAt(2)&&(e.return="",e.value="")}};function ne(e,t){switch(function(e,t){return 45^u(e,0)?(((t<<2^u(e,0))<<2^u(e,1))<<2^u(e,2))<<2^u(e,3):0}(e,t)){case 5103:return F+"print-"+e+e;case 5737:case 4201:case 3177:case 3433:case 1641:case 4457:case 2921:case 5572:case 6356:case 5844:case 3191:case 6645:case 3005:case 6391:case 5879:case 5623:case 6135:case 4599:case 4855:case 4215:case 6389:case 5109:case 5365:case 5621:case 3829:return F+e+e;case 5349:case 4246:case 4810:case 6968:case 2756:return F+e+L+e+I+e+e;case 6828:case 4268:return F+e+I+e+e;case 6165:return F+e+I+"flex-"+e+e;case 5187:return F+e+l(e,/(\w+).+(:[^]+)/,F+"box-$1$2"+I+"flex-$1$2")+e;case 5443:return F+e+I+"flex-item-"+l(e,/flex-|-self/,"")+e;case 4675:return F+e+I+"flex-line-pack"+l(e,/align-content|flex-|-self/,"")+e;case 5548:return F+e+I+l(e,"shrink","negative")+e;case 5292:return F+e+I+l(e,"basis","preferred-size")+e;case 6060:return F+"box-"+l(e,"-grow","")+F+e+I+l(e,"grow","positive")+e;case 4554:return F+l(e,/([^-])(transform)/g,"$1"+F+"$2")+e;case 6187:return l(l(l(e,/(zoom-|grab)/,F+"$1"),/(image-set)/,F+"$1"),e,"")+e;case 5495:case 3959:return l(e,/(image-set\([^]*)/,F+"$1$`$1");case 4968:return l(l(e,/(.+:)(flex-)?(.*)/,F+"box-pack:$3"+I+"flex-pack:$3"),/s.+-b[^;]+/,"justify")+F+e+e;case 4095:case 3583:case 4068:case 2532:return l(e,/(.+)-inline(.+)/,F+"$1$2")+e;case 8116:case 7059:case 5753:case 5535:case 5445:case 5701:case 4933:case 4677:case 5533:case 5789:case 5021:case 4765:if(p(e)-1-t>6)switch(u(e,t+1)){case 109:if(45!==u(e,t+4))break;case 102:return l(e,/(.+:)(.+)-([^]+)/,"$1"+F+"$2-$3$1"+L+(108==u(e,t+3)?"$3":"$2-$3"))+e;case 115:return~c(e,"stretch")?ne(l(e,"stretch","fill-available"),t)+e:e}break;case 4949:if(115!==u(e,t+1))break;case 6444:switch(u(e,p(e)-3-(~c(e,"!important")&&10))){case 107:return l(e,":",":"+F)+e;case 101:return l(e,/(.+:)([^;!]+)(;|!.+)?/,"$1"+F+(45===u(e,14)?"inline-":"")+"box$3$1"+F+"$2$3$1"+I+"$2box$3")+e}break;case 5936:switch(u(e,t+11)){case 114:return F+e+I+l(e,/[svh]\w+-[tblr]{2}/,"tb")+e;case 108:return F+e+I+l(e,/[svh]\w+-[tblr]{2}/,"tb-rl")+e;case 45:return F+e+I+l(e,/[svh]\w+-[tblr]{2}/,"lr")+e}return F+e+I+e+e}return e}var re=[function(e,t,n,r){if(e.length>-1&&!e.return)switch(e.type){case B:e.return=ne(e.value,e.length);break;case W:return H([w(e,{value:l(e.value,"@","@"+F)})],r);case D:if(e.length)return function(e,t){return e.map(t).join("")}(e.props,(function(t){switch(function(e,t){return(e=t.exec(e))?e[0]:e}(t,/(::plac\w+|:read-\w+)/)){case":read-only":case":read-write":return H([w(e,{props:[l(t,/:(read-\w+)/,":-moz-$1")]})],r);case"::placeholder":return H([w(e,{props:[l(t,/:(plac\w+)/,":"+F+"input-$1")]}),w(e,{props:[l(t,/:(plac\w+)/,":-moz-$1")]}),w(e,{props:[l(t,/:(plac\w+)/,I+"input-$1")]})],r)}return""}))}}],oe=function(e){var t=e.key;if("css"===t){var n=document.querySelectorAll("style[data-emotion]:not([data-s])");Array.prototype.forEach.call(n,(function(e){-1!==e.getAttribute("data-emotion").indexOf(" ")&&(document.head.appendChild(e),e.setAttribute("data-s",""))}))}var o,a,i=e.stylisPlugins||re,s={},l=[];o=e.container||document.head,Array.prototype.forEach.call(document.querySelectorAll('style[data-emotion^="'+t+' "]'),(function(e){for(var t=e.getAttribute("data-emotion").split(" "),n=1;n<t.length;n++)s[t[n]]=!0;l.push(e)}));var c,u,d,p,f=[U,(p=function(e){c.insert(e)},function(e){e.root||(e=e.return)&&p(e)})],m=(u=[ee,te].concat(i,f),d=h(u),function(e,t,n,r){for(var o="",a=0;a<d;a++)o+=u[a](e,t,n,r)||"";return o});a=function(e,t,n,r){c=n,H(Q(e?e+"{"+t.styles+"}":t.styles),m),r&&(g.inserted[t.name]=!0)};var g={key:t,sheet:new r({key:t,container:o,nonce:e.nonce,speedy:e.speedy,prepend:e.prepend,insertionPoint:e.insertionPoint}),nonce:e.nonce,inserted:s,registered:{},insert:a};return g.sheet.hydrate(l),g}},6606(e,t,n){"use strict";function r(e){var t=Object.create(null);return function(n){return void 0===t[n]&&(t[n]=e(n)),t[n]}}n.d(t,{A:()=>r})},6730(e,t,n){"use strict";n.d(t,{C:()=>c,E:()=>g,T:()=>d,c:()=>f,h:()=>p,w:()=>u});var r=n(1594),o=n(2096),a=n(3595),i=n(8976),s=n(5035),l=r.createContext("undefined"!=typeof HTMLElement?(0,o.A)({key:"css"}):null),c=l.Provider,u=function(e){return(0,r.forwardRef)((function(t,n){var o=(0,r.useContext)(l);return e(t,o,n)}))},d=r.createContext({});var p={}.hasOwnProperty,h="__EMOTION_TYPE_PLEASE_DO_NOT_USE__",f=function(e,t){var n={};for(var r in t)p.call(t,r)&&(n[r]=t[r]);return n[h]=e,n},m=function(e){var t=e.cache,n=e.serialized,r=e.isStringTag;return(0,a.SF)(t,n,r),(0,s.s)((function(){return(0,a.sk)(t,n,r)})),null},g=u((function(e,t,n){var o=e.css;"string"==typeof o&&void 0!==t.registered[o]&&(o=t.registered[o]);var s=e[h],l=[o],c="";"string"==typeof e.className?c=(0,a.Rk)(t.registered,l,e.className):null!=e.className&&(c=e.className+" ");var u=(0,i.J)(l,void 0,r.useContext(d));c+=t.key+"-"+u.name;var f={};for(var g in e)p.call(e,g)&&"css"!==g&&g!==h&&(f[g]=e[g]);return f.className=c,n&&(f.ref=n),r.createElement(r.Fragment,null,r.createElement(m,{cache:t,serialized:u,isStringTag:"string"==typeof s}),r.createElement(s,f))}))},2827(e,t,n){"use strict";n.d(t,{AH:()=>p,i7:()=>h,mL:()=>d});var r,o,a=n(6730),i=n(1594),s=n(3595),l=n(5035),c=n(8976),u=(n(2096),n(1035),function(e,t){var n=arguments;if(null==t||!a.h.call(t,"css"))return i.createElement.apply(void 0,n);var r=n.length,o=new Array(r);o[0]=a.E,o[1]=(0,a.c)(e,t);for(var s=2;s<r;s++)o[s]=n[s];return i.createElement.apply(null,o)});r=u||(u={}),o||(o=r.JSX||(r.JSX={}));var d=(0,a.w)((function(e,t){var n=e.styles,r=(0,c.J)([n],void 0,i.useContext(a.T)),o=i.useRef();return(0,l.i)((function(){var e=t.key+"-global",n=new t.sheet.constructor({key:e,nonce:t.sheet.nonce,container:t.sheet.container,speedy:t.sheet.isSpeedy}),a=!1,i=document.querySelector('style[data-emotion="'+e+" "+r.name+'"]');return t.sheet.tags.length&&(n.before=t.sheet.tags[0]),null!==i&&(a=!0,i.setAttribute("data-emotion",e),n.hydrate([i])),o.current=[n,a],function(){n.flush()}}),[t]),(0,l.i)((function(){var e=o.current,n=e[0];if(e[1])e[1]=!1;else{if(void 0!==r.next&&(0,s.sk)(t,r.next,!0),n.tags.length){var a=n.tags[n.tags.length-1].nextElementSibling;n.before=a,n.flush()}t.insert("",r,n,!1)}}),[t,r.name]),null}));function p(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return(0,c.J)(t)}function h(){var e=p.apply(void 0,arguments),t="animation-"+e.name;return{name:t,styles:"@keyframes "+t+"{"+e.styles+"}",anim:1,toString:function(){return"_EMO_"+this.name+"_"+this.styles+"_EMO_"}}}},8976(e,t,n){"use strict";n.d(t,{J:()=>f});var r={animationIterationCount:1,aspectRatio:1,borderImageOutset:1,borderImageSlice:1,borderImageWidth:1,boxFlex:1,boxFlexGroup:1,boxOrdinalGroup:1,columnCount:1,columns:1,flex:1,flexGrow:1,flexPositive:1,flexShrink:1,flexNegative:1,flexOrder:1,gridRow:1,gridRowEnd:1,gridRowSpan:1,gridRowStart:1,gridColumn:1,gridColumnEnd:1,gridColumnSpan:1,gridColumnStart:1,msGridRow:1,msGridRowSpan:1,msGridColumn:1,msGridColumnSpan:1,fontWeight:1,lineHeight:1,opacity:1,order:1,orphans:1,scale:1,tabSize:1,widows:1,zIndex:1,zoom:1,WebkitLineClamp:1,fillOpacity:1,floodOpacity:1,stopOpacity:1,strokeDasharray:1,strokeDashoffset:1,strokeMiterlimit:1,strokeOpacity:1,strokeWidth:1},o=n(6606),a=/[A-Z]|^ms/g,i=/_EMO_([^_]+?)_([^]*?)_EMO_/g,s=function(e){return 45===e.charCodeAt(1)},l=function(e){return null!=e&&"boolean"!=typeof e},c=(0,o.A)((function(e){return s(e)?e:e.replace(a,"-$&").toLowerCase()})),u=function(e,t){switch(e){case"animation":case"animationName":if("string"==typeof t)return t.replace(i,(function(e,t,n){return p={name:t,styles:n,next:p},t}))}return 1===r[e]||s(e)||"number"!=typeof t||0===t?t:t+"px"};function d(e,t,n){if(null==n)return"";var r=n;if(void 0!==r.__emotion_styles)return r;switch(typeof n){case"boolean":return"";case"object":var o=n;if(1===o.anim)return p={name:o.name,styles:o.styles,next:p},o.name;var a=n;if(void 0!==a.styles){var i=a.next;if(void 0!==i)for(;void 0!==i;)p={name:i.name,styles:i.styles,next:p},i=i.next;return a.styles+";"}return function(e,t,n){var r="";if(Array.isArray(n))for(var o=0;o<n.length;o++)r+=d(e,t,n[o])+";";else for(var a in n){var i=n[a];if("object"!=typeof i){var s=i;null!=t&&void 0!==t[s]?r+=a+"{"+t[s]+"}":l(s)&&(r+=c(a)+":"+u(a,s)+";")}else if(!Array.isArray(i)||"string"!=typeof i[0]||null!=t&&void 0!==t[i[0]]){var p=d(e,t,i);switch(a){case"animation":case"animationName":r+=c(a)+":"+p+";";break;default:r+=a+"{"+p+"}"}}else for(var h=0;h<i.length;h++)l(i[h])&&(r+=c(a)+":"+u(a,i[h])+";")}return r}(e,t,n);case"function":if(void 0!==e){var s=p,h=n(e);return p=s,d(e,t,h)}}var f=n;if(null==t)return f;var m=t[f];return void 0!==m?m:f}var p,h=/label:\s*([^\s;{]+)\s*(;|$)/g;function f(e,t,n){if(1===e.length&&"object"==typeof e[0]&&null!==e[0]&&void 0!==e[0].styles)return e[0];var r=!0,o="";p=void 0;var a=e[0];null==a||void 0===a.raw?(r=!1,o+=d(n,t,a)):o+=a[0];for(var i=1;i<e.length;i++){if(o+=d(n,t,e[i]),r)o+=a[i]}h.lastIndex=0;for(var s,l="";null!==(s=h.exec(o));)l+="-"+s[1];var c=function(e){for(var t,n=0,r=0,o=e.length;o>=4;++r,o-=4)t=1540483477*(65535&(t=255&e.charCodeAt(r)|(255&e.charCodeAt(++r))<<8|(255&e.charCodeAt(++r))<<16|(255&e.charCodeAt(++r))<<24))+(59797*(t>>>16)<<16),n=1540483477*(65535&(t^=t>>>24))+(59797*(t>>>16)<<16)^1540483477*(65535&n)+(59797*(n>>>16)<<16);switch(o){case 3:n^=(255&e.charCodeAt(r+2))<<16;case 2:n^=(255&e.charCodeAt(r+1))<<8;case 1:n=1540483477*(65535&(n^=255&e.charCodeAt(r)))+(59797*(n>>>16)<<16)}return(((n=1540483477*(65535&(n^=n>>>13))+(59797*(n>>>16)<<16))^n>>>15)>>>0).toString(36)}(o)+l;return{name:c,styles:o,next:p}}},5035(e,t,n){"use strict";n.d(t,{i:()=>i,s:()=>a});var r=n(1594),o=!!r.useInsertionEffect&&r.useInsertionEffect,a=o||function(e){return e()},i=o||r.useLayoutEffect},3595(e,t,n){"use strict";n.d(t,{Rk:()=>r,SF:()=>o,sk:()=>a});function r(e,t,n){var r="";return n.split(" ").forEach((function(n){void 0!==e[n]?t.push(e[n]+";"):n&&(r+=n+" ")})),r}var o=function(e,t,n){var r=e.key+"-"+t.name;!1===n&&void 0===e.registered[r]&&(e.registered[r]=t.styles)},a=function(e,t,n){o(e,t,n);var r=e.key+"-"+t.name;if(void 0===e.inserted[t.name]){var a=t;do{e.insert(t===a?"."+r:"",a,e.sheet,!0),a=a.next}while(void 0!==a)}}},4342(e,t,n){"use strict";n.d(t,{A:()=>a});n(1594);var r=n(2827),o=n(6070);function a(e){const{styles:t,defaultTheme:n={}}=e,a="function"==typeof t?e=>{return t(null==(r=e)||0===Object.keys(r).length?n:e);var r}:t;return(0,o.jsx)(r.mL,{styles:a})}},5824(e,t,n){"use strict";n.r(t),n.d(t,{GlobalStyles:()=>w.A,StyledEngineProvider:()=>x,ThemeContext:()=>o.T,css:()=>y.AH,default:()=>C,internal_processStyles:()=>E,internal_serializeStyles:()=>S,keyframes:()=>y.i7});var r=n(8621),o=n(6730),a=n(8976),i=n(5035),s=n(3595),l=n(1594),c=n(6606),u=/^((children|dangerouslySetInnerHTML|key|ref|autoFocus|defaultValue|defaultChecked|innerHTML|suppressContentEditableWarning|suppressHydrationWarning|valueLink|abbr|accept|acceptCharset|accessKey|action|allow|allowUserMedia|allowPaymentRequest|allowFullScreen|allowTransparency|alt|async|autoComplete|autoPlay|capture|cellPadding|cellSpacing|challenge|charSet|checked|cite|classID|className|cols|colSpan|content|contentEditable|contextMenu|controls|controlsList|coords|crossOrigin|data|dateTime|decoding|default|defer|dir|disabled|disablePictureInPicture|disableRemotePlayback|download|draggable|encType|enterKeyHint|fetchpriority|fetchPriority|form|formAction|formEncType|formMethod|formNoValidate|formTarget|frameBorder|headers|height|hidden|high|href|hrefLang|htmlFor|httpEquiv|id|inputMode|integrity|is|keyParams|keyType|kind|label|lang|list|loading|loop|low|marginHeight|marginWidth|max|maxLength|media|mediaGroup|method|min|minLength|multiple|muted|name|nonce|noValidate|open|optimum|pattern|placeholder|playsInline|popover|popoverTarget|popoverTargetAction|poster|preload|profile|radioGroup|readOnly|referrerPolicy|rel|required|reversed|role|rows|rowSpan|sandbox|scope|scoped|scrolling|seamless|selected|shape|size|sizes|slot|span|spellCheck|src|srcDoc|srcLang|srcSet|start|step|style|summary|tabIndex|target|title|translate|type|useMap|value|width|wmode|wrap|about|datatype|inlist|prefix|property|resource|typeof|vocab|autoCapitalize|autoCorrect|autoSave|color|incremental|fallback|inert|itemProp|itemScope|itemType|itemID|itemRef|on|option|results|security|unselectable|accentHeight|accumulate|additive|alignmentBaseline|allowReorder|alphabetic|amplitude|arabicForm|ascent|attributeName|attributeType|autoReverse|azimuth|baseFrequency|baselineShift|baseProfile|bbox|begin|bias|by|calcMode|capHeight|clip|clipPathUnits|clipPath|clipRule|colorInterpolation|colorInterpolationFilters|colorProfile|colorRendering|contentScriptType|contentStyleType|cursor|cx|cy|d|decelerate|descent|diffuseConstant|direction|display|divisor|dominantBaseline|dur|dx|dy|edgeMode|elevation|enableBackground|end|exponent|externalResourcesRequired|fill|fillOpacity|fillRule|filter|filterRes|filterUnits|floodColor|floodOpacity|focusable|fontFamily|fontSize|fontSizeAdjust|fontStretch|fontStyle|fontVariant|fontWeight|format|from|fr|fx|fy|g1|g2|glyphName|glyphOrientationHorizontal|glyphOrientationVertical|glyphRef|gradientTransform|gradientUnits|hanging|horizAdvX|horizOriginX|ideographic|imageRendering|in|in2|intercept|k|k1|k2|k3|k4|kernelMatrix|kernelUnitLength|kerning|keyPoints|keySplines|keyTimes|lengthAdjust|letterSpacing|lightingColor|limitingConeAngle|local|markerEnd|markerMid|markerStart|markerHeight|markerUnits|markerWidth|mask|maskContentUnits|maskUnits|mathematical|mode|numOctaves|offset|opacity|operator|order|orient|orientation|origin|overflow|overlinePosition|overlineThickness|panose1|paintOrder|pathLength|patternContentUnits|patternTransform|patternUnits|pointerEvents|points|pointsAtX|pointsAtY|pointsAtZ|preserveAlpha|preserveAspectRatio|primitiveUnits|r|radius|refX|refY|renderingIntent|repeatCount|repeatDur|requiredExtensions|requiredFeatures|restart|result|rotate|rx|ry|scale|seed|shapeRendering|slope|spacing|specularConstant|specularExponent|speed|spreadMethod|startOffset|stdDeviation|stemh|stemv|stitchTiles|stopColor|stopOpacity|strikethroughPosition|strikethroughThickness|string|stroke|strokeDasharray|strokeDashoffset|strokeLinecap|strokeLinejoin|strokeMiterlimit|strokeOpacity|strokeWidth|surfaceScale|systemLanguage|tableValues|targetX|targetY|textAnchor|textDecoration|textRendering|textLength|to|transform|u1|u2|underlinePosition|underlineThickness|unicode|unicodeBidi|unicodeRange|unitsPerEm|vAlphabetic|vHanging|vIdeographic|vMathematical|values|vectorEffect|version|vertAdvY|vertOriginX|vertOriginY|viewBox|viewTarget|visibility|widths|wordSpacing|writingMode|x|xHeight|x1|x2|xChannelSelector|xlinkActuate|xlinkArcrole|xlinkHref|xlinkRole|xlinkShow|xlinkTitle|xlinkType|xmlBase|xmlns|xmlnsXlink|xmlLang|xmlSpace|y|y1|y2|yChannelSelector|z|zoomAndPan|for|class|autofocus)|(([Dd][Aa][Tt][Aa]|[Aa][Rr][Ii][Aa]|x)-.*))$/,d=(0,c.A)((function(e){return u.test(e)||111===e.charCodeAt(0)&&110===e.charCodeAt(1)&&e.charCodeAt(2)<91})),p=function(e){return"theme"!==e},h=function(e){return"string"==typeof e&&e.charCodeAt(0)>96?d:p},f=function(e,t,n){var r;if(t){var o=t.shouldForwardProp;r=e.__emotion_forwardProp&&o?function(t){return e.__emotion_forwardProp(t)&&o(t)}:o}return"function"!=typeof r&&n&&(r=e.__emotion_forwardProp),r},m=function(e){var t=e.cache,n=e.serialized,r=e.isStringTag;return(0,s.SF)(t,n,r),(0,i.s)((function(){return(0,s.sk)(t,n,r)})),null},g=function e(t,n){var i,c,u=t.__emotion_real===t,d=u&&t.__emotion_base||t;void 0!==n&&(i=n.label,c=n.target);var p=f(t,n,u),g=p||h(d),y=!g("as");return function(){var b=arguments,v=u&&void 0!==t.__emotion_styles?t.__emotion_styles.slice(0):[];if(void 0!==i&&v.push("label:"+i+";"),null==b[0]||void 0===b[0].raw)v.push.apply(v,b);else{var k=b[0];v.push(k[0]);for(var x=b.length,w=1;w<x;w++)v.push(b[w],k[w])}var C=(0,o.w)((function(e,t,n){var r=y&&e.as||d,i="",u=[],f=e;if(null==e.theme){for(var b in f={},e)f[b]=e[b];f.theme=l.useContext(o.T)}"string"==typeof e.className?i=(0,s.Rk)(t.registered,u,e.className):null!=e.className&&(i=e.className+" ");var k=(0,a.J)(v.concat(u),t.registered,f);i+=t.key+"-"+k.name,void 0!==c&&(i+=" "+c);var x=y&&void 0===p?h(r):g,w={};for(var C in e)y&&"as"===C||x(C)&&(w[C]=e[C]);return w.className=i,n&&(w.ref=n),l.createElement(l.Fragment,null,l.createElement(m,{cache:t,serialized:k,isStringTag:"string"==typeof r}),l.createElement(r,w))}));return C.displayName=void 0!==i?i:"Styled("+("string"==typeof d?d:d.displayName||d.name||"Component")+")",C.defaultProps=t.defaultProps,C.__emotion_real=C,C.__emotion_base=d,C.__emotion_styles=v,C.__emotion_forwardProp=p,Object.defineProperty(C,"toString",{value:function(){return"."+c}}),C.withComponent=function(t,o){return e(t,(0,r.A)({},n,o,{shouldForwardProp:f(C,o,!0)})).apply(void 0,v)},C}}.bind(null);["a","abbr","address","area","article","aside","audio","b","base","bdi","bdo","big","blockquote","body","br","button","canvas","caption","cite","code","col","colgroup","data","datalist","dd","del","details","dfn","dialog","div","dl","dt","em","embed","fieldset","figcaption","figure","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","iframe","img","input","ins","kbd","keygen","label","legend","li","link","main","map","mark","marquee","menu","menuitem","meta","meter","nav","noscript","object","ol","optgroup","option","output","p","param","picture","pre","progress","q","rp","rt","ruby","s","samp","script","section","select","small","source","span","strong","style","sub","summary","sup","table","tbody","td","textarea","tfoot","th","thead","time","title","tr","track","u","ul","var","video","wbr","circle","clipPath","defs","ellipse","foreignObject","g","image","line","linearGradient","mask","path","pattern","polygon","polyline","radialGradient","rect","stop","svg","text","tspan"].forEach((function(e){g[e]=g(e)}));var y=n(2827),b=n(2096),v=n(6070);const k=new Map;function x(e){const{injectFirst:t,enableCssLayer:n,children:r}=e,a=l.useMemo((()=>{const e=`${t}-${n}`;if("object"==typeof document&&k.has(e))return k.get(e);const r=function(e,t){const n=(0,b.A)({key:"css",prepend:e});if(t){const e=n.insert;n.insert=(...t)=>(t[1].styles.match(/^@layer\s+[^{]*$/)||(t[1].styles=`@layer mui {${t[1].styles}}`),e(...t))}return n}(t,n);return k.set(e,r),r}),[t,n]);return t||n?(0,v.jsx)(o.C,{value:a,children:r}):r}var w=n(4342);function C(e,t){return g(e,t)}const E=(e,t)=>{Array.isArray(e.__emotion_styles)&&(e.__emotion_styles=t(e.__emotion_styles))},A=[];function S(e){return A[0]=e,(0,a.J)(A)}},220(e,t,n){"use strict";var r=n(2679);t.X4=h,t.e$=f,t.eM=function(e,t){const n=p(e),r=p(t);return(Math.max(n,r)+.05)/(Math.min(n,r)+.05)},t.a=m;var o=r(n(669)),a=r(n(628));function i(e,t=0,n=1){return(0,a.default)(e,t,n)}function s(e){e=e.slice(1);const t=new RegExp(`.{1,${e.length>=6?2:1}}`,"g");let n=e.match(t);return n&&1===n[0].length&&(n=n.map((e=>e+e))),n?`rgb${4===n.length?"a":""}(${n.map(((e,t)=>t<3?parseInt(e,16):Math.round(parseInt(e,16)/255*1e3)/1e3)).join(", ")})`:""}function l(e){if(e.type)return e;if("#"===e.charAt(0))return l(s(e));const t=e.indexOf("("),n=e.substring(0,t);if(-1===["rgb","rgba","hsl","hsla","color"].indexOf(n))throw new Error((0,o.default)(9,e));let r,a=e.substring(t+1,e.length-1);if("color"===n){if(a=a.split(" "),r=a.shift(),4===a.length&&"/"===a[3].charAt(0)&&(a[3]=a[3].slice(1)),-1===["srgb","display-p3","a98-rgb","prophoto-rgb","rec-2020"].indexOf(r))throw new Error((0,o.default)(10,r))}else a=a.split(",");return a=a.map((e=>parseFloat(e))),{type:n,values:a,colorSpace:r}}const c=e=>{const t=l(e);return t.values.slice(0,3).map(((e,n)=>-1!==t.type.indexOf("hsl")&&0!==n?`${e}%`:e)).join(" ")};function u(e){const{type:t,colorSpace:n}=e;let{values:r}=e;return-1!==t.indexOf("rgb")?r=r.map(((e,t)=>t<3?parseInt(e,10):e)):-1!==t.indexOf("hsl")&&(r[1]=`${r[1]}%`,r[2]=`${r[2]}%`),r=-1!==t.indexOf("color")?`${n} ${r.join(" ")}`:`${r.join(", ")}`,`${t}(${r})`}function d(e){e=l(e);const{values:t}=e,n=t[0],r=t[1]/100,o=t[2]/100,a=r*Math.min(o,1-o),i=(e,t=(e+n/30)%12)=>o-a*Math.max(Math.min(t-3,9-t,1),-1);let s="rgb";const c=[Math.round(255*i(0)),Math.round(255*i(8)),Math.round(255*i(4))];return"hsla"===e.type&&(s+="a",c.push(t[3])),u({type:s,values:c})}function p(e){let t="hsl"===(e=l(e)).type||"hsla"===e.type?l(d(e)).values:e.values;return t=t.map((t=>("color"!==e.type&&(t/=255),t<=.03928?t/12.92:((t+.055)/1.055)**2.4))),Number((.2126*t[0]+.7152*t[1]+.0722*t[2]).toFixed(3))}function h(e,t){return e=l(e),t=i(t),"rgb"!==e.type&&"hsl"!==e.type||(e.type+="a"),"color"===e.type?e.values[3]=`/${t}`:e.values[3]=t,u(e)}function f(e,t){if(e=l(e),t=i(t),-1!==e.type.indexOf("hsl"))e.values[2]*=1-t;else if(-1!==e.type.indexOf("rgb")||-1!==e.type.indexOf("color"))for(let n=0;n<3;n+=1)e.values[n]*=1-t;return u(e)}function m(e,t){if(e=l(e),t=i(t),-1!==e.type.indexOf("hsl"))e.values[2]+=(100-e.values[2])*t;else if(-1!==e.type.indexOf("rgb"))for(let n=0;n<3;n+=1)e.values[n]+=(255-e.values[n])*t;else if(-1!==e.type.indexOf("color"))for(let n=0;n<3;n+=1)e.values[n]+=(1-e.values[n])*t;return u(e)}function g(e,t=.15){return p(e)>.5?f(e,t):m(e,t)}},4598(e,t,n){"use strict";var r=n(2679);t.Ay=function(e={}){const{themeId:t,defaultTheme:n=g,rootShouldForwardProp:r=f,slotShouldForwardProp:l=f}=e,u=e=>(0,c.default)((0,o.default)({},e,{theme:b((0,o.default)({},e,{defaultTheme:n,themeId:t}))}));return u.__mui_systemSx=!0,(e,c={})=>{(0,i.internal_processStyles)(e,(e=>e.filter((e=>!(null!=e&&e.__mui_systemSx)))));const{name:d,slot:h,skipVariantsResolver:m,skipSx:g,overridesResolver:x=v(y(h))}=c,w=(0,a.default)(c,p),C=d&&d.startsWith("Mui")||h?"components":"custom",E=void 0!==m?m:h&&"Root"!==h&&"root"!==h||!1,A=g||!1;let S=f;"Root"===h||"root"===h?S=r:h?S=l:function(e){return"string"==typeof e&&e.charCodeAt(0)>96}(e)&&(S=void 0);const O=(0,i.default)(e,(0,o.default)({shouldForwardProp:S,label:undefined},w)),M=e=>"function"==typeof e&&e.__emotion_real!==e||(0,s.isPlainObject)(e)?r=>{const a=b({theme:r.theme,defaultTheme:n,themeId:t});return k(e,(0,o.default)({},r,{theme:a}),a.modularCssLayers?C:void 0)}:e,R=(r,...a)=>{let i=M(r);const s=a?a.map(M):[];d&&x&&s.push((e=>{const r=b((0,o.default)({},e,{defaultTheme:n,themeId:t}));if(!r.components||!r.components[d]||!r.components[d].styleOverrides)return null;const a=r.components[d].styleOverrides,i={};return Object.entries(a).forEach((([t,n])=>{i[t]=k(n,(0,o.default)({},e,{theme:r}),r.modularCssLayers?"theme":void 0)})),x(e,i)})),d&&!E&&s.push((e=>{var r;const a=b((0,o.default)({},e,{defaultTheme:n,themeId:t}));return k({variants:null==a||null==(r=a.components)||null==(r=r[d])?void 0:r.variants},(0,o.default)({},e,{theme:a}),a.modularCssLayers?"theme":void 0)})),A||s.push(u);const l=s.length-a.length;if(Array.isArray(r)&&l>0){const e=new Array(l).fill("");i=[...r,...e],i.raw=[...r.raw,...e]}const c=O(i,...s);return e.muiName&&(c.muiName=e.muiName),c};return O.withConfig&&(R.withConfig=O.withConfig),R}};var o=r(n(9787)),a=r(n(866)),i=function(e,t){if(!t&&e&&e.__esModule)return e;if(null===e||"object"!=typeof e&&"function"!=typeof e)return{default:e};var n=h(t);if(n&&n.has(e))return n.get(e);var r={__proto__:null},o=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var a in e)if("default"!==a&&Object.prototype.hasOwnProperty.call(e,a)){var i=o?Object.getOwnPropertyDescriptor(e,a):null;i&&(i.get||i.set)?Object.defineProperty(r,a,i):r[a]=e[a]}return r.default=e,n&&n.set(e,r),r}(n(5824)),s=n(8230),l=(r(n(4258)),r(n(4413)),r(n(7895))),c=r(n(7456));const u=["ownerState"],d=["variants"],p=["name","slot","skipVariantsResolver","skipSx","overridesResolver"];function h(e){if("function"!=typeof WeakMap)return null;var t=new WeakMap,n=new WeakMap;return(h=function(e){return e?n:t})(e)}function f(e){return"ownerState"!==e&&"theme"!==e&&"sx"!==e&&"as"!==e}function m(e,t){return t&&e&&"object"==typeof e&&e.styles&&!e.styles.startsWith("@layer")&&(e.styles=`@layer ${t}{${String(e.styles)}}`),e}const g=(0,l.default)(),y=e=>e?e.charAt(0).toLowerCase()+e.slice(1):e;function b({defaultTheme:e,theme:t,themeId:n}){return r=t,0===Object.keys(r).length?e:t[n]||t;var r}function v(e){return e?(t,n)=>n[e]:null}function k(e,t,n){let{ownerState:r}=t,s=(0,a.default)(t,u);const l="function"==typeof e?e((0,o.default)({ownerState:r},s)):e;if(Array.isArray(l))return l.flatMap((e=>k(e,(0,o.default)({ownerState:r},s),n)));if(l&&"object"==typeof l&&Array.isArray(l.variants)){const{variants:e=[]}=l;let t=(0,a.default)(l,d);return e.forEach((e=>{let a=!0;if("function"==typeof e.props?a=e.props((0,o.default)({ownerState:r},s,r)):Object.keys(e.props).forEach((t=>{(null==r?void 0:r[t])!==e.props[t]&&s[t]!==e.props[t]&&(a=!1)})),a){Array.isArray(t)||(t=[t]);const a="function"==typeof e.style?e.style((0,o.default)({ownerState:r},s,r)):e.style;t.push(n?m((0,i.internal_serializeStyles)(a),n):a)}})),t}return n?m((0,i.internal_serializeStyles)(l),n):l}},4873(e,t,n){"use strict";n.d(t,{EU:()=>i,NI:()=>a,vf:()=>s,zu:()=>r});const r={xs:0,sm:600,md:900,lg:1200,xl:1536},o={keys:["xs","sm","md","lg","xl"],up:e=>`@media (min-width:${r[e]}px)`};function a(e,t,n){const a=e.theme||{};if(Array.isArray(t)){const e=a.breakpoints||o;return t.reduce(((r,o,a)=>(r[e.up(e.keys[a])]=n(t[a]),r)),{})}if("object"==typeof t){const e=a.breakpoints||o;return Object.keys(t).reduce(((o,a)=>{if(-1!==Object.keys(e.values||r).indexOf(a)){o[e.up(a)]=n(t[a],a)}else{const e=a;o[e]=t[e]}return o}),{})}return n(t)}function i(e={}){var t;return(null==(t=e.keys)?void 0:t.reduce(((t,n)=>(t[e.up(n)]={},t)),{}))||{}}function s(e,t){return e.reduce(((e,t)=>{const n=e[t];return(!n||0===Object.keys(n).length)&&delete e[t],e}),t)}},7469(e,t,n){"use strict";function r(e,t){const n=this;if(n.vars&&"function"==typeof n.getColorSchemeSelector){return{[n.getColorSchemeSelector(e).replace(/(\[[^\]]+\])/,"*:where($1)")]:t}}return n.palette.mode===e?t:{}}n.d(t,{A:()=>r})},2555(e,t,n){"use strict";n.d(t,{A:()=>i});var r=n(9244),o=n(8621);const a=["values","unit","step"];function i(e){const{values:t={xs:0,sm:600,md:900,lg:1200,xl:1536},unit:n="px",step:i=5}=e,s=(0,r.A)(e,a),l=(e=>{const t=Object.keys(e).map((t=>({key:t,val:e[t]})))||[];return t.sort(((e,t)=>e.val-t.val)),t.reduce(((e,t)=>(0,o.A)({},e,{[t.key]:t.val})),{})})(t),c=Object.keys(l);function u(e){return`@media (min-width:${"number"==typeof t[e]?t[e]:e}${n})`}function d(e){return`@media (max-width:${("number"==typeof t[e]?t[e]:e)-i/100}${n})`}function p(e,r){const o=c.indexOf(r);return`@media (min-width:${"number"==typeof t[e]?t[e]:e}${n}) and (max-width:${(-1!==o&&"number"==typeof t[c[o]]?t[c[o]]:r)-i/100}${n})`}return(0,o.A)({keys:c,values:l,up:u,down:d,between:p,only:function(e){return c.indexOf(e)+1<c.length?p(e,c[c.indexOf(e)+1]):u(e)},not:function(e){const t=c.indexOf(e);return 0===t?u(c[1]):t===c.length-1?d(c[t]):p(e,c[c.indexOf(e)+1]).replace("@media","@media not all and")},unit:n},s)}},718(e,t,n){"use strict";n.d(t,{A:()=>h});var r=n(8621),o=n(9244),a=n(4368),i=n(2555);const s={borderRadius:4};var l=n(5199);var c=n(5394),u=n(9035),d=n(7469);const p=["breakpoints","palette","spacing","shape"];const h=function(e={},...t){const{breakpoints:n={},palette:h={},spacing:f,shape:m={}}=e,g=(0,o.A)(e,p),y=(0,i.A)(n),b=function(e=8){if(e.mui)return e;const t=(0,l.LX)({spacing:e}),n=(...e)=>(0===e.length?[1]:e).map((e=>{const n=t(e);return"number"==typeof n?`${n}px`:n})).join(" ");return n.mui=!0,n}(f);let v=(0,a.A)({breakpoints:y,direction:"ltr",components:{},palette:(0,r.A)({mode:"light"},h),spacing:b,shape:(0,r.A)({},s,m)},g);return v.applyStyles=d.A,v=t.reduce(((e,t)=>(0,a.A)(e,t)),v),v.unstable_sxConfig=(0,r.A)({},u.A,null==g?void 0:g.unstable_sxConfig),v.unstable_sx=function(e){return(0,c.A)({sx:e,theme:this})},v}},7895(e,t,n){"use strict";n.r(t),n.d(t,{default:()=>r.A,private_createBreakpoints:()=>o.A,unstable_applyStyles:()=>a.A});var r=n(718),o=n(2555),a=n(7469)},4353(e,t,n){"use strict";n.d(t,{A:()=>o});var r=n(4368);const o=function(e,t){return t?(0,r.A)(e,t,{clone:!1}):e}},5199(e,t,n){"use strict";n.d(t,{LX:()=>f,MA:()=>h,_W:()=>m,Lc:()=>b,Ms:()=>v});var r=n(4873),o=n(728),a=n(4353);const i={m:"margin",p:"padding"},s={t:"Top",r:"Right",b:"Bottom",l:"Left",x:["Left","Right"],y:["Top","Bottom"]},l={marginX:"mx",marginY:"my",paddingX:"px",paddingY:"py"},c=function(e){const t={};return n=>(void 0===t[n]&&(t[n]=e(n)),t[n])}((e=>{if(e.length>2){if(!l[e])return[e];e=l[e]}const[t,n]=e.split(""),r=i[t],o=s[n]||"";return Array.isArray(o)?o.map((e=>r+e)):[r+o]})),u=["m","mt","mr","mb","ml","mx","my","margin","marginTop","marginRight","marginBottom","marginLeft","marginX","marginY","marginInline","marginInlineStart","marginInlineEnd","marginBlock","marginBlockStart","marginBlockEnd"],d=["p","pt","pr","pb","pl","px","py","padding","paddingTop","paddingRight","paddingBottom","paddingLeft","paddingX","paddingY","paddingInline","paddingInlineStart","paddingInlineEnd","paddingBlock","paddingBlockStart","paddingBlockEnd"],p=[...u,...d];function h(e,t,n,r){var a;const i=null!=(a=(0,o.Yn)(e,t,!1))?a:n;return"number"==typeof i?e=>"string"==typeof e?e:i*e:Array.isArray(i)?e=>"string"==typeof e?e:i[e]:"function"==typeof i?i:()=>{}}function f(e){return h(e,"spacing",8)}function m(e,t){if("string"==typeof t||null==t)return t;const n=e(Math.abs(t));return t>=0?n:"number"==typeof n?-n:`-${n}`}function g(e,t,n,o){if(-1===t.indexOf(n))return null;const a=function(e,t){return n=>e.reduce(((e,r)=>(e[r]=m(t,n),e)),{})}(c(n),o),i=e[n];return(0,r.NI)(e,i,a)}function y(e,t){const n=f(e.theme);return Object.keys(e).map((r=>g(e,t,r,n))).reduce(a.A,{})}function b(e){return y(e,u)}function v(e){return y(e,d)}function k(e){return y(e,p)}b.propTypes={},b.filterProps=u,v.propTypes={},v.filterProps=d,k.propTypes={},k.filterProps=p},728(e,t,n){"use strict";n.d(t,{Ay:()=>s,BO:()=>i,Yn:()=>a});var r=n(570),o=n(4873);function a(e,t,n=!0){if(!t||"string"!=typeof t)return null;if(e&&e.vars&&n){const n=`vars.${t}`.split(".").reduce(((e,t)=>e&&e[t]?e[t]:null),e);if(null!=n)return n}return t.split(".").reduce(((e,t)=>e&&null!=e[t]?e[t]:null),e)}function i(e,t,n,r=n){let o;return o="function"==typeof e?e(n):Array.isArray(e)?e[n]||r:a(e,n)||r,t&&(o=t(o,r,e)),o}const s=function(e){const{prop:t,cssProperty:n=e.prop,themeKey:s,transform:l}=e,c=e=>{if(null==e[t])return null;const c=e[t],u=a(e.theme,s)||{};return(0,o.NI)(e,c,(e=>{let o=i(u,l,e);return e===o&&"string"==typeof e&&(o=i(u,l,`${t}${"default"===e?"":(0,r.A)(e)}`,e)),!1===n?o:{[n]:o}}))};return c.propTypes={},c.filterProps=[t],c}},9035(e,t,n){"use strict";n.d(t,{A:()=>T});var r=n(5199),o=n(728),a=n(4353);const i=function(...e){const t=e.reduce(((e,t)=>(t.filterProps.forEach((n=>{e[n]=t})),e)),{}),n=e=>Object.keys(e).reduce(((n,r)=>t[r]?(0,a.A)(n,t[r](e)):n),{});return n.propTypes={},n.filterProps=e.reduce(((e,t)=>e.concat(t.filterProps)),[]),n};var s=n(4873);function l(e){return"number"!=typeof e?e:`${e}px solid`}function c(e,t){return(0,o.Ay)({prop:e,themeKey:"borders",transform:t})}const u=c("border",l),d=c("borderTop",l),p=c("borderRight",l),h=c("borderBottom",l),f=c("borderLeft",l),m=c("borderColor"),g=c("borderTopColor"),y=c("borderRightColor"),b=c("borderBottomColor"),v=c("borderLeftColor"),k=c("outline",l),x=c("outlineColor"),w=e=>{if(void 0!==e.borderRadius&&null!==e.borderRadius){const t=(0,r.MA)(e.theme,"shape.borderRadius",4,"borderRadius"),n=e=>({borderRadius:(0,r._W)(t,e)});return(0,s.NI)(e,e.borderRadius,n)}return null};w.propTypes={},w.filterProps=["borderRadius"];i(u,d,p,h,f,m,g,y,b,v,w,k,x);const C=e=>{if(void 0!==e.gap&&null!==e.gap){const t=(0,r.MA)(e.theme,"spacing",8,"gap"),n=e=>({gap:(0,r._W)(t,e)});return(0,s.NI)(e,e.gap,n)}return null};C.propTypes={},C.filterProps=["gap"];const E=e=>{if(void 0!==e.columnGap&&null!==e.columnGap){const t=(0,r.MA)(e.theme,"spacing",8,"columnGap"),n=e=>({columnGap:(0,r._W)(t,e)});return(0,s.NI)(e,e.columnGap,n)}return null};E.propTypes={},E.filterProps=["columnGap"];const A=e=>{if(void 0!==e.rowGap&&null!==e.rowGap){const t=(0,r.MA)(e.theme,"spacing",8,"rowGap"),n=e=>({rowGap:(0,r._W)(t,e)});return(0,s.NI)(e,e.rowGap,n)}return null};A.propTypes={},A.filterProps=["rowGap"];i(C,E,A,(0,o.Ay)({prop:"gridColumn"}),(0,o.Ay)({prop:"gridRow"}),(0,o.Ay)({prop:"gridAutoFlow"}),(0,o.Ay)({prop:"gridAutoColumns"}),(0,o.Ay)({prop:"gridAutoRows"}),(0,o.Ay)({prop:"gridTemplateColumns"}),(0,o.Ay)({prop:"gridTemplateRows"}),(0,o.Ay)({prop:"gridTemplateAreas"}),(0,o.Ay)({prop:"gridArea"}));function S(e,t){return"grey"===t?t:e}i((0,o.Ay)({prop:"color",themeKey:"palette",transform:S}),(0,o.Ay)({prop:"bgcolor",cssProperty:"backgroundColor",themeKey:"palette",transform:S}),(0,o.Ay)({prop:"backgroundColor",themeKey:"palette",transform:S}));function O(e){return e<=1&&0!==e?100*e+"%":e}const M=(0,o.Ay)({prop:"width",transform:O}),R=e=>{if(void 0!==e.maxWidth&&null!==e.maxWidth){const t=t=>{var n,r;const o=(null==(n=e.theme)||null==(n=n.breakpoints)||null==(n=n.values)?void 0:n[t])||s.zu[t];return o?"px"!==(null==(r=e.theme)||null==(r=r.breakpoints)?void 0:r.unit)?{maxWidth:`${o}${e.theme.breakpoints.unit}`}:{maxWidth:o}:{maxWidth:O(t)}};return(0,s.NI)(e,e.maxWidth,t)}return null};R.filterProps=["maxWidth"];const _=(0,o.Ay)({prop:"minWidth",transform:O}),$=(0,o.Ay)({prop:"height",transform:O}),N=(0,o.Ay)({prop:"maxHeight",transform:O}),z=(0,o.Ay)({prop:"minHeight",transform:O}),T=((0,o.Ay)({prop:"size",cssProperty:"width",transform:O}),(0,o.Ay)({prop:"size",cssProperty:"height",transform:O}),i(M,R,_,$,N,z,(0,o.Ay)({prop:"boxSizing"})),{border:{themeKey:"borders",transform:l},borderTop:{themeKey:"borders",transform:l},borderRight:{themeKey:"borders",transform:l},borderBottom:{themeKey:"borders",transform:l},borderLeft:{themeKey:"borders",transform:l},borderColor:{themeKey:"palette"},borderTopColor:{themeKey:"palette"},borderRightColor:{themeKey:"palette"},borderBottomColor:{themeKey:"palette"},borderLeftColor:{themeKey:"palette"},outline:{themeKey:"borders",transform:l},outlineColor:{themeKey:"palette"},borderRadius:{themeKey:"shape.borderRadius",style:w},color:{themeKey:"palette",transform:S},bgcolor:{themeKey:"palette",cssProperty:"backgroundColor",transform:S},backgroundColor:{themeKey:"palette",transform:S},p:{style:r.Ms},pt:{style:r.Ms},pr:{style:r.Ms},pb:{style:r.Ms},pl:{style:r.Ms},px:{style:r.Ms},py:{style:r.Ms},padding:{style:r.Ms},paddingTop:{style:r.Ms},paddingRight:{style:r.Ms},paddingBottom:{style:r.Ms},paddingLeft:{style:r.Ms},paddingX:{style:r.Ms},paddingY:{style:r.Ms},paddingInline:{style:r.Ms},paddingInlineStart:{style:r.Ms},paddingInlineEnd:{style:r.Ms},paddingBlock:{style:r.Ms},paddingBlockStart:{style:r.Ms},paddingBlockEnd:{style:r.Ms},m:{style:r.Lc},mt:{style:r.Lc},mr:{style:r.Lc},mb:{style:r.Lc},ml:{style:r.Lc},mx:{style:r.Lc},my:{style:r.Lc},margin:{style:r.Lc},marginTop:{style:r.Lc},marginRight:{style:r.Lc},marginBottom:{style:r.Lc},marginLeft:{style:r.Lc},marginX:{style:r.Lc},marginY:{style:r.Lc},marginInline:{style:r.Lc},marginInlineStart:{style:r.Lc},marginInlineEnd:{style:r.Lc},marginBlock:{style:r.Lc},marginBlockStart:{style:r.Lc},marginBlockEnd:{style:r.Lc},displayPrint:{cssProperty:!1,transform:e=>({"@media print":{display:e}})},display:{},overflow:{},textOverflow:{},visibility:{},whiteSpace:{},flexBasis:{},flexDirection:{},flexWrap:{},justifyContent:{},alignItems:{},alignContent:{},order:{},flex:{},flexGrow:{},flexShrink:{},alignSelf:{},justifyItems:{},justifySelf:{},gap:{style:C},rowGap:{style:A},columnGap:{style:E},gridColumn:{},gridRow:{},gridAutoFlow:{},gridAutoColumns:{},gridAutoRows:{},gridTemplateColumns:{},gridTemplateRows:{},gridTemplateAreas:{},gridArea:{},position:{},zIndex:{themeKey:"zIndex"},top:{},right:{},bottom:{},left:{},boxShadow:{themeKey:"shadows"},width:{transform:O},maxWidth:{style:R},minWidth:{transform:O},height:{transform:O},maxHeight:{transform:O},minHeight:{transform:O},boxSizing:{},fontFamily:{themeKey:"typography"},fontSize:{themeKey:"typography"},fontStyle:{themeKey:"typography"},fontWeight:{themeKey:"typography"},letterSpacing:{},textTransform:{},lineHeight:{},textAlign:{},typography:{cssProperty:!1,themeKey:"typography"}})},1072(e,t,n){"use strict";n.d(t,{A:()=>l});var r=n(8621),o=n(9244),a=n(4368),i=n(9035);const s=["sx"];function l(e){const{sx:t}=e,n=(0,o.A)(e,s),{systemProps:l,otherProps:c}=(e=>{var t,n;const r={systemProps:{},otherProps:{}},o=null!=(t=null==e||null==(n=e.theme)?void 0:n.unstable_sxConfig)?t:i.A;return Object.keys(e).forEach((t=>{o[t]?r.systemProps[t]=e[t]:r.otherProps[t]=e[t]})),r})(n);let u;return u=Array.isArray(t)?[l,...t]:"function"==typeof t?(...e)=>{const n=t(...e);return(0,a.Q)(n)?(0,r.A)({},l,n):l}:(0,r.A)({},l,t),(0,r.A)({},c,{sx:u})}},7456(e,t,n){"use strict";n.r(t),n.d(t,{default:()=>r.A,extendSxProp:()=>o.A,unstable_createStyleFunctionSx:()=>r.k,unstable_defaultSxConfig:()=>a.A});var r=n(5394),o=n(1072),a=n(9035)},5394(e,t,n){"use strict";n.d(t,{A:()=>u,k:()=>l});var r=n(570),o=n(4353),a=n(728),i=n(4873),s=n(9035);function l(){function e(e,t,n,o){const s={[e]:t,theme:n},l=o[e];if(!l)return{[e]:t};const{cssProperty:c=e,themeKey:u,transform:d,style:p}=l;if(null==t)return null;if("typography"===u&&"inherit"===t)return{[e]:t};const h=(0,a.Yn)(n,u)||{};if(p)return p(s);return(0,i.NI)(s,t,(t=>{let n=(0,a.BO)(h,d,t);return t===n&&"string"==typeof t&&(n=(0,a.BO)(h,d,`${e}${"default"===t?"":(0,r.A)(t)}`,t)),!1===c?n:{[c]:n}}))}return function t(n){var r;const{sx:a,theme:l={},nested:c}=n||{};if(!a)return null;const u=null!=(r=l.unstable_sxConfig)?r:s.A;function d(n){let r=n;if("function"==typeof n)r=n(l);else if("object"!=typeof n)return n;if(!r)return null;const a=(0,i.EU)(l.breakpoints),s=Object.keys(a);let d=a;return Object.keys(r).forEach((n=>{const a=(s=r[n],c=l,"function"==typeof s?s(c):s);var s,c;if(null!=a)if("object"==typeof a)if(u[n])d=(0,o.A)(d,e(n,a,l,u));else{const e=(0,i.NI)({theme:l},a,(e=>({[n]:e})));!function(...e){const t=e.reduce(((e,t)=>e.concat(Object.keys(t))),[]),n=new Set(t);return e.every((e=>n.size===Object.keys(e).length))}(e,a)?d=(0,o.A)(d,e):d[n]=t({sx:a,theme:l,nested:!0})}else d=(0,o.A)(d,e(n,a,l,u))})),!c&&l.modularCssLayers?{"@layer sx":(0,i.vf)(s,d)}:(0,i.vf)(s,d)}return Array.isArray(a)?a.map(d):d(a)}}const c=l();c.filterProps=["sx"];const u=c},570(e,t,n){"use strict";n.d(t,{A:()=>o});var r=n(840);function o(e){if("string"!=typeof e)throw new Error((0,r.A)(7));return e.charAt(0).toUpperCase()+e.slice(1)}},4258(e,t,n){"use strict";n.r(t),n.d(t,{default:()=>r.A});var r=n(570)},628(e,t,n){"use strict";n.r(t),n.d(t,{default:()=>r});const r=function(e,t=Number.MIN_SAFE_INTEGER,n=Number.MAX_SAFE_INTEGER){return Math.max(t,Math.min(e,n))}},4368(e,t,n){"use strict";n.d(t,{A:()=>s,Q:()=>a});var r=n(8621),o=n(1594);function a(e){if("object"!=typeof e||null===e)return!1;const t=Object.getPrototypeOf(e);return!(null!==t&&t!==Object.prototype&&null!==Object.getPrototypeOf(t)||Symbol.toStringTag in e||Symbol.iterator in e)}function i(e){if(o.isValidElement(e)||!a(e))return e;const t={};return Object.keys(e).forEach((n=>{t[n]=i(e[n])})),t}function s(e,t,n={clone:!0}){const l=n.clone?(0,r.A)({},e):e;return a(e)&&a(t)&&Object.keys(t).forEach((r=>{o.isValidElement(t[r])?l[r]=t[r]:a(t[r])&&Object.prototype.hasOwnProperty.call(e,r)&&a(e[r])?l[r]=s(e[r],t[r],n):n.clone?l[r]=a(t[r])?i(t[r]):t[r]:l[r]=t[r]})),l}},8230(e,t,n){"use strict";n.r(t),n.d(t,{default:()=>r.A,isPlainObject:()=>r.Q});var r=n(4368)},840(e,t,n){"use strict";function r(e){let t="https://mui.com/production-error/?code="+e;for(let e=1;e<arguments.length;e+=1)t+="&args[]="+encodeURIComponent(arguments[e]);return"Minified MUI error #"+e+"; visit "+t+" for the full message."}n.d(t,{A:()=>r})},669(e,t,n){"use strict";n.r(t),n.d(t,{default:()=>r.A});var r=n(840)},4413(e,t,n){"use strict";n.r(t),n.d(t,{default:()=>l,getFunctionName:()=>a});var r=n(1182);const o=/^\s*function(?:\s|\s*\/\*.*\*\/\s*)+([^(\s/]*)\s*/;function a(e){const t=`${e}`.match(o);return t&&t[1]||""}function i(e,t=""){return e.displayName||e.name||a(e)||t}function s(e,t,n){const r=i(t);return e.displayName||(""!==r?`${n}(${r})`:n)}function l(e){if(null!=e){if("string"==typeof e)return e;if("function"==typeof e)return i(e,"Component");if("object"==typeof e)switch(e.$$typeof){case r.vM:return s(e,e.render,"ForwardRef");case r.lD:return s(e,e.type,"memo");default:return}}}},946(e){"use strict";var t=Object.prototype.hasOwnProperty,n="~";function r(){}function o(e,t,n){this.fn=e,this.context=t,this.once=n||!1}function a(e,t,r,a,i){if("function"!=typeof r)throw new TypeError("The listener must be a function");var s=new o(r,a||e,i),l=n?n+t:t;return e._events[l]?e._events[l].fn?e._events[l]=[e._events[l],s]:e._events[l].push(s):(e._events[l]=s,e._eventsCount++),e}function i(e,t){0==--e._eventsCount?e._events=new r:delete e._events[t]}function s(){this._events=new r,this._eventsCount=0}Object.create&&(r.prototype=Object.create(null),(new r).__proto__||(n=!1)),s.prototype.eventNames=function(){var e,r,o=[];if(0===this._eventsCount)return o;for(r in e=this._events)t.call(e,r)&&o.push(n?r.slice(1):r);return Object.getOwnPropertySymbols?o.concat(Object.getOwnPropertySymbols(e)):o},s.prototype.listeners=function(e){var t=n?n+e:e,r=this._events[t];if(!r)return[];if(r.fn)return[r.fn];for(var o=0,a=r.length,i=new Array(a);o<a;o++)i[o]=r[o].fn;return i},s.prototype.listenerCount=function(e){var t=n?n+e:e,r=this._events[t];return r?r.fn?1:r.length:0},s.prototype.emit=function(e,t,r,o,a,i){var s=n?n+e:e;if(!this._events[s])return!1;var l,c,u=this._events[s],d=arguments.length;if(u.fn){switch(u.once&&this.removeListener(e,u.fn,void 0,!0),d){case 1:return u.fn.call(u.context),!0;case 2:return u.fn.call(u.context,t),!0;case 3:return u.fn.call(u.context,t,r),!0;case 4:return u.fn.call(u.context,t,r,o),!0;case 5:return u.fn.call(u.context,t,r,o,a),!0;case 6:return u.fn.call(u.context,t,r,o,a,i),!0}for(c=1,l=new Array(d-1);c<d;c++)l[c-1]=arguments[c];u.fn.apply(u.context,l)}else{var p,h=u.length;for(c=0;c<h;c++)switch(u[c].once&&this.removeListener(e,u[c].fn,void 0,!0),d){case 1:u[c].fn.call(u[c].context);break;case 2:u[c].fn.call(u[c].context,t);break;case 3:u[c].fn.call(u[c].context,t,r);break;case 4:u[c].fn.call(u[c].context,t,r,o);break;default:if(!l)for(p=1,l=new Array(d-1);p<d;p++)l[p-1]=arguments[p];u[c].fn.apply(u[c].context,l)}}return!0},s.prototype.on=function(e,t,n){return a(this,e,t,n,!1)},s.prototype.once=function(e,t,n){return a(this,e,t,n,!0)},s.prototype.removeListener=function(e,t,r,o){var a=n?n+e:e;if(!this._events[a])return this;if(!t)return i(this,a),this;var s=this._events[a];if(s.fn)s.fn!==t||o&&!s.once||r&&s.context!==r||i(this,a);else{for(var l=0,c=[],u=s.length;l<u;l++)(s[l].fn!==t||o&&!s[l].once||r&&s[l].context!==r)&&c.push(s[l]);c.length?this._events[a]=1===c.length?c[0]:c:i(this,a)}return this},s.prototype.removeAllListeners=function(e){var t;return e?(t=n?n+e:e,this._events[t]&&i(this,t)):(this._events=new r,this._eventsCount=0),this},s.prototype.off=s.prototype.removeListener,s.prototype.addListener=s.prototype.on,s.prefixed=n,s.EventEmitter=s,e.exports=s},5990(e,t,n){var r;
/*!
  Copyright (c) 2015 Jed Watson.
  Based on code that is Copyright 2013-2015, Facebook, Inc.
  All rights reserved.
*/!function(){"use strict";var o=!("undefined"==typeof window||!window.document||!window.document.createElement),a={canUseDOM:o,canUseWorkers:"undefined"!=typeof Worker,canUseEventListeners:o&&!(!window.addEventListener&&!window.attachEvent),canUseViewport:o&&!!window.screen};void 0===(r=function(){return a}.call(t,n,t,e))||(e.exports=r)}()},4490(e,t,n){"use strict";n.d(t,{A:()=>c});var r=n(1594);
/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const o=e=>{const t=(e=>e.replace(/^([A-Z])|[\s-_]+(\w)/g,((e,t,n)=>n?n.toUpperCase():t.toLowerCase())))(e);return t.charAt(0).toUpperCase()+t.slice(1)},a=(...e)=>e.filter(((e,t,n)=>Boolean(e)&&""!==e.trim()&&n.indexOf(e)===t)).join(" ").trim(),i=e=>{for(const t in e)if(t.startsWith("aria-")||"role"===t||"title"===t)return!0};
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
const l=(0,r.forwardRef)((({color:e="currentColor",size:t=24,strokeWidth:n=2,absoluteStrokeWidth:o,className:l="",children:c,iconNode:u,...d},p)=>(0,r.createElement)("svg",{ref:p,...s,width:t,height:t,stroke:e,strokeWidth:o?24*Number(n)/Number(t):n,className:a("lucide",l),...!c&&!i(d)&&{"aria-hidden":"true"},...d},[...u.map((([e,t])=>(0,r.createElement)(e,t))),...Array.isArray(c)?c:[c]]))),c=(e,t)=>{const n=(0,r.forwardRef)((({className:n,...i},s)=>{return(0,r.createElement)(l,{ref:s,iconNode:t,className:a(`lucide-${c=o(e),c.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${e}`,n),...i});var c}));return n.displayName=o(e),n}},217(e,t,n){"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(4490).A)("chevron-down",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]])},488(e,t,n){"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(4490).A)("chevron-left",[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]])},8955(e,t,n){"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(4490).A)("chevron-right",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]])},6104(e,t,n){"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(4490).A)("chevron-up",[["path",{d:"m18 15-6-6-6 6",key:"153udz"}]])},5997(e,t,n){"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(4490).A)("chevrons-left",[["path",{d:"m11 17-5-5 5-5",key:"13zhaf"}],["path",{d:"m18 17-5-5 5-5",key:"h8a8et"}]])},204(e,t,n){"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(4490).A)("chevrons-right",[["path",{d:"m6 17 5-5-5-5",key:"xnjwq"}],["path",{d:"m13 17 5-5-5-5",key:"17xmmf"}]])},9680(e,t,n){"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(4490).A)("circle-alert",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]])},2669(e,t,n){"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(4490).A)("circle-check-big",[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]])},9176(e,t,n){"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(4490).A)("circle-question-mark",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3",key:"1u773s"}],["path",{d:"M12 17h.01",key:"p32p05"}]])},1231(e,t,n){"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(4490).A)("circle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]])},6583(e,t,n){"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(4490).A)("info",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]])},9825(e,t,n){"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(4490).A)("loader-circle",[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]])},9626(e,t,n){"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(4490).A)("square-check-big",[["path",{d:"M21 10.656V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12.344",key:"2acyp4"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]])},5376(e,t,n){"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(4490).A)("square",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}]])},6739(e,t,n){"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(4490).A)("star",[["path",{d:"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",key:"r04s7s"}]])},2672(e,t,n){"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(4490).A)("triangle-alert",[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]])},5067(e,t,n){"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(4490).A)("x",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]])},5314(e){"use strict";e.exports=(e,t)=>(t=t||(()=>{}),e.then((e=>new Promise((e=>{e(t())})).then((()=>e))),(e=>new Promise((e=>{e(t())})).then((()=>{throw e})))))},1442(e,t,n){"use strict";const r=n(946),o=n(218),a=n(6574),i=()=>{},s=new o.TimeoutError;t.A=class extends r{constructor(e){var t,n,r,o;if(super(),this._intervalCount=0,this._intervalEnd=0,this._pendingCount=0,this._resolveEmpty=i,this._resolveIdle=i,!("number"==typeof(e=Object.assign({carryoverConcurrencyCount:!1,intervalCap:1/0,interval:0,concurrency:1/0,autoStart:!0,queueClass:a.default},e)).intervalCap&&e.intervalCap>=1))throw new TypeError(`Expected \`intervalCap\` to be a number from 1 and up, got \`${null!==(n=null===(t=e.intervalCap)||void 0===t?void 0:t.toString())&&void 0!==n?n:""}\` (${typeof e.intervalCap})`);if(void 0===e.interval||!(Number.isFinite(e.interval)&&e.interval>=0))throw new TypeError(`Expected \`interval\` to be a finite number >= 0, got \`${null!==(o=null===(r=e.interval)||void 0===r?void 0:r.toString())&&void 0!==o?o:""}\` (${typeof e.interval})`);this._carryoverConcurrencyCount=e.carryoverConcurrencyCount,this._isIntervalIgnored=e.intervalCap===1/0||0===e.interval,this._intervalCap=e.intervalCap,this._interval=e.interval,this._queue=new e.queueClass,this._queueClass=e.queueClass,this.concurrency=e.concurrency,this._timeout=e.timeout,this._throwOnTimeout=!0===e.throwOnTimeout,this._isPaused=!1===e.autoStart}get _doesIntervalAllowAnother(){return this._isIntervalIgnored||this._intervalCount<this._intervalCap}get _doesConcurrentAllowAnother(){return this._pendingCount<this._concurrency}_next(){this._pendingCount--,this._tryToStartAnother(),this.emit("next")}_resolvePromises(){this._resolveEmpty(),this._resolveEmpty=i,0===this._pendingCount&&(this._resolveIdle(),this._resolveIdle=i,this.emit("idle"))}_onResumeInterval(){this._onInterval(),this._initializeIntervalIfNeeded(),this._timeoutId=void 0}_isIntervalPaused(){const e=Date.now();if(void 0===this._intervalId){const t=this._intervalEnd-e;if(!(t<0))return void 0===this._timeoutId&&(this._timeoutId=setTimeout((()=>{this._onResumeInterval()}),t)),!0;this._intervalCount=this._carryoverConcurrencyCount?this._pendingCount:0}return!1}_tryToStartAnother(){if(0===this._queue.size)return this._intervalId&&clearInterval(this._intervalId),this._intervalId=void 0,this._resolvePromises(),!1;if(!this._isPaused){const e=!this._isIntervalPaused();if(this._doesIntervalAllowAnother&&this._doesConcurrentAllowAnother){const t=this._queue.dequeue();return!!t&&(this.emit("active"),t(),e&&this._initializeIntervalIfNeeded(),!0)}}return!1}_initializeIntervalIfNeeded(){this._isIntervalIgnored||void 0!==this._intervalId||(this._intervalId=setInterval((()=>{this._onInterval()}),this._interval),this._intervalEnd=Date.now()+this._interval)}_onInterval(){0===this._intervalCount&&0===this._pendingCount&&this._intervalId&&(clearInterval(this._intervalId),this._intervalId=void 0),this._intervalCount=this._carryoverConcurrencyCount?this._pendingCount:0,this._processQueue()}_processQueue(){for(;this._tryToStartAnother(););}get concurrency(){return this._concurrency}set concurrency(e){if(!("number"==typeof e&&e>=1))throw new TypeError(`Expected \`concurrency\` to be a number from 1 and up, got \`${e}\` (${typeof e})`);this._concurrency=e,this._processQueue()}async add(e,t={}){return new Promise(((n,r)=>{this._queue.enqueue((async()=>{this._pendingCount++,this._intervalCount++;try{const a=void 0===this._timeout&&void 0===t.timeout?e():o.default(Promise.resolve(e()),void 0===t.timeout?this._timeout:t.timeout,(()=>{(void 0===t.throwOnTimeout?this._throwOnTimeout:t.throwOnTimeout)&&r(s)}));n(await a)}catch(e){r(e)}this._next()}),t),this._tryToStartAnother(),this.emit("add")}))}async addAll(e,t){return Promise.all(e.map((async e=>this.add(e,t))))}start(){return this._isPaused?(this._isPaused=!1,this._processQueue(),this):this}pause(){this._isPaused=!0}clear(){this._queue=new this._queueClass}async onEmpty(){if(0!==this._queue.size)return new Promise((e=>{const t=this._resolveEmpty;this._resolveEmpty=()=>{t(),e()}}))}async onIdle(){if(0!==this._pendingCount||0!==this._queue.size)return new Promise((e=>{const t=this._resolveIdle;this._resolveIdle=()=>{t(),e()}}))}get size(){return this._queue.size}sizeBy(e){return this._queue.filter(e).length}get pending(){return this._pendingCount}get isPaused(){return this._isPaused}get timeout(){return this._timeout}set timeout(e){this._timeout=e}}},1478(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t,n){let r=0,o=e.length;for(;o>0;){const a=o/2|0;let i=r+a;n(e[i],t)<=0?(r=++i,o-=a+1):o=a}return r}},6574(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const r=n(1478);t.default=class{constructor(){this._queue=[]}enqueue(e,t){const n={priority:(t=Object.assign({priority:0},t)).priority,run:e};if(this.size&&this._queue[this.size-1].priority>=t.priority)return void this._queue.push(n);const o=r.default(this._queue,n,((e,t)=>t.priority-e.priority));this._queue.splice(o,0,n)}dequeue(){const e=this._queue.shift();return null==e?void 0:e.run}filter(e){return this._queue.filter((t=>t.priority===e.priority)).map((e=>e.run))}get size(){return this._queue.length}}},218(e,t,n){"use strict";const r=n(5314);class o extends Error{constructor(e){super(e),this.name="TimeoutError"}}const a=(e,t,n)=>new Promise(((a,i)=>{if("number"!=typeof t||t<0)throw new TypeError("Expected `milliseconds` to be a positive number");if(t===1/0)return void a(e);const s=setTimeout((()=>{if("function"==typeof n){try{a(n())}catch(e){i(e)}return}const r=n instanceof Error?n:new o("string"==typeof n?n:`Promise timed out after ${t} milliseconds`);"function"==typeof e.cancel&&e.cancel(),i(r)}),t);r(e.then(a,i),(()=>{clearTimeout(s)}))}));e.exports=a,e.exports.default=a,e.exports.TimeoutError=o},2816(e,t,n){"use strict";var r=n(567);function o(){}function a(){}a.resetWarningCache=o,e.exports=function(){function e(e,t,n,o,a,i){if(i!==r){var s=new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");throw s.name="Invariant Violation",s}}function t(){return e}e.isRequired=e;var n={array:e,bigint:e,bool:e,func:e,number:e,object:e,string:e,symbol:e,any:e,arrayOf:t,element:e,elementType:e,instanceOf:t,node:e,objectOf:t,oneOf:t,oneOfType:t,shape:t,exact:t,checkPropTypes:a,resetWarningCache:o};return n.PropTypes=n,n}},390(e,t,n){e.exports=n(2816)()},567(e){"use strict";e.exports="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED"},3072(e,t,n){"use strict";function r(){var e=this.constructor.getDerivedStateFromProps(this.props,this.state);null!=e&&this.setState(e)}function o(e){this.setState(function(t){var n=this.constructor.getDerivedStateFromProps(e,t);return null!=n?n:null}.bind(this))}function a(e,t){try{var n=this.props,r=this.state;this.props=e,this.state=t,this.__reactInternalSnapshotFlag=!0,this.__reactInternalSnapshot=this.getSnapshotBeforeUpdate(n,r)}finally{this.props=n,this.state=r}}function i(e){var t=e.prototype;if(!t||!t.isReactComponent)throw new Error("Can only polyfill class components");if("function"!=typeof e.getDerivedStateFromProps&&"function"!=typeof t.getSnapshotBeforeUpdate)return e;var n=null,i=null,s=null;if("function"==typeof t.componentWillMount?n="componentWillMount":"function"==typeof t.UNSAFE_componentWillMount&&(n="UNSAFE_componentWillMount"),"function"==typeof t.componentWillReceiveProps?i="componentWillReceiveProps":"function"==typeof t.UNSAFE_componentWillReceiveProps&&(i="UNSAFE_componentWillReceiveProps"),"function"==typeof t.componentWillUpdate?s="componentWillUpdate":"function"==typeof t.UNSAFE_componentWillUpdate&&(s="UNSAFE_componentWillUpdate"),null!==n||null!==i||null!==s){var l=e.displayName||e.name,c="function"==typeof e.getDerivedStateFromProps?"getDerivedStateFromProps()":"getSnapshotBeforeUpdate()";throw Error("Unsafe legacy lifecycles will not be called for components using new component APIs.\n\n"+l+" uses "+c+" but also contains the following legacy lifecycles:"+(null!==n?"\n  "+n:"")+(null!==i?"\n  "+i:"")+(null!==s?"\n  "+s:"")+"\n\nThe above lifecycles should be removed. Learn more about this warning here:\nhttps://fb.me/react-async-component-lifecycle-hooks")}if("function"==typeof e.getDerivedStateFromProps&&(t.componentWillMount=r,t.componentWillReceiveProps=o),"function"==typeof t.getSnapshotBeforeUpdate){if("function"!=typeof t.componentDidUpdate)throw new Error("Cannot polyfill getSnapshotBeforeUpdate() for components that do not define componentDidUpdate() on the prototype");t.componentWillUpdate=a;var u=t.componentDidUpdate;t.componentDidUpdate=function(e,t,n){var r=this.__reactInternalSnapshotFlag?this.__reactInternalSnapshot:n;u.call(this,e,t,r)}}return e}n.r(t),n.d(t,{polyfill:()=>i}),r.__suppressDeprecationWarning=!0,o.__suppressDeprecationWarning=!0,a.__suppressDeprecationWarning=!0},8421(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.bodyOpenClassName=t.portalClassName=void 0;var r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},o=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),a=n(1594),i=f(a),s=f(n(5206)),l=f(n(390)),c=f(n(2159)),u=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}(n(1755)),d=n(8901),p=f(d),h=n(3072);function f(e){return e&&e.__esModule?e:{default:e}}function m(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}var g=t.portalClassName="ReactModalPortal",y=t.bodyOpenClassName="ReactModal__Body--open",b=d.canUseDOM&&void 0!==s.default.createPortal,v=function(e){return document.createElement(e)},k=function(){return b?s.default.createPortal:s.default.unstable_renderSubtreeIntoContainer};function x(e){return e()}var w=function(e){function t(){var e,n,o;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);for(var a=arguments.length,l=Array(a),u=0;u<a;u++)l[u]=arguments[u];return n=o=m(this,(e=t.__proto__||Object.getPrototypeOf(t)).call.apply(e,[this].concat(l))),o.removePortal=function(){!b&&s.default.unmountComponentAtNode(o.node);var e=x(o.props.parentSelector);e&&e.contains(o.node)?e.removeChild(o.node):console.warn('React-Modal: "parentSelector" prop did not returned any DOM element. Make sure that the parent element is unmounted to avoid any memory leaks.')},o.portalRef=function(e){o.portal=e},o.renderPortal=function(e){var n=k()(o,i.default.createElement(c.default,r({defaultStyles:t.defaultStyles},e)),o.node);o.portalRef(n)},m(o,n)}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),o(t,[{key:"componentDidMount",value:function(){d.canUseDOM&&(b||(this.node=v("div")),this.node.className=this.props.portalClassName,x(this.props.parentSelector).appendChild(this.node),!b&&this.renderPortal(this.props))}},{key:"getSnapshotBeforeUpdate",value:function(e){return{prevParent:x(e.parentSelector),nextParent:x(this.props.parentSelector)}}},{key:"componentDidUpdate",value:function(e,t,n){if(d.canUseDOM){var r=this.props,o=r.isOpen,a=r.portalClassName;e.portalClassName!==a&&(this.node.className=a);var i=n.prevParent,s=n.nextParent;s!==i&&(i.removeChild(this.node),s.appendChild(this.node)),(e.isOpen||o)&&!b&&this.renderPortal(this.props)}}},{key:"componentWillUnmount",value:function(){if(d.canUseDOM&&this.node&&this.portal){var e=this.portal.state,t=Date.now(),n=e.isOpen&&this.props.closeTimeoutMS&&(e.closesAt||t+this.props.closeTimeoutMS);n?(e.beforeClose||this.portal.closeWithTimeout(),setTimeout(this.removePortal,n-t)):this.removePortal()}}},{key:"render",value:function(){return d.canUseDOM&&b?(!this.node&&b&&(this.node=v("div")),k()(i.default.createElement(c.default,r({ref:this.portalRef,defaultStyles:t.defaultStyles},this.props)),this.node)):null}}],[{key:"setAppElement",value:function(e){u.setElement(e)}}]),t}(a.Component);w.propTypes={isOpen:l.default.bool.isRequired,style:l.default.shape({content:l.default.object,overlay:l.default.object}),portalClassName:l.default.string,bodyOpenClassName:l.default.string,htmlOpenClassName:l.default.string,className:l.default.oneOfType([l.default.string,l.default.shape({base:l.default.string.isRequired,afterOpen:l.default.string.isRequired,beforeClose:l.default.string.isRequired})]),overlayClassName:l.default.oneOfType([l.default.string,l.default.shape({base:l.default.string.isRequired,afterOpen:l.default.string.isRequired,beforeClose:l.default.string.isRequired})]),appElement:l.default.oneOfType([l.default.instanceOf(p.default),l.default.instanceOf(d.SafeHTMLCollection),l.default.instanceOf(d.SafeNodeList),l.default.arrayOf(l.default.instanceOf(p.default))]),onAfterOpen:l.default.func,onRequestClose:l.default.func,closeTimeoutMS:l.default.number,ariaHideApp:l.default.bool,shouldFocusAfterRender:l.default.bool,shouldCloseOnOverlayClick:l.default.bool,shouldReturnFocusAfterClose:l.default.bool,preventScroll:l.default.bool,parentSelector:l.default.func,aria:l.default.object,data:l.default.object,role:l.default.string,contentLabel:l.default.string,shouldCloseOnEsc:l.default.bool,overlayRef:l.default.func,contentRef:l.default.func,id:l.default.string,overlayElement:l.default.func,contentElement:l.default.func},w.defaultProps={isOpen:!1,portalClassName:g,bodyOpenClassName:y,role:"dialog",ariaHideApp:!0,closeTimeoutMS:0,shouldFocusAfterRender:!0,shouldCloseOnEsc:!0,shouldCloseOnOverlayClick:!0,shouldReturnFocusAfterClose:!0,preventScroll:!1,parentSelector:function(){return document.body},overlayElement:function(e,t){return i.default.createElement("div",e,t)},contentElement:function(e,t){return i.default.createElement("div",e,t)}},w.defaultStyles={overlay:{position:"fixed",top:0,left:0,right:0,bottom:0,backgroundColor:"rgba(255, 255, 255, 0.75)"},content:{position:"absolute",top:"40px",left:"40px",right:"40px",bottom:"40px",border:"1px solid #ccc",background:"#fff",overflow:"auto",WebkitOverflowScrolling:"touch",borderRadius:"4px",outline:"none",padding:"20px"}},(0,h.polyfill)(w),t.default=w},2159(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),i=n(1594),s=g(n(390)),l=m(n(6910)),c=g(n(4862)),u=m(n(1755)),d=m(n(2809)),p=n(8901),h=g(p),f=g(n(3503));function m(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}function g(e){return e&&e.__esModule?e:{default:e}}n(8718);var y={overlay:"ReactModal__Overlay",content:"ReactModal__Content"},b=0,v=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var n=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.setOverlayRef=function(e){n.overlay=e,n.props.overlayRef&&n.props.overlayRef(e)},n.setContentRef=function(e){n.content=e,n.props.contentRef&&n.props.contentRef(e)},n.afterClose=function(){var e=n.props,t=e.appElement,r=e.ariaHideApp,o=e.htmlOpenClassName,a=e.bodyOpenClassName,i=e.parentSelector,s=i&&i().ownerDocument||document;a&&d.remove(s.body,a),o&&d.remove(s.getElementsByTagName("html")[0],o),r&&b>0&&0===(b-=1)&&u.show(t),n.props.shouldFocusAfterRender&&(n.props.shouldReturnFocusAfterClose?(l.returnFocus(n.props.preventScroll),l.teardownScopedFocus()):l.popWithoutFocus()),n.props.onAfterClose&&n.props.onAfterClose(),f.default.deregister(n)},n.open=function(){n.beforeOpen(),n.state.afterOpen&&n.state.beforeClose?(clearTimeout(n.closeTimer),n.setState({beforeClose:!1})):(n.props.shouldFocusAfterRender&&(l.setupScopedFocus(n.node),l.markForFocusLater()),n.setState({isOpen:!0},(function(){n.openAnimationFrame=requestAnimationFrame((function(){n.setState({afterOpen:!0}),n.props.isOpen&&n.props.onAfterOpen&&n.props.onAfterOpen({overlayEl:n.overlay,contentEl:n.content})}))})))},n.close=function(){n.props.closeTimeoutMS>0?n.closeWithTimeout():n.closeWithoutTimeout()},n.focusContent=function(){return n.content&&!n.contentHasFocus()&&n.content.focus({preventScroll:!0})},n.closeWithTimeout=function(){var e=Date.now()+n.props.closeTimeoutMS;n.setState({beforeClose:!0,closesAt:e},(function(){n.closeTimer=setTimeout(n.closeWithoutTimeout,n.state.closesAt-Date.now())}))},n.closeWithoutTimeout=function(){n.setState({beforeClose:!1,isOpen:!1,afterOpen:!1,closesAt:null},n.afterClose)},n.handleKeyDown=function(e){(function(e){return"Tab"===e.code||9===e.keyCode})(e)&&(0,c.default)(n.content,e),n.props.shouldCloseOnEsc&&function(e){return"Escape"===e.code||27===e.keyCode}(e)&&(e.stopPropagation(),n.requestClose(e))},n.handleOverlayOnClick=function(e){null===n.shouldClose&&(n.shouldClose=!0),n.shouldClose&&n.props.shouldCloseOnOverlayClick&&(n.ownerHandlesClose()?n.requestClose(e):n.focusContent()),n.shouldClose=null},n.handleContentOnMouseUp=function(){n.shouldClose=!1},n.handleOverlayOnMouseDown=function(e){n.props.shouldCloseOnOverlayClick||e.target!=n.overlay||e.preventDefault()},n.handleContentOnClick=function(){n.shouldClose=!1},n.handleContentOnMouseDown=function(){n.shouldClose=!1},n.requestClose=function(e){return n.ownerHandlesClose()&&n.props.onRequestClose(e)},n.ownerHandlesClose=function(){return n.props.onRequestClose},n.shouldBeClosed=function(){return!n.state.isOpen&&!n.state.beforeClose},n.contentHasFocus=function(){return document.activeElement===n.content||n.content.contains(document.activeElement)},n.buildClassName=function(e,t){var r="object"===(void 0===t?"undefined":o(t))?t:{base:y[e],afterOpen:y[e]+"--after-open",beforeClose:y[e]+"--before-close"},a=r.base;return n.state.afterOpen&&(a=a+" "+r.afterOpen),n.state.beforeClose&&(a=a+" "+r.beforeClose),"string"==typeof t&&t?a+" "+t:a},n.attributesFromObject=function(e,t){return Object.keys(t).reduce((function(n,r){return n[e+"-"+r]=t[r],n}),{})},n.state={afterOpen:!1,beforeClose:!1},n.shouldClose=null,n.moveFromContentToOverlay=null,n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),a(t,[{key:"componentDidMount",value:function(){this.props.isOpen&&this.open()}},{key:"componentDidUpdate",value:function(e,t){this.props.isOpen&&!e.isOpen?this.open():!this.props.isOpen&&e.isOpen&&this.close(),this.props.shouldFocusAfterRender&&this.state.isOpen&&!t.isOpen&&this.focusContent()}},{key:"componentWillUnmount",value:function(){this.state.isOpen&&this.afterClose(),clearTimeout(this.closeTimer),cancelAnimationFrame(this.openAnimationFrame)}},{key:"beforeOpen",value:function(){var e=this.props,t=e.appElement,n=e.ariaHideApp,r=e.htmlOpenClassName,o=e.bodyOpenClassName,a=e.parentSelector,i=a&&a().ownerDocument||document;o&&d.add(i.body,o),r&&d.add(i.getElementsByTagName("html")[0],r),n&&(b+=1,u.hide(t)),f.default.register(this)}},{key:"render",value:function(){var e=this.props,t=e.id,n=e.className,o=e.overlayClassName,a=e.defaultStyles,i=e.children,s=n?{}:a.content,l=o?{}:a.overlay;if(this.shouldBeClosed())return null;var c={ref:this.setOverlayRef,className:this.buildClassName("overlay",o),style:r({},l,this.props.style.overlay),onClick:this.handleOverlayOnClick,onMouseDown:this.handleOverlayOnMouseDown},u=r({id:t,ref:this.setContentRef,style:r({},s,this.props.style.content),className:this.buildClassName("content",n),tabIndex:"-1",onKeyDown:this.handleKeyDown,onMouseDown:this.handleContentOnMouseDown,onMouseUp:this.handleContentOnMouseUp,onClick:this.handleContentOnClick,role:this.props.role,"aria-label":this.props.contentLabel},this.attributesFromObject("aria",r({modal:!0},this.props.aria)),this.attributesFromObject("data",this.props.data||{}),{"data-testid":this.props.testId}),d=this.props.contentElement(u,i);return this.props.overlayElement(c,d)}}]),t}(i.Component);v.defaultProps={style:{overlay:{},content:{}},defaultStyles:{}},v.propTypes={isOpen:s.default.bool.isRequired,defaultStyles:s.default.shape({content:s.default.object,overlay:s.default.object}),style:s.default.shape({content:s.default.object,overlay:s.default.object}),className:s.default.oneOfType([s.default.string,s.default.object]),overlayClassName:s.default.oneOfType([s.default.string,s.default.object]),parentSelector:s.default.func,bodyOpenClassName:s.default.string,htmlOpenClassName:s.default.string,ariaHideApp:s.default.bool,appElement:s.default.oneOfType([s.default.instanceOf(h.default),s.default.instanceOf(p.SafeHTMLCollection),s.default.instanceOf(p.SafeNodeList),s.default.arrayOf(s.default.instanceOf(h.default))]),onAfterOpen:s.default.func,onAfterClose:s.default.func,onRequestClose:s.default.func,closeTimeoutMS:s.default.number,shouldFocusAfterRender:s.default.bool,shouldCloseOnOverlayClick:s.default.bool,shouldReturnFocusAfterClose:s.default.bool,preventScroll:s.default.bool,role:s.default.string,contentLabel:s.default.string,aria:s.default.object,data:s.default.object,children:s.default.node,shouldCloseOnEsc:s.default.bool,overlayRef:s.default.func,contentRef:s.default.func,id:s.default.string,overlayElement:s.default.func,contentElement:s.default.func,testId:s.default.string},t.default=v,e.exports=t.default},1755(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.resetState=function(){s&&(s.removeAttribute?s.removeAttribute("aria-hidden"):null!=s.length?s.forEach((function(e){return e.removeAttribute("aria-hidden")})):document.querySelectorAll(s).forEach((function(e){return e.removeAttribute("aria-hidden")})));s=null},t.log=function(){0},t.assertNodeList=l,t.setElement=function(e){var t=e;if("string"==typeof t&&i.canUseDOM){var n=document.querySelectorAll(t);l(n,t),t=n}return s=t||s},t.validateElement=c,t.hide=function(e){var t=!0,n=!1,r=void 0;try{for(var o,a=c(e)[Symbol.iterator]();!(t=(o=a.next()).done);t=!0){o.value.setAttribute("aria-hidden","true")}}catch(e){n=!0,r=e}finally{try{!t&&a.return&&a.return()}finally{if(n)throw r}}},t.show=function(e){var t=!0,n=!1,r=void 0;try{for(var o,a=c(e)[Symbol.iterator]();!(t=(o=a.next()).done);t=!0){o.value.removeAttribute("aria-hidden")}}catch(e){n=!0,r=e}finally{try{!t&&a.return&&a.return()}finally{if(n)throw r}}},t.documentNotReadyOrSSRTesting=function(){s=null};var r,o=n(8400),a=(r=o)&&r.__esModule?r:{default:r},i=n(8901);var s=null;function l(e,t){if(!e||!e.length)throw new Error("react-modal: No elements were found for selector "+t+".")}function c(e){var t=e||s;return t?Array.isArray(t)||t instanceof HTMLCollection||t instanceof NodeList?t:[t]:((0,a.default)(!1,["react-modal: App element is not defined.","Please use `Modal.setAppElement(el)` or set `appElement={el}`.","This is needed so screen readers don't see main content","when modal is opened. It is not recommended, but you can opt-out","by setting `ariaHideApp={false}`."].join(" ")),[])}},8718(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.resetState=function(){for(var e=[i,s],t=0;t<e.length;t++){var n=e[t];n&&(n.parentNode&&n.parentNode.removeChild(n))}i=s=null,l=[]},t.log=function(){console.log("bodyTrap ----------"),console.log(l.length);for(var e=[i,s],t=0;t<e.length;t++){var n=e[t]||{};console.log(n.nodeName,n.className,n.id)}console.log("edn bodyTrap ----------")};var r,o=n(3503),a=(r=o)&&r.__esModule?r:{default:r};var i=void 0,s=void 0,l=[];function c(){0!==l.length&&l[l.length-1].focusContent()}a.default.subscribe((function(e,t){i||s||((i=document.createElement("div")).setAttribute("data-react-modal-body-trap",""),i.style.position="absolute",i.style.opacity="0",i.setAttribute("tabindex","0"),i.addEventListener("focus",c),(s=i.cloneNode()).addEventListener("focus",c)),(l=t).length>0?(document.body.firstChild!==i&&document.body.insertBefore(i,document.body.firstChild),document.body.lastChild!==s&&document.body.appendChild(s)):(i.parentElement&&i.parentElement.removeChild(i),s.parentElement&&s.parentElement.removeChild(s))}))},2809(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.resetState=function(){var e=document.getElementsByTagName("html")[0];for(var t in n)o(e,n[t]);var a=document.body;for(var i in r)o(a,r[i]);n={},r={}},t.log=function(){0};var n={},r={};function o(e,t){e.classList.remove(t)}t.add=function(e,t){return o=e.classList,a="html"==e.nodeName.toLowerCase()?n:r,void t.split(" ").forEach((function(e){!function(e,t){e[t]||(e[t]=0),e[t]+=1}(a,e),o.add(e)}));var o,a},t.remove=function(e,t){return o=e.classList,a="html"==e.nodeName.toLowerCase()?n:r,void t.split(" ").forEach((function(e){!function(e,t){e[t]&&(e[t]-=1)}(a,e),0===a[e]&&o.remove(e)}));var o,a}},6910(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.resetState=function(){i=[]},t.log=function(){0},t.handleBlur=c,t.handleFocus=u,t.markForFocusLater=function(){i.push(document.activeElement)},t.returnFocus=function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],t=null;try{return void(0!==i.length&&(t=i.pop()).focus({preventScroll:e}))}catch(e){console.warn(["You tried to return focus to",t,"but it is not in the DOM anymore"].join(" "))}},t.popWithoutFocus=function(){i.length>0&&i.pop()},t.setupScopedFocus=function(e){s=e,window.addEventListener?(window.addEventListener("blur",c,!1),document.addEventListener("focus",u,!0)):(window.attachEvent("onBlur",c),document.attachEvent("onFocus",u))},t.teardownScopedFocus=function(){s=null,window.addEventListener?(window.removeEventListener("blur",c),document.removeEventListener("focus",u)):(window.detachEvent("onBlur",c),document.detachEvent("onFocus",u))};var r,o=n(7338),a=(r=o)&&r.__esModule?r:{default:r};var i=[],s=null,l=!1;function c(){l=!0}function u(){if(l){if(l=!1,!s)return;setTimeout((function(){s.contains(document.activeElement)||((0,a.default)(s)[0]||s).focus()}),0)}}},3503(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.log=function(){console.log("portalOpenInstances ----------"),console.log(r.openInstances.length),r.openInstances.forEach((function(e){return console.log(e)})),console.log("end portalOpenInstances ----------")},t.resetState=function(){r=new n};var n=function e(){var t=this;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.register=function(e){-1===t.openInstances.indexOf(e)&&(t.openInstances.push(e),t.emit("register"))},this.deregister=function(e){var n=t.openInstances.indexOf(e);-1!==n&&(t.openInstances.splice(n,1),t.emit("deregister"))},this.subscribe=function(e){t.subscribers.push(e)},this.emit=function(e){t.subscribers.forEach((function(n){return n(e,t.openInstances.slice())}))},this.openInstances=[],this.subscribers=[]},r=new n;t.default=r},8901(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.canUseDOM=t.SafeNodeList=t.SafeHTMLCollection=void 0;var r,o=n(5990);var a=((r=o)&&r.__esModule?r:{default:r}).default,i=a.canUseDOM?window.HTMLElement:{};t.SafeHTMLCollection=a.canUseDOM?window.HTMLCollection:{},t.SafeNodeList=a.canUseDOM?window.NodeList:{},t.canUseDOM=a.canUseDOM;t.default=i},4862(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t){var n=(0,a.default)(e);if(!n.length)return void t.preventDefault();var r=void 0,o=t.shiftKey,s=n[0],l=n[n.length-1],c=i();if(e===c){if(!o)return;r=l}l!==c||o||(r=s);s===c&&o&&(r=l);if(r)return t.preventDefault(),void r.focus();var u=/(\bChrome\b|\bSafari\b)\//.exec(navigator.userAgent);if(null==u||"Chrome"==u[1]||null!=/\biPod\b|\biPad\b/g.exec(navigator.userAgent))return;var d=n.indexOf(c);d>-1&&(d+=o?-1:1);if(void 0===(r=n[d]))return t.preventDefault(),void(r=o?l:s).focus();t.preventDefault(),r.focus()};var r,o=n(7338),a=(r=o)&&r.__esModule?r:{default:r};function i(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:document;return e.activeElement.shadowRoot?i(e.activeElement.shadowRoot):e.activeElement}e.exports=t.default},7338(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function e(t){var n=[].slice.call(t.querySelectorAll("*"),0).reduce((function(t,n){return t.concat(n.shadowRoot?e(n.shadowRoot):[n])}),[]);return n.filter(a)};
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
var n=/^(input|select|textarea|button|object|iframe)$/;function r(e){var t=e.offsetWidth<=0&&e.offsetHeight<=0;if(t&&!e.innerHTML)return!0;try{var n=window.getComputedStyle(e),r=n.getPropertyValue("display");return t?"contents"!==r&&function(e,t){return"visible"!==t.getPropertyValue("overflow")||e.scrollWidth<=0&&e.scrollHeight<=0}(e,n):"none"===r}catch(e){return console.warn("Failed to inspect element style"),!1}}function o(e,t){var o=e.nodeName.toLowerCase();return(n.test(o)&&!e.disabled||"a"===o&&e.href||t)&&function(e){for(var t=e,n=e.getRootNode&&e.getRootNode();t&&t!==document.body;){if(n&&t===n&&(t=n.host.parentNode),r(t))return!1;t=t.parentNode}return!0}(e)}function a(e){var t=e.getAttribute("tabindex");null===t&&(t=void 0);var n=isNaN(t);return(n||t>=0)&&o(e,!n)}e.exports=t.default},6995(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r,o=n(8421),a=(r=o)&&r.__esModule?r:{default:r};t.default=a.default,e.exports=t.default},8400(e){"use strict";var t=function(){};e.exports=t},5373(e,t,n){"use strict";n.d(t,{A:()=>l,z:()=>i});var r=n(5396);const o={white:"hsl(0 0% 100%)",black:"hsl(0 0% 0%)",blue:"hsl(217 80% 42%)",blue10:"hsl(217 85% 22%)",blue50:"hsl(217 75% 58%)",blue80:"hsl(217 60% 88%)",blue95:"hsl(217 80% 96%)",green:"hsl(155 75% 42%)",green90:"hsl(155 60% 92%)",cyan:"hsl(188 85% 46%)",red:"hsl(358 76% 54%)",red90:"hsl(358 85% 96%)",orange:"hsl(28 92% 52%)",yellow:"hsl(45 92% 54%)",purple:"hsl(262 72% 62%)",gray30:"hsl(220 18% 20%)",gray40:"hsl(220 12% 34%)",gray50:"hsl(220 10% 48%)",gray60:"hsl(220 12% 62%)",gray70:"hsl(220 14% 76%)",gray80:"hsl(220 16% 86%)",gray90:"hsl(220 20% 92%)",gray95:"hsl(220 24% 96%)",gray98:"hsl(220 30% 98%)"},a=r.DU`
  :root {
    /* Base colors */
    --neko-blue: ${o.blue};
    --neko-white: ${o.white};
    --neko-black: ${o.black};
    --neko-purple: ${o.purple};
    --neko-orange: ${o.orange};
    --neko-yellow: ${o.yellow};
    --neko-green: ${o.green};
    --neko-cyan: ${o.cyan};
    --neko-red: ${o.red};

    /* Gray scale */
    --neko-gray-30: ${o.gray30};
    --neko-gray-40: ${o.gray40};
    --neko-gray-50: ${o.gray50};
    --neko-gray-60: ${o.gray60};
    --neko-gray-70: ${o.gray70};
    --neko-gray-80: ${o.gray80};
    --neko-gray-90: ${o.gray90};
    --neko-gray-95: ${o.gray95};
    --neko-gray-98: ${o.gray98};

    /* Main color (primary = cat blue) */
    --neko-main-color: var(--neko-blue);
    --neko-main-color-10: ${o.blue10};
    --neko-main-color-50: ${o.blue50};
    --neko-main-color-80: ${o.blue80};
    --neko-main-color-95: ${o.blue95};
    --neko-main-color-98: hsl(217 50% 99%);
    --neko-main-overlay-color: rgb(30 86 220 / 85%);

    /* Variants */
    --neko-success: var(--neko-green);
    --neko-primary: var(--neko-main-color);
    --neko-secondary: ${o.blue95};
    --neko-danger: var(--neko-red);
    --neko-warning: var(--neko-orange);
    --neko-lighten-green: ${o.green90};
    --neko-lighten-red: ${o.red90};

    /* Accent (checkbox/switch confirmation = cat green) */
    --neko-accent-color: var(--neko-green);
    --neko-accent-color-90: ${o.green90};

    /* Typography — WordPress admin system stack by default so plugins feel
       native inside wp-admin. Stories that want the Inter variable can
       override --neko-font-family locally. */
    --neko-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    --neko-font-mono: 'JetBrains Mono', 'SF Mono', 'Menlo', monospace;
    --neko-font-size: 13px;
    --neko-small-font-size: 12px;
    --neko-h1-font-size: 24px;
    --neko-h2-font-size: 20px;
    --neko-h3-font-size: 17px;
    --neko-h4-font-size: 15px;
    --neko-h5-font-size: 14px;
    --neko-h6-font-size: 13px;
    --neko-font-color: var(--neko-gray-30);

    /* Motion tokens */
    --neko-ease-out: cubic-bezier(0.16, 1, 0.3, 1);
    --neko-ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
    --neko-duration-fast: 140ms;
    --neko-duration-base: 220ms;
    --neko-duration-slow: 360ms;

    /* Form control baseline — every input, select, button, checkbox, and the
       line-height on Settings titles reads from this token. Change it here,
       all controls re-align together. */
    --neko-control-height: 30px;
    --neko-control-height-small: 24px;
    --neko-control-height-large: 44px;

    /* Surface title — the "white title above a white card" spec that
       NekoBlock.primary and NekoTabs inversed share. Define once so they
       stay visually identical when placed side-by-side. */
    --neko-surface-title-font-size: 18px;
    --neko-surface-title-font-weight: 600;
    --neko-surface-title-line-height: 1.25;
    --neko-surface-title-letter-spacing: 0;
    --neko-surface-title-padding-bottom: 8px;
    --neko-surface-section-gap: 16px;

    /* Radii & Shadows — refined multi-layer shadows */
    --neko-radius-sm: 8px;
    --neko-radius-md: 12px;
    --neko-radius-lg: 16px;
    --neko-shadow-xs: 0 1px 2px rgba(15, 23, 42, 0.04);
    --neko-shadow-sm: 0 1px 3px rgba(15, 23, 42, 0.06), 0 1px 2px rgba(15, 23, 42, 0.04);
    --neko-shadow-md: 0 6px 16px rgba(15, 23, 42, 0.08), 0 2px 4px rgba(15, 23, 42, 0.05);
    --neko-shadow-lg: 0 20px 40px rgba(15, 23, 42, 0.12), 0 6px 14px rgba(15, 23, 42, 0.07);
    --neko-focus-ring: 0 0 0 3px color-mix(in oklab, var(--neko-main-color) 24%, transparent);

    /* Neko UI */
    --neko-wp-background-color: #f0f0f1;
    --neko-background-color: var(--neko-wp-background-color);
    --neko-disabled-color: var(--neko-gray-60);
    --neko-main-color-alternative: var(--neko-main-color-10);
    --neko-main-color-disabled: var(--neko-main-color-50);
    --neko-input-background: var(--neko-white);
    --neko-input-border: var(--neko-gray-90);
  }

  /* Base reset/typography and focus treatments */
  html {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }
  body {
    font-family: var(--neko-font-family);
    color: var(--neko-font-color);
    background-color: var(--neko-background-color);
  }
  :focus-visible { outline: none; box-shadow: var(--neko-focus-ring); }

  /* Brand-tinted text selection */
  ::selection {
    background: color-mix(in oklab, var(--neko-main-color) 24%, transparent);
    color: var(--neko-font-color);
  }

  /* Tabular nums helper — for tables, counters, metrics */
  .neko-numeric, .neko-tabular {
    font-variant-numeric: tabular-nums;
    font-feature-settings: 'tnum' 1;
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.001ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.001ms !important;
    }
  }
`,i=()=>({colors:o}),s=({children:e})=>React.createElement(React.Fragment,null,React.createElement(a,{key:"neko-ui-styles"}),e),l=({children:e})=>React.createElement(s,null,e)},1863(e,t,n){"use strict";n.d(t,{M:()=>f});var r=n(1594),o=n.n(r),a=n(390),i=n.n(a),s=n(5396),l=n(9018),c=n(8074),u=n(6038);function d(){return d=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)({}).hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},d.apply(null,arguments)}const p=(0,s.Ay)((e=>{let{className:t="primary",variant:n,disabled:a=!1,icon:i=null,color:s=null,onClick:p=(()=>{}),onStopClick:h=null,rounded:f,isBusy:m=!1,busy:g=!1,spinning:y=!1,disabledColor:b=null,busyText:v,hideBusyIcon:k=!1,busyIconSize:x,requirePro:w=!1,isPro:C=!1,small:E,large:A,width:S,height:O,fullWidth:M,startTime:R=null,progress:_=null,ai:$=!1,children:N,...z}=e;const T=g||m;o().useEffect((()=>{m&&console.log('NekoButton: The "isBusy" prop is deprecated. Please use "busy" instead.')}),[m]);const P=o().useRef(null),j=o().useRef(null),[I,L]=o().useState(null);o().useLayoutEffect((()=>{P.current&&!j.current&&(j.current=P.current.offsetWidth)})),o().useEffect((()=>{if(!T&&!h){const e=setTimeout((()=>{L(null)}),300);return()=>clearTimeout(e)}}),[T,h]),o().useEffect((()=>{t&&["primary","primary-block","secondary","danger","success","warning","header"].includes(t)&&!n&&console.warn(`NekoButton: Using 'className' prop for button variants is deprecated. Please use 'variant' prop instead. Found className="${t}"`)}),[t,n]);const F=n||(["primary","primary-block","secondary","danger","success","warning","header"].includes(t)?t:"primary"),q=t&&!["primary","primary-block","secondary","danger","success","warning","header"].includes(t)?t:"";o().useEffect((()=>{$&&(n||["secondary","danger","success","warning","header"].includes(F))&&console.warn('NekoButton: The "ai" property doesn\'t need a variant. The ai styling will override the variant styling.')}),[$,n,F]);const D=a||w&&!C,B=!!i,W=w&&!C,H=!!h&&T,U=(0,r.useMemo)((()=>{let e="number"==typeof S?S:30;return E&&(e*=.8),A&&(e*=1.3),"header"===F||t&&t.includes("header")?20:f?e-12:e-14}),[S,f,E,A,F,t]),[Q,K]=(0,r.useState)(null);(0,u.$$)((()=>K(new Date)),R?1e3:null),(0,r.useEffect)((()=>{R||K(null)}),[R]);const G=(0,r.useMemo)((()=>{if(!R||!Q)return null;const e=Math.floor((Q-R)/1e3),t=e%60;return`${Math.floor(e/60).toString().padStart(2,"0")}:${t.toString().padStart(2,"0")}`}),[Q,R]),V=(0,u.gR)("neko-button",F,q,{"has-icon":B},{"custom-color":s},{small:E},{large:A},{rounded:f},{busy:T},{"is-pro":W},{full:M},{"has-stop":H},{ai:$});return o().createElement("button",d({ref:P,type:"button",className:V,onClick:e=>{if(!T&&P.current){const e=h&&j.current?j.current:P.current.offsetWidth;L(e)}D||H||p(),e.stopPropagation(),e.preventDefault()},disabled:D&&!(T&&H),style:T&&I?{minWidth:`${I}px`,width:`${I}px`}:void 0},z),T&&null!==_&&_>0&&o().createElement("div",{className:"progress-bar",style:{width:`${_}%`}}),T&&!H&&!k&&o().createElement("div",{className:"busy-wrapper"},o().createElement("div",{className:"busy-icon"},o().createElement(l.z,{raw:!0,icon:"sync",width:16,height:16})),null!==_&&_>=0&&o().createElement("span",{className:"progress-percentage"},Math.round(_),"%"),G&&o().createElement("span",{className:"chrono-time"},G)),!T&&!H&&o().createElement("div",{className:"normal-content"},B&&!f&&!!N&&o().createElement("div",{className:"icon-section"},o().createElement(l.z,{raw:!0,icon:i,width:U,height:U,spinning:y,strokeWidth:f&&E?3:void 0})),B&&!f&&!N&&o().createElement(l.z,{raw:!0,icon:i,width:U,height:U,spinning:y,style:{margin:"0 auto"},strokeWidth:f&&E?3:void 0}),B&&f&&o().createElement(l.z,{raw:!0,icon:i,width:U,height:U,spinning:y,style:{margin:"0 auto"},strokeWidth:f&&E?3:void 0}),!!N&&o().createElement("span",{className:B&&!f?"button-text":""},N)),H&&o().createElement(o().Fragment,null,o().createElement("div",{className:"busy-icon"},o().createElement(l.z,{raw:!0,icon:"sync",width:16,height:16})),o().createElement("div",{className:"stop-section",onClick:e=>{e.stopPropagation(),h()}},o().createElement(l.z,{raw:!0,icon:"stop",width:"14",height:"14"}))),W&&o().createElement(c.K,{style:{marginLeft:"8px"}}))}))`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  height: var(--neko-control-height);
  min-height: var(--neko-control-height);
  min-width: 36px;
  border: none;
  border-radius: 7px;
  text-align: center;
  padding: 0 14px;
  vertical-align: middle;
  font-family: inherit;
  font-size: var(--neko-font-size);
  font-weight: 500;
  letter-spacing: 0;
  /* A subtle vertical gradient + inner top highlight gives the primary fill
     a touch of dimensionality without being glossy. Feels considered, not stock. */
  background:
    linear-gradient(180deg,
      color-mix(in oklab, var(--neko-main-color) 94%, white) 0%,
      var(--neko-main-color) 55%,
      color-mix(in oklab, var(--neko-main-color) 94%, black) 100%);
  color: white;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.18),
    0 1px 2px rgba(15, 23, 42, 0.15);
  transition:
    background 0.2s var(--neko-ease-out),
    box-shadow 0.2s var(--neko-ease-out),
    transform 0.22s var(--neko-ease-spring),
    filter 0.2s var(--neko-ease-out),
    opacity 0.2s ease;
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
    opacity: 0.5;
    mix-blend-mode: overlay;
  }
  
  /* Ensure content appears above progress bar */
  .busy-wrapper,
  .normal-content,
  .busy-icon,
  .stop-section,
  .chrono-time,
  .progress-percentage {
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
  }

  .progress-percentage {
    font-size: 11px;
    font-weight: 600;
  }

  &:not([disabled]):hover {
    cursor: pointer;
    filter: brightness(1.04);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.22),
      0 4px 12px color-mix(in oklab, var(--neko-main-color) 28%, transparent),
      0 1px 2px rgba(15, 23, 42, 0.15);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    filter: saturate(0.7);
  }

  &:focus { outline: none; }
  &:focus-visible {
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.18),
      0 1px 2px rgba(15, 23, 42, 0.15),
      var(--neko-focus-ring);
  }

  &:active:not([disabled]) {
    transform: translateY(0) scale(0.985);
    box-shadow:
      inset 0 2px 3px rgba(0, 0, 0, 0.15),
      0 1px 1px rgba(15, 23, 42, 0.1);
    transition-duration: 80ms;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    &:not([disabled]):hover { transform: none; box-shadow: var(--neko-shadow-xs); }
  }


  &.is-pro {
    background-image: none;
    background-color: var(--neko-main-color-disabled);
    color: rgb(255 255 255 / 65%);
    align-items: center;
    opacity: 1;
  }

  &.has-icon {
    align-items: center;
    position: relative;

    svg {
      color: white;
    }
  }

  /* Secondary — quiet off-white chip that pairs with the bold primary.
     Flat fill (no gradient) keeps it calm; the border does the work. */
  &.secondary {
    background: color-mix(in oklab, var(--neko-main-color) 3%, white);
    color: var(--neko-main-color);
    border: 1px solid color-mix(in oklab, var(--neko-main-color) 18%, transparent);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.6),
      0 1px 1px rgba(15, 23, 42, 0.04);

    svg {
      color: var(--neko-main-color);
    }

    &:not([disabled]):hover {
      background: color-mix(in oklab, var(--neko-main-color) 7%, white);
      border-color: color-mix(in oklab, var(--neko-main-color) 32%, transparent);
      filter: none;
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.7),
        0 2px 6px rgba(15, 23, 42, 0.06);
      transform: translateY(-1px);
    }

    &:focus-visible {
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.6),
        var(--neko-focus-ring);
    }

    .icon-section {
      border-right-color: color-mix(in oklab, var(--neko-main-color) 18%, transparent);
    }
  }

  /* Semantic variants — flat fill, tinted hover glow that matches each color. */
  &.danger {
    background:
      linear-gradient(180deg,
        color-mix(in oklab, var(--neko-danger) 94%, white) 0%,
        var(--neko-danger) 55%,
        color-mix(in oklab, var(--neko-danger) 94%, black) 100%);
    border-color: var(--neko-danger);

    &:not([disabled]):hover {
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.22),
        0 4px 12px color-mix(in oklab, var(--neko-danger) 30%, transparent),
        0 1px 2px rgba(15, 23, 42, 0.15);
    }
  }

  &.success {
    background:
      linear-gradient(180deg,
        color-mix(in oklab, var(--neko-accent-color) 94%, white) 0%,
        var(--neko-accent-color) 55%,
        color-mix(in oklab, var(--neko-accent-color) 94%, black) 100%);
    border-color: var(--neko-accent-color);

    &:not([disabled]):hover {
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.22),
        0 4px 12px color-mix(in oklab, var(--neko-accent-color) 30%, transparent),
        0 1px 2px rgba(15, 23, 42, 0.15);
    }
  }

  &.warning {
    background:
      linear-gradient(180deg,
        color-mix(in oklab, var(--neko-warning) 94%, white) 0%,
        var(--neko-warning) 55%,
        color-mix(in oklab, var(--neko-warning) 94%, black) 100%);
    border-color: var(--neko-warning);

    &:not([disabled]):hover {
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.22),
        0 4px 12px color-mix(in oklab, var(--neko-warning) 30%, transparent),
        0 1px 2px rgba(15, 23, 42, 0.15);
    }
  }

  /* Safety-net spacing for sibling buttons — preferred practice is parent
     flex gap, but many existing plugin layouts render buttons as plain
     inline-block siblings. 5px keeps those from touching; with a gap-based
     parent, the effective spacing becomes parent-gap + 5px. */
  & + button.neko-button {
    margin-left: 5px;
  }

  &.small {
    font-size: var(--neko-small-font-size);
    height: var(--neko-control-height-small);
    min-height: var(--neko-control-height-small);
    border-radius: 6px;
    padding: 0 10px;
  }

  &.large {
    height: var(--neko-control-height-large);
    min-height: var(--neko-control-height-large);
    font-size: 15px;
    padding: 0 20px;
    border-radius: 9px;
  }

  /* Header variant — ghost glass button for use on the branded NekoHeader.
     Stays glassy throughout; hover just brightens the glass + lifts softly. */
  &.header {
    background: rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.26);
    height: 38px;
    padding: 0 16px;
    font-weight: 500;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.14);
    transition:
      background 0.3s var(--neko-ease-out),
      border-color 0.3s var(--neko-ease-out),
      box-shadow 0.3s var(--neko-ease-out),
      transform 0.3s var(--neko-ease-spring);

    svg { color: white; }

    &:hover {
      background: rgba(255, 255, 255, 0.22);
      border-color: rgba(255, 255, 255, 0.5);
      filter: none;
      box-shadow:
        0 6px 18px rgba(0, 0, 0, 0.14),
        inset 0 1px 0 rgba(255, 255, 255, 0.22);
      transform: translateY(-1px);
    }

    &:active:not([disabled]) {
      transform: translateY(0);
      background: rgba(255, 255, 255, 0.16);
    }

    /* Kill the shimmer sweep from the base primary — ghost doesn't need it */
    &::after { display: none; }

    .icon-section {
      border-right: none;
    }
  }

  /* Apply width/height if provided */
  ${e=>e.width&&"string"==typeof e.width?`width: ${e.width};`:""}
  ${e=>e.width&&"number"==typeof e.width?`width: ${e.width}px;`:""}
  ${e=>e.height&&"string"==typeof e.height?`height: ${e.height};`:""}
  ${e=>e.height&&"number"==typeof e.height?`height: ${e.height}px;`:""}

  &.rounded {
    border-radius: 50%;
    padding: 0;
    /* Explicit size with matching min-height overrides the base 30px min-height,
       otherwise rounded buttons end up 30×30 (oval). */
    --neko-rounded-size: ${e=>e.width??(e.large?50:30)}px;
    width: var(--neko-rounded-size);
    height: ${e=>e.height??"var(--neko-rounded-size)"};
    min-width: var(--neko-rounded-size);
    min-height: var(--neko-rounded-size);
    /* Rounded elevation — a real dark drop shadow (works on any background,
       including the brand-blue tab bar) stacked with a colored halo that
       blooms on light surfaces. The inset highlight sells the "lifted" feel. */
    box-shadow:
      0 6px 14px rgba(15, 23, 42, 0.22),
      0 2px 4px rgba(15, 23, 42, 0.12),
      0 0 0 1px rgba(15, 23, 42, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.28);

    &.small {
      --neko-rounded-size: 24px;
      box-shadow:
        0 3px 8px rgba(15, 23, 42, 0.2),
        0 1px 2px rgba(15, 23, 42, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.22);
    }

    &.success {
      box-shadow:
        0 6px 14px rgba(15, 23, 42, 0.22),
        0 2px 4px rgba(15, 23, 42, 0.12),
        0 0 0 1px color-mix(in oklab, var(--neko-accent-color) 40%, transparent),
        inset 0 1px 0 rgba(255, 255, 255, 0.3);
    }

    &.danger {
      box-shadow:
        0 6px 14px rgba(15, 23, 42, 0.22),
        0 2px 4px rgba(15, 23, 42, 0.12),
        0 0 0 1px color-mix(in oklab, var(--neko-danger) 40%, transparent),
        inset 0 1px 0 rgba(255, 255, 255, 0.3);
    }

    /* Hover lifts harder — shadow spreads further, inset highlights brighten.
       No translateY — rounded buttons stay put; the icon rotation + deeper
       shadow is the feedback. */
    &:not([disabled]):hover {
      transform: none;
      box-shadow:
        0 10px 22px rgba(15, 23, 42, 0.28),
        0 3px 6px rgba(15, 23, 42, 0.14),
        0 0 0 1px rgba(15, 23, 42, 0.14),
        inset 0 1px 0 rgba(255, 255, 255, 0.34);
    }
    &.success:not([disabled]):hover {
      box-shadow:
        0 10px 22px rgba(15, 23, 42, 0.28),
        0 3px 6px rgba(15, 23, 42, 0.14),
        0 0 0 1px color-mix(in oklab, var(--neko-accent-color) 50%, transparent),
        inset 0 1px 0 rgba(255, 255, 255, 0.36);
    }
    &.danger:not([disabled]):hover {
      box-shadow:
        0 10px 22px rgba(15, 23, 42, 0.28),
        0 3px 6px rgba(15, 23, 42, 0.14),
        0 0 0 1px color-mix(in oklab, var(--neko-danger) 50%, transparent),
        inset 0 1px 0 rgba(255, 255, 255, 0.36);
    }

    /* Icon micro-animations on hover — each variant gets its own character */
    svg {
      transition: transform 0.35s var(--neko-ease-spring);
    }
    /* Success + → rotates 90° (add intent) */
    &.success:not([disabled]):hover svg {
      transform: rotate(90deg);
    }
    /* Primary (edit, push, etc.) → gentle tilt + bump */
    &.primary:not([disabled]):hover svg {
      transform: rotate(-8deg) scale(1.08);
    }
    /* Danger (trash) → nervous shake-ish tilt */
    &.danger:not([disabled]):hover svg {
      transform: rotate(8deg) scale(1.08);
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
    width: 100%;
  }

  /* Icon section with separator */
  .icon-section {
    display: flex;
    align-items: center;
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    padding: 0 7px;
    border-right: 1px solid rgba(255, 255, 255, 0.2);
  }

  /* Button text styling when icon is present */
  .button-text {
    white-space: nowrap;
    text-overflow: ellipsis;
    display: flex;
    align-items: center;
    flex: 1;
    justify-content: center;
    padding-left: 40px; /* Space for icon section */
  }

  /* Adjust padding for buttons with icons and text */
  &.has-icon:not(.rounded):has(.button-text) {
    padding-left: 0;
    text-align: center;
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
      gap: 5px;
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

  /* AI button — one gradient, one soft glow. No sparkles, no border halo.
     The slow hue drift already reads as "AI"; stacking more effects cheapens it. */
  &.ai {
    position: relative;
    background: linear-gradient(
      120deg,
      #6366f1 0%,
      #a855f7 50%,
      #ec4899 100%
    );
    background-size: 200% 100%;
    animation: aiFlow 10s ease-in-out infinite;
    color: white;
    border: none;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.22),
      0 1px 2px rgba(15, 23, 42, 0.15),
      0 4px 14px color-mix(in oklab, #a855f7 22%, transparent);

    @keyframes aiFlow {
      0%, 100% { background-position: 0% 50%; }
      50%      { background-position: 100% 50%; }
    }

    &:disabled {
      animation: none;
    }

    &:not([disabled]):hover {
      animation-duration: 6s;
      transform: translateY(-1px);
      filter: brightness(1.04);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.26),
        0 1px 2px rgba(15, 23, 42, 0.15),
        0 6px 18px color-mix(in oklab, #a855f7 30%, transparent);
    }

    &:focus-visible {
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.22),
        0 1px 2px rgba(15, 23, 42, 0.15),
        var(--neko-focus-ring);
    }
  }

  ${e=>h(e.color)}
`,h=e=>{if(e){const t=/^#|^rgb\(|^rgba\(|^hsl\(/.test(e),n=t?e:`var(--neko-${e})`;return`\n      &.custom-color {\n        background:\n          linear-gradient(180deg,\n            color-mix(in oklab, ${n} 94%, white) 0%,\n            ${n} 55%,\n            color-mix(in oklab, ${n} 94%, black) 100%);\n        border: 1px solid ${t?e:`var(--neko-${e})`};\n        color: white;\n\n        &:not([disabled]):hover {\n          filter: brightness(1.08);\n          box-shadow:\n            inset 0 1px 0 rgba(255, 255, 255, 0.22),\n            0 4px 12px color-mix(in oklab, ${n} 28%, transparent),\n            0 1px 2px rgba(15, 23, 42, 0.15);\n        }\n      }\n    `}},f=e=>o().createElement(p,e);f.propTypes={className:i().string,variant:i().oneOf(["primary","primary-block","secondary","danger","success","warning","header"]),disabled:i().bool,icon:i().oneOfType([i().object,i().oneOf(["setting","edit","trash"])]),color:i().string,onClick:i().func.isRequired,onStopClick:i().func,rounded:i().bool,busy:i().bool,isBusy:i().bool,spinning:i().bool,busyText:i().string,hideBusyIcon:i().bool,busyIconSize:i().string,requirePro:i().bool,isPro:i().bool,disabledColor:i().string,small:i().bool,large:i().bool,progress:i().number,ai:i().bool}},4366(e,t,n){"use strict";n.d(t,{A:()=>h});var r=n(1594),o=n.n(r),a=n(5396),i=n(4490);
/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const s=(0,i.A)("panel-right-open",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M15 3v18",key:"14nvp0"}],["path",{d:"m10 15-3-3 3-3",key:"1pgupc"}]]),l=(0,i.A)("panel-right-close",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M15 3v18",key:"14nvp0"}],["path",{d:"m8 9 3 3-3 3",key:"12hl5m"}]]),c=(0,i.A)("panel-left-open",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M9 3v18",key:"fh3hqa"}],["path",{d:"m14 9 3 3-3 3",key:"8010ee"}]]),u=(0,i.A)("panel-left-close",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M9 3v18",key:"fh3hqa"}],["path",{d:"m16 15-3-3 3-3",key:"14y99z"}]]);function d(){return d=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)({}).hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},d.apply(null,arguments)}const p=a.Ay.div`
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
`,h=({isCollapsed:e,onClick:t,border:n="left",direction:a="right",size:i=20,color:h,borderColor:f,title:m,className:g,style:y,...b})=>{const v=(0,r.useRef)(null),[k,x]=(0,r.useState)(!1);(0,r.useEffect)((()=>{if(v.current){const e=null!==v.current.closest(".primary");x(e)}}),[]);const w="right"===a?e?"Show Right Panel":"Hide Right Panel":e?"Show Left Panel":"Hide Left Panel";return o().createElement(p,d({ref:v,onClick:t,border:n,$isPrimary:k,title:m||w,className:g,style:{color:h||void 0,...y}},b),"right"===a?e?o().createElement(s,{size:i}):o().createElement(l,{size:i}):"left"===a?e?o().createElement(c,{size:i}):o().createElement(u,{size:i}):null)}},1796(e,t,n){"use strict";n.d(t,{A:()=>d});var r=n(1594),o=n.n(r),a=n(390),i=n.n(a),s=n(6038),l=n(9018);function c(){return c=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)({}).hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},c.apply(null,arguments)}const u=e=>{const{spinner:t=!0,busy:n=!1,isBusy:a=!1,overlayStyle:i,spinnerTop:u=!1}=e,d=n||a;o().useEffect((()=>{a&&console.log('NekoBusyOverlay: The "isBusy" prop is deprecated. Please use "busy" instead.')}),[a]);const[p,h]=(0,r.useState)(!0);(0,r.useEffect)((()=>{let e;return d?h(!0):e=setTimeout((()=>{h(!1),e=null}),250),()=>{e&&clearTimeout(e)}}),[d]);const f=(0,s.gR)("neko-overlay",{overlayHidden:!d,spinnerTop:u}),m=p?o().createElement(o().Fragment,null,o().createElement("div",{className:f,style:i},Boolean(t)&&o().createElement("div",{className:"neko-busy-icon "+(d?"":"spinnerHidden")},o().createElement(l.z,{raw:!0,icon:"sync",width:32,height:32}))),o().createElement("style",{jsx:"true"},"\n        .neko-overlay {\n          position: absolute;\n          top: 0;\n          left: 0;\n          bottom: 0;\n          width: 100%;\n          height: 100%;\n          background: var(--neko-main-overlay-color);\n          border-radius: 8px;\n          transition: opacity 1s ease-out;\n          z-index: 10;\n          display: flex;\n          align-items: center;\n          flex-direction: column;\n          justify-content: center;\n          overflow: hidden;\n        }\n\n        .overlayHidden {\n          opacity: 0;\n          transition: opacity 0.25s ease-out;\n        }\n        .spinnerHidden {\n          opacity: 0;\n          transition: opacity 0.25s ease-out;\n        }\n        .spinnerTop {\n          justify-content: flex-start;\n          padding-top: 80px;\n        }\n        .neko-busy-icon {\n          position: relative;\n          display: flex;\n          justify-content: center;\n          align-items: center;\n          animation: spin 1s linear infinite;\n        }\n        .neko-busy-icon svg {\n          color: white;\n          transform: scaleY(-1);\n        }\n        @keyframes spin {\n          from {\n            transform: rotate(0deg);\n          }\n          to {\n            transform: rotate(360deg);\n          }\n        }\n      ")):null,g={...e,busy:void 0,spinner:void 0};return o().createElement("div",c({style:{position:"relative"}},g),m,e.children)};u.propTypes={busy:i().bool,isBusy:i().bool,spinner:i().bool,spinnerTop:i().bool,children:i().oneOfType([i().arrayOf(i().node),i().node]).isRequired};const d=u},4146(e,t,n){"use strict";n.d(t,{hS:()=>Ue,Ay:()=>Qe,ho:()=>He});var r=n(4490);
/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const o=(0,r.A)("timer-reset",[["path",{d:"M10 2h4",key:"n1abiw"}],["path",{d:"M12 14v-4",key:"1evpnu"}],["path",{d:"M4 13a8 8 0 0 1 8-7 8 8 0 1 1-5.3 14L4 17.6",key:"1ts96g"}],["path",{d:"M9 17H4v5",key:"8t5av"}]]),a=(0,r.A)("tag",[["path",{d:"M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z",key:"vktsd0"}],["circle",{cx:"7.5",cy:"7.5",r:".5",fill:"currentColor",key:"kqv944"}]]),i=(0,r.A)("list",[["path",{d:"M3 12h.01",key:"nlz23k"}],["path",{d:"M3 18h.01",key:"1tta3j"}],["path",{d:"M3 6h.01",key:"1rqtza"}],["path",{d:"M8 12h13",key:"1za7za"}],["path",{d:"M8 18h13",key:"1lx6n3"}],["path",{d:"M8 6h13",key:"ik3vkj"}]]),s=(0,r.A)("copy",[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]]),l=(0,r.A)("lock-keyhole",[["circle",{cx:"12",cy:"16",r:"1",key:"1au0dj"}],["rect",{x:"3",y:"10",width:"18",height:"12",rx:"2",key:"6s8ecr"}],["path",{d:"M7 10V7a5 5 0 0 1 10 0v3",key:"1pqi11"}]]),c=(0,r.A)("lock-open",[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 9.9-1",key:"1mm8w8"}]]),u=(0,r.A)("file-x",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"m14.5 12.5-5 5",key:"b62r18"}],["path",{d:"m9.5 12.5 5 5",key:"1rk7el"}]]),d=(0,r.A)("file-symlink",[["path",{d:"m10 18 3-3-3-3",key:"18f6ys"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M4 11V4a2 2 0 0 1 2-2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h7",key:"50q2rw"}]]);var p=n(5997),h=n(204),f=n(488),m=n(8955),g=n(217),y=n(6104);
/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const b=(0,r.A)("pause",[["rect",{x:"14",y:"3",width:"5",height:"18",rx:"1",key:"kaeet6"}],["rect",{x:"5",y:"3",width:"5",height:"18",rx:"1",key:"1wsw3u"}]]),v=(0,r.A)("play",[["path",{d:"M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",key:"10ikf1"}]]),k=(0,r.A)("rotate-ccw",[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"1357e3"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}]]),x=(0,r.A)("check",[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]]);var w=n(2669),C=n(1231),E=n(5376),A=n(9626);
/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const S=(0,r.A)("trash-2",[["path",{d:"M10 11v6",key:"nco0om"}],["path",{d:"M14 11v6",key:"outv1u"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",key:"miytrc"}],["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",key:"e791ji"}]]),O=(0,r.A)("undo",[["path",{d:"M3 7v6h6",key:"1v2h90"}],["path",{d:"M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13",key:"1r6uu6"}]]);var M=n(9680),R=n(2672);
/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const _=(0,r.A)("database",[["ellipse",{cx:"12",cy:"5",rx:"9",ry:"3",key:"msslwz"}],["path",{d:"M3 5V19A9 3 0 0 0 21 19V5",key:"1wlel7"}],["path",{d:"M3 12A9 3 0 0 0 21 12",key:"mv7ke4"}]]),$=(0,r.A)("wrench",[["path",{d:"M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z",key:"1ngwbx"}]]),N=(0,r.A)("settings",[["path",{d:"M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",key:"1i5ecw"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);var z=n(5067);
/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const T=(0,r.A)("cat",[["path",{d:"M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58-.42 7-.42 7 .57 1.07 1 2.24 1 3.44C21 17.9 16.97 21 12 21s-9-3-9-7.56c0-1.25.5-2.4 1-3.44 0 0-1.89-6.42-.5-7 1.39-.58 4.72.23 6.5 2.23A9.04 9.04 0 0 1 12 5Z",key:"x6xyqk"}],["path",{d:"M8 14v.5",key:"1nzgdb"}],["path",{d:"M16 14v.5",key:"1lajdz"}],["path",{d:"M11.25 16.25h1.5L12 17l-.75-.75Z",key:"12kq1m"}]]),P=(0,r.A)("circle-arrow-up",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m16 12-4-4-4 4",key:"177agl"}],["path",{d:"M12 16V8",key:"1sbj14"}]]),j=(0,r.A)("pencil",[["path",{d:"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",key:"1a8usu"}],["path",{d:"m15 5 4 4",key:"1mk7zo"}]]),I=(0,r.A)("layout-dashboard",[["rect",{width:"7",height:"9",x:"3",y:"3",rx:"1",key:"10lvy0"}],["rect",{width:"7",height:"5",x:"14",y:"3",rx:"1",key:"16une8"}],["rect",{width:"7",height:"9",x:"14",y:"12",rx:"1",key:"1hutg5"}],["rect",{width:"7",height:"5",x:"3",y:"16",rx:"1",key:"ldoo1y"}]]),L=(0,r.A)("search",[["path",{d:"m21 21-4.34-4.34",key:"14j7rj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}]]),F=(0,r.A)("folder",[["path",{d:"M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",key:"1kt360"}]]),q=(0,r.A)("folder-open",[["path",{d:"m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2",key:"usdka0"}]]),D=(0,r.A)("image",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2",key:"1m3agn"}],["circle",{cx:"9",cy:"9",r:"2",key:"af1f0g"}],["path",{d:"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",key:"1xmnt7"}]]),B=(0,r.A)("images",[["path",{d:"m22 11-1.296-1.296a2.4 2.4 0 0 0-3.408 0L11 16",key:"9kzy35"}],["path",{d:"M4 8a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2",key:"1t0f0t"}],["circle",{cx:"13",cy:"7",r:"1",fill:"currentColor",key:"1obus6"}],["rect",{x:"8",y:"2",width:"14",height:"14",rx:"2",key:"1gvhby"}]]),W=(0,r.A)("plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]),H=(0,r.A)("folder-plus",[["path",{d:"M12 10v6",key:"1bos4e"}],["path",{d:"M9 13h6",key:"1uhe8q"}],["path",{d:"M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",key:"1kt360"}]]),U=(0,r.A)("image-plus",[["path",{d:"M16 5h6",key:"1vod17"}],["path",{d:"M19 2v6",key:"4bpg5p"}],["path",{d:"M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5",key:"1ue2ih"}],["path",{d:"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",key:"1xmnt7"}],["circle",{cx:"9",cy:"9",r:"2",key:"af1f0g"}]]),Q=(0,r.A)("grid-3x3",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M3 9h18",key:"1pudct"}],["path",{d:"M3 15h18",key:"5xshup"}],["path",{d:"M9 3v18",key:"fh3hqa"}],["path",{d:"M15 3v18",key:"14nvp0"}]]),K=(0,r.A)("twitter",[["path",{d:"M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z",key:"pff0z6"}]]),G=(0,r.A)("instagram",[["rect",{width:"20",height:"20",x:"2",y:"2",rx:"5",ry:"5",key:"2e1cvw"}],["path",{d:"M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z",key:"9exkf1"}],["line",{x1:"17.5",x2:"17.51",y1:"6.5",y2:"6.5",key:"r4j83e"}]]),V=(0,r.A)("facebook",[["path",{d:"M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",key:"1jg4f8"}]]);var X=n(6739);
/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Y=(0,r.A)("timer",[["line",{x1:"10",x2:"14",y1:"2",y2:"2",key:"14vaq8"}],["line",{x1:"12",x2:"15",y1:"14",y2:"11",key:"17fdiu"}],["circle",{cx:"12",cy:"14",r:"8",key:"1e1u0o"}]]),Z=(0,r.A)("link",[["path",{d:"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71",key:"1cjeqo"}],["path",{d:"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",key:"19qd67"}]]),J=(0,r.A)("linkedin",[["path",{d:"M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z",key:"c2jq9f"}],["rect",{width:"4",height:"12",x:"2",y:"9",key:"mk3on5"}],["circle",{cx:"4",cy:"4",r:"2",key:"bt5ra8"}]]),ee=(0,r.A)("pin",[["path",{d:"M12 17v5",key:"bb1du9"}],["path",{d:"M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z",key:"1nkz8b"}]]),te=(0,r.A)("zoom-in",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["line",{x1:"21",x2:"16.65",y1:"21",y2:"16.65",key:"13gj7c"}],["line",{x1:"11",x2:"11",y1:"8",y2:"14",key:"1vmskp"}],["line",{x1:"8",x2:"14",y1:"11",y2:"11",key:"durymu"}]]);var ne=n(6583);
/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const re=(0,r.A)("image-off",[["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}],["path",{d:"M10.41 10.41a2 2 0 1 1-2.83-2.83",key:"1bzlo9"}],["line",{x1:"13.5",x2:"6",y1:"13.5",y2:"21",key:"1q0aeu"}],["line",{x1:"18",x2:"21",y1:"12",y2:"15",key:"5mozeu"}],["path",{d:"M3.59 3.59A1.99 1.99 0 0 0 3 5v14a2 2 0 0 0 2 2h14c.55 0 1.052-.22 1.41-.59",key:"mmje98"}],["path",{d:"M21 15V5a2 2 0 0 0-2-2H9",key:"43el77"}]]),oe=(0,r.A)("arrow-up",[["path",{d:"m5 12 7-7 7 7",key:"hav0vg"}],["path",{d:"M12 19V5",key:"x0mq9r"}]]),ae=(0,r.A)("arrow-down",[["path",{d:"M12 5v14",key:"s699le"}],["path",{d:"m19 12-7 7-7-7",key:"1idqje"}]]),ie=(0,r.A)("arrow-left",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]),se=(0,r.A)("arrow-right",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]]),le=(0,r.A)("arrow-up-down",[["path",{d:"m21 16-4 4-4-4",key:"f6ql7i"}],["path",{d:"M17 20V4",key:"1ejh1v"}],["path",{d:"m3 8 4-4 4 4",key:"11wl7u"}],["path",{d:"M7 4v16",key:"1glfcx"}]]),ce=(0,r.A)("circle-pause",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"10",x2:"10",y1:"15",y2:"9",key:"c1nkhi"}],["line",{x1:"14",x2:"14",y1:"15",y2:"9",key:"h65svq"}]]),ue=(0,r.A)("brain",[["path",{d:"M12 18V5",key:"adv99a"}],["path",{d:"M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4",key:"1e3is1"}],["path",{d:"M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5",key:"1gqd8o"}],["path",{d:"M17.997 5.125a4 4 0 0 1 2.526 5.77",key:"iwvgf7"}],["path",{d:"M18 18a4 4 0 0 0 2-7.464",key:"efp6ie"}],["path",{d:"M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517",key:"1gq6am"}],["path",{d:"M6 18a4 4 0 0 1-2-7.464",key:"k1g0md"}],["path",{d:"M6.003 5.125a4 4 0 0 0-2.526 5.77",key:"q97ue3"}]]),de=(0,r.A)("terminal",[["path",{d:"M12 19h8",key:"baeox8"}],["path",{d:"m4 17 6-6-6-6",key:"1yngyt"}]]),pe=(0,r.A)("clipboard",[["rect",{width:"8",height:"4",x:"8",y:"2",rx:"1",ry:"1",key:"tgr4d6"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",key:"116196"}]]),he=(0,r.A)("list-checks",[["path",{d:"m3 17 2 2 4-4",key:"1jhpwq"}],["path",{d:"m3 7 2 2 4-4",key:"1obspn"}],["path",{d:"M13 6h8",key:"15sg57"}],["path",{d:"M13 12h8",key:"h98zly"}],["path",{d:"M13 18h8",key:"oe0vm4"}]]),fe=(0,r.A)("server",[["rect",{width:"20",height:"8",x:"2",y:"2",rx:"2",ry:"2",key:"ngkwjq"}],["rect",{width:"20",height:"8",x:"2",y:"14",rx:"2",ry:"2",key:"iecqi9"}],["line",{x1:"6",x2:"6.01",y1:"6",y2:"6",key:"16zg32"}],["line",{x1:"6",x2:"6.01",y1:"18",y2:"18",key:"nzw8ys"}]]),me=(0,r.A)("eye",[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]),ge=(0,r.A)("eye-off",[["path",{d:"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",key:"ct8e1f"}],["path",{d:"M14.084 14.158a3 3 0 0 1-4.242-4.242",key:"151rxh"}],["path",{d:"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",key:"13bj9a"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]]),ye=(0,r.A)("rocket",[["path",{d:"M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z",key:"m3kijz"}],["path",{d:"m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z",key:"1fmvmk"}],["path",{d:"M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0",key:"1f8sc4"}],["path",{d:"M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5",key:"qeys4"}]]),be=(0,r.A)("calendar",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]]),ve=(0,r.A)("wand-sparkles",[["path",{d:"m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72",key:"ul74o6"}],["path",{d:"m14 7 3 3",key:"1r5n42"}],["path",{d:"M5 6v4",key:"ilb8ba"}],["path",{d:"M19 14v4",key:"blhpug"}],["path",{d:"M10 2v2",key:"7u0qdc"}],["path",{d:"M7 8H3",key:"zfb6yr"}],["path",{d:"M21 16h-4",key:"1cnmox"}],["path",{d:"M11 3H9",key:"1obp7u"}]]),ke=(0,r.A)("at-sign",[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8",key:"7n84p3"}]]),xe=(0,r.A)("funnel",[["path",{d:"M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z",key:"sc7q7i"}]]);var we=n(9176),Ce=n(9825);
/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ee=(0,r.A)("file-plus",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M9 15h6",key:"cctwl0"}],["path",{d:"M12 18v-6",key:"17g6i2"}]]),Ae=(0,r.A)("save",[["path",{d:"M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",key:"1c8476"}],["path",{d:"M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7",key:"1ydtos"}],["path",{d:"M7 3v4a1 1 0 0 0 1 1h7",key:"t51u73"}]]),Se=(0,r.A)("rotate-cw",[["path",{d:"M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8",key:"1p45f6"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}]]),Oe=(0,r.A)("square-pen",[["path",{d:"M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7",key:"1m0v6g"}],["path",{d:"M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z",key:"ohrbg2"}]]),Me=(0,r.A)("refresh-ccw",[["path",{d:"M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"14sxne"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}],["path",{d:"M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16",key:"1hlbsb"}],["path",{d:"M16 16h5v5",key:"ccwih5"}]]),Re=(0,r.A)("zap",[["path",{d:"M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",key:"1xq2db"}]]),_e=(0,r.A)("file-up",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M12 12v6",key:"3ahymv"}],["path",{d:"m15 15-3-3-3 3",key:"15xj92"}]]),$e=(0,r.A)("sparkles",[["path",{d:"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",key:"1s2grr"}],["path",{d:"M20 2v4",key:"1rf3ol"}],["path",{d:"M22 4h-4",key:"gwowj6"}],["circle",{cx:"4",cy:"20",r:"2",key:"6kqj1y"}]]),Ne=(0,r.A)("bug",[["path",{d:"m8 2 1.88 1.88",key:"fmnt4t"}],["path",{d:"M14.12 3.88 16 2",key:"qol33r"}],["path",{d:"M9 7.13v-1a3.003 3.003 0 1 1 6 0v1",key:"d7y7pr"}],["path",{d:"M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6",key:"xs1cw7"}],["path",{d:"M12 20v-9",key:"1qisl0"}],["path",{d:"M6.53 9C4.6 8.8 3 7.1 3 5",key:"32zzws"}],["path",{d:"M6 13H2",key:"82j7cp"}],["path",{d:"M3 21c0-2.1 1.7-3.9 3.8-4",key:"4p0ekp"}],["path",{d:"M20.97 5c0 2.1-1.6 3.8-3.5 4",key:"18gb23"}],["path",{d:"M22 13h-4",key:"1jl80f"}],["path",{d:"M17.2 17c2.1.1 3.8 1.9 3.8 4",key:"k3fwyw"}]]),ze=(0,r.A)("scan-eye",[["path",{d:"M3 7V5a2 2 0 0 1 2-2h2",key:"aa7l1z"}],["path",{d:"M17 3h2a2 2 0 0 1 2 2v2",key:"4qcy5o"}],["path",{d:"M21 17v2a2 2 0 0 1-2 2h-2",key:"6vwrx8"}],["path",{d:"M7 21H5a2 2 0 0 1-2-2v-2",key:"ioqczr"}],["circle",{cx:"12",cy:"12",r:"1",key:"41hilf"}],["path",{d:"M18.944 12.33a1 1 0 0 0 0-.66 7.5 7.5 0 0 0-13.888 0 1 1 0 0 0 0 .66 7.5 7.5 0 0 0 13.888 0",key:"11ak4c"}]]),Te=(0,r.A)("feather",[["path",{d:"M12.67 19a2 2 0 0 0 1.416-.588l6.154-6.172a6 6 0 0 0-8.49-8.49L5.586 9.914A2 2 0 0 0 5 11.328V18a1 1 0 0 0 1 1z",key:"18jl4k"}],["path",{d:"M16 8 2 22",key:"vp34q"}],["path",{d:"M17.5 15H9",key:"1oz8nu"}]]),Pe=(0,r.A)("external-link",[["path",{d:"M15 3h6v6",key:"1q9fwt"}],["path",{d:"M10 14 21 3",key:"gplh6r"}],["path",{d:"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",key:"a6xqqp"}]]),je=(0,r.A)("download",[["path",{d:"M12 15V3",key:"m9g1x1"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["path",{d:"m7 10 5 5 5-5",key:"brsn70"}]]),Ie=(0,r.A)("share-2",[["circle",{cx:"18",cy:"5",r:"3",key:"gq8acd"}],["circle",{cx:"6",cy:"12",r:"3",key:"w7nqdw"}],["circle",{cx:"18",cy:"19",r:"3",key:"1xt0gg"}],["line",{x1:"8.59",x2:"15.42",y1:"13.51",y2:"17.49",key:"47mynk"}],["line",{x1:"15.41",x2:"8.59",y1:"6.51",y2:"10.49",key:"1n3mei"}]]),Le=(0,r.A)("mail",[["path",{d:"m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7",key:"132q7q"}],["rect",{x:"2",y:"4",width:"20",height:"16",rx:"2",key:"izxlao"}]]),Fe=(0,r.A)("phone",[["path",{d:"M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",key:"9njp5v"}]]),qe=(0,r.A)("message-circle",[["path",{d:"M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719",key:"1sd12s"}]]),De=(0,r.A)("bell",[["path",{d:"M10.268 21a2 2 0 0 0 3.464 0",key:"vwvbt9"}],["path",{d:"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",key:"11g9vi"}]]),Be=(0,r.A)("house",[["path",{d:"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8",key:"5wwlr5"}],["path",{d:"M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",key:"1d0kgt"}]]),We={"timer-reset":o,tag:a,"format-list-bulleted":i,duplicate:s,lock:l,"lock-open":c,"file-undo":u,"file-move":d,"chevron-double-left":p.A,"chevron-double-right":h.A,"chevron-left":f.A,"chevron-right":m.A,"chevron-down":g.A,"chevron-up":y.A,pause:b,play:v,replay:k,check:x,"check-circle":w.A,circle:C.A,stop:E.A,"checkbox-blank":E.A,"checkbox-marked":A.A,delete:S,undo:O,alert:M.A,warning:R.A,database:_,tools:$,cog:N,close:z.A,cat:T,upload:P,trash:S,pencil:j,dashboard:I,search:L,folder:F,"folder-open":q,image:D,"image-multiple-outline":B,plus:W,"folder-plus":H,"image-plus":U,"view-grid":Q,list:i,twitter:K,instagram:G,facebook:V,star:X.A,"timer-outline":Y,link:Z,linkedin:J,pinterest:ee,"zoom-in":te,"info-outline":ne.A,"image-off-outline":re,"arrow-up":oe,"arrow-down":ae,"arrow-left":ie,"arrow-right":se,sort:le,"alert-triangle":R.A,"alert-circle":M.A,"pause-circle":ce,brain:ue,console:de,terminal:de,clipboard:pe,copy:s,"list-checks":he,server:fe,eye:me,"eye-off":ge,"rocket-launch":ye,"calendar-month":be,wand:ve,mastodon:ke,filter:xe,question:we.A,loading:Ce.A,new:Ee,save:Ae,reset:Se,rename:Oe,edit:Oe,sync:Me,lightning:Re,zap:Re,refresh:Me,"file-upload":_e,sparkles:$e,debug:Ne,retina:ze,feather:Te,"external-link":Pe,download:je,share:Ie,mail:Le,phone:Fe,message:qe,bell:De,home:Be},He={trash:"rgb(255 255 255 / 25%)",delete:"rgb(255 255 255 / 25%)",pencil:"rgb(255 255 255 / 25%)",filter:"rgb(255 255 255 / 25%)",lightning:"rgb(255 255 255 / 25%)",zap:"rgb(255 255 255 / 25%)",stop:"rgb(255 255 255 / 25%)","checkbox-blank":"rgb(255 255 255 / 25%)","checkbox-marked":"rgb(255 255 255 / 25%)",star:"rgb(255 255 255 / 25%)","file-upload":"rgb(255 255 255 / 25%)",cat:"rgb(255 255 255 / 25%)",pinterest:"rgb(255 255 255 / 25%)",instagram:"rgb(255 255 255 / 25%)",facebook:"rgb(255 255 255 / 25%)","rocket-launch":"rgb(255 255 255 / 25%)",upload:"rgb(255 255 255 / 25%)","zoom-in":"rgb(255 255 255 / 25%)",dashboard:"rgb(255 255 255 / 25%)",tools:"rgb(255 255 255 / 25%)",cog:"rgb(255 255 255 / 25%)",database:"rgb(255 255 255 / 25%)",folder:"rgb(255 255 255 / 25%)","lock-open":"rgb(255 255 255 / 25%)",lock:"rgb(255 255 255 / 25%)",question:"rgb(255 255 255 / 25%)","info-outline":"rgb(255 255 255 / 25%)",alert:"rgb(255 255 255 / 25%)",play:"rgb(255 255 255 / 25%)",sparkles:"rgb(255 255 255 / 25%)",bell:"rgb(255 255 255 / 25%)",home:"rgb(255 255 255 / 25%)",phone:"rgb(255 255 255 / 25%)",message:"rgb(255 255 255 / 25%)"},Ue={chevron:18,buttonRounded:18,buttonNormal:24,default:30},Qe=We},4764(e,t,n){"use strict";n.d(t,{R:()=>h});var r=n(1594),o=n.n(r),a=n(390),i=n.n(a),s=n(5396),l=n(8074),c=n(1046),u=n(6038);function d(){return d=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)({}).hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},d.apply(null,arguments)}const p=s.Ay.div`
  user-select: none;
  transition: color 0.3s ease, opacity 0.3s ease;
  
  ${({color:e,variant:t})=>"danger"===t?"\n        --checkbox-color: var(--neko-danger);\n      ":e?`\n      --checkbox-color: var(--neko-${e});\n    `:""}

  &.disabled {
    color: var(--neko-disabled-color);
    cursor: not-allowed;

    .neko-content {
      cursor: not-allowed;
    }

    .neko-checkbox-check-container, .neko-label, .description {
      opacity: 0.35;
      transition: opacity 0.3s ease;
    }
  }

  input {
    display: none;
  }

  .neko-content {
    cursor: pointer;
    display: flex;
    align-items: flex-start;
  }

  .neko-checkbox-check-container {
    display: flex;

    .neko-checkbox-busy-container {
      position: relative;
    }
  }

  .neko-checkbox-inner-container {
    margin-left: 8px;

    .neko-label-container {
      display: flex;
      align-items: center;
      /* Label height matches the checkbox control height so the label text
         sits vertically centered with the box — both fit a single visual row. */
      min-height: var(--neko-control-height);
      line-height: 17px;

      .neko-label {
        display: block;
        transition: color 0.18s var(--neko-ease-out);
        ${({checked:e,disabled:t,color:n,variant:r})=>{if(t)return"";if(e){return`color: ${"danger"===r||n?"var(--checkbox-color, var(--neko-accent-color))":"var(--neko-accent-color)"}; font-weight: 600;`}return""}}
      }
    }

    .neko-content {
      display: block;
      font-size: var(--neko-font-size);
      line-height: var(--neko-control-height);
    }

    .description {
      display: block;
      font-size: var(--neko-small-font-size);
      /* Pull closer to the label text, which is vertically centered inside the control-height line-box */
      margin-top: -4px;
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
    width: var(--neko-control-height);
    height: var(--neko-control-height);
    box-sizing: border-box;
    border: 1.5px solid var(--neko-gray-80);
    border-radius: 7px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    transition:
      box-shadow 0.22s var(--neko-ease-out),
      background 0.22s var(--neko-ease-out),
      border-color 0.22s var(--neko-ease-out),
      transform 0.32s var(--neko-ease-spring);
    background: white;
    box-shadow: var(--neko-shadow-xs);

    .neko-checked-mark {
      position: absolute;
      opacity: 0;
      transition: opacity 0.2s ease-in-out;
      transform: rotate(45deg);
      transform-origin: center;
      margin-top: -8%;
      height: 42%;
      width: 17%;
      border-bottom: 2.5px solid white;
      border-right: 2.5px solid white;
    }

    &.small {
      width: 20px;
      height: 20px;
      border: 1.5px solid var(--neko-gray-80);
      border-radius: 5px;

      .neko-checked-mark {
        border-bottom-width: 1.5px;
        border-right-width: 1.5px;
      }
    }

    &:hover:not(.disabled):not(.neko-checked):not(.neko-indeterminate) {
      border-color: color-mix(in oklab, var(--checkbox-color, var(--neko-accent-color)) 55%, var(--neko-gray-80));
      background: color-mix(in oklab, var(--checkbox-color, var(--neko-accent-color)) 6%, white);
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
    &.neko-checkbox {
      border: 1.5px solid var(--checkbox-color, var(--neko-accent-color));
      background: var(--checkbox-color, var(--neko-accent-color));
      box-shadow:
        0 2px 6px color-mix(in oklab, var(--checkbox-color, var(--neko-accent-color)) 30%, transparent),
        inset 0 1px 0 rgba(255, 255, 255, 0.25);
      animation: nekoCheckPop 0.4s var(--neko-ease-spring);

      .neko-checked-mark {
        opacity: 1;
      }
    }
  }

  @keyframes nekoCheckPop {
    0%   { transform: scale(1); }
    45%  { transform: scale(1.14); }
    100% { transform: scale(1); }
  }

  .neko-indeterminate {
    &.neko-checkbox {
      border: 1.5px solid var(--checkbox-color, var(--neko-accent-color));
      background: var(--checkbox-color, var(--neko-accent-color));
      box-shadow:
        0 2px 6px color-mix(in oklab, var(--checkbox-color, var(--neko-accent-color)) 30%, transparent),
        inset 0 1px 0 rgba(255, 255, 255, 0.25);

      .neko-indeterminate-mark {
        opacity: 1;
      }
    }
  }
`,h=e=>{const{name:t,checked:n=!1,indeterminate:r=!1,onChange:a,label:i,description:s,isPro:h=!1,disabled:f,requirePro:m=!1,isBusy:g=!1,busy:y=!1,small:b=!1,color:v,variant:k,...x}=e,w=y||g;o().useEffect((()=>{g&&console.log('NekoCheckbox: The "isBusy" prop is deprecated. Please use "busy" instead.')}),[g]);const C=m&&!h,E=f||C,A=(0,u.gR)("neko-checkbox",e.className,{disabled:E},{small:b}),S=(0,u.gR)("neko-checkbox",{disabled:E,"neko-checked":n,"neko-indeterminate":r,small:b}),O=(0,u.gR)("neko-checked-mark"),M=(0,u.gR)("neko-indeterminate-mark");return o().createElement(p,d({className:A,checked:n,disabled:E,color:v,variant:k,onClick:e=>e.stopPropagation()},x),o().createElement("div",{className:"neko-checkbox-container"},o().createElement("div",{className:"neko-content",onClick:r=>{E||(a?a(!n,t,r):console.log("The onChange handler is not set for the NekoCheckbox.",e))}},o().createElement("div",{className:"neko-checkbox-check-container"},w&&o().createElement("div",{className:"neko-checkbox-busy-container"},o().createElement("div",{className:S},o().createElement(c.X,{type:"circle",size:"16px"}))),!w&&o().createElement(o().Fragment,null,o().createElement("div",{className:S},o().createElement("div",{className:O}),o().createElement("div",{className:M})))),(i||C||s)&&o().createElement("div",{className:"neko-checkbox-inner-container"},o().createElement("span",{className:"neko-label-container"},o().createElement("span",{className:"neko-label"},i),o().createElement(l.K,{className:"inline",show:C,style:{position:"relative",top:-1}})),s?"string"==typeof s?o().createElement("small",{className:"description",dangerouslySetInnerHTML:{__html:s}}):o().createElement("small",{className:"description"},s):null))))};h.propTypes={name:i().string,checked:i().bool,label:i().string,description:i().string,isPro:i().bool,requirePro:i().bool,busy:i().bool,isBusy:i().bool,small:i().bool,color:i().oneOf(["blue","purple","green","red","orange","yellow","gray"]),variant:i().oneOf(["danger"])}},9649(e,t,n){"use strict";n.d(t,{E:()=>l});var r=n(1594),o=n.n(r),a=n(390),i=n.n(a);const s=(0,n(5396).Ay)((e=>{const{name:t,max:n=-1,isPro:r=!1}=e,a=o().Children.map(e.children,(e=>e.props.name?e:o().cloneElement(e,{name:t,isPro:r})));return o().createElement("div",{className:"neko-checkbox-group"},a)}))`
`,l=e=>o().createElement(s,e);l.propTypes={name:i().string,max:i().number,isPro:i().bool}},2484(e,t,n){"use strict";n.d(t,{V:()=>p});var r=n(1594),o=n.n(r),a=n(390),i=n.n(a),s=n(5396),l=n(1863);const c=s.Ay.div`
  position: relative;
  transition: opacity 0.3s ease;

  &.disabled {
    opacity: 0.6;
    pointer-events: none;
    
    .swatch {
      cursor: not-allowed;
      border-color: var(--neko-disabled-color);
    }
  }

  .swatch {
    width: 24px;
    height: 24px;
    border: 3px solid #fff;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    border-radius: var(--neko-radius-sm);
    transition: transform 0.15s ease, opacity 0.3s ease, border-color 0.3s ease;
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
`,u=e=>{if(!e||""===e)return{h:0,s:0,v:0,a:100};3===(e=e.replace("#","")).length&&(e=e.split("").map((e=>e+e)).join(""));const t=parseInt(e.slice(0,2),16)/255||0,n=parseInt(e.slice(2,4),16)/255||0,r=parseInt(e.slice(4,6),16)/255||0,o=e.length>=8?parseInt(e.slice(6,8),16)/255:1,a=Math.max(t,n,r),i=Math.min(t,n,r),s=a-i;let l=0;const c=0===a?0:s/a,u=a;if(a!==i)switch(a){case t:l=((n-r)/s+(n<r?6:0))/6;break;case n:l=((r-t)/s+2)/6;break;case r:l=((t-n)/s+4)/6}return{h:360*l,s:100*c,v:100*u,a:100*o}},d=(e,t,n,r=100,o=null)=>{e/=360,t/=100,n/=100;const a=r/100,i=Math.floor(6*e),s=6*e-i,l=n*(1-t),c=n*(1-s*t),u=n*(1-(1-s)*t);let d,p,h;switch(i%6){case 0:d=n,p=u,h=l;break;case 1:d=c,p=n,h=l;break;case 2:d=l,p=n,h=u;break;case 3:d=l,p=c,h=n;break;case 4:d=u,p=l,h=n;break;case 5:d=n,p=l,h=c;break;default:d=0,p=0,h=0}const f=e=>{const t=Math.round(255*e).toString(16);return 1===t.length?"0"+t:t},m=(null!==o?o:a<.999)?f(a):"";return`#${f(d)}${f(p)}${f(h)}${m}`},p=({name:e,value:t="#000000",onChange:n,supportAlpha:a=!0,disabled:i=!1})=>{const s=(0,r.useRef)(),p=(0,r.useRef)(),h=(0,r.useRef)(),f=(0,r.useRef)(),m=(0,r.useRef)(),[g,y]=(0,r.useState)(!1),[b,v]=(0,r.useState)(t),[k,x]=(0,r.useState)((()=>{const e=u(t);return a||(e.a=100),e})),[w,C]=(0,r.useState)(!1),[E,A]=(0,r.useState)(!1),[S,O]=(0,r.useState)(!1),[M,R]=(0,r.useState)({top:0,left:0});(0,r.useEffect)((()=>{v(t);const e=u(t);a||(e.a=100),x(e)}),[t,a]);const _=(0,r.useCallback)((()=>{b!==t&&n(b,e),y(!1)}),[b,t,n,e]);var $,N;$=s,N=_,(0,r.useEffect)((()=>{let e=!1,t=!1;const n=n=>{!e&&t&&$.current&&!$.current.contains(n.target)&&N(n)},r=n=>{t=$.current,e=$.current&&$.current.contains(n.target)};return document.addEventListener("mousedown",r),document.addEventListener("touchstart",r),document.addEventListener("click",n),()=>{document.removeEventListener("mousedown",r),document.removeEventListener("touchstart",r),document.removeEventListener("click",n)}}),[$,N]),(0,r.useEffect)((()=>{if(g&&p.current&&s.current){const e=p.current.getBoundingClientRect(),t=224,n=a?285:260;let r=e.top-n-8,o=e.left+e.width/2-t/2;r<10&&(r=e.bottom+8),o<10&&(o=10),o+t>window.innerWidth-10&&(o=window.innerWidth-t-10),r>e.bottom&&r+n>window.innerHeight-10&&(r=e.top-n-8),R({top:r,left:o})}}),[g,a]);const z=e=>{x(e);const t=d(e.h,e.s,e.v,e.a,!!a&&null);v(t)},T=e=>{if(!h.current)return;const t=h.current.getBoundingClientRect(),n=Math.max(0,Math.min(1,(e.clientX-t.left)/t.width)),r=Math.max(0,Math.min(1,(e.clientY-t.top)/t.height)),o={h:k.h,s:100*n,v:100*(1-r),a:k.a};z(o)},P=e=>{if(!f.current)return;const t=f.current.getBoundingClientRect(),n={h:360*Math.max(0,Math.min(1,(e.clientX-t.left)/t.width)),s:k.s,v:k.v,a:k.a};z(n)},j=e=>{if(!m.current)return;const t=m.current.getBoundingClientRect(),n=Math.max(0,Math.min(1,(e.clientX-t.left)/t.width)),r={h:k.h,s:k.s,v:k.v,a:100*n};z(r)};(0,r.useEffect)((()=>{const e=e=>{w?T(e):E?P(e):S&&j(e)},t=()=>{C(!1),A(!1),O(!1)};return(w||E||S)&&(document.addEventListener("mousemove",e),document.addEventListener("mouseup",t)),()=>{document.removeEventListener("mousemove",e),document.removeEventListener("mouseup",t)}}),[w,E,S,k]);const I=d(k.h,100,100,100),L=d(k.h,k.s,k.v,100);return o().createElement(c,{className:"neko-color-picker "+(i?"disabled":"")},o().createElement("div",{className:"swatch",ref:p,onClick:()=>!i&&y(!0)},o().createElement("div",{style:{backgroundColor:i?"var(--neko-gray-80)":b,position:"absolute",top:0,left:0,right:0,bottom:0}})),g&&o().createElement("div",{className:"popover",ref:s,style:{top:`${M.top}px`,left:`${M.left}px`}},o().createElement("div",{className:"color-picker-area",ref:h,style:{backgroundColor:I},onMouseDown:e=>{C(!0),T(e)}},o().createElement("div",{className:"color-picker-cursor",style:{left:`${k.s}%`,top:100-k.v+"%",backgroundColor:L}})),o().createElement("div",{className:"hue-slider",ref:f,onMouseDown:e=>{A(!0),P(e)}},o().createElement("div",{className:"hue-cursor",style:{left:k.h/360*100+"%",backgroundColor:I}})),a&&o().createElement("div",{className:"alpha-slider",ref:m,style:{"--current-color":L},onMouseDown:e=>{O(!0),j(e)}},o().createElement("div",{className:"alpha-cursor",style:{left:`${k.a}%`,backgroundColor:b}})),o().createElement("input",{type:"text",className:"hex-input",value:b,onChange:e=>{const t=e.target.value,n=a?9:7;if(/^#[0-9A-Fa-f]{0,8}$/.test(t)&&t.length<=n&&(v(t),7===t.length||a&&9===t.length)){const e=u(t);a||(e.a=100),x(e)}},maxLength:a?9:7,placeholder:a?"#RRGGBBAA":"#RRGGBB"}),o().createElement("div",{style:{display:"flex",padding:0}},o().createElement(l.M,{style:{flex:1},onClick:()=>n(b,e)},"Apply"))))};p.propTypes={name:i().string,value:i().string,onChange:i().func.isRequired,supportAlpha:i().bool,disabled:i().bool}},8865(e,t,n){"use strict";n.d(t,{A:()=>f});var r=n(1594),o=n.n(r),a=n(390),i=n.n(a),s=n(5396),l=n(9018),c=n(6038);function u(){return u=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)({}).hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},u.apply(null,arguments)}const d=e=>e.split(",").map((e=>e.trim())).filter((e=>e.length>0)),p=(e,t)=>{const{type:n="text",name:a,value:i="",description:s,placeholder:p="",onChange:h,onEnter:f,onBlur:m,onFinalChange:g,readOnly:y=!1,step:b=1,min:v=0,max:k=null,maxLength:x,natural:w=!1,onReset:C,isCommaSeparatedArray:E=!1,iconEmpty:A="",iconFilled:S="",onEmptyIconClick:O,onFilledIconClick:M,className:R,style:_,inputStyle:$,...N}=e,[z,T]=(0,r.useState)(i||0===i?i:""),P=!!h,j=x||("number"===n?3:void 0);(0,r.useEffect)((()=>{g&&(f||m)&&console.warn("NekoInput: Since onFinalChange is used, onEnter and onBlur are redundant.")}),[g,f,m]),(0,r.useEffect)((()=>{var e;P||T(E?(e=i,Array.isArray(e)||(console.warn("The provided value is not an array. Falling back to an empty array."),e=[]),e.join(", ")):i)}),[i]);const I=e=>{const t=e.target.value,n=E?d(t):t;e.stopPropagation(),e.preventDefault(),P?h(n,a):T(t)},L=e=>{if("Enter"===e.key){e.preventDefault();const t=e.target.value,n=E?d(t):t;g?g(n,a):f&&f(n,a)}},F=e=>{const t=e.target.value,n=E?d(t):t;(E?((e,t)=>{if(!Array.isArray(e)||!Array.isArray(t)||e.length!==t.length)return!1;for(let n=0;n<e.length;n++)if(e[n]!==t[n])return!1;return!0})(i,n):i===n)||(g?g(n,a):m&&m(n,a))},q=(0,c.gR)("neko-input",{natural:w}),D=()=>{const e=P?i:z;return E?!!Array.isArray(e)&&e.length>0:e&&""!==e&&0!==e},B=A||S,W=Boolean(D()&&S),H=Boolean(!D()&&A);return o().createElement("div",{className:R,style:_},o().createElement("div",{style:{position:"relative"}},"number"===n?o().createElement("input",u({ref:t,className:q,name:a,value:P?i:z,type:n,disabled:y,step:b,min:v,max:k,maxLength:j,autoComplete:"off","data-form-type":"other",placeholder:p,style:{...$,paddingRight:B?"30px":void 0},onChange:I,onKeyPress:L,onBlur:e=>{(e=>{const t=Number(e.target.value);v&&t<Number(v)?e.target.value=v:k&&t>Number(k)&&(e.target.value=k)})(e),F(e)},readOnly:y},N)):o().createElement("input",u({ref:t,className:q},N,{name:a,value:P?i:z,type:n,disabled:y,spellCheck:"false",autoComplete:"off","data-form-type":"other",placeholder:p,style:{...$,paddingRight:B?"30px":void 0},maxLength:j,onChange:I,onKeyPress:L,onBlur:F,readOnly:y},N)),!!i&&!!C&&o().createElement(l.z,{icon:"close",width:24,style:{position:"absolute",top:"3px",right:"3px"},variant:"blue",onClick:()=>C()}),H&&o().createElement(l.z,{icon:A,width:15,style:{position:"absolute",top:"50%",right:"8px",transform:"translateY(-50%)",pointerEvents:O?"auto":"none",cursor:O?"pointer":"default"},color:"#5a5a5a82",onClick:O}),W&&o().createElement(l.z,{icon:S,width:15,style:{position:"absolute",top:"50%",right:"8px",transform:"translateY(-50%)",pointerEvents:M?"auto":"none",cursor:M?"pointer":"default"},color:"var(--neko-blue)",onClick:M})),s&&("string"==typeof s?o().createElement("p",{className:"neko-input-description",dangerouslySetInnerHTML:{__html:s}}):o().createElement("p",{className:"neko-input-description"},s)))},h=(0,s.Ay)((0,r.forwardRef)(p))`
  .neko-input {
    font-family: var(--neko-font-family);
    font-size: var(--neko-font-size);
    border: 1.5px solid var(--neko-input-border);
    box-sizing: border-box;
    height: var(--neko-control-height);
    /* WP 7 admin CSS sets min-height: 40px on bare input[type="text"] etc.,
       which overrides our height. Explicitly reset it so Neko's height wins. */
    min-height: 0;
    background: var(--neko-input-background);
    color: black;
    padding: 0 10px;
    width: 100%;
    border-radius: var(--neko-radius-md);
    transition: background 0.3s ease, box-shadow 0.2s ease, opacity 0.3s ease, border-color 0.3s ease;

    &.natural {
      border-color: gray;
      border-width: 1px;
    }

    &::placeholder {
      color: rgba(0, 0, 0, 0.25);
    }

    &:focus {
      background-color: white;
      outline: none;
    }

    /* Keyboard-only focus ring — the global --neko-focus-ring shadow + a
       brand-tinted border so tabbing through a form is always visible.
       Mouse clicks won't trigger this (browser distinguishes :focus from
       :focus-visible). */
    &:focus-visible {
      outline: none;
      border-color: color-mix(in oklab, var(--neko-main-color) 60%, transparent);
      box-shadow: var(--neko-focus-ring);
    }

    &:read-only {
      color: var(--neko-gray-60);
    }

    &:disabled {
      color: var(--neko-gray-60);
      background: var(--neko-gray-98);
      border-color: var(--neko-disabled-color);
      box-shadow: none;
      opacity: 0.6;
      cursor: not-allowed;
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
`,f=o().forwardRef(((e,t)=>o().createElement(h,u({ref:t},e))));f.propTypes={type:i().oneOf(["number","text"]),name:i().string,value:i().oneOfType([i().string,i().array]),description:i().string,placeholder:i().string,onChange:i().func,onEnter:i().func,onBlur:i().func,onFinalChange:i().func,readOnly:i().bool,step:i().number,min:i().number,max:i().number,maxLength:i().number,natural:i().bool,onReset:i().func,isCommaSeparatedArray:i().bool,iconEmpty:i().string,iconFilled:i().string,onEmptyIconClick:i().func,onFilledIconClick:i().func}},6242(e,t,n){"use strict";n.d(t,{j:()=>z,u:()=>N});var r=n(1594),o=n.n(r),a=n(390),i=n.n(a),s=n(8074),l=n(6038),c=n(1046),u=n(4146),d=n(217),p=n(9626),h=n(5376);
/**
 * @license lucide-react v0.542.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const f=(0,n(4490).A)("circle-dot",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["circle",{cx:"12",cy:"12",r:"1",key:"41hilf"}]]);var m=n(1231),g=n(9018),y=n(8865),b=n(3307),v=n(5396);const k=v.Ay.div`
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
    cursor: not-allowed;
    pointer-events: none;
    color: var(--neko-gray-60);
    transition: opacity 0.3s ease, border-color 0.3s ease;

    .neko-select-option {
      pointer-events: none;
      background: var(--neko-gray-98);
      border-color: var(--neko-disabled-color);
    }
  }

  &.neko-dropdown-up {}
`,x=v.Ay.div`
  align-items: center;
  background-color: var(--neko-input-background);
  border: 1.5px solid var(--neko-input-border);
  border-radius: var(--neko-radius-md);
  display: flex;
  font-size: var(--neko-font-size);
  padding: 0 5px 0 10px;
  box-sizing: border-box;
  height: var(--neko-control-height);
  transition: opacity 0.3s ease, border-color 0.3s ease, background-color 0.3s ease;
  
  &[data-is-disabled=true], &.disabled {
    border-color: var(--neko-disabled-color);
    opacity: 0.6;
  }

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
`,w=v.Ay.div`
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
`,C=v.Ay.div`
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
`,E=v.Ay.div`
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
`,A=v.Ay.div`
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
`,S=v.Ay.div`
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
`;function O(){return O=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)({}).hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},O.apply(null,arguments)}const M=e=>{const{name:t,description:n,scrolldown:a=!0,isPro:i=!1,onChange:p,isBusy:h=!1,busy:f=!1,chevronIconSize:m=u.hS.chevron,textFiltering:v,value:A,className:S,disabled:M,requirePro:R,multiple:_=!1,placeholder:$,...N}=e,z=f||h;o().useEffect((()=>{h&&console.log('NekoSelect: The "isBusy" prop is deprecated. Please use "busy" instead.')}),[h]);let T,P,j,I,L=15;if(_){const t=o().Children.toArray(e.children).filter((e=>(A||[]).includes(e.props.value)||e.props.checked)).map((e=>e.props));T=t.map((e=>e.label)).join(", ")||$||"Select",P=n,j=t.some((e=>e.requirePro))||R,I=null}else{var F;const t=null===(F=o().Children.toArray(e.children).find((e=>e.props.value===A||e.props.checked)))||void 0===F?void 0:F.props;T=(null==t?void 0:t.label)||$||"Select",P=(null==t?void 0:t.description)||n,j=(null==t?void 0:t.requirePro)||R,I=null==t?void 0:t.icon,L=(null==t?void 0:t.iconSize)||15}const[q,D]=(0,r.useState)(!1),[B,W]=(0,r.useState)(""),H=(0,r.useRef)(),U=j&&!i;(0,r.useEffect)((()=>{_&&!a&&console.warn('NekoSelect: The "multiple" prop should be used with "scrolldown={true}" for proper functionality. Multiple selection requires the dropdown interface to work correctly.')}),[_,a]);(0,r.useEffect)((()=>{const e=e=>{"Escape"===e.key&&q&&D(!1)};if(q)return document.addEventListener("keydown",e),()=>{document.removeEventListener("keydown",e)}}),[q]);const Q=o().Children.map(e.children,(n=>n?o().cloneElement(n,{name:n.props.name||t,checked:_?(A||[]).includes(n.props.value)||n.props.checked:n.props.value===A||n.props.checked,onClick:r=>((n,r)=>{if(n.stopPropagation(),p)if(_){let e=Array.isArray(A)?[...A]:[];e.includes(r)?e=e.filter((e=>e!==r)):e.push(r),p(e,t)}else r!==A&&p(r,t),a&&D(!1);else console.log("The onChange handler is not set for this select.",e)})(r,n.props.value),scrolldown:a,isPro:i,disabled:M,multiple:_}):null)),K=(0,r.useMemo)((()=>{if(!B||!Q.length)return Q;const e=B.toLowerCase().split(" ").filter((e=>e.length>0));return o().Children.toArray(Q).filter((t=>{const n=`${"string"==typeof t.props.label?t.props.label.toLowerCase():""} ${"string"==typeof t.props.value?t.props.value.toLowerCase():""}`;return e.every((e=>n.includes(e)))}))}),[Q,B]),G=(0,l.gR)("neko-select",S,{"show-options":q,disabled:M||h}),V=(0,l.gR)("neko-select-options",{hidden:!q}),X=(0,l.gR)("neko-select-option",{isBusy:z});return a?o().createElement(k,O({name:t},N,{onClick:()=>{M||h||D(!q)},className:G,"data-is-disabled":M||h,ref:H}),o().createElement(x,{className:X},z?o().createElement(o().Fragment,null,o().createElement(c.X,{type:"circle",size:"20px"})):o().createElement(o().Fragment,null,I&&o().createElement(g.z,{icon:I,width:L,height:L,style:{marginRight:`${Math.max(L-15,4)}px`}}),o().createElement("span",{className:"neko-select-option-label"},T),o().createElement("div",{className:"rightContent"},U&&o().createElement(s.K,null),o().createElement("span",{className:"neko-chevron-wrap"},o().createElement(d.A,{size:m,className:"neko-select-chevron",style:{transform:q?"rotate(180deg)":"rotate(0deg)",transition:"transform 180ms cubic-bezier(0.2, 0.8, 0.2, 1)"}}))))),P&&("string"==typeof P?o().createElement(w,{dangerouslySetInnerHTML:{__html:P}}):o().createElement(w,null,P)),o().createElement(b.G,{visible:q,targetRef:H,onClose:()=>{q&&D(!1)}},o().createElement(C,{className:V},v&&o().createElement(E,{className:"neko-select-filter-container"},o().createElement(y.A,{value:B,placeholder:"Search...",onChange:e=>W(e),onClick:e=>e.stopPropagation(),style:{background:"var(--neko-white)",borderRadius:10,margin:"5px 7px",borderColor:"var(--neko-input-background)"},inputStyle:{margin:0,borderRadius:0},autoFocus:!0})),o().createElement(E,null,K)))):Q},R={latest:"var(--neko-blue, #2563eb)",preview:"var(--neko-orange, #f97316)",deprecated:"var(--neko-red, #dc2626)",experimental:"var(--neko-red, #dc2626)",tuned:"var(--neko-green, #16a34a)",beta:"var(--neko-orange, #f97316)",new:"var(--neko-green, #16a34a)"},_=({tag:e})=>{if(!e)return null;const t=R[e]||"var(--neko-gray-50)";return o().createElement("small",{style:{background:t,color:"white",padding:"4px 6px",margin:"1px 0 0 5px",borderRadius:8,fontSize:8,lineHeight:"100%"}},e.toUpperCase())},$=e=>{const{id:t,name:n,value:r,checked:a=!1,label:i,description:c,onClick:u,scrolldown:d=!0,isPro:y=!1,optionDisabled:b=!1,requirePro:v=!1,icon:k,iconSize:x=20,multiple:C=!1,tag:E}=e,O=v&&!y,M=(0,l.gR)({"neko-radio":!d},{"neko-select-option":d},e.className,{disabled:O||b}),R=C?a?p.A:h.A:a?f:m.A,$=o().createElement(S,{className:M,onClick:e=>{u(e,r)}},o().createElement("div",{className:"option"},o().createElement("div",{className:"option-group"},C?o().createElement(R,{size:x,color:O?"var(--neko-disabled-color)":a?"var(--neko-main-color)":"var(--neko-input-border)",style:{marginRight:"8px"}}):o().createElement("div",{style:{position:"relative",width:x,height:x,flexShrink:0,marginRight:"8px"}},o().createElement(m.A,{size:x,color:O?"var(--neko-disabled-color)":"var(--neko-input-border)",strokeWidth:1.5}),a&&o().createElement("div",{style:{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)",width:.4*x,height:.4*x,borderRadius:"50%",backgroundColor:O?"var(--neko-disabled-color)":"var(--neko-main-color)"}})),k&&o().createElement(g.z,{icon:k,width:x,height:x,style:{marginRight:`${Math.max(x-11,4)}px`}}),i,o().createElement(_,{tag:E})),o().createElement(s.K,{show:O}))),N=o().createElement(A,{className:M,onClick:e=>{u(e,r)}},o().createElement("label",{htmlFor:t},o().createElement("div",{style:{position:"relative",width:24,height:24,flexShrink:0}},o().createElement(m.A,{size:24,color:O?"var(--neko-disabled-color)":"var(--neko-input-border)",strokeWidth:1.5}),a&&o().createElement("div",{style:{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)",width:10,height:10,borderRadius:"50%",backgroundColor:O?"var(--neko-disabled-color)":"var(--neko-main-color)"}})),o().createElement("div",{className:"inner-container"},o().createElement("span",{className:"label"},i,o().createElement(_,{tag:E}),o().createElement(s.K,{className:"inline",style:{top:-1},show:O})),c&&("string"==typeof c?o().createElement(w,{style:{marginTop:0},dangerouslySetInnerHTML:{__html:c}}):o().createElement(w,{style:{marginTop:0}},c)))));return d?$:N},N=e=>o().createElement(M,e);N.propTypes={name:i().string,description:i().string,scrolldown:i().bool,isPro:i().bool,onChange:i().func,busy:i().bool,isBusy:i().bool,chevronIconSize:i().number,textFiltering:i().bool,multiple:i().bool,placeholder:i().string};const z=e=>o().createElement($,e);z.propTypes={id:i().string,name:i().string,value:i().string,checked:i().bool,label:i().string,description:i().string,onClick:i().func,scrolldown:i().bool,isPro:i().bool,optionDisabled:i().bool,requirePro:i().bool,icon:i().string,iconSize:i().number,multiple:i().bool}},6644(e,t,n){"use strict";n.d(t,{$:()=>v});var r=n(1594),o=n.n(r),a=n(390),i=n.n(a),s=n(5396);const l=s.Ay.div`
  position: relative;
  user-select: none;
  padding-top: 24px;
  transition: opacity 0.3s ease;
  
  &.disabled {
    opacity: 0.6;
  }
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
`,p=s.Ay.div`
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
`,h=s.Ay.div`
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
`,v=({name:e,value:t,min:n=0,max:a=100,step:i=1,marks:s,recommended:v,description:k,onChange:x,onFinalChange:w,disabled:C=!1,showLabels:E=!0,formatValue:A,labelFormatter:S,className:O,style:M})=>{const[R,_]=(0,r.useState)(t??n),[$,N]=(0,r.useState)(!1),z=(0,r.useRef)(null),T=(0,r.useRef)(null),P=void 0!==t,j=P?t:R;(0,r.useEffect)((()=>{P&&void 0!==t&&_(t)}),[t,P]);const I=(0,r.useCallback)((e=>{const t=Math.round(e/i)*i;return Math.max(n,Math.min(a,t))}),[n,a,i]),L=(0,r.useCallback)((e=>(e-n)/(a-n)*100),[n,a]),F=(0,r.useCallback)((e=>{if(!z.current)return j;const t=z.current.getBoundingClientRect(),r=t.width-20,o=e-t.left-10,i=Math.max(0,Math.min(1,o/r));return I(n+i*(a-n))}),[n,a,j,I]),q=(0,r.useCallback)((t=>{const n=I(t);P||_(n),x&&x(n,e)}),[P,x,e,I]),D=(0,r.useCallback)((t=>{w&&w(t,e)}),[w,e]),B=(0,r.useCallback)((e=>{if(C)return;e.preventDefault(),N(!0);let t=F(e.clientX);q(t);const n=e=>{t=F(e.clientX),q(t)},r=()=>{N(!1),D(t),document.removeEventListener("mousemove",n),document.removeEventListener("mouseup",r)};document.addEventListener("mousemove",n),document.addEventListener("mouseup",r)}),[C,F,q,D]),W=(0,r.useCallback)((e=>{if(C||e.target===T.current)return;const t=F(e.clientX);q(t),D(t)}),[C,F,q,D]),H=(0,r.useCallback)((e=>A?A(e):Number.isInteger(e)?e.toString():e.toFixed(1)),[A]),U=(0,r.useCallback)((e=>S?S(e):H(e)),[S,H]),Q=(0,r.useMemo)((()=>{const e=a-n,t=[];if(s&&Array.isArray(s))s.forEach((r=>{if(r>n&&r<a){const o=(r-n)/e*100;t.push({value:r,position:o})}}));else{let r;r=e<=10?1:e<=50?5:e<=100?10:e<=500?50:e<=1e3?100:e<=5e3?500:Math.pow(10,Math.floor(Math.log10(e/5)));for(let o=n+r;o<a;o+=r){const r=(o-n)/e*100;t.push({value:o,position:r})}}return t}),[n,a,s]),K=L(j),G=void 0!==v&&v>=n&&v<=a;return o().createElement(l,{className:`${O||""} ${C?"disabled":""}`,style:M,$hasDescription:!!k},E&&o().createElement(g,null,o().createElement(y,{style:{left:"10px"},$visible:$},U(n)),G&&!C&&o().createElement(y,{style:{left:`calc(10px + (100% - 20px) * ${L(v)/100})`},$isRecommended:!0,$visible:!0,$disabled:C},U(v)),o().createElement(y,{style:{left:`calc(10px + (100% - 20px) * ${K/100})`},$isCurrent:!0,$visible:!0,$disabled:C},U(j)),o().createElement(y,{style:{left:"calc(100% - 10px)"},$visible:$},U(a))),o().createElement(c,{ref:z,onClick:W},o().createElement(u,{$disabled:C}),o().createElement(f,{$visible:$},Q.map(((e,t)=>o().createElement(m,{key:t,style:{left:`calc(10px + (100% - 20px) * ${e.position/100})`}})))),o().createElement(d,{style:{width:`calc((100% - 20px) * ${K/100})`},$disabled:C}),G&&!C&&o().createElement(h,{style:{left:`calc(10px + (100% - 20px) * ${L(v)/100})`}}),o().createElement(p,{ref:T,className:$?"dragging":"",style:{left:`calc(10px + (100% - 20px) * ${K/100})`},onMouseDown:B,$disabled:C})),k&&o().createElement(b,null,k))};v.propTypes={name:i().string,value:i().number,min:i().number,max:i().number,step:i().number,marks:i().arrayOf(i().number),recommended:i().number,description:i().string,onChange:i().func,onFinalChange:i().func,disabled:i().bool,showLabels:i().bool,formatValue:i().func,labelFormatter:i().func,className:i().string,style:i().object}},2861(e,t,n){"use strict";n.d(t,{S:()=>d});var r=n(1594),o=n(390),a=n.n(o),i=n(5396),s=n(6038);function l(){return l=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)({}).hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},l.apply(null,arguments)}function c(e){return"number"==typeof e?`${e}px`:e}const u=i.Ay.div`
  color: var(--neko-white);
  font-family: var(--neko-font-family);
  font-size: ${e=>e.fontSize};
  position: relative;
  display: inline-block;
  width: ${e=>c(e.width)};
  height: ${e=>c(e.height)};

  transition: opacity 300ms ease;
  
  &[data-is-disabled=disabled] {
    opacity: 0.6;

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
        to bottom,
        color-mix(in srgb, ${e=>e.$offBackgroundColor||"var(--neko-disabled-color)"} 90%, white),
        ${e=>e.$offBackgroundColor||"var(--neko-disabled-color)"}
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
        to bottom,
        color-mix(in srgb, ${e=>e.$onBackgroundColor} 90%, white),
        ${e=>e.$onBackgroundColor}
      );
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

  /* Hover feedback — the thumb "peeks" toward its next position, track
     brightens, and the thumb gains a slightly bigger shadow. Active state
     presses the thumb into the track. */
  &:not([data-is-disabled=disabled]) .neko-slider:hover {
    filter: brightness(1.06);
    box-shadow: var(--neko-shadow-sm);
  }
  &:not([data-is-disabled=disabled]) .neko-slider:hover:before {
    box-shadow:
      0 1px 2px rgba(16, 24, 40, 0.18),
      0 3px 8px rgba(16, 24, 40, 0.15);
    /* Off → nudge right, On → nudge left */
    transform: translate(3px, -50%);
  }
  &.neko-checked:not([data-is-disabled=disabled]) .neko-slider:hover:before {
    transform: translate(calc(${e=>`${c(e.width)} - ${c(e.height)}`} - 3px), -50%);
  }

  &:not([data-is-disabled=disabled]) .neko-slider:active {
    filter: brightness(0.97);
  }

  @media (prefers-reduced-motion: reduce) {
    .neko-slider { transition: none; }
    .neko-slider:before { transition: none; }
  }
`,d=e=>{let{width:t,height:n=24,fontSize:o="13px",onLabel:a="Yes",offLabel:i="No",onBackgroundColor:c="var(--neko-accent-color)",offBackgroundColor:d="var(--neko-disabled-color)",onValue:p,offValue:h,small:f,checked:m=!1,onChange:g,disabled:y=!1,...b}=e;const v=(0,s.gR)("neko-switch",{small:f,"neko-checked":m}),k=(0,r.useCallback)((e=>{if(y)return;g(e?void 0===p||p:void 0!==h&&h)}),[p,h,g,y]);f&&(n=20,o="11px");const x=t||(a&&""!==a||i&&""!==i?70:40);return React.createElement(u,l({className:v,width:x,height:n,fontSize:o},b,{$offBackgroundColor:d,$onBackgroundColor:c,$onLabel:a,$offLabel:i,"data-is-disabled":y?"disabled":""}),React.createElement("span",{className:"neko-slider",onClick:()=>k(!m)}))};d.propTypes={width:a().number,height:a().number,fontSize:a().string,onValue:a().string,offValue:a().string,checked:a().bool,onBackgroundColor:a().string,offBackgroundColor:a().string,onLabel:a().string,offLabel:a().string}},127(e,t,n){"use strict";n.d(t,{m:()=>p});var r=n(1594),o=n.n(r),a=n(390),i=n.n(a),s=n(5396),l=n(6038),c=n(9018);function u(){return u=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)({}).hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},u.apply(null,arguments)}const d=(0,s.Ay)((e=>{const{name:t,value:n="",rows:a=6,description:i,placeholder:s="",onEnter:d=null,onBlurForce:p=!1,readOnly:h=!1,avoidOnEnterWithShift:f=!1,fullHeight:m=!1,maxLength:g=null,className:y,style:b,textAreaStyle:v={},countable:k=!1,disabled:x,tabToSpaces:w,copyable:C=!1,...E}=e,[A,S]=(0,r.useState)(n),[O,M]=(0,r.useState)(0),[R,_]=(0,r.useState)(!1),[$,N]=(0,r.useState)(!1),z=!!e.onChange,T=(0,r.useRef)(null),P=(0,r.useCallback)((e=>{if(w&&"Tab"===e.key){e.preventDefault();const t=T.current.selectionStart,n=T.current.selectionEnd,r=T.current.value;T.current.value=r.substring(0,t)+"  "+r.substring(n),T.current.selectionStart=T.current.selectionEnd=t+2}else _(e.shiftKey)}),[w]),j=(0,r.useCallback)((()=>{_(!1)}),[]);(0,r.useEffect)((()=>{const e=T.current;if(e)return e.addEventListener("keydown",P,!1),e.addEventListener("keyup",j,!1),()=>{e.removeEventListener("keydown",P,!1),e.removeEventListener("keyup",j,!1)}}),[P,j]),(0,r.useEffect)((()=>{if(z||S(n),"words"===k){const e=n.split(" ").filter((e=>""!==e)).length;M(e)}else k&&M(n.length)}),[n,k,z]);const I=(0,r.useCallback)((n=>{const r=g?n.target.value.substr(0,g):n.target.value;n.stopPropagation(),z?e.onChange(r,t):S(r,t)}),[g,z,e,t]),L=(0,r.useCallback)((async()=>{const e=z?n:A;if(e)try{await navigator.clipboard.writeText(e),N(!0),setTimeout((()=>N(!1)),2e3)}catch(t){const n=document.createElement("textarea");n.value=e,document.body.appendChild(n),n.select(),document.execCommand("copy"),document.body.removeChild(n),N(!0),setTimeout((()=>N(!1)),2e3)}}),[n,A,z]),F=(0,l.gR)(y,{disabled:x});return o().createElement("div",{className:F,style:b},o().createElement("div",{className:"neko-textarea-container"},o().createElement("textarea",u({ref:T,className:"neko-textarea",rows:a,disabled:x},E,{name:t,spellCheck:"false",placeholder:s,onChange:I,onKeyPress:n=>{if(d&&!n.shiftKey&&"Enter"===n.key){if(f&&R)return;n.preventDefault(),e.onEnter(n.target.value,t)}},onBlur:r=>{(p||e.onBlur&&n!==r.target.value)&&e.onBlur(r.target.value,t)},readOnly:h,style:{...v,height:m?"100%":v.height??void 0},value:z?n:A})),C&&(h||x)&&o().createElement("button",{className:"neko-textarea-copy-button",onClick:L,type:"button",title:$?"Copied!":"Copy to clipboard"},o().createElement(c.z,{icon:$?"check":"duplicate"})),o().createElement("div",{className:"neko-text-area-extra"},i?"string"==typeof i?o().createElement("div",{className:"neko-input-description",dangerouslySetInnerHTML:{__html:i}}):o().createElement("div",{className:"neko-input-description"},i):k?o().createElement("div",null):null,k&&o().createElement("div",{className:"neko-textarea-count"},O,g?` / ${g}`:""," ","words"===k?"words":"chars"))))}))`
  .neko-textarea-container {
    position: relative;
    height: ${e=>e.fullHeight?"100%":void 0}
  }

  .neko-textarea-copy-button {
    position: absolute;
    top: 8px;
    right: 8px;
    background: white;
    border: 1px solid var(--neko-gray-80);
    border-radius: 4px;
    padding: 4px 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    font-size: 12px;
    color: var(--neko-gray-50);
    z-index: 1;

    &:hover {
      background: var(--neko-gray-98);
      color: var(--neko-main-color);
      border-color: var(--neko-main-color);
    }

    &:active {
      transform: scale(0.95);
    }

    svg {
      width: 14px;
      height: 14px;
    }
  }

  .neko-textarea {
    font-family: var(--neko-font-family);
    font-size: var(--neko-font-size);
    border: 1.5px solid var(--neko-input-border);
    box-sizing: border-box;
    background: var(--neko-input-background);
    color: black;
    padding: 5px 10px;
    width: 100%;
    transition: opacity 0.3s ease, border-color 0.3s ease, background-color 0.3s ease;

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
      background: repeating-linear-gradient(
        -45deg,
        var(--neko-gray-98),
        var(--neko-gray-98) 10px,
        var(--neko-gray-95) 10px,
        var(--neko-gray-95) 20px
      );
      border: 1.5px solid var(--neko-gray-80);
      color: var(--neko-gray-30);
      cursor: default;
      
      &:focus {
        background: repeating-linear-gradient(
          -45deg,
          var(--neko-gray-98),
          var(--neko-gray-98) 10px,
          var(--neko-gray-95) 10px,
          var(--neko-gray-95) 20px
        );
        border-color: var(--neko-gray-80) !important;
      }
    }
    
    &:disabled {
      color: var(--neko-gray-60);
      background: var(--neko-gray-98);
      border-color: var(--neko-disabled-color);
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  .neko-text-area-extra {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    color: var(--neko-gray-60);
    font-size: var(--neko-small-font-size);
    line-height: 14px;

    .neko-textarea-count {
      margin: 0 0 0 10px;
      text-align: right;
      min-width: 130px;
      display: block;
      flex-shrink: 0;
    }

    .neko-input-description {
      margin-top: 5px;
      margin-bottom: 0;
      flex: 1;
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
`,p=e=>o().createElement(d,e);p.propTypes={name:i().string,value:i().string,rows:i().number,description:i().string,placeholder:i().string,onChange:i().func,onEnter:i().func,onBlur:i().func,onBlurForce:i().bool,readOnly:i().bool,avoidOnEnterWithShift:i().bool,fullHeight:i().bool,copyable:i().bool}},1947(e,t,n){"use strict";n.d(t,{YS:()=>h,z3:()=>u,IU:()=>l,F1:()=>i,Tb:()=>c,yy:()=>d,FE:()=>p});var r=n(1594),o=n.n(r);class a{constructor(e,t="",n=null,r=null,o={}){this.url=n,this.message=e,this.code=t,this.body=r,this.debug=o,this.cancelledByUser="USER-ABORTED"===t}}function i(e,t=null,n=!0){return JSON.stringify(e,(e=>{let t=[];return(n,r)=>{if("object"==typeof r&&null!==r){if(-1!==t.indexOf(r)){if(!e)throw console.warn("Circular reference found.",{key:n,value:r,cache:t,cacheIndex:t.indexOf(r)}),new Error("Circular reference found. Cancelled.");return}t.push(r)}return r}})(n),t)}const s=async(e,t={})=>{let n=null,r={},o=null,i=null;try{if((t=t||{}).headers=t.headers?t.headers:{},t.headers.Pragma="no-cache",t.headers["Cache-Control"]="no-cache",i=await fetch(`${e}`,t),n=await i.text(),r=JSON.parse(n),!r.success){let t=!1===r.success?"NOT-SUCCESS":"N/A",s=r.message?r.message:"Unknown error. Check your Console Logs.";"rest_no_route"===r.code?(s="The API can't be accessed. Are you sure the WP REST API is enabled? Check this article: https://meowapps.com/fix-wordpress-rest-api/.",t="NO-ROUTE"):"internal_server_error"===r.code&&(s="Server error. Please check your PHP Error Logs.",t="SERVER-ERROR"),o=new a(s,t,e,n||i)}}catch(t){console.error("[nekoFetch]",t);let r="BROKEN-REPLY",s="The reply sent by the server is broken.";"AbortError"===t.name?(r="USER-ABORTED",s="The request was aborted by the user."):i&&i.status&&408===i.status&&(r="REQUEST-TIMEOUT",s="The request generated a timeout."),o=new a(s,r,e,n||i,t)}return o&&(r.success=!1,r.message=o.message,r.error=o),(e=>{if(!e.data)return e;if(Array.isArray(e.data)&&e.data.length>0&&e.data[0].meta)for(let t of e.data)try{t.meta=JSON.parse(t.meta)}catch(e){console.error("[JsonFetcher]","Could not decode meta.",t.meta)}else if(!Array.isArray(e.data)&&e.data.meta)try{e.data.meta=JSON.parse(e.data.meta)}catch(t){console.error("[JsonFetcher]","Could not decode meta.",e.data.meta)}return e})(r)},l=async(e,t={})=>{const{json:n=null,method:r="GET",signal:o,file:a,nonce:l,bearerToken:c}=t;if("GET"===r&&n)throw new Error(`NekoFetch: GET method does not support json argument (${e}).`);let u=a?new FormData:null;if(a){u.append("file",a);for(const[e,t]of Object.entries(n))u.append(e,t)}const d={};l&&(d["X-WP-Nonce"]=l),c&&(d.Authorization=`Bearer ${c}`),u||(d["Content-Type"]="application/json");const p={method:r,headers:d,body:u||(n?i(n):null),signal:o};let h=null;try{var f;if(h=await s(e,p),!h.success)throw new Error((null===(f=h)||void 0===f?void 0:f.message)??"Unknown error.");return h}catch(e){throw e}},c=async(e,t={})=>{const{json:n={},signal:r,file:o,nonce:a,bearerToken:l}=t;let c=o?new FormData:null;if(o){c.append("file",o);for(const[e,t]of Object.entries(n))c.append(e,t)}const u=a?{"X-WP-Nonce":a}:{};return l&&(u.Authorization=`Bearer ${l}`),c||(u["Content-Type"]="application/json"),s(e,{method:"POST",headers:u,body:c||i(n),signal:r})},u=(e,t=2)=>{const n=t<0?0:t,r=["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"];let o=e>0?Math.floor(Math.log(e)/Math.log(1024)):0;return"Bytes"===r[o]&&(o=1),(e=parseFloat((e/Math.pow(1024,o)).toFixed(n))).toFixed(Math.max(n,(e.toString().split(".")[1]||[]).length))+" "+r[o]};function d(e){return new Promise((t=>setTimeout(t,e)))}const p=e=>o().createElement("span",{style:{display:"inline"},dangerouslySetInnerHTML:{__html:e}});class h extends o().Component{constructor(e){super(e),this.state={hasError:!1}}static getDerivedStateFromError(e){return{hasError:e}}render(){if(this.state.hasError){let e="";return e="string"==typeof this.state.hasError?this.state.hasError:this.state.hasError.message?this.state.hasError.message:this.state.hasError.toString?this.state.hasError.toString():i(this.state.hasError),o().createElement(o().Fragment,null,o().createElement("div",{style:{background:"var(--neko-red)",color:"white",margin:15,padding:15,borderRadius:15}},o().createElement("pre",{style:{margin:0,whiteSpace:"pre-wrap"}},"⚠️ ",o().createElement("b",null,"Error"),o().createElement("br",null),"Sorry, an error occured! Don't worry, I will fix this, so simply let me know about it.",o().createElement("br",null),"Here is some information about it:",o().createElement("br",null),o().createElement("br",null),e)))}return this.props.children}}},6038(e,t,n){"use strict";n.d(t,{$$:()=>d,G8:()=>h,XS:()=>c,gR:()=>p,v_:()=>u});var r=n(1594),o=n(1442),a=n(1947),i=n(1863),s=n(6709);const l=!1,c=({i18n:e=null,onStop:t=(()=>{})}={})=>{const[n,c]=(0,r.useState)((()=>new o.A({concurrency:1,autoStart:!1}))),[u,d]=(0,r.useState)((()=>new AbortController)),p=(0,r.useRef)(!1),h=(0,r.useRef)(0),f=(0,r.useRef)(null),m=(0,r.useRef)(0),g=(0,r.useRef)(0),[y,b]=(0,r.useState)(!1),[v,k]=(0,r.useState)(null),[x,w]=(0,r.useState)(!1),[C,E]=(0,r.useState)(0),[A,S]=(0,r.useState)(!1),[O,M]=(0,r.useState)(!1),[R,_]=(0,r.useState)(0);async function $(e,t=!1){try{t&&(h.current--,_((e=>e-1))),f.current=e;const r=await e(u.signal);if(!1===(null==r?void 0:r.success))throw new Error(r.message);t&&(g.current=m.current,n.start())}catch(e){if("AbortError"===(null==e?void 0:e.name))return void console.log("[useNekoTasks] Aborted");if(h.current++,!p.current){if(z(),g.current>0)return void await N();S(e)}}finally{_((e=>e+1))}}async function N(){if(S(!1),w(!1),g.current>0){if(g.current<m.current){const e=5e3*(m.current-g.current);l,b(!0),await(0,a.yy)(e),b(!1)}g.current--}f.current&&await $(f.current,!0)}const z=(0,r.useCallback)((()=>{n.pause(),w(!0)}),[n]),T=(0,r.useCallback)($,[u,z,n]),P=(0,r.useCallback)(N,[T]),j=(0,r.useCallback)((async()=>{const e=new AbortController;d(e),S(!1),h.current=0,p.current=!1,w(!1),M(!1),_(0),E(0),c(new o.A({concurrency:1,autoStart:!1}))}),[]),I=(0,r.useCallback)((()=>{S(!1),w(!1),n.start()}),[n]),L=(0,r.useCallback)((()=>{M(!0),k(!1)}),[]),F=(0,r.useCallback)((async e=>new Promise((async t=>{S(!1),m.current=0,g.current=0,h.current=0,p.current=!1,w(!1),M(!1),k(!0),W(e),n.start(),await n.onIdle(),L(),t()}))),[L,n]),q=(0,r.useCallback)(((e=5)=>{m.current=e,g.current=e,P()}),[P]),D=(0,r.useCallback)((()=>{n.pause(),u.abort(),k(!1),S(!1),M(!1),t()}),[u,t,n]),B=(0,r.useCallback)((e=>{n.add((()=>T(e))),E((e=>e+1))}),[T,n]),W=(0,r.useCallback)((e=>{n.clear(),e.forEach((e=>B(e))),_(0)}),[B,n]),H=(0,r.useCallback)((()=>{p.current=!0}),[]),U=(0,r.useCallback)((()=>h.current),[]),Q=(0,r.useMemo)((()=>React.createElement(s.n,{isOpen:!!A,onRequestClose:D,title:e?e.COMMON.ERROR:"Error",content:React.createElement(React.Fragment,null,React.createElement("b",null,null!=A&&A.message?A.message:"Unknown error."),React.createElement("p",null)),customButtons:React.createElement("div",{style:{display:"flex",width:"100%",flexDirection:"column"}},React.createElement("div",{style:{display:"flex",alignItems:"center"}},React.createElement(i.M,{style:{flex:2},className:"primary",onClick:P},e?e.COMMON.RETRY:"Retry"),React.createElement(i.M,{style:{flex:1},className:"secondary",onClick:()=>q(10)},React.createElement("small",null,e?e.COMMON.AUTO_RETRY:"Auto Retry")),React.createElement(i.M,{style:{flex:2},className:"primary",onClick:I},e?e.COMMON.SKIP:"Skip"),React.createElement(i.M,{style:{flex:1},className:"secondary",onClick:()=>{H(),I()}},React.createElement("small",null,e?e.COMMON.AUTO_SKIP:"Auto Skip")),React.createElement(i.M,{style:{flex:2},className:"danger",onClick:D},e?e.COMMON.STOP:"Stop")),React.createElement("small",{style:{marginTop:10,lineHeight:"13px"}},e?e.COMMON.AUTO_RETRY_DESCRIPTION:"Auto Retry will retry the task 10 times."))})),[q,A,e,I,P,H,D]);return{start:F,stop:D,pause:z,resume:I,reset:j,retry:P,autoRetry:q,isSleeping:y,addTask:B,setAlwaysSkip:H,getErrorCount:U,TasksErrorModal:Q,error:A,success:O,busy:v,paused:x,value:R,max:C}},u=()=>{const[e,t]=(0,r.useState)(!1),[n,o]=(0,r.useState)(!1),a=(0,r.useCallback)((e=>{t(e.shiftKey),o(e.ctrlKey||e.metaKey)}),[]),i=(0,r.useCallback)((()=>{t(!1),o(!1)}),[]);return(0,r.useEffect)((()=>(document.addEventListener("keydown",a,!1),document.addEventListener("keyup",i,!1),()=>{document.removeEventListener("keydown",a,!1),document.removeEventListener("keyup",i,!1)})),[]),{pressShift:e,pressControl:n}},d=(e,t)=>{const n=(0,r.useRef)();(0,r.useEffect)((()=>{n.current=e}),[e]),(0,r.useEffect)((()=>{if(null!==t){let e=setInterval((()=>{n.current()}),t);return()=>clearInterval(e)}}),[t])},p=(...e)=>(0,r.useMemo)((()=>{const t=[];return e.forEach((e=>{if("string"==typeof e){e.trim().split(" ").filter((e=>e.length>0)).forEach((e=>t.push(e)))}else if("object"==typeof e){Object.keys(e).forEach((n=>{e[n]&&t.push(n)}))}})),t.join(" ")}),[e]),h=(e,t)=>{const n=(0,r.useRef)(null);return(0,r.useEffect)((()=>()=>{n.current&&clearTimeout(n.current)}),[]),(0,r.useCallback)(((...r)=>{n.current&&clearTimeout(n.current),n.current=setTimeout((()=>{e(...r)}),t)}),[e,t])}},8074(e,t,n){"use strict";n.d(t,{K:()=>p});var r=n(1594),o=n.n(r),a=n(390),i=n.n(a),s=n(5396),l=n(6038);function c(){return c=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)({}).hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},c.apply(null,arguments)}const u=s.Ay.a`
  display: inline-flex;
  align-items: center;
  background: linear-gradient(135deg,
    var(--neko-orange, #f97316),
    color-mix(in oklab, var(--neko-orange, #f97316) 75%, var(--neko-red, #dc2626))
  );
  position: relative;
  border-radius: 4px;
  color: white !important;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.4px;
  line-height: 1;
  padding: 3px 5px;
  text-transform: uppercase;
  text-decoration: none;
  white-space: nowrap;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.18);
  transition: filter 0.2s var(--neko-ease-out), transform 0.2s var(--neko-ease-spring);

  &:hover {
    filter: brightness(1.06);
    transform: translateY(-0.5px);
  }

  &.inline {
    display: inline-flex;
    margin-left: 6px;
    vertical-align: middle;
  }
`,d=e=>{const{show:t=!0,className:n,...r}=e,a=(0,l.gR)("neko-pro-only",n);return t?o().createElement(u,c({href:"https://meowapps.com",target:"_blank",className:a},r),"Pro"):null},p=e=>o().createElement(d,e);p.propTypes={show:i().bool,className:i().string}},4588(e,t,n){"use strict";n.d(t,{z:()=>m});var r=n(1594),o=n.n(r),a=n(390),i=n.n(a),s=n(5396),l=n(1854),c=n(896),u=n(1796),d=n(6038);function p(){return p=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)({}).hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},p.apply(null,arguments)}const h=s.Ay.div`
  font-size: var(--neko-font-size);
  margin-bottom: 16px;

  .neko-block-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 12px;
  }

  .neko-block-title-section {
    padding: 0 4px 8px 4px;

    &.has-subtitle {
      padding-bottom: 12px;
    }
  }

  .neko-block-titles {
    flex: 1;
    min-width: 0;
  }

  .neko-block-title {
    margin: 0 0 2px 0;
    font-weight: 600;
    letter-spacing: 0;
  }

  .neko-block-subtitle {
    font-size: 12px;
    opacity: 0.65;
    margin-top: 0;
    line-height: 1.45;
  }

  .neko-block-content {
    background: white;
    color: var(--neko-font-color);
    padding: 18px 18px;
    box-shadow: var(--neko-shadow-sm);
    border: 1px solid var(--neko-gray-90);
    border-radius: var(--neko-radius-md);

    p:first-child { margin-top: 0; }
    p:last-child  { margin-bottom: 0; }
    ul { list-style: disc; }
    ol { list-style: decimal; }

    .neko-toolbar {
      border: 1px solid var(--neko-gray-90);
    }
  }

  .neko-block-action { }

  /* .primary is a section on a colored workspace (like TabContent).
     Title + subtitle sit directly on the workspace bg; body is a white card.
     No inner frame, no extra padding — the workspace IS the frame. */
  &.primary {
    background: transparent;
    padding: 0;

    /* Title sits on the colored workspace, above a white card. Spec is driven
       by the --neko-surface-title-* tokens so NekoTabs.inversed shares the
       same look automatically. */
    .neko-block-title-section {
      padding: 2px 4px var(--neko-surface-title-padding-bottom) 4px;
    }

    .neko-block-title {
      color: white;
      font-size: var(--neko-surface-title-font-size);
      font-weight: var(--neko-surface-title-font-weight);
      letter-spacing: var(--neko-surface-title-letter-spacing);
      line-height: var(--neko-surface-title-line-height);
      margin: 0 0 2px 0;
    }

    .neko-block-subtitle {
      color: rgba(255, 255, 255, 0.72);
      font-size: 13px;
      line-height: 1.45;
    }

    .neko-block-content {
      box-shadow: var(--neko-shadow-sm);
    }
  }

  &.primary.accent-green   { --neko-block-accent: var(--neko-green); }
  &.primary.accent-purple  { --neko-block-accent: var(--neko-purple); }
  &.primary.accent-orange  { --neko-block-accent: var(--neko-orange); }
  &.primary.accent-red     { --neko-block-accent: var(--neko-red); }
  &.primary.accent-cyan    { --neko-block-accent: var(--neko-cyan); }

  &.standard {
    .neko-block-content { box-shadow: none; }
  }

  &.raw {
    --neko-block-accent: var(--neko-main-color);
    padding: 10px;
    background-color: var(--neko-block-accent);
    border-radius: var(--neko-radius-md);
    color: white;

    .neko-block-title,
    .neko-block-title-section .neko-block-subtitle {
      color: white;
      opacity: 0.95;
    }
    .neko-block-title-section .neko-block-subtitle { opacity: 0.7; }

    .neko-block-content {
      padding: 0;
      background: none;
      box-shadow: none;
      border: 0;
    }
  }
  &.raw.accent-green   { --neko-block-accent: var(--neko-green); }
  &.raw.accent-purple  { --neko-block-accent: var(--neko-purple); }
`,f=e=>{const{title:t,subtitle:n,children:r,className:a="",color:i,busy:s=!1,style:f={},contentStyle:m={},action:g,mwaiPillTooltip:y="",mwaiPill:b=!1,mwaiEnabled:v=!1,maxHeight:k,...x}=e,w=(0,d.gR)("neko-block",a,i?`accent-${i}`:""),C=b?o().createElement(o().Fragment,null,b?v?o().createElement(c.B,{tooltip:y,variant:"ai"},"AI Engine"):o().createElement("a",{href:"https://meowapps.com/ai-engine/",target:"_blank",rel:"noopener noreferrer",style:{display:"inline-flex",alignItems:"center",gap:"6px",padding:"4px 12px",borderRadius:"999px",backgroundColor:"#fee",color:"#c33",fontSize:"12px",textDecoration:"none",transition:"all 0.2s ease",cursor:"pointer",border:"1px solid #fcc"},onMouseEnter:e=>{e.currentTarget.style.backgroundColor="#fdd",e.currentTarget.style.color="#a22"},onMouseLeave:e=>{e.currentTarget.style.backgroundColor="#fee",e.currentTarget.style.color="#c33"}},o().createElement("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},o().createElement("path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}),o().createElement("polyline",{points:"7 10 12 15 17 10"}),o().createElement("line",{x1:"12",y1:"15",x2:"12",y2:"3"})),"AI Engine"):null,g):g;return o().createElement(h,p({className:w,style:f},x),t&&o().createElement("div",{className:"neko-block-title-section "+(n?"has-subtitle":"")},o().createElement("div",{className:"neko-block-header"},o().createElement("div",{className:"neko-block-titles"},o().createElement(l.s,{h2:!0,className:"neko-block-title"},t),n&&o().createElement("div",{className:"neko-block-subtitle"},n)),!!C&&o().createElement("div",{className:"neko-block-action"},C))),o().createElement(u.A,{busy:s},o().createElement("div",{className:"neko-block-content",style:{...m,...k?{maxHeight:k,overflowY:"auto"}:{}}},r)))},m=e=>o().createElement(f,e);m.propTypes={title:i().string,subtitle:i().string,className:i().oneOf(["","primary","standard","raw"]),color:i().oneOf(["green","purple","orange","red","cyan"]),style:i().object,contentStyle:i().object,action:i().element,busy:i().bool,mwaiPill:i().bool,mwaiEnabled:i().bool,maxHeight:i().oneOfType([i().string,i().number])}},9449(e,t,n){"use strict";n.d(t,{Zc:()=>g,y2:()=>m});var r=n(1594),o=n.n(r),a=n(390),i=n.n(a),s=n(5396),l=n(9018);const c=s.Ay.div`
  margin-bottom: 8px;
`,u=s.Ay.div`
  padding: 5px 0;
  border-bottom: 1px solid var(--neko-main-color-80);
  color: var(--neko-main-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0;
  transition: color var(--neko-duration-base) var(--neko-ease-out);

  .neko-accordion-head {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    flex: 1;
    min-width: 0;
  }

  .neko-accordion-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    color: var(--neko-main-color);
    opacity: 0.85;
    transition: opacity var(--neko-duration-base) var(--neko-ease-out);
  }

  .neko-accordion-subtitle {
    margin-left: 8px;
    color: var(--neko-gray-50);
    font-weight: 400;
    font-size: 12px;
    letter-spacing: 0;
  }

  &:hover {
    color: color-mix(in oklab, var(--neko-main-color) 85%, black);
    .neko-accordion-icon { opacity: 1; }
    /* Nudge the +/- icon on hover for feedback */
    > span:last-child { transform: rotate(90deg); }
  }
`,d=s.Ay.span`
  position: relative;
  display: inline-block;
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  color: var(--neko-main-color);
  transition: transform 0.35s var(--neko-ease-spring);

  &::before,
  &::after {
    content: '';
    position: absolute;
    background: currentColor;
    border-radius: 1px;
    transition:
      transform var(--neko-duration-base) var(--neko-ease-spring),
      opacity var(--neko-duration-base) var(--neko-ease-out);
  }
  &::before {
    top: 50%;
    left: 0;
    right: 0;
    height: 2px;
    transform: translateY(-50%);
  }
  &::after {
    left: 50%;
    top: 0;
    bottom: 0;
    width: 2px;
    transform: translateX(-50%) ${e=>e.$isCollapsed?"rotate(0deg)":"rotate(90deg) scaleY(0)"};
    opacity: ${e=>e.$isCollapsed?1:0};
  }
`,p=s.Ay.div`
  max-height: ${e=>e.$isCollapsed?"0":`${e.$contentHeight+15}px`};
  overflow: hidden;
  opacity: ${e=>e.$isCollapsed?0:1};
  transition: ${e=>e.$animate?"max-height 0.28s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.22s ease":"none"};

  /* Built-in breathing room between the accordion title underline and the
     first row of content — stories no longer need to hand-apply
     marginTop: 10 on the first child of every body. */
  > div {
    padding-top: 10px;
  }
`,h=({children:e,keepState:t})=>{const[n,a]=(0,r.useState)((()=>{if(!t)return null;try{return JSON.parse(localStorage.getItem(t))}catch{return null}}));(0,r.useEffect)((()=>{t&&localStorage.setItem(t,JSON.stringify(n))}),[n,t]);return o().createElement("div",{className:"neko-accordions"},o().Children.map(e,((e,r)=>{var i;return(null==e?void 0:e.type)===f||(null==e?void 0:e.type)===m||(null==e?void 0:e.type)===y||"NekoCollapsableCategoryDeprecated"===(null==e||null===(i=e.type)||void 0===i?void 0:i.name)?o().cloneElement(e,{isCollapsed:n!==r,onClick:()=>{var e;a(n===(e=r)?null:e)},keepState:t?`${t}-${r}`:e.props.keepState}):e})))};h.propTypes={children:i().node.isRequired,keepState:i().string};const f=({isCollapsed:e=!1,children:t,onClick:n=(()=>{}),keepState:a,disabled:i=!1,hide:s=!1,title:h,subtitle:f,icon:m,style:g})=>{const[y,b]=(0,r.useState)(e),[v,k]=(0,r.useState)(!1),x=o().Children.count(t)>0,w=(0,r.useRef)(null),[C,E]=(0,r.useState)(0);var A,S;return A=w,S=()=>{w.current&&E(w.current.scrollHeight)},(0,r.useEffect)((()=>{const e=A.current;if(!e)return;const t=new ResizeObserver((e=>{S()}));return t.observe(e),()=>t.disconnect()}),[A,S]),(0,r.useEffect)((()=>{if(a){let t=null;try{t=JSON.parse(localStorage.getItem(a))}catch{}b(null!==t?t:e)}}),[a,e]),(0,r.useEffect)((()=>{a&&localStorage.setItem(a,JSON.stringify(y))}),[y,a]),(0,r.useEffect)((()=>{b(e)}),[e]),s?null:o().createElement(c,{className:"neko-accordion",style:g},o().createElement(u,{onClick:()=>{x&&!i&&(k(!0),b(!y),n())},style:{opacity:i?.5:1,pointerEvents:i?"none":"auto"}},o().createElement("span",{className:"neko-accordion-head"},m&&o().createElement("span",{className:"neko-accordion-icon"},o().createElement(l.z,{icon:m,width:18,fill:"none",raw:!0})),m||f?o().createElement("span",null,o().createElement("span",{className:"neko-accordion-title"},h),f&&o().createElement("small",{className:"neko-accordion-subtitle"},f)):h),x&&o().createElement(d,{$isCollapsed:y})),o().createElement(p,{$isCollapsed:y,$contentHeight:C,$animate:v},o().createElement("div",{ref:w},t)))};f.propTypes={title:i().oneOfType([i().string,i().node]).isRequired,subtitle:i().node,icon:i().string,isCollapsed:i().bool,children:i().node,onClick:i().func,keepState:i().string,disabled:i().bool,hide:i().bool};const m=f,g=h,y=e=>(console.warn("[NekoUI] NekoCollapsableCategory is deprecated. Please use NekoAccordion instead."),o().createElement(f,e));y.propTypes=f.propTypes},5146(e,t,n){"use strict";n.d(t,{L:()=>p});var r=n(1594),o=n.n(r),a=n(390),i=n.n(a),s=n(5396),l=n(6038);const c=s.Ay.div`
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

    a {
      color: var(--neko-main-color);
      text-decoration: underline;
      text-underline-offset: 2px;
      text-decoration-thickness: 1px;
      transition: color 0.15s ease;
    }
    a:hover {
      color: var(--neko-main-color-10, var(--neko-main-color));
    }
  }
`,u=s.Ay.div`
  justify-content: flex-start;
  background-color: var(--neko-gray-98);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;

  &.align-right {
    justify-content: flex-end;
  }
`,d=e=>{const{header:t,headerAlign:n="left",footer:r,footerAlign:a="right",className:i,style:s={},contentStyle:d={},children:p}=e,h=(0,l.gR)("neko-container",i);return o().createElement(c,{className:h,style:s},t&&o().createElement(u,{className:`align-${n}`},t),o().createElement("div",{className:"neko-container-content",style:d},p),r&&o().createElement(o().Fragment,null,o().createElement("div",{style:{flex:"auto"}}),o().createElement(u,{className:`align-${a}`},r)))},p=e=>o().createElement(d,e);p.propTypes={header:i().element,headerAlign:i().oneOf(["left","right"]),footer:i().element,footerAlign:i().oneOf(["left","right"]),className:i().string,style:i().object,contentStyle:i().object}},9330(e,t,n){"use strict";n.d(t,{z:()=>p});var r=n(1594),o=n.n(r),a=n(390),i=n.n(a),s=n(5396),l=n(1863),c=n(6038);const u=s.Ay.div`
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
`,d=e=>{const{className:t,children:n,nekoErrors:a=[],style:i={}}=e,[s,d]=(0,r.useState)(!1),[p,h]=(0,r.useState)(!1),f=(0,c.gR)("neko-page",t);return(0,r.useEffect)((()=>{if(a&&!s)for(let e of a)if(e){d(e);break}}),[a,s]),o().createElement(u,{className:f,style:i},s&&o().createElement("div",{className:"neko-rest-error"},o().createElement("div",{className:"container"},!p&&o().createElement(o().Fragment,null,o().createElement("h3",null,"The Rest API is disabled or broken 😢"),o().createElement("p",null,"The Rest API is required for this plugin to work. It is enabled in WordPress by default since December 2016 and used by the Gutenberg Editor since 2019. In short, it allows more robustness and a much cleaner infrastructure. Soon, Wordpress will entirely depends on it, so it is important to keep it enabled."),o().createElement("p",null,o().createElement("i",null,"Last but not least: check your PHP Error Logs and your Debugging Console.")),o().createElement("p",{className:"neko-debug"},o().createElement("small",null,"URL: ",s.url,o().createElement("br",null),"CODE: ",s.code,o().createElement("br",null),"MESSAGE: ",s.message,o().createElement("br",null)))),s.body&&p&&o().createElement("p",{className:"neko-debug"},o().createElement("div",{dangerouslySetInnerHTML:{__html:s.body}})),s.body&&o().createElement(l.M,{color:"#a94242",onClick:()=>h(!p)},p?"Hide":"Display"," response from server"),o().createElement(l.M,{color:"#a94242",onClick:()=>{window.open("https://meowapps.com/fix-wordpress-rest-api/","_blank")}},"Learn about WordPress Debugging"))),n)},p=e=>o().createElement(d,e);p.propTypes={className:i().string,style:i().object,nekoErrors:i().array}},9804(e,t,n){"use strict";n.d(t,{d:()=>d});var r=n(1594),o=n.n(r),a=n(390),i=n.n(a),s=n(5396),l=n(6038);function c(){return c=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)({}).hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},c.apply(null,arguments)}const u=(0,s.Ay)((e=>{const{title:t="",contentAlign:n="left",titleStyle:r={},color:a,...i}=e,s=(0,l.gR)("neko-settings",e.className);return o().createElement("div",c({className:s},i),o().createElement("div",{className:"neko-settings-head",style:r},t||" "),o().createElement("div",{className:`neko-settings-content neko-settings-content-align-${n}`},e.children))}))`
  display: flex;
  font-family: var(--neko-font-family);
  
  ${({color:e})=>e?`\n      --settings-color: var(--neko-${e});\n    `:""}

  > .neko-settings-head {
    font-family: var(--neko-font-family);
    font-size: var(--neko-font-size);
    /* Match control height so the title text vertically centers with checkboxes/inputs */
    line-height: var(--neko-control-height);
    flex: 0 0 140px;
    min-width: 0;
    margin-right: 16px;
    font-weight: 500;
    color: var(--settings-color, var(--neko-main-color));
    /* Allow the title to wrap gracefully when needed (e.g. "Context Max Length")
       but don't let it blow up the row — hyphenate-and-wrap. */
    word-break: break-word;
    hyphens: auto;
    /* Slightly smaller line-height when wrapped keeps multi-line titles tight. */
    &:has(> br), &.is-multiline {
      line-height: 17px;
      padding-top: 6px;
    }
  }

  /* Controls align top-flush with the settings title — the title has line-height 17px
     which sits at the top of the row, and controls (all 30px — checkbox/input/select/button)
     start at the same y. */

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
`,d=e=>o().createElement(u,e);d.propTypes={title:i().string,className:i().string,contentAlign:i().string,titleStyle:i().object,color:i().oneOf(["blue","purple","green","red","orange","yellow","gray"])}},4709(e,t,n){"use strict";n.d(t,{g:()=>p});var r=n(1594),o=n.n(r),a=n(390),i=n.n(a),s=n(5396);function l(){return l=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)({}).hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},l.apply(null,arguments)}const c=s.Ay.div`
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
`,p=e=>{let{height:t=null,tiny:n=!1,small:r=!0,medium:a=!1,large:i=!1,line:s=!1,style:p,children:h,...f}=e;return t||(h||a?t=30:n?t=5:i?t=45:r&&(t=15)),o().createElement(c,l({className:"neko-spacer",height:t,style:p},f),h&&o().createElement(d,{line:s},h),!h&&o().createElement(u,null,s&&o().createElement("hr",null)))};p.propTypes={height:i().number,line:i().bool,tiny:i().bool,small:i().bool,medium:i().bool,large:i().bool,style:i().object}},8832(e,t,n){"use strict";n.d(t,{J:()=>m});var r=n(1594),o=n.n(r),a=n(390),i=n.n(a),s=n(5396),l=n(6038),c=n(1947);function u(){return u=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)({}).hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},u.apply(null,arguments)}const d=s.Ay.div`
  display: flex;
  flex-wrap: nowrap;
  gap: 20px;
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
`,p=s.Ay.div`
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
`,h=s.Ay.div`
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
`,f=e=>{const{children:t,isCollapsible:n=!0,defaultCollapsed:a=!1,isCollapsed:i,onToggle:s,onCollapseChange:c,sidebarFlex:f=1,mainFlex:m=2,sidebarMaxWidth:g="400px",minimal:y=!1,className:b="",...v}=e,k=void 0!==i,[x,w]=(0,r.useState)(a),C=k?i:x,E=(0,l.gR)("neko-splitview",b,{collapsed:C}),A=o().Children.toArray(t),S=A[0],O=A[1];return o().createElement(d,u({className:E},v),o().createElement(p,{className:"neko-splitview-main",$flex:m,$minimal:y},S),o().createElement(h,{className:"neko-splitview-sidebar",$flex:f,$maxWidth:g,$minimal:y},O))},m=e=>o().createElement(c.YS,null,o().createElement(f,e)),g=({children:e})=>e,y=({children:e})=>e;m.Main=g,m.Sidebar=y,m.propTypes={isCollapsible:i().bool,defaultCollapsed:i().bool,isCollapsed:i().bool,onToggle:i().func,onCollapseChange:i().func,sidebarFlex:i().number,mainFlex:i().number,sidebarMaxWidth:i().string,minimal:i().bool,className:i().string,children:i().node.isRequired},g.propTypes={children:i().node},y.propTypes={children:i().node}},9390(e,t,n){"use strict";n.d(t,{N:()=>m,Y:()=>g});var r=n(1594),o=n.n(r),a=n(390),i=n.n(a),s=n(5396),l=n(6038),c=n(1947);function u(){return u=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)({}).hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},u.apply(null,arguments)}const d=s.Ay.div`
  display: flex;
  flex-wrap: wrap;

  @media (max-width: 600px) {
    width: max-content;
    overflow-x: auto;
    padding: 0 350px 0 0;

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
`,p=s.Ay.div`
  flex: ${e=>e.$flex||1};
  min-width: 0;
  padding: 32px 30px;

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

  /* Minimal columns sit flush — give them a clean gap when adjacent on the same row.
     Exclude .full (full-width) columns which wrap to their own line. */
  &.minimal:not(.full) + .minimal:not(.full) {
    margin-left: 20px;
  }
`,h=e=>{const{children:t,...n}=e;return o().createElement(d,u({className:"neko-wrapper"},n),t)},f=e=>{const{fullWidth:t,minimal:n,size:r,...a}=e,i=(0,l.gR)("neko-column",{full:t},{minimal:n}),s=r?{"1/2":1,"1/3":1,"2/3":2,"1/4":1,"3/4":3,"1/5":1,"2/5":2,"3/5":3,"4/5":4,"1/6":1,"5/6":5}[r]||parseFloat(r):void 0;return o().createElement(p,u({className:i,$flex:s},a),e.children)},m=e=>o().createElement(c.YS,null,o().createElement(h,e)),g=e=>o().createElement(c.YS,null,o().createElement(f,e));m.propTypes={},g.propTypes={fullWidth:i().any,minimal:i().bool,size:i().oneOfType([i().oneOf(["1/2","1/3","2/3","1/4","3/4","1/5","2/5","3/5","4/5","1/6","5/6"]),i().number,i().string])}},3307(e,t,n){"use strict";n.d(t,{G:()=>u});var r=n(1594),o=n(5206),a=n.n(o),i=n(390),s=n.n(i),l=n(5373);const c=(0,r.createContext)(null),u=({children:e,visible:t=!1,targetRef:n,onClose:o,matchWidth:i=!0})=>{const s=(0,r.useRef)(),[u,d]=(0,r.useState)(0),p=(0,r.useContext)(c),h=(0,r.useRef)(new Set),f=(0,r.useMemo)((()=>({register:e=>{h.current.add(e),p&&p.register(e)},unregister:e=>{h.current.delete(e),p&&p.unregister(e)}})),[p]);(0,r.useEffect)((()=>{if(p&&t)return p.register(s),()=>p.unregister(s)}),[p,t]),(0,r.useEffect)((()=>{if(!t)return;const e=e=>{const t=[n,s,...h.current];for(const n of t)if(null!=n&&n.current&&n.current.contains(e.target))return;o&&o()};return document.addEventListener("mousedown",e),()=>document.removeEventListener("mousedown",e)}),[t,o,n]),(0,r.useEffect)((()=>{const e=document.createElement("div");return s.current=e,()=>{s.current=null}}),[]);const m=()=>{t&&s.current&&n.current&&requestAnimationFrame((()=>{var e;const t=n.current.getBoundingClientRect(),r=(null===(e=n.current.ownerDocument)||void 0===e?void 0:e.defaultView)||window,o=r.innerHeight,a=r.innerWidth;let l=s.current.querySelector(".neko-portal-content");for(;l&&!l.offsetHeight;)l=l.firstChild;const c=l?l.offsetHeight:0,u=i?t.width:l?l.offsetWidth:0,d=o-t.bottom<c?t.top-c:t.bottom;let p=t.left;const h=a-u-5;Number.isFinite(h)&&(p=Math.min(p,h)),p=Math.max(p,5);const f={position:"fixed",top:`${d}px`,left:`${p}px`,width:i?`${t.width}px`:"auto",zIndex:"9999"};Object.assign(s.current.style,f)}))};if((0,r.useEffect)((()=>{if(t&&s.current){var e;((null===(e=n.current)||void 0===e?void 0:e.ownerDocument)||document).body.appendChild(s.current);const t=setTimeout((()=>{m(),d(1)}),5);return()=>clearTimeout(t)}if(s.current){const e=s.current.parentNode;e&&e.removeChild(s.current),d(0)}}),[t,s,n]),(0,r.useLayoutEffect)((()=>{var e;m();const t=()=>m(),r=(null===(e=n.current)||void 0===e||null===(e=e.ownerDocument)||void 0===e?void 0:e.defaultView)||window;return r.addEventListener("resize",t),r.addEventListener("scroll",t),()=>{r.removeEventListener("resize",t),r.removeEventListener("scroll",t)}}),[t,s,n]),!t||!s.current)return null;const g={opacity:u,transition:"opacity 0.2s cubic-bezier(0.22, 0.61, 0.36, 1)"};return a().createPortal(React.createElement("div",{className:"neko-portal-content",style:g},React.createElement(l.A,null,React.createElement(c.Provider,{value:f},e))),s.current)};u.propTypes={children:s().node.isRequired,visible:s().bool,targetRef:s().object.isRequired,onClose:s().func,matchWidth:s().bool}},8970(e,t,n){"use strict";n.d(t,{b:()=>u});var r=n(1594),o=n.n(r),a=n(390),i=n.n(a),s=n(5396),l=n(9018);const c=s.Ay.div`
  display: flex;
  flex-direction: ${e=>e.$inline?"row":"column"};
  align-items: center;
  justify-content: center;
  gap: ${e=>e.$inline?"12px":"10px"};
  text-align: ${e=>e.$inline?"left":"center"};
  padding: ${e=>e.$inline?"16px 12px":"32px 24px"};
  color: var(--neko-gray-50);
  animation: neko-empty-fade 0.28s cubic-bezier(0.16, 1, 0.3, 1);

  @keyframes neko-empty-fade {
    from { opacity: 0; transform: translateY(4px); }
    to   { opacity: 1; transform: none; }
  }

  .neko-empty-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: ${e=>e.$inline?"32px":"56px"};
    height: ${e=>e.$inline?"32px":"56px"};
    border-radius: 50%;
    background: color-mix(in oklab, var(--neko-main-color) 8%, transparent);
    color: var(--neko-main-color);
    flex: 0 0 auto;
  }

  .neko-empty-body {
    display: flex;
    flex-direction: column;
    gap: 2px;
    max-width: ${e=>e.$inline?"none":"320px"};
  }

  .neko-empty-title {
    font-size: ${e=>e.$inline?"13px":"14px"};
    font-weight: 600;
    color: var(--neko-gray-30);
    margin: 0;
    line-height: 1.35;
  }

  .neko-empty-subtitle {
    font-size: 12px;
    color: var(--neko-gray-60);
    line-height: 1.45;
    margin: 0;
  }

  .neko-empty-action {
    margin-top: ${e=>e.$inline?"0":"8px"};
    ${e=>e.$inline?"margin-left: auto;":""}
  }
`,u=({icon:e="folder-open",title:t="Nothing yet",subtitle:n,action:r,inline:a=!1,iconSize:i,style:s,className:u})=>o().createElement(c,{$inline:a,style:s,className:u},e&&o().createElement("span",{className:"neko-empty-icon"},o().createElement(l.z,{icon:e,width:i||(a?18:28)})),o().createElement("div",{className:"neko-empty-body"},t&&o().createElement("p",{className:"neko-empty-title"},t),n&&o().createElement("p",{className:"neko-empty-subtitle"},n)),r&&o().createElement("div",{className:"neko-empty-action"},r));u.propTypes={icon:i().string,title:i().node,subtitle:i().node,action:i().node,inline:i().bool,iconSize:i().number,style:i().object,className:i().string}},6416(e,t,n){"use strict";n.d(t,{X:()=>l});var r=n(1594),o=n.n(r),a=n(390),i=n.n(a);const s=n(5396).Ay.section`
  position: relative;
  display: inline-block;
  width: ${e=>e.width}px;
  height: ${e=>e.height}px;
  line-height: 1;

  svg {
    display: block;
    overflow: visible;
  }

  .neko-gauge-content {
    position: absolute;
    left: 0;
    right: 0;
    bottom: ${e=>Math.round(.05*e.width)}px;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: white;
    text-align: center;
    pointer-events: none;
  }
`,l=({value:e=1e3,min:t=0,max:n=2500,width:a=200,background:i="#007cba",children:l})=>{const c=(0,r.useId)().replace(/:/g,""),u=Math.max(1,n-t),d=Math.max(0,Math.min(1,(e-t)/u)),p=Math.max(10,Math.round(.075*a)),h=p/2+2,f=a/2,m=a/2,g=a/2-h,y=Math.ceil(a/2+h/2),b=`M ${f-g} ${m} A ${g} ${g} 0 0 1 ${f+g} ${m}`,v=Math.PI*g,k=v*d;return o().createElement(s,{className:"neko-gauge",width:a,height:y,backgroundColor:i},o().createElement("svg",{width:a,height:y,viewBox:`0 0 ${a} ${y}`},o().createElement("defs",null,o().createElement("linearGradient",{id:`neko-gauge-${c}`,x1:"0%",y1:"0%",x2:"100%",y2:"0%"},o().createElement("stop",{offset:"0%",stopColor:"#27b775"}),o().createElement("stop",{offset:"50%",stopColor:"#f3c52c"}),o().createElement("stop",{offset:"100%",stopColor:"#f71b1b"}))),o().createElement("path",{d:b,fill:"none",stroke:"rgba(255, 255, 255, 0.18)",strokeWidth:p,strokeLinecap:"round"}),o().createElement("path",{d:b,fill:"none",stroke:`url(#neko-gauge-${c})`,strokeWidth:p,strokeLinecap:"round",strokeDasharray:`${k} ${v+1}`,style:{transition:"stroke-dasharray 0.4s var(--neko-ease-out, ease-out)"}})),o().createElement("div",{className:"neko-gauge-content"},l))};l.propTypes={value:i().number,min:i().number,max:i().number,width:i().number,background:i().string,children:i().node}},3646(e,t,n){"use strict";n.d(t,{n:()=>d});var r=n(1594),o=n.n(r),a=n(390),i=n.n(a),s=n(5396),l=n(7252);const c=s.Ay.div`
  position: relative;
  color: white;
  font-family: var(--neko-font-family);
  font-size: var(--neko-font-size);
  display: flex;
  height: 74px;
  overflow: hidden;
  align-items: center;
  padding: 18px 32px;
  background: var(--neko-main-color);
  isolation: isolate;

  .neko-header-logo-container {
    width: 44px;
    height: 44px;
    padding: 9px;
    margin-right: 16px;
    background: rgba(255, 255, 255, 0.14);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.22);
    border-radius: 12px;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 1;
    transition: transform var(--neko-duration-slow) var(--neko-ease-spring);
  }

  &:hover .neko-header-logo-container {
    transform: scale(1.05) rotate(-3deg);
  }

  .neko-header-title-container {
    flex-direction: column;
    display: flex;
    position: relative;
    z-index: 1;
    justify-content: center;

    .neko-header-title-row {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .neko-header-title {
      color: white;
      font-family: var(--neko-font-family);
      font-size: 22px;
      font-weight: 600;
      letter-spacing: 0;
      line-height: 1.1;
      margin: 0;
      position: relative;
    }

    .neko-header-separator {
      color: rgba(255,255,255,0.35);
      font-size: 18px;
      line-height: 1;
      align-self: center;
    }

    /* Section badge — green pulse dot anchors the accent color */
    .neko-header-section {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      background: rgba(255, 255, 255, 0.14);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      color: white;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.09em;
      line-height: 1;
      padding: 5px 12px 5px 10px;
      border-radius: 999px;
      border: 1px solid rgba(255, 255, 255, 0.22);
      align-self: center;
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);

      &::before {
        content: '';
        display: inline-block;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--neko-green);
        box-shadow: 0 0 8px color-mix(in oklab, var(--neko-green) 80%, transparent);
        animation: nekoSectionPulse 2s ease-in-out infinite;
      }
    }

    @keyframes nekoSectionPulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50%      { opacity: 0.55; transform: scale(0.8); }
    }

    .neko-header-subtitle {
      color: rgba(255, 255, 255, 0.7);
      font-family: var(--neko-font-family);
      line-height: 1;
      margin-top: 5px;
      font-size: 11px;
      letter-spacing: 0.05em;

      a {
        color: rgba(255, 255, 255, 0.7);
        text-decoration: none;
        font-family: var(--neko-font-family);
        transition: color 0.18s var(--neko-ease-out);
      }
      a:hover { color: white; }

      .neko-header-version {
        color: rgba(255, 255, 255, 0.5);
        margin-left: 6px;
        padding-left: 8px;
        border-left: 1px solid rgba(255, 255, 255, 0.2);
        text-transform: uppercase;
        letter-spacing: 0.12em;
        font-size: 10px;
        font-weight: 600;
        text-decoration: none;
        transition: color 0.22s ease;
      }
      a.neko-header-version:hover { color: white; }
      .neko-header-version.pro {
        color: rgba(255, 220, 150, 0.9);
      }
    }
  }

  .neko-header-extra-content {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 6px;
    position: relative;
    z-index: 1;
  }
`,u=e=>{const{title:t="NekoUI",section:n=null,subtitle:r="By Meow Apps",children:a,isPro:i=!1,showFreeBadge:s=!0}=e;return o().createElement(c,{className:"neko-header"},o().createElement("div",{className:"neko-header-logo-container"},o().createElement(l.r,null)),o().createElement("div",{className:"neko-header-title-container"},o().createElement("div",{className:"neko-header-title-row"},o().createElement("h1",{className:"neko-header-title"},t),!!n&&o().createElement(o().Fragment,null,o().createElement("span",{className:"neko-header-separator"},"›"),o().createElement("span",{className:"neko-header-section"},n))),o().createElement("small",{className:"neko-header-subtitle"},o().createElement("a",{target:"_blank",href:"https://meowapps.com"},r),(i||s)&&(i?o().createElement("span",{className:"neko-header-version pro"},"Pro"):o().createElement("a",{className:"neko-header-version",href:"https://meowapps.com",target:"_blank",rel:"noopener noreferrer",onMouseEnter:e=>{e.currentTarget.textContent="Upgrade ↗"},onMouseLeave:e=>{e.currentTarget.textContent="Free"}},"Free")))),o().createElement("div",{className:"neko-header-extra-content"},a))},d=e=>o().createElement(u,e);d.propTypes={title:i().string,section:i().string,subtitle:i().string,children:i().node,isPro:i().bool,showFreeBadge:i().bool}},9018(e,t,n){"use strict";n.d(t,{z:()=>g});var r=n(1594),o=n.n(r),a=n(390),i=n.n(a),s=n(5396),l=n(4146),c=n(9176),u=n(9825),d=n(4928),p=n(6038);const h=s.Ay.div`
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
`,f=s.Ay.div`
  width: 25px;
  height: auto;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: auto !important;
    height: 25px !important;
  }
`,m={primary:{color:"var(--neko-blue)"},success:{color:"var(--neko-green)"},warning:{color:"var(--neko-yellow)"},danger:{color:"var(--neko-red)"}},g=e=>{let{icon:t,color:n,spinning:a=!1,className:i="",tooltip:s,raw:g,isBusy:y=!1,busy:b=!1,variant:v,title:k,containerStyle:x,hoverColor:w,disabled:C=!1,width:E,height:A,strokeWidth:S,...O}=e;const M=b||y;o().useEffect((()=>{y&&console.log('NekoIcon: The "isBusy" prop is deprecated. Please use "busy" instead.')}),[y]);const R=v&&m[v]?m[v].color:n,_=v&&m[v]?m[v].hoverColor:w,$="string"==typeof t&&l.ho[t]?l.ho[t]:void 0,N=E||A||30,z=(0,r.useMemo)((()=>"string"==typeof t?l.Ay[t]?l.Ay[t]:(console.warn(`NekoIcon: Icon "${t}" does not exist. Falling back to placeholder.`),c.A):t),[t]),T=(0,r.useMemo)((()=>"string"==typeof t||"function"==typeof z||"object"==typeof z),[t,z]),P=(0,p.gR)("neko-icon",i,{"neko-clickable":!!O.onClick},{spin:a||M},{disabled:C}),j=()=>{if(M&&!C)return o().createElement(u.A,{size:N,className:"spin",strokeWidth:S});if(T){const e=z,{width:t,height:n,fill:r,...a}=O;return o().createElement(e,{size:N,fill:r||$||"none",strokeWidth:S,...a})}return o().createElement(f,null,z)};if(s)return"string"==typeof s&&(s={text:s}),o().createElement(d.f,{text:s.text,position:s.position||"top"},o().createElement(h,{style:x,className:P,$color:R,$hoverColor:_,title:k},j()));if(g){if(T){const e=z,{width:t,height:n,fill:r,...a}=O;return o().createElement(e,{size:N,color:R,fill:r||$||"none",className:P,strokeWidth:S,...a})}return o().createElement(f,null,z)}return o().createElement(h,{style:x,title:k,className:P,$color:R,$hoverColor:_},j())};g.propTypes={icon:i().oneOfType([i().elementType,i().oneOf(["duplicate","lock","lock-open","file-undo","chevron-double-left","chevron-double-right","chevron-left","chevron-right","chevron-down","chevron-up","pause","play","replay","check","check-circle","stop","checkbox-blank","checkbox-marked","delete","undo","alert","database","tools","cog","close","cat","upload","trash","pencil","dashboard","search","folder","folder-open","image-multiple-outline","plus","folder-plus","image-plus","view-grid","list","twitter","instagram","facebook","star","timer-outline","link","linkedin","pinterest","zoom-in","info-outline","image-off-outline","arrow-up","arrow-down","sort","eye","rocket-launch","calendar-month","wand","mastodon","filter","question","loading","new","save","reset","rename","edit","debug","external-link","download","share","mail","phone","message","bell","home"])]),color:i().string,spinning:i().bool,className:i().string,tooltip:i().string,raw:i().bool,busy:i().bool,isBusy:i().bool,variant:i().string}},1317(e,t,n){"use strict";n.d(t,{W:()=>p});var r=n(1594),o=n.n(r),a=n(390),i=n.n(a),s=n(5396),l=n(5146);function c(){return c=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)({}).hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},c.apply(null,arguments)}const u=s.Ay.div`
  font-family: var(--neko-font-family);
  font-size: 14px;
  line-height: 1.4;
  color: var(--neko-gray-40);

  p {
    margin: 0;
    font-size: inherit;
    line-height: inherit;
    color: inherit;
  }

  a[target="_blank"] {
    color: var(--neko-green);
    font-weight: 500;
    text-decoration: underline;
    text-decoration-color: color-mix(in oklab, var(--neko-green) 45%, transparent);
    text-decoration-thickness: 1.5px;
    text-underline-offset: 2px;
    transition: color 0.2s var(--neko-ease-out), text-decoration-color 0.2s var(--neko-ease-out);
  }

  a[target="_blank"]:hover {
    color: color-mix(in oklab, var(--neko-green) 80%, black);
    text-decoration-color: currentColor;
  }

  a[target="_blank"]::after {
    content: ' ↗';
    font-variant-position: super;
  }
`,d=e=>{const{children:t,framed:n=!0,style:r,...a}=e,i=o().createElement(u,c({className:"neko-intro-body",style:n?void 0:r},n?{}:a),t);return n?o().createElement(l.L,c({contentStyle:{padding:"22px 26px"},style:r},a),i):i},p=e=>o().createElement(d,e);p.propTypes={children:i().node,framed:i().bool,style:i().object}},5930(e,t,n){"use strict";n.d(t,{K:()=>m,o:()=>f});var r=n(1594),o=n.n(r),a=n(390),i=n.n(a),s=n(5396),l=n(9018),c=n(6038);const u=s.Ay.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px 4px;
`,d=s.Ay.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--neko-gray-50);
  cursor: pointer;
  font-family: var(--neko-font-family);
  font-weight: 500;
  font-size: 13px;
  line-height: 1.2;
  letter-spacing: 0;
  padding: 5px 10px;
  border-radius: 999px;
  transition:
    color var(--neko-duration-base) var(--neko-ease-out),
    background var(--neko-duration-base) var(--neko-ease-out);

  &:hover:not(.active) {
    color: var(--neko-font-color);
    background: color-mix(in oklab, var(--neko-main-color) 6%, transparent);
  }

  &.active {
    cursor: default;
    color: var(--neko-main-color);
    font-weight: 600;
    background: color-mix(in oklab, var(--neko-main-color) 10%, transparent);
  }

  /* Inversed — for use on dark/branded surfaces like TabContent (blue) */
  &.inversed {
    color: rgba(255, 255, 255, 0.7);

    &:hover:not(.active) {
      color: white;
      background: rgba(255, 255, 255, 0.12);
    }

    &.active {
      color: white;
      background: rgba(255, 255, 255, 0.18);
    }
  }

  span {
    color: inherit;
    opacity: 0.7;
    font-weight: 400;
    font-variant-numeric: tabular-nums;
  }
`,p=e=>{const{name:t,value:n,onChange:r,busy:a=!1,className:i,inversed:s}=e,l=(0,c.gR)("neko-quick-links",i,{inversed:s}),d=o().Children.toArray(e.children).filter((e=>!!e)).map((e=>o().cloneElement(e,{busy:a,inversed:s,isActive:e.props.value===n,onClick:e=>{e!==n&&r(e,t)}})));return o().createElement(u,{className:l},d)},h=e=>{const{title:t,value:n=0,count:r,onClick:a,busy:i,isActive:s=!1,className:u,inversed:p}=e,h=(0,c.gR)("neko-link",u,{active:s,inversed:p});return o().createElement(d,{onClick:()=>a(n),className:h},t,void 0===r?null:o().createElement("span",null,"(",i?o().createElement(l.z,{icon:"replay",spinning:!0,width:12,containerStyle:{display:"inline"}}):r,")"))},f=e=>o().createElement(p,e);f.propTypes={name:i().string,value:i().string,onChange:i().func,inversed:i().bool};const m=e=>o().createElement(h,e);m.propTypes={title:i().string,value:i().string,count:i().number,onClick:i().func,isActive:i().bool,inversed:i().bool}},1125(e,t,n){"use strict";n.d(t,{k:()=>u});var r=n(1594),o=n.n(r),a=n(390),i=n.n(a),s=n(4588),l=n(1863);const c={marginTop:10,background:"rgb(0, 72, 88)",padding:10,color:"rgb(58, 212, 58)",maxHeight:400,minHeight:200,display:"block",fontFamily:"monospace",fontSize:12,whiteSpace:"pre",overflowX:"auto",borderRadius:10,textWrap:"balance"},u=({refreshQuery:e,clearQuery:t,onRefresh:n=null,onClear:a=null,i18n:i,refreshOnMount:u=!0,scrollToBottom:d=!1,blockMaxWidth:p=800})=>{const h=(0,r.useRef)(null),[f,m]=(0,r.useState)(""),[g,y]=(0,r.useState)(!1),b=async()=>{y(!0);const t=await e();n&&n(t),m(t),y(!1)};return(0,r.useEffect)((()=>{u&&b()}),[]),(0,r.useEffect)((()=>{d&&h.current&&h.current.scrollTo(0,h.current.scrollHeight)}),[f]),o().createElement(s.z,{title:i.COMMON.LOGS,busy:g,className:"primary neko-log",style:{maxWidth:p}},o().createElement(l.M,{onClick:()=>b()},i.COMMON.REFRESH_LOGS),o().createElement(l.M,{className:"danger",onClick:()=>(async()=>{y(!0);const e=await t();a&&a(e),m(""),y(!1)})()},i.COMMON.CLEAR_LOGS),o().createElement("div",{style:c,ref:h},f))};u.propTypes={refreshQuery:i().func,clearQuery:i().func,onRefresh:i().func,onClear:i().func,i18n:i().object,refreshOnMount:i().bool,scrollToBottom:i().bool,blockMaxWidth:i().number}},7252(e,t,n){"use strict";n.d(t,{r:()=>s});var r=n(1594),o=n.n(r);const a=n(5396).Ay.div`
  display: flex;
  max-width: 128px;
  max-height: 128px;

  & > * {
    width: 100%;
    height: auto;
    object-fit: contain;
  }
`,i=()=>o().createElement(a,{className:"neko-logo"},o().createElement("svg",{width:"64",height:"46",viewBox:"0 0 64 46",fill:"none",xmlns:"http://www.w3.org/2000/svg"},o().createElement("g",{clipPath:"url(#clip0_310_229)"},o().createElement("path",{d:"M64 30.6408C64 27.7985 60.0816 25.8303 55.8298 25.8303C54.8593 25.8303 53.9311 25.933 53.076 26.1253C49.8865 19.079 41.6539 13.0853 32.0002 13.0853C30.8337 13.0853 29.6881 13.1727 28.5698 13.3392C27.2069 10.3076 22.6762 2.43426 11.5954 0.0830064C11.0491 -0.0327456 10.4946 0.240578 10.259 0.7469C8.85913 3.75608 4.74247 14.4116 10.2403 25.9931C9.58165 25.8864 8.88751 25.8303 8.17022 25.8303C3.91839 25.8303 0 27.7985 0 30.6408C0 33.483 3.91839 35.2272 8.17022 35.2272C8.71127 35.2272 9.23925 35.1988 9.74893 35.1435C9.43602 35.2664 9.12275 35.4075 8.81171 35.5677C5.69388 37.1707 3.9688 40.0312 4.95904 41.9568C5.9489 43.8824 9.2792 44.1442 12.397 42.5412C13.0464 42.2074 13.6348 41.819 14.1516 41.396C18.2627 44.4967 24.7283 45.9809 31.9998 45.9809C39.2713 45.9809 45.737 44.4967 49.848 41.396C50.3644 41.819 50.9533 42.2074 51.6026 42.5412C54.7204 44.1442 58.0503 43.8824 59.0406 41.9568C60.0305 40.0312 58.3057 37.1707 55.1879 35.5677C54.8761 35.4075 54.5621 35.2667 54.2485 35.1435C54.7589 35.1988 55.2876 35.2275 55.8294 35.2275C60.0812 35.2275 63.9996 33.4834 63.9996 30.6411L64 30.6408Z",fill:"white"}),o().createElement("path",{d:"M22.2293 36.7443C26.5935 36.7443 30.1314 33.2064 30.1314 28.8422C30.1314 24.478 26.5935 20.9401 22.2293 20.9401C17.8651 20.9401 14.3271 24.478 14.3271 28.8422C14.3271 33.2064 17.8651 36.7443 22.2293 36.7443Z",fill:"#00E28E"}),o().createElement("path",{d:"M22.2655 33.1361C23.5022 33.1361 24.5047 31.2805 24.5047 28.9915C24.5047 26.7024 23.5022 24.8468 22.2655 24.8468C21.0288 24.8468 20.0262 26.7024 20.0262 28.9915C20.0262 31.2805 21.0288 33.1361 22.2655 33.1361Z",fill:"#3C6E8B"}),o().createElement("path",{d:"M31.9998 37.9156C33.4237 37.9156 34.5781 37.3409 34.5781 36.6319C34.5781 35.9229 33.4237 35.3481 31.9998 35.3481C30.5758 35.3481 29.4215 35.9229 29.4215 36.6319C29.4215 37.3409 30.5758 37.9156 31.9998 37.9156Z",fill:"#FF9493"}),o().createElement("path",{d:"M54.2503 35.1058C54.76 35.1611 55.2879 35.1894 55.829 35.1894C60.0808 35.1894 63.9992 33.4453 63.9992 30.603C63.9992 27.7608 60.0808 25.7926 55.829 25.7926C55.1117 25.7926 54.4176 25.849 53.7585 25.9558C59.2567 14.3742 55.1397 3.71872 53.7402 0.709546C53.5046 0.203225 52.9501 -0.0700991 52.4038 0.0456529C41.323 2.39691 36.7923 10.2707 35.4298 13.3015C34.4541 13.1566 33.4579 13.0711 32.4452 13.0517C31.2743 20.033 28.9656 43.9365 54.3436 35.1439C54.3123 35.1312 54.2813 35.1181 54.2499 35.1058H54.2503Z",fill:"#2B9DFF"}),o().createElement("path",{d:"M41.7342 33.1361C42.9709 33.1361 43.9735 31.2805 43.9735 28.9915C43.9735 26.7024 42.9709 24.8468 41.7342 24.8468C40.4975 24.8468 39.495 26.7024 39.495 28.9915C39.495 31.2805 40.4975 33.1361 41.7342 33.1361Z",fill:"#3C6E8B"})),o().createElement("defs",null,o().createElement("clipPath",{id:"clip0_310_229"},o().createElement("rect",{width:"64",height:"45.9617",fill:"white",transform:"translate(0 0.019165)"}))))),s=e=>o().createElement(i,e);s.propTypes={}},60(e,t,n){"use strict";n.d(t,{X:()=>b});var r=n(1594),o=n.n(r),a=n(390),i=n.n(a),s=n(5396),l=n(6038),c=n(9680),u=n(2669),d=n(2672),p=n(6583),h=n(6739),f=n(5067);function m(){return m=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)({}).hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},m.apply(null,arguments)}const g=s.Ay.div`
  padding: ${e=>e.small?"6px 10px":"14px 16px"};
  color: white;
  border-radius: ${e=>e.small?"6px":"8px"};
  display: flex;
  align-items: center;
  gap: ${e=>e.small?"8px":"12px"};
  position: relative;
  overflow: hidden;
  border-left: ${e=>e.small?"3px":"4px"} solid rgba(0, 0, 0, 0.18);
  font-size: ${e=>e.small?"12px":"inherit"};
  line-height: 1.5;
  /* A subtle vertical brightness gradient replaces the old diagonal-stripe
     pattern — reads as dimensional but never dated. */
  background-image: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.08),
    rgba(0, 0, 0, 0.04)
  );
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12);

  &.danger {
    background-color: var(--neko-red, #dc2626);
  }

  &.success {
    background-color: var(--neko-green);
  }

  &.special {
    background-color: var(--neko-purple);
  }

  &.warning {
    background-color: var(--neko-orange);
  }

  &.info {
    background-color: var(--neko-blue);
  }

  &.disabled {
    background-color: #808080;
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
`,y=e=>{let{variant:t,children:n,onClose:r,small:a,...i}=e;t||(t="info");const s=(0,l.gR)("neko-message",{danger:"danger"===t},{success:"success"===t},{info:"info"===t},{warning:"warning"===t},{special:"special"===t},{disabled:"disabled"===t},{small:a}),y=a?14:20;return o().createElement(g,m({className:s,small:a},i),o().createElement((()=>{switch(t){case"danger":return c.A;case"success":return u.A;case"warning":return d.A;case"special":return h.A;default:return p.A}})(),{size:y,className:"neko-message-icon"}),o().createElement("div",{className:"neko-message-content"},n),r&&o().createElement(f.A,{size:y,className:"neko-message-close",onClick:r}))},b=e=>o().createElement(y,e);b.propTypes={variant:i().string,children:i().node,onClose:i().func,small:i().bool}},9659(e,t,n){"use strict";n.d(t,{Q:()=>m});var r=n(1594),o=n.n(r),a=n(390),i=n.n(a),s=n(5396),l=n(488),c=n(8955),u=n(5997),d=n(204),p=n(4146);const h=s.Ay.div`
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
`,f=e=>{const{currentPage:t,limit:n=0,onClick:a,total:i=0,onCurrentPageChanged:s,infinite:f=!1,maxInfinite:m=!1,controllerText:g,compact:y=!1}=e,b=!!s,v=(0,r.useMemo)((()=>f||m?0:Math.ceil(0===i?1:n>0?i/n:1)),[f,m,n,i]),k="nako-paging-controller-icon "+(f||1!==t?"":"disabled"),x="nako-paging-controller-icon "+(f||m||t!==v?"":"disabled"),[w,C]=(0,r.useState)(!1),[E,A]=(0,r.useState)(y),S=e=>{C(!1),a(e)},O=e=>{if(f)return e;const t=Number(e);return m?t<1?1:t:t>v?v:t<1?1:t},M=e=>{const t=e.target.value;isNaN(t)||s(O(t)),C(!1)},R=e=>{if("Enter"===e.key){e.preventDefault();const t=e.target.value;isNaN(t)||s(O(t)),C(!1)}},_=(0,r.useMemo)((()=>{if(!w){const e=()=>{b&&1!==v&&C(!0)},n=b&&v>1;return o().createElement("span",{className:n?"neko-paging-current-page":"",onClick:e},t)}return o().createElement("input",{autoFocus:!0,type:"text",className:b?"neko-paging-current-page":"",defaultValue:t,onBlur:M,onKeyPress:R})}),[t,w,s,v]),$=e=>{w&&e.target===e.currentTarget&&C(!1)},N=(0,r.useRef)(null);return(0,r.useEffect)((()=>{const e=()=>{if(N.current){const e=N.current.offsetWidth;A(y||e<280)}};return e(),window.addEventListener("resize",e),()=>window.removeEventListener("resize",e)}),[y]),o().createElement(h,{className:"neko-paging",ref:N},!!i&&o().createElement("span",{className:"neko-paging-text"},i," result",i>0?"s":""),o().createElement("div",{className:"neko-paging-controller",onClick:$},!f&&!m&&o().createElement(u.A,{className:k,onClick:()=>S(1),size:p.hS.chevron}),o().createElement(l.A,{className:k,onClick:()=>S(t-1),size:p.hS.chevron}),o().createElement("p",{className:"nako-paging-controller-text",onClick:$},g||(E?o().createElement(o().Fragment,null,_,"/",v):o().createElement(o().Fragment,null,"Page ",_," of ",v))),o().createElement(c.A,{className:x,onClick:()=>S(t+1),size:p.hS.chevron}),!f&&!m&&o().createElement(d.A,{className:x,onClick:()=>S(v),size:p.hS.chevron})))},m=e=>o().createElement(f,e);m.propTypes={currentPage:i().number,limit:i().number,total:i().number,onClick:i().func,lastPage:i().number,infinite:i().bool,maxInfinite:i().bool,controllerText:i().object}},896(e,t,n){"use strict";n.d(t,{B:()=>d});var r=n(1594),o=n.n(r),a=n(4928),i=n(390),s=n.n(i),l=n(5396);function c(){return c=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)({}).hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},c.apply(null,arguments)}const u=l.Ay.div`
  display: inline-flex;
  position: relative;
  z-index: 10;
  align-items: center;
  padding: 3px 10px;
  border-radius: 999px;
  color: white;
  font-size: 12px;
  line-height: 1;
  cursor: ${e=>e.onClick||e.link?"pointer":"default"};
  user-select: none;
  background-color: var(--neko-main-color);
  transition: background 0.3s ease, color 0.3s ease;
  vertical-align: middle;
  text-align: center;
  justify-content: center;

  a {
    color: white;
    text-decoration: none;
    cursor: pointer;
  }

  &:hover {
    ${e=>(e.onClick||e.link)&&l.AH`
      filter: brightness(1.1);
    `}
  }

  .led {
    padding: 0;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 5px;
    position: relative;
  }

  .led:before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 400%;
    height: 400%;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
    transform: translate(-50%, -50%) scale(0);
    opacity: 0;
    animation: pulse 2s infinite ease-out;
    ${e=>("warning"===e.className||"danger"===e.className)&&l.AH`
        animation: none;
      `}
  }

  @keyframes pulse {
    0% {
      transform: translate(-50%, -50%) scale(0);
      opacity: 0.7;
    }
    70% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 0;
    }
    100% {
      transform: translate(-50%, -50%) scale(0);
      opacity: 0;
    }
  }

  .led.success {
    background-color: var(--neko-green);
  }

  .led.danger {
    background-color: red;
  }

  .led.primary {
    background-color: #00a0ef;
  }

  .led.secondary {
    background-color: var(--neko-main-color);
  }

  .led.warning {
    background-color: var(--neko-yellow);
  }

  &.pill-extender {
    z-index: 1;
    position: relative;
    left: -25px;
    width: ${e=>e.extender_width||"auto"};

    .pill-extender-inner {
      display: flex;
      right: 5px;
    }

    span {
      margin-left: 20px;
    }

    &.danger {
      background-color: rgba(129, 60, 21, 0.5);
    }

    &.primary {
      background-color: rgba(var(--neko-main-color), 0.5);
    }

    &.secondary {
      background-color: rgba(var(--neko-secondary), 0.5);
    }

    &.warning {
      background-color: rgba(var(--neko-neon-yellow), 0.5);
    }

    &.success {
      background-color: rgba(var(--neko-lime), 0.5);
    }
  }

  span {
    white-space: nowrap;
    text-overflow: ellipsis;
    display: flex;
    align-items: center;
  }

  &.primary {
    background-color: var(--neko-main-color-alternative);
  }

  &.secondary {
    background-color: #f0f0f0;
    color: #333;
    
    .led.secondary {
      background-color: var(--neko-main-color);
    }
  }

  &.danger {
    background-color: var(--neko-red);
  }

  &.warning {
    background-color: var(--neko-orange);
  }

  &.success {
    background-color: var(--neko-green);
  }

  /* AI variant with magical gradient effect */
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
    background-size: 100% 100%, 300% 300%;
    animation: aiPillFlow 6s ease infinite;
    box-shadow:
      0 2px 8px rgba(168, 85, 247, 0.35),
      0 1px 3px rgba(236, 72, 153, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.4);
    border: 1px solid rgba(168, 85, 247, 0.3);

    @keyframes aiPillFlow {
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

    .led.ai {
      background: #ffeb3b;
      box-shadow: 0 0 10px rgba(255, 235, 59, 0.8);
    }
  }
`,d=({className:e="primary",variant:t,children:n=null,onClick:i=null,led:s=!0,tooltip:l="",label:d,extender_label:p=null,extender_children:h=null,extender_width:f=null,link:m=null,...g})=>{o().useEffect((()=>{e&&["primary","secondary","danger","warning","success","ai"].includes(e)&&!t&&console.warn(`NekoPill: Using 'className' prop for pill variants is deprecated. Please use 'variant' prop instead. Found className="${e}"`)}),[e,t]);const y=t||(["primary","secondary","danger","warning","success","ai"].includes(e)?e:"primary"),b=e&&!["primary","secondary","danger","warning","success","ai"].includes(e)?e:"",v=(0,r.useCallback)((e=>{i&&(i(),e.stopPropagation(),e.preventDefault())}),[i]),k=o().createElement(a.f,{text:l,position:"top"},o().createElement(u,c({className:`neko-pill ${y} ${b}`.trim(),onClick:i?v:void 0},g,{link:m}),s&&o().createElement("div",{className:`led ${y}`}),d&&o().createElement("span",null,d),n));return o().createElement(o().Fragment,null,m?o().createElement("a",{href:m,target:"_blank",rel:"noopener noreferrer"},k):k,(p||h)&&o().createElement(u,{className:`pill-extender ${y}`,extender_width:f},o().createElement("div",{className:"pill-extender-inner"},p&&o().createElement("span",null,p),h)))};d.propTypes={className:s().string,variant:s().oneOf(["primary","secondary","danger","warning","success","ai"]),children:s().node,onClick:s().func,led:s().bool,extender_label:s().string,extender_children:s().node,extender_width:s().string,link:s().string}},2448(e,t,n){"use strict";n.d(t,{j:()=>g});var r=n(1594),o=n.n(r),a=n(390),i=n.n(a),s=n(5396),l=n(6038),c=n(1863);function u(){return u=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)({}).hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},u.apply(null,arguments)}const d=s.Ay.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  color: var(--neko-gray-30);

  .neko-progress-side {
    font-size: 13px;
    font-weight: 700;
    color: var(--neko-gray-40);
    flex: 0 0 auto;
  }
`,p=s.Ay.div`
  position: relative;
  flex: 1;
  min-width: 0;
  height: var(--neko-control-height);
  padding: 3px;
  box-sizing: border-box;
  border-radius: 999px;
  background: transparent;
  /* Crisp outer border defines the pill container. The inner fill sits
     inset from the border so you read it as "pill inside a pill". */
  border: 2px solid color-mix(in oklab, var(--neko-main-color) 55%, transparent);
  overflow: hidden;

  .neko-progress-label {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    pointer-events: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0 12px;
    transition: clip-path 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  }

  /* Crisp two-layer knockout — the dark label sits on the empty track,
     the white label is clip-path'd to only reveal itself where the fill
     has passed. Both stay pin-sharp: no text-shadow, no blur. */
  .neko-progress-label.dark {
    color: var(--neko-gray-30);
  }
  .neko-progress-label.light {
    color: white;
  }
`,h={primary:"var(--neko-main-color)",success:"var(--neko-green)",warning:"var(--neko-orange)",danger:"var(--neko-red)",info:"var(--neko-blue)"},f=s.Ay.div`
  position: relative;
  height: 100%;
  width: ${e=>`${Math.max(0,Math.min(100,e.$percent))}%`};
  border-radius: 999px;
  /* Solid variant colour, pixel-sharp — no gradients, no shadows, no halos. */
  background: ${e=>h[e.$variant]||h.primary};
  transition:
    width 0.6s cubic-bezier(0.22, 1, 0.36, 1),
    background-color 0.3s ease;
  will-change: width;
`,m=s.Ay.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex: 0 0 auto;
`,g=e=>{let{value:t=0,max:n=100,busy:r=!1,isBusy:a=!1,paused:i=!1,variant:s,startLabel:h,endLabel:g,onPauseClick:y,onStopClick:b,className:v,status:k,label:x,showPercent:w,...C}=e;const E=r||a;o().useEffect((()=>{a&&console.log('NekoProgress: The "isBusy" prop is deprecated. Please use "busy" instead.')}),[a]);const A=parseFloat(t)/parseFloat(n),S=Number.isFinite(A),O=S?Math.round(100*Math.max(0,Math.min(1,A))):0;o().useEffect((()=>{S||console.warn(`NekoProgress: invalid value/max (value=${t}, max=${n}). Falling back to 0%. Make sure both are finite numbers and max > 0.`)}),[S,t,n]);const M=s||(O>=100?"success":"primary"),R=(0,l.gR)("neko-progress",v),_=E&&(y||b),$=`${O}%`;return o().createElement(d,u({className:R},C),h&&o().createElement("span",{className:"neko-progress-side"},h),o().createElement(p,null,o().createElement(f,{$percent:O,$busy:E,$variant:M}),o().createElement("span",{className:"neko-progress-label dark"},$),o().createElement("span",{className:"neko-progress-label light",style:{clipPath:`inset(0 ${100-O}% 0 0)`}},$)),g&&o().createElement("span",{className:"neko-progress-side"},g),_&&o().createElement(m,null,y&&o().createElement(c.M,{rounded:!0,className:"primary",icon:i?"play":"pause",title:i?"Resume":"Pause",onClick:y}),b&&o().createElement(c.M,{rounded:!0,className:"danger",icon:"stop",title:"Stop",onClick:b})))};g.propTypes={value:i().number,max:i().number,busy:i().bool,isBusy:i().bool,paused:i().bool,variant:i().oneOf(["primary","success","warning","danger","info"]),startLabel:i().node,endLabel:i().node,onPauseClick:i().func,onStopClick:i().func}},5719(e,t,n){"use strict";n.d(t,{uN:()=>c});var r=n(1594),o=n.n(r),a=n(390),i=n.n(a);const s={openai:{label:"O",color:"#10a37f"},anthropic:{label:"A",color:"#cc785c"},google:{label:"G",color:"#4285f4"},gemini:{label:"G",color:"#4285f4"},azure:{label:"Z",color:"#0078d4"},mistral:{label:"M",color:"#ff7000"},openrouter:{label:"R",color:"#6b7280"},ollama:{label:"L",color:"#111827"},claude:{label:"A",color:"#cc785c"},perplexity:{label:"P",color:"#1fb8c4"}},l=({provider:e,size:t=16,style:n,title:r})=>{const a=s[null==e?void 0:e.toLowerCase()]||{label:"?",color:"var(--neko-gray-60)"};return o().createElement("span",{title:r||e,style:{display:"inline-flex",alignItems:"center",justifyContent:"center",width:t,height:t,borderRadius:"50%",background:a.color,color:"white",fontSize:Math.round(.6*t),fontWeight:700,fontFamily:"var(--neko-font-family)",lineHeight:1,verticalAlign:"middle",...n}},a.label)};l.propTypes={provider:i().oneOf(Object.keys(s)),size:i().number,title:i().string,style:i().object};i().arrayOf(i().string),i().number,i().number,i().object;const c=e=>s[null==e?void 0:e.toLowerCase()]||{label:"?",color:"var(--neko-gray-60)"};Object.keys(s)},1148(e,t,n){"use strict";n.d(t,{H:()=>m});var r=n(1594),o=n.n(r),a=n(390),i=n.n(a);const s={display:"flex",alignItems:"center",position:"relative",flex:"1 1 auto"},l={background:"linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",color:"#64748b",margin:0,fontSize:13,fontWeight:500,border:"1px solid #e2e8f0",borderRadius:10,fontFamily:"'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace",overflow:"hidden",flex:"1 1 auto",boxShadow:"0 1px 2px rgba(0, 0, 0, 0.04)",transition:"all 0.2s ease",letterSpacing:"0"},c={...l,display:"flex",alignItems:"center",height:36,padding:"0 15px 0 35px",whiteSpace:"pre",textOverflow:"ellipsis"},u={...l,display:"block",minHeight:36,padding:"8px 15px 8px 35px",whiteSpace:"pre-wrap",wordBreak:"break-word",lineHeight:1.45,textIndent:0},d={position:"absolute",left:5,top:4,display:"flex",alignItems:"center",justifyContent:"center",width:28,height:28,background:"transparent",border:"none",borderRadius:6,cursor:"pointer",color:"#94a3b8",transition:"all 0.15s ease",zIndex:1},p=({copied:e})=>o().createElement("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",style:{transition:"all 0.15s ease"}},e?o().createElement("polyline",{points:"20 6 9 17 4 12"}):o().createElement(o().Fragment,null,o().createElement("rect",{x:"9",y:"9",width:"13",height:"13",rx:"2",ry:"2"}),o().createElement("path",{d:"M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"})));function h(e,t,n=!1){const r=Object.entries(t);if(!r.length)return`[${e}]`;const o=r.map((([e,t])=>`${e}="${t}"`));return n?`[${e}\n  ${o.join("\n  ")}\n]`:`[${e} ${o.join(" ")}]`}function f(e){const t=document.createElement("textarea");t.value=e,t.style.position="fixed",t.style.left="-9999px",t.style.top="-9999px",document.body.appendChild(t),t.focus(),t.select();try{return document.execCommand("copy"),!0}catch{return!1}finally{document.body.removeChild(t)}}const m=e=>{const{prefix:t="code-engine",name:n="shortcode",params:a={id:1},color:i="green",multiline:l=!1}=e,[m,g]=(0,r.useState)(!1),[y,b]=(0,r.useState)(!1),v=h(t,a,l),k=h(t,a,!1),x=function(e,t){return e.split(/(".*?")/).map(((e,n)=>/^".*"$/.test(e)?o().createElement("span",{key:n,style:{color:`var(--neko-${t})`,fontWeight:600}},e):o().createElement(o().Fragment,{key:n},e)))}(v,i);return o().createElement("div",{className:"neko-shortcode",style:s,onMouseEnter:()=>b(!0),onMouseLeave:()=>b(!1)},o().createElement("button",{onClick:async e=>{e.stopPropagation();let t=!1;if(navigator.clipboard&&window.isSecureContext)try{await navigator.clipboard.writeText(k),t=!0}catch{t=f(k)}else t=f(k);t&&(g(!0),setTimeout((()=>g(!1)),1500))},style:{...d,background:y?"#f1f5f9":"transparent",color:m?"#22c55e":y?"#475569":"#94a3b8"},title:m?`Copied ${n}!`:`Copy ${n}`,type:"button"},o().createElement(p,{copied:m})),o().createElement("pre",{style:{...l?u:c,borderColor:y?"#cbd5e1":"#e2e8f0",background:y?"linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)":"linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)"}},x))};m.propTypes={prefix:i().string,name:i().string,params:i().object,color:i().string,multiline:i().bool}},1046(e,t,n){"use strict";n.d(t,{X:()=>g});var r=n(1594),o=n.n(r),a=n(390),i=n.n(a),s=n(5396),l=n(6038),c=n(9018);function u(){return u=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)({}).hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},u.apply(null,arguments)}const d=s.Ay.div`
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
`,p=({className:e,size:t,...n})=>{const r=(0,l.gR)("neko-spinner",n.className);return o().createElement(d,u({className:r,size:t},n),o().createElement("div",{className:"double-bounce1"}),o().createElement("div",{className:"double-bounce2"}))},h=s.Ay.div`
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
`,f=({className:e,size:t="24px",color:n="#666",...r})=>{const a=(0,l.gR)("neko-spinner-icon",e),i=parseInt(t);return o().createElement(h,u({className:a,size:t},r),o().createElement(c.z,{icon:"sync",width:i,height:i,color:n,raw:!0}))},m=e=>{const{type:t="icon",...n}=e;return"circle"===t?o().createElement(p,n):o().createElement(f,n)},g=e=>o().createElement(m,e);g.propTypes={type:i().oneOf(["circle","icon"]),size:i().string,color:i().string}},4928(e,t,n){"use strict";n.d(t,{f:()=>f});var r=n(1594),o=n.n(r),a=n(5206),i=n.n(a),s=n(390),l=n.n(s),c=n(5396),u=n(6038);const d=c.Ay.div`
  display: inline-block;
`,p=c.Ay.div`
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
`,h=e=>{const{text:t="Hello world!",position:n="top",maxWidth:a=160}=e,[s,l]=(0,r.useState)(!1),c=(0,u.G8)((e=>l(e)),100),[h,f]=(0,r.useState)({top:0,left:0}),m=(0,r.useRef)(null);return(0,r.useEffect)((()=>{if(s&&m.current){const e=m.current.getBoundingClientRect();let t=0,r=0;const o=window.scrollY||window.pageYOffset,a=window.scrollX||window.pageXOffset;switch(n){case"top":t=e.top+o,r=e.left+e.width/2+a;break;case"bottom":t=e.bottom+o,r=e.left+e.width/2+a;break;case"left":t=e.top+e.height/2+o,r=e.left+a;break;case"right":t=e.top+e.height/2+o,r=e.right+a}f({top:t,left:r})}}),[s,n]),o().createElement(d,{className:"neko-tooltip",ref:m,style:e.style,onMouseEnter:()=>t&&c(!0),onMouseLeave:()=>c(!1)},e.children,i().createPortal(o().createElement(p,{visible:s,position:n,$maxWidth:a,style:{top:h.top,left:h.left}},"string"==typeof t?t.split("\n").map(((e,t)=>o().createElement(o().Fragment,{key:t},e,o().createElement("br",null)))):t),document.body))},f=e=>e.text?o().createElement(h,e):e.children||null;f.propTypes={style:l().object,text:l().string,position:l().oneOf(["top","right","bottom","left"]),maxWidth:l().number}},1854(e,t,n){"use strict";n.d(t,{s:()=>x});var r=n(1594),o=n.n(r),a=n(390),i=n.n(a),s=n(5396),l=n(6038);function c(){return c=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)({}).hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},c.apply(null,arguments)}const u="\n  font-family: var(--neko-font-family);\n  font-weight: normal;\n  line-height: normal;\n  margin-top: 0;\n  margin-bottom: 16px;\n  padding: 0;\n",d=s.Ay.h1`
  ${u}
  font-size: var(--neko-h1-font-size);
`,p=s.Ay.h2`
  ${u}
  font-size: var(--neko-h2-font-size);
`,h=s.Ay.h3`
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
`,k=e=>{const{children:t=null,style:n={},className:r="",bold:a=!1,h1:i,h2:s,h3:u,h4:k,h5:x,h6:w,p:C,span:E,label:A,...S}=e,O=a?{fontWeight:"bold"}:{},M=(0,l.gR)("neko-typo",r,{"neko-typo-h1":i},{"neko-typo-h2":s},{"neko-typo-h3":u},{"neko-typo-h4":k},{"neko-typo-h5":x},{"neko-typo-h6":w},{"neko-typo-p":C},{"neko-typo-label":A});return i?o().createElement(d,c({style:{...O,...n},className:M},S),t):s?o().createElement(p,c({style:{...O,...n},className:M},S),t):u?o().createElement(h,c({style:{...O,...n},className:M},S),t):k?o().createElement(f,c({style:{...O,...n},className:M},S),t):x?o().createElement(m,c({style:{...O,...n},className:M},S),t):w?o().createElement(g,c({style:{...O,...n},className:M},S),t):C?o().createElement(y,c({style:{...O,...n},className:M},S),t):A?o().createElement(v,c({style:{...O,...n},className:M},S),t):o().createElement(b,c({style:{...O,...n},className:M},S),t)},x=e=>o().createElement(k,e);x.propTypes={h1:i().any,h2:i().any,h3:i().any,h4:i().any,h5:i().any,h6:i().any,p:i().any,span:i().any,label:i().any,bold:i().bool,style:i().object,className:i().string,children:i().node}},7282(e,t,n){"use strict";n.d(t,{Z:()=>h});var r=n(1594),o=n.n(r),a=n(390),i=n.n(a),s=n(5396),l=n(1796),c=n(1947),u=n(6038);function d(){return d=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)({}).hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},d.apply(null,arguments)}const p=s.Ay.div`
  &.dropping {
    background: #a4d5ff;
  }
`,h=(0,r.forwardRef)(((e,t)=>{const{onSuccess:n=(()=>{}),onFailure:a=(()=>{}),apiUrl:i,onSelectFiles:s=(()=>{}),apiConfig:h,className:f,disabled:m=!1,children:g,multiple:y,accept:b="image/*",...v}=e,[k,x]=(0,r.useState)(!1),[w,C]=(0,r.useState)(!1),E=i,A=(0,r.useCallback)((async e=>{C(!0);const t=await Promise.all(e.map((async e=>await(async e=>{const t={...h,file:e};return await(0,c.Tb)(i,t)})(e)))),r=t.filter((e=>e.success)),o=t.filter((e=>!e.success));r.length&&n(y?r:r[0]),o.length&&a(y?o:o[0]),C(!1)}),[i,y,h,n,a]),S=(0,r.useCallback)(((e,t)=>{t.preventDefault(),t.stopPropagation(),x(!1),E?A(e):s(e)}),[E,A]),O=(0,r.useCallback)((e=>{e.preventDefault(),e.stopPropagation()}),[]),M=(0,r.useCallback)((e=>{e.preventDefault(),e.stopPropagation(),m||x(!0)}),[m]),R=(0,r.useCallback)((e=>{e.preventDefault(),e.stopPropagation(),m||x(!1)}),[m]),_=(0,r.useCallback)((e=>{if(e.preventDefault(),e.stopPropagation(),m)return;const t=[...e.dataTransfer.files];e.target.value=null,S(t,e)}),[m,S]),$=(0,r.useCallback)((e=>{const t=[...e.target.files];e.target.value=null,S(t,e)}),[S]),N=(0,u.gR)("neko-upload-drop-area",f,{dropping:k});return o().createElement(l.A,{busy:w},o().createElement("input",{type:"file",accept:".csv, .json, .jsonl, .txt",ref:t,onChange:$,style:{display:"none"},multiple:y,disabled:m}),o().createElement(p,d({className:N,onDragOver:O,onDragEnter:M,onDragLeave:R,onDrop:_},v),g))}));h.propTypes={ref:i().ref,onSuccess:i().func,onFailure:i().func,onSelectFiles:i().func,apiUrl:i().string,apiConfig:i().object,disabled:i().bool}},6709(e,t,n){"use strict";n.d(t,{n:()=>y});var r=n(1594),o=n.n(r),a=n(390),i=n.n(a),s=n(6995),l=n.n(s),c=n(5396),u=n(1863),d=n(6038);function p(){return p=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)({}).hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},p.apply(null,arguments)}const h=c.DU`
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
    /* Top padding so primary-button hover-lift (transform: translateY(-1px))
       isn't clipped by the parent's overflow:hidden. */
    padding: 4px 15px 0;

    .title { margin-bottom: 0; align-self: center; }
    .button-group { gap: 5px; }
  }

  /* Footer variation for full-size mode */
  .button-group.full-size-footer {
    margin: 0;
    padding: 10px 15px;
  }
`,m=["disabled","ok","okOnClick","okDisabled","cancel","cancelOnClick","cancelDisabled"],g=e=>{const{className:t,style:n,contentStyle:a,title:i="",content:s="",contentWidth:c,customButtons:g=null,okOnEnter:y=!1,thumbnail:b,okButton:v={},cancelButton:k={},action:x=null,isOpen:w,children:C,customButtonsPosition:E="right",size:A="normal",fullSize:S=!1,...O}=e,M=A||(S?"full-size":"normal"),R="full-size"===M,_=(0,d.gR)("neko-modal",t,{large:"large"===M,larger:"larger"===M,"full-size":R,"custom-modal":n}),{label:$="OK",...N}=v,{label:z="Cancel",...T}=k;(0,r.useEffect)((()=>{const t=m.filter((t=>void 0!==e[t]));t.length&&console.warn(`[Deprecated] NekoUI: Button attributes ${t.join(", ")} are deprecated in NekoModal.\nPlease use: okButton={{ label, onClick, disabled }} and cancelButton={{ ... }}`,{props:e})}),[e]);const P=(0,r.useCallback)((({key:e})=>{"Enter"===e&&N.onClick&&N.onClick()}),[N]);(0,r.useEffect)((()=>{if(y&&w)return window.addEventListener("keyup",P),()=>window.removeEventListener("keyup",P)}),[y,w,P]);const j=C||o().createElement(f,{size:M,contentWidth:c},R&&i&&o().createElement("div",{className:"full-size-header"},o().createElement("p",{className:"title"},i),x&&o().createElement("div",{className:"button-group"},x)),!R&&i&&o().createElement("p",{className:"title"},i),o().createElement("div",{className:"content-container"},b&&o().createElement("div",{className:"thumbnail"},b),s&&o().createElement("div",{className:"content",style:a},s)),o().createElement("div",{className:"button-group"+(R?" full-size-footer":"")},o().createElement(o().Fragment,null,g&&"left"===E&&g,T.onClick&&o().createElement(u.M,p({className:"danger"},T),z),N.onClick&&o().createElement(u.M,N,$),g&&"right"===E&&g)));return o().createElement(o().Fragment,null,o().createElement(h,null),o().createElement(l(),p({ariaHideApp:!1,closeTimeoutMS:200,className:_,style:n,isOpen:w},O),j))},y=e=>o().createElement(g,e);y.propTypes={className:i().string,style:i().object,contentStyle:i().object,title:i().string,content:i().string,contentWidth:i().string,customButtons:i().object,okOnEnter:i().bool,thumbnail:i().element,okButton:i().object,cancelButton:i().object,action:i().element,size:i().oneOf(["normal","large","larger","full-size"]),fullSize:i().bool,isOpen:i().bool.isRequired}},5510(e,t,n){"use strict";n.d(t,{o:()=>_});var r=n(1594),o=n.n(r),a=n(390),i=n.n(a),s=n(5396),l=n(217),c=n(6104),u=n(4146),d=n(1796),p=n(4764),h=n(6038);var f=n(9018),m=n(3307),g=n(9649),y=n(6242),b=n(1863),v=n(4709),k=n(8865);const x=s.Ay.div`
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
  }
`,w=({accessor:e,options:t,type:n="checkbox",onChange:o,description:a,filters:i})=>{const[s,l]=(0,r.useState)(!1),[c,u]=(0,r.useState)(i||""),[d,h]=(0,r.useState)(i||""),w=(0,r.useRef)(null),C=(0,r.useRef)(null),E="text"===n;(0,r.useEffect)((()=>{E&&i!==c&&(u(i||""),h(i||""))}),[i,E]);const A=i&&i.length>0||c.length>0,S="checkbox"===n,O="select"===n,M=(t=void 0)=>{void 0!==t&&t!==c&&u((()=>t)),d!==c&&(o(e,d),u(d))};return(0,r.useEffect)((()=>{M(),s&&setTimeout((()=>{C.current&&C.current.focus()}),10)}),[s]),React.createElement(React.Fragment,null,React.createElement("div",{ref:w},React.createElement(f.z,{icon:"filter",fill:A?"white":void 0,onClick:()=>l(!s),width:16,height:16})),React.createElement(m.G,{visible:s,targetRef:w,onClose:()=>l(!1)},React.createElement(x,{className:"neko-table-filters"},React.createElement("div",{className:"neko-context-menu"},!!a&&React.createElement("p",{style:{marginTop:0,marginBottom:5}},a),React.createElement("div",{className:"neko-context-content"},S&&React.createElement(g.E,{name:"neko-context-menu-checkboxes"},t.map((t=>React.createElement(p.R,{small:!0,key:t.value,label:t.label,checked:null==i?void 0:i.includes(t.value),onChange:n=>{if(i)return o(e,n?[...i,t.value]:i.filter((e=>e!=t.value)));console.error("[NekoUI] filters needs to be set for the NekoTable.",{accessor:e,option:t.value})}})))),O&&React.createElement(y.u,{name:"neko-context-menu-select",value:i,onChange:t=>o(e,t)},t.map((e=>React.createElement(y.j,{id:e.value,key:e.value,label:e.label,value:e.value,checked:i===e.value}))))),E&&React.createElement(k.A,{ref:C,name:"neko-context-menu-text",value:d,onChange:e=>h(e),onEnter:e=>{M(e),l(!1)}}),React.createElement(v.g,{tiny:!0}),React.createElement("div",{className:"neko-context-menu-bottom-actions"},React.createElement(b.M,{fullWidth:!0,disabled:!A,onClick:()=>{o(e,S?[]:null),h(""),l(!1),u("")}},"Reset"))))))};function C(){return C=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)({}).hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},C.apply(null,arguments)}w.propTypes={accessor:i().string,options:i().array,type:i().oneOf(["checkbox","select","text"]),onChange:i().func,filters:i().oneOfType([i().string,i().array])};const E=s.Ay.table`
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
    padding: 7px 8px;
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
        transition: transform 0.28s var(--neko-ease-spring);

        svg {
          color: rgba(255, 255, 255, 0.55);
          display: block;
          width: 18px;
          height: 18px;
          transition: color 0.2s var(--neko-ease-out);
        }

        &:hover svg {
          color: rgba(255, 255, 255, 0.85);
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
        position: relative;
        background: var(--neko-main-color);
        filter: brightness(1.2);
        color: white;
        box-shadow: 0 -1px 0 var(--neko-main-color);
        z-index: 1;

        > td {
          position: relative;
          z-index: 2;
          border-bottom-color: transparent;
        }

        small {
          opacity: 0.65;
        }

        a {
          color: #81e8ff;
        }

        .neko-button {
          border: 1px solid white;
        }
    }
    
    td small {
      display: block;
      font-size: var(--neko-small-font-size);
      color: var(--neko-gray-60);
      line-height: 14px;
      margin-top: 2px;
    }
    
    tr.selected td small {
      color: white;
      opacity: 0.65;
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
        transition: background 0.18s var(--neko-ease-out);

        /* Subtle brand-blue row hover — clearly legible without fighting
           the zebra striping. */
        &:hover:not(.selected) {
          background: color-mix(in oklab, var(--neko-main-color) 8%, transparent);
        }

        &.selected, &.selected:nth-child(even) {
          position: relative;
          background: var(--neko-main-color);
          filter: brightness(1.2);
          color: white;
          box-shadow: 0 -1px 0 var(--neko-main-color);
          z-index: 1;

          > td {
            position: relative;
            z-index: 2;
            border-bottom-color: transparent;
          }

          small {
            opacity: 0.65;
          }

          a {
            color: #81e8ff;
          }

          .neko-button {
            border: 1px solid white;
          }
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
`,A=e=>{const{checked:t,indeterminate:n,onSelect:r=(()=>{}),onUnselect:a=(()=>{}),isBusy:i=!1,busy:s=!1}=e,l=s||i;return o().useEffect((()=>{i&&console.log('TableCheckBox: The "isBusy" prop is deprecated. Please use "busy" instead.')}),[i]),o().createElement(p.R,{small:!0,onChange:(e,t,n)=>e?r(n):a(n),checked:t,indeterminate:n,busy:t&&l,disabled:l})},S=(e,t=!1)=>{let n={};return e.align&&(n={textAlign:e.align}),t&&e.verticalAlign&&(n={...n,verticalAlign:e.verticalAlign}),e.style&&(n={...n,...e.style}),n},O=e=>!0===e?"#edf8ff":e,M=(e,t)=>{console.log("[NekoUI] Missing implementation for onFilterChange.",{filter:e,value:t})},R=e=>{const{data:t=[],selectedItems:n=[],selectedRow:a,filters:i,onFilterChange:s=M}=e,{columns:p=[],busy:f=!1,isBusy:m=!1,onSelect:g,onSelectRow:y,selectOnRowClick:b=!0,onUnselect:v,onSortChange:k=(()=>{}),variant:x="default",alternateRowColor:R=!1,sort:_,emptyMessage:$="Empty.",initialLoad:N=!1}=e,z=f||m;o().useEffect((()=>{m&&console.log('NekoTable: The "isBusy" prop is deprecated. Please use "busy" instead.')}),[m]);p.length;const T=t.some((e=>void 0===e.id));T&&console.warn('Table data is missing the "id" field. Using the index as id instead, and disabling the row selection.');const P=T?t.map(((e,t)=>void 0===e.id?{...e,id:-(t+1),disabled_row:!0}:e)):t,j=(e=>e?{backgroundColor:O(e)}:{})(R),I=P.map((e=>{const t=p.map((t=>({value:e[t.accessor],style:S(t,!0)})));return{id:e.id,disabled_row:null==e?void 0:e.disabled_row,isBusy:e.isBusy||!1,cells:t}})),L=P.map((e=>({id:e.id}))),{onSelect:F}=(({list:e,selectedList:t,callback:n,key:o="id"})=>{const{pressShift:a}=(0,h.v_)(),i=(0,r.useMemo)((()=>{if(!a||!t.length)return null;const n=t[t.length-1];return e.findIndex((e=>e[o]===n))}),[o,e,a,t]);return{onSelect:(0,r.useCallback)((r=>{if(!n)return;if(null===i)return void n([...r]);const a=r[0],s=e.findIndex((e=>e[o]===a)),l=(i<s?i:s)+1,c=i<s?s:i,u=e.slice(l,c).map((e=>e[o])).filter((e=>!t.some((t=>t===e))));n([...u,...r])}),[i,e,n,t,o])}})({list:L,selectedList:n,callback:g}),q=I.map((e=>e.id)),D=0===q.length,B=q.filter((e=>n.includes(e))),W=!D&&B.length===q.length,H=!W&&n.length>0,U=p.reduce((function(e,t,n){return!1===t.visible&&e.push(n),e}),[]),Q=!!g&&!D,K=o().createElement("tr",null,Q&&o().createElement("th",{className:"table-checkbox-cell"},o().createElement(A,{checked:W,indeterminate:H,onSelect:e=>g(q,e),onUnselect:e=>{v(H?n:q,e)}})),p.filter(((e,t)=>!U.includes(t))).map((e=>{let t=_&&_.accessor===e.accessor,n=_&&"asc"===_.by;const r=S(e);return o().createElement("th",{style:r,key:e.accessor},o().createElement("div",null,o().createElement("div",null,e.title),o().createElement("div",{style:{flex:"auto"}}),e.filters&&o().createElement("div",{className:"neko-column-action"},o().createElement(w,C({accessor:e.accessor},e.filters,{onChange:(e,t)=>s(e,t),filters:(()=>{let t=(null==i?void 0:i.find((t=>t.accessor===e.accessor)))??null;return(null==t?void 0:t.value)??null})()}))),e.sortable&&o().createElement("div",{className:"neko-column-action",onClick:r=>{let o=_&&_.accessor!==e.accessor;k(e.accessor,o||t&&n?"desc":"asc",r)}},t?n?o().createElement(c.A,{className:"neko-active",size:u.hS.chevron}):o().createElement(l.A,{className:"neko-active",size:u.hS.chevron}):o().createElement(l.A,{className:t?"neko-active":"",size:u.hS.chevron}))))}))),G=(0,h.gR)("neko-table",`neko-table-${x}`,{"neko-row-selectable":!!y}),V=((e,t)=>{const n=e.filter((e=>!1!==e.visible)),r=t?["34px"]:[];return n.forEach((e=>{if(e.width)if(e.width.endsWith("%")){const t=parseFloat(e.width)/100;r.push(`${t}fr`)}else r.push(e.width);else r.push("1fr")})),r.join(" ")})(p,Q);return o().createElement(d.A,{busy:z,spinnerTop:!0,overlayStyle:{top:"36px",bottom:"default"===x?"36px":0,height:"auto",borderRadius:0}},o().createElement(E,{className:G,$gridColumns:V},o().createElement("thead",null,K),o().createElement("tbody",null,!I.length&&!N&&o().createElement("tr",null,o().createElement("td",{style:{gridColumn:"1 / -1",textAlign:"center",minHeight:40,color:"gray"}},$)),I.map(((e,t)=>{const r=!!a&&a===e.id||n.includes(e.id),i=r||t%2!=0?{}:j;return o().createElement("tr",{key:`neko-row-${e.id}`,className:r?"selected":"",style:i,onClick:t=>{t.stopPropagation(),y&&b&&y(e.id,t)}},Q&&o().createElement("td",{className:"table-checkbox-cell"},o().createElement(A,{checked:n.includes(e.id),onSelect:t=>{t.stopPropagation(),F([e.id],t)},onUnselect:t=>{t.stopPropagation(),v([e.id],t)},isBusy:e.isBusy||(null==e?void 0:e.disabled_row)})),e.cells.map(((e,t)=>({...e,origIdx:t}))).filter((e=>!U.includes(e.origIdx))).map((t=>o().createElement("td",{key:`${e.id}-${t.origIdx}`,style:t.style},t.value))))}))),"default"===x&&o().createElement("tfoot",null,K)))},_=e=>o().createElement(R,e);_.propTypes={columns:i().arrayOf(i().any),data:i().arrayOf(i().any),busy:i().bool,isBusy:i().bool,onSelect:i().func,onSelectRow:i().func,selectOnRowClick:i().bool,onUnselect:i().func,selectedItems:i().arrayOf(i().any),onSortChange:i().func,variant:i().string,alternateRowColor:i().oneOfType([i().bool,i().string]),initialLoad:i().bool}},3447(e,t,n){"use strict";n.d(t,{V:()=>q,_:()=>F});var r=n(1594),o=n.n(r),a=n(390),i=n.n(a),s=n(5396),l=n(8074),c=n(9018),u=n(3307),d=n(8865),p=n(1854),h=n(896),f=n(217),m=n(6038),g=n(1796);function y(){return y=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)({}).hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},y.apply(null,arguments)}const b=320,v=120,k=72,x=5,w=2,C=44,E=12,A=.25,S=s.Ay.div`
  font-size: var(--neko-font-size);
  margin-bottom: 16px;
`,O=s.Ay.div`
  display: flex;
  align-items: stretch;
  position: relative;
  height: 39px;
`,M=s.Ay.div`
  display: flex;
  align-items: stretch;
  height: 39px;
  overflow-x: hidden;     /* we use overflow menu instead of horizontal scroll */
  flex-grow: 1;
  flex-shrink: 1;
  min-width: 0;
  max-width: 100%;
  box-shadow: inset 0 -1px 0 var(--neko-gray-90);

  /* Inversed header — no divider, pill active tab is its own marker */
  &.inversed {
    box-shadow: none;
  }

  /* Hide scrollbars defensively */
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar { display: none; }
`,R=s.Ay.div`
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
`,_=s.Ay.div`
  padding: 2px 4px var(--neko-surface-title-padding-bottom) 4px;

  .neko-tabs-title {
    margin: 0 0 2px 0;
    font-size: var(--neko-surface-title-font-size);
    font-weight: var(--neko-surface-title-font-weight);
    letter-spacing: var(--neko-surface-title-letter-spacing);
    line-height: var(--neko-surface-title-line-height);
    color: var(--neko-font-color);
  }

  .neko-tabs-subtitle {
    font-size: 13px;
    color: var(--neko-gray-50);
    line-height: 1.45;
  }

  /* Inversed — title sits on the brand-blue workspace above a tab panel card.
     Title tokens above keep the spec identical to NekoBlock.primary titles. */
  &.inversed {
    .neko-tabs-title { color: white; }
    .neko-tabs-subtitle { color: rgba(255, 255, 255, 0.72); }
  }
`,$=s.Ay.button`
  /* Underline-style tabs — quiet, modern, text-first.
     Only the text color + a slim accent bar marks the active one. */
  border: 0;
  border-radius: 8px 8px 0 0;
  background-color: transparent;
  color: var(--neko-gray-50);
  display: flex;
  align-items: center;
  cursor: pointer;
  text-align: left;
  padding: 8px 14px;
  box-sizing: border-box;
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
  position: relative;
  transition:
    background var(--neko-duration-base) var(--neko-ease-out),
    color var(--neko-duration-base) var(--neko-ease-out);

  /* Slim accent bar under the active tab */
  &::after {
    content: '';
    position: absolute;
    left: 10px;
    right: 10px;
    bottom: 0;
    height: 2px;
    border-radius: 2px 2px 0 0;
    background: var(--neko-main-color);
    transform: scaleX(0);
    transform-origin: center;
    transition: transform 0.28s var(--neko-ease-spring);
  }

  &:not(.active):not(.disabled):hover {
    background: color-mix(in oklab, var(--neko-main-color) 5%, transparent);
    color: var(--neko-font-color);
  }

  &:focus { outline: none; }
  /* Focus-visible — subtle bg tint only, no box-shadow ring (the global
     focus ring doesn't match the tab's partial border-radius). */
  &:focus-visible {
    outline: none;
    box-shadow: none;
    background: color-mix(in oklab, var(--neko-main-color) 10%, transparent);
  }

  &.active {
    color: var(--neko-main-color);
    font-weight: 600;
    background: transparent;
  }

  &.active::after {
    transform: scaleX(1);
  }

  &.disabled {
    cursor: default;
    opacity: 0.55;
    filter: grayscale(0.4);

    /* No hover effect on disabled tabs */
    &:hover { background: transparent; color: var(--neko-gray-50); }
  }

  &.hidden { display: none; }

  /* Busy state - overlay effect matching content */
  &.busy {
    cursor: default;
    pointer-events: none;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: var(--neko-main-overlay-color);
      border-radius: inherit;
      pointer-events: none;
      z-index: 1;
    }
  }


  /* Inversed = tabs living directly on the brand-blue workspace.
     Pill-style: active tab lifts into white with dark text — crisp "folder tab"
     that connects to the white content card below. */
  &.inversed {
    color: rgba(255, 255, 255, 0.7);
    padding: 9px 16px;
    border-radius: 10px 10px 0 0;
  }
  &.inversed:not(.active):not(.disabled):hover {
    color: white;
    background: rgba(255, 255, 255, 0.1);
  }
  &.inversed.active {
    color: var(--neko-font-color);
    background: white;
    font-weight: 600;
  }
  &.inversed::after {
    display: none;
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
`,N=s.Ay.div`
  /* Full brand-blue workspace. Sections float on it — titles in white,
     content in white cards. Clean and modern. */
  background: var(--neko-main-color);
  color: white;
  display: none;
  padding: 18px;
  border-radius: var(--neko-radius-md);
  margin-top: 8px;

  &.active { display: block; }

  /* Transparent content — for tabs nested inside a white card (underline style),
     so the content area inherits the parent's bg instead of being a blue block. */
  &.transparent {
    background: transparent;
    color: inherit;
    padding: 14px 0 0 0;
    margin-top: 0;
    border-radius: 0;
    box-shadow: none;
  }

  /* Inversed content = white card that connects seamlessly to the active pill tab above.
     Flat top edges so the tab row doesn't show a rounded white notch against the workspace. */
  &.inversed {
    background-color: var(--neko-white);
    color: var(--neko-font-color);
    margin-top: 0;
    border-radius: 0 0 var(--neko-radius-md) var(--neko-radius-md);
    box-shadow: var(--neko-shadow-sm);
  }
`,z=s.Ay.div`
  background: var(--neko-white);
  border: 1px solid var(--neko-input-border);
  border-radius: var(--neko-radius-md);
  box-shadow: var(--neko-shadow-lg);
  min-width: 220px;
  overflow: hidden;
`,T=s.Ay.div`
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
`,j=(e=6)=>{const t="abcdefghijklmnopqrstuvwxyz0123456789";let n="";for(let r=0;r<e;r++)n+=t[36*Math.random()|0];return n},I=e=>{const{title:t,subtitle:n,inversed:a,transparent:i,children:s,action:g,isPro:N,currentTab:I,onChange:L,keepTabOnReload:F=!1,callOnTabChangeFirst:q=!0,mwaiPill:D=!1,mwaiEnabled:B=!1,minWidth:W=k,idealWidth:H=v,maxWidth:U=b,gap:Q=x,minGap:K=w,chevronReserve:G=C,layoutBuffer:V=E,ariaLabel:X="Tabs",...Y}=e,Z=(0,r.useRef)(`nt-${j(8)}`).current,J=(0,r.useRef)(null),ee=(0,r.useRef)(null),te=(0,r.useRef)(null),ne=(0,r.useRef)(null),re=(0,r.useRef)([]),oe=(0,r.useRef)({key:"",widths:{}}),[ae,ie]=(0,r.useState)([]),[se,le]=(0,r.useState)(!1),[ce,ue]=(0,r.useState)(""),[de,pe]=(0,r.useState)(!1),[he,fe]=(0,r.useState)(Q),[me,ge]=(0,r.useState)((()=>{if("string"==typeof I)return I;if(F&&"undefined"!=typeof window)try{return new URL(window.location.href).searchParams.get("nekoTab")||""}catch{}return""})),ye=(0,r.useRef)(!1);(0,r.useEffect)((()=>{fe(Q)}),[Q]);const be=(0,r.useCallback)((e=>{var t;if("undefined"!=typeof window&&null!==(t=history)&&void 0!==t&&t.replaceState&&"string"==typeof e)try{const t=new URLSearchParams(window.location.search);t.set("nekoTab",e);const n=window.location.protocol+"//"+window.location.host+window.location.pathname+"?"+t.toString();window.history.replaceState({path:n},"",n)}catch{}}),[]),ve=(0,r.useMemo)((()=>{const e=[];return o().Children.forEach(s,(t=>{o().isValidElement(t)&&e.push(t)})),e}),[s]),ke=(0,r.useMemo)((()=>{const e=new Set;return ve.map(((t,n)=>{let r=t.key||((e,t)=>{const n=e.props||{};let r="tab-"+(t+1);return e.key?r=e.key:"string"==typeof n.title&&(r=n.title.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5\u3040-\u309f\u30a0-\u30ff\u2e80-\u2eff\u31f0-\u31ff\u3200-\u32ff\u3400-\u4dbf\uf900-\ufaff ]/gi,"").replace(/ /g,"-")),r})(t,n);e.has(r)&&(r=`${r}-${j()}`),e.add(r);const{title:o=`Untitled Tab ${n+1}`,requirePro:a=!1,hidden:i=!1,icon:s=null,busy:l=!1,isBusy:c=!1}=t.props||{};return{key:r,title:o,requirePro:!N&&a,hidden:i,icon:s,busy:l||c}}))}),[ve,N]),xe=(0,r.useMemo)((()=>ke.map((e=>e.key))),[ke]),we=(0,r.useCallback)(((e,t,n)=>{t&&!t.requirePro&&(void 0===I&&me!==t.key&&ge(t.key),L&&L(e,t,n),F&&be(t.key))}),[I,me,L,F,be]),Ce=(0,r.useMemo)((()=>{const e=new Set(ae),t=[];for(let n=0;n<ke.length;n++){const r=ke[n];r&&(r.hidden||e.has(n)||t.push(n))}return t}),[ae,ke]),Ee=(0,r.useCallback)((e=>{const t=re.current[e];t&&t.focus&&t.focus({preventScroll:!0})}),[]),Ae=(0,r.useCallback)(((e,t)=>{if(!Ce.length)return;const n=Ce.indexOf(e),r=-1===n?0:(n+t+Ce.length)%Ce.length,o=Ce[r],a=ke[o];a&&!a.requirePro&&(we(o,a),Ee(o))}),[Ce,ke,we,Ee]),Se=(0,r.useCallback)((e=>t=>{switch(t.key){case"ArrowRight":t.preventDefault(),Ae(e,1);break;case"ArrowLeft":t.preventDefault(),Ae(e,-1);break;case"Home":if(t.preventDefault(),Ce.length){const e=Ce[0],t=ke[e];t&&!t.requirePro&&(we(e,t),Ee(e))}break;case"End":if(t.preventDefault(),Ce.length){const e=Ce[Ce.length-1],t=ke[e];t&&!t.requirePro&&(we(e,t),Ee(e))}}}),[Ce,ke,we,Ee]),Oe=(0,r.useCallback)((e=>{const t=re.current[e];if(!t||"undefined"==typeof window)return H;const n=window.getComputedStyle(t);let r=(parseFloat(n.paddingLeft)||0)+(parseFloat(n.paddingRight)||0);const o=Array.from(t.children);for(const e of o){const t=e.getBoundingClientRect().width||0;if(e.classList&&e.classList.contains("neko-tab-label")){r+=Math.max(e.scrollWidth||0,t)}else r+=t}const a="number"==typeof U?U:Number.MAX_SAFE_INTEGER;return Math.min(r,a)}),[H,U]),Me=(0,r.useCallback)((()=>{const e=J.current;if(!e)return;const t=e.clientWidth,n=ne.current?ne.current.offsetWidth:0,r=ee.current?ee.current.offsetWidth:0,o=[];re.current.forEach(((e,t)=>{const n=ke[t];e&&n&&!n.hidden&&o.push(t)}));const a=o.length;if(0===a)return ie((e=>e.length?[]:e)),pe(!1),void fe((e=>Math.abs(e-Q)<A?e:Q));const i=V,s=t-r-i,l=o.join(",");if(oe.current.key!==l){const e={};o.forEach((t=>{e[t]=Oe(t)})),oe.current={key:l,widths:e}}const{widths:c}=oe.current,u=o.reduce(((e,t)=>e+(c[t]||H)),0),d=ne.current?1:0,p=u+n+(a-1+d)*Q;if(p<=s)return pe(!1),ie((e=>e.length?[]:e)),void fe((e=>Math.abs(e-Q)<A?e:Q));const h=a-1+d;if(h>0&&K<Q){const e=p-s;if(e>0&&e<=h*(Q-K)+.5){const t=Math.max(K,Q-e/h);return pe(!1),ie((e=>e.length?[]:e)),void fe((e=>Math.abs(e-t)<A?e:t))}}const f=t-(r+56)-i,m=ke.findIndex((e=>e&&e.key===me)),g=-1!==m?c[m]||H:0,y=[],b=[];let v=n+(d>0?Q:0);const k=(-1===m||o.includes(m))&&g>0?g+Q:0;for(const e of o){const t=c[e]||H;if(e===m){y.push(e),v+=t+Q;continue}v+t+Q+(-1===m||y.includes(m)?0:k)<=f?(y.push(e),v+=t+Q):b.push(e)}pe(!0),fe((e=>Math.abs(e-Q)<A?e:Q)),ie((e=>e.length===b.length&&e.every(((e,t)=>e===b[t]))?e:b))}),[ke,me,Q,K,W,H,G,V,Oe,g,t]);(0,r.useLayoutEffect)((()=>{Me()}),[Me]),(0,r.useEffect)((()=>{const e=J.current;if(!e)return;const t=()=>Me();let n;return"undefined"!=typeof ResizeObserver?(n=new ResizeObserver(t),n.observe(e)):window.addEventListener("resize",t),()=>{n?n.disconnect():window.removeEventListener("resize",t)}}),[Me]),(0,r.useEffect)((()=>{Me()}),[me,Me]),(0,r.useLayoutEffect)((()=>{for(const e of re.current){if(!e)continue;const t=e.querySelector(".neko-tab-label");t&&e.classList.toggle("needs-fade",t.scrollWidth>t.clientWidth+1)}})),(0,r.useEffect)((()=>{if(!ke.length)return;const e="string"==typeof I?I:me;if(!xe.includes(e)&&xe.length>0){const t=ke.find((e=>!e.hidden));t&&e!==t.key&&ge(t.key)}else e!==me&&ge(e)}),[I,ke,xe,me]),(0,r.useEffect)((()=>{const e=ke.find((e=>e.key===me));if(e&&e.hidden){const e=ke.find((e=>!e.hidden));e&&ge(e.key)}}),[ke,me]),(0,r.useLayoutEffect)((()=>{if(ye.current)return;if(!ke.length)return;ye.current=!0;let e=me;if(!e){var t;const n=F&&"undefined"!=typeof window?new URL(window.location.href).searchParams.get("nekoTab"):null;e=(n&&xe.includes(n)?n:null)||((null===(t=ke.find((e=>!e.hidden)))||void 0===t?void 0:t.key)??xe[0]),ge(e)}if(q){const t=xe.indexOf(e);-1!==t&&ke[t]&&we(t,ke[t])}}),[F,q,ke,xe,me,we]);const Re=(0,r.useMemo)((()=>o().Children.map(ve,((e,t)=>{const n=ke[t];if(!n)return null;const r=n.key===me&&!n.hidden;return o().cloneElement(e,{isActive:r,inversed:a,transparent:i,key:n.key,_panelId:`panel-${Z}-${t}`,_labelledById:`tab-${Z}-${t}`})}))),[ve,ke,me,a,i,Z]),_e=(0,m.gR)("neko-tabs",{inversed:a},{transparent:i});return o().createElement(S,y({className:_e},Y),t&&o().createElement(_,{className:`${a?"inversed":""} ${n?"has-subtitle":""}`},o().createElement(p.s,{h2:!0,className:"neko-tabs-title"},t),n&&o().createElement("div",{className:"neko-tabs-subtitle"},n)),o().createElement(O,null,o().createElement(M,{ref:J,role:"tablist","aria-label":X},ke.map(((e,t)=>{var n;const r=e.key===me,i=(e.hidden||ae.includes(t))&&!r,s=(null===(n=ve[t])||void 0===n?void 0:n.props)||{},u=s.busy||s.isBusy||!1,d=`neko-tab-title ${r?"active":""} ${e.requirePro?"disabled":""} ${i?"hidden":""} ${a?"inversed":""} `+(u?"busy":""),p=oe.current.widths[t]||H,h={...de?{minWidth:W,maxWidth:U,flex:`1 1 ${p}px`}:{flex:"0 0 auto"},marginRight:he};return o().createElement($,{key:e.key,id:`tab-${Z}-${t}`,ref:e=>re.current[t]=e,role:"tab","aria-selected":r,"aria-controls":`panel-${Z}-${t}`,"aria-disabled":e.requirePro||u?"true":"false",tabIndex:r?0:-1,onKeyDown:Se(t),onClick:n=>{u||we(t,e,n)},className:d,style:h,disabled:!!e.requirePro,"data-key":e.key},e.icon&&o().createElement(c.z,{icon:e.icon,width:15,height:15,style:{marginRight:5},raw:!0}),o().createElement("div",{className:"neko-tab-label",title:e.title},e.title),o().createElement(l.K,{className:"inline",show:e.requirePro,style:{marginLeft:10,marginRight:-5,top:-1}}))})),g&&o().createElement("span",{ref:ne,style:{display:"inline-flex",alignItems:"center",marginLeft:he,flex:"0 0 auto"}},g),ae.length>0&&o().createElement("span",{ref:te,role:"button",tabIndex:0,"aria-haspopup":"menu","aria-expanded":se?"true":"false","aria-label":`${ae.length} more tab${1===ae.length?"":"s"}`,onClick:()=>le((e=>!e)),onKeyDown:e=>{"Enter"!==e.key&&" "!==e.key||(e.preventDefault(),le((e=>!e)))},className:`neko-tabs-overflow-pill ${se?"open":""} ${a?"inversed":""}`,style:{display:"inline-flex",alignItems:"center",gap:3,marginLeft:he,padding:"0 10px",height:"100%",flex:"0 0 auto",cursor:"pointer",fontWeight:600,fontSize:12,letterSpacing:"0",color:a?"rgba(255, 255, 255, 0.75)":"var(--neko-gray-50)",borderRadius:"8px 8px 0 0",transition:"color 0.22s ease, background 0.22s ease"}},"+",ae.length,o().createElement(f.A,{size:14,className:"neko-tabs-chevron"}))),o().createElement(R,{ref:ee},D&&o().createElement("div",{style:{display:"flex",alignItems:"center"}},D?B?o().createElement(h.B,{variant:"ai"},"AI Engine"):o().createElement("a",{href:"https://meowapps.com/ai-engine/",target:"_blank",rel:"noopener noreferrer",style:{display:"inline-flex",alignItems:"center",gap:"6px",padding:"4px 12px",borderRadius:"999px",backgroundColor:"#fee",color:"#c33",fontSize:"12px",textDecoration:"none",transition:"all 0.2s ease",cursor:"pointer",border:"1px solid #fcc"},onMouseEnter:e=>{e.currentTarget.style.backgroundColor="#fdd",e.currentTarget.style.color="#a22"},onMouseLeave:e=>{e.currentTarget.style.backgroundColor="#fee",e.currentTarget.style.color="#c33"}},o().createElement("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},o().createElement("path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}),o().createElement("polyline",{points:"7 10 12 15 17 10"}),o().createElement("line",{x1:"12",y1:"15",x2:"12",y2:"3"})),"AI Engine"):null)),ae.length>0&&o().createElement(u.G,{visible:se,targetRef:te,onClose:()=>{le(!1),ue("")},matchWidth:!1},o().createElement(z,null,ae.length>8&&o().createElement("div",{style:{padding:6}},o().createElement(d.A,{value:ce,placeholder:"Search tabs...",onChange:e=>ue(e)})),o().createElement(T,{role:"menu"},ae.filter((e=>{var t;if(!ce)return!0;return((null===(t=ke[e])||void 0===t?void 0:t.title)||"").toLowerCase().includes(ce.toLowerCase())})).map((e=>{var t,n;return o().createElement(P,{key:(null===(t=ke[e])||void 0===t?void 0:t.key)||e,role:"menuitem",onClick:t=>{le(!1),ue(""),we(e,ke[e],t)},className:"neko-tab-overflow-item"},(null===(n=ke[e])||void 0===n?void 0:n.title)||`Tab ${e+1}`)})))))),Re,o().createElement("style",{jsx:"true"},"\n        .neko-tab-panel-wrapper {\n          border-radius: 0 0 12px 12px;\n          overflow: hidden;\n        }\n      "))},L=e=>{const{children:t,isActive:n=!1,busy:r=!1,isBusy:a=!1,inversed:i,transparent:s,_panelId:l,_labelledById:c,title:u,icon:d,requirePro:p,key:h,...f}=e,y=r||a;o().useEffect((()=>{a&&console.log('NekoTab: The "isBusy" prop is deprecated. Please use "busy" instead.')}),[a]);const b=(0,m.gR)("neko-tab-content",{active:n,inversed:i,transparent:s});return o().createElement(g.A,{busy:y,overlayStyle:{borderRadius:"0 0 12px 12px"},className:"neko-tab-panel-wrapper"},o().createElement(N,{id:l,role:"tabpanel","aria-labelledby":c,"aria-hidden":n?"false":"true",hidden:!n,className:b},n&&t))},F=e=>o().createElement(I,e);F.propTypes={title:i().string,subtitle:i().string,isPro:i().bool,onChange:i().func,action:i().node,currentTab:i().string,keepTabOnReload:i().bool,callOnTabChangeFirst:i().bool,inversed:i().bool,mwaiPill:i().bool,mwaiEnabled:i().bool,minWidth:i().number,idealWidth:i().number,maxWidth:i().number,gap:i().number,minGap:i().number,chevronReserve:i().number,layoutBuffer:i().number,ariaLabel:i().string};const q=e=>o().createElement(L,e);q.propTypes={isActive:i().bool,requirePro:i().bool,title:i().string,icon:i().string,busy:i().bool,isBusy:i().bool}},7753(e,t,n){"use strict";n.d(t,{V:()=>u});var r=n(1594),o=n.n(r),a=n(390),i=n.n(a);function s(){return s=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)({}).hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},s.apply(null,arguments)}const l=n(5396).Ay.div`
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
`,c=({align:e="left",...t})=>o().createElement(l,s({className:`neko-toolbar neko-align-${e}`},t),t.children),u=e=>o().createElement(c,e);u.propTypes={align:i().oneOf(["left","right"])}},3042(e,t,n){"use strict";var r=n(5664),o={"text/plain":"Text","text/html":"Url",default:"Text"};e.exports=function(e,t){var n,a,i,s,l,c,u=!1;t||(t={}),n=t.debug||!1;try{if(i=r(),s=document.createRange(),l=document.getSelection(),(c=document.createElement("span")).textContent=e,c.ariaHidden="true",c.style.all="unset",c.style.position="fixed",c.style.top=0,c.style.clip="rect(0, 0, 0, 0)",c.style.whiteSpace="pre",c.style.webkitUserSelect="text",c.style.MozUserSelect="text",c.style.msUserSelect="text",c.style.userSelect="text",c.addEventListener("copy",(function(r){if(r.stopPropagation(),t.format)if(r.preventDefault(),void 0===r.clipboardData){n&&console.warn("unable to use e.clipboardData"),n&&console.warn("trying IE specific stuff"),window.clipboardData.clearData();var a=o[t.format]||o.default;window.clipboardData.setData(a,e)}else r.clipboardData.clearData(),r.clipboardData.setData(t.format,e);t.onCopy&&(r.preventDefault(),t.onCopy(r.clipboardData))})),document.body.appendChild(c),s.selectNodeContents(c),l.addRange(s),!document.execCommand("copy"))throw new Error("copy command was unsuccessful");u=!0}catch(r){n&&console.error("unable to copy using execCommand: ",r),n&&console.warn("trying IE specific stuff");try{window.clipboardData.setData(t.format||"text",e),t.onCopy&&t.onCopy(window.clipboardData),u=!0}catch(r){n&&console.error("unable to copy using clipboardData: ",r),n&&console.error("falling back to prompt"),a=function(e){var t=(/mac os x/i.test(navigator.userAgent)?"⌘":"Ctrl")+"+C";return e.replace(/#{\s*key\s*}/g,t)}("message"in t?t.message:"Copy to clipboard: #{key}, Enter"),window.prompt(a,e)}}finally{l&&("function"==typeof l.removeRange?l.removeRange(s):l.removeAllRanges()),c&&document.body.removeChild(c),i()}return u}},1035(e,t,n){"use strict";var r=n(5959),o={childContextTypes:!0,contextType:!0,contextTypes:!0,defaultProps:!0,displayName:!0,getDefaultProps:!0,getDerivedStateFromError:!0,getDerivedStateFromProps:!0,mixins:!0,propTypes:!0,type:!0},a={name:!0,length:!0,prototype:!0,caller:!0,callee:!0,arguments:!0,arity:!0},i={$$typeof:!0,compare:!0,defaultProps:!0,displayName:!0,propTypes:!0,type:!0},s={};function l(e){return r.isMemo(e)?i:s[e.$$typeof]||o}s[r.ForwardRef]={$$typeof:!0,render:!0,defaultProps:!0,displayName:!0,propTypes:!0},s[r.Memo]=i;var c=Object.defineProperty,u=Object.getOwnPropertyNames,d=Object.getOwnPropertySymbols,p=Object.getOwnPropertyDescriptor,h=Object.getPrototypeOf,f=Object.prototype;e.exports=function e(t,n,r){if("string"!=typeof n){if(f){var o=h(n);o&&o!==f&&e(t,o,r)}var i=u(n);d&&(i=i.concat(d(n)));for(var s=l(t),m=l(n),g=0;g<i.length;++g){var y=i[g];if(!(a[y]||r&&r[y]||m&&m[y]||s&&s[y])){var b=p(n,y);try{c(t,y,b)}catch(e){}}}}return t}},7927(e,t,n){"use strict";n.d(t,{A:()=>s});var r=n(1594);
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
var a={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const i=(0,r.forwardRef)((({color:e="currentColor",size:t=24,strokeWidth:n=2,absoluteStrokeWidth:i,className:s="",children:l,iconNode:c,...u},d)=>(0,r.createElement)("svg",{ref:d,...a,width:t,height:t,stroke:e,strokeWidth:i?24*Number(n)/Number(t):n,className:o("lucide",s),...u},[...c.map((([e,t])=>(0,r.createElement)(e,t))),...Array.isArray(l)?l:[l]]))),s=(e,t)=>{const n=(0,r.forwardRef)((({className:n,...a},s)=>{return(0,r.createElement)(i,{ref:s,iconNode:t,className:o(`lucide-${l=e,l.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,n),...a});var l}));return n.displayName=`${e}`,n}},2676(e,t,n){"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(7927).A)("Activity",[["path",{d:"M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",key:"169zse"}]])},8576(e,t,n){"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(7927).A)("ArrowUp",[["path",{d:"m5 12 7-7 7 7",key:"hav0vg"}],["path",{d:"M12 19V5",key:"x0mq9r"}]])},6564(e,t,n){"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(7927).A)("Ban",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m4.9 4.9 14.2 14.2",key:"1m5liu"}]])},1928(e,t,n){"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(7927).A)("Bot",[["path",{d:"M12 8V4H8",key:"hb8ula"}],["rect",{width:"16",height:"12",x:"4",y:"8",rx:"2",key:"enze0r"}],["path",{d:"M2 14h2",key:"vft8re"}],["path",{d:"M20 14h2",key:"4cs60a"}],["path",{d:"M15 13v2",key:"1xurst"}],["path",{d:"M9 13v2",key:"rq6x2g"}]])},1401(e,t,n){"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(7927).A)("Brain",[["path",{d:"M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z",key:"l5xja"}],["path",{d:"M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z",key:"ep3f8r"}],["path",{d:"M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4",key:"1p4c4q"}],["path",{d:"M17.599 6.5a3 3 0 0 0 .399-1.375",key:"tmeiqw"}],["path",{d:"M6.003 5.125A3 3 0 0 0 6.401 6.5",key:"105sqy"}],["path",{d:"M3.477 10.896a4 4 0 0 1 .585-.396",key:"ql3yin"}],["path",{d:"M19.938 10.5a4 4 0 0 1 .585.396",key:"1qfode"}],["path",{d:"M6 18a4 4 0 0 1-1.967-.516",key:"2e4loj"}],["path",{d:"M19.967 17.484A4 4 0 0 1 18 18",key:"159ez6"}]])},7935(e,t,n){"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(7927).A)("Bug",[["path",{d:"m8 2 1.88 1.88",key:"fmnt4t"}],["path",{d:"M14.12 3.88 16 2",key:"qol33r"}],["path",{d:"M9 7.13v-1a3.003 3.003 0 1 1 6 0v1",key:"d7y7pr"}],["path",{d:"M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6",key:"xs1cw7"}],["path",{d:"M12 20v-9",key:"1qisl0"}],["path",{d:"M6.53 9C4.6 8.8 3 7.1 3 5",key:"32zzws"}],["path",{d:"M6 13H2",key:"82j7cp"}],["path",{d:"M3 21c0-2.1 1.7-3.9 3.8-4",key:"4p0ekp"}],["path",{d:"M20.97 5c0 2.1-1.6 3.8-3.5 4",key:"18gb23"}],["path",{d:"M22 13h-4",key:"1jl80f"}],["path",{d:"M17.2 17c2.1.1 3.8 1.9 3.8 4",key:"k3fwyw"}]])},4358(e,t,n){"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(7927).A)("Captions",[["rect",{width:"18",height:"14",x:"3",y:"5",rx:"2",ry:"2",key:"12ruh7"}],["path",{d:"M7 15h4M15 15h2M7 11h2M13 11h4",key:"1ueiar"}]])},3733(e,t,n){"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(7927).A)("Check",[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]])},3611(e,t,n){"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(7927).A)("ChevronDown",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]])},9557(e,t,n){"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(7927).A)("ChevronRight",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]])},8706(e,t,n){"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(7927).A)("CircleAlert",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]])},4228(e,t,n){"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(7927).A)("Database",[["ellipse",{cx:"12",cy:"5",rx:"9",ry:"3",key:"msslwz"}],["path",{d:"M3 5V19A9 3 0 0 0 21 19V5",key:"1wlel7"}],["path",{d:"M3 12A9 3 0 0 0 21 12",key:"mv7ke4"}]])},3401(e,t,n){"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(7927).A)("Eraser",[["path",{d:"m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21",key:"182aya"}],["path",{d:"M22 21H7",key:"t4ddhn"}],["path",{d:"m5 11 9 9",key:"1mo9qw"}]])},5635(e,t,n){"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(7927).A)("FileText",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]])},212(e,t,n){"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(7927).A)("Image",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2",key:"1m3agn"}],["circle",{cx:"9",cy:"9",r:"2",key:"af1f0g"}],["path",{d:"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",key:"1xmnt7"}]])},1525(e,t,n){"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(7927).A)("Info",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]])},4590(e,t,n){"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(7927).A)("Loader",[["path",{d:"M12 2v4",key:"3427ic"}],["path",{d:"m16.2 7.8 2.9-2.9",key:"r700ao"}],["path",{d:"M18 12h4",key:"wj9ykh"}],["path",{d:"m16.2 16.2 2.9 2.9",key:"1bxg5t"}],["path",{d:"M12 18v4",key:"jadmvz"}],["path",{d:"m4.9 19.1 2.9-2.9",key:"bwix9q"}],["path",{d:"M2 12h4",key:"j09sii"}],["path",{d:"m4.9 4.9 2.9 2.9",key:"giyufr"}]])},1172(e,t,n){"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(7927).A)("Maximize2",[["polyline",{points:"15 3 21 3 21 9",key:"mznyad"}],["polyline",{points:"9 21 3 21 3 15",key:"1avn1i"}],["line",{x1:"21",x2:"14",y1:"3",y2:"10",key:"ota7mn"}],["line",{x1:"3",x2:"10",y1:"21",y2:"14",key:"1atl0r"}]])},7080(e,t,n){"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(7927).A)("MessageSquare",[["path",{d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",key:"1lielz"}]])},6046(e,t,n){"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(7927).A)("Mic",[["path",{d:"M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z",key:"131961"}],["path",{d:"M19 10v2a7 7 0 0 1-14 0v-2",key:"1vc78b"}],["line",{x1:"12",x2:"12",y1:"19",y2:"22",key:"x3vr5v"}]])},6822(e,t,n){"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(7927).A)("Minimize2",[["polyline",{points:"4 14 10 14 10 20",key:"11kfnr"}],["polyline",{points:"20 10 14 10 14 4",key:"rlmsce"}],["line",{x1:"14",x2:"21",y1:"10",y2:"3",key:"o5lafz"}],["line",{x1:"3",x2:"10",y1:"21",y2:"14",key:"1atl0r"}]])},4989(e,t,n){"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(7927).A)("Paperclip",[["path",{d:"m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48",key:"1u3ebp"}]])},3059(e,t,n){"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(7927).A)("Pause",[["rect",{x:"14",y:"4",width:"4",height:"16",rx:"1",key:"zuxfzm"}],["rect",{x:"6",y:"4",width:"4",height:"16",rx:"1",key:"1okwgv"}]])},7307(e,t,n){"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(7927).A)("Play",[["polygon",{points:"6 3 20 12 6 21 6 3",key:"1oa8hb"}]])},3553(e,t,n){"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(7927).A)("Plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]])},1596(e,t,n){"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(7927).A)("RotateCcw",[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"1357e3"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}]])},4293(e,t,n){"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(7927).A)("Search",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]])},5700(e,t,n){"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(7927).A)("SendHorizontal",[["path",{d:"M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z",key:"117uat"}],["path",{d:"M6 12h16",key:"s4cdu5"}]])},9143(e,t,n){"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(7927).A)("Send",[["path",{d:"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",key:"1ffxy3"}],["path",{d:"m21.854 2.147-10.94 10.939",key:"12cjpa"}]])},3878(e,t,n){"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(7927).A)("Sparkles",[["path",{d:"M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",key:"4pj2yx"}],["path",{d:"M20 3v4",key:"1olli1"}],["path",{d:"M22 5h-4",key:"1gvqau"}],["path",{d:"M4 17v2",key:"vumght"}],["path",{d:"M5 18H3",key:"zchphs"}]])},858(e,t,n){"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(7927).A)("Square",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}]])},300(e,t,n){"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(7927).A)("Trash2",[["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",key:"4alrt4"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",key:"v07s0e"}],["line",{x1:"10",x2:"10",y1:"11",y2:"17",key:"1uufr5"}],["line",{x1:"14",x2:"14",y1:"11",y2:"17",key:"xtxkd"}]])},7396(e,t,n){"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(7927).A)("Upload",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"17 8 12 3 7 8",key:"t8dd8p"}],["line",{x1:"12",x2:"12",y1:"3",y2:"15",key:"widbto"}]])},2077(e,t,n){"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(7927).A)("Users",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["path",{d:"M16 3.13a4 4 0 0 1 0 7.75",key:"1da9ce"}]])},8760(e,t,n){"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(7927).A)("Wrench",[["path",{d:"M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z",key:"cbrjhi"}]])},8273(e,t,n){"use strict";n.d(t,{A:()=>r});
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const r=(0,n(7927).A)("X",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]])},9277(e,t){var n,r,o;
/* @license
Papa Parse
v5.5.3
https://github.com/mholt/PapaParse
License: MIT
*/r=[],n=function e(){var t,n="undefined"!=typeof self?self:"undefined"!=typeof window?window:void 0!==n?n:{},r=!n.document&&!!n.postMessage,o=n.IS_PAPA_WORKER||!1,a={},i=0,s={};function l(e){this._handle=null,this._finished=!1,this._completed=!1,this._halted=!1,this._input=null,this._baseIndex=0,this._partialLine="",this._rowCount=0,this._start=0,this._nextChunk=null,this.isFirstChunk=!0,this._completeResults={data:[],errors:[],meta:{}},function(e){var t=v(e);t.chunkSize=parseInt(t.chunkSize),e.step||e.chunk||(t.chunkSize=null),this._handle=new h(t),(this._handle.streamer=this)._config=t}.call(this,e),this.parseChunk=function(e,t){var r=parseInt(this._config.skipFirstNLines)||0;if(this.isFirstChunk&&0<r){let t=this._config.newline;t||(a=this._config.quoteChar||'"',t=this._handle.guessLineEndings(e,a)),e=[...e.split(t).slice(r)].join(t)}this.isFirstChunk&&x(this._config.beforeFirstChunk)&&void 0!==(a=this._config.beforeFirstChunk(e))&&(e=a),this.isFirstChunk=!1,this._halted=!1,r=this._partialLine+e;var a=(this._partialLine="",this._handle.parse(r,this._baseIndex,!this._finished));if(!this._handle.paused()&&!this._handle.aborted()){if(e=a.meta.cursor,this._finished||(this._partialLine=r.substring(e-this._baseIndex),this._baseIndex=e),a&&a.data&&(this._rowCount+=a.data.length),r=this._finished||this._config.preview&&this._rowCount>=this._config.preview,o)n.postMessage({results:a,workerId:s.WORKER_ID,finished:r});else if(x(this._config.chunk)&&!t){if(this._config.chunk(a,this._handle),this._handle.paused()||this._handle.aborted())return void(this._halted=!0);this._completeResults=a=void 0}return this._config.step||this._config.chunk||(this._completeResults.data=this._completeResults.data.concat(a.data),this._completeResults.errors=this._completeResults.errors.concat(a.errors),this._completeResults.meta=a.meta),this._completed||!r||!x(this._config.complete)||a&&a.meta.aborted||(this._config.complete(this._completeResults,this._input),this._completed=!0),r||a&&a.meta.paused||this._nextChunk(),a}this._halted=!0},this._sendError=function(e){x(this._config.error)?this._config.error(e):o&&this._config.error&&n.postMessage({workerId:s.WORKER_ID,error:e,finished:!1})}}function c(e){var t;(e=e||{}).chunkSize||(e.chunkSize=s.RemoteChunkSize),l.call(this,e),this._nextChunk=r?function(){this._readChunk(),this._chunkLoaded()}:function(){this._readChunk()},this.stream=function(e){this._input=e,this._nextChunk()},this._readChunk=function(){if(this._finished)this._chunkLoaded();else{if(t=new XMLHttpRequest,this._config.withCredentials&&(t.withCredentials=this._config.withCredentials),r||(t.onload=k(this._chunkLoaded,this),t.onerror=k(this._chunkError,this)),t.open(this._config.downloadRequestBody?"POST":"GET",this._input,!r),this._config.downloadRequestHeaders){var e,n=this._config.downloadRequestHeaders;for(e in n)t.setRequestHeader(e,n[e])}var o;this._config.chunkSize&&(o=this._start+this._config.chunkSize-1,t.setRequestHeader("Range","bytes="+this._start+"-"+o));try{t.send(this._config.downloadRequestBody)}catch(e){this._chunkError(e.message)}r&&0===t.status&&this._chunkError()}},this._chunkLoaded=function(){4===t.readyState&&(t.status<200||400<=t.status?this._chunkError():(this._start+=this._config.chunkSize||t.responseText.length,this._finished=!this._config.chunkSize||this._start>=(e=>null!==(e=e.getResponseHeader("Content-Range"))?parseInt(e.substring(e.lastIndexOf("/")+1)):-1)(t),this.parseChunk(t.responseText)))},this._chunkError=function(e){e=t.statusText||e,this._sendError(new Error(e))}}function u(e){(e=e||{}).chunkSize||(e.chunkSize=s.LocalChunkSize),l.call(this,e);var t,n,r="undefined"!=typeof FileReader;this.stream=function(e){this._input=e,n=e.slice||e.webkitSlice||e.mozSlice,r?((t=new FileReader).onload=k(this._chunkLoaded,this),t.onerror=k(this._chunkError,this)):t=new FileReaderSync,this._nextChunk()},this._nextChunk=function(){this._finished||this._config.preview&&!(this._rowCount<this._config.preview)||this._readChunk()},this._readChunk=function(){var e=this._input,o=(this._config.chunkSize&&(o=Math.min(this._start+this._config.chunkSize,this._input.size),e=n.call(e,this._start,o)),t.readAsText(e,this._config.encoding));r||this._chunkLoaded({target:{result:o}})},this._chunkLoaded=function(e){this._start+=this._config.chunkSize,this._finished=!this._config.chunkSize||this._start>=this._input.size,this.parseChunk(e.target.result)},this._chunkError=function(){this._sendError(t.error)}}function d(e){var t;l.call(this,e=e||{}),this.stream=function(e){return t=e,this._nextChunk()},this._nextChunk=function(){var e,n;if(!this._finished)return e=this._config.chunkSize,t=e?(n=t.substring(0,e),t.substring(e)):(n=t,""),this._finished=!t,this.parseChunk(n)}}function p(e){l.call(this,e=e||{});var t=[],n=!0,r=!1;this.pause=function(){l.prototype.pause.apply(this,arguments),this._input.pause()},this.resume=function(){l.prototype.resume.apply(this,arguments),this._input.resume()},this.stream=function(e){this._input=e,this._input.on("data",this._streamData),this._input.on("end",this._streamEnd),this._input.on("error",this._streamError)},this._checkIsFinished=function(){r&&1===t.length&&(this._finished=!0)},this._nextChunk=function(){this._checkIsFinished(),t.length?this.parseChunk(t.shift()):n=!0},this._streamData=k((function(e){try{t.push("string"==typeof e?e:e.toString(this._config.encoding)),n&&(n=!1,this._checkIsFinished(),this.parseChunk(t.shift()))}catch(e){this._streamError(e)}}),this),this._streamError=k((function(e){this._streamCleanUp(),this._sendError(e)}),this),this._streamEnd=k((function(){this._streamCleanUp(),r=!0,this._streamData("")}),this),this._streamCleanUp=k((function(){this._input.removeListener("data",this._streamData),this._input.removeListener("end",this._streamEnd),this._input.removeListener("error",this._streamError)}),this)}function h(e){var t,n,r,o,a=Math.pow(2,53),i=-a,l=/^\s*-?(\d+\.?|\.\d+|\d+\.\d+)([eE][-+]?\d+)?\s*$/,c=/^((\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z)))$/,u=this,d=0,p=0,h=!1,g=!1,y=[],b={data:[],errors:[],meta:{}};function k(t){return"greedy"===e.skipEmptyLines?""===t.join("").trim():1===t.length&&0===t[0].length}function w(){if(b&&r&&(E("Delimiter","UndetectableDelimiter","Unable to auto-detect delimiting character; defaulted to '"+s.DefaultDelimiter+"'"),r=!1),e.skipEmptyLines&&(b.data=b.data.filter((function(e){return!k(e)}))),C()){if(b)if(Array.isArray(b.data[0])){for(var t=0;C()&&t<b.data.length;t++)b.data[t].forEach(n);b.data.splice(0,1)}else b.data.forEach(n);function n(t,n){x(e.transformHeader)&&(t=e.transformHeader(t,n)),y.push(t)}}function o(t,n){for(var r=e.header?{}:[],o=0;o<t.length;o++){var s=o,u=t[o];u=((t,n)=>(t=>(e.dynamicTypingFunction&&void 0===e.dynamicTyping[t]&&(e.dynamicTyping[t]=e.dynamicTypingFunction(t)),!0===(e.dynamicTyping[t]||e.dynamicTyping)))(t)?"true"===n||"TRUE"===n||"false"!==n&&"FALSE"!==n&&((e=>{if(l.test(e)&&(e=parseFloat(e),i<e&&e<a))return 1})(n)?parseFloat(n):c.test(n)?new Date(n):""===n?null:n):n)(s=e.header?o>=y.length?"__parsed_extra":y[o]:s,u=e.transform?e.transform(u,s):u),"__parsed_extra"===s?(r[s]=r[s]||[],r[s].push(u)):r[s]=u}return e.header&&(o>y.length?E("FieldMismatch","TooManyFields","Too many fields: expected "+y.length+" fields but parsed "+o,p+n):o<y.length&&E("FieldMismatch","TooFewFields","Too few fields: expected "+y.length+" fields but parsed "+o,p+n)),r}var u;b&&(e.header||e.dynamicTyping||e.transform)&&(u=1,!b.data.length||Array.isArray(b.data[0])?(b.data=b.data.map(o),u=b.data.length):b.data=o(b.data,0),e.header&&b.meta&&(b.meta.fields=y),p+=u)}function C(){return e.header&&0===y.length}function E(e,t,n,r){e={type:e,code:t,message:n},void 0!==r&&(e.row=r),b.errors.push(e)}x(e.step)&&(o=e.step,e.step=function(t){b=t,C()?w():(w(),0!==b.data.length&&(d+=t.data.length,e.preview&&d>e.preview?n.abort():(b.data=b.data[0],o(b,u))))}),this.parse=function(o,a,i){var l=e.quoteChar||'"';return e.newline||(e.newline=this.guessLineEndings(o,l)),r=!1,e.delimiter?x(e.delimiter)&&(e.delimiter=e.delimiter(o),b.meta.delimiter=e.delimiter):((l=((t,n,r,o,a)=>{var i,l,c,u;a=a||[",","\t","|",";",s.RECORD_SEP,s.UNIT_SEP];for(var d=0;d<a.length;d++){for(var p,h=a[d],f=0,g=0,y=0,b=(c=void 0,new m({comments:o,delimiter:h,newline:n,preview:10}).parse(t)),v=0;v<b.data.length;v++)r&&k(b.data[v])?y++:(g+=p=b.data[v].length,void 0===c?c=p:0<p&&(f+=Math.abs(p-c),c=p));0<b.data.length&&(g/=b.data.length-y),(void 0===l||f<=l)&&(void 0===u||u<g)&&1.99<g&&(l=f,i=h,u=g)}return{successful:!!(e.delimiter=i),bestDelimiter:i}})(o,e.newline,e.skipEmptyLines,e.comments,e.delimitersToGuess)).successful?e.delimiter=l.bestDelimiter:(r=!0,e.delimiter=s.DefaultDelimiter),b.meta.delimiter=e.delimiter),l=v(e),e.preview&&e.header&&l.preview++,t=o,n=new m(l),b=n.parse(t,a,i),w(),h?{meta:{paused:!0}}:b||{meta:{paused:!1}}},this.paused=function(){return h},this.pause=function(){h=!0,n.abort(),t=x(e.chunk)?"":t.substring(n.getCharIndex())},this.resume=function(){u.streamer._halted?(h=!1,u.streamer.parseChunk(t,!0)):setTimeout(u.resume,3)},this.aborted=function(){return g},this.abort=function(){g=!0,n.abort(),b.meta.aborted=!0,x(e.complete)&&e.complete(b),t=""},this.guessLineEndings=function(e,t){e=e.substring(0,1048576),t=new RegExp(f(t)+"([^]*?)"+f(t),"gm");var n=(e=e.replace(t,"")).split("\r");if(e=1<(t=e.split("\n")).length&&t[0].length<n[0].length,1===n.length||e)return"\n";for(var r=0,o=0;o<n.length;o++)"\n"===n[o][0]&&r++;return r>=n.length/2?"\r\n":"\r"}}function f(e){return e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function m(e){var t=(e=e||{}).delimiter,n=e.newline,r=e.comments,o=e.step,a=e.preview,i=e.fastMode,l=null,c=!1,u=null==e.quoteChar?'"':e.quoteChar,d=u;if(void 0!==e.escapeChar&&(d=e.escapeChar),("string"!=typeof t||-1<s.BAD_DELIMITERS.indexOf(t))&&(t=","),r===t)throw new Error("Comment character same as delimiter");!0===r?r="#":("string"!=typeof r||-1<s.BAD_DELIMITERS.indexOf(r))&&(r=!1),"\n"!==n&&"\r"!==n&&"\r\n"!==n&&(n="\n");var p=0,h=!1;this.parse=function(s,m,g){if("string"!=typeof s)throw new Error("Input must be a string");var y=s.length,b=t.length,v=n.length,k=r.length,w=x(o),C=[],E=[],A=[],S=p=0;if(!s)return L();if(i||!1!==i&&-1===s.indexOf(u)){for(var O=s.split(n),M=0;M<O.length;M++){if(A=O[M],p+=A.length,M!==O.length-1)p+=n.length;else if(g)return L();if(!r||A.substring(0,k)!==r){if(w){if(C=[],T(A.split(t)),F(),h)return L()}else T(A.split(t));if(a&&a<=M)return C=C.slice(0,a),L(!0)}}return L()}for(var R=s.indexOf(t,p),_=s.indexOf(n,p),$=new RegExp(f(d)+f(u),"g"),N=s.indexOf(u,p);;)if(s[p]===u)for(N=p,p++;;){if(-1===(N=s.indexOf(u,N+1)))return g||E.push({type:"Quotes",code:"MissingQuotes",message:"Quoted field unterminated",row:C.length,index:p}),j();if(N===y-1)return j(s.substring(p,N).replace($,u));if(u===d&&s[N+1]===d)N++;else if(u===d||0===N||s[N-1]!==d){-1!==R&&R<N+1&&(R=s.indexOf(t,N+1));var z=P(-1===(_=-1!==_&&_<N+1?s.indexOf(n,N+1):_)?R:Math.min(R,_));if(s.substr(N+1+z,b)===t){A.push(s.substring(p,N).replace($,u)),s[p=N+1+z+b]!==u&&(N=s.indexOf(u,p)),R=s.indexOf(t,p),_=s.indexOf(n,p);break}if(z=P(_),s.substring(N+1+z,N+1+z+v)===n){if(A.push(s.substring(p,N).replace($,u)),I(N+1+z+v),R=s.indexOf(t,p),N=s.indexOf(u,p),w&&(F(),h))return L();if(a&&C.length>=a)return L(!0);break}E.push({type:"Quotes",code:"InvalidQuotes",message:"Trailing quote on quoted field is malformed",row:C.length,index:p}),N++}}else if(r&&0===A.length&&s.substring(p,p+k)===r){if(-1===_)return L();p=_+v,_=s.indexOf(n,p),R=s.indexOf(t,p)}else if(-1!==R&&(R<_||-1===_))A.push(s.substring(p,R)),p=R+b,R=s.indexOf(t,p);else{if(-1===_)break;if(A.push(s.substring(p,_)),I(_+v),w&&(F(),h))return L();if(a&&C.length>=a)return L(!0)}return j();function T(e){C.push(e),S=p}function P(e){var t=0;return-1!==e&&(e=s.substring(N+1,e))&&""===e.trim()?e.length:t}function j(e){return g||(void 0===e&&(e=s.substring(p)),A.push(e),p=y,T(A),w&&F()),L()}function I(e){p=e,T(A),A=[],_=s.indexOf(n,p)}function L(r){if(e.header&&!m&&C.length&&!c){var o=C[0],a=Object.create(null),i=new Set(o);let t=!1;for(let n=0;n<o.length;n++){let r=o[n];if(a[r=x(e.transformHeader)?e.transformHeader(r,n):r]){let e,s=a[r];for(;e=r+"_"+s,s++,i.has(e););i.add(e),o[n]=e,a[r]++,t=!0,(l=null===l?{}:l)[e]=r}else a[r]=1,o[n]=r;i.add(r)}t&&console.warn("Duplicate headers found and renamed."),c=!0}return{data:C,errors:E,meta:{delimiter:t,linebreak:n,aborted:h,truncated:!!r,cursor:S+(m||0),renamedHeaders:l}}}function F(){o(L()),C=[],E=[]}},this.abort=function(){h=!0},this.getCharIndex=function(){return p}}function g(e){var t=e.data,n=a[t.workerId],r=!1;if(t.error)n.userError(t.error,t.file);else if(t.results&&t.results.data){var o={abort:function(){r=!0,y(t.workerId,{data:[],errors:[],meta:{aborted:!0}})},pause:b,resume:b};if(x(n.userStep)){for(var i=0;i<t.results.data.length&&(n.userStep({data:t.results.data[i],errors:t.results.errors,meta:t.results.meta},o),!r);i++);delete t.results}else x(n.userChunk)&&(n.userChunk(t.results,o,t.file),delete t.results)}t.finished&&!r&&y(t.workerId,t.results)}function y(e,t){var n=a[e];x(n.userComplete)&&n.userComplete(t),n.terminate(),delete a[e]}function b(){throw new Error("Not implemented.")}function v(e){if("object"!=typeof e||null===e)return e;var t,n=Array.isArray(e)?[]:{};for(t in e)n[t]=v(e[t]);return n}function k(e,t){return function(){e.apply(t,arguments)}}function x(e){return"function"==typeof e}return s.parse=function(t,r){var o=(r=r||{}).dynamicTyping||!1;if(x(o)&&(r.dynamicTypingFunction=o,o={}),r.dynamicTyping=o,r.transform=!!x(r.transform)&&r.transform,!r.worker||!s.WORKERS_SUPPORTED)return o=null,s.NODE_STREAM_INPUT,"string"==typeof t?(t=(e=>65279!==e.charCodeAt(0)?e:e.slice(1))(t),o=new(r.download?c:d)(r)):!0===t.readable&&x(t.read)&&x(t.on)?o=new p(r):(n.File&&t instanceof File||t instanceof Object)&&(o=new u(r)),o.stream(t);(o=(()=>{var t;return!!s.WORKERS_SUPPORTED&&(t=(()=>{var t=n.URL||n.webkitURL||null,r=e.toString();return s.BLOB_URL||(s.BLOB_URL=t.createObjectURL(new Blob(["var global = (function() { if (typeof self !== 'undefined') { return self; } if (typeof window !== 'undefined') { return window; } if (typeof global !== 'undefined') { return global; } return {}; })(); global.IS_PAPA_WORKER=true; ","(",r,")();"],{type:"text/javascript"})))})(),(t=new n.Worker(t)).onmessage=g,t.id=i++,a[t.id]=t)})()).userStep=r.step,o.userChunk=r.chunk,o.userComplete=r.complete,o.userError=r.error,r.step=x(r.step),r.chunk=x(r.chunk),r.complete=x(r.complete),r.error=x(r.error),delete r.worker,o.postMessage({input:t,config:r,workerId:o.id})},s.unparse=function(e,t){var n=!1,r=!0,o=",",a="\r\n",i='"',l=i+i,c=!1,u=null,d=!1,p=((()=>{if("object"==typeof t){if("string"!=typeof t.delimiter||s.BAD_DELIMITERS.filter((function(e){return-1!==t.delimiter.indexOf(e)})).length||(o=t.delimiter),"boolean"!=typeof t.quotes&&"function"!=typeof t.quotes&&!Array.isArray(t.quotes)||(n=t.quotes),"boolean"!=typeof t.skipEmptyLines&&"string"!=typeof t.skipEmptyLines||(c=t.skipEmptyLines),"string"==typeof t.newline&&(a=t.newline),"string"==typeof t.quoteChar&&(i=t.quoteChar),"boolean"==typeof t.header&&(r=t.header),Array.isArray(t.columns)){if(0===t.columns.length)throw new Error("Option columns is empty");u=t.columns}void 0!==t.escapeChar&&(l=t.escapeChar+i),t.escapeFormulae instanceof RegExp?d=t.escapeFormulae:"boolean"==typeof t.escapeFormulae&&t.escapeFormulae&&(d=/^[=+\-@\t\r].*$/)}})(),new RegExp(f(i),"g"));if("string"==typeof e&&(e=JSON.parse(e)),Array.isArray(e)){if(!e.length||Array.isArray(e[0]))return h(null,e,c);if("object"==typeof e[0])return h(u||Object.keys(e[0]),e,c)}else if("object"==typeof e)return"string"==typeof e.data&&(e.data=JSON.parse(e.data)),Array.isArray(e.data)&&(e.fields||(e.fields=e.meta&&e.meta.fields||u),e.fields||(e.fields=Array.isArray(e.data[0])?e.fields:"object"==typeof e.data[0]?Object.keys(e.data[0]):[]),Array.isArray(e.data[0])||"object"==typeof e.data[0]||(e.data=[e.data])),h(e.fields||[],e.data||[],c);throw new Error("Unable to serialize unrecognized input");function h(e,t,n){var i="",s=("string"==typeof e&&(e=JSON.parse(e)),"string"==typeof t&&(t=JSON.parse(t)),Array.isArray(e)&&0<e.length),l=!Array.isArray(t[0]);if(s&&r){for(var c=0;c<e.length;c++)0<c&&(i+=o),i+=m(e[c],c);0<t.length&&(i+=a)}for(var u=0;u<t.length;u++){var d=(s?e:t[u]).length,p=!1,h=s?0===Object.keys(t[u]).length:0===t[u].length;if(n&&!s&&(p="greedy"===n?""===t[u].join("").trim():1===t[u].length&&0===t[u][0].length),"greedy"===n&&s){for(var f=[],g=0;g<d;g++){var y=l?e[g]:g;f.push(t[u][y])}p=""===f.join("").trim()}if(!p){for(var b=0;b<d;b++){0<b&&!h&&(i+=o);var v=s&&l?e[b]:b;i+=m(t[u][v],b)}u<t.length-1&&(!n||0<d&&!h)&&(i+=a)}}return i}function m(e,t){var r,a;return null==e?"":e.constructor===Date?JSON.stringify(e).slice(1,25):(a=!1,d&&"string"==typeof e&&d.test(e)&&(e="'"+e,a=!0),r=e.toString().replace(p,l),(a=a||!0===n||"function"==typeof n&&n(e,t)||Array.isArray(n)&&n[t]||((e,t)=>{for(var n=0;n<t.length;n++)if(-1<e.indexOf(t[n]))return!0;return!1})(r,s.BAD_DELIMITERS)||-1<r.indexOf(o)||" "===r.charAt(0)||" "===r.charAt(r.length-1))?i+r+i:r)}},s.RECORD_SEP=String.fromCharCode(30),s.UNIT_SEP=String.fromCharCode(31),s.BYTE_ORDER_MARK="\ufeff",s.BAD_DELIMITERS=["\r","\n",'"',s.BYTE_ORDER_MARK],s.WORKERS_SUPPORTED=!r&&!!n.Worker,s.NODE_STREAM_INPUT=1,s.LocalChunkSize=10485760,s.RemoteChunkSize=5242880,s.DefaultDelimiter=",",s.Parser=m,s.ParserHandle=h,s.NetworkStreamer=c,s.FileStreamer=u,s.StringStreamer=d,s.ReadableStreamStreamer=p,n.jQuery&&((t=n.jQuery).fn.parse=function(e){var r=e.config||{},o=[];return this.each((function(e){if("INPUT"!==t(this).prop("tagName").toUpperCase()||"file"!==t(this).attr("type").toLowerCase()||!n.FileReader||!this.files||0===this.files.length)return!0;for(var a=0;a<this.files.length;a++)o.push({file:this.files[a],inputElem:this,instanceConfig:t.extend({},r)})})),a(),this;function a(){if(0===o.length)x(e.complete)&&e.complete();else{var n,r,a,l,c=o[0];if(x(e.before)){var u=e.before(c.file,c.inputElem);if("object"==typeof u){if("abort"===u.action)return n="AbortError",r=c.file,a=c.inputElem,l=u.reason,void(x(e.error)&&e.error({name:n},r,a,l));if("skip"===u.action)return void i();"object"==typeof u.config&&(c.instanceConfig=t.extend(c.instanceConfig,u.config))}else if("skip"===u)return void i()}var d=c.instanceConfig.complete;c.instanceConfig.complete=function(e){x(d)&&d(e,c.file,c.inputElem),i()},s.parse(c.file,c.instanceConfig)}}function i(){o.splice(0,1),a()}}),o&&(n.onmessage=function(e){e=e.data,void 0===s.WORKER_ID&&e&&(s.WORKER_ID=e.workerId),"string"==typeof e.input?n.postMessage({workerId:s.WORKER_ID,results:s.parse(e.input,e.config),finished:!0}):(n.File&&e.input instanceof File||e.input instanceof Object)&&(e=s.parse(e.input,e.config))&&n.postMessage({workerId:s.WORKER_ID,results:e,finished:!0})}),(c.prototype=Object.create(l.prototype)).constructor=c,(u.prototype=Object.create(l.prototype)).constructor=u,(d.prototype=Object.create(d.prototype)).constructor=d,(p.prototype=Object.create(l.prototype)).constructor=p,s},void 0===(o="function"==typeof n?n.apply(t,r):n)||(e.exports=o)},5843(e,t){"use strict";
/** @license React v16.13.1
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var n="function"==typeof Symbol&&Symbol.for,r=n?Symbol.for("react.element"):60103,o=n?Symbol.for("react.portal"):60106,a=n?Symbol.for("react.fragment"):60107,i=n?Symbol.for("react.strict_mode"):60108,s=n?Symbol.for("react.profiler"):60114,l=n?Symbol.for("react.provider"):60109,c=n?Symbol.for("react.context"):60110,u=n?Symbol.for("react.async_mode"):60111,d=n?Symbol.for("react.concurrent_mode"):60111,p=n?Symbol.for("react.forward_ref"):60112,h=n?Symbol.for("react.suspense"):60113,f=n?Symbol.for("react.suspense_list"):60120,m=n?Symbol.for("react.memo"):60115,g=n?Symbol.for("react.lazy"):60116,y=n?Symbol.for("react.block"):60121,b=n?Symbol.for("react.fundamental"):60117,v=n?Symbol.for("react.responder"):60118,k=n?Symbol.for("react.scope"):60119;function x(e){if("object"==typeof e&&null!==e){var t=e.$$typeof;switch(t){case r:switch(e=e.type){case u:case d:case a:case s:case i:case h:return e;default:switch(e=e&&e.$$typeof){case c:case p:case g:case m:case l:return e;default:return t}}case o:return t}}}function w(e){return x(e)===d}t.AsyncMode=u,t.ConcurrentMode=d,t.ContextConsumer=c,t.ContextProvider=l,t.Element=r,t.ForwardRef=p,t.Fragment=a,t.Lazy=g,t.Memo=m,t.Portal=o,t.Profiler=s,t.StrictMode=i,t.Suspense=h,t.isAsyncMode=function(e){return w(e)||x(e)===u},t.isConcurrentMode=w,t.isContextConsumer=function(e){return x(e)===c},t.isContextProvider=function(e){return x(e)===l},t.isElement=function(e){return"object"==typeof e&&null!==e&&e.$$typeof===r},t.isForwardRef=function(e){return x(e)===p},t.isFragment=function(e){return x(e)===a},t.isLazy=function(e){return x(e)===g},t.isMemo=function(e){return x(e)===m},t.isPortal=function(e){return x(e)===o},t.isProfiler=function(e){return x(e)===s},t.isStrictMode=function(e){return x(e)===i},t.isSuspense=function(e){return x(e)===h},t.isValidElementType=function(e){return"string"==typeof e||"function"==typeof e||e===a||e===d||e===s||e===i||e===h||e===f||"object"==typeof e&&null!==e&&(e.$$typeof===g||e.$$typeof===m||e.$$typeof===l||e.$$typeof===c||e.$$typeof===p||e.$$typeof===b||e.$$typeof===v||e.$$typeof===k||e.$$typeof===y)},t.typeOf=x},5959(e,t,n){"use strict";e.exports=n(5843)},1182(e,t){"use strict";var n=Symbol.for("react.transitional.element"),r=Symbol.for("react.portal"),o=Symbol.for("react.fragment"),a=Symbol.for("react.strict_mode"),i=Symbol.for("react.profiler"),s=Symbol.for("react.consumer"),l=Symbol.for("react.context"),c=Symbol.for("react.forward_ref"),u=Symbol.for("react.suspense"),d=Symbol.for("react.suspense_list"),p=Symbol.for("react.memo"),h=Symbol.for("react.lazy"),f=Symbol.for("react.view_transition"),m=Symbol.for("react.client.reference");
/**
 * @license React
 * react-is.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function g(e){if("object"==typeof e&&null!==e){var t=e.$$typeof;switch(t){case n:switch(e=e.type){case o:case i:case a:case u:case d:case f:return e;default:switch(e=e&&e.$$typeof){case l:case c:case h:case p:case s:return e;default:return t}}case r:return t}}}t.vM=c,t.lD=p},8101(e,t,n){"use strict";n.d(t,{A:()=>k});var r=n(8621),o=n(9244),a=n(1594),i=n.n(a),s=a.useLayoutEffect,l=function(e,t){"function"!=typeof e?e.current=t:e(t)},c={"min-height":"0","max-height":"none",height:"0",visibility:"hidden",overflow:"hidden",position:"absolute","z-index":"-1000",top:"0",right:"0",display:"block"},u=function(e){Object.keys(c).forEach((function(t){e.style.setProperty(t,c[t],"important")}))},d=null,p=function(e,t){var n=e.scrollHeight;return"border-box"===t.sizingStyle.boxSizing?n+t.borderSize:n-t.paddingSize};var h=function(){},f=["borderBottomWidth","borderLeftWidth","borderRightWidth","borderTopWidth","boxSizing","fontFamily","fontSize","fontStyle","fontWeight","letterSpacing","lineHeight","paddingBottom","paddingLeft","paddingRight","paddingTop","tabSize","textIndent","textRendering","textTransform","width","wordBreak","wordSpacing","scrollbarGutter"],m=!!document.documentElement.currentStyle,g=function(e){var t=window.getComputedStyle(e);if(null===t)return null;var n,r=(n=t,f.reduce((function(e,t){return e[t]=n[t],e}),{})),o=r.boxSizing;return""===o?null:(m&&"border-box"===o&&(r.width=parseFloat(r.width)+parseFloat(r.borderRightWidth)+parseFloat(r.borderLeftWidth)+parseFloat(r.paddingRight)+parseFloat(r.paddingLeft)+"px"),{sizingStyle:r,paddingSize:parseFloat(r.paddingBottom)+parseFloat(r.paddingTop),borderSize:parseFloat(r.borderBottomWidth)+parseFloat(r.borderTopWidth)})};function y(e,t,n){var r,o,l=(r=n,o=i().useRef(r),s((function(){o.current=r})),o);a.useLayoutEffect((function(){var n=function(e){return l.current(e)};if(e)return e.addEventListener(t,n),function(){return e.removeEventListener(t,n)}}),[])}var b=["cacheMeasurements","maxRows","minRows","onChange","onHeightChange"],v=function(e,t){var n=e.cacheMeasurements,s=e.maxRows,c=e.minRows,f=e.onChange,m=void 0===f?h:f,v=e.onHeightChange,k=void 0===v?h:v,x=(0,o.A)(e,b),w=void 0!==x.value,C=a.useRef(null),E=function(e,t){var n=i().useRef();return i().useCallback((function(r){e.current=r,n.current&&l(n.current,null),n.current=t,t&&l(t,r)}),[t])}(C,t),A=a.useRef(0),S=a.useRef(),O=function(){var e=C.current,t=n&&S.current?S.current:g(e);if(t){S.current=t;var r=function(e,t,n,r){void 0===n&&(n=1),void 0===r&&(r=1/0),d||((d=document.createElement("textarea")).setAttribute("tabindex","-1"),d.setAttribute("aria-hidden","true"),u(d)),null===d.parentNode&&document.body.appendChild(d);var o=e.paddingSize,a=e.borderSize,i=e.sizingStyle,s=i.boxSizing;Object.keys(i).forEach((function(e){var t=e;d.style[t]=i[t]})),u(d),d.value=t;var l=p(d,e);d.value=t,l=p(d,e),d.value="x";var c=d.scrollHeight-o,h=c*n;"border-box"===s&&(h=h+o+a),l=Math.max(h,l);var f=c*r;return"border-box"===s&&(f=f+o+a),[l=Math.min(f,l),c]}(t,e.value||e.placeholder||"x",c,s),o=r[0],a=r[1];A.current!==o&&(A.current=o,e.style.setProperty("height",o+"px","important"),k(o,{rowHeight:a}))}};return a.useLayoutEffect(O),function(e,t){y(document.body,"reset",(function(n){e.current.form===n.target&&t(n)}))}(C,(function(){if(!w){var e=C.current.value;requestAnimationFrame((function(){var t=C.current;t&&e!==t.value&&O()}))}})),y(window,"resize",O),function(e){y(document.fonts,"loadingdone",e)}(O),a.createElement("textarea",(0,r.A)({},x,{onChange:function(e){w||O(),m(e)},ref:E}))},k=a.forwardRef(v)},7462(e,t,n){"use strict";
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var r=n(1594),o=Symbol.for("react.element"),a=Symbol.for("react.fragment"),i=Object.prototype.hasOwnProperty,s=r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,l={key:!0,ref:!0,__self:!0,__source:!0};function c(e,t,n){var r,a={},c=null,u=null;for(r in void 0!==n&&(c=""+n),void 0!==t.key&&(c=""+t.key),void 0!==t.ref&&(u=t.ref),t)i.call(t,r)&&!l.hasOwnProperty(r)&&(a[r]=t[r]);if(e&&e.defaultProps)for(r in t=e.defaultProps)void 0===a[r]&&(a[r]=t[r]);return{$$typeof:o,type:e,key:c,ref:u,props:a,_owner:s.current}}t.Fragment=a,t.jsx=c,t.jsxs=c},6070(e,t,n){"use strict";e.exports=n(7462)},5396(e,t,n){"use strict";n.d(t,{ID:()=>Ut,DU:()=>an,AH:()=>en,Ay:()=>rn});var r=n(1594),o=n.n(r),a="-ms-",i="-moz-",s="-webkit-",l="comm",c="rule",u="decl",d="@keyframes",p=Math.abs,h=String.fromCharCode,f=Object.assign;function m(e){return e.trim()}function g(e,t){return(e=t.exec(e))?e[0]:e}function y(e,t,n){return e.replace(t,n)}function b(e,t,n){return e.indexOf(t,n)}function v(e,t){return 0|e.charCodeAt(t)}function k(e,t,n){return e.slice(t,n)}function x(e){return e.length}function w(e){return e.length}function C(e,t){return t.push(e),e}function E(e,t){return e.filter((function(e){return!g(e,t)}))}var A,S,O=1,M=1,R=0,_=0,$=0,N="";function z(e,t,n,r,o,a,i,s){return{value:e,root:t,parent:n,type:r,props:o,children:a,line:O,column:M,length:i,return:"",siblings:s}}function T(e,t){return f(z("",null,null,"",null,null,0,e.siblings),e,{length:-e.length},t)}function P(e){for(;e.root;)e=T(e.root,{children:[e]});C(e,e.siblings)}function j(){return $=_>0?v(N,--_):0,M--,10===$&&(M=1,O--),$}function I(){return $=_<R?v(N,_++):0,M++,10===$&&(M=1,O++),$}function L(){return v(N,_)}function F(){return _}function q(e,t){return k(N,e,t)}function D(e){switch(e){case 0:case 9:case 10:case 13:case 32:return 5;case 33:case 43:case 44:case 47:case 62:case 64:case 126:case 59:case 123:case 125:return 4;case 58:return 3;case 34:case 39:case 40:case 91:return 2;case 41:case 93:return 1}return 0}function B(e){return O=M=1,R=x(N=e),_=0,[]}function W(e){return N="",e}function H(e){return m(q(_-1,K(91===e?e+2:40===e?e+1:e)))}function U(e){for(;($=L())&&$<33;)I();return D(e)>2||D($)>3?"":" "}function Q(e,t){for(;--t&&I()&&!($<48||$>102||$>57&&$<65||$>70&&$<97););return q(e,F()+(t<6&&32==L()&&32==I()))}function K(e){for(;I();)switch($){case e:return _;case 34:case 39:34!==e&&39!==e&&K($);break;case 40:41===e&&K(e);break;case 92:I()}return _}function G(e,t){for(;I()&&e+$!==57&&(e+$!==84||47!==L()););return"/*"+q(t,_-1)+"*"+h(47===e?e:I())}function V(e){for(;!D(L());)I();return q(e,_)}function X(e,t){for(var n="",r=0;r<e.length;r++)n+=t(e[r],r,e,t)||"";return n}function Y(e,t,n,r){switch(e.type){case"@layer":if(e.children.length)break;case"@import":case"@namespace":case u:return e.return=e.return||e.value;case l:return"";case d:return e.return=e.value+"{"+X(e.children,r)+"}";case c:if(!x(e.value=e.props.join(",")))return""}return x(n=X(e.children,r))?e.return=e.value+"{"+n+"}":""}function Z(e,t,n){switch(function(e,t){return 45^v(e,0)?(((t<<2^v(e,0))<<2^v(e,1))<<2^v(e,2))<<2^v(e,3):0}(e,t)){case 5103:return s+"print-"+e+e;case 5737:case 4201:case 3177:case 3433:case 1641:case 4457:case 2921:case 5572:case 6356:case 5844:case 3191:case 6645:case 3005:case 4215:case 6389:case 5109:case 5365:case 5621:case 3829:case 6391:case 5879:case 5623:case 6135:case 4599:return s+e+e;case 4855:return s+e.replace("add","source-over").replace("substract","source-out").replace("intersect","source-in").replace("exclude","xor")+e;case 4789:return i+e+e;case 5349:case 4246:case 4810:case 6968:case 2756:return s+e+i+e+a+e+e;case 5936:switch(v(e,t+11)){case 114:return s+e+a+y(e,/[svh]\w+-[tblr]{2}/,"tb")+e;case 108:return s+e+a+y(e,/[svh]\w+-[tblr]{2}/,"tb-rl")+e;case 45:return s+e+a+y(e,/[svh]\w+-[tblr]{2}/,"lr")+e}case 6828:case 4268:case 2903:return s+e+a+e+e;case 6165:return s+e+a+"flex-"+e+e;case 5187:return s+e+y(e,/(\w+).+(:[^]+)/,s+"box-$1$2"+a+"flex-$1$2")+e;case 5443:return s+e+a+"flex-item-"+y(e,/flex-|-self/g,"")+(g(e,/flex-|baseline/)?"":a+"grid-row-"+y(e,/flex-|-self/g,""))+e;case 4675:return s+e+a+"flex-line-pack"+y(e,/align-content|flex-|-self/g,"")+e;case 5548:return s+e+a+y(e,"shrink","negative")+e;case 5292:return s+e+a+y(e,"basis","preferred-size")+e;case 6060:return s+"box-"+y(e,"-grow","")+s+e+a+y(e,"grow","positive")+e;case 4554:return s+y(e,/([^-])(transform)/g,"$1"+s+"$2")+e;case 6187:return y(y(y(e,/(zoom-|grab)/,s+"$1"),/(image-set)/,s+"$1"),e,"")+e;case 5495:case 3959:return y(e,/(image-set\([^]*)/,s+"$1$`$1");case 4968:return y(y(e,/(.+:)(flex-)?(.*)/,s+"box-pack:$3"+a+"flex-pack:$3"),/space-between/,"justify")+s+e+e;case 4200:if(!g(e,/flex-|baseline/))return a+"grid-column-align"+k(e,t)+e;break;case 2592:case 3360:return a+y(e,"template-","")+e;case 4384:case 3616:return n&&n.some((function(e,n){return t=n,g(e.props,/grid-\w+-end/)}))?~b(e+(n=n[t].value),"span",0)?e:a+y(e,"-start","")+e+a+"grid-row-span:"+(~b(n,"span",0)?g(n,/\d+/):+g(n,/\d+/)-+g(e,/\d+/))+";":a+y(e,"-start","")+e;case 4896:case 4128:return n&&n.some((function(e){return g(e.props,/grid-\w+-start/)}))?e:a+y(y(e,"-end","-span"),"span ","")+e;case 4095:case 3583:case 4068:case 2532:return y(e,/(.+)-inline(.+)/,s+"$1$2")+e;case 8116:case 7059:case 5753:case 5535:case 5445:case 5701:case 4933:case 4677:case 5533:case 5789:case 5021:case 4765:if(x(e)-1-t>6)switch(v(e,t+1)){case 109:if(45!==v(e,t+4))break;case 102:return y(e,/(.+:)(.+)-([^]+)/,"$1"+s+"$2-$3$1"+i+(108==v(e,t+3)?"$3":"$2-$3"))+e;case 115:return~b(e,"stretch",0)?Z(y(e,"stretch","fill-available"),t,n)+e:e}break;case 5152:case 5920:return y(e,/(.+?):(\d+)(\s*\/\s*(span)?\s*(\d+))?(.*)/,(function(t,n,r,o,i,s,l){return a+n+":"+r+l+(o?a+n+"-span:"+(i?s:+s-+r)+l:"")+e}));case 4949:if(121===v(e,t+6))return y(e,":",":"+s)+e;break;case 6444:switch(v(e,45===v(e,14)?18:11)){case 120:return y(e,/(.+:)([^;\s!]+)(;|(\s+)?!.+)?/,"$1"+s+(45===v(e,14)?"inline-":"")+"box$3$1"+s+"$2$3$1"+a+"$2box$3")+e;case 100:return y(e,":",":"+a)+e}break;case 5719:case 2647:case 2135:case 3927:case 2391:return y(e,"scroll-","scroll-snap-")+e}return e}function J(e,t,n,r){if(e.length>-1&&!e.return)switch(e.type){case u:return void(e.return=Z(e.value,e.length,n));case d:return X([T(e,{value:y(e.value,"@","@"+s)})],r);case c:if(e.length)return function(e,t){return e.map(t).join("")}(n=e.props,(function(t){switch(g(t,r=/(::plac\w+|:read-\w+)/)){case":read-only":case":read-write":P(T(e,{props:[y(t,/:(read-\w+)/,":-moz-$1")]})),P(T(e,{props:[t]})),f(e,{props:E(n,r)});break;case"::placeholder":P(T(e,{props:[y(t,/:(plac\w+)/,":"+s+"input-$1")]})),P(T(e,{props:[y(t,/:(plac\w+)/,":-moz-$1")]})),P(T(e,{props:[y(t,/:(plac\w+)/,a+"input-$1")]})),P(T(e,{props:[t]})),f(e,{props:E(n,r)})}return""}))}}function ee(e){return W(te("",null,null,null,[""],e=B(e),0,[0],e))}function te(e,t,n,r,o,a,i,s,l){for(var c=0,u=0,d=i,f=0,m=0,g=0,w=1,E=1,A=1,S=0,O="",M=o,R=a,_=r,$=O;E;)switch(g=S,S=I()){case 40:if(108!=g&&58==v($,d-1)){-1!=b($+=y(H(S),"&","&\f"),"&\f",p(c?s[c-1]:0))&&(A=-1);break}case 34:case 39:case 91:$+=H(S);break;case 9:case 10:case 13:case 32:$+=U(g);break;case 92:$+=Q(F()-1,7);continue;case 47:switch(L()){case 42:case 47:C(re(G(I(),F()),t,n,l),l),5!=D(g||1)&&5!=D(L()||1)||!x($)||" "===k($,-1,void 0)||($+=" ");break;default:$+="/"}break;case 123*w:s[c++]=x($)*A;case 125*w:case 59:case 0:switch(S){case 0:case 125:E=0;case 59+u:-1==A&&($=y($,/\f/g,"")),m>0&&(x($)-d||0===w&&47===g)&&C(m>32?oe($+";",r,n,d-1,l):oe(y($," ","")+";",r,n,d-2,l),l);break;case 59:$+=";";default:if(C(_=ne($,t,n,c,u,o,s,O,M=[],R=[],d,a),a),123===S)if(0===u)te($,t,_,_,M,a,d,s,R);else{switch(f){case 99:if(110===v($,3))break;case 108:if(97===v($,2))break;default:u=0;case 100:case 109:case 115:}u?te(e,_,_,r&&C(ne(e,_,_,0,0,o,s,O,o,M=[],d,R),R),o,R,d,s,r?M:R):te($,_,_,_,[""],R,0,s,R)}}c=u=m=0,w=A=1,O=$="",d=i;break;case 58:d=1+x($),m=g;default:if(w<1)if(123==S)--w;else if(125==S&&0==w++&&125==j())continue;switch($+=h(S),S*w){case 38:A=u>0?1:($+="\f",-1);break;case 44:s[c++]=(x($)-1)*A,A=1;break;case 64:45===L()&&($+=H(I())),f=L(),u=d=x(O=$+=V(F())),S++;break;case 45:45===g&&2==x($)&&(w=0)}}return a}function ne(e,t,n,r,o,a,i,s,l,u,d,h){for(var f=o-1,g=0===o?a:[""],b=w(g),v=0,x=0,C=0;v<r;++v)for(var E=0,A=k(e,f+1,f=p(x=i[v])),S=e;E<b;++E)(S=m(x>0?g[E]+" "+A:y(A,/&\f/g,g[E])))&&(l[C++]=S);return z(e,t,n,0===o?c:s,l,u,d,h)}function re(e,t,n,r){return z(e,t,n,l,h($),k(e,2,-2),0,r)}function oe(e,t,n,r,o){return z(e,t,n,u,k(e,0,r),k(e,r+1,-1),r,o)}const ae="undefined"!=typeof process&&void 0!==process.env&&(process.env.REACT_APP_SC_ATTR||process.env.SC_ATTR)||"data-styled",ie="active",se="data-styled-version",le="6.4.0",ce="/*!sc*/\n",ue="undefined"!=typeof window&&"undefined"!=typeof document;function de(e){if("undefined"!=typeof process&&void 0!==process.env){const t=process.env[e];if(void 0!==t&&""!==t)return"false"!==t}}const pe=Boolean("boolean"==typeof SC_DISABLE_SPEEDY?SC_DISABLE_SPEEDY:null!==(S=null!==(A=de("REACT_APP_SC_DISABLE_SPEEDY"))&&void 0!==A?A:de("SC_DISABLE_SPEEDY"))&&void 0!==S?S:"undefined"==typeof process||void 0===process.env||!1),he="sc-keyframes-",fe={};function me(e,...t){return new Error(`An error occurred. See https://github.com/styled-components/styled-components/blob/main/packages/styled-components/src/utils/errors.md#${e} for more information.${t.length>0?` Args: ${t.join(", ")}`:""}`)}let ge=new Map,ye=new Map,be=1;const ve=e=>{if(ge.has(e))return ge.get(e);for(;ye.has(be);)be++;const t=be++;return ge.set(e,t),ye.set(t,e),t},ke=e=>ye.get(e),xe=(e,t)=>{be=t+1,ge.set(e,t),ye.set(t,e)},we=(new Set,Object.freeze([])),Ce=Object.freeze({});function Ee(e,t,n=Ce){return e.theme!==n.theme&&e.theme||t||n.theme}const Ae=/[!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~-]+/g,Se=/(^-|-$)/g;function Oe(e){return e.replace(Ae,"-").replace(Se,"")}const Me=/(a)(d)/gi,Re=e=>String.fromCharCode(e+(e>25?39:97));function _e(e){let t,n="";for(t=Math.abs(e);t>52;t=t/52|0)n=Re(t%52)+n;return(Re(t%52)+n).replace(Me,"$1-$2")}const $e=5381,Ne=(e,t)=>{let n=t.length;for(;n;)e=33*e^t.charCodeAt(--n);return e},ze=e=>Ne($e,e);function Te(e){return _e(ze(e)>>>0)}function Pe(e){return e.displayName||e.name||"Component"}function je(e){return"string"==typeof e&&!0}function Ie(e){return je(e)?`styled.${e}`:`Styled(${Pe(e)})`}const Le=Symbol.for("react.memo"),Fe=Symbol.for("react.forward_ref"),qe={contextType:!0,defaultProps:!0,displayName:!0,getDerivedStateFromError:!0,getDerivedStateFromProps:!0,propTypes:!0,type:!0},De={name:!0,length:!0,prototype:!0,caller:!0,callee:!0,arguments:!0,arity:!0},Be={$$typeof:!0,compare:!0,defaultProps:!0,displayName:!0,propTypes:!0,type:!0},We={[Fe]:{$$typeof:!0,render:!0,defaultProps:!0,displayName:!0,propTypes:!0},[Le]:Be};function He(e){return("type"in(t=e)&&t.type.$$typeof)===Le?Be:"$$typeof"in e?We[e.$$typeof]:qe;var t}const Ue=Object.defineProperty,Qe=Object.getOwnPropertyNames,Ke=Object.getOwnPropertySymbols,Ge=Object.getOwnPropertyDescriptor,Ve=Object.getPrototypeOf,Xe=Object.prototype;function Ye(e,t,n){if("string"!=typeof t){const r=Ve(t);r&&r!==Xe&&Ye(e,r,n);const o=Qe(t).concat(Ke(t)),a=He(e),i=He(t);for(let r=0;r<o.length;++r){const s=o[r];if(!(s in De||n&&n[s]||i&&s in i||a&&s in a)){const n=Ge(t,s);try{Ue(e,s,n)}catch(e){}}}}return e}function Ze(e){return"function"==typeof e}function Je(e){return"object"==typeof e&&"styledComponentId"in e}function et(e,t){return e&&t?e+" "+t:e||t||""}function tt(e,t){return e.join(t||"")}function nt(e){return null!==e&&"object"==typeof e&&e.constructor.name===Object.name&&!("props"in e&&e.$$typeof)}function rt(e,t,n=!1){if(!n&&!nt(e)&&!Array.isArray(e))return t;if(Array.isArray(t))for(let n=0;n<t.length;n++)e[n]=rt(e[n],t[n]);else if(nt(t))for(const n in t)e[n]=rt(e[n],t[n]);return e}function ot(e,t){Object.defineProperty(e,"toString",{value:t})}const at=class{constructor(e){this.groupSizes=new Uint32Array(512),this.length=512,this.tag=e,this._cGroup=0,this._cIndex=0}indexOfGroup(e){if(e===this._cGroup)return this._cIndex;let t=this._cIndex;if(e>this._cGroup)for(let n=this._cGroup;n<e;n++)t+=this.groupSizes[n];else for(let n=this._cGroup-1;n>=e;n--)t-=this.groupSizes[n];return this._cGroup=e,this._cIndex=t,t}insertRules(e,t){if(e>=this.groupSizes.length){const t=this.groupSizes,n=t.length;let r=n;for(;e>=r;)if(r<<=1,r<0)throw me(16,`${e}`);this.groupSizes=new Uint32Array(r),this.groupSizes.set(t),this.length=r;for(let e=n;e<r;e++)this.groupSizes[e]=0}let n=this.indexOfGroup(e+1),r=0;for(let o=0,a=t.length;o<a;o++)this.tag.insertRule(n,t[o])&&(this.groupSizes[e]++,n++,r++);r>0&&this._cGroup>e&&(this._cIndex+=r)}clearGroup(e){if(e<this.length){const t=this.groupSizes[e],n=this.indexOfGroup(e),r=n+t;this.groupSizes[e]=0;for(let e=n;e<r;e++)this.tag.deleteRule(n);t>0&&this._cGroup>e&&(this._cIndex-=t)}}getGroup(e){let t="";if(e>=this.length||0===this.groupSizes[e])return t;const n=this.groupSizes[e],r=this.indexOfGroup(e),o=r+n;for(let e=r;e<o;e++)t+=this.tag.getRule(e)+ce;return t}},it=`style[${ae}][${se}="${le}"]`,st=new RegExp(`^${ae}\\.g(\\d+)\\[id="([\\w\\d-]+)"\\].*?"([^"]*)`),lt=e=>"undefined"!=typeof ShadowRoot&&e instanceof ShadowRoot||"host"in e&&11===e.nodeType,ct=e=>{if(!e)return document;if(lt(e))return e;if("getRootNode"in e){const t=e.getRootNode();if(lt(t))return t}return document},ut=(e,t,n)=>{const r=n.split(",");let o;for(let n=0,a=r.length;n<a;n++)(o=r[n])&&e.registerName(t,o)},dt=(e,t)=>{var n;const r=(null!==(n=t.textContent)&&void 0!==n?n:"").split(ce),o=[];for(let t=0,n=r.length;t<n;t++){const n=r[t].trim();if(!n)continue;const a=n.match(st);if(a){const t=0|parseInt(a[1],10),n=a[2];0!==t&&(xe(n,t),ut(e,n,a[3]),e.getTag().insertRules(t,o)),o.length=0}else o.push(n)}},pt=e=>{const t=ct(e.options.target).querySelectorAll(it);for(let n=0,r=t.length;n<r;n++){const r=t[n];r&&r.getAttribute(ae)!==ie&&(dt(e,r),r.parentNode&&r.parentNode.removeChild(r))}};let ht=!1;function ft(){if(!1!==ht)return ht;if("undefined"!=typeof document){const e=document.head.querySelector('meta[property="csp-nonce"]');if(e)return ht=e.nonce||e.getAttribute("content")||void 0;const t=document.head.querySelector('meta[name="sc-nonce"]');if(t)return ht=t.getAttribute("content")||void 0}return ht=n.nc}const mt=(e,t)=>{const n=document.head,r=e||n,o=document.createElement("style"),a=(e=>{const t=Array.from(e.querySelectorAll(`style[${ae}]`));return t[t.length-1]})(r),i=void 0!==a?a.nextSibling:null;o.setAttribute(ae,ie),o.setAttribute(se,le);const s=t||ft();return s&&o.setAttribute("nonce",s),r.insertBefore(o,i),o},gt=class{constructor(e,t){this.element=mt(e,t),this.element.appendChild(document.createTextNode("")),this.sheet=(e=>{var t;if(e.sheet)return e.sheet;const n=null!==(t=e.getRootNode().styleSheets)&&void 0!==t?t:document.styleSheets;for(let t=0,r=n.length;t<r;t++){const r=n[t];if(r.ownerNode===e)return r}throw me(17)})(this.element),this.length=0}insertRule(e,t){try{return this.sheet.insertRule(t,e),this.length++,!0}catch(e){return!1}}deleteRule(e){this.sheet.deleteRule(e),this.length--}getRule(e){const t=this.sheet.cssRules[e];return t&&t.cssText?t.cssText:""}},yt=class{constructor(e,t){this.element=mt(e,t),this.nodes=this.element.childNodes,this.length=0}insertRule(e,t){if(e<=this.length&&e>=0){const n=document.createTextNode(t);return this.element.insertBefore(n,this.nodes[e]||null),this.length++,!0}return!1}deleteRule(e){this.element.removeChild(this.nodes[e]),this.length--}getRule(e){return e<this.length?this.nodes[e].textContent:""}};let bt=ue;const vt={isServer:!ue,useCSSOMInjection:!pe};class kt{static registerId(e){return ve(e)}constructor(e=Ce,t={},n){this.options=Object.assign(Object.assign({},vt),e),this.gs=t,this.keyframeIds=new Set,this.names=new Map(n),this.server=!!e.isServer,!this.server&&ue&&bt&&(bt=!1,pt(this)),ot(this,(()=>(e=>{const t=e.getTag(),{length:n}=t;let r="";for(let o=0;o<n;o++){const n=ke(o);if(void 0===n)continue;const a=e.names.get(n);if(void 0===a||!a.size)continue;const i=t.getGroup(o);if(0===i.length)continue;const s=ae+".g"+o+'[id="'+n+'"]';let l="";for(const e of a)e.length>0&&(l+=e+",");r+=i+s+'{content:"'+l+'"}'+ce}return r})(this)))}rehydrate(){!this.server&&ue&&pt(this)}reconstructWithOptions(e,t=!0){const n=new kt(Object.assign(Object.assign({},this.options),e),this.gs,t&&this.names||void 0);return n.keyframeIds=new Set(this.keyframeIds),!this.server&&ue&&e.target!==this.options.target&&ct(this.options.target)!==ct(e.target)&&pt(n),n}allocateGSInstance(e){return this.gs[e]=(this.gs[e]||0)+1}getTag(){return this.tag||(this.tag=(e=(({useCSSOMInjection:e,target:t,nonce:n})=>e?new gt(t,n):new yt(t,n))(this.options),new at(e)));var e}hasNameForId(e,t){var n,r;return null!==(r=null===(n=this.names.get(e))||void 0===n?void 0:n.has(t))&&void 0!==r&&r}registerName(e,t){ve(e),e.startsWith(he)&&this.keyframeIds.add(e);const n=this.names.get(e);n?n.add(t):this.names.set(e,new Set([t]))}insertRules(e,t,n){this.registerName(e,t),this.getTag().insertRules(ve(e),n)}clearNames(e){this.names.has(e)&&this.names.get(e).clear()}clearRules(e){this.getTag().clearGroup(ve(e)),this.clearNames(e)}clearTag(){this.tag=void 0}}const xt=new WeakSet,wt={animationIterationCount:1,aspectRatio:1,borderImageOutset:1,borderImageSlice:1,borderImageWidth:1,columnCount:1,columns:1,flex:1,flexGrow:1,flexShrink:1,gridRow:1,gridRowEnd:1,gridRowSpan:1,gridRowStart:1,gridColumn:1,gridColumnEnd:1,gridColumnSpan:1,gridColumnStart:1,fontWeight:1,lineHeight:1,opacity:1,order:1,orphans:1,scale:1,tabSize:1,widows:1,zIndex:1,zoom:1,WebkitLineClamp:1,fillOpacity:1,floodOpacity:1,stopOpacity:1,strokeDasharray:1,strokeDashoffset:1,strokeMiterlimit:1,strokeOpacity:1,strokeWidth:1};function Ct(e,t){return null==t||"boolean"==typeof t||""===t?"":"number"!=typeof t||0===t||e in wt||e.startsWith("--")?String(t).trim():t+"px"}const Et=e=>e>="A"&&e<="Z";function At(e){let t="";for(let n=0;n<e.length;n++){const r=e[n];if(1===n&&"-"===r&&"-"===e[0])return e;Et(r)?t+="-"+r.toLowerCase():t+=r}return t.startsWith("ms-")?"-"+t:t}const St=Symbol.for("sc-keyframes");function Ot(e){return Ze(e)&&!(e.prototype&&e.prototype.isReactComponent)}const Mt=e=>null==e||!1===e||""===e,Rt=Symbol.for("react.client.reference");function _t(e){return e.$$typeof===Rt}const $t=e=>{const t=[];for(const n in e){const r=e[n];e.hasOwnProperty(n)&&!Mt(r)&&(Array.isArray(r)&&xt.has(r)||Ze(r)?t.push(At(n)+":",r,";"):nt(r)?t.push(n+" {",...$t(r),"}"):t.push(At(n)+": "+Ct(n,r)+";"))}return t};function Nt(e,t,n,r,o=[]){if(Mt(e))return o;const a=typeof e;if("string"===a)return o.push(e),o;if("function"===a){if(_t(e))return o;if(Ot(e)&&t){return Nt(e(t),t,n,r,o)}return o.push(e),o}if(Array.isArray(e)){for(let a=0;a<e.length;a++)Nt(e[a],t,n,r,o);return o}if(Je(e))return o.push(`.${e.styledComponentId}`),o;if(function(e){return"object"==typeof e&&null!==e&&St in e}(e))return n?(e.inject(n,r),o.push(e.getName(r))):o.push(e),o;if(_t(e))return o;if(nt(e)){const t=$t(e);for(let e=0;e<t.length;e++)o.push(t[e]);return o}return o.push(e.toString()),o}const zt=ze(le);class Tt{constructor(e,t,n){this.rules=e,this.componentId=t,this.baseHash=Ne(zt,t),this.baseStyle=n,kt.registerId(t)}generateAndInjectStyles(e,t,n){let r=this.baseStyle?this.baseStyle.generateAndInjectStyles(e,t,n):"";{let o="";for(let r=0;r<this.rules.length;r++){const a=this.rules[r];if("string"==typeof a)o+=a;else if(a)if(Ot(a)){const r=a(e);"string"==typeof r?o+=r:null!=r&&!1!==r&&(o+=tt(Nt(r,e,t,n)))}else o+=tt(Nt(a,e,t,n))}if(o){this.dynamicNameCache||(this.dynamicNameCache=new Map);const e=n.hash?n.hash+o:o;let a=this.dynamicNameCache.get(e);if(!a){if(a=_e(Ne(Ne(this.baseHash,n.hash),o)>>>0),this.dynamicNameCache.size>=200){const e=this.dynamicNameCache.keys().next().value;void 0!==e&&this.dynamicNameCache.delete(e)}this.dynamicNameCache.set(e,a)}if(!t.hasNameForId(this.componentId,a)){const e=n(o,"."+a,void 0,this.componentId);t.insertRules(this.componentId,a,e)}r=et(r,a)}}return r}}const Pt=/&/g,jt=47;function It(e,t){let n=0;for(;--t>=0&&92===e.charCodeAt(t);)n++;return!(1&~n)}function Lt(e){const t=e.length;let n="",r=0,o=0,a=0,i=!1,s=!1;for(let l=0;l<t;l++){const c=e.charCodeAt(l);if(0!==a||i||c!==jt||42!==e.charCodeAt(l+1))if(i)42===c&&e.charCodeAt(l+1)===jt&&(i=!1,l++);else if(34!==c&&39!==c||It(e,l)){if(0===a)if(123===c)o++;else if(125===c){if(o--,o<0){s=!0;let n=l+1;for(;n<t;){const t=e.charCodeAt(n);if(59===t||10===t)break;n++}n<t&&59===e.charCodeAt(n)&&n++,o=0,l=n-1,r=n;continue}0===o&&(n+=e.substring(r,l+1),r=l+1)}else 59===c&&0===o&&(n+=e.substring(r,l+1),r=l+1)}else 0===a?a=c:a===c&&(a=0);else i=!0,l++}return s||0!==o||0!==a?(r<t&&0===o&&0===a&&(n+=e.substring(r)),n):e}function Ft(e,t){for(let n=0;n<e.length;n++){const r=e[n];if("rule"===r.type){r.value=t+" "+r.value,r.value=r.value.replaceAll(",",","+t+" ");const e=r.props,n=[];for(let r=0;r<e.length;r++)n[r]=t+" "+e[r];r.props=n}Array.isArray(r.children)&&"@keyframes"!==r.type&&(r.children=Ft(r.children,t))}return e}function qt({options:e=Ce,plugins:t=we}=Ce){let n,r,o;const a=(e,t,o)=>o.startsWith(r)&&o.endsWith(r)&&o.replaceAll(r,"").length>0?`.${n}`:e,i=t.slice();i.push((e=>{e.type===c&&e.value.includes("&")&&(o||(o=new RegExp(`\\${r}\\b`,"g")),e.props[0]=e.props[0].replace(Pt,r).replace(o,a))})),e.prefix&&i.push(J),i.push(Y);let s=[];const l=(p=i.concat((f=e=>s.push(e),function(e){e.root||(e=e.return)&&f(e)})),h=w(p),function(e,t,n,r){for(var o="",a=0;a<h;a++)o+=p[a](e,t,n,r)||"";return o}),u=(t,a="",i="",c="&")=>{n=c,r=a,o=void 0;const u=function(e){const t=-1!==e.indexOf("//"),n=-1!==e.indexOf("}");if(!t&&!n)return e;if(!t)return Lt(e);const r=e.length;let o="",a=0,i=0,s=0,l=0,c=0,u=!1;for(;i<r;){const t=e.charCodeAt(i);if(34!==t&&39!==t||It(e,i))if(0===s)if(t===jt&&i+1<r&&42===e.charCodeAt(i+1)){for(i+=2;i+1<r&&(42!==e.charCodeAt(i)||e.charCodeAt(i+1)!==jt);)i++;i+=2}else if(40!==t)if(41!==t)if(l>0)i++;else if(42===t&&i+1<r&&e.charCodeAt(i+1)===jt)o+=e.substring(a,i),i+=2,a=i,u=!0;else if(t===jt&&i+1<r&&e.charCodeAt(i+1)===jt){for(o+=e.substring(a,i);i<r&&10!==e.charCodeAt(i);)i++;a=i,u=!0}else 123===t?c++:125===t&&c--,i++;else l>0&&l--,i++;else l++,i++;else i++;else 0===s?s=t:s===t&&(s=0),i++}return u?(a<r&&(o+=e.substring(a)),0===c?o:Lt(o)):0===c?e:Lt(e)}(t);let d=ee(i||a?i+" "+a+" { "+u+" }":u);return e.namespace&&(d=Ft(d,e.namespace)),s=[],X(d,l),s},d=e;var p,h,f;let m=$e;for(let e=0;e<t.length;e++)t[e].name||me(15),m=Ne(m,t[e].name);return(null==d?void 0:d.namespace)&&(m=Ne(m,d.namespace)),(null==d?void 0:d.prefix)&&(m=Ne(m,"p")),u.hash=m!==$e?m.toString():"",u}const Dt=new kt,Bt=qt(),Wt=o().createContext({shouldForwardProp:void 0,styleSheet:Dt,stylis:Bt,stylisPlugins:void 0});Wt.Consumer;function Ht(){return o().useContext(Wt)}function Ut(e){var t;const n=Ht(),{styleSheet:r}=n,a=o().useMemo((()=>{let t=r;return e.sheet?t=e.sheet:e.target?t=t.reconstructWithOptions(void 0!==e.nonce?{target:e.target,nonce:e.nonce}:{target:e.target},!1):void 0!==e.nonce&&(t=t.reconstructWithOptions({nonce:e.nonce})),e.disableCSSOMInjection&&(t=t.reconstructWithOptions({useCSSOMInjection:!1})),t}),[e.disableCSSOMInjection,e.nonce,e.sheet,e.target,r]),i=o().useMemo((()=>{var t;return void 0===e.stylisPlugins&&void 0===e.namespace&&void 0===e.enableVendorPrefixes?n.stylis:qt({options:{namespace:e.namespace,prefix:e.enableVendorPrefixes},plugins:null!==(t=e.stylisPlugins)&&void 0!==t?t:n.stylisPlugins})}),[e.enableVendorPrefixes,e.namespace,e.stylisPlugins,n.stylis,n.stylisPlugins]),s="shouldForwardProp"in e?e.shouldForwardProp:n.shouldForwardProp,l=null!==(t=e.stylisPlugins)&&void 0!==t?t:n.stylisPlugins,c=o().useMemo((()=>({shouldForwardProp:s,styleSheet:a,stylis:i,stylisPlugins:l})),[s,a,i,l]);return o().createElement(Wt.Provider,{value:c},e.children)}const Qt=o().createContext(void 0);Qt.Consumer;const Kt=Object.prototype.hasOwnProperty,Gt={};function Vt(e,t){const n="string"!=typeof e?"sc":Oe(e);Gt[n]=(Gt[n]||0)+1;const r=n+"-"+Te(le+n+Gt[n]);return t?t+"-"+r:r}function Xt(e,t,n){const a=Je(e),i=e,s=!je(e),{attrs:l=we,componentId:c=Vt(t.displayName,t.parentComponentId),displayName:u=Ie(e)}=t,d=t.displayName&&t.componentId?Oe(t.displayName)+"-"+t.componentId:t.componentId||c,p=a&&i.attrs?i.attrs.concat(l).filter(Boolean):l;let{shouldForwardProp:h}=t;if(a&&i.shouldForwardProp){const e=i.shouldForwardProp;if(t.shouldForwardProp){const n=t.shouldForwardProp;h=(t,r)=>e(t,r)&&n(t,r)}else h=e}const f=new Tt(n,d,a?i.componentStyle:void 0);function m(e,t){return function(e,t,n){const{attrs:a,componentStyle:i,defaultProps:s,foldedComponentIds:l,styledComponentId:c,target:u}=e,d=o().useContext(Qt),p=Ht(),h=e.shouldForwardProp||p.shouldForwardProp,f=Ee(t,d,s)||Ce;let m,g;{const e=o().useRef(null),n=e.current;if(null!==n&&n[1]===f&&n[2]===p.styleSheet&&n[3]===p.stylis&&n[7]===i&&function(e,t,n){const r=e,o=t;let a=0;for(const e in o)if(Kt.call(o,e)&&(a++,r[e]!==o[e]))return!1;return a===n}(n[0],t,n[4]))m=n[5],g=n[6];else{m=function(e,t,n){const r=Object.assign(Object.assign({},t),{className:void 0,theme:n}),o=e.length>1;for(let n=0;n<e.length;n++){const a=e[n],i=Ze(a)?a(o?Object.assign({},r):r):a;for(const e in i)"className"===e?r.className=et(r.className,i[e]):"style"===e?r.style=Object.assign(Object.assign({},r.style),i[e]):e in t&&void 0===t[e]||(r[e]=i[e])}return"className"in t&&"string"==typeof t.className&&(r.className=et(r.className,t.className)),r}(a,t,f),g=function(e,t,n,r){return e.generateAndInjectStyles(t,n,r)}(i,m,p.styleSheet,p.stylis);let n=0;for(const e in t)Kt.call(t,e)&&n++;e.current=[t,f,p.styleSheet,p.stylis,n,m,g,i]}}const y=m.as||u,b=function(e,t,n,r){const o={};for(const a in e)void 0===e[a]||"$"===a[0]||"as"===a||"theme"===a&&e.theme===n||("forwardedAs"===a?o.as=e.forwardedAs:r&&!r(a,t)||(o[a]=e[a]));return o}(m,y,f,h);let v=et(l,c);return g&&(v+=" "+g),m.className&&(v+=" "+m.className),b[je(y)&&y.includes("-")?"class":"className"]=v,n&&(b.ref=n),(0,r.createElement)(y,b)}(g,e,t)}m.displayName=u;let g=o().forwardRef(m);return g.attrs=p,g.componentStyle=f,g.displayName=u,g.shouldForwardProp=h,g.foldedComponentIds=a?et(i.foldedComponentIds,i.styledComponentId):"",g.styledComponentId=d,g.target=a?i.target:e,Object.defineProperty(g,"defaultProps",{get(){return this._foldedDefaultProps},set(e){this._foldedDefaultProps=a?function(e,...t){for(const n of t)rt(e,n,!0);return e}({},i.defaultProps,e):e}}),ot(g,(()=>`.${g.styledComponentId}`)),s&&Ye(g,e,{attrs:!0,componentStyle:!0,displayName:!0,foldedComponentIds:!0,shouldForwardProp:!0,styledComponentId:!0,target:!0}),g}var Yt=new Set(["a","abbr","address","area","article","aside","audio","b","bdi","bdo","blockquote","body","button","br","canvas","caption","cite","code","col","colgroup","data","datalist","dd","del","details","dfn","dialog","div","dl","dt","em","embed","fieldset","figcaption","figure","footer","form","h1","h2","h3","h4","h5","h6","header","hgroup","hr","html","i","iframe","img","input","ins","kbd","label","legend","li","main","map","mark","menu","meter","nav","object","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","search","section","select","slot","small","span","strong","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","u","ul","var","video","wbr","circle","clipPath","defs","ellipse","feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feDropShadow","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence","filter","foreignObject","g","image","line","linearGradient","marker","mask","path","pattern","polygon","polyline","radialGradient","rect","stop","svg","switch","symbol","text","textPath","tspan","use"]);function Zt(e,t){const n=[e[0]];for(let r=0,o=t.length;r<o;r+=1)n.push(t[r],e[r+1]);return n}const Jt=e=>(xt.add(e),e);function en(e,...t){if(Ze(e)||nt(e))return Jt(Nt(Zt(we,[e,...t])));const n=e;return 0===t.length&&1===n.length&&"string"==typeof n[0]?Nt(n):Jt(Nt(Zt(n,t)))}function tn(e,t,n=Ce){if(!t)throw me(1,t);const r=(r,...o)=>e(t,n,en(r,...o));return r.attrs=r=>tn(e,t,Object.assign(Object.assign({},n),{attrs:Array.prototype.concat(n.attrs,r).filter(Boolean)})),r.withConfig=r=>tn(e,t,Object.assign(Object.assign({},n),r)),r}const nn=e=>tn(Xt,e),rn=nn;Yt.forEach((e=>{rn[e]=nn(e)}));class on{constructor(e,t){this.instanceRules=new Map,this.rules=e,this.componentId=t,this.isStatic=function(e){for(let t=0;t<e.length;t+=1){const n=e[t];if(Ze(n)&&!Je(n))return!1}return!0}(e),kt.registerId(this.componentId)}removeStyles(e,t){this.instanceRules.delete(e),this.rebuildGroup(t)}renderStyles(e,t,n,r){const o=this.componentId;if(this.isStatic){if(n.hasNameForId(o,o+e))this.instanceRules.has(e)||this.computeRules(e,t,n,r);else{const a=this.computeRules(e,t,n,r);n.insertRules(o,a.name,a.rules)}return}const a=this.instanceRules.get(e);if(this.computeRules(e,t,n,r),!n.server&&a){const t=a.rules,n=this.instanceRules.get(e).rules;if(t.length===n.length){let e=!0;for(let r=0;r<t.length;r++)if(t[r]!==n[r]){e=!1;break}if(e)return}}this.rebuildGroup(n)}computeRules(e,t,n,r){const o=tt(Nt(this.rules,t,n,r)),a={name:this.componentId+e,rules:r(o,"")};return this.instanceRules.set(e,a),a}rebuildGroup(e){const t=this.componentId;e.clearRules(t);for(const n of this.instanceRules.values())e.insertRules(t,n.name,n.rules)}}function an(e,...t){const n=en(e,...t),r=`sc-global-${Te(JSON.stringify(n))}`,a=new on(n,r),i=e=>{const t=Ht(),n=o().useContext(Qt);let i;{const e=o().useRef(null);null===e.current&&(e.current=t.styleSheet.allocateGSInstance(r)),i=e.current}t.styleSheet.server&&s(i,e,t.styleSheet,n,t.stylis);{const l=a.isStatic?[i,t.styleSheet,a]:[i,e,t.styleSheet,n,t.stylis,a],c=o().useRef(a);o().useLayoutEffect((()=>(t.styleSheet.server||(c.current!==a&&(t.styleSheet.clearRules(r),c.current=a),s(i,e,t.styleSheet,n,t.stylis)),()=>{a.removeStyles(i,t.styleSheet)})),l)}return t.styleSheet.server&&a.instanceRules.delete(i),null};function s(e,t,n,r,o){if(a.isStatic)a.renderStyles(e,fe,n,o);else{const s=Object.assign(Object.assign({},t),{theme:Ee(t,r,i.defaultProps)});a.renderStyles(e,s,n,o)}}return o().memo(i)}},5664(e){e.exports=function(){var e=document.getSelection();if(!e.rangeCount)return function(){};for(var t=document.activeElement,n=[],r=0;r<e.rangeCount;r++)n.push(e.getRangeAt(r));switch(t.tagName.toUpperCase()){case"INPUT":case"TEXTAREA":t.blur();break;default:t=null}return e.removeAllRanges(),function(){"Caret"===e.type&&e.removeAllRanges(),e.rangeCount||n.forEach((function(t){e.addRange(t)})),t&&t.focus()}}},3278(e,t,n){"use strict";
/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var r=n(1594);var o="function"==typeof Object.is?Object.is:function(e,t){return e===t&&(0!==e||1/e==1/t)||e!=e&&t!=t},a=r.useState,i=r.useEffect,s=r.useLayoutEffect,l=r.useDebugValue;function c(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!o(e,n)}catch(e){return!0}}var u="undefined"==typeof window||void 0===window.document||void 0===window.document.createElement?function(e,t){return t()}:function(e,t){var n=t(),r=a({inst:{value:n,getSnapshot:t}}),o=r[0].inst,u=r[1];return s((function(){o.value=n,o.getSnapshot=t,c(o)&&u({inst:o})}),[e,n,t]),i((function(){return c(o)&&u({inst:o}),e((function(){c(o)&&u({inst:o})}))}),[e]),l(n),n};t.useSyncExternalStore=void 0!==r.useSyncExternalStore?r.useSyncExternalStore:u},4049(e,t,n){"use strict";
/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var r=n(1594),o=n(809);var a="function"==typeof Object.is?Object.is:function(e,t){return e===t&&(0!==e||1/e==1/t)||e!=e&&t!=t},i=o.useSyncExternalStore,s=r.useRef,l=r.useEffect,c=r.useMemo,u=r.useDebugValue;t.useSyncExternalStoreWithSelector=function(e,t,n,r,o){var d=s(null);if(null===d.current){var p={hasValue:!1,value:null};d.current=p}else p=d.current;d=c((function(){function e(e){if(!l){if(l=!0,i=e,e=r(e),void 0!==o&&p.hasValue){var t=p.value;if(o(t,e))return s=t}return s=e}if(t=s,a(i,e))return t;var n=r(e);return void 0!==o&&o(t,n)?(i=e,t):(i=e,s=n)}var i,s,l=!1,c=void 0===n?null:n;return[function(){return e(t())},null===c?void 0:function(){return e(c())}]}),[t,n,r,o]);var h=i(e,d[0],d[1]);return l((function(){p.hasValue=!0,p.value=h}),[h]),u(h),h}},809(e,t,n){"use strict";e.exports=n(3278)},6007(e,t,n){"use strict";e.exports=n(4049)},9787(e){function t(){return e.exports=t=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)({}).hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},e.exports.__esModule=!0,e.exports.default=e.exports,t.apply(null,arguments)}e.exports=t,e.exports.__esModule=!0,e.exports.default=e.exports},2679(e){e.exports=function(e){return e&&e.__esModule?e:{default:e}},e.exports.__esModule=!0,e.exports.default=e.exports},866(e){e.exports=function(e,t){if(null==e)return{};var n={};for(var r in e)if({}.hasOwnProperty.call(e,r)){if(-1!==t.indexOf(r))continue;n[r]=e[r]}return n},e.exports.__esModule=!0,e.exports.default=e.exports},8621(e,t,n){"use strict";function r(){return r=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)({}).hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},r.apply(null,arguments)}n.d(t,{A:()=>r})},9244(e,t,n){"use strict";function r(e,t){if(null==e)return{};var n={};for(var r in e)if({}.hasOwnProperty.call(e,r)){if(-1!==t.indexOf(r))continue;n[r]=e[r]}return n}n.d(t,{A:()=>r})},7870(e,t,n){"use strict";n.d(t,{H:()=>o});var r=n(3725),o=(()=>{let e=()=>r.S$;return{isServer:()=>e(),setIsServer(t){e=t}}})()},4041(e,t,n){"use strict";n.d(t,{m:()=>o});var r=n(5463),o=new class extends r.Q{#e;#t;#n;constructor(){super(),this.#n=e=>{if("undefined"!=typeof window&&window.addEventListener){const t=()=>e();return window.addEventListener("visibilitychange",t,!1),()=>{window.removeEventListener("visibilitychange",t)}}}}onSubscribe(){this.#t||this.setEventListener(this.#n)}onUnsubscribe(){this.hasListeners()||(this.#t?.(),this.#t=void 0)}setEventListener(e){this.#n=e,this.#t?.(),this.#t=e((e=>{"boolean"==typeof e?this.setFocused(e):this.onFocus()}))}setFocused(e){this.#e!==e&&(this.#e=e,this.onFocus())}onFocus(){const e=this.isFocused();this.listeners.forEach((t=>{t(e)}))}isFocused(){return"boolean"==typeof this.#e?this.#e:"hidden"!==globalThis.document?.visibilityState}}},7305(e,t,n){"use strict";n.d(t,{$:()=>s,s:()=>i});var r=n(5756),o=n(7421),a=n(1289),i=class extends o.k{#r;#o;#a;#i;constructor(e){super(),this.#r=e.client,this.mutationId=e.mutationId,this.#a=e.mutationCache,this.#o=[],this.state=e.state||{context:void 0,data:void 0,error:null,failureCount:0,failureReason:null,isPaused:!1,status:"idle",variables:void 0,submittedAt:0},this.setOptions(e.options),this.scheduleGc()}setOptions(e){this.options=e,this.updateGcTime(this.options.gcTime)}get meta(){return this.options.meta}addObserver(e){this.#o.includes(e)||(this.#o.push(e),this.clearGcTimeout(),this.#a.notify({type:"observerAdded",mutation:this,observer:e}))}removeObserver(e){this.#o=this.#o.filter((t=>t!==e)),this.scheduleGc(),this.#a.notify({type:"observerRemoved",mutation:this,observer:e})}optionalRemove(){this.#o.length||("pending"===this.state.status?this.scheduleGc():this.#a.remove(this))}continue(){return this.#i?.continue()??this.execute(this.state.variables)}async execute(e){const t=()=>{this.#s({type:"continue"})},n={client:this.#r,meta:this.options.meta,mutationKey:this.options.mutationKey};this.#i=(0,a.II)({fn:()=>this.options.mutationFn?this.options.mutationFn(e,n):Promise.reject(new Error("No mutationFn found")),onFail:(e,t)=>{this.#s({type:"failed",failureCount:e,error:t})},onPause:()=>{this.#s({type:"pause"})},onContinue:t,retry:this.options.retry??0,retryDelay:this.options.retryDelay,networkMode:this.options.networkMode,canRun:()=>this.#a.canRun(this)});const r="pending"===this.state.status,o=!this.#i.canStart();try{if(r)t();else{this.#s({type:"pending",variables:e,isPaused:o}),this.#a.config.onMutate&&await this.#a.config.onMutate(e,this,n);const t=await(this.options.onMutate?.(e,n));t!==this.state.context&&this.#s({type:"pending",context:t,variables:e,isPaused:o})}const a=await this.#i.start();return await(this.#a.config.onSuccess?.(a,e,this.state.context,this,n)),await(this.options.onSuccess?.(a,e,this.state.context,n)),await(this.#a.config.onSettled?.(a,null,this.state.variables,this.state.context,this,n)),await(this.options.onSettled?.(a,null,e,this.state.context,n)),this.#s({type:"success",data:a}),a}catch(t){try{await(this.#a.config.onError?.(t,e,this.state.context,this,n))}catch(e){Promise.reject(e)}try{await(this.options.onError?.(t,e,this.state.context,n))}catch(e){Promise.reject(e)}try{await(this.#a.config.onSettled?.(void 0,t,this.state.variables,this.state.context,this,n))}catch(e){Promise.reject(e)}try{await(this.options.onSettled?.(void 0,t,e,this.state.context,n))}catch(e){Promise.reject(e)}throw this.#s({type:"error",error:t}),t}finally{this.#a.runNext(this)}}#s(e){this.state=(t=>{switch(e.type){case"failed":return{...t,failureCount:e.failureCount,failureReason:e.error};case"pause":return{...t,isPaused:!0};case"continue":return{...t,isPaused:!1};case"pending":return{...t,context:e.context,data:void 0,failureCount:0,failureReason:null,error:null,isPaused:e.isPaused,status:"pending",variables:e.variables,submittedAt:Date.now()};case"success":return{...t,data:e.data,failureCount:0,failureReason:null,error:null,status:"success",isPaused:!1};case"error":return{...t,data:void 0,error:e.error,failureCount:t.failureCount+1,failureReason:e.error,isPaused:!1,status:"error"}}})(this.state),r.jG.batch((()=>{this.#o.forEach((t=>{t.onMutationUpdate(e)})),this.#a.notify({mutation:this,type:"updated",action:e})}))}};function s(){return{context:void 0,data:void 0,error:null,failureCount:0,failureReason:null,isPaused:!1,status:"idle",variables:void 0,submittedAt:0}}},5756(e,t,n){"use strict";n.d(t,{jG:()=>o});var r=n(2904).Zq;var o=function(){let e=[],t=0,n=e=>{e()},o=e=>{e()},a=r;const i=r=>{t?e.push(r):a((()=>{n(r)}))};return{batch:r=>{let i;t++;try{i=r()}finally{t--,t||(()=>{const t=e;e=[],t.length&&a((()=>{o((()=>{t.forEach((e=>{n(e)}))}))}))})()}return i},batchCalls:e=>(...t)=>{i((()=>{e(...t)}))},schedule:i,setNotifyFunction:e=>{n=e},setBatchNotifyFunction:e=>{o=e},setScheduler:e=>{a=e}}}()},2862(e,t,n){"use strict";n.d(t,{t:()=>o});var r=n(5463),o=new class extends r.Q{#l=!0;#t;#n;constructor(){super(),this.#n=e=>{if("undefined"!=typeof window&&window.addEventListener){const t=()=>e(!0),n=()=>e(!1);return window.addEventListener("online",t,!1),window.addEventListener("offline",n,!1),()=>{window.removeEventListener("online",t),window.removeEventListener("offline",n)}}}}onSubscribe(){this.#t||this.setEventListener(this.#n)}onUnsubscribe(){this.hasListeners()||(this.#t?.(),this.#t=void 0)}setEventListener(e){this.#n=e,this.#t?.(),this.#t=e(this.setOnline.bind(this))}setOnline(e){this.#l!==e&&(this.#l=e,this.listeners.forEach((t=>{t(e)})))}isOnline(){return this.#l}}},1932(e,t,n){"use strict";n.d(t,{X:()=>s,k:()=>l});var r=n(3725),o=n(5756),a=n(1289),i=n(7421),s=class extends i.k{#c;#u;#d;#r;#i;#p;#h;constructor(e){super(),this.#h=!1,this.#p=e.defaultOptions,this.setOptions(e.options),this.observers=[],this.#r=e.client,this.#d=this.#r.getQueryCache(),this.queryKey=e.queryKey,this.queryHash=e.queryHash,this.#c=u(this.options),this.state=e.state??this.#c,this.scheduleGc()}get meta(){return this.options.meta}get promise(){return this.#i?.promise}setOptions(e){if(this.options={...this.#p,...e},this.updateGcTime(this.options.gcTime),this.state&&void 0===this.state.data){const e=u(this.options);void 0!==e.data&&(this.setState(c(e.data,e.dataUpdatedAt)),this.#c=e)}}optionalRemove(){this.observers.length||"idle"!==this.state.fetchStatus||this.#d.remove(this)}setData(e,t){const n=(0,r.pl)(this.state.data,e,this.options);return this.#s({data:n,type:"success",dataUpdatedAt:t?.updatedAt,manual:t?.manual}),n}setState(e,t){this.#s({type:"setState",state:e,setStateOptions:t})}cancel(e){const t=this.#i?.promise;return this.#i?.cancel(e),t?t.then(r.lQ).catch(r.lQ):Promise.resolve()}destroy(){super.destroy(),this.cancel({silent:!0})}get resetState(){return this.#c}reset(){this.destroy(),this.setState(this.resetState)}isActive(){return this.observers.some((e=>!1!==(0,r.Eh)(e.options.enabled,this)))}isDisabled(){return this.getObserversCount()>0?!this.isActive():this.options.queryFn===r.hT||!this.isFetched()}isFetched(){return this.state.dataUpdateCount+this.state.errorUpdateCount>0}isStatic(){return this.getObserversCount()>0&&this.observers.some((e=>"static"===(0,r.d2)(e.options.staleTime,this)))}isStale(){return this.getObserversCount()>0?this.observers.some((e=>e.getCurrentResult().isStale)):void 0===this.state.data||this.state.isInvalidated}isStaleByTime(e=0){return void 0===this.state.data||"static"!==e&&(!!this.state.isInvalidated||!(0,r.j3)(this.state.dataUpdatedAt,e))}onFocus(){const e=this.observers.find((e=>e.shouldFetchOnWindowFocus()));e?.refetch({cancelRefetch:!1}),this.#i?.continue()}onOnline(){const e=this.observers.find((e=>e.shouldFetchOnReconnect()));e?.refetch({cancelRefetch:!1}),this.#i?.continue()}addObserver(e){this.observers.includes(e)||(this.observers.push(e),this.clearGcTimeout(),this.#d.notify({type:"observerAdded",query:this,observer:e}))}removeObserver(e){this.observers.includes(e)&&(this.observers=this.observers.filter((t=>t!==e)),this.observers.length||(this.#i&&(this.#h||this.#f()?this.#i.cancel({revert:!0}):this.#i.cancelRetry()),this.scheduleGc()),this.#d.notify({type:"observerRemoved",query:this,observer:e}))}getObserversCount(){return this.observers.length}#f(){return"paused"===this.state.fetchStatus&&"pending"===this.state.status}invalidate(){this.state.isInvalidated||this.#s({type:"invalidate"})}async fetch(e,t){if("idle"!==this.state.fetchStatus&&"rejected"!==this.#i?.status())if(void 0!==this.state.data&&t?.cancelRefetch)this.cancel({silent:!0});else if(this.#i)return this.#i.continueRetry(),this.#i.promise;if(e&&this.setOptions(e),!this.options.queryFn){const e=this.observers.find((e=>e.options.queryFn));e&&this.setOptions(e.options)}const n=new AbortController,o=e=>{Object.defineProperty(e,"signal",{enumerable:!0,get:()=>(this.#h=!0,n.signal)})},i=()=>{const e=(0,r.ZM)(this.options,t),n=(()=>{const e={client:this.#r,queryKey:this.queryKey,meta:this.meta};return o(e),e})();return this.#h=!1,this.options.persister?this.options.persister(e,n,this):e(n)},s=(()=>{const e={fetchOptions:t,options:this.options,queryKey:this.queryKey,client:this.#r,state:this.state,fetchFn:i};return o(e),e})();this.options.behavior?.onFetch(s,this),this.#u=this.state,"idle"!==this.state.fetchStatus&&this.state.fetchMeta===s.fetchOptions?.meta||this.#s({type:"fetch",meta:s.fetchOptions?.meta}),this.#i=(0,a.II)({initialPromise:t?.initialPromise,fn:s.fetchFn,onCancel:e=>{e instanceof a.cc&&e.revert&&this.setState({...this.#u,fetchStatus:"idle"}),n.abort()},onFail:(e,t)=>{this.#s({type:"failed",failureCount:e,error:t})},onPause:()=>{this.#s({type:"pause"})},onContinue:()=>{this.#s({type:"continue"})},retry:s.options.retry,retryDelay:s.options.retryDelay,networkMode:s.options.networkMode,canRun:()=>!0});try{const e=await this.#i.start();if(void 0===e)throw new Error(`${this.queryHash} data is undefined`);return this.setData(e),this.#d.config.onSuccess?.(e,this),this.#d.config.onSettled?.(e,this.state.error,this),e}catch(e){if(e instanceof a.cc){if(e.silent)return this.#i.promise;if(e.revert){if(void 0===this.state.data)throw e;return this.state.data}}throw this.#s({type:"error",error:e}),this.#d.config.onError?.(e,this),this.#d.config.onSettled?.(this.state.data,e,this),e}finally{this.scheduleGc()}}#s(e){this.state=(t=>{switch(e.type){case"failed":return{...t,fetchFailureCount:e.failureCount,fetchFailureReason:e.error};case"pause":return{...t,fetchStatus:"paused"};case"continue":return{...t,fetchStatus:"fetching"};case"fetch":return{...t,...l(t.data,this.options),fetchMeta:e.meta??null};case"success":const n={...t,...c(e.data,e.dataUpdatedAt),dataUpdateCount:t.dataUpdateCount+1,...!e.manual&&{fetchStatus:"idle",fetchFailureCount:0,fetchFailureReason:null}};return this.#u=e.manual?n:void 0,n;case"error":const r=e.error;return{...t,error:r,errorUpdateCount:t.errorUpdateCount+1,errorUpdatedAt:Date.now(),fetchFailureCount:t.fetchFailureCount+1,fetchFailureReason:r,fetchStatus:"idle",status:"error",isInvalidated:!0};case"invalidate":return{...t,isInvalidated:!0};case"setState":return{...t,...e.state}}})(this.state),o.jG.batch((()=>{this.observers.forEach((e=>{e.onQueryUpdate()})),this.#d.notify({query:this,type:"updated",action:e})}))}};function l(e,t){return{fetchFailureCount:0,fetchFailureReason:null,fetchStatus:(0,a.v_)(t.networkMode)?"fetching":"paused",...void 0===e&&{error:null,status:"pending"}}}function c(e,t){return{data:e,dataUpdatedAt:t??Date.now(),error:null,isInvalidated:!1,status:"success"}}function u(e){const t="function"==typeof e.initialData?e.initialData():e.initialData,n=void 0!==t,r=n?"function"==typeof e.initialDataUpdatedAt?e.initialDataUpdatedAt():e.initialDataUpdatedAt:0;return{data:t,dataUpdateCount:0,dataUpdatedAt:n?r??Date.now():0,error:null,errorUpdateCount:0,errorUpdatedAt:0,fetchFailureCount:0,fetchFailureReason:null,fetchMeta:null,isInvalidated:!1,status:n?"success":"pending",fetchStatus:"idle"}}},5091(e,t,n){"use strict";n.d(t,{E:()=>g});var r=n(3725),o=n(1932),a=n(5756),i=n(5463),s=class extends i.Q{constructor(e={}){super(),this.config=e,this.#m=new Map}#m;build(e,t,n){const a=t.queryKey,i=t.queryHash??(0,r.F$)(a,t);let s=this.get(i);return s||(s=new o.X({client:e,queryKey:a,queryHash:i,options:e.defaultQueryOptions(t),state:n,defaultOptions:e.getQueryDefaults(a)}),this.add(s)),s}add(e){this.#m.has(e.queryHash)||(this.#m.set(e.queryHash,e),this.notify({type:"added",query:e}))}remove(e){const t=this.#m.get(e.queryHash);t&&(e.destroy(),t===e&&this.#m.delete(e.queryHash),this.notify({type:"removed",query:e}))}clear(){a.jG.batch((()=>{this.getAll().forEach((e=>{this.remove(e)}))}))}get(e){return this.#m.get(e)}getAll(){return[...this.#m.values()]}find(e){const t={exact:!0,...e};return this.getAll().find((e=>(0,r.MK)(t,e)))}findAll(e={}){const t=this.getAll();return Object.keys(e).length>0?t.filter((t=>(0,r.MK)(e,t))):t}notify(e){a.jG.batch((()=>{this.listeners.forEach((t=>{t(e)}))}))}onFocus(){a.jG.batch((()=>{this.getAll().forEach((e=>{e.onFocus()}))}))}onOnline(){a.jG.batch((()=>{this.getAll().forEach((e=>{e.onOnline()}))}))}},l=n(7305),c=class extends i.Q{constructor(e={}){super(),this.config=e,this.#g=new Set,this.#y=new Map,this.#b=0}#g;#y;#b;build(e,t,n){const r=new l.s({client:e,mutationCache:this,mutationId:++this.#b,options:e.defaultMutationOptions(t),state:n});return this.add(r),r}add(e){this.#g.add(e);const t=u(e);if("string"==typeof t){const n=this.#y.get(t);n?n.push(e):this.#y.set(t,[e])}this.notify({type:"added",mutation:e})}remove(e){if(this.#g.delete(e)){const t=u(e);if("string"==typeof t){const n=this.#y.get(t);if(n)if(n.length>1){const t=n.indexOf(e);-1!==t&&n.splice(t,1)}else n[0]===e&&this.#y.delete(t)}}this.notify({type:"removed",mutation:e})}canRun(e){const t=u(e);if("string"==typeof t){const n=this.#y.get(t),r=n?.find((e=>"pending"===e.state.status));return!r||r===e}return!0}runNext(e){const t=u(e);if("string"==typeof t){const n=this.#y.get(t)?.find((t=>t!==e&&t.state.isPaused));return n?.continue()??Promise.resolve()}return Promise.resolve()}clear(){a.jG.batch((()=>{this.#g.forEach((e=>{this.notify({type:"removed",mutation:e})})),this.#g.clear(),this.#y.clear()}))}getAll(){return Array.from(this.#g)}find(e){const t={exact:!0,...e};return this.getAll().find((e=>(0,r.nJ)(t,e)))}findAll(e={}){return this.getAll().filter((t=>(0,r.nJ)(e,t)))}notify(e){a.jG.batch((()=>{this.listeners.forEach((t=>{t(e)}))}))}resumePausedMutations(){const e=this.getAll().filter((e=>e.state.isPaused));return a.jG.batch((()=>Promise.all(e.map((e=>e.continue().catch(r.lQ))))))}};function u(e){return e.options.scope?.id}var d=n(4041),p=n(2862);function h(e){return{onFetch:(t,n)=>{const o=t.options,a=t.fetchOptions?.meta?.fetchMore?.direction,i=t.state.data?.pages||[],s=t.state.data?.pageParams||[];let l={pages:[],pageParams:[]},c=0;const u=async()=>{let n=!1;const u=(0,r.ZM)(t.options,t.fetchOptions),d=async(e,o,a)=>{if(n)return Promise.reject();if(null==o&&e.pages.length)return Promise.resolve(e);const i=(()=>{const e={client:t.client,queryKey:t.queryKey,pageParam:o,direction:a?"backward":"forward",meta:t.options.meta};var i;return i=e,(0,r.ox)(i,(()=>t.signal),(()=>n=!0)),e})(),s=await u(i),{maxPages:l}=t.options,c=a?r.ZZ:r.y9;return{pages:c(e.pages,s,l),pageParams:c(e.pageParams,o,l)}};if(a&&i.length){const e="backward"===a,t={pages:i,pageParams:s},n=(e?m:f)(o,t);l=await d(t,n,e)}else{const t=e??i.length;do{const e=0===c?s[0]??o.initialPageParam:f(o,l);if(c>0&&null==e)break;l=await d(l,e),c++}while(c<t)}return l};t.options.persister?t.fetchFn=()=>t.options.persister?.(u,{client:t.client,queryKey:t.queryKey,meta:t.options.meta,signal:t.signal},n):t.fetchFn=u}}}function f(e,{pages:t,pageParams:n}){const r=t.length-1;return t.length>0?e.getNextPageParam(t[r],t,n[r],n):void 0}function m(e,{pages:t,pageParams:n}){return t.length>0?e.getPreviousPageParam?.(t[0],t,n[0],n):void 0}var g=class{#v;#a;#p;#k;#x;#w;#C;#E;constructor(e={}){this.#v=e.queryCache||new s,this.#a=e.mutationCache||new c,this.#p=e.defaultOptions||{},this.#k=new Map,this.#x=new Map,this.#w=0}mount(){this.#w++,1===this.#w&&(this.#C=d.m.subscribe((async e=>{e&&(await this.resumePausedMutations(),this.#v.onFocus())})),this.#E=p.t.subscribe((async e=>{e&&(await this.resumePausedMutations(),this.#v.onOnline())})))}unmount(){this.#w--,0===this.#w&&(this.#C?.(),this.#C=void 0,this.#E?.(),this.#E=void 0)}isFetching(e){return this.#v.findAll({...e,fetchStatus:"fetching"}).length}isMutating(e){return this.#a.findAll({...e,status:"pending"}).length}getQueryData(e){const t=this.defaultQueryOptions({queryKey:e});return this.#v.get(t.queryHash)?.state.data}ensureQueryData(e){const t=this.defaultQueryOptions(e),n=this.#v.build(this,t),o=n.state.data;return void 0===o?this.fetchQuery(e):(e.revalidateIfStale&&n.isStaleByTime((0,r.d2)(t.staleTime,n))&&this.prefetchQuery(t),Promise.resolve(o))}getQueriesData(e){return this.#v.findAll(e).map((({queryKey:e,state:t})=>[e,t.data]))}setQueryData(e,t,n){const o=this.defaultQueryOptions({queryKey:e}),a=this.#v.get(o.queryHash),i=a?.state.data,s=(0,r.Zw)(t,i);if(void 0!==s)return this.#v.build(this,o).setData(s,{...n,manual:!0})}setQueriesData(e,t,n){return a.jG.batch((()=>this.#v.findAll(e).map((({queryKey:e})=>[e,this.setQueryData(e,t,n)]))))}getQueryState(e){const t=this.defaultQueryOptions({queryKey:e});return this.#v.get(t.queryHash)?.state}removeQueries(e){const t=this.#v;a.jG.batch((()=>{t.findAll(e).forEach((e=>{t.remove(e)}))}))}resetQueries(e,t){const n=this.#v;return a.jG.batch((()=>(n.findAll(e).forEach((e=>{e.reset()})),this.refetchQueries({type:"active",...e},t))))}cancelQueries(e,t={}){const n={revert:!0,...t},o=a.jG.batch((()=>this.#v.findAll(e).map((e=>e.cancel(n)))));return Promise.all(o).then(r.lQ).catch(r.lQ)}invalidateQueries(e,t={}){return a.jG.batch((()=>(this.#v.findAll(e).forEach((e=>{e.invalidate()})),"none"===e?.refetchType?Promise.resolve():this.refetchQueries({...e,type:e?.refetchType??e?.type??"active"},t))))}refetchQueries(e,t={}){const n={...t,cancelRefetch:t.cancelRefetch??!0},o=a.jG.batch((()=>this.#v.findAll(e).filter((e=>!e.isDisabled()&&!e.isStatic())).map((e=>{let t=e.fetch(void 0,n);return n.throwOnError||(t=t.catch(r.lQ)),"paused"===e.state.fetchStatus?Promise.resolve():t}))));return Promise.all(o).then(r.lQ)}fetchQuery(e){const t=this.defaultQueryOptions(e);void 0===t.retry&&(t.retry=!1);const n=this.#v.build(this,t);return n.isStaleByTime((0,r.d2)(t.staleTime,n))?n.fetch(t):Promise.resolve(n.state.data)}prefetchQuery(e){return this.fetchQuery(e).then(r.lQ).catch(r.lQ)}fetchInfiniteQuery(e){return e.behavior=h(e.pages),this.fetchQuery(e)}prefetchInfiniteQuery(e){return this.fetchInfiniteQuery(e).then(r.lQ).catch(r.lQ)}ensureInfiniteQueryData(e){return e.behavior=h(e.pages),this.ensureQueryData(e)}resumePausedMutations(){return p.t.isOnline()?this.#a.resumePausedMutations():Promise.resolve()}getQueryCache(){return this.#v}getMutationCache(){return this.#a}getDefaultOptions(){return this.#p}setDefaultOptions(e){this.#p=e}setQueryDefaults(e,t){this.#k.set((0,r.EN)(e),{queryKey:e,defaultOptions:t})}getQueryDefaults(e){const t=[...this.#k.values()],n={};return t.forEach((t=>{(0,r.Cp)(e,t.queryKey)&&Object.assign(n,t.defaultOptions)})),n}setMutationDefaults(e,t){this.#x.set((0,r.EN)(e),{mutationKey:e,defaultOptions:t})}getMutationDefaults(e){const t=[...this.#x.values()],n={};return t.forEach((t=>{(0,r.Cp)(e,t.mutationKey)&&Object.assign(n,t.defaultOptions)})),n}defaultQueryOptions(e){if(e._defaulted)return e;const t={...this.#p.queries,...this.getQueryDefaults(e.queryKey),...e,_defaulted:!0};return t.queryHash||(t.queryHash=(0,r.F$)(t.queryKey,t)),void 0===t.refetchOnReconnect&&(t.refetchOnReconnect="always"!==t.networkMode),void 0===t.throwOnError&&(t.throwOnError=!!t.suspense),!t.networkMode&&t.persister&&(t.networkMode="offlineFirst"),t.queryFn===r.hT&&(t.enabled=!1),t}defaultMutationOptions(e){return e?._defaulted?e:{...this.#p.mutations,...e?.mutationKey&&this.getMutationDefaults(e.mutationKey),...e,_defaulted:!0}}clear(){this.#v.clear(),this.#a.clear()}}},7421(e,t,n){"use strict";n.d(t,{k:()=>i});var r=n(2904),o=n(7870),a=n(3725),i=class{#A;destroy(){this.clearGcTimeout()}scheduleGc(){this.clearGcTimeout(),(0,a.gn)(this.gcTime)&&(this.#A=r.zs.setTimeout((()=>{this.optionalRemove()}),this.gcTime))}updateGcTime(e){this.gcTime=Math.max(this.gcTime||0,e??(o.H.isServer()?1/0:3e5))}clearGcTimeout(){void 0!==this.#A&&(r.zs.clearTimeout(this.#A),this.#A=void 0)}}},1289(e,t,n){"use strict";n.d(t,{II:()=>d,cc:()=>u,v_:()=>c});var r=n(4041),o=n(2862),a=n(4145),i=n(7870),s=n(3725);function l(e){return Math.min(1e3*2**e,3e4)}function c(e){return"online"!==(e??"online")||o.t.isOnline()}var u=class extends Error{constructor(e){super("CancelledError"),this.revert=e?.revert,this.silent=e?.silent}};function d(e){let t,n=!1,d=0;const p=(0,a.T)(),h=()=>"pending"!==p.status,f=()=>r.m.isFocused()&&("always"===e.networkMode||o.t.isOnline())&&e.canRun(),m=()=>c(e.networkMode)&&e.canRun(),g=e=>{h()||(t?.(),p.resolve(e))},y=e=>{h()||(t?.(),p.reject(e))},b=()=>new Promise((n=>{t=e=>{(h()||f())&&n(e)},e.onPause?.()})).then((()=>{t=void 0,h()||e.onContinue?.()})),v=()=>{if(h())return;let t;const r=0===d?e.initialPromise:void 0;try{t=r??e.fn()}catch(e){t=Promise.reject(e)}Promise.resolve(t).then(g).catch((t=>{if(h())return;const r=e.retry??(i.H.isServer()?0:3),o=e.retryDelay??l,a="function"==typeof o?o(d,t):o,c=!0===r||"number"==typeof r&&d<r||"function"==typeof r&&r(d,t);!n&&c?(d++,e.onFail?.(d,t),(0,s.yy)(a).then((()=>f()?void 0:b())).then((()=>{n?y(t):v()}))):y(t)}))};return{promise:p,status:()=>p.status,cancel:t=>{if(!h()){const n=new u(t);y(n),e.onCancel?.(n)}},continue:()=>(t?.(),p),cancelRetry:()=>{n=!0},continueRetry:()=>{n=!1},canStart:m,start:()=>(m()?v():b().then(v),p)}}},5463(e,t,n){"use strict";n.d(t,{Q:()=>r});var r=class{constructor(){this.listeners=new Set,this.subscribe=this.subscribe.bind(this)}subscribe(e){return this.listeners.add(e),this.onSubscribe(),()=>{this.listeners.delete(e),this.onUnsubscribe()}}hasListeners(){return this.listeners.size>0}onSubscribe(){}onUnsubscribe(){}}},4145(e,t,n){"use strict";function r(){let e,t;const n=new Promise(((n,r)=>{e=n,t=r}));function r(e){Object.assign(n,e),delete n.resolve,delete n.reject}return n.status="pending",n.catch((()=>{})),n.resolve=t=>{r({status:"fulfilled",value:t}),e(t)},n.reject=e=>{r({status:"rejected",reason:e}),t(e)},n}n.d(t,{T:()=>r})},2904(e,t,n){"use strict";n.d(t,{Zq:()=>a,zs:()=>o});var r={setTimeout:(e,t)=>setTimeout(e,t),clearTimeout:e=>clearTimeout(e),setInterval:(e,t)=>setInterval(e,t),clearInterval:e=>clearInterval(e)},o=new class{#S=r;#O=!1;setTimeoutProvider(e){this.#S=e}setTimeout(e,t){return this.#S.setTimeout(e,t)}clearTimeout(e){this.#S.clearTimeout(e)}setInterval(e,t){return this.#S.setInterval(e,t)}clearInterval(e){this.#S.clearInterval(e)}};function a(e){setTimeout(e,0)}},3725(e,t,n){"use strict";n.d(t,{Cp:()=>m,EN:()=>f,Eh:()=>u,F$:()=>h,GU:()=>M,MK:()=>d,S$:()=>o,ZM:()=>O,ZZ:()=>A,Zw:()=>i,d2:()=>c,f8:()=>b,gn:()=>s,hT:()=>S,j3:()=>l,lQ:()=>a,nJ:()=>p,ox:()=>R,pl:()=>C,y9:()=>E,yy:()=>w});var r=n(2904),o="undefined"==typeof window||"Deno"in globalThis;function a(){}function i(e,t){return"function"==typeof e?e(t):e}function s(e){return"number"==typeof e&&e>=0&&e!==1/0}function l(e,t){return Math.max(e+(t||0)-Date.now(),0)}function c(e,t){return"function"==typeof e?e(t):e}function u(e,t){return"function"==typeof e?e(t):e}function d(e,t){const{type:n="all",exact:r,fetchStatus:o,predicate:a,queryKey:i,stale:s}=e;if(i)if(r){if(t.queryHash!==h(i,t.options))return!1}else if(!m(t.queryKey,i))return!1;if("all"!==n){const e=t.isActive();if("active"===n&&!e)return!1;if("inactive"===n&&e)return!1}return("boolean"!=typeof s||t.isStale()===s)&&((!o||o===t.state.fetchStatus)&&!(a&&!a(t)))}function p(e,t){const{exact:n,status:r,predicate:o,mutationKey:a}=e;if(a){if(!t.options.mutationKey)return!1;if(n){if(f(t.options.mutationKey)!==f(a))return!1}else if(!m(t.options.mutationKey,a))return!1}return(!r||t.state.status===r)&&!(o&&!o(t))}function h(e,t){return(t?.queryKeyHashFn||f)(e)}function f(e){return JSON.stringify(e,((e,t)=>k(t)?Object.keys(t).sort().reduce(((e,n)=>(e[n]=t[n],e)),{}):t))}function m(e,t){return e===t||typeof e==typeof t&&(!(!e||!t||"object"!=typeof e||"object"!=typeof t)&&Object.keys(t).every((n=>m(e[n],t[n]))))}var g=Object.prototype.hasOwnProperty;function y(e,t,n=0){if(e===t)return e;if(n>500)return t;const r=v(e)&&v(t);if(!(r||k(e)&&k(t)))return t;const o=(r?e:Object.keys(e)).length,a=r?t:Object.keys(t),i=a.length,s=r?new Array(i):{};let l=0;for(let c=0;c<i;c++){const i=r?c:a[c],u=e[i],d=t[i];if(u===d){s[i]=u,(r?c<o:g.call(e,i))&&l++;continue}if(null===u||null===d||"object"!=typeof u||"object"!=typeof d){s[i]=d;continue}const p=y(u,d,n+1);s[i]=p,p===u&&l++}return o===i&&l===o?e:s}function b(e,t){if(!t||Object.keys(e).length!==Object.keys(t).length)return!1;for(const n in e)if(e[n]!==t[n])return!1;return!0}function v(e){return Array.isArray(e)&&e.length===Object.keys(e).length}function k(e){if(!x(e))return!1;const t=e.constructor;if(void 0===t)return!0;const n=t.prototype;return!!x(n)&&(!!n.hasOwnProperty("isPrototypeOf")&&Object.getPrototypeOf(e)===Object.prototype)}function x(e){return"[object Object]"===Object.prototype.toString.call(e)}function w(e){return new Promise((t=>{r.zs.setTimeout(t,e)}))}function C(e,t,n){return"function"==typeof n.structuralSharing?n.structuralSharing(e,t):!1!==n.structuralSharing?y(e,t):t}function E(e,t,n=0){const r=[...e,t];return n&&r.length>n?r.slice(1):r}function A(e,t,n=0){const r=[t,...e];return n&&r.length>n?r.slice(0,-1):r}var S=Symbol();function O(e,t){return!e.queryFn&&t?.initialPromise?()=>t.initialPromise:e.queryFn&&e.queryFn!==S?e.queryFn:()=>Promise.reject(new Error(`Missing queryFn: '${e.queryHash}'`))}function M(e,t){return"function"==typeof e?e(...t):!!e}function R(e,t,n){let r,o=!1;return Object.defineProperty(e,"signal",{enumerable:!0,get:()=>(r??=t(),o||(o=!0,r.aborted?n():r.addEventListener("abort",n,{once:!0})),r)}),e}},3773(e,t,n){"use strict";n.d(t,{Ht:()=>s,jE:()=>i});var r=n(1594),o=n(6070),a=r.createContext(void 0),i=e=>{const t=r.useContext(a);if(e)return e;if(!t)throw new Error("No QueryClient set, use QueryClientProvider to set one");return t},s=({client:e,children:t})=>(r.useEffect((()=>(e.mount(),()=>{e.unmount()})),[e]),(0,o.jsx)(a.Provider,{value:e,children:t}))},4583(e,t,n){"use strict";n.d(t,{n:()=>u});var r=n(1594),o=n(7305),a=n(5756),i=n(5463),s=n(3725),l=class extends i.Q{#r;#M=void 0;#R;#_;constructor(e,t){super(),this.#r=e,this.setOptions(t),this.bindMethods(),this.#$()}bindMethods(){this.mutate=this.mutate.bind(this),this.reset=this.reset.bind(this)}setOptions(e){const t=this.options;this.options=this.#r.defaultMutationOptions(e),(0,s.f8)(this.options,t)||this.#r.getMutationCache().notify({type:"observerOptionsUpdated",mutation:this.#R,observer:this}),t?.mutationKey&&this.options.mutationKey&&(0,s.EN)(t.mutationKey)!==(0,s.EN)(this.options.mutationKey)?this.reset():"pending"===this.#R?.state.status&&this.#R.setOptions(this.options)}onUnsubscribe(){this.hasListeners()||this.#R?.removeObserver(this)}onMutationUpdate(e){this.#$(),this.#N(e)}getCurrentResult(){return this.#M}reset(){this.#R?.removeObserver(this),this.#R=void 0,this.#$(),this.#N()}mutate(e,t){return this.#_=t,this.#R?.removeObserver(this),this.#R=this.#r.getMutationCache().build(this.#r,this.options),this.#R.addObserver(this),this.#R.execute(e)}#$(){const e=this.#R?.state??(0,o.$)();this.#M={...e,isPending:"pending"===e.status,isSuccess:"success"===e.status,isError:"error"===e.status,isIdle:"idle"===e.status,mutate:this.mutate,reset:this.reset}}#N(e){a.jG.batch((()=>{if(this.#_&&this.hasListeners()){const t=this.#M.variables,n=this.#M.context,r={client:this.#r,meta:this.options.meta,mutationKey:this.options.mutationKey};if("success"===e?.type){try{this.#_.onSuccess?.(e.data,t,n,r)}catch(e){Promise.reject(e)}try{this.#_.onSettled?.(e.data,null,t,n,r)}catch(e){Promise.reject(e)}}else if("error"===e?.type){try{this.#_.onError?.(e.error,t,n,r)}catch(e){Promise.reject(e)}try{this.#_.onSettled?.(void 0,e.error,t,n,r)}catch(e){Promise.reject(e)}}}this.listeners.forEach((e=>{e(this.#M)}))}))}},c=n(3773);function u(e,t){const n=(0,c.jE)(t),[o]=r.useState((()=>new l(n,e)));r.useEffect((()=>{o.setOptions(e)}),[o,e]);const i=r.useSyncExternalStore(r.useCallback((e=>o.subscribe(a.jG.batchCalls(e))),[o]),(()=>o.getCurrentResult()),(()=>o.getCurrentResult())),u=r.useCallback(((e,t)=>{o.mutate(e,t).catch(s.lQ)}),[o]);if(i.error&&(0,s.GU)(o.options.throwOnError,[i.error]))throw i.error;return{...i,mutate:u,mutateAsync:i.mutate}}},4377(e,t,n){"use strict";n.d(t,{I:()=>C});var r=n(4041),o=n(7870),a=n(5756),i=n(1932),s=n(5463),l=n(4145),c=n(3725),u=n(2904),d=class extends s.Q{constructor(e,t){super(),this.options=t,this.#r=e,this.#z=null,this.#T=(0,l.T)(),this.bindMethods(),this.setOptions(t)}#r;#P=void 0;#j=void 0;#M=void 0;#I;#L;#T;#z;#F;#q;#D;#B;#W;#H;#U=new Set;bindMethods(){this.refetch=this.refetch.bind(this)}onSubscribe(){1===this.listeners.size&&(this.#P.addObserver(this),p(this.#P,this.options)?this.#Q():this.updateResult(),this.#K())}onUnsubscribe(){this.hasListeners()||this.destroy()}shouldFetchOnReconnect(){return h(this.#P,this.options,this.options.refetchOnReconnect)}shouldFetchOnWindowFocus(){return h(this.#P,this.options,this.options.refetchOnWindowFocus)}destroy(){this.listeners=new Set,this.#G(),this.#V(),this.#P.removeObserver(this)}setOptions(e){const t=this.options,n=this.#P;if(this.options=this.#r.defaultQueryOptions(e),void 0!==this.options.enabled&&"boolean"!=typeof this.options.enabled&&"function"!=typeof this.options.enabled&&"boolean"!=typeof(0,c.Eh)(this.options.enabled,this.#P))throw new Error("Expected enabled to be a boolean or a callback that returns a boolean");this.#X(),this.#P.setOptions(this.options),t._defaulted&&!(0,c.f8)(this.options,t)&&this.#r.getQueryCache().notify({type:"observerOptionsUpdated",query:this.#P,observer:this});const r=this.hasListeners();r&&f(this.#P,n,this.options,t)&&this.#Q(),this.updateResult(),!r||this.#P===n&&(0,c.Eh)(this.options.enabled,this.#P)===(0,c.Eh)(t.enabled,this.#P)&&(0,c.d2)(this.options.staleTime,this.#P)===(0,c.d2)(t.staleTime,this.#P)||this.#Y();const o=this.#Z();!r||this.#P===n&&(0,c.Eh)(this.options.enabled,this.#P)===(0,c.Eh)(t.enabled,this.#P)&&o===this.#H||this.#J(o)}getOptimisticResult(e){const t=this.#r.getQueryCache().build(this.#r,e),n=this.createResult(t,e);return function(e,t){if(!(0,c.f8)(e.getCurrentResult(),t))return!0;return!1}(this,n)&&(this.#M=n,this.#L=this.options,this.#I=this.#P.state),n}getCurrentResult(){return this.#M}trackResult(e,t){return new Proxy(e,{get:(e,n)=>(this.trackProp(n),t?.(n),"promise"===n&&(this.trackProp("data"),this.options.experimental_prefetchInRender||"pending"!==this.#T.status||this.#T.reject(new Error("experimental_prefetchInRender feature flag is not enabled"))),Reflect.get(e,n))})}trackProp(e){this.#U.add(e)}getCurrentQuery(){return this.#P}refetch({...e}={}){return this.fetch({...e})}fetchOptimistic(e){const t=this.#r.defaultQueryOptions(e),n=this.#r.getQueryCache().build(this.#r,t);return n.fetch().then((()=>this.createResult(n,t)))}fetch(e){return this.#Q({...e,cancelRefetch:e.cancelRefetch??!0}).then((()=>(this.updateResult(),this.#M)))}#Q(e){this.#X();let t=this.#P.fetch(this.options,e);return e?.throwOnError||(t=t.catch(c.lQ)),t}#Y(){this.#G();const e=(0,c.d2)(this.options.staleTime,this.#P);if(o.H.isServer()||this.#M.isStale||!(0,c.gn)(e))return;const t=(0,c.j3)(this.#M.dataUpdatedAt,e)+1;this.#B=u.zs.setTimeout((()=>{this.#M.isStale||this.updateResult()}),t)}#Z(){return("function"==typeof this.options.refetchInterval?this.options.refetchInterval(this.#P):this.options.refetchInterval)??!1}#J(e){this.#V(),this.#H=e,!o.H.isServer()&&!1!==(0,c.Eh)(this.options.enabled,this.#P)&&(0,c.gn)(this.#H)&&0!==this.#H&&(this.#W=u.zs.setInterval((()=>{(this.options.refetchIntervalInBackground||r.m.isFocused())&&this.#Q()}),this.#H))}#K(){this.#Y(),this.#J(this.#Z())}#G(){void 0!==this.#B&&(u.zs.clearTimeout(this.#B),this.#B=void 0)}#V(){void 0!==this.#W&&(u.zs.clearInterval(this.#W),this.#W=void 0)}createResult(e,t){const n=this.#P,r=this.options,o=this.#M,a=this.#I,s=this.#L,u=e!==n?e.state:this.#j,{state:d}=e;let h,g={...d},y=!1;if(t._optimisticResults){const o=this.hasListeners(),a=!o&&p(e,t),s=o&&f(e,n,t,r);(a||s)&&(g={...g,...(0,i.k)(d.data,e.options)}),"isRestoring"===t._optimisticResults&&(g.fetchStatus="idle")}let{error:b,errorUpdatedAt:v,status:k}=g;h=g.data;let x=!1;if(void 0!==t.placeholderData&&void 0===h&&"pending"===k){let e;o?.isPlaceholderData&&t.placeholderData===s?.placeholderData?(e=o.data,x=!0):e="function"==typeof t.placeholderData?t.placeholderData(this.#D?.state.data,this.#D):t.placeholderData,void 0!==e&&(k="success",h=(0,c.pl)(o?.data,e,t),y=!0)}if(t.select&&void 0!==h&&!x)if(o&&h===a?.data&&t.select===this.#F)h=this.#q;else try{this.#F=t.select,h=t.select(h),h=(0,c.pl)(o?.data,h,t),this.#q=h,this.#z=null}catch(e){this.#z=e}this.#z&&(b=this.#z,h=this.#q,v=Date.now(),k="error");const w="fetching"===g.fetchStatus,C="pending"===k,E="error"===k,A=C&&w,S=void 0!==h,O={status:k,fetchStatus:g.fetchStatus,isPending:C,isSuccess:"success"===k,isError:E,isInitialLoading:A,isLoading:A,data:h,dataUpdatedAt:g.dataUpdatedAt,error:b,errorUpdatedAt:v,failureCount:g.fetchFailureCount,failureReason:g.fetchFailureReason,errorUpdateCount:g.errorUpdateCount,isFetched:e.isFetched(),isFetchedAfterMount:g.dataUpdateCount>u.dataUpdateCount||g.errorUpdateCount>u.errorUpdateCount,isFetching:w,isRefetching:w&&!C,isLoadingError:E&&!S,isPaused:"paused"===g.fetchStatus,isPlaceholderData:y,isRefetchError:E&&S,isStale:m(e,t),refetch:this.refetch,promise:this.#T,isEnabled:!1!==(0,c.Eh)(t.enabled,e)};if(this.options.experimental_prefetchInRender){const t=void 0!==O.data,r="error"===O.status&&!t,o=e=>{r?e.reject(O.error):t&&e.resolve(O.data)},a=()=>{const e=this.#T=O.promise=(0,l.T)();o(e)},i=this.#T;switch(i.status){case"pending":e.queryHash===n.queryHash&&o(i);break;case"fulfilled":(r||O.data!==i.value)&&a();break;case"rejected":r&&O.error===i.reason||a()}}return O}updateResult(){const e=this.#M,t=this.createResult(this.#P,this.options);if(this.#I=this.#P.state,this.#L=this.options,void 0!==this.#I.data&&(this.#D=this.#P),(0,c.f8)(t,e))return;this.#M=t;this.#N({listeners:(()=>{if(!e)return!0;const{notifyOnChangeProps:t}=this.options,n="function"==typeof t?t():t;if("all"===n||!n&&!this.#U.size)return!0;const r=new Set(n??this.#U);return this.options.throwOnError&&r.add("error"),Object.keys(this.#M).some((t=>{const n=t;return this.#M[n]!==e[n]&&r.has(n)}))})()})}#X(){const e=this.#r.getQueryCache().build(this.#r,this.options);if(e===this.#P)return;const t=this.#P;this.#P=e,this.#j=e.state,this.hasListeners()&&(t?.removeObserver(this),e.addObserver(this))}onQueryUpdate(){this.updateResult(),this.hasListeners()&&this.#K()}#N(e){a.jG.batch((()=>{e.listeners&&this.listeners.forEach((e=>{e(this.#M)})),this.#r.getQueryCache().notify({query:this.#P,type:"observerResultsUpdated"})}))}};function p(e,t){return function(e,t){return!1!==(0,c.Eh)(t.enabled,e)&&void 0===e.state.data&&!("error"===e.state.status&&!1===t.retryOnMount)}(e,t)||void 0!==e.state.data&&h(e,t,t.refetchOnMount)}function h(e,t,n){if(!1!==(0,c.Eh)(t.enabled,e)&&"static"!==(0,c.d2)(t.staleTime,e)){const r="function"==typeof n?n(e):n;return"always"===r||!1!==r&&m(e,t)}return!1}function f(e,t,n,r){return(e!==t||!1===(0,c.Eh)(r.enabled,e))&&(!n.suspense||"error"!==e.state.status)&&m(e,n)}function m(e,t){return!1!==(0,c.Eh)(t.enabled,e)&&e.isStaleByTime((0,c.d2)(t.staleTime,e))}var g=n(1594),y=n(3773);n(6070);function b(){let e=!1;return{clearReset:()=>{e=!1},reset:()=>{e=!0},isReset:()=>e}}var v=g.createContext(b()),k=g.createContext(!1),x=(k.Provider,(e,t,n)=>t.fetchOptimistic(e).catch((()=>{n.clearReset()})));function w(e,t,n){const r=g.useContext(k),i=g.useContext(v),s=(0,y.jE)(n),l=s.defaultQueryOptions(e);s.getDefaultOptions().queries?._experimental_beforeQuery?.(l);const u=s.getQueryCache().get(l.queryHash);l._optimisticResults=r?"isRestoring":"optimistic",(e=>{if(e.suspense){const t=1e3,n=e=>"static"===e?e:Math.max(e??t,t),r=e.staleTime;e.staleTime="function"==typeof r?(...e)=>n(r(...e)):n(r),"number"==typeof e.gcTime&&(e.gcTime=Math.max(e.gcTime,t))}})(l),((e,t,n)=>{const r=n?.state.error&&"function"==typeof e.throwOnError?(0,c.GU)(e.throwOnError,[n.state.error,n]):e.throwOnError;(e.suspense||e.experimental_prefetchInRender||r)&&(t.isReset()||(e.retryOnMount=!1))})(l,i,u),(e=>{g.useEffect((()=>{e.clearReset()}),[e])})(i);const d=!s.getQueryCache().get(l.queryHash),[p]=g.useState((()=>new t(s,l))),h=p.getOptimisticResult(l),f=!r&&!1!==e.subscribed;if(g.useSyncExternalStore(g.useCallback((e=>{const t=f?p.subscribe(a.jG.batchCalls(e)):c.lQ;return p.updateResult(),t}),[p,f]),(()=>p.getCurrentResult()),(()=>p.getCurrentResult())),g.useEffect((()=>{p.setOptions(l)}),[l,p]),((e,t)=>e?.suspense&&t.isPending)(l,h))throw x(l,p,i);if((({result:e,errorResetBoundary:t,throwOnError:n,query:r,suspense:o})=>e.isError&&!t.isReset()&&!e.isFetching&&r&&(o&&void 0===e.data||(0,c.GU)(n,[e.error,r])))({result:h,errorResetBoundary:i,throwOnError:l.throwOnError,query:u,suspense:l.suspense}))throw h.error;if(s.getDefaultOptions().queries?._experimental_afterQuery?.(l,h),l.experimental_prefetchInRender&&!o.H.isServer()&&((e,t)=>e.isLoading&&e.isFetching&&!t)(h,r)){const e=d?x(l,p,i):u?.promise;e?.catch(c.lQ).finally((()=>{p.updateResult()}))}return l.notifyOnChangeProps?h:p.trackResult(h)}function C(e,t){return w(e,d,t)}},6321(e,t,n){"use strict";n.d(t,{p2:()=>$n});var r=n(6070),o=n(6730),a=n(1594),i=(n(2096),n(1035),n(8976),n(5035),r.Fragment),s=function(e,t,n){return o.h.call(t,"css")?r.jsx(o.E,(0,o.c)(e,t),n):r.jsx(e,t,n)},l=function(e,t,n){return o.h.call(t,"css")?r.jsxs(o.E,(0,o.c)(e,t),n):r.jsxs(e,t,n)},c=n(8621),u=n(9244);function d(e){var t,n,r="";if("string"==typeof e||"number"==typeof e)r+=e;else if("object"==typeof e)if(Array.isArray(e)){var o=e.length;for(t=0;t<o;t++)e[t]&&(n=d(e[t]))&&(r&&(r+=" "),r+=n)}else for(n in e)e[n]&&(r&&(r+=" "),r+=n);return r}const p=function(){for(var e,t,n=0,r="",o=arguments.length;n<o;n++)(e=arguments[n])&&(t=d(e))&&(r&&(r+=" "),r+=t);return r};var h=n(5824),f=n(5394),m=n(1072),g=n(718);const y=function(e=null){const t=a.useContext(o.T);return t&&(n=t,0!==Object.keys(n).length)?t:e;var n},b=(0,g.A)();const v=function(e=b){return y(e)},k=["className","component"];const x=e=>e,w=(()=>{let e=x;return{configure(t){e=t},generate:t=>e(t),reset(){e=x}}})();var C=n(840),E=n(4368),A=n(9035);var S=n(220);const O={black:"#000",white:"#fff"},M={50:"#fafafa",100:"#f5f5f5",200:"#eeeeee",300:"#e0e0e0",400:"#bdbdbd",500:"#9e9e9e",600:"#757575",700:"#616161",800:"#424242",900:"#212121",A100:"#f5f5f5",A200:"#eeeeee",A400:"#bdbdbd",A700:"#616161"},R={50:"#f3e5f5",100:"#e1bee7",200:"#ce93d8",300:"#ba68c8",400:"#ab47bc",500:"#9c27b0",600:"#8e24aa",700:"#7b1fa2",800:"#6a1b9a",900:"#4a148c",A100:"#ea80fc",A200:"#e040fb",A400:"#d500f9",A700:"#aa00ff"},_={50:"#ffebee",100:"#ffcdd2",200:"#ef9a9a",300:"#e57373",400:"#ef5350",500:"#f44336",600:"#e53935",700:"#d32f2f",800:"#c62828",900:"#b71c1c",A100:"#ff8a80",A200:"#ff5252",A400:"#ff1744",A700:"#d50000"},$={50:"#fff3e0",100:"#ffe0b2",200:"#ffcc80",300:"#ffb74d",400:"#ffa726",500:"#ff9800",600:"#fb8c00",700:"#f57c00",800:"#ef6c00",900:"#e65100",A100:"#ffd180",A200:"#ffab40",A400:"#ff9100",A700:"#ff6d00"},N={50:"#e3f2fd",100:"#bbdefb",200:"#90caf9",300:"#64b5f6",400:"#42a5f5",500:"#2196f3",600:"#1e88e5",700:"#1976d2",800:"#1565c0",900:"#0d47a1",A100:"#82b1ff",A200:"#448aff",A400:"#2979ff",A700:"#2962ff"},z={50:"#e1f5fe",100:"#b3e5fc",200:"#81d4fa",300:"#4fc3f7",400:"#29b6f6",500:"#03a9f4",600:"#039be5",700:"#0288d1",800:"#0277bd",900:"#01579b",A100:"#80d8ff",A200:"#40c4ff",A400:"#00b0ff",A700:"#0091ea"},T={50:"#e8f5e9",100:"#c8e6c9",200:"#a5d6a7",300:"#81c784",400:"#66bb6a",500:"#4caf50",600:"#43a047",700:"#388e3c",800:"#2e7d32",900:"#1b5e20",A100:"#b9f6ca",A200:"#69f0ae",A400:"#00e676",A700:"#00c853"},P=["mode","contrastThreshold","tonalOffset"],j={text:{primary:"rgba(0, 0, 0, 0.87)",secondary:"rgba(0, 0, 0, 0.6)",disabled:"rgba(0, 0, 0, 0.38)"},divider:"rgba(0, 0, 0, 0.12)",background:{paper:O.white,default:O.white},action:{active:"rgba(0, 0, 0, 0.54)",hover:"rgba(0, 0, 0, 0.04)",hoverOpacity:.04,selected:"rgba(0, 0, 0, 0.08)",selectedOpacity:.08,disabled:"rgba(0, 0, 0, 0.26)",disabledBackground:"rgba(0, 0, 0, 0.12)",disabledOpacity:.38,focus:"rgba(0, 0, 0, 0.12)",focusOpacity:.12,activatedOpacity:.12}},I={text:{primary:O.white,secondary:"rgba(255, 255, 255, 0.7)",disabled:"rgba(255, 255, 255, 0.5)",icon:"rgba(255, 255, 255, 0.5)"},divider:"rgba(255, 255, 255, 0.12)",background:{paper:"#121212",default:"#121212"},action:{active:O.white,hover:"rgba(255, 255, 255, 0.08)",hoverOpacity:.08,selected:"rgba(255, 255, 255, 0.16)",selectedOpacity:.16,disabled:"rgba(255, 255, 255, 0.3)",disabledBackground:"rgba(255, 255, 255, 0.12)",disabledOpacity:.38,focus:"rgba(255, 255, 255, 0.12)",focusOpacity:.12,activatedOpacity:.24}};function L(e,t,n,r){const o=r.light||r,a=r.dark||1.5*r;e[t]||(e.hasOwnProperty(n)?e[t]=e[n]:"light"===t?e.light=(0,S.a)(e.main,o):"dark"===t&&(e.dark=(0,S.e$)(e.main,a)))}function F(e){const{mode:t="light",contrastThreshold:n=3,tonalOffset:r=.2}=e,o=(0,u.A)(e,P),a=e.primary||function(e="light"){return"dark"===e?{main:N[200],light:N[50],dark:N[400]}:{main:N[700],light:N[400],dark:N[800]}}(t),i=e.secondary||function(e="light"){return"dark"===e?{main:R[200],light:R[50],dark:R[400]}:{main:R[500],light:R[300],dark:R[700]}}(t),s=e.error||function(e="light"){return"dark"===e?{main:_[500],light:_[300],dark:_[700]}:{main:_[700],light:_[400],dark:_[800]}}(t),l=e.info||function(e="light"){return"dark"===e?{main:z[400],light:z[300],dark:z[700]}:{main:z[700],light:z[500],dark:z[900]}}(t),d=e.success||function(e="light"){return"dark"===e?{main:T[400],light:T[300],dark:T[700]}:{main:T[800],light:T[500],dark:T[900]}}(t),p=e.warning||function(e="light"){return"dark"===e?{main:$[400],light:$[300],dark:$[700]}:{main:"#ed6c02",light:$[500],dark:$[900]}}(t);function h(e){return(0,S.eM)(e,I.text.primary)>=n?I.text.primary:j.text.primary}const f=({color:e,name:t,mainShade:n=500,lightShade:o=300,darkShade:a=700})=>{if(!(e=(0,c.A)({},e)).main&&e[n]&&(e.main=e[n]),!e.hasOwnProperty("main"))throw new Error((0,C.A)(11,t?` (${t})`:"",n));if("string"!=typeof e.main)throw new Error((0,C.A)(12,t?` (${t})`:"",JSON.stringify(e.main)));return L(e,"light",o,r),L(e,"dark",a,r),e.contrastText||(e.contrastText=h(e.main)),e},m={dark:I,light:j};return(0,E.A)((0,c.A)({common:(0,c.A)({},O),mode:t,primary:f({color:a,name:"primary"}),secondary:f({color:i,name:"secondary",mainShade:"A400",lightShade:"A200",darkShade:"A700"}),error:f({color:s,name:"error"}),warning:f({color:p,name:"warning"}),info:f({color:l,name:"info"}),success:f({color:d,name:"success"}),grey:M,contrastThreshold:n,getContrastText:h,augmentColor:f,tonalOffset:r},m[t]),o)}const q=["fontFamily","fontSize","fontWeightLight","fontWeightRegular","fontWeightMedium","fontWeightBold","htmlFontSize","allVariants","pxToRem"];const D={textTransform:"uppercase"},B='"Roboto", "Helvetica", "Arial", sans-serif';function W(e,t){const n="function"==typeof t?t(e):t,{fontFamily:r=B,fontSize:o=14,fontWeightLight:a=300,fontWeightRegular:i=400,fontWeightMedium:s=500,fontWeightBold:l=700,htmlFontSize:d=16,allVariants:p,pxToRem:h}=n,f=(0,u.A)(n,q);const m=o/14,g=h||(e=>e/d*m+"rem"),y=(e,t,n,o,a)=>{return(0,c.A)({fontFamily:r,fontWeight:e,fontSize:g(t),lineHeight:n},r===B?{letterSpacing:(i=o/t,Math.round(1e5*i)/1e5)+"em"}:{},a,p);var i},b={h1:y(a,96,1.167,-1.5),h2:y(a,60,1.2,-.5),h3:y(i,48,1.167,0),h4:y(i,34,1.235,.25),h5:y(i,24,1.334,0),h6:y(s,20,1.6,.15),subtitle1:y(i,16,1.75,.15),subtitle2:y(s,14,1.57,.1),body1:y(i,16,1.5,.15),body2:y(i,14,1.43,.15),button:y(s,14,1.75,.4,D),caption:y(i,12,1.66,.4),overline:y(i,12,2.66,1,D),inherit:{fontFamily:"inherit",fontWeight:"inherit",fontSize:"inherit",lineHeight:"inherit",letterSpacing:"inherit"}};return(0,E.A)((0,c.A)({htmlFontSize:d,pxToRem:g,fontFamily:r,fontSize:o,fontWeightLight:a,fontWeightRegular:i,fontWeightMedium:s,fontWeightBold:l},b),f,{clone:!1})}function H(...e){return[`${e[0]}px ${e[1]}px ${e[2]}px ${e[3]}px rgba(0,0,0,0.2)`,`${e[4]}px ${e[5]}px ${e[6]}px ${e[7]}px rgba(0,0,0,0.14)`,`${e[8]}px ${e[9]}px ${e[10]}px ${e[11]}px rgba(0,0,0,0.12)`].join(",")}const U=["none",H(0,2,1,-1,0,1,1,0,0,1,3,0),H(0,3,1,-2,0,2,2,0,0,1,5,0),H(0,3,3,-2,0,3,4,0,0,1,8,0),H(0,2,4,-1,0,4,5,0,0,1,10,0),H(0,3,5,-1,0,5,8,0,0,1,14,0),H(0,3,5,-1,0,6,10,0,0,1,18,0),H(0,4,5,-2,0,7,10,1,0,2,16,1),H(0,5,5,-3,0,8,10,1,0,3,14,2),H(0,5,6,-3,0,9,12,1,0,3,16,2),H(0,6,6,-3,0,10,14,1,0,4,18,3),H(0,6,7,-4,0,11,15,1,0,4,20,3),H(0,7,8,-4,0,12,17,2,0,5,22,4),H(0,7,8,-4,0,13,19,2,0,5,24,4),H(0,7,9,-4,0,14,21,2,0,5,26,4),H(0,8,9,-5,0,15,22,2,0,6,28,5),H(0,8,10,-5,0,16,24,2,0,6,30,5),H(0,8,11,-5,0,17,26,2,0,6,32,5),H(0,9,11,-5,0,18,28,2,0,7,34,6),H(0,9,12,-6,0,19,29,2,0,7,36,6),H(0,10,13,-6,0,20,31,3,0,8,38,7),H(0,10,13,-6,0,21,33,3,0,8,40,7),H(0,10,14,-6,0,22,35,3,0,8,42,7),H(0,11,14,-7,0,23,36,3,0,9,44,8),H(0,11,15,-7,0,24,38,3,0,9,46,8)],Q=["duration","easing","delay"],K={easeInOut:"cubic-bezier(0.4, 0, 0.2, 1)",easeOut:"cubic-bezier(0.0, 0, 0.2, 1)",easeIn:"cubic-bezier(0.4, 0, 1, 1)",sharp:"cubic-bezier(0.4, 0, 0.6, 1)"},G={shortest:150,shorter:200,short:250,standard:300,complex:375,enteringScreen:225,leavingScreen:195};function V(e){return`${Math.round(e)}ms`}function X(e){if(!e)return 0;const t=e/36;return Math.round(10*(4+15*t**.25+t/5))}function Y(e){const t=(0,c.A)({},K,e.easing),n=(0,c.A)({},G,e.duration);return(0,c.A)({getAutoHeightDuration:X,create:(e=["all"],r={})=>{const{duration:o=n.standard,easing:a=t.easeInOut,delay:i=0}=r;(0,u.A)(r,Q);return(Array.isArray(e)?e:[e]).map((e=>`${e} ${"string"==typeof o?o:V(o)} ${a} ${"string"==typeof i?i:V(i)}`)).join(",")}},e,{easing:t,duration:n})}const Z={mobileStepper:1e3,fab:1050,speedDial:1050,appBar:1100,drawer:1200,modal:1300,snackbar:1400,tooltip:1500},J=["breakpoints","mixins","spacing","palette","transitions","typography","shape"];function ee(e={},...t){const{mixins:n={},palette:r={},transitions:o={},typography:a={}}=e,i=(0,u.A)(e,J);if(e.vars&&void 0===e.generateCssVars)throw new Error((0,C.A)(18));const s=F(r),l=(0,g.A)(e);let d=(0,E.A)(l,{mixins:(p=l.breakpoints,h=n,(0,c.A)({toolbar:{minHeight:56,[p.up("xs")]:{"@media (orientation: landscape)":{minHeight:48}},[p.up("sm")]:{minHeight:64}}},h)),palette:s,shadows:U.slice(),typography:W(s,a),transitions:Y(o),zIndex:(0,c.A)({},Z)});var p,h;return d=(0,E.A)(d,i),d=t.reduce(((e,t)=>(0,E.A)(e,t)),d),d.unstable_sxConfig=(0,c.A)({},A.A,null==i?void 0:i.unstable_sxConfig),d.unstable_sx=function(e){return(0,f.A)({sx:e,theme:this})},d}const te=ee,ne="$$material",re={active:"active",checked:"checked",completed:"completed",disabled:"disabled",error:"error",expanded:"expanded",focused:"focused",focusVisible:"focusVisible",open:"open",readOnly:"readOnly",required:"required",selected:"selected"};function oe(e,t,n="Mui"){const r=re[t];return r?`${n}-${r}`:`${w.generate(e)}-${t}`}function ae(e,t,n="Mui"){const r={};return t.forEach((t=>{r[t]=oe(e,t,n)})),r}const ie=ae("MuiBox",["root"]),se=te(),le=function(e={}){const{themeId:t,defaultTheme:n,defaultClassName:o="MuiBox-root",generateClassName:i}=e,s=(0,h.default)("div",{shouldForwardProp:e=>"theme"!==e&&"sx"!==e&&"as"!==e})(f.A);return a.forwardRef((function(e,a){const l=v(n),d=(0,m.A)(e),{className:h,component:f="div"}=d,g=(0,u.A)(d,k);return(0,r.jsx)(s,(0,c.A)({as:f,ref:a,className:p(h,i?i(o):o),theme:t&&l[t]||l},g))}))}({themeId:ne,defaultTheme:se,defaultClassName:ie.root,generateClassName:w.generate}),ce=le;function ue(e,t,n=void 0){const r={};return Object.keys(e).forEach((o=>{r[o]=e[o].reduce(((e,r)=>{if(r){const o=t(r);""!==o&&e.push(o),n&&n[r]&&e.push(n[r])}return e}),[]).join(" ")})),r}const de=function(e){return"string"==typeof e};function pe(...e){return a.useMemo((()=>e.every((e=>null==e))?null:t=>{e.forEach((e=>{!function(e,t){"function"==typeof e?e(t):e&&(e.current=t)}(e,t)}))}),e)}function he(e){const t=function(e){return e&&e.ownerDocument||document}(e);return t.defaultView||window}const fe="undefined"!=typeof window?a.useLayoutEffect:a.useEffect;const me=function(e){const t=a.useRef(e);return fe((()=>{t.current=e})),a.useRef(((...e)=>(0,t.current)(...e))).current};const ge=["onChange","maxRows","minRows","style","value"];function ye(e){return parseInt(e,10)||0}const be={visibility:"hidden",position:"absolute",overflow:"hidden",height:0,top:0,left:0,transform:"translateZ(0)"};function ve(e){return function(e){for(const t in e)return!1;return!0}(e)||0===e.outerHeightStyle&&!e.overflowing}const ke=a.forwardRef((function(e,t){const{onChange:n,maxRows:o,minRows:i=1,style:s,value:l}=e,d=(0,u.A)(e,ge),{current:p}=a.useRef(null!=l),h=a.useRef(null),f=pe(t,h),m=a.useRef(null),g=a.useRef(null),y=a.useCallback((()=>{const t=h.current,n=g.current;if(!t||!n)return;const r=he(t).getComputedStyle(t);if("0px"===r.width)return{outerHeightStyle:0,overflowing:!1};n.style.width=r.width,n.value=t.value||e.placeholder||"x","\n"===n.value.slice(-1)&&(n.value+=" ");const a=r.boxSizing,s=ye(r.paddingBottom)+ye(r.paddingTop),l=ye(r.borderBottomWidth)+ye(r.borderTopWidth),c=n.scrollHeight;n.value="x";const u=n.scrollHeight;let d=c;i&&(d=Math.max(Number(i)*u,d)),o&&(d=Math.min(Number(o)*u,d)),d=Math.max(d,u);return{outerHeightStyle:d+("border-box"===a?s+l:0),overflowing:Math.abs(d-c)<=1}}),[o,i,e.placeholder]),b=me((()=>{const e=h.current,t=y();if(!e||!t||ve(t))return!1;const n=t.outerHeightStyle;return null!=m.current&&m.current!==n})),v=a.useCallback((()=>{const e=h.current,t=y();if(!e||!t||ve(t))return;const n=t.outerHeightStyle;m.current!==n&&(m.current=n,e.style.height=`${n}px`),e.style.overflow=t.overflowing?"hidden":""}),[y]),k=a.useRef(-1);fe((()=>{const e=function(e,t=166){let n;function r(...r){clearTimeout(n),n=setTimeout((()=>{e.apply(this,r)}),t)}return r.clear=()=>{clearTimeout(n)},r}(v),t=null==h?void 0:h.current;if(!t)return;const n=he(t);let r;return n.addEventListener("resize",e),"undefined"!=typeof ResizeObserver&&(r=new ResizeObserver((()=>{b()&&(r.unobserve(t),cancelAnimationFrame(k.current),v(),k.current=requestAnimationFrame((()=>{r.observe(t)})))})),r.observe(t)),()=>{e.clear(),cancelAnimationFrame(k.current),n.removeEventListener("resize",e),r&&r.disconnect()}}),[y,v,b]),fe((()=>{v()}));return(0,r.jsxs)(a.Fragment,{children:[(0,r.jsx)("textarea",(0,c.A)({value:l,onChange:e=>{p||v(),n&&n(e)},ref:f,rows:i,style:s},d)),(0,r.jsx)("textarea",{"aria-hidden":!0,className:e.className,readOnly:!0,ref:g,tabIndex:-1,style:(0,c.A)({},be,s,{paddingTop:0,paddingBottom:0})})]})}));const xe=a.createContext(void 0);var we=n(4598);const Ce=te();const Ee=function(e){return"ownerState"!==e&&"theme"!==e&&"sx"!==e&&"as"!==e},Ae=e=>Ee(e)&&"classes"!==e,Se=(0,we.Ay)({themeId:ne,defaultTheme:Ce,rootShouldForwardProp:Ae});function Oe(e,t){const n=(0,c.A)({},t);return Object.keys(e).forEach((r=>{if(r.toString().match(/^(components|slots)$/))n[r]=(0,c.A)({},e[r],n[r]);else if(r.toString().match(/^(componentsProps|slotProps)$/)){const o=e[r]||{},a=t[r];n[r]={},a&&Object.keys(a)?o&&Object.keys(o)?(n[r]=(0,c.A)({},a),Object.keys(o).forEach((e=>{n[r][e]=Oe(o[e],a[e])}))):n[r]=a:n[r]=o}else void 0===n[r]&&(n[r]=e[r])})),n}const Me=a.createContext(void 0);function Re({props:e,name:t}){return function(e){const{theme:t,name:n,props:r}=e;if(!t||!t.components||!t.components[n])return r;const o=t.components[n];return o.defaultProps?Oe(o.defaultProps,r):o.styleOverrides||o.variants?r:Oe(o,r)}({props:e,name:t,theme:{components:a.useContext(Me)}})}const _e=function({value:e,children:t}){return(0,r.jsx)(Me.Provider,{value:e,children:t})};function $e(e){return Re(e)}const Ne=n(570).A,ze=pe,Te=fe;var Pe=n(4342);function je(e){const t=(0,h.internal_serializeStyles)(e);return e!==t&&t.styles?(t.styles.match(/^@layer\s+[^{]*$/)||(t.styles=`@layer global{${t.styles}}`),t):e}const Ie=function({styles:e,themeId:t,defaultTheme:n={}}){const o=v(n),a=t&&o[t]||o;let i="function"==typeof e?e(a):e;return a.modularCssLayers&&(i=Array.isArray(i)?i.map((e=>je("function"==typeof e?e(a):e))):je(i)),(0,r.jsx)(Pe.A,{styles:i})};const Le=function(e){return(0,r.jsx)(Ie,(0,c.A)({},e,{defaultTheme:Ce,themeId:ne}))};function Fe(e){return null!=e&&!(Array.isArray(e)&&0===e.length)}function qe(e){return oe("MuiInputBase",e)}const De=ae("MuiInputBase",["root","formControl","focused","disabled","adornedStart","adornedEnd","error","sizeSmall","multiline","colorSecondary","fullWidth","hiddenLabel","readOnly","input","inputSizeSmall","inputMultiline","inputTypeSearch","inputAdornedStart","inputAdornedEnd","inputHiddenLabel"]),Be=["aria-describedby","autoComplete","autoFocus","className","color","components","componentsProps","defaultValue","disabled","disableInjectingGlobalStyles","endAdornment","error","fullWidth","id","inputComponent","inputProps","inputRef","margin","maxRows","minRows","multiline","name","onBlur","onChange","onClick","onFocus","onKeyDown","onKeyUp","placeholder","readOnly","renderSuffix","rows","size","slotProps","slots","startAdornment","type","value"],We=Se("div",{name:"MuiInputBase",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:n}=e;return[t.root,n.formControl&&t.formControl,n.startAdornment&&t.adornedStart,n.endAdornment&&t.adornedEnd,n.error&&t.error,"small"===n.size&&t.sizeSmall,n.multiline&&t.multiline,n.color&&t[`color${Ne(n.color)}`],n.fullWidth&&t.fullWidth,n.hiddenLabel&&t.hiddenLabel]}})((({theme:e,ownerState:t})=>(0,c.A)({},e.typography.body1,{color:(e.vars||e).palette.text.primary,lineHeight:"1.4375em",boxSizing:"border-box",position:"relative",cursor:"text",display:"inline-flex",alignItems:"center",[`&.${De.disabled}`]:{color:(e.vars||e).palette.text.disabled,cursor:"default"}},t.multiline&&(0,c.A)({padding:"4px 0 5px"},"small"===t.size&&{paddingTop:1}),t.fullWidth&&{width:"100%"}))),He=Se("input",{name:"MuiInputBase",slot:"Input",overridesResolver:(e,t)=>{const{ownerState:n}=e;return[t.input,"small"===n.size&&t.inputSizeSmall,n.multiline&&t.inputMultiline,"search"===n.type&&t.inputTypeSearch,n.startAdornment&&t.inputAdornedStart,n.endAdornment&&t.inputAdornedEnd,n.hiddenLabel&&t.inputHiddenLabel]}})((({theme:e,ownerState:t})=>{const n="light"===e.palette.mode,r=(0,c.A)({color:"currentColor"},e.vars?{opacity:e.vars.opacity.inputPlaceholder}:{opacity:n?.42:.5},{transition:e.transitions.create("opacity",{duration:e.transitions.duration.shorter})}),o={opacity:"0 !important"},a=e.vars?{opacity:e.vars.opacity.inputPlaceholder}:{opacity:n?.42:.5};return(0,c.A)({font:"inherit",letterSpacing:"inherit",color:"currentColor",padding:"4px 0 5px",border:0,boxSizing:"content-box",background:"none",height:"1.4375em",margin:0,WebkitTapHighlightColor:"transparent",display:"block",minWidth:0,width:"100%",animationName:"mui-auto-fill-cancel",animationDuration:"10ms","&::-webkit-input-placeholder":r,"&::-moz-placeholder":r,"&:-ms-input-placeholder":r,"&::-ms-input-placeholder":r,"&:focus":{outline:0},"&:invalid":{boxShadow:"none"},"&::-webkit-search-decoration":{WebkitAppearance:"none"},[`label[data-shrink=false] + .${De.formControl} &`]:{"&::-webkit-input-placeholder":o,"&::-moz-placeholder":o,"&:-ms-input-placeholder":o,"&::-ms-input-placeholder":o,"&:focus::-webkit-input-placeholder":a,"&:focus::-moz-placeholder":a,"&:focus:-ms-input-placeholder":a,"&:focus::-ms-input-placeholder":a},[`&.${De.disabled}`]:{opacity:1,WebkitTextFillColor:(e.vars||e).palette.text.disabled},"&:-webkit-autofill":{animationDuration:"5000s",animationName:"mui-auto-fill"}},"small"===t.size&&{paddingTop:1},t.multiline&&{height:"auto",resize:"none",padding:0,paddingTop:0},"search"===t.type&&{MozAppearance:"textfield"})})),Ue=(0,r.jsx)(Le,{styles:{"@keyframes mui-auto-fill":{from:{display:"block"}},"@keyframes mui-auto-fill-cancel":{from:{display:"block"}}}}),Qe=a.forwardRef((function(e,t){var n;const o=$e({props:e,name:"MuiInputBase"}),{"aria-describedby":i,autoComplete:s,autoFocus:l,className:d,components:h={},componentsProps:f={},defaultValue:m,disabled:g,disableInjectingGlobalStyles:y,endAdornment:b,fullWidth:v=!1,id:k,inputComponent:x="input",inputProps:w={},inputRef:E,maxRows:A,minRows:S,multiline:O=!1,name:M,onBlur:R,onChange:_,onClick:$,onFocus:N,onKeyDown:z,onKeyUp:T,placeholder:P,readOnly:j,renderSuffix:I,rows:L,slotProps:F={},slots:q={},startAdornment:D,type:B="text",value:W}=o,H=(0,u.A)(o,Be),U=null!=w.value?w.value:W,{current:Q}=a.useRef(null!=U),K=a.useRef(),G=a.useCallback((e=>{0}),[]),V=ze(K,E,w.ref,G),[X,Y]=a.useState(!1),Z=a.useContext(xe);const J=function({props:e,states:t,muiFormControl:n}){return t.reduce(((t,r)=>(t[r]=e[r],n&&void 0===e[r]&&(t[r]=n[r]),t)),{})}({props:o,muiFormControl:Z,states:["color","disabled","error","hiddenLabel","size","required","filled"]});J.focused=Z?Z.focused:X,a.useEffect((()=>{!Z&&g&&X&&(Y(!1),R&&R())}),[Z,g,X,R]);const ee=Z&&Z.onFilled,te=Z&&Z.onEmpty,ne=a.useCallback((e=>{!function(e,t=!1){return e&&(Fe(e.value)&&""!==e.value||t&&Fe(e.defaultValue)&&""!==e.defaultValue)}(e)?te&&te():ee&&ee()}),[ee,te]);Te((()=>{Q&&ne({value:U})}),[U,ne,Q]);a.useEffect((()=>{ne(K.current)}),[]);let re=x,oe=w;O&&"input"===re&&(oe=L?(0,c.A)({type:void 0,minRows:L,maxRows:L},oe):(0,c.A)({type:void 0,maxRows:A,minRows:S},oe),re=ke);a.useEffect((()=>{Z&&Z.setAdornedStart(Boolean(D))}),[Z,D]);const ae=(0,c.A)({},o,{color:J.color||"primary",disabled:J.disabled,endAdornment:b,error:J.error,focused:J.focused,formControl:Z,fullWidth:v,hiddenLabel:J.hiddenLabel,multiline:O,size:J.size,startAdornment:D,type:B}),ie=(e=>{const{classes:t,color:n,disabled:r,error:o,endAdornment:a,focused:i,formControl:s,fullWidth:l,hiddenLabel:c,multiline:u,readOnly:d,size:p,startAdornment:h,type:f}=e;return ue({root:["root",`color${Ne(n)}`,r&&"disabled",o&&"error",l&&"fullWidth",i&&"focused",s&&"formControl",p&&"medium"!==p&&`size${Ne(p)}`,u&&"multiline",h&&"adornedStart",a&&"adornedEnd",c&&"hiddenLabel",d&&"readOnly"],input:["input",r&&"disabled","search"===f&&"inputTypeSearch",u&&"inputMultiline","small"===p&&"inputSizeSmall",c&&"inputHiddenLabel",h&&"inputAdornedStart",a&&"inputAdornedEnd",d&&"readOnly"]},qe,t)})(ae),se=q.root||h.Root||We,le=F.root||f.root||{},ce=q.input||h.Input||He;return oe=(0,c.A)({},oe,null!=(n=F.input)?n:f.input),(0,r.jsxs)(a.Fragment,{children:[!y&&Ue,(0,r.jsxs)(se,(0,c.A)({},le,!de(se)&&{ownerState:(0,c.A)({},ae,le.ownerState)},{ref:t,onClick:e=>{K.current&&e.currentTarget===e.target&&K.current.focus(),$&&$(e)}},H,{className:p(ie.root,le.className,d,j&&"MuiInputBase-readOnly"),children:[D,(0,r.jsx)(xe.Provider,{value:null,children:(0,r.jsx)(ce,(0,c.A)({ownerState:ae,"aria-invalid":J.error,"aria-describedby":i,autoComplete:s,autoFocus:l,defaultValue:m,disabled:J.disabled,id:k,onAnimationStart:e=>{ne("mui-auto-fill-cancel"===e.animationName?K.current:{value:"x"})},name:M,placeholder:P,readOnly:j,required:J.required,rows:L,value:U,onKeyDown:z,onKeyUp:T,type:B},oe,!de(ce)&&{as:re,ownerState:(0,c.A)({},ae,oe.ownerState)},{ref:V,className:p(ie.input,oe.className,j&&"MuiInputBase-readOnly"),onBlur:e=>{R&&R(e),w.onBlur&&w.onBlur(e),Z&&Z.onBlur?Z.onBlur(e):Y(!1)},onChange:(e,...t)=>{if(!Q){const t=e.target||K.current;if(null==t)throw new Error((0,C.A)(1));ne({value:t.value})}w.onChange&&w.onChange(e,...t),_&&_(e,...t)},onFocus:e=>{J.disabled?e.stopPropagation():(N&&N(e),w.onFocus&&w.onFocus(e),Z&&Z.onFocus?Z.onFocus(e):Y(!0))}}))}),b,I?I((0,c.A)({},J,{startAdornment:D})):null]}))]})}));const Ke=function(e){const{children:t,defer:n=!1,fallback:o=null}=e,[i,s]=a.useState(!1);return fe((()=>{n||s(!0)}),[n]),a.useEffect((()=>{n&&s(!0)}),[n]),(0,r.jsx)(a.Fragment,{children:i?t:o})};function Ge(e){return oe("MuiSvgIcon",e)}ae("MuiSvgIcon",["root","colorPrimary","colorSecondary","colorAction","colorError","colorDisabled","fontSizeInherit","fontSizeSmall","fontSizeMedium","fontSizeLarge"]);const Ve=["children","className","color","component","fontSize","htmlColor","inheritViewBox","titleAccess","viewBox"],Xe=Se("svg",{name:"MuiSvgIcon",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:n}=e;return[t.root,"inherit"!==n.color&&t[`color${Ne(n.color)}`],t[`fontSize${Ne(n.fontSize)}`]]}})((({theme:e,ownerState:t})=>{var n,r,o,a,i,s,l,c,u,d,p,h,f;return{userSelect:"none",width:"1em",height:"1em",display:"inline-block",fill:t.hasSvgAsChild?void 0:"currentColor",flexShrink:0,transition:null==(n=e.transitions)||null==(r=n.create)?void 0:r.call(n,"fill",{duration:null==(o=e.transitions)||null==(o=o.duration)?void 0:o.shorter}),fontSize:{inherit:"inherit",small:(null==(a=e.typography)||null==(i=a.pxToRem)?void 0:i.call(a,20))||"1.25rem",medium:(null==(s=e.typography)||null==(l=s.pxToRem)?void 0:l.call(s,24))||"1.5rem",large:(null==(c=e.typography)||null==(u=c.pxToRem)?void 0:u.call(c,35))||"2.1875rem"}[t.fontSize],color:null!=(d=null==(p=(e.vars||e).palette)||null==(p=p[t.color])?void 0:p.main)?d:{action:null==(h=(e.vars||e).palette)||null==(h=h.action)?void 0:h.active,disabled:null==(f=(e.vars||e).palette)||null==(f=f.action)?void 0:f.disabled,inherit:void 0}[t.color]}})),Ye=a.forwardRef((function(e,t){const n=$e({props:e,name:"MuiSvgIcon"}),{children:o,className:i,color:s="inherit",component:l="svg",fontSize:d="medium",htmlColor:h,inheritViewBox:f=!1,titleAccess:m,viewBox:g="0 0 24 24"}=n,y=(0,u.A)(n,Ve),b=a.isValidElement(o)&&"svg"===o.type,v=(0,c.A)({},n,{color:s,component:l,fontSize:d,instanceFontSize:e.fontSize,inheritViewBox:f,viewBox:g,hasSvgAsChild:b}),k={};f||(k.viewBox=g);const x=(e=>{const{color:t,fontSize:n,classes:r}=e;return ue({root:["root","inherit"!==t&&`color${Ne(t)}`,`fontSize${Ne(n)}`]},Ge,r)})(v);return(0,r.jsxs)(Xe,(0,c.A)({as:l,className:p(x.root,i),focusable:"false",color:h,"aria-hidden":!m||void 0,role:m?"img":void 0,ref:t},k,y,b&&o.props,{ownerState:v,children:[b?o.props.children:o,m?(0,r.jsx)("title",{children:m}):null]}))}));Ye.muiName="SvgIcon";const Ze=Ye,Je=e=>{let t;return t=e<1?5.11916*e**2:4.5*Math.log(e+1)+2,(t/100).toFixed(2)};function et(e){return oe("MuiPaper",e)}ae("MuiPaper",["root","rounded","outlined","elevation","elevation0","elevation1","elevation2","elevation3","elevation4","elevation5","elevation6","elevation7","elevation8","elevation9","elevation10","elevation11","elevation12","elevation13","elevation14","elevation15","elevation16","elevation17","elevation18","elevation19","elevation20","elevation21","elevation22","elevation23","elevation24"]);const tt=["className","component","elevation","square","variant"],nt=Se("div",{name:"MuiPaper",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:n}=e;return[t.root,t[n.variant],!n.square&&t.rounded,"elevation"===n.variant&&t[`elevation${n.elevation}`]]}})((({theme:e,ownerState:t})=>{var n;return(0,c.A)({backgroundColor:(e.vars||e).palette.background.paper,color:(e.vars||e).palette.text.primary,transition:e.transitions.create("box-shadow")},!t.square&&{borderRadius:e.shape.borderRadius},"outlined"===t.variant&&{border:`1px solid ${(e.vars||e).palette.divider}`},"elevation"===t.variant&&(0,c.A)({boxShadow:(e.vars||e).shadows[t.elevation]},!e.vars&&"dark"===e.palette.mode&&{backgroundImage:`linear-gradient(${(0,S.X4)("#fff",Je(t.elevation))}, ${(0,S.X4)("#fff",Je(t.elevation))})`},e.vars&&{backgroundImage:null==(n=e.vars.overlays)?void 0:n[t.elevation]}))})),rt=a.forwardRef((function(e,t){const n=$e({props:e,name:"MuiPaper"}),{className:o,component:a="div",elevation:i=1,square:s=!1,variant:l="elevation"}=n,d=(0,u.A)(n,tt),h=(0,c.A)({},n,{component:a,elevation:i,square:s,variant:l}),f=(e=>{const{square:t,elevation:n,variant:r,classes:o}=e;return ue({root:["root",r,!t&&"rounded","elevation"===r&&`elevation${n}`]},et,o)})(h);return(0,r.jsx)(nt,(0,c.A)({as:a,ownerState:h,className:p(f.root,o),ref:t},d))}));const ot=a.createContext(null);function at(){return a.useContext(ot)}const it="function"==typeof Symbol&&Symbol.for?Symbol.for("mui.nested"):"__THEME_NESTED__";const st=function(e){const{children:t,theme:n}=e,o=at(),i=a.useMemo((()=>{const e=null===o?n:function(e,t){if("function"==typeof t)return t(e);return(0,c.A)({},e,t)}(o,n);return null!=e&&(e[it]=null!==o),e}),[n,o]);return(0,r.jsx)(ot.Provider,{value:i,children:t})};const lt=["value"],ct=a.createContext();const ut=function(e){let{value:t}=e,n=(0,u.A)(e,lt);return(0,r.jsx)(ct.Provider,(0,c.A)({value:null==t||t},n))};let dt=0;const pt=a["useId".toString()];function ht(e){if(void 0!==pt){const t=pt();return null!=e?e:t}return function(e){const[t,n]=a.useState(e),r=e||t;return a.useEffect((()=>{null==t&&(dt+=1,n(`mui-${dt}`))}),[t]),r}(e)}const ft={};function mt(e,t,n,r=!1){return a.useMemo((()=>{const o=e&&t[e]||t;if("function"==typeof n){const a=n(o),i=e?(0,c.A)({},t,{[e]:a}):a;return r?()=>i:i}return e?(0,c.A)({},t,{[e]:n}):(0,c.A)({},t,n)}),[e,t,n,r])}const gt=function(e){const{children:t,theme:n,themeId:a}=e,i=y(ft),s=at()||ft,l=mt(a,i,n),c=mt(a,s,n,!0),u="rtl"===l.direction,d=function(e){const t=y(),n=ht()||"",{modularCssLayers:o}=e;let a="mui.global, mui.components, mui.theme, mui.custom, mui.sx";return a=o&&null===t?"string"==typeof o?o.replace(/mui(?!\.)/g,a):`@layer ${a};`:"",fe((()=>{const e=document.querySelector("head");if(!e)return;const t=e.firstChild;if(a){var r;if(t&&null!=(r=t.hasAttribute)&&r.call(t,"data-mui-layer-order")&&t.getAttribute("data-mui-layer-order")===n)return;const o=document.createElement("style");o.setAttribute("data-mui-layer-order",n),o.textContent=a,e.prepend(o)}else{var o;null==(o=e.querySelector(`style[data-mui-layer-order="${n}"]`))||o.remove()}}),[a,n]),a?(0,r.jsx)(Ie,{styles:a}):null}(l);return(0,r.jsx)(st,{theme:c,children:(0,r.jsx)(o.T.Provider,{value:l,children:(0,r.jsx)(ut,{value:u,children:(0,r.jsxs)(_e,{value:null==l?void 0:l.components,children:[d,t]})})})})},yt=["theme"];function bt(e){let{theme:t}=e,n=(0,u.A)(e,yt);const o=t[ne];let a=o||t;return"function"!=typeof t&&(o&&!o.vars?a=(0,c.A)({},o,{vars:null}):t&&!t.vars&&(a=(0,c.A)({},t,{vars:null}))),(0,r.jsx)(gt,(0,c.A)({},n,{themeId:o?ne:void 0,theme:a}))}const vt=e=>{let t;const n=new Set,r=(e,r)=>{const o="function"==typeof e?e(t):e;if(!Object.is(o,t)){const e=t;t=(null!=r?r:"object"!=typeof o||null===o)?o:Object.assign({},t,o),n.forEach((n=>n(t,e)))}},o=()=>t,a={setState:r,getState:o,getInitialState:()=>i,subscribe:e=>(n.add(e),()=>n.delete(e)),destroy:()=>{console.warn("[DEPRECATED] The `destroy` method will be unsupported in a future version. Instead use unsubscribe function returned by subscribe. Everything will be garbage-collected if store is garbage-collected."),n.clear()}},i=t=e(r,o,a);return a},kt=e=>e?vt(e):vt;var xt=n(6007);const{useDebugValue:wt}=a,{useSyncExternalStoreWithSelector:Ct}=xt;let Et=!1;const At=e=>e;function St(e,t=At,n){n&&!Et&&(console.warn("[DEPRECATED] Use `createWithEqualityFn` instead of `create` or use `useStoreWithEqualityFn` instead of `useStore`. They can be imported from 'zustand/traditional'. https://github.com/pmndrs/zustand/discussions/1937"),Et=!0);const r=Ct(e.subscribe,e.getState,e.getServerState||e.getInitialState,t,n);return wt(r),r}const Ot=e=>{"function"!=typeof e&&console.warn("[DEPRECATED] Passing a vanilla store will be unsupported in a future version. Instead use `import { useStore } from 'zustand'`.");const t="function"==typeof e?kt(e):e,n=(e,n)=>St(t,e,n);return Object.assign(n,t),n},Mt=e=>e?Ot(e):Ot;var Rt=n(3042);function _t(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function $t(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{},r=Object.keys(n);"function"==typeof Object.getOwnPropertySymbols&&(r=r.concat(Object.getOwnPropertySymbols(n).filter((function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable})))),r.forEach((function(t){_t(e,t,n[t])}))}return e}function Nt(e,t){return t=null!=t?t:{},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):function(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))})),e}function zt(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function Tt(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}function Pt(e,t){if(e){if("string"==typeof e)return zt(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(n):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?zt(e,t):void 0}}function jt(e){return function(e){if(Array.isArray(e))return zt(e)}(e)||Tt(e)||Pt(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function It(e){var t,n,r="";if("string"==typeof e||"number"==typeof e)r+=e;else if("object"==typeof e)if(Array.isArray(e))for(t=0;t<e.length;t++)e[t]&&(n=It(e[t]))&&(r&&(r+=" "),r+=n);else for(t in e)e[t]&&(r&&(r+=" "),r+=t);return r}function Lt(){for(var e,t,n=0,r="";n<arguments.length;)(e=arguments[n++])&&(t=It(e))&&(r&&(r+=" "),r+=t);return r}function Ft(e){if(Array.isArray(e))return e}function qt(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function Dt(e,t){return Ft(e)||function(e,t){var n=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var r,o,a=[],i=!0,s=!1;try{for(n=n.call(e);!(i=(r=n.next()).done)&&(a.push(r.value),!t||a.length!==t);i=!0);}catch(e){s=!0,o=e}finally{try{i||null==n.return||n.return()}finally{if(s)throw o}}return a}}(e,t)||Pt(e,t)||qt()}function Bt(e){return e&&"undefined"!=typeof Symbol&&e.constructor===Symbol?"symbol":typeof e}var Wt={scheme:"Light Theme",author:"mac gainor (https://github.com/mac-s-g)",base00:"rgba(0, 0, 0, 0)",base01:"rgb(245, 245, 245)",base02:"rgb(235, 235, 235)",base03:"#93a1a1",base04:"rgba(0, 0, 0, 0.3)",base05:"#586e75",base06:"#073642",base07:"#002b36",base08:"#d33682",base09:"#cb4b16",base0A:"#ffd500",base0B:"#859900",base0C:"#6c71c4",base0D:"#586e75",base0E:"#2aa198",base0F:"#268bd2"},Ht={scheme:"Dark Theme",author:"Chris Kempson (http://chriskempson.com)",base00:"#181818",base01:"#282828",base02:"#383838",base03:"#585858",base04:"#b8b8b8",base05:"#d8d8d8",base06:"#e8e8e8",base07:"#f8f8f8",base08:"#ab4642",base09:"#dc9656",base0A:"#f7ca88",base0B:"#a1b56c",base0C:"#86c1b9",base0D:"#7cafc2",base0E:"#ba8baf",base0F:"#a16946"},Ut=function(){return null};Ut.when=function(){return!1};var Qt=(0,a.createContext)(void 0);Qt.Provider;var Kt=function(e,t){return St((0,a.useContext)(Qt),e,t)},Gt=function(){return Kt((function(e){return e.colorspace.base07}))};function Vt(e,t,n,r,o,a,i){try{var s=e[a](i),l=s.value}catch(e){return void n(e)}s.done?t(l):Promise.resolve(l).then(r,o)}function Xt(e){return function(){var t=this,n=arguments;return new Promise((function(r,o){var a=e.apply(t,n);function i(e){Vt(a,r,o,i,s,"next",e)}function s(e){Vt(a,r,o,i,s,"throw",e)}i(void 0)}))}}function Yt(e,t){var n,r,o,a,i={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return a={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(a[Symbol.iterator]=function(){return this}),a;function s(s){return function(l){return function(s){if(n)throw new TypeError("Generator is already executing.");for(;a&&(a=0,s[0]&&(i=0)),i;)try{if(n=1,r&&(o=2&s[0]?r.return:s[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,s[1])).done)return o;switch(r=0,o&&(s=[2&s[0],o.value]),s[0]){case 0:case 1:o=s;break;case 4:return i.label++,{value:s[1],done:!1};case 5:i.label++,r=s[1],s=[0];continue;case 7:s=i.ops.pop(),i.trys.pop();continue;default:if(!(o=i.trys,(o=o.length>0&&o[o.length-1])||6!==s[0]&&2!==s[0])){i=0;continue}if(3===s[0]&&(!o||s[1]>o[0]&&s[1]<o[3])){i.label=s[1];break}if(6===s[0]&&i.label<o[1]){i.label=o[1],o=s;break}if(o&&i.label<o[2]){i.label=o[2],i.ops.push(s);break}o[2]&&i.ops.pop(),i.trys.pop();continue}s=t.call(e,i)}catch(e){s=[6,e],r=0}finally{n=o=0}if(5&s[0])throw s[1];return{value:s[0]?s[1]:void 0,done:!0}}([s,l])}}}function Zt(e,t){return null!=t&&"undefined"!=typeof Symbol&&t[Symbol.hasInstance]?!!t[Symbol.hasInstance](e):e instanceof t}Object.prototype.constructor.toString();function Jt(e){return null===e?0:Array.isArray(e)?e.length:Zt(e,Map)||Zt(e,Set)?e.size:Zt(e,Date)?1:"object"==typeof e?Object.keys(e).length:"string"==typeof e?e.length:1}function en(e,t){for(var n=[],r=0;r<e.length;)n.push(e.slice(r,r+t)),r+=t;return n}function tn(e){return nn.apply(this,arguments)}function nn(){return(nn=Xt((function(e){return Yt(this,(function(t){switch(t.label){case 0:if(!("clipboard"in navigator))return[3,4];t.label=1;case 1:return t.trys.push([1,3,,4]),[4,navigator.clipboard.writeText(e)];case 2:case 3:return t.sent(),[3,4];case 4:return Rt(e),[2]}}))}))).apply(this,arguments)}function rn(){var e=(arguments.length>0&&void 0!==arguments[0]?arguments[0]:{}).timeout,t=void 0===e?2e3:e,n=Dt((0,a.useState)(!1),2),r=n[0],o=n[1],i=(0,a.useRef)(null),s=(0,a.useCallback)((function(e){var n=i.current;n&&window.clearTimeout(n),i.current=window.setTimeout((function(){return o(!1)}),t),o(e)}),[t]),l=Kt((function(e){return e.onCopy})),c=(0,a.useCallback)(function(){var e=Xt((function(e,t){var n,r,o;return Yt(this,(function(a){switch(a.label){case 0:if("function"!=typeof l)return[3,5];a.label=1;case 1:return a.trys.push([1,3,,4]),[4,l(e,t,tn)];case 2:return a.sent(),s(!0),[3,4];case 3:return n=a.sent(),console.error("error when copy ".concat(0===e.length?"src":"src[".concat(e.join(".")),"]"),n),[3,4];case 4:return[3,8];case 5:return a.trys.push([5,7,,8]),i="function"==typeof t?t.toString():t,c="  ",u=[],r=JSON.stringify(i,(function(e,t){if("bigint"===(void 0===t?"undefined":Bt(t)))return t.toString();if(Zt(t,Map)){if("toJSON"in t&&"function"==typeof t.toJSON)return t.toJSON();if(0===t.size)return{};if(u.includes(t))return"[Circular]";u.push(t);var n=Array.from(t.entries());return n.every((function(e){var t=Dt(e,1)[0];return"string"==typeof t||"number"==typeof t}))?Object.fromEntries(n):{}}if(Zt(t,Set))return"toJSON"in t&&"function"==typeof t.toJSON?t.toJSON():u.includes(t)?"[Circular]":(u.push(t),Array.from(t.values()));if("object"==typeof t&&null!==t&&Object.keys(t).length){var r=u.length;if(r){for(var o=r-1;o>=0&&u[o][e]!==t;--o)u.pop();if(u.includes(t))return"[Circular]"}u.push(t)}return t}),c),[4,tn(r)];case 6:return a.sent(),s(!0),[3,8];case 7:return o=a.sent(),console.error("error when copy ".concat(0===e.length?"src":"src[".concat(e.join(".")),"]"),o),[3,8];case 8:return[2]}var i,c,u}))}));return function(t,n){return e.apply(this,arguments)}}(),[s,l]);return{copy:c,reset:(0,a.useCallback)((function(){o(!1),i.current&&clearTimeout(i.current)}),[]),copied:r}}function on(e,t){var n=Kt((function(e){return e.value}));return(0,a.useMemo)((function(){return function(e,t,n){if(null===e||null===n)return!1;if("object"!=typeof e)return!1;if("object"!=typeof n)return!1;if(Object.is(e,n)&&0!==t.length)return"";for(var r=[],o=jt(t),a=e;a!==n||0!==o.length;){if("object"!=typeof a||null===a)return!1;if(Object.is(a,n))return r.reduce((function(e,t,n){return"number"==typeof t?e+"[".concat(t,"]"):e+"".concat(0===n?"":".").concat(t)}),"");var i=o.shift();r.push(i),a=a[i]}return!1}(n,e,t)}),[e,t,n])}var an=function(e){return s(ce,Nt($t({component:"div"},e),{sx:$t({display:"inline-block"},e.sx)}))},sn=function(e){var t=e.dataType,n=e.enable;return void 0===n||n?s(an,{className:"data-type-label",sx:{mx:.5,fontSize:"0.7rem",opacity:.8,userSelect:"none"},children:t}):null};function ln(e,t,n){var r=n.fromString,o=n.colorKey,i=n.displayTypeLabel,c=void 0===i||i,u=(0,a.memo)(t),d=function(t){var n=Kt((function(e){return e.displayDataTypes})),r=Kt((function(e){return e.colorspace[o]})),a=Kt((function(e){return e.onSelect}));return l(an,{onClick:function(){return null==a?void 0:a(t.path,t.value)},sx:{color:r},children:[c&&n&&s(sn,{dataType:e}),s(an,{className:"".concat(e,"-value"),children:s(u,{value:t.value})})]})};if(d.displayName="easy-".concat(e,"-type"),!r)return{Component:d};var p=function(e){var t=e.value,n=e.setValue,i=Kt((function(e){return e.colorspace[o]}));return s(Qe,{value:t,onChange:(0,a.useCallback)((function(e){var t=r(e.target.value);n(t)}),[n]),size:"small",multiline:!0,sx:{color:i,padding:.5,borderStyle:"solid",borderColor:"black",borderWidth:1,fontSize:"0.8rem",fontFamily:"monospace",display:"inline-flex"}})};return p.displayName="easy-".concat(e,"-type-editor"),{Component:d,Editor:p}}var cn=function(e){return l(Ke,{children:[s(sn,{dataType:"function"}),l(ce,{component:"span",className:"data-function-start",sx:{letterSpacing:.5},children:[(t=e.value,n=t.toString(),-1!==n.indexOf("function")?n.substring(8,n.indexOf("{")).trim():n.substring(0,n.indexOf("=>")+2).trim())," ","{"]})]});var t,n},un=function(){return s(Ke,{children:s(ce,{component:"span",className:"data-function-end",children:"}"})})},dn=function(e){var t,n,r,o,a,i=Kt((function(e){return e.colorspace.base05}));return s(Ke,{children:s(ce,{className:"data-function",sx:{display:e.inspect?"block":"inline-block",pl:e.inspect?2:0,color:i},children:e.inspect?(t=e.value,n=t.toString(),r=!0,o=n.indexOf(")"),a=n.indexOf("=>"),-1!==a&&a>o&&(r=!1),r?n.substring(n.indexOf("{",o)+1,n.lastIndexOf("}")):n.substring(n.indexOf("=>")+2)):s(ce,{component:"span",className:"data-function-body",onClick:function(){return e.setInspect(!0)},sx:{"&:hover":{cursor:"pointer"},padding:.5},children:"…"})})})};function pn(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var hn=function(e){var t=e.d,n=pn(e,["d"]);return s(Ze,Nt($t({},n),{children:s("path",{d:t})}))},fn=function(e){return s(hn,$t({d:"M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"},e))},mn=function(e){return s(hn,$t({d:"M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"},e))},gn=function(e){return s(hn,$t({d:"M 12 2 C 10.615 1.998 9.214625 2.2867656 7.890625 2.8847656 L 8.9003906 4.6328125 C 9.9043906 4.2098125 10.957 3.998 12 4 C 15.080783 4 17.738521 5.7633175 19.074219 8.3222656 L 17.125 9 L 21.25 11 L 22.875 7 L 20.998047 7.6523438 C 19.377701 4.3110398 15.95585 2 12 2 z M 6.5097656 4.4882812 L 2.2324219 5.0820312 L 3.734375 6.3808594 C 1.6515335 9.4550558 1.3615962 13.574578 3.3398438 17 C 4.0308437 18.201 4.9801562 19.268234 6.1601562 20.115234 L 7.1699219 18.367188 C 6.3019219 17.710187 5.5922656 16.904 5.0722656 16 C 3.5320014 13.332354 3.729203 10.148679 5.2773438 7.7128906 L 6.8398438 9.0625 L 6.5097656 4.4882812 z M 19.929688 13 C 19.794687 14.08 19.450734 15.098 18.927734 16 C 17.386985 18.668487 14.531361 20.090637 11.646484 19.966797 L 12.035156 17.9375 L 8.2402344 20.511719 L 10.892578 23.917969 L 11.265625 21.966797 C 14.968963 22.233766 18.681899 20.426323 20.660156 17 C 21.355156 15.801 21.805219 14.445 21.949219 13 L 19.929688 13 z"},e))},yn=function(e){return s(hn,$t({d:"M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"},e))},bn=function(e){return s(hn,$t({d:"M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"},e))},vn=function(e){return s(hn,$t({d:"M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"},e))},kn=function(e){return s(hn,$t({d:"M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6z"},e))};function xn(e){var t=Jt(e),n="";return(Zt(e,Map)||Zt(e,Set))&&(n=e[Symbol.toStringTag]),Object.prototype.hasOwnProperty.call(e,Symbol.toStringTag)&&(n=e[Symbol.toStringTag]),"".concat(t," Items").concat(n?" (".concat(n,")"):"")}var wn=(0,a.createContext)(void 0);wn.Provider;var Cn=function(e,t){return St((0,a.useContext)(wn),e,t)},En={is:function(e){return"object"==typeof e},Component:function(e){var t=Gt(),n=Kt((function(e){return e.colorspace.base02})),r=Kt((function(e){return e.groupArraysAfterLength})),o=on(e.path,e.value),i=Dt((0,a.useState)(Kt((function(e){return e.maxDisplayLength}))),2),c=i[0],u=i[1],d=Kt((function(e){return e.objectSortKeys})),p=(0,a.useMemo)((function(){if(!e.inspect)return null;var n=e.value,o=function(e){return"function"==typeof(null==e?void 0:e[Symbol.iterator])}(n);if(o&&!Array.isArray(n)){var a=[];if(Zt(n,Map))n.forEach((function(t,n){var r=n.toString(),o=jt(e.path).concat([r]);a.push(s(On,{path:o,value:t,prevValue:Zt(e.prevValue,Map)?e.prevValue.get(n):void 0,editable:!1},r))}));else for(var i=n[Symbol.iterator](),p=i.next(),h=0;!p.done;)a.push(s(On,{path:jt(e.path).concat(["iterator:".concat(h)]),value:p.value,nestedIndex:h,editable:!1},h)),h++,p=i.next();return a}if(Array.isArray(n)){if(n.length<=r){var f=n.slice(0,c).map((function(t,n){var r=jt(e.path).concat([n]);return s(On,{path:r,value:t,prevValue:Array.isArray(e.prevValue)?e.prevValue[n]:void 0},n)}));if(n.length>c){var m=n.length-c;f.push(l(an,{sx:{cursor:"pointer",lineHeight:1.5,color:t,letterSpacing:.5,opacity:.8,userSelect:"none"},onClick:function(){return u((function(e){return 2*e}))},children:["hidden ",m," items…"]},"last"))}return f}var g=en(n,r),y=Array.isArray(e.prevValue)?en(e.prevValue,r):void 0;return g.map((function(t,n){var r=jt(e.path);return s(On,{path:r,value:t,nestedIndex:n,prevValue:null==y?void 0:y[n]},n)}))}var b=Object.entries(n);d&&(b=!0===d?b.sort((function(e,t){var n=Dt(e,1)[0],r=Dt(t,1)[0];return n.localeCompare(r)})):b.sort((function(e,t){var n=Dt(e,1)[0],r=Dt(t,1)[0];return d(n,r)})));var v=b.slice(0,c).map((function(t){var n,r=Dt(t,2),o=r[0],a=r[1],i=jt(e.path).concat([o]);return s(On,{path:i,value:a,prevValue:null===(n=e.prevValue)||void 0===n?void 0:n[o]},o)}));if(b.length>c){var k=b.length-c;v.push(l(an,{sx:{cursor:"pointer",lineHeight:1.5,color:t,letterSpacing:.5,opacity:.8,userSelect:"none"},onClick:function(){return u((function(e){return 2*e}))},children:["hidden ",k," items…"]},"last"))}return v}),[e.inspect,e.value,e.prevValue,e.path,r,c,t,d]),h=e.inspect?.6:0,f=Kt((function(e){return e.indentWidth})),m=e.inspect?f-h:f;return(0,a.useMemo)((function(){return 0===Jt(e.value)}),[e.value])?null:s(ce,{className:"data-object",sx:{display:e.inspect?"block":"inline-block",pl:e.inspect?m-.6:0,marginLeft:h,color:t,borderLeft:e.inspect?"1px solid ".concat(n):"none"},children:e.inspect?p:!o&&s(ce,{component:"span",className:"data-object-body",onClick:function(){return e.setInspect(!0)},sx:{"&:hover":{cursor:"pointer"},padding:.5,userSelect:"none"},children:"…"})})},PreComponent:function(e){var t=Kt((function(e){return e.colorspace.base04})),n=Gt(),r=(0,a.useMemo)((function(){return Array.isArray(e.value)}),[e.value]),o=(0,a.useMemo)((function(){return 0===Jt(e.value)}),[e.value]),c=(0,a.useMemo)((function(){return xn(e.value)}),[e.value]),u=Kt((function(e){return e.displayObjectSize})),d=on(e.path,e.value);return l(ce,{component:"span",className:"data-object-start",sx:{letterSpacing:.5},children:[r?"[":"{",u&&e.inspect&&!o&&s(ce,{component:"span",sx:{pl:.5,fontStyle:"italic",color:t,userSelect:"none"},children:c}),d&&!e.inspect&&l(i,{children:[s(gn,{sx:{fontSize:12,color:n,mx:.5}}),d]})]})},PostComponent:function(e){var t=Kt((function(e){return e.colorspace.base04})),n=(0,a.useMemo)((function(){return Array.isArray(e.value)}),[e.value]),r=Kt((function(e){return e.displayObjectSize})),o=(0,a.useMemo)((function(){return 0===Jt(e.value)}),[e.value]),i=(0,a.useMemo)((function(){return xn(e.value)}),[e.value]);return l(ce,{component:"span",className:"data-object-end",children:[n?"]":"}",!r||!o&&e.inspect?null:s(ce,{component:"span",sx:{pl:.5,fontStyle:"italic",color:t,userSelect:"none"},children:i})]})}};function An(e,t){var n=Cn((function(e){return e.registry}));return(0,a.useMemo)((function(){return function(e,t,n){var r,o=!0,a=!1,i=void 0;try{for(var s,l=n[Symbol.iterator]();!(o=(s=l.next()).done);o=!0){var c=s.value;if(c.is(e,t)&&(r=c,"object"==typeof e))return c}}catch(e){a=!0,i=e}finally{try{o||null==l.return||l.return()}finally{if(a)throw i}}if(void 0===r){if("object"==typeof e)return En;throw new Error("this is not possible")}return r}(e,t,n)}),[e,t,n])}var Sn=function(e){return s(ce,Nt($t({component:"span"},e),{sx:$t({cursor:"pointer",paddingLeft:"0.7rem"},e.sx)}))},On=function(e){var t,n=e.value,r=e.prevValue,o=e.path,c=e.nestedIndex,u=null!==(t=e.editable)&&void 0!==t?t:void 0,d=Kt((function(e){return e.editable})),p=(0,a.useMemo)((function(){return!1!==d&&(!1!==u&&("function"==typeof d?!!d(o,n):d))}),[o,u,d,n]),h=Dt((0,a.useState)("function"==typeof n?function(){return n}:n),2),f=h[0],m=h[1],g=o.length,y=o[g-1],b=Kt((function(e){return e.hoverPath})),v=(0,a.useMemo)((function(){return b&&o.every((function(e,t){return e===b.path[t]&&c===b.nestedIndex}))}),[b,o,c]),k=Kt((function(e){return e.setHover})),x=Kt((function(e){return e.value})),w=Dt(function(e,t,n){var r=e.length,o=on(e,t),i=Kt((function(e){return e.getInspectCache})),s=Kt((function(e){return e.setInspectCache})),l=Kt((function(e){return e.defaultInspectDepth}));(0,a.useEffect)((function(){void 0===i(e,n)&&(void 0!==n?s(e,!1,n):s(e,!o&&r<l))}),[l,r,i,o,n,e,s]);var c=Dt((0,a.useState)((function(){var t=i(e,n);return void 0!==t?t:void 0===n&&!o&&r<l})),2),u=c[0],d=c[1];return[u,(0,a.useCallback)((function(t){d((function(r){var o="boolean"==typeof t?t:t(r);return s(e,o,n),o}))}),[n,e,s])]}(o,n,c),2),C=w[0],E=w[1],A=Dt((0,a.useState)(!1),2),S=A[0],O=A[1],M=Kt((function(e){return e.onChange})),R=Gt(),_=Kt((function(e){return e.colorspace.base0C})),$=Kt((function(e){return e.colorspace.base0A})),N=An(n,o),z=N.Component,T=N.PreComponent,P=N.PostComponent,j=N.Editor,I=Kt((function(e){return e.quotesOnKeys})),L=Kt((function(e){return e.rootName})),F=x===n,q=Number.isInteger(Number(y)),D=Kt((function(e){return e.enableClipboard})),B=rn(),W=B.copy,H=B.copied,U=Kt((function(e){return e.highlightUpdates})),Q=(0,a.useMemo)((function(){return!(!U||void 0===r)&&((void 0===n?"undefined":Bt(n))!==(void 0===r?"undefined":Bt(r))||("number"==typeof n?(!isNaN(n)||!isNaN(r))&&n!==r:Array.isArray(n)!==Array.isArray(r)||"object"!=typeof n&&"function"!=typeof n&&n!==r))}),[U,r,n]),K=(0,a.useRef)();(0,a.useEffect)((function(){K.current&&Q&&"animate"in K.current&&K.current.animate([{backgroundColor:$},{backgroundColor:""}],{duration:1e3,easing:"ease-in"})}),[$,Q,r,n]);var G=(0,a.useMemo)((function(){return l(i,S?{children:[s(Sn,{children:s(yn,{sx:{fontSize:".8rem"},onClick:function(){O(!1),m(n)}})}),s(Sn,{children:s(fn,{sx:{fontSize:".8rem"},onClick:function(){O(!1),M(o,n,f)}})})]}:{children:[D&&s(Sn,{onClick:function(e){e.preventDefault();try{W(o,n,tn)}catch(e){console.error(e)}},children:s(H?fn:bn,{sx:{fontSize:".8rem"}})}),j&&p&&s(Sn,{onClick:function(e){e.preventDefault(),O(!0),m(n)},children:s(vn,{sx:{fontSize:".8rem"}})})]})}),[j,H,W,p,S,D,M,o,f,n]),V=(0,a.useMemo)((function(){return 0===Jt(n)}),[n]),X=!V&&!(!T||!P),Y=Kt((function(e){return e.keyRenderer})),Z=(0,a.useMemo)((function(){return{path:o,inspect:C,setInspect:E,value:n,prevValue:r}}),[C,o,E,n,r]);return l(ce,{className:"data-key-pair","data-testid":"data-key-pair"+o.join("."),sx:{userSelect:"text"},onMouseEnter:(0,a.useCallback)((function(){return k(o,c)}),[k,o,c]),children:[l(an,{component:"span",className:"data-key",sx:{lineHeight:1.5,color:R,letterSpacing:.5,opacity:.8},onClick:(0,a.useCallback)((function(e){e.isDefaultPrevented()||V||E((function(e){return!e}))}),[V,E]),children:[X?s(C?kn:mn,{sx:{fontSize:".8rem","&:hover":{cursor:"pointer"}}}):null,s(ce,{ref:K,component:"span",children:F?!1!==L?I?l(i,{children:['"',L,'"']}):s(i,{children:L}):null:Y.when(Z)?s(Y,$t({},Z)):void 0===c&&(q?s(ce,{component:"span",style:{color:_},children:y}):I?l(i,{children:['"',y,'"']}):s(i,{children:y}))}),F?!1!==L&&s(an,{sx:{mr:.5},children:":"}):void 0===c&&s(an,{sx:{mr:.5},children:":"}),T&&s(T,$t({},Z)),v&&X&&C&&G]}),S&&p?j&&s(j,{value:f,setValue:m}):z?s(z,$t({},Z)):s(ce,{component:"span",className:"data-value-fallback",children:"fallback: ".concat(n)}),P&&s(P,$t({},Z)),v&&X&&!C&&G,v&&!X&&G]})},Mn="(prefers-color-scheme: dark)";function Rn(e,t){var n=(0,a.useContext)(Qt).setState;(0,a.useEffect)((function(){void 0!==t&&n(_t({},e,t))}),[e,t,n])}var _n=function(e){var t=(0,a.useContext)(Qt).setState;(0,a.useEffect)((function(){t((function(t){return{prevValue:t.value,value:e.value}}))}),[e.value,t]),Rn("editable",e.editable),Rn("indentWidth",e.indentWidth),Rn("onChange",e.onChange),Rn("groupArraysAfterLength",e.groupArraysAfterLength),Rn("keyRenderer",e.keyRenderer),Rn("maxDisplayLength",e.maxDisplayLength),Rn("enableClipboard",e.enableClipboard),Rn("highlightUpdates",e.highlightUpdates),Rn("rootName",e.rootName),Rn("displayDataTypes",e.displayDataTypes),Rn("displayObjectSize",e.displayObjectSize),Rn("onCopy",e.onCopy),Rn("onSelect",e.onSelect),(0,a.useEffect)((function(){"light"===e.theme?t({colorspace:Wt}):"dark"===e.theme?t({colorspace:Ht}):"object"==typeof e.theme&&t({colorspace:e.theme})}),[t,e.theme]);var n=(0,a.useMemo)((function(){return"object"==typeof e.theme?"json-viewer-theme-custom":"dark"===e.theme?"json-viewer-theme-dark":"json-viewer-theme-light"}),[e.theme]),r=(0,a.useRef)(!0),o=(0,a.useMemo)((function(){return function(){var e=function(e){function n(e,t){var n,r;return Object.is(e.value,t.value)&&e.inspect&&t.inspect&&(null===(n=e.path)||void 0===n?void 0:n.join("."))===(null===(r=t.path)||void 0===r?void 0:r.join("."))}e.Component=(0,a.memo)(e.Component,n),e.Editor&&(e.Editor=(0,a.memo)(e.Editor,(function(e,t){return Object.is(e.value,t.value)}))),e.PreComponent&&(e.PreComponent=(0,a.memo)(e.PreComponent,n)),e.PostComponent&&(e.PostComponent=(0,a.memo)(e.PostComponent,n)),t.push(e)},t=[];e($t({is:function(e){return"boolean"==typeof e}},ln("bool",(function(e){var t=e.value;return s(i,{children:t?"true":"false"})}),{colorKey:"base0E",fromString:function(e){return Boolean(e)}})));var n={weekday:"short",year:"numeric",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"};e($t({is:function(e){return Zt(e,Date)}},ln("date",(function(e){var t=e.value;return s(i,{children:t.toLocaleTimeString("en-us",n)})}),{colorKey:"base0D"}))),e($t({is:function(e){return null===e}},ln("null",(function(){var e=Kt((function(e){return e.colorspace.base02}));return s(ce,{sx:{fontSize:"0.8rem",backgroundColor:e,fontWeight:"bold",borderRadius:"3px",padding:"0.5px 2px"},children:"NULL"})}),{colorKey:"base08",displayTypeLabel:!1}))),e($t({is:function(e){return void 0===e}},ln("undefined",(function(){var e=Kt((function(e){return e.colorspace.base02}));return s(ce,{sx:{fontSize:"0.7rem",backgroundColor:e,borderRadius:"3px",padding:"0.5px 2px"},children:"undefined"})}),{colorKey:"base05",displayTypeLabel:!1}))),e($t({is:function(e){return"string"==typeof e}},ln("string",(function(e){var t=Dt((0,a.useState)(!1),2),n=t[0],r=t[1],o=Kt((function(e){return e.collapseStringsAfterLength})),i=n?e.value:e.value.slice(0,o),c=e.value.length>o;return l(ce,{component:"span",sx:{overflowWrap:"anywhere",cursor:c?"pointer":"inherit"},onClick:function(){c&&r((function(e){return!e}))},children:['"',i,c&&!n&&s(ce,{component:"span",sx:{padding:.5},children:"…"}),'"']})}),{colorKey:"base09",fromString:function(e){return e}}))),e({is:function(e){return"function"==typeof e},Component:dn,PreComponent:cn,PostComponent:un});var r=function(e){return e%1==0};return e($t({is:function(e){return"number"==typeof e&&isNaN(e)}},ln("NaN",(function(){var e=Kt((function(e){return e.colorspace.base02}));return s(ce,{sx:{backgroundColor:e,fontSize:"0.8rem",fontWeight:"bold",borderRadius:"3px"},children:"NaN"})}),{colorKey:"base08",displayTypeLabel:!1}))),e($t({is:function(e){return"number"==typeof e&&!r(e)}},ln("float",(function(e){var t=e.value;return s(i,{children:t})}),{colorKey:"base0B",fromString:function(e){return parseFloat(e)}}))),e($t({is:function(e){return"number"==typeof e&&r(e)}},ln("int",(function(e){var t=e.value;return s(i,{children:t})}),{colorKey:"base0F",fromString:function(e){return parseInt(e)}}))),e($t({is:function(e){return"bigint"===(void 0===e?"undefined":Bt(e))}},ln("bigint",(function(e){var t=e.value;return s(i,{children:"".concat(t,"n")})}),{colorKey:"base0F",fromString:function(e){return BigInt(e.replace(/\D/g,""))}}))),t}()}),[]),c=Cn((function(e){return e.registerTypes}));if(r.current){var u=e.valueTypes?jt(o).concat(jt(e.valueTypes)):jt(o);c(u),r.current=!1}(0,a.useEffect)((function(){var t=e.valueTypes?jt(o).concat(jt(e.valueTypes)):jt(o);c(t)}),[e.valueTypes,o,c]);var d=Kt((function(e){return e.value})),p=Kt((function(e){return e.prevValue})),h=Kt((function(e){return e.setHover})),f=(0,a.useCallback)((function(){return h(null)}),[h]);return s(rt,{elevation:0,className:Lt(n,e.className),style:e.style,sx:$t({fontFamily:"monospace",userSelect:"none",contentVisibility:"auto"},e.sx),onMouseLeave:f,children:s(On,{value:d,prevValue:p,path:(0,a.useMemo)((function(){return[]}),[])})})},$n=function(e){var t,n,r,o,i=(t=Dt((0,a.useState)(!1),2),n=t[0],r=t[1],(0,a.useEffect)((function(){var e=function(e){r(e.matches)};r(window.matchMedia(Mn).matches);var t=window.matchMedia(Mn);return t.addEventListener("change",e),function(){return t.removeEventListener("change",e)}}),[]),n),l=(0,a.useMemo)((function(){return"auto"===e.theme?i?"light":"dark":null!==(o=e.theme)&&void 0!==o?o:"light"}),[i,e.theme]),c=(0,a.useMemo)((function(){var e="object"==typeof l?l.base00:"dark"===l?Ht.base00:Wt.base00;return te({components:{MuiPaper:{styleOverrides:{root:{backgroundColor:e}}}},palette:{mode:"dark"===l?"dark":"light",background:{default:e}}})}),[l]),u=Nt($t({},e),{theme:l}),d=(0,a.useMemo)((function(){return function(e){var t,n,r,o,a,i,s,l,c,u,d,p,h,f,m,g,y;return Mt()((function(b,v){return{enableClipboard:null===(t=e.enableClipboard)||void 0===t||t,highlightUpdates:null!==(n=e.highlightUpdates)&&void 0!==n&&n,indentWidth:null!==(r=e.indentWidth)&&void 0!==r?r:3,groupArraysAfterLength:null!==(o=e.groupArraysAfterLength)&&void 0!==o?o:100,collapseStringsAfterLength:!1===e.collapseStringsAfterLength?Number.MAX_VALUE:null!==(a=e.collapseStringsAfterLength)&&void 0!==a?a:50,maxDisplayLength:null!==(i=e.maxDisplayLength)&&void 0!==i?i:30,rootName:null!==(s=e.rootName)&&void 0!==s?s:"root",onChange:null!==(l=e.onChange)&&void 0!==l?l:function(){},onCopy:null!==(c=e.onCopy)&&void 0!==c?c:void 0,onSelect:null!==(u=e.onSelect)&&void 0!==u?u:void 0,keyRenderer:null!==(d=e.keyRenderer)&&void 0!==d?d:Ut,editable:null!==(p=e.editable)&&void 0!==p&&p,defaultInspectDepth:null!==(h=e.defaultInspectDepth)&&void 0!==h?h:5,objectSortKeys:null!==(f=e.objectSortKeys)&&void 0!==f&&f,quotesOnKeys:null===(m=e.quotesOnKeys)||void 0===m||m,displayDataTypes:null===(g=e.displayDataTypes)||void 0===g||g,inspectCache:{},hoverPath:null,colorspace:Wt,value:e.value,prevValue:void 0,displayObjectSize:null===(y=e.displayObjectSize)||void 0===y||y,getInspectCache:function(e,t){var n=void 0!==t?e.join(".")+"[".concat(t,"]nt"):e.join(".");return v().inspectCache[n]},setInspectCache:function(e,t,n){var r=void 0!==n?e.join(".")+"[".concat(n,"]nt"):e.join(".");b((function(e){return{inspectCache:Nt($t({},e.inspectCache),_t({},r,"function"==typeof t?t(e.inspectCache[r]):t))}}))},setHover:function(e,t){b({hoverPath:e?{path:e,nestedIndex:t}:null})}}}))}(e)}),[]),p=(0,a.useMemo)((function(){return kt()((function(e){return{registry:[],registerTypes:function(t){e((function(e){return{registry:"function"==typeof t?t(e.registry):t}}))}}}))}),[]);return s(bt,{theme:c,children:s(wn.Provider,{value:p,children:s(Qt.Provider,{value:d,children:s(_n,$t({},u))})})})}},5907(e,t,n){"use strict";n.d(t,{Ay:()=>Ze,cx:()=>Ye});var r=n(1594);function o(){return o=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},o.apply(this,arguments)}const a=["children","options"],i=["allowFullScreen","allowTransparency","autoComplete","autoFocus","autoPlay","cellPadding","cellSpacing","charSet","classId","colSpan","contentEditable","contextMenu","crossOrigin","encType","formAction","formEncType","formMethod","formNoValidate","formTarget","frameBorder","hrefLang","inputMode","keyParams","keyType","marginHeight","marginWidth","maxLength","mediaGroup","minLength","noValidate","radioGroup","readOnly","rowSpan","spellCheck","srcDoc","srcLang","srcSet","tabIndex","useMap"].reduce(((e,t)=>(e[t.toLowerCase()]=t,e)),{class:"className",for:"htmlFor"}),s={amp:"&",apos:"'",gt:">",lt:"<",nbsp:" ",quot:"“"},l=["style","script","pre"],c=["src","href","data","formAction","srcDoc","action"],u=/([-A-Z0-9_:]+)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|(?:\{((?:\\.|{[^}]*?}|[^}])*)\})))?/gi,d=/\n{2,}$/,p=/^(\s*>[\s\S]*?)(?=\n\n|$)/,h=/^ *> ?/gm,f=/^(?:\[!([^\]]*)\]\n)?([\s\S]*)/,m=/^ {2,}\n/,g=/^(?:([-*_])( *\1){2,}) *(?:\n *)+\n/,y=/^(?: {1,3})?(`{3,}|~{3,}) *(\S+)? *([^\n]*?)?\n([\s\S]*?)(?:\1\n?|$)/,b=/^(?: {4}[^\n]+\n*)+(?:\n *)+\n?/,v=/^(`+)((?:\\`|(?!\1)`|[^`])+)\1/,k=/^(?:\n *)*\n/,x=/\r\n?/g,w=/^\[\^([^\]]+)](:(.*)((\n+ {4,}.*)|(\n(?!\[\^).+))*)/,C=/^\[\^([^\]]+)]/,E=/\f/g,A=/^---[ \t]*\n(.|\n)*\n---[ \t]*\n/,S=/^\s*?\[(x|\s)\]/,O=/^ *(#{1,6}) *([^\n]+?)(?: +#*)?(?:\n *)*(?:\n|$)/,M=/^ *(#{1,6}) +([^\n]+?)(?: +#*)?(?:\n *)*(?:\n|$)/,R=/^([^\n]+)\n *(=|-)\2{2,} *\n/,_=/^ *(?!<[a-z][^ >/]* ?\/>)<([a-z][^ >/]*) ?((?:[^>]*[^/])?)>\n?(\s*(?:<\1[^>]*?>[\s\S]*?<\/\1>|(?!<\1\b)[\s\S])*?)<\/\1>(?!<\/\1>)\n*/i,$=/&([a-z0-9]+|#[0-9]{1,6}|#x[0-9a-fA-F]{1,6});/gi,N=/^<!--[\s\S]*?(?:-->)/,z=/^(data|aria|x)-[a-z_][a-z\d_.-]*$/,T=/^ *<([a-z][a-z0-9:]*)(?:\s+((?:<.*?>|[^>])*))?\/?>(?!<\/\1>)(\s*\n)?/i,P=/^\{.*\}$/,j=/^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,I=/^<([^ >]+[:@\/][^ >]+)>/,L=/-([a-z])?/gi,F=/^(\|.*)\n(?: *(\|? *[-:]+ *\|[-| :]*)\n((?:.*\|.*\n)*))?\n?/,q=/^[^\n]+(?:  \n|\n{2,})/,D=/^\[([^\]]*)\]:\s+<?([^\s>]+)>?\s*("([^"]*)")?/,B=/^!\[([^\]]*)\] ?\[([^\]]*)\]/,W=/^\[([^\]]*)\] ?\[([^\]]*)\]/,H=/(\n|^[-*]\s|^#|^ {2,}|^-{2,}|^>\s)/,U=/\t/g,Q=/(^ *\||\| *$)/g,K=/^ *:-+: *$/,G=/^ *:-+ *$/,V=/^ *-+: *$/,X=e=>`(?=[\\s\\S]+?\\1${e?"\\1":""})`,Y="((?:\\[.*?\\][([].*?[)\\]]|<.*?>(?:.*?<.*?>)?|`.*?`|\\\\\\1|[\\s\\S])+?)",Z=RegExp(`^([*_])\\1${X(1)}${Y}\\1\\1(?!\\1)`),J=RegExp(`^([*_])${X(0)}${Y}\\1(?!\\1)`),ee=RegExp(`^(==)${X(0)}${Y}\\1`),te=RegExp(`^(~~)${X(0)}${Y}\\1`),ne=/^(:[a-zA-Z0-9-_]+:)/,re=/^\\([^0-9A-Za-z\s])/,oe=/\\([^0-9A-Za-z\s])/g,ae=/^[\s\S](?:(?!  \n|[0-9]\.|http)[^=*_~\-\n:<`\\\[!])*/,ie=/^\n+/,se=/^([ \t]*)/,le=/(?:^|\n)( *)$/,ce="(?:\\d+\\.)",ue="(?:[*+-])";function de(e){return"( *)("+(1===e?ce:ue)+") +"}const pe=de(1),he=de(2);function fe(e){return RegExp("^"+(1===e?pe:he))}const me=fe(1),ge=fe(2);function ye(e){return RegExp("^"+(1===e?pe:he)+"[^\\n]*(?:\\n(?!\\1"+(1===e?ce:ue)+" )[^\\n]*)*(\\n|$)","gm")}const be=ye(1),ve=ye(2);function ke(e){const t=1===e?ce:ue;return RegExp("^( *)("+t+") [\\s\\S]+?(?:\\n{2,}(?! )(?!\\1"+t+" (?!"+t+" ))\\n*|\\s*\\n*$)")}const xe=ke(1),we=ke(2);function Ce(e,t){const n=1===t,r=n?xe:we,o=n?be:ve,a=n?me:ge;return{t:e=>a.test(e),o:Pe((function(e,t){const n=le.exec(t.prevCapture);return n&&(t.list||!t.inline&&!t.simple)?r.exec(e=n[1]+e):null})),i:1,u(e,t,r){const i=n?+e[2]:void 0,s=e[0].replace(d,"\n").match(o);let l=!1;return{items:s.map((function(e,n){const o=a.exec(e)[0].length,i=RegExp("^ {1,"+o+"}","gm"),c=e.replace(i,"").replace(a,""),u=n===s.length-1,d=-1!==c.indexOf("\n\n")||u&&l;l=d;const p=r.inline,h=r.list;let f;r.list=!0,d?(r.inline=!1,f=Oe(c)+"\n\n"):(r.inline=!0,f=Oe(c));const m=t(f,r);return r.inline=p,r.list=h,m})),ordered:n,start:i}},l:(t,n,r)=>e(t.ordered?"ol":"ul",{key:r.key,start:"20"===t.type?t.start:void 0},t.items.map((function(t,o){return e("li",{key:o},n(t,r))})))}}const Ee=RegExp("^\\[((?:\\[[^\\[\\]]*(?:\\[[^\\[\\]]*\\][^\\[\\]]*)*\\]|[^\\[\\]])*)\\]\\(\\s*<?((?:\\([^)]*\\)|[^\\s\\\\]|\\\\.)*?)>?(?:\\s+['\"]([\\s\\S]*?)['\"])?\\s*\\)"),Ae=/^!\[(.*?)\]\( *((?:\([^)]*\)|[^() ])*) *"?([^)"]*)?"?\)/;function Se(e){return"string"==typeof e}function Oe(e){let t=e.length;for(;t>0&&e[t-1]<=" ";)t--;return e.slice(0,t)}function Me(e,t){return e.startsWith(t)}function Re(e,t,n){if(Array.isArray(n)){for(let t=0;t<n.length;t++)if(Me(e,n[t]))return!0;return!1}return n(e,t)}function _e(e){return e.replace(/[ÀÁÂÃÄÅàáâãäåæÆ]/g,"a").replace(/[çÇ]/g,"c").replace(/[ðÐ]/g,"d").replace(/[ÈÉÊËéèêë]/g,"e").replace(/[ÏïÎîÍíÌì]/g,"i").replace(/[Ññ]/g,"n").replace(/[øØœŒÕõÔôÓóÒò]/g,"o").replace(/[ÜüÛûÚúÙù]/g,"u").replace(/[ŸÿÝý]/g,"y").replace(/[^a-z0-9- ]/gi,"").replace(/ /gi,"-").toLowerCase()}function $e(e){return V.test(e)?"right":K.test(e)?"center":G.test(e)?"left":null}function Ne(e,t,n,r){const o=n.inTable;n.inTable=!0;let a=[[]],i="";function s(){if(!i)return;const e=a[a.length-1];e.push.apply(e,t(i,n)),i=""}return e.trim().split(/(`[^`]*`|\\\||\|)/).filter(Boolean).forEach(((e,t,n)=>{"|"===e.trim()&&(s(),r)?0!==t&&t!==n.length-1&&a.push([]):i+=e})),s(),n.inTable=o,a}function ze(e,t,n){n.inline=!0;const r=e[2]?e[2].replace(Q,"").split("|").map($e):[],o=e[3]?function(e,t,n){return e.trim().split("\n").map((function(e){return Ne(e,t,n,!0)}))}(e[3],t,n):[],a=Ne(e[1],t,n,!!o.length);return n.inline=!1,o.length?{align:r,cells:o,header:a,type:"25"}:{children:a,type:"21"}}function Te(e,t){return null==e.align[t]?{}:{textAlign:e.align[t]}}function Pe(e){return e.inline=1,e}function je(e){return Pe((function(t,n){return n.inline?e.exec(t):null}))}function Ie(e){return Pe((function(t,n){return n.inline||n.simple?e.exec(t):null}))}function Le(e){return function(t,n){return n.inline||n.simple?null:e.exec(t)}}function Fe(e){return Pe((function(t){return e.exec(t)}))}const qe=/(javascript|vbscript|data(?!:image)):/i;function De(e){try{const t=decodeURIComponent(e).replace(/[^A-Za-z0-9/:]/g,"");if(qe.test(t))return null}catch(e){return null}return e}function Be(e){return e?e.replace(oe,"$1"):e}function We(e,t,n){const r=n.inline||!1,o=n.simple||!1;n.inline=!0,n.simple=!0;const a=e(t,n);return n.inline=r,n.simple=o,a}function He(e,t,n){const r=n.inline||!1,o=n.simple||!1;n.inline=!1,n.simple=!0;const a=e(t,n);return n.inline=r,n.simple=o,a}function Ue(e,t,n){const r=n.inline||!1;n.inline=!1;const o=e(t,n);return n.inline=r,o}const Qe=(e,t,n)=>({children:We(t,e[2],n)});function Ke(){return{}}function Ge(){return null}function Ve(...e){return e.filter(Boolean).join(" ")}function Xe(e,t,n){let r=e;const o=t.split(".");for(;o.length&&(r=r[o[0]],void 0!==r);)o.shift();return r||n}function Ye(e="",t={}){t.overrides=t.overrides||{},t.namedCodesToUnicode=t.namedCodesToUnicode?o({},s,t.namedCodesToUnicode):s;const n=t.slugify||_e,a=t.sanitizer||De,d=t.createElement||r.createElement,Q=[p,y,b,t.enforceAtxHeadings?M:O,R,F,xe,we],K=[...Q,q,_,N,T];function G(e,t){for(let n=0;n<e.length;n++)if(e[n].test(t))return!0;return!1}function V(e,n,...r){const a=Xe(t.overrides,e+".props",{});return d(function(e,t){const n=Xe(t,e);return n?"function"==typeof n||"object"==typeof n&&"render"in n?n:Xe(t,e+".component",e):e}(e,t.overrides),o({},n,a,{className:Ve(null==n?void 0:n.className,a.className)||void 0}),...r)}function X(e){e=e.replace(A,"");let n=!1;t.forceInline?n=!0:t.forceBlock||(n=!1===H.test(e));const r=de(ue(n?e:Oe(e).replace(ie,"")+"\n\n",{inline:n}));for(;Se(r[r.length-1])&&!r[r.length-1].trim();)r.pop();if(null===t.wrapper)return r;const o=t.wrapper||(n?"span":"div");let a;if(r.length>1||t.forceWrapper)a=r;else{if(1===r.length)return a=r[0],"string"==typeof a?V("span",{key:"outer"},a):a;a=null}return d(o,{key:"outer"},a)}function Y(e,t){if(!t||!t.trim())return null;const n=t.match(u);return n?n.reduce((function(t,n){const r=n.indexOf("=");if(-1!==r){const o=function(e){return-1!==e.indexOf("-")&&null===e.match(z)&&(e=e.replace(L,(function(e,t){return t.toUpperCase()}))),e}(n.slice(0,r)).trim(),s=function(e){const t=e[0];return('"'===t||"'"===t)&&e.length>=2&&e[e.length-1]===t?e.slice(1,-1):e}(n.slice(r+1).trim()),l=i[o]||o;if("ref"===l)return t;const u=t[l]=function(e,t,n,r){return"style"===t?function(e){const t=[];let n="",r=!1,o=!1,a="";if(!e)return t;for(let i=0;i<e.length;i++){const s=e[i];if('"'!==s&&"'"!==s||r||(o?s===a&&(o=!1,a=""):(o=!0,a=s)),"("===s&&n.endsWith("url")?r=!0:")"===s&&r&&(r=!1),";"!==s||o||r)n+=s;else{const e=n.trim();if(e){const n=e.indexOf(":");if(n>0){const r=e.slice(0,n).trim(),o=e.slice(n+1).trim();t.push([r,o])}}n=""}}const i=n.trim();if(i){const e=i.indexOf(":");if(e>0){const n=i.slice(0,e).trim(),r=i.slice(e+1).trim();t.push([n,r])}}return t}(n).reduce((function(t,[n,o]){return t[n.replace(/(-[a-z])/g,(e=>e[1].toUpperCase()))]=r(o,e,n),t}),{}):-1!==c.indexOf(t)?r(Be(n),e,t):(n.match(P)&&(n=Be(n.slice(1,n.length-1))),"true"===n||"false"!==n&&n)}(e,o,s,a);"string"==typeof u&&(_.test(u)||T.test(u))&&(t[l]=X(u.trim()))}else"style"!==n&&(t[i[n]||n]=!0);return t}),{}):null}const oe=[],le={},ce={0:{t:[">"],o:Le(p),i:1,u(e,t,n){const[,r,o]=e[0].replace(h,"").match(f);return{alert:r,children:t(o,n)}},l(e,t,r){const o={key:r.key};return e.alert&&(o.className="markdown-alert-"+n(e.alert.toLowerCase(),_e),e.children.unshift({attrs:{},children:[{type:"27",text:e.alert}],noInnerParse:!0,type:"11",tag:"header"})),V("blockquote",o,t(e.children,r))}},1:{t:["  "],o:Fe(m),i:1,u:Ke,l:(e,t,n)=>V("br",{key:n.key})},2:{t:["--","__","**","- ","* ","_ "],o:Le(g),i:1,u:Ke,l:(e,t,n)=>V("hr",{key:n.key})},3:{t:["    "],o:Le(b),i:0,u:e=>({lang:void 0,text:Be(Oe(e[0].replace(/^ {4}/gm,"")))}),l:(e,t,n)=>V("pre",{key:n.key},V("code",o({},e.attrs,{className:e.lang?"lang-"+e.lang:""}),e.text))},4:{t:["```","~~~"],o:Le(y),i:0,u:e=>({attrs:Y("code",e[3]||""),lang:e[2]||void 0,text:e[4],type:"3"})},5:{t:["`"],o:Ie(v),i:3,u:e=>({text:Be(e[2])}),l:(e,t,n)=>V("code",{key:n.key},e.text)},6:{t:["[^"],o:Le(w),i:0,u:e=>(oe.push({footnote:e[2],identifier:e[1]}),{}),l:Ge},7:{t:["[^"],o:je(C),i:1,u:e=>({target:"#"+n(e[1],_e),text:e[1]}),l:(e,t,n)=>V("a",{key:n.key,href:a(e.target,"a","href")},V("sup",{key:n.key},e.text))},8:{t:["[ ]","[x]"],o:je(S),i:1,u:e=>({completed:"x"===e[1].toLowerCase()}),l:(e,t,n)=>V("input",{checked:e.completed,key:n.key,readOnly:!0,type:"checkbox"})},9:{t:["#"],o:Le(t.enforceAtxHeadings?M:O),i:1,u:(e,t,r)=>({children:We(t,e[2],r),id:n(e[2],_e),level:e[1].length}),l:(e,t,n)=>V("h"+e.level,{id:e.id,key:n.key},t(e.children,n))},10:{t:e=>{const t=e.indexOf("\n");return t>0&&t<e.length-1&&("="===e[t+1]||"-"===e[t+1])},o:Le(R),i:1,u:(e,t,n)=>({children:We(t,e[1],n),level:"="===e[2]?1:2,type:"9"})},11:{t:["<"],o:Fe(_),i:1,u(e,t,n){const[,r]=e[3].match(se),o=RegExp("^"+r,"gm"),a=e[3].replace(o,""),i=G(K,a)?Ue:We,s=e[1].toLowerCase(),c=-1!==l.indexOf(s),u=(c?s:e[1]).trim(),d={attrs:Y(u,e[2]),noInnerParse:c,tag:u};if(n.inAnchor=n.inAnchor||"a"===s,c)d.text=e[3];else{const e=n.inHTML;n.inHTML=!0,d.children=i(t,a,n),n.inHTML=e}return n.inAnchor=!1,d},l:(e,t,n)=>V(e.tag,o({key:n.key},e.attrs),e.text||(e.children?t(e.children,n):""))},13:{t:["<"],o:Fe(T),i:1,u(e){const t=e[1].trim();return{attrs:Y(t,e[2]||""),tag:t}},l:(e,t,n)=>V(e.tag,o({},e.attrs,{key:n.key}))},12:{t:["\x3c!--"],o:Fe(N),i:1,u:()=>({}),l:Ge},14:{t:["!["],o:Ie(Ae),i:1,u:e=>({alt:Be(e[1]),target:Be(e[2]),title:Be(e[3])}),l:(e,t,n)=>V("img",{key:n.key,alt:e.alt||void 0,title:e.title||void 0,src:a(e.target,"img","src")})},15:{t:["["],o:je(Ee),i:3,u:(e,t,n)=>({children:He(t,e[1],n),target:Be(e[2]),title:Be(e[3])}),l:(e,t,n)=>V("a",{key:n.key,href:a(e.target,"a","href"),title:e.title},t(e.children,n))},16:{t:["<"],o:je(I),i:0,u(e){let t=e[1],n=!1;return-1!==t.indexOf("@")&&-1===t.indexOf("//")&&(n=!0,t=t.replace("mailto:","")),{children:[{text:t,type:"27"}],target:n?"mailto:"+t:t,type:"15"}}},17:{t:(e,n)=>!n.inAnchor&&!t.disableAutoLink&&(Me(e,"http://")||Me(e,"https://")),o:je(j),i:0,u:e=>({children:[{text:e[1],type:"27"}],target:e[1],title:void 0,type:"15"})},20:Ce(V,1),33:Ce(V,2),19:{t:["\n"],o:Le(k),i:3,u:Ke,l:()=>"\n"},21:{o:Pe((function(e,t){if(t.inline||t.simple||t.inHTML&&-1===e.indexOf("\n\n")&&-1===t.prevCapture.indexOf("\n\n"))return null;let n="",r=0;for(;;){const t=e.indexOf("\n",r),o=e.slice(r,-1===t?void 0:t+1);if(G(Q,o))break;if(n+=o,-1===t||!o.trim())break;r=t+1}const o=Oe(n);return""===o?null:[n,,o]})),i:3,u:Qe,l:(e,t,n)=>V("p",{key:n.key},t(e.children,n))},22:{t:["["],o:je(D),i:0,u:e=>(le[e[1]]={target:e[2],title:e[4]},{}),l:Ge},23:{t:["!["],o:Ie(B),i:0,u:e=>({alt:e[1]?Be(e[1]):void 0,ref:e[2]}),l:(e,t,n)=>le[e.ref]?V("img",{key:n.key,alt:e.alt,src:a(le[e.ref].target,"img","src"),title:le[e.ref].title}):null},24:{t:e=>"["===e[0]&&-1===e.indexOf("]("),o:je(W),i:0,u:(e,t,n)=>({children:t(e[1],n),fallbackChildren:e[0],ref:e[2]}),l:(e,t,n)=>le[e.ref]?V("a",{key:n.key,href:a(le[e.ref].target,"a","href"),title:le[e.ref].title},t(e.children,n)):V("span",{key:n.key},e.fallbackChildren)},25:{t:["|"],o:Le(F),i:1,u:ze,l(e,t,n){const r=e;return V("table",{key:n.key},V("thead",null,V("tr",null,r.header.map((function(e,o){return V("th",{key:o,style:Te(r,o)},t(e,n))})))),V("tbody",null,r.cells.map((function(e,o){return V("tr",{key:o},e.map((function(e,o){return V("td",{key:o,style:Te(r,o)},t(e,n))})))}))))}},27:{o:Pe((function(e,t){let n;return Me(e,":")&&(n=ne.exec(e)),n||ae.exec(e)})),i:4,u(e){const n=e[0];return{text:-1===n.indexOf("&")?n:n.replace($,((e,n)=>t.namedCodesToUnicode[n]||e))}},l:e=>e.text},28:{t:["**","__"],o:Ie(Z),i:2,u:(e,t,n)=>({children:t(e[2],n)}),l:(e,t,n)=>V("strong",{key:n.key},t(e.children,n))},29:{t:e=>{const t=e[0];return("*"===t||"_"===t)&&e[1]!==t},o:Ie(J),i:3,u:(e,t,n)=>({children:t(e[2],n)}),l:(e,t,n)=>V("em",{key:n.key},t(e.children,n))},30:{t:["\\"],o:Ie(re),i:1,u:e=>({text:e[1],type:"27"})},31:{t:["=="],o:Ie(ee),i:3,u:Qe,l:(e,t,n)=>V("mark",{key:n.key},t(e.children,n))},32:{t:["~~"],o:Ie(te),i:3,u:Qe,l:(e,t,n)=>V("del",{key:n.key},t(e.children,n))}};!0===t.disableParsingRawHTML&&(delete ce[11],delete ce[13]);const ue=function(e){var t=Object.keys(e);function n(r,o){var a=[];if(o.prevCapture=o.prevCapture||"",r.trim())for(;r;)for(var i=0;i<t.length;){var s=t[i],l=e[s];if(!l.t||Re(r,o,l.t)){var c=l.o(r,o);if(c&&c[0]){r=r.substring(c[0].length);var u=l.u(c,n,o);o.prevCapture+=c[0],u.type||(u.type=s),a.push(u);break}i++}else i++}return o.prevCapture="",a}return t.sort((function(t,n){return e[t].i-e[n].i||(t<n?-1:1)})),function(e,t){return n(function(e){return e.replace(x,"\n").replace(E,"").replace(U,"    ")}(e),t)}}(ce),de=function(e,t){return function n(r,o={}){if(Array.isArray(r)){const e=o.key,t=[];let a=!1;for(let e=0;e<r.length;e++){o.key=e;const i=n(r[e],o),s=Se(i);s&&a?t[t.length-1]+=i:null!==i&&t.push(i),a=s}return o.key=e,t}return function(n,r,o){const a=e[n.type].l;return t?t((()=>a(n,r,o)),n,r,o):a(n,r,o)}(r,n,o)}}(ce,t.renderRule),pe=X(e);return oe.length?V("div",null,pe,V("footer",{key:"footer"},oe.map((function(e){return V("div",{id:n(e.identifier,_e),key:e.identifier},e.identifier,de(ue(e.footnote,{inline:!0})))})))):pe}const Ze=e=>{let{children:t,options:n}=e,o=function(e,t){if(null==e)return{};var n,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)t.indexOf(n=a[r])>=0||(o[n]=e[n]);return o}(e,a);return r.cloneElement(Ye(null==t?"":t,n),o)};(Object.getOwnPropertyDescriptor(Ze,"name")||{}).writable||Object.defineProperty(Ze,"name",{value:"default",configurable:!0})}}]);