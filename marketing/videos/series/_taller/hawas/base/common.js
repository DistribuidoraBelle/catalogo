var C=window.CUES;
function cl(x){return x<0?0:x>1?1:x}
function L(a,b,k){return a+(b-a)*k}
function eio(x){return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2}
function eo(x){return 1-Math.pow(1-x,3)}
function e5(x){return 1-Math.pow(1-x,5)}
function eb(x){var c1=1.3,c3=c1+1;return 1+c3*Math.pow(x-1,3)+c1*Math.pow(x-1,2)}
function hsh(i){var x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x);}
function mix(h1,h2,k){var a=parseInt(h1.slice(1),16),b=parseInt(h2.slice(1),16);var r=Math.round(L(a>>16,b>>16,k)),g=Math.round(L((a>>8)&255,(b>>8)&255,k)),bl=Math.round(L(a&255,b&255,k));return '#'+((1<<24)+(r<<16)+(g<<8)+bl).toString(16).slice(1);}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');}
function T(txt,x,y,o){o=o||{};return '<text x="'+x+'" y="'+y+'" text-anchor="'+(o.a||'middle')+'" font-family="'+(o.f||'DM Sans')+'" font-weight="'+(o.w||400)+'"'+(o.it?' font-style="italic"':'')+' font-size="'+(o.s||40)+'" letter-spacing="'+(o.ls||0)+'" fill="'+(o.c||'#fff')+'" opacity="'+(o.op==null?1:o.op)+'"'+(o.st?' stroke="'+o.st+'" stroke-width="'+(o.sw||2)+'"':'')+(o.tr?' transform="'+o.tr+'"':'')+(o.fl?' filter="'+o.fl+'"':'')+'>'+esc(txt)+'</text>';}
function img(href,cx,cy,h,op,rot,extra){if(op<=0)return '';return '<image href="fotos/'+href+'" x="'+(cx-h*0.6)+'" y="'+(cy-h/2)+'" width="'+(h*1.2)+'" height="'+h+'" preserveAspectRatio="xMidYMid meet" opacity="'+op+'" transform="rotate('+(rot||0)+' '+cx+' '+cy+')" '+(extra||'')+'/>';}
function photo(note,x,y,w,h,op,extra){return '<image href="fotos/notas/'+note+'.jpg" x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" preserveAspectRatio="xMidYMid slice" opacity="'+op+'" '+(extra||'')+'/>';}
function curP(t){var r=null;P.forEach(function(p,i){var t1=C[p.end]!=null?C[p.end]:1e9;if(t>=C[p.k]&&t<t1)r={p:p,i:i,lt:t-C[p.k]};});return r;}
var subLine=-1;
function subs(t,KEY){var cur=null;for(var i=0;i<SUBS.length;i++)if(t>=SUBS[i].t0&&t<SUBS[i].t1+0.25)cur=i;var box=document.getElementById('sub');
  if(cur===null||t<C.p1){box.innerHTML='';subLine=-1;return}var Ln=SUBS[cur];if(subLine!==cur){box.innerHTML=Ln.w.map(function(w){return '<span>'+w.s+'</span>'}).join(' ');subLine=cur;}
  for(var j=0;j<Ln.w.length;j++){var on=t>=Ln.w[j].t;var key=KEY&&KEY.test(Ln.w[j].s.replace(/[¿?,.:;…"]/g,''));box.children[j].className=on?(key?'key':'on'):'off';}}
