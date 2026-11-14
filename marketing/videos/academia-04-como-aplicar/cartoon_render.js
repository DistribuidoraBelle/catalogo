// ─────────────────────── render(t) ───────────────────────
var LAYERS=[L1,L2,L3,L4,L5];
function at(e,x,y,s,r,o){e.style.transform='translate('+x+'px,'+y+'px) scale('+(s==null?1:s)+') rotate('+(r||0)+'deg)';if(o!=null)e.style.opacity=o;}
function show(e,on){e.style.visibility=on?'visible':'hidden'}
function popAt(e,t,s){var k=seg(t,s,0.4);show(e,t>=s);var sc=lerp(.2,1,clamp(back(k)));e.style.transform='scale('+sc+')';e.style.opacity=clamp(k*3);}
function blink(ch,t){var b=(t%3.1)<0.12?0.1:1;ch.eyes.setAttribute('transform','translate(0,'+(470*(1-b))+') scale(1,'+b+')');}
// botella que vuela a un punto: nariz del atomizador (≈ x+62,y+40 del svg) queda junto al objetivo
function bottleTo(wrap,svg,t,path,flip){ // path: [[t,x,y],...]
  var p=path[0],q=path[0];for(var i=0;i<path.length;i++){if(t>=path[i][0])p=path[i];if(i+1<path.length&&t>=path[i][0])q=path[i+1];}
  var k=eio(seg(t,p[0],0.4));var x=lerp(p[1],q===p?p[1]:q[1],0),y=p[2];
  // interpolar desde el punto anterior
  var idx=path.indexOf(p);var prev=idx>0?path[idx-1]:p;var kk=eio(seg(t,p[0],0.45));x=lerp(prev[1],p[1],kk);y=lerp(prev[2],p[2],kk);
  wrap.style.transform='translate('+x+'px,'+y+'px)'+(flip?' scaleX(-1)':'');
  var press=0;for(var i=0;i<path.length;i++){var d=t-path[i][0]-0.45;if(d>0&&d<0.5)press=Math.sin(d/0.5*Math.PI);}
  svg.style.transform='rotate('+(-8-6*press)+'deg)';
  return {x:x,y:y};
}
function render(t){
  var C=CUES;
  renderSubs(t);
  var tips=['t1','t2','t3','t4','t5','end'];
  var cur=-1;for(var i=0;i<5;i++)if(t>=C[tips[i]]&&t<C[tips[i+1]])cur=i;
  BG.style.background=cur>=0?TIPS[cur].bg:'#F4B63A';
  CONF.forEach(function(c,i){c.style.transform='translateY('+(Math.sin(t*0.9+i)*22)+'px) rotate('+(t*30*(i%2?1:-1))+'deg)';});
  LAYERS.forEach(function(L,i){L.style.display=(i===cur)?'block':'none';});
  HD.style.display=cur>=0?'block':'none';
  if(cur>=0){var T0=C[tips[cur]];var tp=TIPS[cur];if(HDnum.textContent!=String(tp.n)){HDnum.textContent=tp.n;HDtit.innerHTML=tp.title;HDemo.textContent=tp.emo;}
    var kh=seg(t,T0,0.45);HDnum.style.transform='scale('+lerp(.2,1,clamp(back(kh)))+') rotate('+lerp(-90,0,e4(kh))+'deg)';
    HDtit.style.transform='translateX('+(400*(1-e4(seg(t,T0+0.15,0.4))))+'px)';HDtit.style.opacity=clamp(seg(t,T0+0.15,0.2)*2);
    HDemo.style.transform='scale('+lerp(0,1,clamp(back(seg(t,T0+0.35,0.4))))+') rotate('+(Math.sin(t*3)*10)+'deg)';
    SC.style.transform='translateY('+(60*(1-e4(seg(t,T0,0.4))))+'px)';SC.style.opacity=clamp(seg(t,T0,0.25)*2);}
  // ── T1 crema
  if(cur===0){
    var tk=e4(seg(t,C.t1a,0.5));at(tube,lerp(1100,640,tk),lerp(-220,250,tk),1,lerp(30,-20,tk));
    var sq=seg(t,C.t1a+0.5,1.1);if(sq>0&&sq<1)tube.firstChild.style.transform='scaleX('+(1-0.12*Math.abs(Math.sin(sq*Math.PI*3)))+')';
    var cw=700*eio(seg(t,C.t1a+0.5,1.2));cream.setAttribute('width',cw);creamGloss.setAttribute('width',Math.max(0,cw-80));
    if(t>C.t1b+0.3)at(tube,lerp(640,1200,eio(seg(t,C.t1b,0.5))),250,1,-20);
    show(dry,t<C.t1a+0.4);if(t<C.t1a+0.4)popAt(dry,t,C.t1+0.4);
    mol1.forEach(function(m,i){var s=C.t1b+i*0.12;var k=seg(t,s,0.5);show(m,t>=s);var x=170+((i*61)%620),y0=-60,y1=440+((i*13)%30);at(m,x,lerp(y0,y1,e4(k))+(k>=1?Math.sin(t*4+i)*3:0),1,0);});
    cage.forEach(function(c,i){var s=C.t1b+i*0.12+0.5;show(c,t>=s);var x=170+((i*61)%620)-4,y=400+((i*13)%30);var k=seg(t,s,0.3);at(c,x,y,lerp(.2,1,clamp(back(k)))*(1+0.15*Math.sin(t*6+i)),0,1);});
    show(meter,t>=C.t1c);if(t>=C.t1c){meter.style.transform='translateY('+(120*(1-e4(seg(t,C.t1c,0.4))))+'px)';$('mfill').style.width=(92*eio(seg(t,C.t1c+0.3,1.4)))+'%';}
  }
  // ── T2 puntos de pulso
  if(cur===1){
    blink(CH,t);CH.head.setAttribute('transform','rotate('+(Math.sin(t*1.3)*2)+' 540 650)');
    var labT=[C.t2b,null,C.t2c,null,C.t2d,null];
    pulses.forEach(function(p,i){var s=C.t2a+i*0.12;show(p,t>=s);var k=seg(t,s,0.35);var beat=1+0.22*Math.pow(Math.abs(Math.sin(t*5)),6);p.style.transform='scale('+(lerp(.2,1,clamp(back(k)))*beat)+')';});
    plabs.forEach(function(l,i){if(!l)return;var s=labT[i];show(l,t>=s);var k=seg(t,s,0.35);l.style.transform='scale('+lerp(.3,1,clamp(back(k)))+')';});
    popAt(heart,t,C.t2a+0.2);if(t>C.t2a+0.6)heart.style.transform='scale('+(1+0.15*Math.pow(Math.abs(Math.sin(t*5)),6))+')';
    var path=[[C.t2b-0.6,1150,700],[C.t2b,610,690],[C.t2c,760,400],[C.t2d,810,860],[C.t2d+0.9,310,860],[C.t2e+0.2,1150,300]];
    show(sb2,t>=C.t2b-0.6&&t<C.t2e+0.7);var bp=bottleTo(sb2,SB2,t,path,false);
    [[C.t2b,588,760],[C.t2c,742,470],[C.t2d,788,930],[C.t2d+0.9,292,930]].forEach(function(s){});
    var act=null;[[C.t2b,588,760],[C.t2c,742,470],[C.t2d,788,930],[C.t2d+0.9,292,930]].forEach(function(s){if(t>=s[0]+0.4&&t<s[0]+1.3)act=s;});
    if(act)sprayFx(M2,t,act[0]+0.45,bp.x+62,bp.y+40,act[1],act[2],0.8);else M2.forEach(function(m){show(m,false)});
    popAt(thermo,t,C.t2e);
    heat.forEach(function(h,i){var on=t>=C.t2e+0.2;show(h,on);var k=((t*0.8+i*0.33)%1);h.style.transform='translateY('+(-k*220)+'px)';h.style.opacity=on?(1-k)*0.9:0;});
    aroma.forEach(function(a,i){var s=C.t2f+i*0.2;show(a,t>=s);var p=PULSE[[0,2,4,3,5][i]];var k=((t-s)*0.5)%1;at(a,p[0]-30+Math.sin((t+i)*2)*30,p[1]-60-k*360,1,0,t>=s?1-k:0);});
  }
  // ── T3 nunca frotes
  if(cur===2){
    var meet=e4(seg(t,C.t3,0.5));var rub=(t>C.t3+0.5&&t<C.t3b+0.3)?Math.sin(t*16)*34:0;var sep=eio(seg(t,C.t3b+1.2,0.6));
    armA.style.transform='translate('+(lerp(-320,0,meet)+rub-260*sep)+'px,0)';armB.style.transform='translate('+(lerp(320,0,meet)-rub+260*sep)+'px,0) scaleX(-1)';
    mol3.forEach(function(m,i){var on=t>=C.t3+0.4&&t<C.t3b;show(m,on);at(m,470+((i*29)%120)+rub*0.5,480+((i*41)%110),1+0.1*Math.sin(t*10+i),0,1);});
    frag.forEach(function(f,i){var s=C.t3b;var k=t-s;var on=k>0&&k<1.6;show(f,on);if(!on)return;var ang=i/16*Math.PI*2;var v=420+((i*37)%200);at(f,520+Math.cos(ang)*v*k,520+Math.sin(ang)*v*k+500*k*k,1,k*400,1-k/1.6);});
    show(crack,t>=C.t3b&&t<C.t3b+0.8);if(t>=C.t3b)crack.style.transform='scale('+lerp(.3,1.3,e4(seg(t,C.t3b,0.3)))+')';
    stampIn(st3,t,C.t3+0.9,-8);if(t>C.t3b+1.1)show(st3,false);
    show(ok3,t>=C.t3b+1.3);if(t>=C.t3b+1.3)ok3.style.transform='scale('+lerp(.3,1,clamp(back(seg(t,C.t3b+1.3,0.4))))+')';
  }
  // ── T4 15 cm
  if(cur===3){
    var kb=e4(seg(t,C.t4,0.5));sb4.style.transform='translate('+lerp(-300,120,kb)+'px,340px) scaleX(-1)';SB4.style.transform='rotate(-8deg)';show(sb4,true);
    var tw=420*eio(seg(t,C.t4+0.6,0.8));tape.style.width=tw+'px';show(tape,t>=C.t4+0.6);
    popAt(tapeLbl,t,C.t4+1.2);
    if(t>C.t4+1.6){var ph=((t-C.t4-1.6)%1.2);sprayFx(M4,t,t-ph,330,400,800,600,0.9);}else M4.forEach(function(m){show(m,false)});
    mini.forEach(function(m,i){popAt(m,t,C.t4b+i*0.45);});
  }
  // ── T5 ropa y pelo
  if(cur===4){
    blink(CH5,t);
    var path=[[C.t5-0.2,1150,400],[C.t5+0.3,700,170],[C.t5+1.9,780,870],[C.t5b+0.4,1150,600]];
    show(sb5,t<C.t5b+0.9);var bp=bottleTo(sb5,SB5,t,path,false);
    var act=null;[[C.t5+0.3,560,280],[C.t5+1.9,560,930]].forEach(function(s){if(t>=s[0]+0.4&&t<s[0]+1.4)act=s;});
    if(act)sprayFx(M5,t,act[0]+0.45,bp.x+62,bp.y+40,act[1],act[2],0.8);else M5.forEach(function(m){show(m,false)});
    spark5.forEach(function(s,i){var st=(i<5?C.t5+1.0:C.t5+2.6)+(i%5)*0.12;show(s,t>=st);var cx=i<5?[400,480,560,640,700][i%5]:[420,500,580,660,720][i%5],cy=i<5?260+((i*37)%80):900+((i*29)%60);at(s,cx,cy,(0.7+0.4*Math.abs(Math.sin(t*4+i))),0,1);});
    popAt(clock5,t,C.t5b);if(t>=C.t5b){var h=$('ch5'),m=$('cm5');h.style.transform='rotate('+(t*120)+'deg)';m.style.transform='rotate('+(t*720)+'deg)';}
  }
  // ── cierre
  var eOn=t>=C.end;END.style.display=eOn?'block':'none';END.style.visibility='visible';
  if(eOn){var k=e4(seg(t,C.end,0.4));END.style.opacity=k;
    pop($('endA'),t,C.end+0.2,0,30);pop($('endB'),t,C.end+0.45,-80,0);pop($('endC'),t,C.end+0.8,0,80);pop($('endD'),t,C.end+1.3,0,30);
    blink(ECH,t);ECH.w.style.transform='translate(420px,'+(1040+Math.sin(t*3)*12)+'px) scale(.5)';
    $('sub').style.opacity=1-k;} else $('sub').style.opacity=1;
  hkRender(t);
}
