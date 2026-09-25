# Integra la plantilla "Día de la Madre" (cinta en zigzag + animaciones) al catálogo real (index.html)
# como plantilla de campaña: la usa cualquier pestaña cuya campaña tenga plantilla='madre'.
# El diseño (CSS + escena + viñetas) se toma de dia-de-la-madre.html. Corre una sola vez (idempotente).
import re,json,sys
src=open('index.html',encoding='utf-8').read()
if 'PLANTILLA_MADRE_INTEGRADA' in src: print('ya integrada'); sys.exit(0)
proto=open('dia-de-la-madre.html',encoding='utf-8').read()
s=src

# 1) contenedor
s=s.replace('<div id="notasPage" style="display:none;padding:.7rem"></div>',
            '<div id="notasPage" style="display:none;padding:.7rem"></div>\n<div id="madrePage" style="display:none;padding:0"></div>',1)

# 2) vista previa: ?vista=<slug> muestra una pestaña de campaña aunque esté pausada/oculta (para revisarla antes de publicar)
old="function _tabTieneProductos(t){"
assert s.count(old)==1
s=s.replace(old,"""// 👁 2026-09-25: ?vista=<slug> muestra esa pestaña de campaña aunque la campaña esté pausada u oculta
window._catVistaPrevia=(function(){ try{ return (new URLSearchParams(location.search).get('vista')||'').trim(); }catch(e){ return ''; } })();
function _campEsVistaPrevia(c){
  if(!window._catVistaPrevia||!c) return false;
  var t=(pestanasCatalogo||[]).find(function(x){ return x.id===c.pestana_id; });
  return !!(t && t.slug===window._catVistaPrevia);
}
"""+old,1)
n=s.count("window._ofertaCampanias = todasCamps.filter(function(c){return c.activa !== false;});")
s=s.replace("window._ofertaCampanias = todasCamps.filter(function(c){return c.activa !== false;});","window._ofertaCampanias = todasCamps.filter(function(c){return c.activa !== false || _campEsVistaPrevia(c);});")
n+=s.count("window._ofertaCampanias = todasCamps.filter(function(c){return c.activa !== false;});  // solo activas para lógica normal")
s=s.replace("window._ofertaCampanias = todasCamps.filter(function(c){return c.activa !== false;});  // solo activas para lógica normal","window._ofertaCampanias = todasCamps.filter(function(c){return c.activa !== false || _campEsVistaPrevia(c);});  // solo activas (o en vista previa)")
print('filtros de campañas activas tocados:',n)
old="  function pestanaDebeOcultarse(t){\n"
assert s.count(old)==1
s=s.replace(old,old+"    if(window._catVistaPrevia && t && t.slug===window._catVistaPrevia) return false;  // vista previa\n",1)
old="function _pestanaOcultaGlobal(t){\n  try{\n"
assert s.count(old)==1
s=s.replace(old,old+"    if(window._catVistaPrevia && t && t.slug===window._catVistaPrevia) return false;\n",1)

# 3) switchTab: pestaña con plantilla → página de plantilla en vez de la lista
old="  var notasEl=document.getElementById(\"notasPage\");\n"
assert s.count(old)==1
s=s.replace(old,old+"  var madreEl=document.getElementById(\"madrePage\");\n  if(madreEl)madreEl.style.display=\"none\"; document.body.classList.remove('madre-on');\n",1)
old="  if(tab===\"notas\"){\n    if(listEl)listEl.style.display=\"none\";\n    if(filtersEl)filtersEl.style.display=\"none\";\n    if(contactoEl)contactoEl.style.display=\"none\";\n    if(notasEl){notasEl.style.display=\"block\";loadNotasPage();}\n    return;\n  }\n"
assert s.count(old)==1
s=s.replace(old,old+"""  // 💐 Pestaña de campaña con plantilla propia (por ahora: 'madre' = cinta en zigzag con animaciones)
  var _campPl=_campConPlantilla(tab);
  if(_campPl){
    if(listEl)listEl.style.display="none";
    if(filtersEl)filtersEl.style.display="none";
    if(contactoEl)contactoEl.style.display="none";
    if(notasEl)notasEl.style.display="none";
    if(_destSw){_destSw.style.display="none";_destSw.innerHTML="";}
    if(_secSw){_secSw.style.display="none";_secSw.innerHTML="";}
    var _csM=document.getElementById("combosSecCat"); if(_csM){_csM.style.display="none";_csM.innerHTML="";}
    var _cbM=document.getElementById("campBannerCat"); if(_cbM)_cbM.style.display="none";
    if(madreEl){madreEl.style.display="block";document.body.classList.add('madre-on');renderMadre(_campPl);}
    try{ window.scrollTo({top:0,behavior:'auto'}); }catch(e){}
    return;
  }
""",1)

# 4) CSS del prototipo, scopeado y con clases renombradas (md-) para no chocar con las del catálogo
css=re.search(r'<style>(.*?)</style>',proto,re.S).group(1)
def scope(css):
    out=[]; i=0; n=len(css)
    def find_block_end(j):
        d=0
        for k in range(j,n):
            if css[k]=='{': d+=1
            elif css[k]=='}':
                d-=1
                if d==0: return k
        return n-1
    while i<n:
        j=css.find('{',i)
        if j<0: out.append(css[i:]); break
        head=css[i:j].strip(); k=find_block_end(j); body=css[j+1:k]
        if head.startswith('@keyframes') or head.startswith('@font-face'): out.append(head+'{'+body+'}\n')
        elif head.startswith('@media'): out.append(head+'{'+scope(body)+'}\n')
        else:
            head=re.sub(r'/\*.*?\*/','',head,flags=re.S).strip()
            if not head: i=k+1; continue
            sels=[]
            for sel in head.split(','):
                sel=sel.strip()
                if sel in (':root','body','html'): sels.append('#madrePage')
                elif sel=='*': sels.append('#madrePage *')
                elif sel.startswith('body.'): sels.append('#madrePage'+sel[4:])
                elif sel.startswith('body '): sels.append('#madrePage '+sel[5:])
                else: sels.append('#madrePage '+sel)
            out.append(', '.join(sels)+'{'+body+'}\n')
        i=k+1
    return ''.join(out)
scoped=scope(css)
extra_css='''
/* la pestaña de la campaña con plantilla lleva sus colores desde belle (tab_color_*), como cualquier campaña */
body.madre-on .lw{overflow:visible !important;padding-top:0 !important;padding-left:0 !important;padding-right:0 !important;max-width:none !important}
body.madre-on #campBannerCat,body.madre-on #marcasCarrusel,body.madre-on #mcWrapTab{display:none !important}
#madrePage{background:var(--papel);color:var(--tinta);font-family:"DM Sans",sans-serif;position:relative;overflow:hidden;padding-bottom:1rem}
#madrePage .hero{padding-top:1.6rem}
#madrePage .decan{flex-wrap:wrap;row-gap:.35rem}
#madrePage .qty-d{margin-left:.3rem}
#madrePage .qty-d button{width:26px;height:28px;font-size:.9rem}
#madrePage .qty-d span{min-width:26px;line-height:28px}
#madrePage .mini{background:var(--papel);border:2px solid var(--tinta);color:var(--tinta);font:inherit;font-weight:700;font-size:.62rem;letter-spacing:.08em;text-transform:uppercase;padding:.35rem .5rem;cursor:pointer;box-shadow:2px 2px 0 var(--rosa)}
@media(max-width:760px){
  #madrePage .fila.der .card{grid-template-columns:minmax(0,1fr) 42%}
  #madrePage .fila.der .card .foto{grid-column:2;grid-row:1/7}
  #madrePage .fila.der .card .marca,#madrePage .fila.der .card .nombre,#madrePage .fila.der .card .chips,#madrePage .fila.der .card .precios,#madrePage .fila.der .card .decan,#madrePage .fila.der .card .acc{grid-column:1}
  #madrePage .fila .vin{justify-content:flex-start}
  #madrePage .fila.der .vin{justify-content:flex-end}
  #madrePage .card .nombre{font-size:1.5rem;overflow-wrap:anywhere}
  #madrePage .vin svg{width:200px}
}
'''
js_v=re.search(r"var CORAZON=.*?\n\];\n",proto,re.S).group(0)
hero=re.search(r'<!-- ═══════════ PORTADA ═══════════ -->\n(.*?)<div class="cinta-msj"',proto,re.S).group(1)
cierre=re.search(r'<section class="cierre">(.*?)</section>',proto,re.S).group(1)
# textos de la portada → marcadores {{...}}
hero=hero.replace('Especial · 18 de octubre','{{kicker}}').replace('<span class="riso" data-t="Día de la">Día de la</span>','<span class="riso">{{titulo1}}</span>').replace('<em class="riso" data-t="Madre">Madre</em>','<em class="riso">{{titulo2}}</em>')
hero=re.sub(r'<p class="lead">.*?</p>','<p class="lead">{{lead}}</p>',hero,flags=re.S)
hero=hero.replace('Regalos con envío hasta el sábado 17','{{fecha}}').replace('<a class="btn" href="#regalos">Ver los regalos ♥</a>','<a class="btn" href="#madreRegalos">{{boton}}</a>')
assert '{{lead}}' in hero and '{{titulo2}}' in hero and '{{boton}}' in hero and '{{kicker}}' in hero and '{{fecha}}' in hero
madre_html=hero+'<div class="cinta-msj" aria-hidden="true"><div class="track" id="madreCinta"></div></div>\n'+\
  '<section class="rio" id="madreRegalos"><div class="fondo" aria-hidden="true"><svg id="madreZig" preserveAspectRatio="none"></svg></div><div id="madreFilas"><div class="cargando">Buscando los regalos…</div></div></section>\n'+\
  '<section class="cierre">'+cierre.replace('<div class="aviso">Prototipo interno · los botones "Agregar" no cargan pedidos todavía</div>','')+'</section>\n<div class="grano" aria-hidden="true"></div>'
js=r'''
// ═══════════════════════════════════════════════════════════════════
// 💐 PLANTILLA DE CAMPAÑA "DÍA DE LA MADRE" (2026-09-25) — PLANTILLA_MADRE_INTEGRADA
// Una campaña con plantilla='madre' dibuja su pestaña así: portada animada, cinta de mensajes,
// cinta rosa en zigzag con los productos de la campaña a los costados y viñetas animadas.
// Usa lo mismo que el resto del catálogo: getTabProds() (productos de la pestaña + campaña),
// calcP() (precios con ofertas), logos de marcas y el carrito real. Textos: plantilla_textos.
// ═══════════════════════════════════════════════════════════════════
'''+js_v+r'''
var MADRE_TEXTOS_DEF={kicker:'Especial · 18 de octubre',titulo1:'Día de la',titulo2:'Madre',lead:'Un perfume es un abrazo que se queda todo el día. Las mejores promociones para mamá, con envío gratis en Córdoba.',fecha:'Regalos con envío hasta el sábado 17',boton:'Ver los regalos ♥',msjs:['Envío gratis en Córdoba','Pagás cuando lo recibís','100% originales','Precio VIP llevando 10 o más','Regalos con envío hasta el sábado 17','Combiná las unidades como quieras']};
var _madreCampId=null;
function _campConPlantilla(slug){
  var t=(pestanasCatalogo||[]).find(function(x){ return x.slug===slug; }); if(!t) return null;
  var c=(window._ofertaCampanias||[]).find(function(x){ return x.pestana_id===t.id; });
  return (c && c.plantilla==='madre')?c:null;
}
function _mEsc(s){ return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); }
function _mPartes(nombre){
  var s=String(nombre||''); var marca='', resto=s;
  var i=s.indexOf(' - '); if(i>0){ marca=s.slice(0,i).trim(); resto=s.slice(i+3); }
  var tr=resto.split('|').map(function(x){return x.trim();}).filter(Boolean);
  return {marca:marca, nombre:tr[0]||resto, chips:tr.slice(1)};
}
function _madreTextos(camp){
  var t={}; for(var k in MADRE_TEXTOS_DEF) t[k]=MADRE_TEXTOS_DEF[k];
  var pt=camp&&camp.plantilla_textos; if(typeof pt==='string'){ try{ pt=JSON.parse(pt); }catch(e){ pt=null; } }
  if(pt&&typeof pt==='object'){ for(var k2 in pt){ if(pt[k2]!=null && pt[k2]!=='' && !(Array.isArray(pt[k2])&&!pt[k2].length)) t[k2]=pt[k2]; } }
  if(typeof t.msjs==='string') t.msjs=t.msjs.split('\n').map(function(x){return x.trim();}).filter(Boolean);
  return t;
}
function _madreProductos(){
  var lista=(typeof getTabProds==='function'?getTabProds():[])||[];
  return lista.filter(function(p){ return p.activo!==false && !p.oculto && (p.stock_actual||0)>0 && /^http/.test(p.imagen_url||''); });
}
function _madreQty(id,d){ var st=cstate[id]||{qty:0}; st.qty=Math.max(0,(st.qty||0)+d); cstate[id]=st; var s=document.getElementById('mq_'+id); if(s)s.textContent=st.qty; }
function _madreAgregar(id){ addCart(id); var st=cstate[id]||{qty:0}; var s=document.getElementById('mq_'+id); if(s)s.textContent=st.qty||0; }
function _madreDecanQty(id,d){ if(typeof decanState==='undefined') window.decanState={}; decanState[id]=Math.max(0,(decanState[id]||0)+d); var s=document.getElementById('mdq_'+id); if(s)s.textContent=decanState[id]; }
function _madreTarjeta(p){
  var r=calcP(p), pt=_mPartes(p.nombre);
  var marca=(pt.marca||p.empresa||'');
  var chips=pt.chips.slice();
  if(p.ml && !chips.some(function(c){return /ml/i.test(c);})) chips.push(p.ml+' ml');
  var chipsHtml=chips.map(function(c,i){ return '<span class="chip'+(i===0?' violeta':'')+'">'+_mEsc(c)+'</span>'; }).join('')+'<span class="chip rosa">Para ella</span>';
  var logoHtml=(typeof window._marcaLogoHTML==='function')?window._marcaLogoHTML(marca,''):'';
  var mSrc=logoHtml&&logoHtml.match(/src=["']([^"']+)["']/); var logo=mSrc?mSrc[1]:'';
  var marcaHtml=logo?('<i class="logo" role="img" aria-label="'+_mEsc(marca)+'" style="--logo:url(\''+logo+'\')"></i>'):('<span>'+_mEsc(marca.toUpperCase())+'</span>');
  var q=(cstate[p.id]&&cstate[p.id].qty)||0, dq=(typeof decanState!=='undefined'&&decanState[p.id])||0;
  var vip=r.oferta?(r.precio_unico||r.pm):r.pm;
  return '<article class="card">'+
    '<div class="foto"><img src="'+_mEsc(p.imagen_url)+'" alt="'+_mEsc(pt.nombre)+'" loading="lazy"><span class="tapa">Regalo</span></div>'+
    '<div class="marca">'+marcaHtml+'</div>'+
    '<div class="nombre">'+_mEsc(pt.nombre)+'</div>'+
    '<div class="chips">'+chipsHtml+'</div>'+
    '<div class="precios"><div class="pvip"><small>Precio VIP</small><b>'+fmt(vip)+'</b></div>'+
      '<div class="pmas"><div><small>3 o más</small><b>'+fmt(r.pe)+'</b></div><div><small>1 unidad</small><b>'+fmt(r.pi)+'</b></div></div></div>'+
    '<div class="decan">Decan 5 ml <b>'+fmt(r.decan)+'</b> <span class="qty qty-d"><button type="button" onclick="_madreDecanQty('+p.id+',-1)">−</button><span id="mdq_'+p.id+'">'+dq+'</span><button type="button" onclick="_madreDecanQty('+p.id+',1)">+</button></span><button type="button" class="mini" onclick="addDecan('+p.id+')">+ carrito</button></div>'+
    '<div class="acc"><div class="qty"><button type="button" onclick="_madreQty('+p.id+',-1)">−</button><span id="mq_'+p.id+'">'+q+'</span><button type="button" onclick="_madreQty('+p.id+',1)">+</button></div>'+
      '<button type="button" class="agregar" onclick="_madreAgregar('+p.id+')">Agregar</button></div>'+
  '</article>';
}
function _madreRender(prods){
  var cont=document.getElementById('madreFilas'); if(!cont) return;
  if(!prods.length){ cont.innerHTML='<div class="cargando">Todavía no hay productos en esta campaña</div>'; _madreZig(); return; }
  cont.innerHTML=prods.map(function(p,i){
    return '<div class="fila '+(i%2?'der':'izq')+'">'+_madreTarjeta(p)+'<div class="vin anim" aria-hidden="true">'+VINETAS[i%VINETAS.length]()+'</div></div>';
  }).join('');
  setTimeout(_madreZig,60); setTimeout(_madreZig,600);
}
function _madreZig(){
  var rio=document.getElementById('madreRegalos'), svg=document.getElementById('madreZig'); if(!rio||!svg) return;
  var filas=[].slice.call(rio.querySelectorAll('.fila')); if(!filas.length){ svg.innerHTML=''; return; }
  var W=rio.clientWidth, H=rio.clientHeight; var r0=rio.getBoundingClientRect();
  var movil=W<760;
  var ancho=movil?W*.46:W*.40;
  var xI=movil?W*.24:W*.70, xD=movil?W*.76:W*.30;
  var centros=filas.map(function(f,i){ var b=f.getBoundingClientRect(); return {x:(i%2===0)?xI:xD, y:b.top-r0.top+b.height/2}; });
  var pts=[{x:centros[0].x,y:-40}].concat(centros).concat([{x:centros[centros.length-1].x,y:H+40}]);
  function lado(sign){ return pts.map(function(p){ return (p.x+sign*ancho/2).toFixed(1)+','+p.y.toFixed(1); }); }
  function pathDe(puntos){ var d='M'+puntos[0]; for(var i=1;i<puntos.length;i++){ var a=puntos[i-1].split(','), b=puntos[i].split(','); var ax=+a[0],ay=+a[1],bx=+b[0],by=+b[1]; var my=(ay+by)/2; d+=' C'+ax+','+my+' '+bx+','+my+' '+bx+','+by; } return d; }
  var izq=lado(-1), der=lado(1).reverse();
  var dIzq=pathDe(izq), dDer=pathDe(der), k=dDer.indexOf(' C');
  var d=dIzq+' L'+der[0]+(k>=0?dDer.slice(k):'')+' Z';
  svg.setAttribute('viewBox','0 0 '+W+' '+H);
  svg.innerHTML='<defs><pattern id="puntosM" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><circle cx="4.5" cy="4.5" r="2.2" fill="#FF6C2F" opacity=".45"/></pattern></defs>'+
    '<path d="'+d+'" fill="#FF6C2F" opacity=".5" transform="translate(7 6)"/><path d="'+d+'" fill="#FF48B0"/><path d="'+d+'" fill="url(#puntosM)"/>';
}
window.addEventListener('resize',function(){ if(document.body.classList.contains('madre-on')){ clearTimeout(window._mrz); window._mrz=setTimeout(_madreZig,120); } });
function _madreCargar(){
  var prods=_madreProductos();
  var sinMl=prods.filter(function(p){ return p.ml==null; }).map(function(p){ return p.id; });
  var pMl=sinMl.length?apiGet('productos','select=id,ml&id=in.('+sinMl.join(',')+')').catch(function(){ return []; }):Promise.resolve([]);
  pMl.then(function(rows){ var m={}; (rows||[]).forEach(function(r){ m[r.id]=r.ml; }); prods.forEach(function(p){ if(p.ml==null && m[p.id]!=null) p.ml=m[p.id]; }); _madreRender(prods); });
}
function renderMadre(camp){
  var el=document.getElementById('madrePage'); if(!el) return;
  var id=camp?camp.id:null;
  if(_madreCampId!==id || !el.firstChild){
    _madreCampId=id;
    var t=_madreTextos(camp);
    var html=MADRE_HTML;
    ['kicker','titulo1','titulo2','lead','fecha','boton'].forEach(function(k){ html=html.split('{{'+k+'}}').join(_mEsc(t[k])); });
    el.innerHTML=html;
    var ct=document.getElementById('madreCinta'); if(ct){ var h=(t.msjs||[]).map(function(m){return '<span>'+_mEsc(m)+'</span>';}).join(''); ct.innerHTML=h+h; }
  }
  _madreCargar();
}
'''
js+='var MADRE_HTML='+json.dumps(madre_html,ensure_ascii=False)+';\n'
CLASES=['card','foto','tapa','marca','logo','nombre','chips','chip','precios','pvip','pmas','decan','acc','qty','qty-d','agregar','fila','vin','rio','fondo','hero','txt','kicker','tit','riso','lead','fecha','btn','sec','escena','cinta-msj','track','cierre','caja','aviso','cargando','grano','hoja','mini','izq','der','rosa','violeta','dm-extra','anim']
_alt='|'.join(re.escape(c) for c in CLASES)
css_all=re.sub(r'\.('+_alt+r')(?![\w-])', lambda m:'.md-'+m.group(1), scoped+extra_css)
def _ren_val(val): return re.sub(r'(?<![\w-])('+_alt+r')(?![\w-])', lambda k:'md-'+k.group(1), val)
js_all=re.sub(r'class=(["\'])(.*?)\1', lambda m:'class='+m.group(1)+_ren_val(m.group(2))+m.group(1), js)
js_all=re.sub(r'class=\\"(.*?)\\"', lambda m:'class=\\"'+_ren_val(m.group(1))+'\\"', js_all)
for sel in ['.fila','.vin','.card','.anim']:
    js_all=js_all.replace("'"+sel+"'","'.md-"+sel[1:]+"'").replace('"'+sel+'"','".md-'+sel[1:]+'"')
bloque='\n<style id="madreCss">\n'+css_all+'</style>\n<script>\n'+js_all+'</script>\n'
s=s.replace('</body>\n</html>',bloque+'</body>\n</html>',1)
s=re.sub(r'<!-- BELLE_BUILD [^>]*-->','<!-- BELLE_BUILD 20260925-2100 plantilla-dia-de-la-madre -->',s,count=1)
open('index.html','w',encoding='utf-8').write(s)
print('index.html integrado')
