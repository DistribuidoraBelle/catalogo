
// ═══════════════════════════════════════════════════════════════════════════
// ⚡ CYBERMONDAY (2026-10-24) — capa de campaña para todo el catálogo.
// Se prende sola cuando hay una campaña con plantilla 'cyber' activa y su oferta
// está vigente (o, si la campaña lo pide con previa_dias, unos días antes: fase "previa", cuenta regresiva al
// inicio). También con ?cyber=1 (vista rápida) y ?vista=<slug> (vista previa real).
// Todo lo visual cuelga de html.cyber; si no está activa, no cambia nada.
// ═══════════════════════════════════════════════════════════════════════════
(function(){
  var DEF={
    kicker:'2 · 3 · 4 de noviembre',
    titulo1:'CYBER', titulo2:'MONDAY',
    lead:'Todo el catálogo a <b>precio mayorista</b>. Sin mínimo de compra: llevás 1 y pagás como si llevaras 10.',
    previa_lead:'Del lunes 2 al miércoles 4 de noviembre, <b>todo el catálogo a precio mayorista</b> sin mínimo de compra. Armá tu lista y entrá el lunes.',
    boton1:'Ver perfumes árabes', boton1_tab:'arabes',
    boton2:'Internacionales', boton2_tab:'internacionales',
    stamp_k:'Precio x10', stamp_t:'desde 1 unidad, en todo el catálogo',
    msjs:['Envío gratis en Córdoba','100% originales','Pagás al recibir','Precio x10 sin mínimo'],
    marquee:'CyberMonday · Precio x10 sin mínimo · 2, 3 y 4 de noviembre',
    strip:'Todo el catálogo a <b>precio x10</b> sin mínimo de compra',
    strip_previa:'Del 2 al 4 de noviembre, todo el catálogo a <b>precio x10</b> sin mínimo',
    modo:'auto', previa_dias:'0',   // auto = claro, y oscuro si el cliente tiene el modo oscuro del sitio · 'claro' · 'oscuro'
    ahorro:'si',   // 'no' = no mostrar el -X% en la tarjeta
    ann:['**CYBERMONDAY** 2, 3 y 4 de noviembre','Todo el catálogo a **precio x10** sin mínimo de compra','**Envío gratis** en Córdoba','Productos **100% originales**']
  };
  function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); }
  // texto del admin: se escapa todo y se vuelve a permitir SOLO <b>
  function rich(s){ return esc(s).replace(/&lt;b&gt;/g,'<b>').replace(/&lt;\/b&gt;/g,'</b>'); }
  function textos(c){
    var t={}; Object.keys(DEF).forEach(function(k){ t[k]=DEF[k]; });
    var pt=c&&c.plantilla_textos;
    if(pt&&typeof pt==='object'){ Object.keys(pt).forEach(function(k){ var v=pt[k]; if(v==null||v==='')return; if(Array.isArray(DEF[k])&&!Array.isArray(v))return; t[k]=v; }); }
    return t;
  }
  function fechas(c){
    var ds=null,hs=null;
    (window._ofertas||[]).forEach(function(o){
      if(!c||o.campania_id!==c.id||!o.activa)return;
      if(o.fecha_desde){ var d=new Date(o.fecha_desde).getTime(); if(ds==null||d<ds)ds=d; }
      if(o.fecha_hasta){ var h=new Date(o.fecha_hasta).getTime(); if(hs==null||h>hs)hs=h; }
    });
    if(c&&c._preview){ ds=ds||Date.UTC(2026,10,2,3,0,0); hs=hs||Date.UTC(2026,10,5,2,59,59); }
    return {desde:ds,hasta:hs};
  }
  function qs(k){ try{ return new URLSearchParams(location.search).get(k); }catch(e){ return null; } }
  // ── Vista previa "sin fondo": recorta el fondo blanco de las fotos en el navegador (?sinfondo=1) ──
  var SINFONDO=qs('sinfondo')!=='0';   // recorte de fondo blanco: activo por defecto con el tema Cyber (se apaga con ?sinfondo=0)
  var SF_CACHE={}, SF_N={ok:0,no:0}, SF_NO={};   // SF_NO: ids de productos que NO se recortan (fotos con cajas/frascos blancos: el recorte las arruina)
  var SF_CARGADO=false;
  function sfCargarLista(){ if(SF_CARGADO||typeof apiGet!=='function') return; SF_CARGADO=true; try{ apiGet('configuracion','select=valor&clave=eq.fotos_sin_recorte').then(function(rows){ try{ var arr=JSON.parse((rows&&rows[0]&&rows[0].valor)||'[]'); for(var i=0;i<arr.length;i++) SF_NO[arr[i]]=1; }catch(e){} }).catch(function(){}); }catch(e){} }
  function sfUrl(u){ if(!u||/^(data|blob):/.test(u)) return u; return u+(u.indexOf('?')>=0?'&':'?')+'sf=1'; }
  window._cySinFondo=function(img){
    if(!SINFONDO||!img||img.dataset.sf==='1') return;
    var key=img.getAttribute('src')||''; if(!key) return;
    var pid=parseInt(String(img.id||'').replace('img_',''),10); if(pid&&SF_NO[pid]){ img.dataset.sf='1'; img.classList.add('cy-sf-no'); return; }
    if(SF_CACHE[key]){ img.dataset.sf='1'; img.src=SF_CACHE[key]; return; }
    var W=img.naturalWidth,H=img.naturalHeight; if(!W||!H) return;
    try{
      var esc=Math.min(1,820/Math.max(W,H)), w=Math.round(W*esc), h=Math.round(H*esc);
      var cv=document.createElement('canvas'); cv.width=w; cv.height=h;
      var cx=cv.getContext('2d',{willReadFrequently:true}); cx.drawImage(img,0,0,w,h);
      var dat=cx.getImageData(0,0,w,h), px=dat.data, n=w*h, i, x, y;
      var luz=new Uint8Array(n), sat=new Uint8Array(n);
      for(i=0;i<n;i++){ var r=px[i*4],g=px[i*4+1],b=px[i*4+2]; var mn=r<g?(r<b?r:b):(g<b?g:b), mx=r>g?(r>b?r:b):(g>b?g:b); luz[i]=mn; sat[i]=mx-mn; }
      // inundación ESTRICTA desde los bordes (solo blanco de verdad): los blancos encerrados y las botellas claras quedan
      var vis=new Uint8Array(n), cola=new Int32Array(n), qi=0, qf=0;
      function meter(j){ if(!vis[j]&&luz[j]>=230&&sat[j]<=16){ vis[j]=1; cola[qf++]=j; } }
      for(x=0;x<w;x++){ meter(x); meter((h-1)*w+x); } for(y=0;y<h;y++){ meter(y*w); meter(y*w+w-1); }
      while(qi<qf){ i=cola[qi++]; x=i%w; y=(i-x)/w; if(x>0) meter(i-1); if(x<w-1) meter(i+1); if(y>0) meter(i-w); if(y<h-1) meter(i+w); }
      if(qf<n*0.08){ img.dataset.sf='1'; SF_N.no++; return; } // no era fondo blanco: se deja como está
      // apertura (erosión + dilatación, radio 2): borra los "tentáculos" finos que se metieron por brillos del objeto
      var R=2, t1=new Uint8Array(n), fondo=new Uint8Array(n), d;
      for(y=0;y<h;y++) for(x=0;x<w;x++){ var v=1; for(d=-R;d<=R;d++){ var xx=x+d; var sv=(xx<0||xx>=w)?1:vis[y*w+xx]; if(!sv){ v=0; break; } } t1[y*w+x]=v; }
      var t2=new Uint8Array(n);
      for(y=0;y<h;y++) for(x=0;x<w;x++){ var v2=1; for(d=-R;d<=R;d++){ var yy=y+d; var sv2=(yy<0||yy>=h)?1:t1[yy*w+x]; if(!sv2){ v2=0; break; } } t2[y*w+x]=v2; }
      for(y=0;y<h;y++) for(x=0;x<w;x++){ var v3=0; for(d=-R;d<=R&&!v3;d++){ var x2=x+d; if(x2>=0&&x2<w&&t2[y*w+x2]) v3=1; } t1[y*w+x]=v3; }
      for(y=0;y<h;y++) for(x=0;x<w;x++){ var v4=0; for(d=-R;d<=R&&!v4;d++){ var y2=y+d; if(y2>=0&&y2<h&&t1[y2*w+x]) v4=1; } i=y*w+x; fondo[i]=(v4&&vis[i])?1:0; }
      for(i=0;i<n;i++) if(fondo[i]) px[i*4+3]=0;
      // borde suave: hasta 3 px pegados al fondo, solo si son casi blancos, se van desvaneciendo
      var cur=fondo, k;
      for(k=0;k<3;k++){ var nx=new Uint8Array(n);
        for(y=0;y<h;y++) for(x=0;x<w;x++){ i=y*w+x; if(cur[i]||fondo[i]){ nx[i]=1; continue; }
          if((x>0&&cur[i-1])||(x<w-1&&cur[i+1])||(y>0&&cur[i-w])||(y<h-1&&cur[i+w])){ nx[i]=1; if(luz[i]>=200&&sat[i]<=24&&px[i*4+3]===255){ var ta=Math.max(0,Math.min(1,(240-luz[i])/30)); px[i*4+3]=Math.round(255*ta); } } }
        cur=nx; }
      cx.putImageData(dat,0,0);
      img.dataset.sf='1';
      SF_N.ok++;
      cv.toBlob(function(bl){ if(!bl) return; var u=URL.createObjectURL(bl); SF_CACHE[key]=u; img.src=u; },'image/png');
    }catch(e){ img.dataset.sf='1'; }
  };
  function esVP(c){ return !!(window._catVistaPrevia && typeof _campEsVistaPrevia==='function' && _campEsVistaPrevia(c)); }

  // Estado actual: null (apagado) o {camp, desde, hasta, fase:'previa'|'activa', t}
  window._cyberEstado=function(){
    var camp=null, cs=window._ofertaCampanias||[];
    for(var i=0;i<cs.length;i++){ var c=cs[i]; if(c&&c.plantilla==='cyber'&&(c.activa!==false||esVP(c))){ camp=c; break; } }
    var rapido=(qs('cyber')==='1');
    if(qs('cyber')==='0') return null;   // ?cyber=0: vista previa sin la capa Cyber (p. ej. para ver el tema nuevo)
    if(!camp&&rapido) camp={id:'cyber-preview',_preview:true,nombre:'CyberMonday',slug:'cybermonday',plantilla:'cyber',activa:true};
    if(!camp) return null;
    // ?cyber=1 con la campaña cargada pero todavía no vigente (o ya vencida): vista rápida con sus textos,
    // precios de muestra, aviso y pedidos bloqueados (igual que sin campaña)
    if(rapido&&!camp._preview&&!esVP(camp)){ var fv=fechas(camp), ah=Date.now(); if((fv.desde&&ah<fv.desde)||(fv.hasta&&ah>=fv.hasta)){ camp=Object.assign({},camp,{_preview:true}); } }
    var f=fechas(camp), ahora=Date.now(), fase, forzado=rapido||esVP(camp);
    var t=textos(camp); var previaDias=parseFloat(t.previa_dias); if(!(previaDias>=0)) previaDias=0;
    if(f.hasta&&ahora>=f.hasta&&!forzado) return null;                       // ya terminó: ni rastro
    if(f.desde&&ahora<f.desde){ if(f.desde-ahora>previaDias*864e5&&!forzado) return null; fase='previa'; }
    else fase='activa';
    // ?vista=<slug>: el catálogo ya aplica los precios de la campaña aunque no haya empezado,
    // así que la portada se ve como va a quedar en los días del evento.
    if(esVP(camp)) fase='activa';
    if(camp._preview&&!qs('fase')) fase='activa';   // vista rápida: se ve como en los días del evento (con &fase=previa, los días previos)
    if(rapido&&qs('fase')) fase=qs('fase');
    var modo=String((rapido&&qs('modo'))||t.modo||'auto').toLowerCase();
    var claro=(modo==='claro')?true:(modo==='oscuro')?false:(document.documentElement.getAttribute('data-theme')!=='dark');
    return {camp:camp,desde:f.desde,hasta:f.hasta,fase:fase,t:t,claro:claro};
  };

  var ST=null, FONT=false, OBS=null;
  function fuentes(){
    if(FONT)return; FONT=true;
    try{
      var l=document.createElement('link'); l.rel='stylesheet';
      l.href='https://fonts.googleapis.com/css2?family=Unbounded:wght@700;800&display=swap';
      document.head.appendChild(l);
    }catch(e){}
  }
  function celdas(){ return ['d','h','m','s'].map(function(k,i){ return '<div class="cy-cell"><b data-k="'+k+'">--</b><span>'+['días','horas','min','seg'][i]+'</span></div>'; }).join(''); }
  function heroHTML(st){
    var t=st.t, previa=(st.fase==='previa');
    var proof=(Array.isArray(t.msjs)?t.msjs:[]).slice(0,4).map(function(m){ return '<li>'+esc(m)+'</li>'; }).join('');
    var mq=''; for(var i=0;i<6;i++) mq+='<span>'+esc(t.marquee)+'</span>';
    return '<section class="cy-hero" id="cyHero" data-fase="'+st.fase+'">'+
      '<div class="cy-bg"><i class="cy-glow a"></i><i class="cy-glow b"></i><i class="cy-glow c"></i><i class="cy-grid"></i></div>'+
      '<div class="cy-in">'+
        '<div class="cy-txt">'+
          '<div class="cy-kicker"><span class="cy-dot"></span>'+esc(t.kicker)+'</div>'+
          '<h1 class="cy-tit"><span class="l1">'+esc(t.titulo1)+'</span><span class="l2">'+esc(t.titulo2)+'</span></h1>'+
          '<p class="cy-lead">'+rich(previa?t.previa_lead:t.lead).replace(/x10/g,'<span class="cy-x10">x10</span>')+'</p>'+
          '<div class="cy-ctas">'+
            '<button class="cy-btn p" onclick="_cyberIr(\''+esc(t.boton1_tab)+'\')">'+esc(t.boton1)+' <span class="ar">→</span></button>'+
            '<button class="cy-btn s" onclick="_cyberIr(\''+esc(t.boton2_tab)+'\')">'+esc(t.boton2)+'</button>'+
          '</div>'+
          (proof?'<ul class="cy-proof">'+proof+'</ul>':'')+
        '</div>'+
        '<aside class="cy-side">'+
          '<div class="cy-stamp"><b>x10</b><small><em>'+esc(t.stamp_k)+'</em>'+esc(t.stamp_t)+'</small></div>'+
          '<div class="cy-cd" id="cyCd"><div class="cy-cd-l"><span id="cyCdL">'+(previa?'Arranca en':'Termina en')+'</span><i id="cyCdF"></i></div><div class="cy-cd-cells">'+celdas()+'</div></div>'+
        '</aside>'+
      '</div>'+
    '</section>'+
    '<div class="cy-marquee" id="cyMarquee"><div class="cy-mq">'+mq+'</div></div>';
  }
  function hero(st){
    var home=document.getElementById('homePage'); if(!home)return;
    var h=document.getElementById('cyHero');
    if(h&&h.getAttribute('data-fase')!==st.fase){ h.remove(); var m=document.getElementById('cyMarquee'); if(m)m.remove(); h=null; }
    if(!h) home.insertAdjacentHTML('afterbegin',heroHTML(st));
    // arranque limpio: se recuerda la portada para mostrarla al instante en el próximo ingreso (solo campaña real y activa)
    try{ if(st.fase==='activa'&&!(st.camp&&st.camp._preview)) localStorage.setItem('cy_hero',heroHTML(st)); else localStorage.removeItem('cy_hero'); }catch(e){}
  }
  function strip(st){
    var s=document.getElementById('cyStrip');
    var enInicio=(typeof curTab!=='undefined'&&curTab==='inicio');
    var ocultar=enInicio||(typeof curTab!=='undefined'&&(curTab==='contacto'||curTab==='notas'))||document.body.classList.contains('madre-on');
    if(!s){
      var anc=document.getElementById('catFilters')||document.getElementById('listContainer'); if(!anc||!anc.parentNode)return;
      s=document.createElement('div'); s.id='cyStrip'; anc.parentNode.insertBefore(s,anc);
    }
    var previa=(st.fase==='previa');
    s.innerHTML='<span class="cy-tag">CYBERMONDAY</span><span class="cy-txt-l">'+rich(previa?st.t.strip_previa:st.t.strip)+'</span><span class="cy-chip" id="cyStripCd"></span>';
    s.style.display=ocultar?'none':'';
  }
  function ann(st){
    var tr=document.getElementById('annTrack'), bar=document.getElementById('annBar'); if(!tr||!bar)return;
    if(tr.querySelector('.cy-ann'))return;
    if(window._cyAnnBak==null) window._cyAnnBak=tr.innerHTML;
    var msgs=(Array.isArray(st.t.ann)?st.t.ann:DEF.ann).map(function(m){ return '<span class="ann-msg cy-ann">'+esc(m).replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')+'</span><span class="ann-sep">⚡</span>'; }).join('');
    tr.innerHTML=msgs+msgs; tr.style.animationDuration='34s'; bar.style.display='';
    if(!OBS){ OBS=new MutationObserver(function(){ if(document.documentElement.classList.contains('cyber')&&ST&&!tr.querySelector('.cy-ann')){ window._cyAnnBak=null; ann(ST); } }); OBS.observe(tr,{childList:true}); }
  }
  function pad(n){ return (n<10?'0':'')+n; }
  function tick(){
    if(!ST)return;
    var previa=(ST.fase==='previa'), hasta=previa?ST.desde:ST.hasta, ms=hasta?hasta-Date.now():null;
    var fin=(ms!=null&&ms<=0);
    var cd=document.getElementById('cyCd');
    if(cd){
      var v=fin||ms==null?{d:0,h:0,m:0,s:0}:{d:Math.floor(ms/864e5),h:Math.floor(ms%864e5/36e5),m:Math.floor(ms%36e5/6e4),s:Math.floor(ms%6e4/1e3)};
      ['d','h','m','s'].forEach(function(k){ var b=cd.querySelector('b[data-k="'+k+'"]'); if(!b)return; var tx=(k==='d')?String(v[k]):pad(v[k]); if(b.textContent!==tx){ b.textContent=tx; b.classList.remove('tick'); void b.offsetWidth; b.classList.add('tick'); } });
      cd.classList.toggle('fin',fin);
      var l=document.getElementById('cyCdL'), f=document.getElementById('cyCdF');
      if(l) l.textContent=fin?(previa?'¡Ya arrancó!':'Terminó'):(previa?'Arranca en':'Termina en');
      if(f) f.textContent=(!fin&&ms!=null&&ms<864e5&&!previa)?'¡Últimas horas!':'';
    }
    var chip=document.getElementById('cyStripCd');
    if(chip){
      if(ms==null){ chip.style.display='none'; }
      else if(fin){ chip.textContent=previa?'¡Ya arrancó!':'Terminó'; }
      else { var d=Math.floor(ms/864e5),h=Math.floor(ms%864e5/36e5),m=Math.floor(ms%36e5/6e4),s=Math.floor(ms%6e4/1e3); chip.textContent=(previa?'Arranca en ':'Termina en ')+(d>0?d+'d ':'')+h+'h '+pad(m)+'m'+(d===0?' '+pad(s)+'s':''); chip.classList.toggle('urg',!previa&&ms<864e5); }
    }
    // Cambio de fase (previa → activa, o fin): recalcular a los 2 segundos
    if(fin&&!window._cyFlip){ window._cyFlip=true; setTimeout(function(){ window._cyFlip=false; window._cyberAplicar(); },2000); }
  }
  function apagar(){
    ['cyHero','cyMarquee','cyStrip'].forEach(function(id){ var e=document.getElementById(id); if(e)e.remove(); });
    try{ localStorage.removeItem('cy_hero'); }catch(e){}
    // volver a las tarjetas de siempre
    try{ if(typeof curTab!=='undefined'&&curTab!=='inicio'&&typeof applyFilters==='function'){ _lv.sig=null; applyFilters(); } }catch(e){}
    if(window._cyTimer){ clearInterval(window._cyTimer); window._cyTimer=null; }
    if(window._cyAnnBak!=null){ var tr=document.getElementById('annTrack'); if(tr) tr.innerHTML=window._cyAnnBak; window._cyAnnBak=null; }
  }
  // ── Vista rápida (?cyber=1 sin campaña cargada): para que el carrito cobre lo mismo que muestra el ticket,
  // se inyecta una oferta x10 sin mínimo de muestra sobre todo el catálogo. Nunca sale un pedido con ella:
  // sendWA queda bloqueado y la página lleva un aviso de vista previa.
  var PREVIA_CAMP={id:'cyber-preview',_preview:true,nombre:'CyberMonday',slug:'cybermonday',plantilla:'cyber',activa:true};
  function previaInyectar(){
    var nuevo=false;
    if(!Array.isArray(window._ofertas)) window._ofertas=[];
    if(!window._ofertas.some(function(o){ return o&&o.id==='of-cyber-preview'; })){ window._ofertas.push({id:'of-cyber-preview',producto_id:null,campania_id:'cyber-preview',tipo:'x10_sin_minimo',activa:true,fecha_desde:null,fecha_hasta:null,etiqueta:'CYBERMONDAY'}); nuevo=true; }
    if(!window._ofertaCampaniaProductos||typeof window._ofertaCampaniaProductos!=='object') window._ofertaCampaniaProductos={};
    if(!Object.getOwnPropertyDescriptor(window._ofertaCampaniaProductos,'cyber-preview')){ Object.defineProperty(window._ofertaCampaniaProductos,'cyber-preview',{get:function(){ return (window.allProds||[]).map(function(p){ return p.id; }); },enumerable:true,configurable:true}); nuevo=true; }
    ['_ofertaCampanias','_ofertaCampaniasTodas'].forEach(function(k){ if(!Array.isArray(window[k])) window[k]=[]; if(!window[k].some(function(c){ return c&&c.id==='cyber-preview'; })) window[k].push(PREVIA_CAMP); });
    return nuevo;
  }
  function previaAviso(on){
    var el=document.getElementById('cyPreviaAviso');
    if(!on){ if(el) el.remove(); return; }
    if(el) return;
    el=document.createElement('div'); el.id='cyPreviaAviso'; el.className='cy-previa-aviso'; el.innerHTML='<b>Vista previa</b> · así se ve durante el CyberMonday · los pedidos están deshabilitados';
    document.body.appendChild(el);
  }
  function previaBloquearPedido(){
    if(typeof window.sendWA!=='function'||window.sendWA._cy) return;
    var orig=window.sendWA; var w=function(){ if(ST&&ST.camp&&ST.camp._preview){ try{ showToast('Vista previa: los pedidos se habilitan cuando la campaña esté cargada'); }catch(e){} return; } return orig.apply(this,arguments); }; w._cy=true; window.sendWA=w;
  }
  window._cyberAplicar=function(){
    var st=null; try{ st=window._cyberEstado(); }catch(e){ st=null; }
    var on=!!st, html=document.documentElement, antes=html.classList.contains('cyber'), faseAntes=ST&&ST.fase;
    // arranque temprano (ver <head>): mientras no llegaron campañas y ofertas de la base, no apagar lo que prendió el arranque
    if(!on&&html.classList.contains('cy-pre')&&!(Array.isArray(window._ofertaCampanias)&&Array.isArray(window._ofertas)&&window._ofertaCampanias.length)) return;
    html.classList.remove('cy-pre');
    try{ if(on&&!st.camp._preview&&st.fase==='activa'&&st.hasta){ localStorage.setItem('cy_ventana',JSON.stringify({desde:st.desde||0,hasta:st.hasta,modo:String(st.t&&st.t.modo||'auto')})); } else if(!on&&Array.isArray(window._ofertaCampanias)){ localStorage.removeItem('cy_ventana'); } }catch(e){}
    var previa=!!(on&&st.camp&&st.camp._preview); previaAviso(previa);
    html.classList.toggle('cy-sinfondo',!!(on&&SINFONDO)); if(on&&SINFONDO) sfCargarLista();
    if(previa){ previaBloquearPedido(); if(previaInyectar()){ try{ if(typeof curTab!=='undefined'&&curTab==='inicio'&&typeof renderHomePage==='function') renderHomePage(); else if(typeof applyFilters==='function'){ _lv.sig=null; applyFilters(); } }catch(e){} } }
    if(on) envolverCard();
    ST=st;
    html.classList.toggle('cyber',on);
    html.classList.toggle('cy-claro',!!(on&&st.claro));
    if(!on){ if(antes){ apagar(); if(!DEC_RAF) DEC_RAF=requestAnimationFrame(decorar); } return; }
    fuentes(); hero(st); strip(st); ann(st); observarLista(); if(!DEC_RAF) DEC_RAF=requestAnimationFrame(decorar);
    if(!window._cyTimer) window._cyTimer=setInterval(tick,1000);
    tick();
    // Prendió o cambió de fase mientras el cliente miraba: re-dibujar la lista (precios/badges)
    if((!antes||faseAntes!==st.fase)&&typeof applyFilters==='function'&&typeof curTab!=='undefined'&&curTab!=='inicio'){ try{ _lv.sig=null; applyFilters(); }catch(e){} }
  };
  window._cyberIr=function(slug){
    try{
      var re=new RegExp("switchTab\\(['\"]"+slug+"['\"]");
      var el=Array.prototype.find.call(document.querySelectorAll('.tab'),function(t){ return re.test(t.getAttribute('onclick')||''); });
      if(typeof switchTab==='function') switchTab(slug,el||document.createElement('div'));
      window.scrollTo({top:0,behavior:'smooth'});
    }catch(e){}
  };
  // ── Tarjeta de producto en modo Cyber ───────────────────────────────────────
  // Se parte del HTML de renderCard (con todos sus botones y hooks intactos) y se reacomoda:
  // el precio x10 arriba en grande, los otros tramos tachados debajo, decant a lo ancho.
  function fmtP(v){ try{ return (typeof fmt==='function')?fmt(v):('$'+Math.round(v).toLocaleString('es-AR')); }catch(e){ return '$'+v; } }
  function cardCyber(p,html){
    if(!ST||!html||typeof calcP!=='function') return html;
    var tpl=document.createElement('template'); tpl.innerHTML=html;
    var card=tpl.content.querySelector('.card'); if(!card) return html;
    card.classList.add('cy-card');
    var r=calcP(p);
    var x10=!!(r&&r.oferta&&r.oferta_tipo==='x10_sin_minimo'&&!r.oferta_descartada_por_cc&&(r.precio_efectivo||'pm')==='pm'&&(p.stock_actual||0)>0&&p.tipo!=='cosmetico'&&r.pm>0&&!(p.precio_pestana>0));
    if(x10){
      var row=card.querySelector('.cright .prices-row');
      var popts=row?row.querySelectorAll('.popt'):[];
      if(row&&popts.length){
        var old=[];
        if(r.pe>r.pm) old.push('<span><s>'+fmtP(r.pe)+'</s><small>x3</small></span>');
        if(r.pi>r.pm) old.push('<span><s>'+fmtP(r.pi)+'</s><small>lista</small></span>');
        var pct=(r.pi>r.pm)?Math.round((1-r.pm/r.pi)*100):0;
        var off=(pct>=10&&String(ST.t.ahorro).toLowerCase()!=='no')?'<em class="cy-px-off">−'+pct+'%</em>':'';
        var bloque=document.createElement('div'); bloque.className='cy-px';
        bloque.innerHTML='<div class="cy-px-k"><span class="cy-px-tag">⚡ CyberMonday</span><span class="cy-px-sub">precio x10 · desde 1 unidad</span></div>'+
          '<div class="cy-px-v">'+fmtP(r.pm)+'</div>'+
          (old.length||off?'<div class="cy-px-old">'+old.join('')+off+'</div>':'');
        row.parentNode.insertBefore(bloque,row);
        Array.prototype.forEach.call(popts,function(e){ e.remove(); });
        row.classList.add('cy-row');
        if(!row.children.length) row.remove();
        card.classList.add('cy-conx10');
      }
    }
    return tpl.innerHTML;
  }
  // ── CIRCUITO (listado de las pestañas en modo Cyber) ─────────────────────────────────────
  // Cada producto es una "estación" a un costado de una línea luminosa que baja por la página
  // (izquierda / derecha alternado), con la foto flotando, un ticket con el precio x10 en grande
  // y stickers animados del otro lado. Usa las mismas funciones e ids del catálogo (chgQty,
  // addCart, chgDecan, addDecan, catToggleFav, compartirProducto, verFichaBelle, togNotas,
  // togAcordes, abrirAvisoStock · card_, img_, ph_, qty_, dq-, n_) para no romper nada.
  function esTile(p){
    if(!p||p.tipo==='cosmetico'||p.tipo==='regaleria') return false;
    if(typeof _rgEsReg==='function'&&_rgEsReg(p)) return false;
    if(typeof _esKit==='function'&&_esKit(p)) return false;
    if(Array.isArray(p.escala_unidades)&&p.escala_unidades.length) return false;
    return true;
  }
  function attr(s){ return (typeof _catEscAttr==='function')?_catEscAttr(s):esc(s); }
  function stickerHTML(n,t){
    var k=n%4, msjs=(Array.isArray(t.msjs)&&t.msjs.length)?t.msjs:DEF.msjs;
    if(k===1) return '<div class="cy-stk cy-stk-rueda"><svg viewBox="0 0 200 200" aria-hidden="true"><defs><path id="cyArc'+n+'" d="M100,100 m-72,0 a72,72 0 1,1 144,0 a72,72 0 1,1 -144,0"/></defs><text class="cy-stk-txt"><textPath href="#cyArc'+n+'">'+esc((t.marquee||DEF.marquee).toUpperCase())+' · </textPath></text></svg><span class="cy-stk-rayo">⚡</span></div>';
    if(k===0) return '<div class="cy-stk cy-stk-x10"><b>x10</b><small>sin mínimo<br>de compra</small></div>';
    if(k===2) return '<div class="cy-stk cy-stk-bolt"><svg viewBox="0 0 64 96" aria-hidden="true"><polygon points="38,2 6,54 30,54 22,94 58,38 34,38 44,2" fill="#ffc53d" stroke="#0b1020" stroke-width="3" stroke-linejoin="round"/></svg></div>';
    return '<div class="cy-stk cy-stk-tag"><i></i><span>'+esc(msjs[Math.floor(n/4)%msjs.length])+'</span></div>';
  }
  function tile(p,totalUnits){
    var id=p.id, r=calcP(p), t=ST.t;
    var br=(typeof getBrand==='function')?getBrand(p.nombre):''; var sn=br?p.nombre.replace(br+" - ",""):p.nombre;
    var tags=(typeof parseProductTags==='function')?parseProductTags(sn):{}; var nom=sn.replace(/\s*\|[^|]+\|?\s*/g," ").replace(/\s{2,}/g," ").trim();
    var chips=[]; if(tags.tipo) chips.push('<span>'+esc(tags.tipo)+'</span>'); if(p.ml) chips.push('<span>'+esc(p.ml)+' ml</span>'); else if(tags.ml) chips.push('<span>'+esc(tags.ml)+'</span>');
    var gl=(typeof genLabel==='function')?genLabel(p.genero):''; if(gl) chips.push('<span class="g">'+esc(gl)+'</span>');
    var stock=p.stock_actual||0, nostock=stock===0, st=cstate[id]||{qty:0}, ic=cart[id];
    var fav=(typeof _catFavs!=='undefined'&&_catFavs.indexOf(id)>=0);
    var img=(typeof fixImgUrl==='function')?fixImgUrl(p.imagen_url||''):(p.imagen_url||'');
    var x10=!!(r.oferta&&r.oferta_tipo==='x10_sin_minimo'&&!r.oferta_descartada_por_cc&&(r.precio_efectivo||'pm')==='pm');
    var vip=!!r.oferta_descartada_por_cc||(typeof _esVIPPrecio==='function'&&_esVIPPrecio());
    // Vista rápida (?cyber=1) sin campaña cargada: se muestra el ticket como va a quedar en el evento
    if(!x10&&!vip&&ST.camp&&ST.camp._preview&&ST.fase==='activa'&&r.pm>0) x10=true;
    var pu=p.precio_pestana||0;
    var pct=(r.pi>r.pm&&r.pm>0)?Math.round((1-r.pm/r.pi)*100):0;
    var mostrarOff=x10&&pct>=10&&String(t.ahorro).toLowerCase()!=='no'&&!nostock;
    var ticket='';
    // 2026-11-02 (Ger): sin stock no se muestra el ticket x10 (se leía como disponible); queda el aviso y el decant
    if(nostock){ x10=false; ticket='<div class="cy-tk plain cy-tk-ss"><div class="cy-tk-top"><span>Sin stock</span><em>te avisamos cuando vuelva</em></div></div>'; }
    else if(pu>0){ ticket='<div class="cy-tk"><div class="cy-tk-top"><span>Precio único</span></div><div class="cy-tk-precio">'+fmtP(pu)+'</div></div>'; }
    else if(x10||vip){
      ticket='<div class="cy-tk'+(vip&&!x10?' vip':'')+'"><div class="cy-tk-top"><span>'+(x10?'⚡ Precio x10':'★ Tu precio VIP')+'</span><em>'+(x10?'desde 1 unidad':'siempre')+'</em></div>'+
        '<div class="cy-tk-precio">'+fmtP(r.pm)+'</div>'+
        ((r.pi>r.pm||r.pe>r.pm)?'<div class="cy-tk-antes">'+(r.pi>r.pm?'<span><s>'+fmtP(r.pi)+'</s><i>precio de lista</i></span>':'')+(r.pe>r.pm?'<span><s>'+fmtP(r.pe)+'</s><i>x3</i></span>':'')+'</div>':'')+
      '</div>';
    } else {
      var prev=totalUnits+(st.qty||0)-(ic&&!ic.isDecan?ic.qty:0); var best=prev>0&&typeof getBestSeg==='function'?getBestSeg(prev,r):'pi';
      ticket='<div class="cy-tk plain"><div class="cy-tk-top"><span>Precios</span></div><div class="cy-tk-tiers">'+[['pm','x10'],['pe','x3'],['pi','Lista']].map(function(k){ return r[k[0]]?'<div class="'+(best===k[0]?'lit':'')+'"><small>'+k[1]+'</small><b>'+fmtP(r[k[0]])+'</b></div>':''; }).join('')+'</div></div>';
    }
    var decan='';
    if(r.decan>0&&p.precio_decan!==-1){
      var dq=(typeof decanState!=='undefined'&&decanState[id]!==undefined)?decanState[id]:0, icd=cart['decan_'+id];
      decan='<div class="cy-st-decan"><span class="cy-st-dl">Decant 5 ml <b>'+fmtP(r.decan)+'</b>'+(icd?'<em>'+icd.qty+' en pedido</em>':'')+'</span>'+
        '<span class="cy-st-dq"><button type="button" class="dc-btn" onclick="chgDecan('+id+',-1)">−</button><span class="dc-num" id="dq-'+id+'">'+dq+'</span><button type="button" class="dc-btn" onclick="chgDecan('+id+',1)">+</button><button type="button" class="dc-add" onclick="addDecan('+id+')">+ carrito</button></span></div>';
    }
    var links='';
    if(p.notas) links+='<button type="button" class="cy-lk" data-t="notas" onclick="_cyInfo('+id+',\'notas\',this)">Notas olfativas</button>';
    var acl=[]; try{ acl=Array.isArray(p.acordes)?p.acordes:(p.acordes?JSON.parse(p.acordes):[]); }catch(e){ acl=[]; }
    if(acl&&acl.length) links+='<button type="button" class="cy-lk" data-t="acordes" onclick="_cyInfo('+id+',\'acordes\',this)">Acordes</button>';
    if((p.notas||(typeof _tieneSugeridos==='function'&&_tieneSugeridos(p)))&&!(p.kit_componentes&&p.kit_componentes.length)) links+='<button type="button" class="cy-lk" data-t="parecidos" onclick="_cyInfo('+id+',\'parecidos\',this)">Te puede gustar</button>';
    if(!p.no_aplica_ficha) links+='<button type="button" class="cy-lk cy-st-ficha" onclick="verFichaBelle('+id+',this)">Ficha</button>';
    var grp=(typeof _grpChipsHTML==='function')?(_grpChipsHTML(p)||''):'';
    var gcls=(gl==='Femenino')?' cy-g-f':(gl==='Masculino')?' cy-g-m':' cy-g-u';
    return '<section class="card cy-st'+gcls+(nostock?' cy-nostock':'')+(x10?' cy-conx10':'')+'" id="card_'+id+'" style="position:relative" data-nombre="'+attr(nom)+'">'+
      '<div class="cy-st-card">'+
        '<div class="cy-st-foto">'+
          '<svg class="cy-orbit" viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="100" r="92" fill="none" stroke="url(#cyOrbG)" stroke-width="1.5" stroke-dasharray="4 10"/><circle class="cy-orbit-dot" cx="100" cy="8" r="4"/></svg>'+
          '<i class="cy-st-halo"></i>'+
          '<img id="img_'+id+'" src="'+attr(SINFONDO?sfUrl(img):img)+'" alt="" loading="lazy" decoding="async" style="'+(img?'display:block':'display:none')+'"'+(SINFONDO?' crossorigin="anonymous" onload="_cySinFondo(this)"':'')+' onerror="if(this.getAttribute(\'crossorigin\')!==null){var _s=this.src.replace(/[?&]sf=1$/,\'\');this.removeAttribute(\'crossorigin\');this.removeAttribute(\'onload\');this.src=\'\';this.src=_s;return;}this.style.display=\'none\';var _ph=document.getElementById(\'ph_'+id+'\');if(_ph)_ph.style.display=\'flex\';">'+
          '<div class="ciph" id="ph_'+id+'" style="'+(img?'display:none':'')+'">&#128100;<span>...</span></div>'+
          (typeof _galHTML==='function'?(_galHTML(p)||''):'')+
          '<i class="cy-st-sombra"></i>'+
          (mostrarOff?'<span class="cy-st-off">−'+pct+'%</span>':'')+
          (nostock?'<span class="cy-st-ss">Sin stock</span>':'')+
          '<button type="button" onclick="compartirProducto('+id+')" title="Compartir" class="share-btn cy-st-share"><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7"/><path d="M16 6l-4-4-4 4"/><path d="M12 2v13"/></svg></button>'+
          '<button type="button" onclick="catToggleFav('+id+')" title="Favorito" class="fav-heart cy-st-fav'+(fav?' activo':'')+'" data-pid="'+id+'" style="color:'+(fav?'#e63950':'#4b5578')+'">'+(fav?'&#10084;&#65039;':'&#9825;')+'</button>'+
        '</div>'+
        '<div class="cy-st-info">'+
          (br?'<div class="cy-st-marca"><i></i>'+esc(br)+'</div>':'')+
          '<h3 class="cy-st-nombre" title="'+attr(p.nombre)+'">'+esc(nom)+'</h3>'+
          (chips.length?'<div class="cy-st-chips">'+chips.join('')+'</div>':'')+
          grp+ticket+
          '<div class="price-applied cy-st-applied"></div>'+
          (nostock?'<button type="button" class="cy-st-avisame" onclick="event.stopPropagation();abrirAvisoStock('+id+')">&#128276; Avisame cuando vuelva</button>':
            '<div class="cy-st-acc"><div class="qctrl"><button type="button" class="qb" onclick="chgQty('+id+',-1)">−</button><span class="qn" id="qty_'+id+'">'+(st.qty||0)+'</span><button type="button" class="qb" onclick="chgQty('+id+',1)">+</button></div>'+
            '<button type="button" class="abtn" onclick="addCart('+id+')"'+(st.qty>0?'':' disabled')+'>'+(ic?'Actualizar pedido':'Agregar al pedido')+'</button></div>'+
            (ic?'<div class="icb cy-st-icb">En tu pedido: '+ic.qty+' unid.</div>':''))+
          decan+
          (links?'<div class="cy-st-links">'+links+'</div>':'')+
        '</div>'+
      '</div>'+
    '</section>';
  }
  var TIT={notas:'Notas olfativas',acordes:'Acordes principales',parecidos:'También te puede gustar'};
  function infoHTML(p,tipo){
    var cuerpo='';
    try{
      if(tipo==='notas') cuerpo=(p.notas&&typeof formatNotasFotos==='function')?formatNotasFotos(p.notas):'<div class="cy-info-vacio">Sin notas cargadas.</div>';
      else if(tipo==='acordes') cuerpo=(typeof _acordesRowsHTML==='function')?('<div class="ac-wrap cy-ac">'+_acordesRowsHTML(p)+'</div>'):'';
      else cuerpo=(typeof _parecidosInnerCard==='function')?('<div class="cpar-wrap">'+_parecidosInnerCard(p.id)+'</div>'):'';
    }catch(e){ cuerpo='<div class="cy-info-vacio">No se pudo cargar.</div>'; }
    var tabs=['notas','acordes','parecidos'].filter(function(k){ return (k==='notas'&&p.notas)||(k==='acordes'&&p.acordes)||(k==='parecidos'&&(p.notas||(typeof _tieneSugeridos==='function'&&_tieneSugeridos(p)))); })
      .map(function(k){ return '<button type="button" class="cy-info-tab'+(k===tipo?' on':'')+'" onclick="_cyInfo('+p.id+',\''+k+'\')">'+TIT[k]+'</button>'; }).join('');
    var br=(typeof getBrand==='function')?getBrand(p.nombre):''; var nom=br?p.nombre.replace(br+' - ',''):p.nombre; nom=nom.replace(/\s*\|[^|]+\|?\s*/g,' ').trim();
    return '<div class="cy-info-top"><div><div class="cy-info-k">'+esc(TIT[tipo])+'</div><div class="cy-info-n">'+(br?'<span>'+esc(br)+'</span> ':'')+esc(nom)+'</div></div><button type="button" class="cy-info-x" onclick="_cyInfoCerrar('+p.id+')" aria-label="Cerrar">✕</button></div>'+
      (tabs?'<div class="cy-info-tabs">'+tabs+'</div>':'')+'<div class="cy-info-body">'+cuerpo+'</div>';
  }
  function animarBarras(el){ try{ setTimeout(function(){ el.querySelectorAll('.ac-bar,.ac-bar2').forEach(function(b){ var w=b.style.width; b.style.width='0'; setTimeout(function(){ b.style.width=w; },50); }); },20); }catch(e){} }
  function marcarLinks(st,tipo){ st.querySelectorAll('.cy-lk[data-t]').forEach(function(b){ b.classList.toggle('on',b.getAttribute('data-t')===tipo); }); }
  window._cyInfoCerrar=function(id){
    var st=document.getElementById('card_'+id); if(!st) return;
    marcarLinks(st,null);
    var row=st.closest('.cy-row');
    if(row){ var pan=row.querySelector(':scope > .cy-slot > .cy-info'); if(pan){ var slot=pan.parentNode; pan.remove(); slot.classList.remove('cy-slot-info'); var otro=slot.querySelector(':scope > .cy-st'); if(otro) otro.classList.remove('cy-oculto'); } }
    var inl=st.querySelector('.cy-info.cy-inline'); if(inl) inl.remove();
  };
  window._cyInfo=function(id,tipo,btn){
    var st=document.getElementById('card_'+id); if(!st) return;
    var p=(window.allProds||[]).find(function(x){ return x.id===id; }); if(!p) return;
    var row=st.closest('.cy-row'), movil=window.innerWidth<=680;
    // mismo botón otra vez → cerrar
    var abierto=row&&!movil?row.querySelector(':scope > .cy-slot > .cy-info[data-pid="'+id+'"][data-t="'+tipo+'"]'):st.querySelector('.cy-info.cy-inline[data-t="'+tipo+'"]');
    if(abierto){ window._cyInfoCerrar(id); return; }
    var pan=document.createElement('div'); pan.className='cy-info'; pan.setAttribute('data-pid',id); pan.setAttribute('data-t',tipo); pan.innerHTML=infoHTML(p,tipo);
    if(row&&!movil){
      // cerrar lo que hubiera en la fila (de este o del otro producto) y poner el panel ENFRENTE
      row.querySelectorAll(':scope > .cy-slot > .cy-info').forEach(function(x){ var sl=x.parentNode; x.remove(); sl.classList.remove('cy-slot-info'); });
      row.querySelectorAll(':scope > .cy-slot > .cy-st').forEach(function(x){ x.classList.remove('cy-oculto'); marcarLinks(x,null); });
      var mio=st.parentNode, slots=row.querySelectorAll(':scope > .cy-slot'); var otro=(slots[0]===mio)?slots[1]:slots[0];
      if(!otro) return;
      var otroSt=otro.querySelector(':scope > .cy-st'); if(otroSt) otroSt.classList.add('cy-oculto');
      otro.classList.add('cy-slot-info'); pan.classList.add('cy-enfrente'); otro.appendChild(pan);
    } else {
      pan.classList.add('cy-inline'); var vie=st.querySelector('.cy-info.cy-inline'); if(vie) vie.remove();
      var info=st.querySelector('.cy-st-info'); (info||st).appendChild(pan);
    }
    marcarLinks(st,tipo);
    if(tipo==='acordes') animarBarras(pan);
    try{ if(!movil){ var r=pan.getBoundingClientRect(); if(r.top<80||r.bottom>window.innerHeight) pan.scrollIntoView({behavior:'smooth',block:'nearest'}); } }catch(e){}
  };
  function envolverCard(){
    var orig=window.renderCard; if(typeof orig!=='function'||orig._cy) return;
    var w=function(p,tu){
      if(ST){ try{ if(esTile(p)) return tile(p,tu||0); }catch(e){} }
      var html=orig.apply(this,arguments); if(!ST) return html;
      try{ html=cardCyber(p,html); }catch(e){}
      return '<div class="cy-st cy-st-plain">'+html+'</div>';
    }; w._cy=true; window.renderCard=w;
  }
  // ── Decoración de la grilla: cabecera de la pestaña + bandas cada 8 fichas ────────────────────
  var DEC_OBS=null, DEC_RAF=0;
  function nombrePest(){
    var slug=(typeof curTab!=='undefined')?curTab:''; var t=(window.pestanasCatalogo||[]).find(function(x){ return x.slug===slug; });
    return t&&t.nombre?t.nombre:(slug?slug.charAt(0).toUpperCase()+slug.slice(1):'');
  }
  var REV=null;
  function revelar(c){
    if(!('IntersectionObserver' in window)){ c.querySelectorAll('.cy-row:not(.on)').forEach(function(e){ e.classList.add('on'); }); return; }
    if(!REV) REV=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('on'); REV.unobserve(e.target); } }); },{rootMargin:'0px 0px -6% 0px',threshold:.06});
    c.querySelectorAll('.cy-row:not(.on):not([data-rev])').forEach(function(e){ e.setAttribute('data-rev','1'); REV.observe(e); });
  }
  // pseudo-azar estable por fila: cada sticker queda a una altura distinta (arriba o abajo del nodo),
  // corrido unos píxeles y apenas inclinado, y siempre igual al volver a dibujar la lista
  function azar(k,n){ var x=Math.sin(k*127.1+n*311.7)*43758.5453; return x-Math.floor(x); }
  function nuevaFila(c,ref,k,t){
    var row=document.createElement('div'); row.className='cy-row';
    var arriba=azar(k,1)<.5, top=arriba?(14+azar(k,2)*20):(64+azar(k,2)*20), dx=Math.round((azar(k,3)-.5)*24), rot=((azar(k,4)-.5)*14).toFixed(1);
    row.innerHTML='<div class="cy-slot a"></div><div class="cy-mid"><div class="cy-stk-pos" style="top:'+top.toFixed(1)+'%;left:calc(50% + '+dx+'px);--rot:'+rot+'deg">'+stickerHTML(k,t)+'</div><i class="cy-nodo"></i></div><div class="cy-slot b"></div>';
    c.insertBefore(row,ref); return row;
  }
  function armarFilas(c){
    var sueltas=Array.prototype.slice.call(c.querySelectorAll(':scope > .cy-st'));
    if(!sueltas.length) return;
    var filas=c.querySelectorAll(':scope > .cy-row').length;
    sueltas.forEach(function(st){
      if(st.classList.contains('cy-st-plain')){ // kits/cosméticos: fila propia, a lo ancho
        var rf=document.createElement('div'); rf.className='cy-row cy-row-full on'; c.insertBefore(rf,st); rf.appendChild(st); return;
      }
      // la última fila de productos (aunque en el medio haya quedado un kit a lo ancho) con el lado derecho libre
      var filasP=c.querySelectorAll(':scope > .cy-row:not(.cy-row-full)'); var ult=filasP.length?filasP[filasP.length-1]:null;
      var media=(ult&&!ult.querySelector(':scope > .cy-slot.b > .cy-st')&&!ult.querySelector(':scope > .cy-slot.b > .cy-info'))?ult:null;
      if(media){ media.querySelector(':scope > .cy-slot.b').appendChild(st); }
      else { var row=nuevaFila(c,st,filas++,ST.t); row.querySelector(':scope > .cy-slot.a').appendChild(st); }
    });
  }
  function decorar(){
    DEC_RAF=0; var c=document.getElementById('listContainer'); if(!c) return;
    var on=!!ST&&typeof curTab!=='undefined'&&curTab!=='inicio'&&!document.body.classList.contains('madre-on');
    var hay=c.querySelector(':scope > .cy-st, :scope > .cy-row');
    c.classList.toggle('cy-rio',!!(on&&hay));
    if(!on||!hay){ c.querySelectorAll(':scope > .cy-head, :scope > .cy-rio-fin, :scope > .cy-defs').forEach(function(e){ e.remove(); }); return; }
    if(!c.querySelector(':scope > .cy-defs')){ var d=document.createElement('div'); d.className='cy-defs'; d.innerHTML='<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><linearGradient id="cyOrbG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#22d3ee"/><stop offset=".55" stop-color="#8b5cf6"/><stop offset="1" stop-color="#ff3d8d"/></linearGradient></defs></svg>'; c.insertBefore(d,c.firstChild); }
    armarFilas(c);
    var total=(typeof _lv!=='undefined'&&_lv.prods)?_lv.prods.length:c.querySelectorAll('.cy-st').length;
    var head=c.querySelector(':scope > .cy-head');
    var nombre=nombrePest();
    var hh='<div class="cy-head-k"><span class="cy-dot"></span>CyberMonday · '+(ST.fase==='previa'?'arranca el 2 de noviembre':'2 · 3 · 4 de noviembre')+'</div>'+
      '<h2 class="cy-head-t" data-text="'+attr(nombre)+'">'+esc(nombre)+'</h2>'+
      '<div class="cy-head-sub"><em>Todo a precio x10</em> · sin mínimo de compra</div>'+
      '<div class="cy-head-pasos"><span><b>1</b>Elegí</span><i></i><span><b>2</b>Pagás el x10 desde 1 unidad</span><i></i><span><b>3</b>Lo recibís en el día en Córdoba</span></div>';
    if(!head){ head=document.createElement('div'); head.className='cy-head'; c.insertBefore(head,c.querySelector(':scope > .cy-defs').nextSibling); }
    if(head.getAttribute('data-k')!==hh){ head.innerHTML=hh; head.setAttribute('data-k',hh); }
    var completo=!(typeof _lv!=='undefined'&&_lv.prods&&_lv.n<_lv.prods.length);
    var fin=c.querySelector(':scope > .cy-rio-fin');
    if(completo&&!fin){ fin=document.createElement('div'); fin.className='cy-rio-fin'; fin.innerHTML='<div class="cy-fin-nodo">⚡</div><div class="cy-fin-t">Eso es todo en '+esc(nombre)+'</div><div class="cy-fin-s">Precio x10 en cada perfume, sin mínimo, hasta el 4 de noviembre.</div><div class="cy-fin-b"><button type="button" class="cy-btn p" onclick="toggleCart()">Ver mi pedido →</button><button type="button" class="cy-btn s" onclick="window.scrollTo({top:0,behavior:\'smooth\'})">Subir</button></div>'; c.appendChild(fin); }
    else if(!completo&&fin){ fin.remove(); }
    // el centinela de la carga progresiva tiene que quedar al final (debajo de las filas)
    var sent=c.querySelector(':scope > .lv-sent'); if(sent&&sent.nextElementSibling&&!sent.nextElementSibling.classList.contains('cy-rio-fin')) c.appendChild(sent);
    revelar(c);
    viajero(c);
  }
  // ── El viajero: un frasco que baja por la línea central siguiendo el scroll, con su estela ──
  var VJ={el:null,pos:0,obj:0,vel:0,raf:0,ult:0,ultY:0};
  var VIAJERO_SVG='<div class="cy-vj-estela"><svg viewBox="0 0 120 440" aria-hidden="true">'+
    '<defs>'+
    '<linearGradient id="cyVjG1" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#f9a8d4" stop-opacity=".85"/><stop offset=".5" stop-color="#c4b5fd" stop-opacity=".42"/><stop offset="1" stop-color="#c4b5fd" stop-opacity="0"/></linearGradient>'+
    '<linearGradient id="cyVjG2" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#c4b5fd" stop-opacity=".8"/><stop offset=".55" stop-color="#a5f3fc" stop-opacity=".4"/><stop offset="1" stop-color="#a5f3fc" stop-opacity="0"/></linearGradient>'+
    '<linearGradient id="cyVjG3" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#67e8f9" stop-opacity=".7"/><stop offset=".6" stop-color="#fde68a" stop-opacity=".3"/><stop offset="1" stop-color="#fde68a" stop-opacity="0"/></linearGradient>'+
    '<filter id="cyVjBlur" x="-60%" y="-20%" width="220%" height="140%"><feGaussianBlur stdDeviation="5"/></filter>'+
    '<filter id="cyVjHumo" x="-100%" y="-30%" width="300%" height="160%" color-interpolation-filters="sRGB">'+
      '<feTurbulence type="fractalNoise" baseFrequency="0.016 0.024" numOctaves="2" seed="7" result="n"><animate attributeName="baseFrequency" dur="11s" values="0.016 0.024;0.021 0.03;0.013 0.027;0.016 0.024" repeatCount="indefinite"/></feTurbulence>'+
      '<feDisplacementMap class="cy-vj-d1" in="SourceGraphic" in2="n" scale="9" xChannelSelector="R" yChannelSelector="G"/>'+
    '</filter>'+
    '</defs>'+
    '<g class="cy-vj-humo" filter="url(#cyVjHumo)">'+
    '<path class="cy-vj-onda w" d="M60,440 L60,140" fill="none" stroke="url(#cyVjG1)" stroke-width="42" stroke-linecap="round"/>'+
    '<path class="cy-vj-onda m" d="M60,440 L60,20" fill="none" stroke="url(#cyVjG2)" stroke-width="16" stroke-linecap="round"/>'+
    '<path class="cy-vj-onda f" d="M60,440 L60,12" fill="none" stroke="url(#cyVjG3)" stroke-width="3.5" stroke-linecap="round"/>'+
    '<g class="cy-vj-nubes" filter="url(#cyVjBlur)">'+
      '<circle class="cy-vj-puff" cx="60" cy="440" r="0" fill="#f9a8d4" opacity="0"/>'+
      '<circle class="cy-vj-puff" cx="60" cy="440" r="0" fill="#c4b5fd" opacity="0"/>'+
      '<circle class="cy-vj-puff" cx="60" cy="440" r="0" fill="#a5f3fc" opacity="0"/>'+
      '<circle class="cy-vj-puff" cx="60" cy="440" r="0" fill="#fbcfe8" opacity="0"/>'+
      '<circle class="cy-vj-puff" cx="60" cy="440" r="0" fill="#ddd6fe" opacity="0"/>'+
      '<circle class="cy-vj-puff" cx="60" cy="440" r="0" fill="#fde68a" opacity="0"/>'+
      '<circle class="cy-vj-puff" cx="60" cy="440" r="0" fill="#f9a8d4" opacity="0"/>'+
      '<circle class="cy-vj-puff" cx="60" cy="440" r="0" fill="#c4b5fd" opacity="0"/>'+
      '<circle class="cy-vj-puff" cx="60" cy="440" r="0" fill="#a5f3fc" opacity="0"/>'+
      '<circle class="cy-vj-puff" cx="60" cy="440" r="0" fill="#fbcfe8" opacity="0"/>'+
      '<circle class="cy-vj-puff" cx="60" cy="440" r="0" fill="#ddd6fe" opacity="0"/>'+
      '<circle class="cy-vj-puff" cx="60" cy="440" r="0" fill="#fde68a" opacity="0"/>'+
    '</g>'+
    '</g></svg></div>'+
    '<div class="cy-vj-frasco"><svg viewBox="0 0 64 96" aria-hidden="true">'+
    '<defs><linearGradient id="cyVjV" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#22d3ee"/><stop offset=".55" stop-color="#8b5cf6"/><stop offset="1" stop-color="#ff3d8d"/></linearGradient>'+
    '<linearGradient id="cyVjB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity=".55"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient></defs>'+
    '<rect x="22" y="4" width="20" height="16" rx="5" fill="#0b1020"/><rect x="26" y="7" width="4" height="9" rx="2" fill="#ffffff" opacity=".35"/>'+
    '<rect x="26" y="19" width="12" height="7" rx="2" fill="#ffc53d" stroke="#0b1020" stroke-width="2"/>'+
    '<path d="M14,34 C14,26 50,26 50,34 L52,82 C52,90 12,90 12,82 Z" fill="url(#cyVjV)" stroke="#0b1020" stroke-width="2.5" stroke-linejoin="round"/>'+
    '<path d="M18,36 C18,31 46,31 46,36 L47,60 C47,63 17,63 17,60 Z" fill="url(#cyVjB)"/>'+
    '<text x="32" y="70" text-anchor="middle" font-family="Unbounded,DM Sans,sans-serif" font-weight="700" font-size="6.4" letter-spacing="1.3" fill="#ffffff" opacity=".88">BELLE</text>'+
    '<path d="M24,74 L40,74" stroke="#ffffff" stroke-width=".9" stroke-linecap="round" opacity=".65"/>'+
    '<path d="M19,40 L19.6,60" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" opacity=".7"/>'+
    '</svg></div>';
  function viajero(c){
    if(document.documentElement.classList.contains('lite')) return;
    try{ if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion:reduce)').matches) return; }catch(e){}
    var v=c.querySelector(':scope > .cy-viajero');
    if(!v){ v=document.createElement('div'); v.className='cy-viajero'; v.innerHTML=VIAJERO_SVG; c.appendChild(v);
      v.insertAdjacentHTML('beforeend',BARRA_HTML);
      var fr=v.querySelector('.cy-vj-frasco'); if(fr){ fr.setAttribute('role','button'); fr.setAttribute('title','Buscar perfume'); fr.addEventListener('click',function(e){ e.preventDefault(); e.stopPropagation(); barraToggle(v); }); }
      barraEventos(v); }
    if(VJ.el!==v){ VJ.ondas=null; VJ.puffs=null; VJ.d1=null; VJ.escUlt=0; }
    VJ.el=v; VJ.cont=c;
    if(!VJ.on){ VJ.on=true; window.addEventListener('scroll',vjScroll,{passive:true}); window.addEventListener('resize',vjScroll,{passive:true}); }
    vjScroll();
  }
  // ── Barra de búsqueda que nace de atrás de la botella y se despliega al costado (solo la barra y la lupa) ──
  var BARRA_HTML='<div class="cy-vj-barra" role="search">'+
    '<input type="search" class="cy-vj-q" placeholder="Buscá marca o perfume" autocomplete="off" autocorrect="off" spellcheck="false" aria-label="Buscar perfume">'+
    '<button type="button" class="cy-vj-ir" aria-label="Buscar"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.2" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M15.3,15.3 L20.6,20.6" stroke="currentColor" stroke-width="2.7" stroke-linecap="round"/><path class="cy-vj-glint" d="M7.6,9.2 A3.4,3.4 0 0 1 9.8,7.3" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/></svg></button>'+
  '</div>';
  function barraToggle(v){ if(v.classList.contains('buscando')) barraCerrar(v); else barraAbrir(v); }
  function barraAbrir(v){
    v.classList.add('buscando');
    var inp=v.querySelector('.cy-vj-q');
    setTimeout(function(){ try{ inp.focus({preventScroll:true}); }catch(e){ inp.focus(); } },60);
  }
  function barraCerrar(v){ v.classList.remove('buscando'); var inp=v.querySelector('.cy-vj-q'); if(inp) inp.blur(); }
  function barraIr(v){
    var inp=v.querySelector('.cy-vj-q'), q=(inp.value||'').trim();
    barraCerrar(v);
    if(typeof bqAbrir!=='function') return;
    try{ bqAbrir(); }catch(e){ return; }
    var bs=document.getElementById('bqSrch');
    if(bs){ bs.value=q; try{ if(typeof bqCambio==='function') bqCambio(); }catch(e){} if(!q){ try{ bs.focus(); }catch(e){} } }
  }
  function barraEventos(v){
    var inp=v.querySelector('.cy-vj-q'), ir=v.querySelector('.cy-vj-ir'); if(!inp||!ir) return;
    inp.addEventListener('keydown',function(e){ if(e.key==='Enter'){ e.preventDefault(); barraIr(v); } if(e.key==='Escape') barraCerrar(v); });
    ir.addEventListener('click',function(e){ e.preventDefault(); e.stopPropagation(); barraIr(v); });
    if(!barraEventos.doc){ barraEventos.doc=true;
      document.addEventListener('pointerdown',function(e){ var ab=document.querySelector('.cy-viajero.buscando'); if(ab&&!ab.contains(e.target)) barraCerrar(ab); },true);
      document.addEventListener('keydown',function(e){ if(e.key==='Escape'){ var ab=document.querySelector('.cy-viajero.buscando'); if(ab) barraCerrar(ab); } });
    }
  }
  // ── la nube serpentea: línea central con ondas que viajan desde el frasco hacia afuera, puffs que la siguen ──
  function vjPrep(v){
    VJ.ondas={w:v.querySelector('.cy-vj-onda.w'),m:v.querySelector('.cy-vj-onda.m'),f:v.querySelector('.cy-vj-onda.f')};
    VJ.puffs=[]; var cs=v.querySelectorAll('.cy-vj-puff');
    for(var i=0;i<cs.length;i++) VJ.puffs.push(vjPuffNuevo({el:cs[i]},i/cs.length));
  }
  function vjPuffNuevo(q,edad){
    q.edad=edad; q.vel=0.8+Math.random()*0.6; q.r0=14+Math.random()*13; q.po=0.28+Math.random()*0.2;
    q.lat=(Math.random()<.5?-1:1)*(6+Math.random()*12); q.fase=Math.random()*6.28; q.k=Math.random()*2-1; return q;
  }
  // x de la línea central en s (0 = frasco, 1 = punta). Las fases avanzan con el flujo: las ondas se alejan del frasco, más rápido al scrollear
  function vjX(s,k){
    var ph=VJ.flujo*0.03, amp=1+Math.min(1.1,VJ.vel*1.3), A=(4+38*Math.pow(s,1.15))*amp;
    return 60+A*(0.55*Math.sin(6.6*s-ph+k)+0.3*Math.sin(13.8*s-ph*1.7+2.1*k+1.3)+0.25*Math.sin(3.2*s-ph*0.5+0.7*k+VJ.tiempo*0.35));
  }
  function vjPath(k,hasta){
    var n=20, pts=[], i;
    for(i=0;i<=n;i++){ var s=i/n*hasta; pts.push([vjX(s,k),440-420*s]); }
    pts[0][0]=60;
    var d='M'+pts[0][0].toFixed(1)+','+pts[0][1].toFixed(1);
    for(i=0;i<n;i++){ var p0=pts[i-1]||pts[i], p1=pts[i], p2=pts[i+1], p3=pts[i+2]||p2;
      d+=' C'+(p1[0]+(p2[0]-p0[0])/6).toFixed(1)+','+(p1[1]+(p2[1]-p0[1])/6).toFixed(1)+' '+(p2[0]-(p3[0]-p1[0])/6).toFixed(1)+','+(p2[1]-(p3[1]-p1[1])/6).toFixed(1)+' '+p2[0].toFixed(1)+','+p2[1].toFixed(1); }
    return d;
  }
  function vjSerpiente(dt){
    VJ.tiempo=(VJ.tiempo||0)+dt*0.001;
    var o=VJ.ondas; if(!o) return;
    o.w.setAttribute('d',vjPath(0,0.72)); o.m.setAttribute('d',vjPath(0.35,1)); o.f.setAttribute('d',vjPath(-0.5,1.02));
    var rapidez=1+Math.min(2.5,VJ.vel*2.2);
    for(var i=0;i<VJ.puffs.length;i++){ var q=VJ.puffs[i];
      q.edad+=dt*0.00011*q.vel*rapidez; if(q.edad>=1){ vjPuffNuevo(q,0); }
      var s=q.edad, x=vjX(s,q.k)+q.lat*Math.sin(s*4.2+q.fase)*Math.min(1,s*3), y=440-420*s*0.95;
      var op=q.po*Math.min(1,s*7)*Math.pow(1-s,0.9);
      q.el.setAttribute('cx',x.toFixed(1)); q.el.setAttribute('cy',y.toFixed(1)); q.el.setAttribute('r',(q.r0*(0.45+1.6*s)).toFixed(1)); q.el.setAttribute('opacity',op.toFixed(3));
    }
  }
  function vjScroll(){ if(!VJ.raf) VJ.raf=requestAnimationFrame(vjPaso); }
  function vjPaso(ts){
    VJ.raf=0; var v=VJ.el, c=VJ.cont; if(!v||!c||!c.isConnected||!c.classList.contains('cy-rio')){ if(v) v.style.opacity='0'; return; }
    var rect=c.getBoundingClientRect(), vh=window.innerHeight;
    var head=c.querySelector(':scope > .cy-head'), minY=head?head.offsetHeight+20:40, maxY=c.offsetHeight-120;
    var obj=Math.max(minY,Math.min(maxY,vh*0.44-rect.top));
    if(!VJ.ini){ VJ.ini=true; VJ.pos=obj; }
    var dt=Math.min(48,(ts-(VJ.ult||ts))||16); VJ.ult=ts;
    var d=obj-VJ.pos; VJ.pos+=d*0.14;
    var velInst=Math.abs(VJ.pos-VJ.ultY)/dt; VJ.ultY=VJ.pos;
    VJ.vel=VJ.vel*0.85+velInst*0.15;
    var fuera=rect.bottom<0||rect.top>vh;
    v.style.opacity=fuera?'0':'1';
    v.style.transform='translate(-50%,-50%) translateY('+VJ.pos.toFixed(1)+'px)';
    var inc=Math.max(-7,Math.min(7,d*0.08));
    v.style.setProperty('--vjInc',inc.toFixed(2)+'deg');
    v.style.setProperty('--vjEst',Math.max(.5,Math.min(.95,VJ.vel*0.8+0.5)).toFixed(2));
    v.classList.toggle('subiendo',d<-1);
    // la estela ondula como humo (turbulencia continua); la velocidad solo aumenta cuánto se deforma
    VJ.fase=(VJ.fase||0)+dt*(0.0005+VJ.vel*0.004);
    v.style.setProperty('--vjDash',(-(VJ.fase*120)%35).toFixed(1)+'px');
    // el flujo avanza aun quieto y más rápido al scrollear; mueve las fases de la serpiente
    VJ.flujo=(VJ.flujo||0)+dt*(0.014+VJ.vel*0.11);
    if(!VJ.ondas||!VJ.ondas.w||!VJ.ondas.w.isConnected){ VJ.d1=v.querySelector('.cy-vj-d1'); vjPrep(v); }
    vjSerpiente(dt);
    // la textura de bordes se agita un poco más al scrollear (filtro simple, compatible con Safari)
    var esc=9+Math.min(9,VJ.vel*11); VJ.esc=(VJ.esc||esc)*0.9+esc*0.1;
    if(VJ.d1&&Math.abs((VJ.escUlt||0)-VJ.esc)>0.4){ VJ.escUlt=VJ.esc; VJ.d1.setAttribute('scale',VJ.esc.toFixed(1)); }
    if(!fuera) VJ.raf=requestAnimationFrame(vjPaso);
  }
  function observarLista(){
    var c=document.getElementById('listContainer'); if(!c||DEC_OBS) return;
    DEC_OBS=new MutationObserver(function(){ if(!DEC_RAF) DEC_RAF=requestAnimationFrame(decorar); });
    DEC_OBS.observe(c,{childList:true});
  }
  // Enganches: el inicio se re-dibuja (hero), la pestaña cambia (franja)
  function envolver(nombre,despues){
    var orig=window[nombre]; if(typeof orig!=='function'||orig._cy)return;
    var w=function(){ try{ return orig.apply(this,arguments); } finally { try{ despues(); }catch(e){} } }; w._cy=true; window[nombre]=w;
  }
  function enganchar(){
    envolverCard();
    envolver('renderHomePage',function(){ if(ST) hero(ST); });
    envolver('switchTab',function(){ if(ST){ strip(ST); } });
    // ?vista=<slug>: la vista previa del catálogo busca la pestaña de la campaña; la de
    // CyberMonday no tiene pestaña propia, así que también vale el slug de la campaña.
    var vp=window._campEsVistaPrevia;
    if(typeof vp==='function'&&!vp._cy){
      var w=function(c){ return vp(c)||!!(c&&window._catVistaPrevia&&c.slug===window._catVistaPrevia); }; w._cy=true; window._campEsVistaPrevia=w;
    }
  }
  function arrancar(){
    enganchar();
    // el botón de modo oscuro del sitio cambia data-theme: la variante clara/oscura lo sigue
    try{ new MutationObserver(function(){ if(ST) window._cyberAplicar(); }).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']}); }catch(e){}
    window._cyberAplicar();
    [1200,3000,6000,12000].forEach(function(ms){ setTimeout(function(){ enganchar(); window._cyberAplicar(); },ms); });
    setInterval(window._cyberAplicar,30000);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',arrancar); else arrancar();
})();

