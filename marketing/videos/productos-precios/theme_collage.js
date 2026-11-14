// ═════════ ESTILO C · COLLAGE / STICKER (Fakhar) ═════════
var INK='#111',LIL='#B9A7FF',LIME='#D7FF3A',CREAM='#FFF8EC',RED='#FF3B30';
$('bg').style.background=LIL;
$('bg').innerHTML='<div style="position:absolute;inset:0;background-image:radial-gradient(rgba(17,17,17,.10) 2.4px,transparent 2.8px);background-size:40px 40px"></div>';
var TORN='clip-path:polygon(0 6%,8% 0,20% 5%,33% 0,47% 6%,60% 1%,74% 5%,88% 0,100% 5%,100% 94%,90% 100%,77% 95%,63% 100%,49% 94%,35% 100%,21% 95%,9% 100%,0 94%)';
var AB="font-family:'Archivo Black';color:"+INK+";", MK="font-family:'Permanent Marker';color:"+INK+";";
// S1 · banda negra rasgada con el nombre
var band=el('','left:-40px;top:150px;width:1160px;height:430px;background:'+INK+';'+TORN);
var n1=el(D.name1,AB+'left:70px;top:205px;font-size:190px;line-height:.9;color:'+CREAM+';letter-spacing:-.02em');
var n2=el(D.name2,AB+'left:74px;top:390px;font-size:112px;line-height:.9;color:'+LIME+';letter-spacing:-.02em');
var hand=el(D.hand+' ↓',MK+'left:600px;top:640px;font-size:58px;line-height:1;text-align:center');
// S2 · producto como sticker + notas en papelitos
var stk=el('<img src="sticker.png" style="height:100%">','left:200px;top:690px;height:720px');
var tape=el('','left:300px;top:700px;width:250px;height:66px;background:rgba(255,248,236,.8)');
var notes=D.notes.map(function(n,i){var pos=[[60,1520,-6],[420,1600,4],[740,1500,-3]][i];return el('<span>'+n+'</span>',MK+'left:'+pos[0]+'px;top:'+pos[1]+'px;font-size:54px;background:'+CREAM+';padding:16px 30px;'+TORN.replace('clip-path','clip-path')+';transform:rotate('+pos[2]+'deg)');});
var notesLbl=el('notas:',MK+'left:70px;top:1440px;font-size:44px');
// S3 · precio
var card=el('','left:50px;top:640px;width:980px;height:900px;background:'+CREAM+';'+TORN);
var pr={};
if(!PROMO){
  pr.st=el('<div style="font-family:Archivo Black;font-size:76px;line-height:.9">X10</div><div style="font-family:DM Sans;font-weight:700;font-size:24px;letter-spacing:.06em">UNIDADES</div>','left:770px;top:600px;width:230px;height:230px;border-radius:50%;background:'+LIME+';border:8px solid '+INK+';display:flex;flex-direction:column;align-items:center;justify-content:center;color:'+INK+';transform:rotate(12deg)');
  pr.l1=el('PRECIO X10',AB+'left:110px;top:720px;font-size:56px');
  pr.l2=el('c/u llevando 10 unidades',MK+'left:110px;top:800px;font-size:46px');
  pr.big=el('<span style="background:'+LIME+';padding:0 22px">'+money(D.x10)+'</span>',AB+'left:96px;top:880px;font-size:196px;line-height:1.05;letter-spacing:-.03em');
  pr.r1=el('x3 → '+money(D.x3)+' c/u',MK+'left:120px;top:1160px;font-size:66px');
  pr.r2=el('lista → '+money(D.x1),MK+'left:120px;top:1270px;font-size:66px');
}else{
  pr.st=el('<div style="font-family:Archivo Black;font-size:58px;line-height:.9">PROMO</div><div style="font-family:Archivo Black;font-size:84px;line-height:.9">-'+D.promoPct+'%</div>','left:720px;top:560px;width:300px;height:300px;background:'+LIME+';display:flex;flex-direction:column;align-items:center;justify-content:center;color:'+INK+';clip-path:polygon(50% 0,61% 13%,77% 5%,80% 22%,97% 25%,89% 40%,100% 52%,87% 62%,93% 79%,76% 80%,70% 97%,56% 88%,42% 100%,34% 85%,17% 91%,16% 74%,0 66%,11% 52%,2% 37%,18% 30%,17% 12%,34% 15%)');
  pr.r2=el('<span class="strike">lista '+money(D.x1)+'<i style="background:'+RED+';height:14px;transform:rotate(-4deg) scaleX(0)"></i></span>',MK+'left:110px;top:740px;font-size:64px');
  pr.r1=el('<span class="strike">x3 '+money(D.x3)+' c/u<i style="background:'+RED+';height:14px;transform:rotate(-3deg) scaleX(0)"></i></span>',MK+'left:110px;top:850px;font-size:64px');
  pr.l1=el('AHORA',AB+'left:110px;top:990px;font-size:64px');
  pr.big=el('<span style="background:'+LIME+';padding:0 24px">'+money(D.promo)+'</span>',AB+'left:96px;top:1070px;font-size:200px;line-height:1.05;letter-spacing:-.03em');
  pr.l2=el('','');pr.r1b=null;
}
var mini=el('<img src="sticker.png" style="height:100%">','left:690px;top:1260px;height:300px');
// S4 · CTA
var band2=el('','left:-40px;top:520px;width:1160px;height:520px;background:'+INK+';'+TORN);
var c1=el('PEDILO',AB+'left:70px;top:580px;font-size:220px;line-height:.9;color:'+CREAM);
var c2=el('POR DM',AB+'left:74px;top:790px;font-size:180px;line-height:.9;color:'+LIME);
var c3=el('<div style="font-family:Permanent Marker;font-size:52px;line-height:1">escribí</div><div style="font-family:Archivo Black;font-size:70px;line-height:.95">BELLE</div>','left:620px;top:1330px;width:320px;height:320px;border-radius:50%;background:'+LIME+';border:8px solid '+INK+';display:flex;flex-direction:column;align-items:center;justify-content:center;color:'+INK+';transform:rotate(-8deg)');
var c4=el('dale, te esperamos ✌️',MK+'left:90px;top:1240px;font-size:52px');

function drop(e,t,s,r){var k=seg(t,s,0.45);vis(e,t>=s);T(e,0,-260*(1-e4(k)),lerp(1.15,1,e4(k)),(r||0)+lerp(-12,0,e4(k)),clamp(k*3));}
function render(t){
  var s12=t<P.price,s3=t>=P.price&&t<P.cta,s4=t>=P.cta;
  // S1
  [band,n1,n2,hand].forEach(function(e){vis(e,s12)});
  if(s12){var kb=e4(seg(t,0.05,0.3));T(band,-1200*(1-kb),0,1,-4,1);T(n1,-1200*(1-kb),0,1,-4,1);
    slam(n2,t,1.0,-4);var kh=seg(t,1.6,0.4);vis(hand,t>=1.6);T(hand,0,0,lerp(.4,1,clamp(back(kh))),8,clamp(kh*3));}
  // S2
  vis(stk,s12&&t>=P.prod);vis(tape,s12&&t>=P.prod+0.35);
  if(s12){drop(stk,t,P.prod,5);if(t>P.prod+0.5)stk.style.transform+=' translateY('+(Math.sin(t*1.8)*8)+'px)';T(tape,0,0,1,-28,clamp(seg(t,P.prod+0.35,0.1)*3));
    vis(hand,t>=1.6&&t<P.prod+0.2);
    vis(notesLbl,t>=P.notes);notes.forEach(function(n,i){var s=P.notes+0.15+i*0.5;vis(n,t>=s);var k=seg(t,s,0.35);n.style.opacity=clamp(k*3);n.style.scale=lerp(.5,1,clamp(back(k)));});}
  else{notes.forEach(function(n){vis(n,false)});vis(notesLbl,false);}
  // S3
  var all=[card,pr.st,pr.l1,pr.l2,pr.big,pr.r1,pr.r2,mini];all.forEach(function(e){if(e)vis(e,false)});
  if(s3){var kc=e4(seg(t,P.price,0.3));vis(card,true);T(card,0,400*(1-kc),1,-1.5,1);
    if(!PROMO){popIn(pr.st,t,P.price+0.3,12);slideX(pr.l1,t,P.price+0.35,-700,-1.5);slideX(pr.l2,t,P.price+0.55,-700,-1.5);slam(pr.big,t,P.price+0.8,-1.5);
      var pu=seg(t,P.price+1.4,0.4);if(pu>0&&pu<1)pr.big.style.transform+=' scale('+(1+0.05*Math.sin(pu*Math.PI))+')';
      slideX(pr.r1,t,P.price+1.7,-800,-1.5);slideX(pr.r2,t,P.price+2.1,-800,-1.5);}
    else{popIn(pr.st,t,P.price+0.3,10);slideX(pr.r2,t,P.price+0.4,-800,-1.5);slideX(pr.r1,t,P.price+0.6,-800,-1.5);
      [pr.r2,pr.r1].forEach(function(r,i){var st=r.querySelector('.strike i');st.style.transform='rotate(-4deg) scaleX('+eio(seg(t,P.price+1.0+i*0.25,0.25))+')';});
      slideX(pr.l1,t,P.price+1.5,-700,-1.5);slam(pr.big,t,P.price+1.8,-1.5);var pu=seg(t,P.price+2.4,0.4);if(pu>0&&pu<1)pr.big.style.transform+=' scale('+(1+0.05*Math.sin(pu*Math.PI))+')';}
    if(!PROMO){drop(mini,t,P.price+2.6,8);} else {vis(mini,false);}
  }
  // S4
  [band2,c1,c2,c3,c4].forEach(function(e){vis(e,false)});
  if(s4){var k4=e4(seg(t,P.cta,0.3));[band2,c1].forEach(function(e){vis(e,true);T(e,1200*(1-k4),0,1,-3,1)});slam(c2,t,P.cta+0.4,-3);popIn(c3,t,P.cta+0.9,-8);slideUp(c4,t,P.cta+1.3,0.35,40);}
}
