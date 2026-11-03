// ── Belle · tema nuevo (estilo fijo): tipografía, animaciones y marcas con foto. Se apaga solo mientras el tema Cyber está activo. ──
(function(){
  var html=document.documentElement;
  function qs(k){ try{ return new URLSearchParams(location.search).get(k); }catch(e){ return null; } }
  if(qs('nuevo')==='0') return;
  // En el catálogo real el tema nuevo arranca solo cuando termina el CyberMonday (4/11/2026 23:59:59 hora Argentina).
  // Antes de esa fecha el catálogo queda como está (y del 2 al 4 manda el tema Cyber). ?nuevo=1 lo muestra antes.
  var SUAVE=__NV_SUAVE__;
  var REAL=__NV_REAL__, DESDE=Date.UTC(2026,10,5,3,0,0);
  if(REAL && qs('nuevo')!=='1' && Date.now()<DESDE){
    var faltan=DESDE-Date.now(); if(faltan<36e5) setTimeout(function(){ try{ location.reload(); }catch(e){} }, faltan+1500);
    return;
  }
  // ── Vista clásica: quien prefiera el catálogo de siempre lo elige con el botón "Vista clásica" y queda guardado
  //    en su navegador. En ese caso el tema nuevo no se aplica y solo se deja un botoncito "Vista nueva" para volver.
  var CLASICA=false; try{ CLASICA=localStorage.getItem('nv_clasica')==='1'; }catch(e){}
  window._nvClasica=function(on){ try{ if(on) localStorage.setItem('nv_clasica','1'); else localStorage.removeItem('nv_clasica'); }catch(e){} try{ location.reload(); }catch(e){} };
  if(CLASICA && qs('nuevo')!=='1'){
    html.classList.add('nv-clasica');
    function botonVolver(){
      if(document.querySelector('.nv-clas-vuelta')) return;
      var fila=document.getElementById('catBotonesFila')||document.querySelector('.filters'); if(!fila) return;
      var b=document.createElement('button'); b.type='button'; b.className='nv-clas-vuelta'; b.title='Probar la vista nueva del catálogo';
      b.innerHTML='<span>Vista</span><span>nueva</span>'; b.onclick=function(){ _nvClasica(0); };
      fila.appendChild(b);
    }
    botonVolver(); document.addEventListener('DOMContentLoaded',botonVolver); setInterval(botonVolver,1500);
    return;
  }
  html.classList.add('nv');
  // tipografía
  try{ var l=document.createElement('link'); l.rel='stylesheet'; l.href='https://fonts.googleapis.com/css2?family=Unbounded:wght@600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&display=swap'; document.head.appendChild(l); }catch(e){}
  var LITE=html.classList.contains('lite')||(function(){ try{ return window.matchMedia&&window.matchMedia('(prefers-reduced-motion:reduce)').matches; }catch(e){ return false; } })();
  // ── aparición de las tarjetas al bajar ──
  var IO=null;
  function observar(){
    if(LITE) return;
    if(!IO&&'IntersectionObserver' in window){ IO=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('nv-on'); IO.unobserve(e.target); } }); },{rootMargin:'0px 0px -8% 0px',threshold:.08}); }
    var cont=document.getElementById('listContainer'); if(!cont) return;
    var cards=cont.querySelectorAll('.card:not(.nv-rev):not(.cy-st)');
    for(var i=0;i<cards.length;i++){ var c=cards[i]; c.classList.add('nv-rev'); if(IO){ var r=c.getBoundingClientRect(); if(r.top<window.innerHeight*1.1) c.classList.add('nv-on'); else IO.observe(c); } else c.classList.add('nv-on'); }
  }
  // ── marcas: logo con foto (primer producto con foto de esa marca) ──
  function norm(s){ return String(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]/g,''); }
  var FOTO={};
  function fotoDe(marca){
    var k=norm(marca); if(FOTO[k]!==undefined) return FOTO[k];
    var ps=window.allProds||[], mejor=null;
    for(var i=0;i<ps.length;i++){ var p=ps[i]; if(!p||!p.imagen_url||p.activo===false||p.oculto) continue; if(norm(p.empresa)!==k) continue; if(!mejor||((p.stock_actual||0)>0&&(mejor.stock_actual||0)<=0)||((p.unidades_vendidas||0)>(mejor.unidades_vendidas||0)&&(p.stock_actual||0)>0)) mejor=p; }
    var u=mejor?((typeof fixImgUrl==='function')?fixImgUrl(mejor.imagen_url):mejor.imagen_url):'';
    FOTO[k]=u; return u;
  }
  function marcasConFoto(){
    var its=document.querySelectorAll('.mc-it:not(.nv-mc)');
    for(var i=0;i<its.length;i++){ var it=its[i]; it.classList.add('nv-mc'); var nombre=it.getAttribute('data-mc')||''; var u=fotoDe(nombre); if(!u) continue;
      var ph=document.createElement('span'); ph.className='nv-mc-ph'; ph.innerHTML='<img src="'+u.replace(/"/g,'&quot;')+'" alt="" loading="lazy">';
      it.insertBefore(ph,it.firstChild); it.classList.add('nv-mc-foto'); }
  }
  // ── género de la tarjeta (para el fondo y el precio que corre) + botones Notas/Acordes/Te puede gustar con el formato del Cyber ──
  var TXT={ntog:'Notas olfativas','ac-tog':'Acordes','cpar-tog':'Te puede gustar'};
  function vestirCards(){
    var cont=document.getElementById('listContainer'); if(!cont) return;
    var cards=cont.querySelectorAll('.card:not(.nv-vest):not(.cy-st)');
    for(var i=0;i<cards.length;i++){ var c=cards[i]; c.classList.add('nv-vest');
      var g=c.querySelector('.prod-tag-gen'); c.classList.add(g&&g.classList.contains('gen-f')?'nv-g-f':g&&g.classList.contains('gen-m')?'nv-g-m':'nv-g-u');
      var fila=null; ['ntog','ac-tog','cpar-tog'].forEach(function(k){ var b=c.querySelector('.'+k); if(b){ b.textContent=TXT[k]; b.setAttribute('data-t',k==='ntog'?'notas':k==='ac-tog'?'acordes':'parecidos'); if(!fila){ fila=document.createElement('div'); fila.className='nv-links'; } fila.appendChild(b); } });
      if(fila){ var ci=c.querySelector('.cinfo')||c; ci.appendChild(fila); }
      if(!c.querySelector(':scope > .nv-mas')){ var mas=document.createElement('button'); mas.type='button'; mas.className='nv-mas'; mas.setAttribute('aria-label','Ver más'); c.appendChild(mas); }
      var cn0=c.querySelector('.cname'); if(cn0&&!c.querySelector('.nv-ren-marca')){ var pid=parseInt((c.id||'').slice(5),10); var pr=(window.allProds||[]).filter(function(x){ return x.id===pid; })[0]; var emp=pr&&pr.empresa?String(pr.empresa):''; if(!emp){ var bt=c.querySelector('.cbrand-txt'); emp=bt?bt.textContent.trim():''; } if(emp){ var mk=document.createElement('span'); mk.className='nv-ren-marca'; mk.textContent=emp; cn0.insertAdjacentElement('beforebegin',mk); } }
      var cn=c.querySelector('.cname'); if(cn&&!c.querySelector('.nv-mas2')){ var m2=document.createElement('button'); m2.type='button'; m2.className='nv-mas2'; m2.setAttribute('aria-label','Ver más'); var tr=c.querySelector('.ctagrow'); (tr||cn).insertAdjacentElement('afterend',m2); }
    }
  }
  var TIT={notas:'Notas olfativas',acordes:'Acordes principales',parecidos:'También te puede gustar'};
  function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  function infoHTML(p,tipo){
    var cuerpo='';
    try{
      if(tipo==='notas') cuerpo=(p.notas&&typeof formatNotasFotos==='function')?formatNotasFotos(p.notas):'<div class="cy-info-vacio">Sin notas cargadas.</div>';
      else if(tipo==='acordes') cuerpo=(typeof _acordesRowsHTML==='function')?('<div class="ac-wrap cy-ac">'+_acordesRowsHTML(p)+'</div>'):'';
      else cuerpo=(typeof _parecidosInnerCard==='function')?('<div class="cpar-wrap">'+_parecidosInnerCard(p.id)+'</div>'):'';
    }catch(e){ cuerpo='<div class="cy-info-vacio">No se pudo cargar.</div>'; }
    var tabs=['notas','acordes','parecidos'].filter(function(k){ return (k==='notas'&&p.notas)||(k==='acordes'&&p.acordes)||(k==='parecidos'&&(p.notas||(typeof _tieneSugeridos==='function'&&_tieneSugeridos(p)))); })
      .map(function(k){ return '<button type="button" class="cy-info-tab'+(k===tipo?' on':'')+'" onclick="_nvInfo('+p.id+',\''+k+'\')">'+TIT[k]+'</button>'; }).join('');
    var br=(typeof getBrand==='function')?getBrand(p.nombre):''; var nom=br?p.nombre.replace(br+' - ',''):p.nombre; nom=nom.replace(/\s*\|[^|]+\|?\s*/g,' ').trim();
    return '<div class="cy-info-top"><div><div class="cy-info-k">'+esc(TIT[tipo])+'</div><div class="cy-info-n">'+(br?'<span>'+esc(br)+'</span> ':'')+esc(nom)+'</div></div><button type="button" class="cy-info-x" onclick="_nvInfoCerrar('+p.id+')" aria-label="Cerrar">✕</button></div>'+
      (tabs?'<div class="cy-info-tabs">'+tabs+'</div>':'')+'<div class="cy-info-body">'+cuerpo+'</div>';
  }
  function marcar(card,tipo){ card.querySelectorAll('.ntog,.ac-tog,.cpar-tog').forEach(function(b){ b.classList.toggle('on',b.getAttribute('data-t')===tipo); }); }
  window._nvInfoCerrar=function(id){ var card=document.getElementById('card_'+id); if(!card) return; var row=card.querySelector(':scope > .nv-info-row'); if(row) row.remove(); card.classList.remove('nv-abierta'); marcar(card,null); };
  window._nvInfo=function(id,tipo){
    var card=document.getElementById('card_'+id); if(!card) return;
    var p=(window.allProds||[]).filter(function(x){ return x.id===id; })[0]; if(!p) return;
    var vie=card.querySelector(':scope > .nv-info-row');
    if(vie&&vie.getAttribute('data-t')===tipo){ window._nvInfoCerrar(id); return; }
    if(vie) vie.remove();
    var row=document.createElement('div'); row.className='nv-info-row'; row.setAttribute('data-t',tipo);
    row.innerHTML='<div class="cy-info nv-info" data-pid="'+id+'" data-t="'+tipo+'">'+infoHTML(p,tipo)+'</div>';
    card.classList.add('nv-abierta'); card.appendChild(row); marcar(card,tipo);
    if(tipo==='acordes'){ try{ setTimeout(function(){ row.querySelectorAll('.ac-bar,.ac-bar2').forEach(function(b){ var w=b.style.width; b.style.width='0'; setTimeout(function(){ b.style.width=w; },50); }); },20); }catch(e){} }
    try{ var r=row.getBoundingClientRect(); if(r.bottom>window.innerHeight) row.scrollIntoView({behavior:'smooth',block:'nearest'}); }catch(e){}
  };
  document.addEventListener('click',function(ev){
    if(html.classList.contains('cyber')) return;
    var b=ev.target.closest&&ev.target.closest('.ntog,.ac-tog,.cpar-tog'); if(!b) return;
    var card=b.closest('.card'); if(!card||card.classList.contains('cy-st')||!/^card_\d+$/.test(card.id)) return;
    ev.preventDefault(); ev.stopPropagation(); ev.stopImmediatePropagation();
    window._nvInfo(parseInt(card.id.slice(5),10),b.getAttribute('data-t')||'notas');
  },true);
  // ── El viajero: la botella del Cyber en los colores de Belle, con líquido adentro, que baja al costado de la lista siguiendo el scroll.
  //    Estela celeste/rosa cuando se mueve y dorada/amarilla cuando está quieta; el cambio es un fundido lento. ──
  var VJ={el:null,pos:0,vel:0,raf:0,ult:0,ultY:0,mov:0};
  var VJ_PAL={quieto:[[253,224,138],[250,204,21],[245,158,11],[254,240,138],[253,230,138],[251,191,36]],movil:[[201,150,60],[169,117,42],[184,134,11],[214,170,80],[160,110,40],[138,100,48]]};
  var VJ_STOPS=[{id:'nvG1',q:[[253,224,138],[251,191,36],[251,191,36]],m:[[201,150,60],[169,117,42],[169,117,42]]},{id:'nvG2',q:[[250,204,21],[254,240,138],[254,240,138]],m:[[184,134,11],[214,170,80],[214,170,80]]},{id:'nvG3',q:[[245,158,11],[253,230,138],[253,230,138]],m:[[138,100,48],[201,150,60],[201,150,60]]}];
  var VIAJERO_SVG='<div class="cy-vj-estela"><svg viewBox="0 0 120 440" aria-hidden="true">'+
    '<defs>'+
    '<linearGradient id="nvG1" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#fde68a" stop-opacity=".85"/><stop offset=".5" stop-color="#fbbf24" stop-opacity=".42"/><stop offset="1" stop-color="#fbbf24" stop-opacity="0"/></linearGradient>'+
    '<linearGradient id="nvG2" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#facc15" stop-opacity=".8"/><stop offset=".55" stop-color="#fef08a" stop-opacity=".4"/><stop offset="1" stop-color="#fef08a" stop-opacity="0"/></linearGradient>'+
    '<linearGradient id="nvG3" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#f59e0b" stop-opacity=".7"/><stop offset=".6" stop-color="#fde68a" stop-opacity=".3"/><stop offset="1" stop-color="#fde68a" stop-opacity="0"/></linearGradient>'+
    '<filter id="nvVjBlur" x="-60%" y="-20%" width="220%" height="140%"><feGaussianBlur stdDeviation="5"/></filter>'+
    '<filter id="nvVjHumo" x="-100%" y="-30%" width="300%" height="160%" color-interpolation-filters="sRGB">'+
      '<feTurbulence type="fractalNoise" baseFrequency="0.016 0.024" numOctaves="2" seed="7" result="n"><animate attributeName="baseFrequency" dur="11s" values="0.016 0.024;0.021 0.03;0.013 0.027;0.016 0.024" repeatCount="indefinite"/></feTurbulence>'+
      '<feDisplacementMap class="cy-vj-d1" in="SourceGraphic" in2="n" scale="9" xChannelSelector="R" yChannelSelector="G"/>'+
    '</filter>'+
    '</defs>'+
    '<g class="cy-vj-humo" filter="url(#nvVjHumo)">'+
    '<path class="cy-vj-onda w" d="M60,440 L60,140" fill="none" stroke="url(#nvG1)" stroke-width="42" stroke-linecap="round"/>'+
    '<path class="cy-vj-onda m" d="M60,440 L60,20" fill="none" stroke="url(#nvG2)" stroke-width="16" stroke-linecap="round"/>'+
    '<path class="cy-vj-onda f" d="M60,440 L60,12" fill="none" stroke="url(#nvG3)" stroke-width="3.5" stroke-linecap="round"/>'+
    '<g class="cy-vj-nubes" filter="url(#nvVjBlur)">'+
      (function(){ var s=''; for(var i=0;i<12;i++) s+='<circle class="cy-vj-puff" data-i="'+(i%6)+'" cx="60" cy="440" r="0" fill="#fde68a" opacity="0"/>'; return s; })()+
    '</g>'+
    '</g></svg></div>'+
    '<div class="cy-vj-frasco"><svg viewBox="0 0 64 96" aria-hidden="true">'+
    '<defs><linearGradient id="nvVjVid" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff8e6" stop-opacity=".92"/><stop offset="1" stop-color="#f3e2bd" stop-opacity=".85"/></linearGradient>'+
    '<linearGradient id="nvVjLiq" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6c75a"/><stop offset=".55" stop-color="#c4965a"/><stop offset="1" stop-color="#8a6430"/></linearGradient>'+
    '<linearGradient id="nvVjB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity=".7"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient>'+
    '<clipPath id="nvVjClip"><path d="M14,34 C14,26 50,26 50,34 L52,82 C52,90 12,90 12,82 Z"/></clipPath></defs>'+
    '<rect x="22" y="4" width="20" height="16" rx="5" fill="#0b1020"/><rect x="26" y="7" width="4" height="9" rx="2" fill="#ffffff" opacity=".35"/>'+
    '<rect x="26" y="19" width="12" height="7" rx="2" fill="#c4965a" stroke="#0b1020" stroke-width="2"/>'+
    '<path d="M14,34 C14,26 50,26 50,34 L52,82 C52,90 12,90 12,82 Z" fill="url(#nvVjVid)"/>'+
    '<g clip-path="url(#nvVjClip)">'+
      '<path class="nv-liq2" d="M-30,56 Q-20,50 -10,56 T10,56 T30,56 T50,56 T70,56 T90,56 T110,56 V100 H-30 Z" fill="#e6c98e"/>'+
      '<path class="nv-liq" d="M-30,58 Q-20,53 -10,58 T10,58 T30,58 T50,58 T70,58 T90,58 T110,58 V100 H-30 Z" fill="url(#nvVjLiq)"/>'+
      '<circle cx="24" cy="76" r="1.6" fill="#fff" opacity=".45"/><circle cx="40" cy="70" r="1.1" fill="#fff" opacity=".4"/><circle cx="33" cy="82" r=".9" fill="#fff" opacity=".4"/>'+
    '</g>'+
    '<path d="M14,34 C14,26 50,26 50,34 L52,82 C52,90 12,90 12,82 Z" fill="none" stroke="#0b1020" stroke-width="2.5" stroke-linejoin="round"/>'+
    '<path d="M18,36 C18,31 46,31 46,36 L47,52 C47,55 17,55 17,52 Z" fill="url(#nvVjB)"/>'+
    '<text x="32" y="69" text-anchor="middle" font-family="Unbounded,DM Sans,sans-serif" font-weight="700" font-size="6.4" letter-spacing="1.3" fill="#ffffff" opacity=".92">BELLE</text>'+
    '<path d="M24,73 L40,73" stroke="#ffffff" stroke-width=".9" stroke-linecap="round" opacity=".7"/>'+
    '<path d="M19,40 L19.6,60" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" opacity=".7"/>'+
    '</svg></div>';
  var BARRA_HTML='<div class="cy-vj-barra" role="search">'+
    '<input type="search" class="cy-vj-q" placeholder="Buscá marca o perfume" autocomplete="off" autocorrect="off" spellcheck="false" aria-label="Buscar perfume">'+
    '<button type="button" class="cy-vj-ir" aria-label="Buscar"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.2" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M15.3,15.3 L20.6,20.6" stroke="currentColor" stroke-width="2.7" stroke-linecap="round"/><path class="cy-vj-glint" d="M7.6,9.2 A3.4,3.4 0 0 1 9.8,7.3" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/></svg></button>'+
  '</div>';
  function barraToggle(v){ if(v.classList.contains('buscando')) barraCerrar(v); else barraAbrir(v); }
  function barraAbrir(v){ v.classList.add('buscando'); var inp=v.querySelector('.cy-vj-q'); setTimeout(function(){ try{ inp.focus({preventScroll:true}); }catch(e){ inp.focus(); } },60); }
  function barraCerrar(v){ v.classList.remove('buscando'); var inp=v.querySelector('.cy-vj-q'); if(inp) inp.blur(); }
  function barraIr(v){
    var inp=v.querySelector('.cy-vj-q'), q=(inp.value||'').trim(); barraCerrar(v);
    if(typeof bqAbrir!=='function') return; try{ bqAbrir(); }catch(e){ return; }
    var bs=document.getElementById('bqSrch'); if(bs){ bs.value=q; try{ if(typeof bqCambio==='function') bqCambio(); }catch(e){} if(!q){ try{ bs.focus(); }catch(e){} } }
  }
  function barraEventos(v){
    var inp=v.querySelector('.cy-vj-q'), ir=v.querySelector('.cy-vj-ir'); if(!inp||!ir) return;
    inp.addEventListener('keydown',function(e){ if(e.key==='Enter'){ e.preventDefault(); barraIr(v); } if(e.key==='Escape') barraCerrar(v); });
    inp.addEventListener('input',function(){ var s=document.getElementById('srch'); if(!s) return; s.value=inp.value; try{ if(typeof applyFilters==='function') applyFilters(); }catch(e){} });
    ir.addEventListener('click',function(e){ e.preventDefault(); e.stopPropagation(); barraIr(v); });
    if(!barraEventos.doc){ barraEventos.doc=true;
      document.addEventListener('pointerdown',function(e){ var ab=document.querySelector('.nv-viajero.buscando'); if(ab&&!ab.contains(e.target)) barraCerrar(ab); },true);
      document.addEventListener('keydown',function(e){ if(e.key==='Escape'){ var ab=document.querySelector('.nv-viajero.buscando'); if(ab) barraCerrar(ab); } });
    }
  }
  function viajero(){
    if(LITE||html.classList.contains('cyber')) return;
    var c=document.getElementById('listContainer'); if(!c) return;
    var v=document.querySelector('.nv-vj-capa > .nv-viajero');
    if(!v){ var capa=document.createElement('div'); capa.className='nv-vj-capa'; v=document.createElement('div'); v.className='nv-viajero'; v.innerHTML=VIAJERO_SVG+BARRA_HTML; capa.appendChild(v); document.body.appendChild(capa);
      var fr=v.querySelector('.cy-vj-frasco'); if(fr){ fr.setAttribute('role','button'); fr.setAttribute('title','Buscar perfume'); fr.addEventListener('click',function(e){ e.preventDefault(); e.stopPropagation(); barraToggle(v); }); }
      barraEventos(v); }
    if(VJ.el!==v){ VJ.ondas=null; VJ.puffs=null; VJ.d1=null; VJ.escUlt=0; VJ.stops=null; }
    VJ.el=v; VJ.cont=c;
    if(!VJ.on){ VJ.on=true; window.addEventListener('scroll',vjScroll,{passive:true}); window.addEventListener('resize',vjScroll,{passive:true}); }
    vjScroll();
  }
  function vjPrep(v){
    VJ.ondas={w:v.querySelector('.cy-vj-onda.w'),m:v.querySelector('.cy-vj-onda.m'),f:v.querySelector('.cy-vj-onda.f')};
    VJ.puffs=[]; var cs=v.querySelectorAll('.cy-vj-puff');
    for(var i=0;i<cs.length;i++) VJ.puffs.push(vjPuffNuevo({el:cs[i],pal:parseInt(cs[i].getAttribute('data-i'),10)||0},i/cs.length));
    VJ.stops=VJ_STOPS.map(function(g){ var el=v.querySelector('#'+g.id); return {g:g,st:el?el.querySelectorAll('stop'):[]}; });
    VJ.movUlt=-1;
  }
  var VJ_NUBE=0.22; // largo mínimo de la estela cuando el frasco está quieto (la nube)
  function vjPuffNuevo(q,edad){ q.edad=edad; q.vel=0.8+Math.random()*0.6; q.r0=14+Math.random()*13; q.po=0.28+Math.random()*0.2; q.lat=(Math.random()<.5?-1:1)*(6+Math.random()*12); q.fase=Math.random()*6.28; q.k=Math.random()*2-1; return q; }
  function mezcla(a,b,t){ return 'rgb('+Math.round(a[0]+(b[0]-a[0])*t)+','+Math.round(a[1]+(b[1]-a[1])*t)+','+Math.round(a[2]+(b[2]-a[2])*t)+')'; }
  // fundido de colores: 0 = quieto (dorados), 1 = en movimiento (celeste/rosa)
  function vjColores(){
    var m=VJ.mov; if(VJ.movUlt>=0&&Math.abs(m-VJ.movUlt)<0.004) return; VJ.movUlt=m;
    for(var i=0;i<VJ.stops.length;i++){ var s=VJ.stops[i]; for(var k=0;k<s.st.length&&k<3;k++) s.st[k].setAttribute('stop-color',mezcla(s.g.q[k],s.g.m[k],m)); }
    for(var p=0;p<VJ.puffs.length;p++){ var q=VJ.puffs[p]; q.el.setAttribute('fill',mezcla(VJ_PAL.quieto[q.pal],VJ_PAL.movil[q.pal],m)); }
  }
  function vjX(s,k){ var ph=VJ.flujo*0.03, amp=1+Math.min(1.1,VJ.vel*1.3), A=(4+38*Math.pow(s,1.15))*amp; return 60+A*(0.55*Math.sin(6.6*s-ph+k)+0.3*Math.sin(13.8*s-ph*1.7+2.1*k+1.3)+0.25*Math.sin(3.2*s-ph*0.5+0.7*k+VJ.tiempo*0.35)); }
  function vjPath(k,hasta){
    var n=20, pts=[], i; for(i=0;i<=n;i++){ var s=i/n*hasta; pts.push([vjX(s,k),440-420*s]); } pts[0][0]=60;
    var d='M'+pts[0][0].toFixed(1)+','+pts[0][1].toFixed(1);
    for(i=0;i<n;i++){ var p0=pts[i-1]||pts[i], p1=pts[i], p2=pts[i+1], p3=pts[i+2]||p2; d+=' C'+(p1[0]+(p2[0]-p0[0])/6).toFixed(1)+','+(p1[1]+(p2[1]-p0[1])/6).toFixed(1)+' '+(p2[0]-(p3[0]-p1[0])/6).toFixed(1)+','+(p2[1]-(p3[1]-p1[1])/6).toFixed(1)+' '+p2[0].toFixed(1)+','+p2[1].toFixed(1); }
    return d;
  }
  function vjSerpiente(dt){
    VJ.tiempo=(VJ.tiempo||0)+dt*0.001; var o=VJ.ondas; if(!o) return;
    var L=Math.max(VJ_NUBE,VJ.largo||VJ_NUBE); o.w.setAttribute('d',vjPath(0,0.72*L)); o.m.setAttribute('d',vjPath(0.35,L)); o.f.setAttribute('d',vjPath(-0.5,1.02*L));
    var rapidez=1+Math.min(2.5,VJ.vel*2.2);
    for(var i=0;i<VJ.puffs.length;i++){ var q=VJ.puffs[i]; q.edad+=dt*0.00011*q.vel*rapidez; if(q.edad>=1){ vjPuffNuevo(q,0); }
      var s=q.edad, sl=s*L, x=vjX(sl,q.k)+q.lat*Math.sin(s*4.2+q.fase)*Math.min(1,s*3), y=440-420*sl*0.95, op=q.po*Math.min(1,s*7)*Math.pow(1-s,0.9);
      q.el.setAttribute('cx',x.toFixed(1)); q.el.setAttribute('cy',y.toFixed(1)); var gordo=1+0.9*(1-Math.min(1,VJ.mov||0)); q.el.setAttribute('r',(q.r0*(0.45+1.6*s)*gordo).toFixed(1)); q.el.setAttribute('opacity',(op*(1+0.35*(gordo-1))).toFixed(3)); }
  }
  function vjScroll(){ if(!VJ.raf) VJ.raf=requestAnimationFrame(vjPaso); }
  function vjPaso(ts){
    VJ.raf=0; var v=VJ.el, c=VJ.cont; if(!v||!c||!c.isConnected||html.classList.contains('cyber')){ if(v) v.style.opacity='0'; return; }
    var hayCards=c.querySelector('.card'); var rect=c.getBoundingClientRect(), vh=window.innerHeight;
    var minY=60, maxY=Math.max(minY,c.offsetHeight-80);
    var obj=Math.max(minY,Math.min(maxY,vh*0.44-rect.top));
    if(!VJ.ini){ VJ.ini=true; VJ.pos=obj; }
    var dt=Math.min(48,(ts-(VJ.ult||ts))||16); VJ.ult=ts;
    var d=obj-VJ.pos; VJ.pos+=d*0.14;
    var velInst=Math.abs(VJ.pos-VJ.ultY)/dt; VJ.ultY=VJ.pos; VJ.vel=VJ.vel*0.85+velInst*0.15;
    var fuera=rect.bottom<0||rect.top>vh||!hayCards||c.offsetHeight<200||c.offsetParent===null;
    v.style.opacity=fuera?'0':'1';
    // a la izquierda de la lista si hay margen; si no, apoyado en el borde derecho (sin salirse de la pantalla)
    var vw=document.documentElement.clientWidth, chico=rect.left<76, W=chico?(SUAVE?20:40):(SUAVE?32:64), H=chico?(SUAVE?30:60):(SUAVE?48:96);
    v.classList.toggle('chico',chico);
    var x=chico?Math.max(2,rect.left-W*0.45):rect.left-W-10;
    v.style.transform='translate('+(x+window.scrollX).toFixed(1)+'px,'+(rect.top+window.scrollY+VJ.pos-H/2).toFixed(1)+'px)';
    var inc=Math.max(-7,Math.min(7,d*0.08)); v.style.setProperty('--vjInc',inc.toFixed(2)+'deg');
    v.style.setProperty('--vjEst',Math.max(.45,Math.min(.95,VJ.vel*0.8+0.45)).toFixed(2));
    // la estela arranca en cero y se alarga con lo que se va scrolleando, hasta un tope (no se acorta)
    // la estela crece con el scroll (hasta un tope) y, al quedar quieta, se acorta de a poco hasta una nube chica alrededor del frasco
    var moviendo=velInst>0.02; VJ.largo=moviendo?Math.min(1,(VJ.largo||0)+velInst*dt*0.00045):Math.max(VJ_NUBE,(VJ.largo||0)-dt*0.00009);
    v.style.setProperty('--vjLargo','1');
    v.classList.toggle('subiendo',d<-1);
    VJ.fase=(VJ.fase||0)+dt*(0.0005+VJ.vel*0.004); v.style.setProperty('--vjDash',(-(VJ.fase*120)%35).toFixed(1)+'px');
    VJ.flujo=(VJ.flujo||0)+dt*(0.014+VJ.vel*0.11);
    if(!VJ.ondas||!VJ.ondas.w||!VJ.ondas.w.isConnected){ VJ.d1=v.querySelector('.cy-vj-d1'); vjPrep(v); }
    vjSerpiente(dt);
    // el color sigue al movimiento con un fundido lento (unos 2-3 s), sin saltos
    var objMov=Math.min(1,VJ.vel*2.6); VJ.mov+=(objMov-VJ.mov)*(objMov>VJ.mov?0.04:0.012); vjColores();
    var esc=9+Math.min(9,VJ.vel*11); VJ.esc=(VJ.esc||esc)*0.9+esc*0.1;
    if(VJ.d1&&Math.abs((VJ.escUlt||0)-VJ.esc)>0.4){ VJ.escUlt=VJ.esc; VJ.d1.setAttribute('scale',VJ.esc.toFixed(1)); }
    if(!fuera) VJ.raf=requestAnimationFrame(vjPaso);
  }
  // ── vistas del listado: tarjetas (la de siempre) · renglones · recuadros; la elección queda guardada en el navegador ──
  var VISTAS={tarjetas:'',renglones:'nv-v-ren',recuadros:'nv-v-rec'};
  var ICONOS={tarjetas:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><rect x="3" y="3.5" width="18" height="7.5" rx="2"/><rect x="3" y="13" width="18" height="7.5" rx="2"/></svg>',
    renglones:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M4 5h16M4 10h16M4 15h16M4 20h16"/></svg>',
    recuadros:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="8" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2"/><rect x="13" y="13" width="8" height="8" rx="2"/></svg>'};
  var TITV={tarjetas:'Tarjetas',renglones:'Renglones',recuadros:'Recuadros'};
  function vistaActual(){ var v=''; try{ v=localStorage.getItem('nv_vista')||''; }catch(e){} if(VISTAS[v]===undefined) v='tarjetas'; if(v==='renglones'&&window.innerWidth<=680) v='tarjetas'; return v; }
  window.addEventListener('resize',function(){ if(window.innerWidth<=680&&html.classList.contains('nv-v-ren')) aplicarVista('tarjetas',false); });
  function aplicarVista(v,guardar){
    if(VISTAS[v]===undefined) v='tarjetas';
    html.classList.remove('nv-v-ren','nv-v-rec'); if(VISTAS[v]) html.classList.add(VISTAS[v]);
    if(guardar){ try{ localStorage.setItem('nv_vista',v); }catch(e){} }
    document.querySelectorAll('.nv-vistas button').forEach(function(b){ b.classList.toggle('on',b.getAttribute('data-v')===v); });
    document.querySelectorAll('#listContainer .card.nv-mas-on').forEach(function(c){ c.classList.remove('nv-mas-on'); });
    try{ vjScroll(); }catch(e){}
  }
  window._nvVista=function(v){ aplicarVista(v,true); };
  function selectorVistas(){
    if(document.querySelector('.nv-vistas')) return;
    var fila=document.getElementById('catBotonesFila')||document.querySelector('.filters'); if(!fila) return;
    var d=document.createElement('div'); d.className='nv-vistas'; d.setAttribute('role','group'); d.setAttribute('aria-label','Cómo ver el listado');
    d.innerHTML=['tarjetas','renglones','recuadros'].map(function(k){ return '<button type="button" data-v="'+k+'" title="'+TITV[k]+'" aria-label="'+TITV[k]+'" onclick="_nvVista(\''+k+'\')">'+ICONOS[k]+'</button>'; }).join('')
      +'<button type="button" class="nv-clas" data-v="clasica" title="Volver al catálogo de siempre" aria-label="Vista clásica" onclick="_nvClasica(1)"><span>Vista</span><span>clásica</span></button>';
    fila.appendChild(d); aplicarVista(vistaActual(),false);
  }
  aplicarVista(vistaActual(),false);
  document.addEventListener('click',function(ev){ var b=ev.target.closest&&ev.target.closest('.nv-mas,.nv-mas2'); if(!b) return; ev.preventDefault(); ev.stopPropagation(); var c=b.closest('.card'); if(c) c.classList.toggle('nv-mas-on'); },true);
  function envolver(nombre,despues){ var orig=window[nombre]; if(typeof orig!=='function'||orig._nv) return; var w=function(){ try{ return orig.apply(this,arguments); } finally { try{ despues(); }catch(e){} } }; w._nv=true; window[nombre]=w; }
  function logo(){}

  function alturaCab(){ var h=document.querySelector('header'); if(h&&h.offsetHeight){ var px=h.offsetHeight+'px'; if(html.style.getPropertyValue('--nv-hdr')!==px) html.style.setProperty('--nv-hdr',px); } }
  function enInicio(){ var h=document.getElementById('homePage'); var on=!!(h&&h.offsetParent!==null&&getComputedStyle(h).display!=='none'); html.classList.toggle('nv-home',on); }
  // ── la barra de anuncios se muda al inicio: cinta inclinada entre las categorías y las marcas ──
  var annNodo=null, annCasa=null;
  function cinta(){
    var ann=document.getElementById('annBar')||annNodo; if(!ann) return; annNodo=ann;
    if(!annCasa){ annCasa={padre:ann.parentNode,sig:ann.nextSibling}; }
    var rects=document.getElementById('hbRects'), home=document.getElementById('homePage');
    var enHome=!!(rects&&home&&getComputedStyle(home).display!=='none');
    var c=document.querySelector('.nv-cinta');
    if(enHome){
      if(!c||!c.isConnected){ c=document.createElement('div'); c.className='nv-cinta'; }
      if(c.previousElementSibling!==rects) rects.insertAdjacentElement('afterend',c);
      if(ann.parentNode!==c) c.appendChild(ann);
      ann.style.display=''; var vacio=!ann.textContent.trim(); c.style.display=vacio?'none':'';
    } else {
      if(c) c.remove();
      if(!ann.isConnected&&annCasa.padre){ annCasa.padre.insertBefore(ann,(annCasa.sig&&annCasa.sig.parentNode===annCasa.padre)?annCasa.sig:null); }
    }
  }
  function alturaBarra(){ var bb=document.getElementById('bmBottom'); var px='0px'; if(bb&&bb.offsetHeight&&getComputedStyle(bb).display!=='none'&&getComputedStyle(bb).position==='fixed') px=bb.offsetHeight+'px'; if(html.style.getPropertyValue('--nvAnnB')!==px) html.style.setProperty('--nvAnnB',px); }
  // ── portada: los botones y recuadros del inicio traen colores propios por JS; se pisan en línea para que sigan al tema ──
  var HBB={'hbb-filtros':['#ffe9a8','#92400e'],'hbb-comparar':['#bdf0f8','#0e7490'],'hbb-acordes':['#fbd0e4','#be185d'],'hbb-notas':['#ddd6fe','#6d28d9']};
  function portada(){
    if(html.classList.contains('cyber')) return;
    var osc=html.getAttribute('data-theme')==='dark';
    document.querySelectorAll('.hbb:not(.nv-ok)').forEach(function(b){ b.classList.add('nv-ok'); var k=Object.keys(HBB).filter(function(c){ return b.classList.contains(c); })[0]; var c=HBB[k]||['#fff','#0b1020']; b.style.setProperty('background',c[0],'important'); b.style.setProperty('color',c[1],'important'); b.style.setProperty('border','2px solid #0b1020','important'); b.style.setProperty('box-shadow','2px 2px 0 #0b1020','important'); });
    var claro=!(html.classList.contains('nv-f-fotos')||html.classList.contains('nv-f-cartel')||html.classList.contains('nv-f-noche'));
    var fondoK=(claro?'c':'o')+(osc?'d':'l'); if(portada.k!==fondoK){ portada.k=fondoK; document.querySelectorAll('.hb-hero .nv-ok,.hb-marca .nv-ok').forEach(function(e){ e.classList.remove('nv-ok'); }); }
    document.querySelectorAll('.hb-hero h1:not(.nv-ok)').forEach(function(h){ h.classList.add('nv-ok'); h.style.setProperty('color',(osc||!claro)?'#fff':'#0b1020','important'); h.style.setProperty('text-shadow',claro?'none':'0 2px 14px rgba(0,0,0,.45)','important'); });
    document.querySelectorAll('.hb-hero p:not(.nv-ok)').forEach(function(p){ p.classList.add('nv-ok'); p.style.setProperty('color',(osc||!claro)?'rgba(255,255,255,.85)':'#4b5578','important'); p.style.setProperty('text-shadow',claro?'none':'0 1px 8px rgba(0,0,0,.4)','important'); });
    document.querySelectorAll('.hb-rect:not(.nv-ok)').forEach(function(rc){ rc.classList.add('nv-ok'); rc.style.setProperty('--hbBg',osc?'#131c33':'#ffffff'); rc.style.setProperty('--hbTx',osc?'#ffffff':'#0b1020'); rc.style.setProperty('--hbTx2','#7c3aed'); rc.style.setProperty('background',osc?'#131c33':'#ffffff','important'); var lb=rc.querySelector('.lb'), sb=rc.querySelector('.sub'); if(lb) lb.style.setProperty('color',osc?'#fff':'#0b1020','important'); if(sb) sb.style.setProperty('color','#7c3aed','important'); });
    document.querySelectorAll('.hb-input:not(.nv-ok)').forEach(function(i){ i.classList.add('nv-ok'); i.style.setProperty('color',osc?'#fff':'#0b1020','important'); i.style.setProperty('border','2px solid '+(osc?'#fff':'#0b1020'),'important'); i.style.setProperty('box-shadow','4px 4px 0 '+(osc?'#22d3ee':'#0b1020'),'important'); });
  }
  new MutationObserver(function(ms){ ms.forEach(function(m){ if(m.attributeName==='data-theme') document.querySelectorAll('.nv-ok').forEach(function(e){ e.classList.remove('nv-ok'); }); }); }).observe(html,{attributes:true,attributeFilter:['data-theme']});
  // ── fondo de la portada: el carrusel de siempre, o la publicidad grande cargada desde Belle (configuracion.portada_cartel) ──
  var CARTEL=null, cartelPedido=false;
  function aplicarFondo(){ var c=!!(CARTEL&&CARTEL.activo&&CARTEL.imagen_url); html.classList.toggle('nv-f-cartel',c); html.classList.toggle('nv-f-fotos',!c); }
  function cargarCartel(){
    if(cartelPedido||typeof apiGet!=='function') return; cartelPedido=true;
    apiGet('configuracion','select=valor&clave=eq.portada_cartel&limit=1').then(function(rows){ try{ CARTEL=JSON.parse((rows&&rows[0]&&rows[0].valor)||'null'); }catch(e){ CARTEL=null; } aplicarFondo(); pintarCartel(); document.querySelectorAll('.hb-hero .nv-ok,.hb-marca .nv-ok').forEach(function(e){ e.classList.remove('nv-ok'); }); }).catch(function(){});
  }
  function pintarCartel(){
    var f=document.getElementById('hbFoto'); if(!f) return;
    var ok=!!(CARTEL&&CARTEL.activo&&CARTEL.imagen_url);
    var img=f.querySelector('.nv-cartel-img'), box=f.querySelector('.nv-cartel');
    if(!ok){ if(img) img.remove(); if(box) box.remove(); return; }
    if(!img){ img=document.createElement('img'); img.className='nv-cartel-img'; img.alt=''; f.insertBefore(img,f.firstChild); }
    if(img.getAttribute('src')!==CARTEL.imagen_url) img.src=CARTEL.imagen_url;
    var tit=CARTEL.titulo||'', sub=CARTEL.subtitulo||'', bt=CARTEL.boton_texto||'', lk=CARTEL.boton_link||'';
    if(!tit&&!sub&&!bt){ if(box) box.remove(); return; }
    if(!box){ box=document.createElement('div'); box.className='nv-cartel'; f.appendChild(box); }
    var ext=/^https?:\/\//i.test(lk);
    var h=(tit?'<b>'+esc(tit)+'</b>':'')+(sub?'<small>'+esc(sub)+'</small>':'')+(bt?'<a href="'+(ext?esc(lk):'#')+'"'+(ext?' target="_blank" rel="noopener"':' onclick="return _nvCartelIr(this)"')+' data-dest="'+esc(lk)+'">'+esc(bt)+'</a>':'');
    if(box.innerHTML!==h) box.innerHTML=h;
  }
  window._nvCartelIr=function(a){ var d=a.getAttribute('data-dest')||''; if(!d) return false; try{ if(typeof _homeGoTab==='function'){ _homeGoTab(d); return false; } }catch(e){} var el=document.querySelector(".tab[onclick*='"+d+"']"); if(el&&typeof switchTab==='function'){ switchTab(d,el); } return false; };
  function selectorFondos(){ cargarCartel(); pintarCartel(); }
  aplicarFondo();
  function hamb(){ var h=document.getElementById('catTabsHambBtn'), t=document.querySelector('.tabs .tab'); if(h&&t&&t.offsetHeight){ var px=t.offsetHeight+'px'; if(h.style.height!==px){ h.style.height=px; h.style.minHeight=px; } } }
  // placeholders y restos del modelo viejo en paneles
  // ── barra de arriba en mobile: botón de pedido (bolsa) junto a la campana, con contador ──
  function barraMobile(){
    var fila=document.getElementById('bmRow1'); if(!fila) return;
    var b=document.getElementById('nvBmCart');
    if(!b){ b=document.createElement('button'); b.id='nvBmCart'; b.type='button'; b.title='Mi pedido'; b.setAttribute('aria-label','Mi pedido'); b.innerHTML='<span id="nvBmCartBadge">0</span>';
      b.addEventListener('click',function(e){ e.preventDefault(); try{ toggleCart(); }catch(err){} }); fila.appendChild(b); }
    var o=document.getElementById('cartCount'), bd=document.getElementById('nvBmCartBadge'); if(!o||!bd) return;
    var n=parseInt(o.textContent||'0',10)||0; var t=n>99?'99+':String(n); if(bd.textContent!==t) bd.textContent=t; bd.classList.toggle('on',n>0);
  }
  // ── buscador: en mobile la marca es un select (la lista de chips se hacía larguísima) ──
  function bqMarcaSelect(){
    if(window.innerWidth>680) return;
    var secs=document.querySelectorAll('#bqBody .bq-sec');
    for(var i=0;i<secs.length;i++){ var t=secs[i].querySelector('.bq-tit b'); if(!t||t.textContent.trim()!=='Marca') continue;
      var chips=secs[i].querySelector('.bq-chips'); if(!chips) return;
      var sel=document.createElement('select'); var act='';
      var bs=chips.querySelectorAll('.bq-ch');
      for(var k=0;k<bs.length;k++){ var m=(bs[k].getAttribute('onclick')||'').match(/bqSetMarca\('([\s\S]*)'\)/); var val=m?m[1].replace(/\\'/g,"'"):''; var sm=bs[k].querySelector('small'); var txt=(bs[k].textContent||'').replace(sm?sm.textContent:'','').trim();
        var op=document.createElement('option'); op.value=val; op.textContent=txt+(sm?' ('+sm.textContent+')':''); if(bs[k].classList.contains('on')){ op.selected=true; act=val; } sel.appendChild(op); }
      sel.addEventListener('change',function(){ try{ bqSetMarca(this.value); }catch(e){} });
      var caja=document.createElement('div'); caja.className='nv-bq-sel'; caja.appendChild(sel); chips.parentNode.replaceChild(caja,chips); return; }
  }
  // ── buscador: sin filtros, la fila de arriba muestra las novedades reales (perfumes por fecha de alta, no reingresos) ──
  var NOV={lista:null,pidiendo:false};
  function bqNovedadesPedir(){
    if(NOV.lista||NOV.pidiendo||typeof apiGet!=='function') return; NOV.pidiendo=true;
    apiGet('productos','select=id,created_at,tipo,cat_catalogo&activo=is.true&order=created_at.desc&limit=60').then(function(rows){ NOV.lista=Array.isArray(rows)?rows:[]; NOV.pidiendo=false; bqNovedades(); }).catch(function(){ NOV.pidiendo=false; NOV.lista=[]; });
  }
  function bqSinFiltros(){
    var q=document.getElementById('bqSrch'); if(q&&q.value.trim()) return false;
    var mn=document.getElementById('bqMin'), mx=document.getElementById('bqMax'); if((mn&&mn.value)||(mx&&mx.value)) return false;
    var grupos=document.querySelectorAll('#bqBody .bq-chips'); for(var i=0;i<grupos.length;i++){ var on=grupos[i].querySelector('.bq-ch.on'); if(on&&on!==grupos[i].firstElementChild) return false; }
    var sel=document.querySelector('#bqBody .nv-bq-sel select'); if(sel&&sel.value) return false;
    return true;
  }
  function bqNovedades(){
    var prev=document.getElementById('bqPrev'); if(!prev) return;
    if(!bqSinFiltros()){ prev.classList.remove('nv-nov'); return; }
    if(!NOV.lista){ bqNovedadesPedir(); return; }
    var porId={}; (window.allProds||[]).forEach(function(p){ porId[p.id]=p; });
    var out=[]; for(var i=0;i<NOV.lista.length&&out.length<14;i++){ var r=NOV.lista[i], p=porId[r.id]; if(!p) continue;
      if(p.activo===false||(p.stock_actual||0)<=0) continue; if((p.tipo||'perfume')!=='perfume') continue; if(/regaleria|accesorio/i.test(p.cat_catalogo||'')) continue; out.push(p); }
    if(!out.length){ prev.classList.remove('nv-nov'); return; }
    prev.classList.add('nv-nov');
    prev.innerHTML=out.map(function(p){ var img=p.imagen_url?('<img src="'+String(p.imagen_url).replace(/"/g,'&quot;')+'" alt="" loading="lazy">'):'<div style="width:62px;height:62px;background:#f3ece0;border-radius:5px"></div>';
      var nom=String(p.nombre||'').split(' - ').pop(); try{ nom=_prodMl(nom,p.ml); }catch(e){} return '<div class="bq-mini">'+img+'<span>'+String(nom).replace(/[<>]/g,'')+'</span></div>'; }).join('');
  }
  // ── logos de marca armoniosos: se mide el dibujo real de cada logo (sin el aire del archivo) y se le da a todos un
  //    tamaño visual parecido: los anchos (Calvin Klein) quedan más bajos, los cuadrados (árabes) más altos, y se recorta el margen ──
  var LOGOS={};
  function logoMedir(url,cb){
    var c=LOGOS[url]; if(c){ if(c.listo) cb(c); else c.cbs.push(cb); return; }
    c=LOGOS[url]={listo:false,cbs:[cb]}; var img=new Image(); img.crossOrigin='anonymous';
    img.onload=function(){ var iw=img.naturalWidth,ih=img.naturalHeight,x0=0,y0=0,x1=iw-1,y1=ih-1;
      try{ var cv=document.createElement('canvas'); var k=Math.min(1,200/Math.max(iw,ih)); cv.width=Math.max(1,Math.round(iw*k)); cv.height=Math.max(1,Math.round(ih*k)); var ctx=cv.getContext('2d'); ctx.drawImage(img,0,0,cv.width,cv.height);
        var d=ctx.getImageData(0,0,cv.width,cv.height).data, ax=cv.width,ay=cv.height,bx=-1,by=-1;
        for(var y=0;y<cv.height;y++) for(var x=0;x<cv.width;x++){ var i=(y*cv.width+x)*4; if(d[i+3]>40){ if(x<ax)ax=x; if(x>bx)bx=x; if(y<ay)ay=y; if(y>by)by=y; } }
        if(bx>=ax&&by>=ay){ x0=ax/k; y0=ay/k; x1=(bx+1)/k; y1=(by+1)/k; }
      }catch(e){}
      var cw=Math.max(1,x1-x0), ch=Math.max(1,y1-y0), A=cw/ch;
      // alto según la proporción: cuadrado ≈ 50 px, ancho ≈ 24 px (tope de ancho 170 px)
      var h=Math.max(24,Math.min(50,Math.sqrt(2500/A))), w=h*A; if(w>170){ w=170; h=w/A; }
      c.listo=true; c.v={lw:w.toFixed(1),lh:h.toFixed(1),sx:(iw/cw).toFixed(4),sy:(ih/ch).toFixed(4),ox:(x0/cw).toFixed(4),oy:(y0/ch).toFixed(4)};
      c.cbs.forEach(function(f){ f(c); }); c.cbs=[]; };
    img.onerror=function(){ c.listo=true; c.v=null; c.cbs.forEach(function(f){ f(c); }); c.cbs=[]; };
    img.src=url;
  }
  function logosArmoniosos(){
    var ms=document.querySelectorAll('.cbrand-mask:not(.nv-lg):not(.nv-lg-x)');
    for(var i=0;i<ms.length;i++){ (function(el){ var cs=getComputedStyle(el); var mi=cs.webkitMaskImage||cs.maskImage||''; var m=mi.match(/url\("?([^")]+)"?\)/); if(!m){ el.classList.add('nv-lg-x'); return; }
      el.classList.add('nv-lg-x');
      logoMedir(m[1],function(c){ if(!c.v||!el.isConnected) return; for(var k in c.v) el.style.setProperty('--'+k,c.v[k]); el.classList.add('nv-lg'); }); })(ms[i]); }
  }
  function paneles(){
    if(SUAVE) logosArmoniosos();
    barraMobile();
    var cs=document.getElementById('combosSecCat'); if(cs&&typeof curTab!=='undefined'&&/^(contacto|notas|inicio)$/.test(curTab)&&cs.style.display!=='none'){ cs.style.display='none'; }
    var ns=document.getElementById('_notasSearch'); if(ns&&/^\s*\uD83D\uDD0D/.test(ns.placeholder)) ns.placeholder='Buscar nota (ej: naranja)';
    var cs=document.getElementById('compSrch'); if(cs){ var prev=cs.previousElementSibling; if(prev&&prev.tagName==='SPAN'&&/\uD83D\uDD0D/.test(prev.textContent)) prev.style.display='none'; }
  }
  function tick(){ observar(); vestirCards(); marcasConFoto(); viajero(); logo(); hamb(); alturaCab(); alturaBarra(); enInicio(); cinta(); selectorVistas(); selectorFondos(); portada(); paneles(); }
  function enganchar(){ envolver('applyFilters',tick); envolver('renderHomePage',tick); envolver('switchTab',tick); envolver('_mcRender',marcasConFoto); envolver('bqPintar',function(){ bqMarcaSelect(); bqNovedades(); }); envolver('bqCambio',bqNovedades); }
  function init(){ enganchar(); tick(); try{ new MutationObserver(function(){ tick(); }).observe(document.getElementById('listContainer')||document.body,{childList:true}); }catch(e){} }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
  setInterval(tick,1500);
})();

