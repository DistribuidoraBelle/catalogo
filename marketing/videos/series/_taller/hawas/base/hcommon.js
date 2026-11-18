function fit(txt,max,k){return Math.min(max,(k||1900)/Math.max(3,txt.length));}
function pill(txt,x,y,s,bg,fg,op){if(op<=0)return '';var w=txt.length*s*0.66+s*1.6;return '<g opacity="'+op+'"><rect x="'+(x-w/2)+'" y="'+(y-s*1.15)+'" width="'+w+'" height="'+(s*1.7)+'" rx="'+(s*0.85)+'" fill="'+bg+'"/>'+T(txt,x,y,{f:'Montserrat',w:800,s:s,c:fg,ls:2})+'</g>';}
function emoTxt(txt,lt,t0,op,col,y,font){if(lt<t0||op<=0)return '';y=y||480;var k=cl((lt-t0)/0.7);var w=1000*eo(k);var s=Math.min(96,2000/txt.length);
 return '<g opacity="'+op+'" transform="rotate(-3 540 '+y+')"><clipPath id="ec"><rect x="40" y="'+(y-100)+'" width="'+w+'" height="180"/></clipPath><g clip-path="url(#ec)">'+
 '<text x="540" y="'+(y+12)+'" text-anchor="middle" font-family="'+(font||'Caveat')+'" font-weight="700" font-size="'+s+'" fill="#000" opacity=".25" transform="translate(3 4)">'+esc(txt)+'</text>'+
 '<text x="540" y="'+(y+12)+'" text-anchor="middle" font-family="'+(font||'Caveat')+'" font-weight="700" font-size="'+s+'" fill="#fff">'+esc(txt)+'</text>'+
 '<path d="M'+(540-txt.length*s*0.21)+' '+(y+40)+' Q 540 '+(y+56)+' '+(540+txt.length*s*0.21)+' '+(y+34)+'" fill="none" stroke="'+col+'" stroke-width="7" stroke-linecap="round"/></g></g>';}
function seg(t){var c=curP(t);if(!c)return null;var p=c.p;c.iT=C[p.i]-C[p.k];c.qT=C[p.q]-C[p.k];c.nT=C[p.n]-C[p.k];c.ik=e5(cl((c.lt-c.iT)/0.5));c.notes=notesOf(p);return c;}
function insWords(p){var w=p.ins.n.toUpperCase().split(' ');if(w.length==1&&p.ins.mt)w.push(p.ins.mt);if(w.length>2){var h=Math.ceil(w.length/2);w=[w.slice(0,h).join(' '),w.slice(h).join(' ')];}return w;}
function finish(out,t,label){out+=T(label,1040,48,{a:'end',f:'Space Mono',w:700,s:22,c:'#fff',op:.55});document.getElementById('sv').innerHTML=out;}
// textos estándar de cada perfume (header, emo, notas, frase, marketing, inspirado)
function texts(c,o){o=o||{};var p=c.p,lt=c.lt,ik=c.ik,s='';var hf=o.hf||'Montserrat',acc=o.acc||'#FFE29A',fg=o.fg||'#fff',pb=o.pb||'rgba(0,0,0,.28)';
 var hk=e5(cl((lt-0.15)/0.5));
 s+='<g opacity="'+(1-ik)+'">'+T('RASASI',540,190,{f:'Montserrat',w:600,s:30,c:fg,ls:14,op:hk})+T(p.name,540,262,{f:hf,w:900,s:o.hs||62,c:fg,ls:4,op:hk})+'</g>';
 if(lt>=c.nT)p.N.slice(0,3).forEach(function(n,j){var k=e5(cl((lt-c.nT-j*0.4)/0.35))*(1-ik);s+=pill(n[1].toUpperCase(),[250,540,830][j],350,28,pb,fg,k);});
 s+=emoTxt(p.emo,lt,0.12,1-ik,acc,o.ey||480);
 if(lt>=c.qT){var k=e5(cl((lt-c.qT)/0.4))*(1-ik);s+=T(p.quote,540,o.qy||1500,{f:'Playfair Display',it:1,w:500,s:46,c:fg,op:k,tr:'translate(0 '+(1-k)*30+')'});
  var k2=eb(cl((lt-c.qT-0.8)/0.4))*(1-ik);if(k2>0)s+='<g transform="translate(540 '+((o.qy||1500)+90)+') scale('+k2+') translate(-540 '+(-(o.qy||1500)-90)+')">'+pill(p.mk,540,(o.qy||1500)+100,32,o.mb||'#fff',o.mf||p.pal[1],1)+'</g>';}
 if(ik>0)s+=T('INSPIRADO EN',540,210,{f:'Montserrat',w:800,s:44,c:fg,ls:14,op:ik});
 return s;}
function outro(t,o){var lt=t-C.out;var k=e5(cl(lt/0.5));return T('¿CON CUÁL',540,820,{f:o.f||'Anton',s:170,c:'#fff',op:k})+T('TE QUEDÁS?',540,1000,{f:o.f||'Anton',s:170,c:o.c||'#FFE29A',op:k});}
