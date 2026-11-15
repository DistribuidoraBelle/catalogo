// ═══════════ ACADEMIA 06 · PROYECCIÓN Y ESTELA ═══════════
var REST={hL:[60,610],hR:[436,410],ang:6};
function ch(G,x,y,sc,t,extra){extra=extra||{};var st={hL:extra.hL||REST.hL,hR:extra.hR||REST.hR,ang:extra.ang==null?6:extra.ang,bob:extra.bob==null?Math.sin(t*2+(G==='h'?1:0))*5:extra.bob,blink:((t+(G==='h'?1.3:0))%3.4)<0.12,dizzy:extra.dizzy,back:false};
  var s='<g transform="translate('+x+','+y+') scale('+sc+') translate(0,-120)">'+(extra.pre||'')+(extra.flip?'<g transform="translate(500,0) scale(-1,1)">':'<g>')+pera2(G,G==='m'?MO:HO,G==='m'?GV:GT,st);
  if(extra.wink){s+='<ellipse cx="282" cy="'+(272+st.bob)+'" rx="19" ry="23" fill="'+(G==='m'?MO.skin:HO.skin)+'"/><path d="M266 '+(276+st.bob)+' C 274 '+(266+st.bob)+' 290 '+(266+st.bob)+' 298 '+(276+st.bob)+'" fill="none" stroke="#1a1a1a" stroke-width="6" stroke-linecap="round"/>';}
  if(extra.hearts){for(var i=0;i<3;i++){var ph=((t*0.8+i/3)%1);s+='<text x="'+(220+i*40)+'" y="'+(150-ph*80+st.bob)+'" font-size="46" opacity="'+(1-ph)+'" text-anchor="middle">'+(i===1?'😍':'❤️')+'</text>';}}
  if(extra.q){s+='<g transform="translate(400,120)"><circle r="54" fill="#fff" stroke="#1a1a1a" stroke-width="6"/><text y="24" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="70" fill="#8E6CF5">?</text></g>';}
  s+='</g>'+(extra.post||'')+'</g>';return s;}
function chip(txt,x,y,k,col,fs){fs=fs||46;var w=txt.length*fs*0.58+70;return '<g transform="translate('+x+','+y+') scale('+back(cl(k))+')"><rect x="'+(-w/2+6)+'" y="-36" width="'+w+'" height="84" rx="42" fill="rgba(0,0,0,.22)"/><rect x="'+(-w/2)+'" y="-44" width="'+w+'" height="84" rx="42" fill="'+(col||'#fff')+'" stroke="#1a1a1a" stroke-width="6"/><text y="'+(fs*0.36)+'" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="'+fs+'" fill="#1a1a1a">'+txt+'</text></g>';}
var PARTS=[['p','💨','PROYECCIÓN','#3DB8F5'],['e','✨','ESTELA','#8E6CF5'],['f','💪','QUÉ LAS POTENCIA','#22C3B0'],['x','⚠️','EL ERROR','#FF5A4E'],['t','💡','TIP BELLE','#4CC38A']];
function partAt(t){var p=null;PARTS.forEach(function(q){if(t>=C[q[0]])p=q;});if(t>=C.end)p=null;return p;}
function bubble(cx,cy,r,col,op,t){return '<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="'+col+'" opacity="'+op+'"/><circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="none" stroke="#fff" stroke-width="6" stroke-dasharray="18 14" opacity=".8" transform="rotate('+(t*20)+' '+cx+' '+cy+')"/>';}
function render(t){
  var part=partAt(t),out='',bg=part?part[3]:'#F4B63A';document.getElementById('bgc').style.background=bg;
  if(part){var t0=C[part[0]],kh=cl((t-t0)/0.45);
    out+='<g transform="translate(150,215) scale('+back(kh)+')"><circle r="92" fill="#fff" stroke="#1a1a1a" stroke-width="8"/><text y="34" text-anchor="middle" font-size="96">'+part[1]+'</text></g>';
    out+='<text x="'+(270+(1-eio(cl((t-t0-0.12)/0.4)))*400)+'" y="'+(part[2].length>12?235:250)+'" font-family="Baloo 2" font-weight="800" font-size="'+(part[2].length>12?76:104)+'" fill="#fff" stroke="#1a1a1a" stroke-width="14" paint-order="stroke" opacity="'+cl((t-t0-0.12)/0.2)+'">'+part[2]+'</text>';}
  var ent=function(t0){return eio(cl((t-t0)/0.5));};
  // ── PROYECCIÓN: ella sola, burbuja que crece
  if(t>=C.p&&t<C.e){var cx=540,cy=930;var R=L(0,260,ent(C.p+0.4));
    if(t>=C.p2)R=L(260,190,ent(C.p2));if(t>=C.p3)R=L(190,330,ent(C.p3));if(t>=C.p4)R=L(330,780,ent(C.p4));
    out+=bubble(cx,cy,R*(1+0.03*Math.sin(t*3)),'#fff',.22,t);
    for(var i=0;i<14;i++){var a=i*0.45+t*0.3,rr=R*(0.4+((i*37)%60)/100);out+='<text x="'+(cx+Math.cos(a)*rr)+'" y="'+(cy+Math.sin(a)*rr)+'" font-size="30" opacity=".75" text-anchor="middle">'+(i%2?'✨':'🌸')+'</text>';}
    out+=ch('m',540-250*1.1,cy-260,1.1,t);
    if(t>=C.p2)out+=chip('🤏 ÍNTIMA',190,1470,(t-C.p2)/0.4,t<C.p3?'#fff':'rgba(255,255,255,.6)',34);
    if(t>=C.p3)out+=chip('🙋 MODERADA',525,1470,(t-C.p3)/0.4,t<C.p4?'#fff':'rgba(255,255,255,.6)',34);
    if(t>=C.p4)out+=chip('🏠 FUERTE',880,1470,(t-C.p4)/0.4,'#FFD23F',34);
    if(t>=C.p+0.6&&t<C.p2){var k=ent(C.p+0.6);out+='<path d="M'+(cx)+' '+(cy-30)+' L '+(cx+R*k)+' '+(cy-30)+'" stroke="#fff" stroke-width="8" stroke-linecap="round"/><path d="M'+(cx+R*k-20)+' '+(cy-46)+' L '+(cx+R*k)+' '+(cy-30)+' L '+(cx+R*k-20)+' '+(cy-14)+'" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round"/>';}
  }
  // ── ESTELA: ella cruza dejando rastro, él llega y huele
  if(t>=C.e&&t<C.f){var dur=(C.e2-C.e)+1.2;var k=cl((t-C.e)/dur);var wx=L(900,-560,k);var by=-Math.abs(Math.sin(t*7))*16;
    for(var i=0;i<40;i++){var ts=C.e+i*dur/40;if(ts>t)break;var px=L(900,-560,cl((ts-C.e)/dur))+250*0.95;var age=t-ts;var op=Math.max(0.25,1-age/6);out+='<text x="'+(px+((i*37)%40-20))+'" y="'+(940+((i*53)%60-30)-Math.min(age,2)*20)+'" font-size="'+(30+(i%3)*10)+'" opacity="'+op+'" text-anchor="middle">'+(['✨','🌸','💫'][i%3])+'</text>';}
    out+='<path d="M'+(wx+240)+' 1000 L 1100 1000" stroke="#fff" stroke-width="10" stroke-dasharray="4 26" stroke-linecap="round" opacity=".5"/>';
    if(k<1)out+=ch('m',wx,1000,0.95,t,{bob:by,flip:true});
    if(t>=C.e2){var k2=ent(C.e2);var hx=L(1100,300,k2);out+=ch('h',hx,1000,0.95,t,{bob:t<C.e2+0.6?-Math.abs(Math.sin(t*7))*14:0,hearts:t>C.e2+0.8});}
    if(t>=C.e3){out+=chip('💨 PROYECCIÓN = TU BURBUJA',540,1380,(t-C.e3)/0.4,'#fff',40);out+=chip('✨ ESTELA = TU FIRMA',540,1480,(t-C.e3-0.9)/0.4,'#FFD23F',40);}
  }
  // ── QUÉ LAS POTENCIA
  if(t>=C.f&&t<C.x){var cards=[[C.f+0.5,'💧','CONCENTRACIÓN','Parfum > EDT'],[C.f2,'🪵','NOTAS DE FONDO','ámbar · oud · vainilla'],[C.f3,'☀️','CALOR','lo expande']];
    cards.forEach(function(cd,i){var k=cl((t-cd[0])/0.4);if(k<=0)return;var y=560+i*300;out+='<g transform="translate(540,'+y+') scale('+back(k)+')"><rect x="-440" y="-110" width="880" height="230" rx="40" fill="rgba(0,0,0,.2)" transform="translate(8,10)"/><rect x="-440" y="-110" width="880" height="230" rx="40" fill="#fff" stroke="#1a1a1a" stroke-width="7"/><text x="-330" y="40" text-anchor="middle" font-size="120">'+cd[1]+'</text><text x="-220" y="-6" font-family="Baloo 2" font-weight="800" font-size="70" fill="#1a1a1a">'+cd[2]+'</text><text x="-220" y="62" font-family="DM Sans" font-weight="700" font-size="44" fill="#555">'+cd[3]+'</text></g>';});
    if(t>=C.f2){var k=cl((t-C.f2)/0.6);/*bars*/}
  }
  // ── EL ERROR: ascensor + invierno en verano
  if(t>=C.x&&t<C.t){
    if(t<C.x3){var ex=290,ey=560,ew=500,eh=840;
      out+='<rect x="'+(ex-10)+'" y="'+(ey-10)+'" width="'+(ew+20)+'" height="'+(eh+20)+'" rx="20" fill="#5A5F6B" stroke="#1a1a1a" stroke-width="8"/><rect x="'+ex+'" y="'+ey+'" width="'+ew+'" height="'+eh+'" fill="#D9DEE6"/>';
      var fill=ent(C.x+0.6);out+='<rect x="'+ex+'" y="'+(ey+eh*(1-fill))+'" width="'+ew+'" height="'+(eh*fill)+'" fill="#B57BFF" opacity=".55"/>';
      out+='<g clip-path="url(#elev)">'+ch('m',ex-40,990,0.72,t)+ch('h',ex+190,990,0.72,t,{dizzy:t>=C.x2})+'</g>';
      for(var i=0;i<10;i++){var ph=((t*0.5+i/10)%1);out+='<text x="'+(ex+30+((i*67)%440))+'" y="'+(ey+eh-ph*eh)+'" font-size="34" opacity="'+(fill*(1-ph))+'" text-anchor="middle">💨</text>';}
      out+='<rect x="'+(ex+ew/2-90)+'" y="'+(ey-70)+'" width="180" height="50" rx="12" fill="#1a1a1a"/><text x="'+(ex+ew/2)+'" y="'+(ey-34)+'" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="34" fill="#FF5A4E">▲ 7 ▼</text>';
      if(t>=C.x2)out+=chip('😵 NO DEJA RESPIRAR',540,1490,(t-C.x2)/0.4,'#FFE1E1');}
    else{var k=ent(C.x3);var sunR=90+10*Math.sin(t*4);out+='<circle cx="860" cy="470" r="'+sunR+'" fill="#FFD23F" stroke="#1a1a1a" stroke-width="7"/>';for(var i=0;i<10;i++){var a=i*0.628+t*0.5;out+='<path d="M'+(860+Math.cos(a)*(sunR+20))+' '+(470+Math.sin(a)*(sunR+20))+' L '+(860+Math.cos(a)*(sunR+55))+' '+(470+Math.sin(a)*(sunR+55))+'" stroke="#FFD23F" stroke-width="12" stroke-linecap="round"/>';}
      var temp=Math.round(L(20,35,cl((t-C.x3)/1.5)));out+='<g transform="translate(170,560)"><rect x="-26" y="-140" width="52" height="260" rx="26" fill="#fff" stroke="#1a1a1a" stroke-width="7"/><rect x="-14" y="'+(110-L(60,220,cl((t-C.x3)/1.5)))+'" width="28" height="'+L(60,220,cl((t-C.x3)/1.5))+'" rx="14" fill="#E5322B"/><circle cy="130" r="42" fill="#E5322B" stroke="#1a1a1a" stroke-width="7"/><text x="70" y="-90" font-family="Baloo 2" font-weight="800" font-size="64" fill="#fff" stroke="#1a1a1a" stroke-width="10" paint-order="stroke">'+temp+'°</text></g>';
      out+=bubble(540,1050,L(200,420,k),'#C77B30',.45,t)+'<text x="540" y="760" text-anchor="middle" font-size="60" opacity="'+k+'">🍯🪵🍦</text>';
      out+=ch('m',90,980,0.9,t,{dizzy:t>C.x3+1.2})+ch('h',540,980,0.9,t,{dizzy:t>C.x3+0.8});
      out+=chip('🥵 EMPALAGA A TODOS',540,1500,(t-C.x3-1.0)/0.4,'#FFE9D6');}
  }
  // ── TIP: guardarropa de perfumes
  if(t>=C.t&&t<C.end){
    out+='<rect x="90" y="760" width="900" height="30" rx="10" fill="#8A5636" stroke="#1a1a1a" stroke-width="6"/>';
    var B=[['☀️','DÍA','#FFD23F'],['🌙','NOCHE','#4A2C6E'],['💼','OFICINA','#9FD8FF'],['✨','SALIDA','#FF4F8B']];
    B.forEach(function(b,i){var ts=C.t2+i*0.9,k=cl((t-ts)/0.4),on=t>=ts;var x=200+i*226;
      out+='<g transform="translate('+x+',760)"><g transform="scale('+(on?1+0.08*Math.sin((t-ts)*6)*Math.max(0,1-(t-ts)):0.9)+')" opacity="'+(on?1:0.35)+'"><rect x="-56" y="-180" width="112" height="170" rx="26" fill="'+b[2]+'" stroke="#1a1a1a" stroke-width="7"/><rect x="-24" y="-222" width="48" height="46" rx="8" fill="#1a1a1a"/><rect x="-40" y="-150" width="16" height="110" rx="8" fill="#fff" opacity=".5"/><text y="-70" text-anchor="middle" font-size="58">'+b[0]+'</text></g>'+
        (on?'<g transform="translate(0,90) scale('+back(k)+')"><rect x="-96" y="-34" width="192" height="64" rx="32" fill="#fff" stroke="#1a1a1a" stroke-width="5"/><text y="12" text-anchor="middle" font-family="Baloo 2" font-weight="800" font-size="36" fill="#1a1a1a">'+b[1]+'</text></g>':'')+
        (on&&t<ts+1.2?'<circle r="'+(80+(t-ts)*120)+'" cy="-95" fill="none" stroke="#fff" stroke-width="6" opacity="'+(1-(t-ts)/1.2)+'"/>':'')+'</g>';});
    out+=ch('m',40,1010,0.8,t,{wink:t>=C.t3+0.6})+ch('h',590,1010,0.8,t,{q:t>=C.t3});
    if(t>=C.t3)out+=chip('🤔 ¿QUÉ SE HABRÁ PUESTO HOY?',540,1500,(t-C.t3-0.2)/0.4,'#fff',38);
  }
  document.getElementById('sv').innerHTML='<defs><clipPath id="elev"><rect x="290" y="560" width="500" height="840"/></clipPath></defs>'+out;
  renderSubs2(t);
  var E=document.getElementById('end');var eOn=t>=C.end;E.style.display=eOn?'block':'none';
  if(eOn){var k=eio(cl((t-C.end)/0.4));E.style.opacity=k;['eA','eB','eC','eD'].forEach(function(id,i){var kk=cl((t-C.end-0.2-i*0.3)/0.4);document.getElementById(id).style.transform='translateY('+((1-eio(kk))*60)+'px) scale('+L(.85,1,cl(back(kk)))+')';document.getElementById(id).style.opacity=cl(kk*2.5);});}
  hkRender(t);
}
var subLine=-1;
function renderSubs2(t){var cur=null;for(var i=0;i<SUBS.length;i++)if(t>=SUBS[i].t0&&t<SUBS[i].t1+0.25)cur=i;var box=document.getElementById('sub');
  if(cur===null||t>=C.end){box.innerHTML='';subLine=-1;return}var Ln=SUBS[cur];if(subLine!==cur){box.innerHTML=Ln.w.map(function(w){return '<span>'+w.s+'</span>'}).join(' ');subLine=cur;}
  var KEY=/^(proyección|estela|burbuja|firma|íntima|moderada|fuerte|concentración|parfum|calor|ascensor|oficina|invierno|verano|empalagan|guardarropa|misterio|belle|perfumes)$/i;
  for(var j=0;j<Ln.w.length;j++){var on=t>=Ln.w[j].t;var key=KEY.test(Ln.w[j].s.replace(/[¿?,.:…"]/g,''));box.children[j].className=on?(key?'key':'on'):'off';}}
