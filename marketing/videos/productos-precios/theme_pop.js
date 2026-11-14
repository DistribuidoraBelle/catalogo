// ═════════ ESTILO A · PÓSTER POP (Go Mango) ═════════
var OR='#FF5A1F',INK='#111111',YEL='#FFD23F',PAP='#FFFFFF';
var LG="font-family:'League Gothic';text-transform:uppercase;line-height:.82;white-space:nowrap;letter-spacing:.01em;", AB="font-family:'Archivo Black';";
var lk=document.createElement('link');lk.rel='stylesheet';lk.href='https://fonts.googleapis.com/css2?family=League+Gothic&display=swap';document.head.appendChild(lk);
function letters(e){var s=e.textContent;e.innerHTML=s.split('').map(function(c){return '<span style="display:inline-block">'+(c===' '?'&nbsp;':c)+'</span>'}).join('');return [].slice.call(e.children);}
function slamL(arr,t,s,dist){arr.forEach(function(sp,i){var k=e4(seg(t,s+i*0.033,0.2));sp.style.transform='translateY('+((i%2?1:-1)*dist*(1-k))+'px)';});}
function fitW(e,target){var w=0;[].forEach.call(e.children,function(c){w+=c.offsetWidth});var fs=parseFloat(e.style.fontSize);e.style.fontSize=(fs*target/w)+'px';e.style.left=((1080-target)/2)+'px';}
var goBig=el(D.name1,LG+'left:0;top:520px;font-size:1300px;color:'+INK);var L1=letters(goBig);
var mBig=el(D.name2,LG+'left:0;top:640px;font-size:700px;color:'+YEL);var L2=letters(mBig);
var go=el(D.name1,LG+'left:-40px;top:-90px;font-size:760px;color:'+INK);
var mg=el(D.name2,LG+'left:-24px;top:560px;font-size:640px;color:'+YEL);
var tag=el('NUEVO',AB+'right:64px;top:96px;background:'+INK+';color:'+YEL+';font-size:46px;padding:14px 28px');
var prod=el('<img src="prod.png" style="height:100%">','right:-70px;top:830px;height:880px');
var notes=D.notes.map(function(n,i){return el(n,AB+'left:64px;top:'+(930+i*150)+'px;font-size:72px;background:'+PAP+';color:'+INK+';padding:18px 34px 22px;transform:rotate('+[-4,3,-2][i]+'deg)')});
var nl=el('NOTAS',AB+'left:68px;top:860px;font-size:38px;color:'+INK);
// precio
var pr={};
if(!PROMO){
  pr.chip=el('PRECIO X10',AB+'left:64px;top:300px;background:'+YEL+';color:'+INK+';font-size:64px;padding:12px 30px');
  pr.sub=el('c/u llevando 10 unidades',AB+'left:64px;top:420px;color:'+PAP+';font-size:46px');
  pr.big=el(money(D.x10),LG+'left:46px;top:500px;font-size:470px;color:'+YEL);
  pr.r1=el('<span style="opacity:.6">X3</span>&nbsp;&nbsp;'+money(D.x3)+'<span style="font-size:36px"> c/u</span>',AB+'left:64px;top:1000px;background:'+PAP+';color:'+INK+';font-size:76px;padding:16px 34px;transform:rotate(-2deg)');
  pr.r2=el('<span style="opacity:.6">LISTA</span>&nbsp;&nbsp;'+money(D.x1),AB+'left:64px;top:1160px;background:'+PAP+';color:'+INK+';font-size:76px;padding:16px 34px;transform:rotate(1.5deg)');
}else{
  pr.chip=el('PROMO&nbsp;<span style="color:'+OR+'">-'+D.promoPct+'%</span>',AB+'left:64px;top:280px;background:'+YEL+';color:'+INK+';font-size:96px;padding:12px 34px');
  pr.r2=el('<span class="strike">LISTA '+money(D.x1)+'<i style="background:'+OR+';height:14px"></i></span>',AB+'left:64px;top:470px;color:'+PAP+';font-size:66px;opacity:.85');
  pr.r1=el('<span class="strike">X3 '+money(D.x3)+'<i style="background:'+OR+';height:14px"></i></span>',AB+'left:64px;top:570px;color:'+PAP+';font-size:66px;opacity:.85');
  pr.big=el('<div style="font-family:Archivo Black;font-size:44px;line-height:1;margin-bottom:6px">PRECIO PROMO</div>'+money(D.promo),LG+'left:64px;top:700px;font-size:400px;color:'+INK+';background:'+YEL+';padding:30px 40px 10px;line-height:.85');
  pr.sub=el('','');
}
var mini=el('<img src="prod.png" style="height:100%">','left:610px;top:1240px;height:440px');
// CTA
var c1=el('PEDILO',LG+'left:0;top:300px;font-size:620px;color:'+INK);var LC1=letters(c1);
var c2=el('POR DM',LG+'left:56px;top:830px;font-size:420px;color:'+PAP);var LC2=letters(c2);
var c3=el('ESCRIBÍ BELLE',AB+'left:64px;top:1240px;background:'+INK+';color:'+YEL+';font-size:70px;padding:16px 34px');
var fitted=false;
function fitBox(e,maxW){var w=e.offsetWidth;if(w>maxW){var fs=parseFloat(e.style.fontSize);e.style.fontSize=(fs*maxW/w)+'px';}}
function render(t){
  if(!fitted&&document.fonts.status==='loaded'&&document.fonts.check('100px "League Gothic"')){fitted=true;fitW(goBig,1150);fitW(mBig,1100);fitW(c1,1100);fitW(c2,960);c2.style.left='60px';fitBox(pr.big,950);goBig.style.top=(960-parseFloat(goBig.style.fontSize)*0.41)+'px';mBig.style.top=(960-parseFloat(mBig.style.fontSize)*0.41)+'px';}
  var ph=t<1.0?0:t<P.prod?1:t<P.price?2:t<P.cta?3:4;
  $('bg').style.background=[OR,INK,OR,INK,OR][ph];
  // sacudón al aterrizar
  var j=0;[0.08,1.0,P.prod+0.3,P.price,P.price+0.5,P.cta].forEach(function(e){if(t>=e&&t<e+0.15){var k=1-(t-e)/0.15;j=18*k*k;}});$('W').style.transform='translateY('+j+'px)';
  [goBig,mBig,go,mg,tag,prod,nl,mini,c1,c2,c3].concat(notes).forEach(function(e){vis(e,false)});
  [pr.chip,pr.sub,pr.big,pr.r1,pr.r2].forEach(function(e){vis(e,false)});
  if(ph===0){vis(goBig,true);slamL(L1,t,0.08,1700);}
  if(ph===1){vis(mBig,true);slamL(L2,t,1.0,1700);}
  if(ph===2){vis(go,true);vis(mg,true);vis(tag,true);slideX(tag,t,P.prod+0.6,500);
    var kp=1-Math.pow(2,-10*seg(t,P.prod,0.4));vis(prod,true);T(prod,0,1400*(1-kp)+Math.sin(t*1.6)*10,1,-3*(1-kp)+Math.sin(t*1.1)*1.2);
    vis(nl,t>=P.notes-0.1);slideX(nl,t,P.notes-0.1,-500);notes.forEach(function(n,i){var s=P.notes+i*0.5;vis(n,t>=s);var k=e4(seg(t,s,0.2));var out=Math.pow(seg(t,P.price-0.35,0.2),3);n.style.transform='translateX('+(-900*(1-k)-900*out)+'px) rotate('+[-4,3,-2][i]+'deg)';});}
  if(ph===3){
    if(!PROMO){slideX(pr.chip,t,P.price,-700);slideUp(pr.sub,t,P.price+0.25,0.3,40);slam(pr.big,t,P.price+0.5);var pu=seg(t,P.price+1.0,0.45);if(pu>0&&pu<1)pr.big.style.transform='scale('+(1+0.06*Math.sin(pu*Math.PI))+')';
      slideX(pr.r1,t,P.price+1.5,-900,-2);slideX(pr.r2,t,P.price+2.0,-900,1.5);}
    else{slideX(pr.chip,t,P.price,-700);slideX(pr.r2,t,P.price+0.4,-900);slideX(pr.r1,t,P.price+0.6,-900);
      [pr.r2,pr.r1].forEach(function(r,i){r.querySelector('.strike i').style.transform='scaleX('+eio(seg(t,P.price+1.0+i*0.25,0.25))+')';});
      slam(pr.big,t,P.price+1.6);var pu=seg(t,P.price+2.3,0.45);if(pu>0&&pu<1)pr.big.style.transform='scale('+(1+0.06*Math.sin(pu*Math.PI))+')';}
    var km=1-Math.pow(2,-10*seg(t,P.price+(PROMO?2.6:2.5),0.45));vis(mini,t>=P.price+(PROMO?2.6:2.5));T(mini,0,900*(1-km)+Math.sin(t*1.6)*8,1,3,1);
  }
  if(ph===4){vis(c1,true);slamL(LC1,t,P.cta,1700);vis(c2,t>=P.cta+0.35);slamL(LC2,t,P.cta+0.35,1500);popIn(c3,t,P.cta+0.9,-2);}
}
