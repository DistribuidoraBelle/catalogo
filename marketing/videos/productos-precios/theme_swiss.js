// ═════════ ESTILO B · SUIZO (Asad) ═════════
var INK='#111111',RED='#E63022',PAPER='#F1EEE6';
$('bg').style.background=PAPER;
$('bg').innerHTML='<div id="grid" style="position:absolute;inset:0;background-image:linear-gradient(to right,rgba(17,17,17,.20) 2px,transparent 2px),linear-gradient(to bottom,rgba(17,17,17,.20) 2px,transparent 2px);background-size:180px 160px"></div>';
$('wmImg').style.filter='invert(1)';$('wmTxt').style.color=INK;
document.body.style.fontFamily="'Inter Tight'";
var F="font-family:'Inter Tight';color:"+INK+";";
// S1-S2: nombre gigante + punto rojo
var lab=el('<span style="background:'+INK+';color:'+PAPER+';padding:8px 18px;font-weight:700;font-size:34px;letter-spacing:.06em">'+D.brand+'</span><span style="margin-left:16px;font-weight:700;font-size:34px;letter-spacing:.06em">'+D.conc+'</span>',F+'left:72px;top:96px;display:flex;align-items:center');
var nameMask=el('<div id="nm" style="display:inline-block;font-weight:900;font-size:330px;letter-spacing:-.055em;line-height:.9;white-space:nowrap">'+D.name1+'</div>',F+'left:60px;top:170px;height:310px;overflow:hidden;width:1000px');
var nm=nameMask.firstChild;
var name2=el(D.name2,F+'left:76px;top:470px;font-weight:500;font-size:120px;letter-spacing:-.03em');
var dot=el('',"left:0;top:0;width:520px;height:520px;border-radius:50%;background:"+RED);
// panel negro con el producto
var panel=el('<img src="prod.png" style="position:absolute;left:50%;bottom:50px;transform:translateX(-50%);height:640px">',"left:72px;top:640px;width:936px;height:720px;background:linear-gradient(#1D1C1A,#0C0C0C)");
var notes=D.notes.map(function(n,i){return el('<span style="color:'+RED+';font-weight:800;margin-right:26px">0'+(i+1)+'</span>'+n,F+'left:72px;top:'+(1400+i*92)+'px;font-weight:700;font-size:62px;letter-spacing:-.02em')});
var notesLbl=el('NOTAS',F+'left:800px;top:1410px;font-weight:700;font-size:30px;letter-spacing:.12em;opacity:.5');
// S3 precio
var pr={};
if(!PROMO){
  pr.chip=el('<span style="background:'+RED+';color:#fff;padding:10px 22px;font-weight:800;font-size:48px">PRECIO X10</span>',F+'left:72px;top:600px');
  pr.sub=el('c/u llevando 10 unidades',F+'left:72px;top:700px;font-weight:700;font-size:44px');
  pr.big=el(money(D.x10),F+'left:56px;top:770px;font-weight:900;font-size:270px;letter-spacing:-.06em;line-height:1');
  pr.bar=el('',"left:72px;top:1060px;width:936px;height:20px;background:"+RED+";transform-origin:0 50%");
  pr.r1=el('<span>x3 unidades</span><span>'+money(D.x3)+' <small style="font-size:34px">c/u</small></span>',F+'left:72px;top:1120px;width:936px;display:flex;justify-content:space-between;font-weight:800;font-size:66px;border-bottom:3px solid rgba(17,17,17,.4);padding-bottom:14px');
  pr.r2=el('<span>Precio de lista</span><span>'+money(D.x1)+'</span>',F+'left:72px;top:1240px;width:936px;display:flex;justify-content:space-between;font-weight:800;font-size:66px;border-bottom:3px solid rgba(17,17,17,.4);padding-bottom:14px');
}else{
  pr.chip=el('<span style="background:'+RED+';color:#fff;padding:12px 26px;font-weight:900;font-size:84px;letter-spacing:-.02em">PROMO</span><span style="margin-left:22px;font-weight:900;font-size:84px;color:'+RED+'">-'+D.promoPct+'%</span>',F+'left:72px;top:590px;display:flex;align-items:center');
  pr.r2=el('<span>Precio de lista</span><span class="strike">'+money(D.x1)+'<i style="background:'+RED+'"></i></span>',F+'left:72px;top:760px;width:936px;display:flex;justify-content:space-between;font-weight:800;font-size:66px;opacity:.75');
  pr.r1=el('<span>x3 unidades</span><span class="strike">'+money(D.x3)+'<i style="background:'+RED+'"></i></span>',F+'left:72px;top:870px;width:936px;display:flex;justify-content:space-between;font-weight:800;font-size:66px;opacity:.75');
  pr.big=el('<div style="font-family:Inter Tight;font-weight:700;font-size:40px;letter-spacing:.08em;opacity:.85">PRECIO PROMO</div><div style="font-family:Inter Tight;font-weight:900;font-size:215px;letter-spacing:-.06em;line-height:.95">'+money(D.promo)+'</div>',"left:72px;top:1000px;width:936px;padding:30px 40px 36px;background:"+RED+";color:#fff");
  pr.bar=el('','');pr.sub=el('','');
}
var mini=el('<img src="prod.png" style="height:100%">',"left:680px;top:1400px;height:340px");
var head=el(D.name1+'<span style="color:'+RED+'">.</span> <span style="font-weight:500">'+D.name2+'</span>',F+"left:72px;top:250px;font-weight:900;font-size:150px;letter-spacing:-.05em;line-height:1");
// S4 CTA
var c1=el('Pedilo<span style="color:'+RED+'">.</span>',F+'left:60px;top:520px;font-weight:900;font-size:330px;letter-spacing:-.055em;line-height:.9');
var c2=el('por DM',F+'left:72px;top:840px;font-weight:500;font-size:150px;letter-spacing:-.03em');
var c3=el('<span style="background:'+INK+';color:'+PAPER+';padding:16px 30px;font-weight:800;font-size:64px">Escribí BELLE</span>',F+'left:72px;top:1080px');
var c4=el('',"left:72px;top:1240px;width:600px;height:20px;background:"+RED+";transform-origin:0 50%");

function render(t){
  var s12=t<P.price, s3=t>=P.price&&t<P.cta, s4=t>=P.cta;
  $('grid').style.opacity=lerp(0,1,e4(seg(t,0,0.8)))*(0.55+0.45*(1-((t*2)%1)*0.4));
  // S1 · etiqueta y nombre
  vis(lab,s12);slideX(lab,t,0.15,-400);if(!s12)vis(lab,false);
  vis(nameMask,s12);var kn=e4(seg(t,0.45,0.4));nm.style.transform='translateY('+(320*(1-kn))+'px)';
  vis(name2,s12&&t>=1.5);if(s12)slideUp(name2,t,1.5,0.35,80);
  // punto rojo: círculo gigante en el drop → se achica y vuela a ser el punto final del nombre
  var nmW=nm.offsetWidth+60;
  var k1=back(clamp(seg(t,1.0,0.45))), k2=eio(seg(t,2.1,0.45));
  var big=520, small=70; var sz=lerp(big*clamp(k1),small,k2);
  var x0=500,y0=880, x1=nmW+10, y1=170+310-small-30;
  var x=lerp(x0-sz/2+big/2-big/2,x1,k2), y=lerp(y0,y1,k2);
  vis(dot,s12&&t>=1.0);dot.style.width=dot.style.height=sz+'px';dot.style.left=lerp(x0-sz/2,x1,k2)+'px';dot.style.top=lerp(y0-sz/2,y1,k2)+'px';
  // S2 · panel + notas
  vis(panel,s12&&t>=P.prod);if(s12)slideUp(panel,t,P.prod,0.4,300);
  var im=panel.firstChild;var ki=e4(seg(t,P.prod+0.15,0.5));im.style.transform='translateX(-50%) translateY('+(500*(1-ki))+'px)';
  notes.forEach(function(n,i){vis(n,s12&&t>=P.notes+i*0.5);if(s12)slideX(n,t,P.notes+i*0.5,-500);});
  vis(notesLbl,s12&&t>=P.notes);
  // S3 · precio
  [pr.chip,pr.sub,pr.big,pr.bar,pr.r1,pr.r2,mini,head].forEach(function(e){vis(e,false)});
  if(s3){
    slideUp(head,t,P.price,0.3,60);slideX(pr.chip,t,P.price,-600);
    if(!PROMO){slideUp(pr.sub,t,P.price+0.25,0.3,40);slam(pr.big,t,P.price+0.5);var pb=seg(t,P.price+0.5,0.3);if(pb>=1&&t<P.price+1.4){var pu=seg(t,P.price+1.0,0.4);pr.big.style.transform='scale('+(1+0.05*Math.sin(pu*Math.PI))+')';}
      vis(pr.bar,t>=P.price+0.8);pr.bar.style.transform='scaleX('+eio(seg(t,P.price+0.8,0.4))+')';
      slideX(pr.r1,t,P.price+1.5,-900);slideX(pr.r2,t,P.price+2.0,-900);}
    else{slideX(pr.r2,t,P.price+0.4,-900);slideX(pr.r1,t,P.price+0.6,-900);
      [pr.r2,pr.r1].forEach(function(r,i){var st=r.querySelector('.strike i');st.style.transform='scaleX('+eio(seg(t,P.price+1.0+i*0.25,0.25))+')';});
      slam(pr.big,t,P.price+1.6);var pu=seg(t,P.price+2.4,0.4);if(pu>0&&pu<1)pr.big.style.transform='scale('+(1+0.05*Math.sin(pu*Math.PI))+')';}
    popIn(mini,t,P.price+(PROMO?2.6:2.5));if(t>P.price+3)mini.style.transform+=' translateY('+(Math.sin(t*2)*6)+'px)';
  }
  // S4 · CTA
  [c1,c2,c3,c4].forEach(function(e){vis(e,false)});
  if(s4){slideUp(c1,t,P.cta,0.35,200);slideUp(c2,t,P.cta+0.3,0.35,120);popIn(c3,t,P.cta+0.8);vis(c4,t>=P.cta+1.1);c4.style.transform='scaleX('+eio(seg(t,P.cta+1.1,0.4))+')';}
}
