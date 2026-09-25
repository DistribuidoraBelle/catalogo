# Genera index-madre.html = index.html + pestaña "Día de la Madre" con el diseño de dia-de-la-madre.html
import re,sys
src=open('index.html',encoding='utf-8').read()
proto=open('dia-de-la-madre.html',encoding='utf-8').read()
s=src

# 1) contenedor de la pestaña
s=s.replace('<div id="notasPage" style="display:none;padding:.7rem"></div>',
            '<div id="notasPage" style="display:none;padding:.7rem"></div>\n<div id="madrePage" style="display:none;padding:0"></div>',1)

# 2) la pestaña en la barra (antes de Inicio)
old="  // Inicio\n  html += '<div class=\"tab'+(act==='inicio'?' act':'')+'\" onclick=\\'switchTab(\"inicio\",this)\\'>🏠 Inicio</div>';"
assert s.count(old)==1
s=s.replace(old,"  // 💐 Día de la Madre (prueba: campaña con diseño propio)\n  html += '<div class=\"tab tab-madre catTabPulse'+(act==='madre'?' act':'')+'\" onclick=\\'switchTab(\"madre\",this)\\'>💐 Día de la Madre</div>';\n"+old,1)

# 3) switchTab
old="  var notasEl=document.getElementById(\"notasPage\");\n"
assert s.count(old)==1
s=s.replace(old,old+"  var madreEl=document.getElementById(\"madrePage\");\n  if(tab!==\"madre\"){ if(madreEl)madreEl.style.display=\"none\"; document.body.classList.remove('madre-on'); }\n",1)
old="  if(tab===\"notas\"){\n    if(listEl)listEl.style.display=\"none\";\n    if(filtersEl)filtersEl.style.display=\"none\";\n    if(contactoEl)contactoEl.style.display=\"none\";\n    if(notasEl){notasEl.style.display=\"block\";loadNotasPage();}\n    return;\n  }\n"
assert s.count(old)==1
s=s.replace(old,old+"  if(tab===\"madre\"){\n    if(listEl)listEl.style.display=\"none\";\n    if(filtersEl)filtersEl.style.display=\"none\";\n    if(contactoEl)contactoEl.style.display=\"none\";\n    if(notasEl)notasEl.style.display=\"none\";\n    var _csM=document.getElementById(\"combosSecCat\"); if(_csM){_csM.style.display=\"none\";_csM.innerHTML=\"\";}\n    if(madreEl){madreEl.style.display=\"block\";document.body.classList.add('madre-on');renderMadre();}\n    try{ window.scrollTo({top:0,behavior:'auto'}); }catch(e){}\n    return;\n  }\n",1)
# destacados / secciones: también se ocultan en la pestaña madre
n=s.count('tab==="inicio"||tab==="notas"||tab==="contacto"')
s=s.replace('tab==="inicio"||tab==="notas"||tab==="contacto"','tab==="inicio"||tab==="notas"||tab==="contacto"||tab==="madre"')
print('condiciones destacados/secciones:',n)

# 4) CSS del prototipo, scopeado a #madrePage
css=re.search(r'<style>(.*?)</style>',proto,re.S).group(1)
def scope(css):
    out=[]; i=0; n=len(css)
    def find_block_end(j):  # j = índice de '{' ; devuelve índice de su '}'
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
        if head.startswith('@keyframes') or head.startswith('@font-face'):
            out.append(head+'{'+body+'}\n')
        elif head.startswith('@media'):
            out.append(head+'{'+scope(body)+'}\n')
        elif head.startswith('/*') and '*/' in head and head.endswith('*/'):
            out.append(head+'\n')
        else:
            # quitar comentarios previos al selector
            head=re.sub(r'/\*.*?\*/','',head,flags=re.S).strip()
            if not head: i=k+1; continue
            sels=[]
            for sel in head.split(','):
                sel=sel.strip()
                if sel in (':root','body','html'): sels.append('#madrePage')
                elif sel=='*': sels.append('#madrePage *')
                elif sel.startswith('body.'): sels.append('#madrePage'+sel[4:])
                elif sel.startswith('body '): sels.append('#madrePage '+sel[5:])
                elif sel=='a' or sel=='img': sels.append('#madrePage '+sel)
                else: sels.append('#madrePage '+sel)
            out.append(', '.join(sels)+'{'+body+'}\n')
        i=k+1
    return ''.join(out)
scoped=scope(css)
# el bloque .top (barra propia del prototipo) no hace falta, pero no molesta: queda scopeado y sin uso
extra_css='''
/* la pestaña en la barra: rosa flúor como una campaña */
.tabs .tab.tab-madre,#bmTabsSlot .tab.tab-madre{background:linear-gradient(135deg,#FF48B0,#FF6C2F) !important;color:#fff !important;text-shadow:0 1px 2px rgba(0,0,0,.25);border-color:#e23c9a !important}
.tabs .tab.tab-madre.act,#bmTabsSlot .tab.tab-madre.act{background:linear-gradient(135deg,#3A2B63,#765BA7) !important;color:#fff !important;border-color:#3A2B63 !important}
body.madre-on .lw{overflow:visible !important;padding-top:0 !important;padding-left:0 !important;padding-right:0 !important;max-width:none !important}
body.madre-on #campBannerCat,body.madre-on #marcasCarrusel,body.madre-on #mcWrapTab{display:none !important}
#madrePage{background:var(--papel);color:var(--tinta);font-family:"DM Sans",sans-serif;position:relative;overflow:hidden;padding-bottom:1rem}
#madrePage .hero{padding-top:1.6rem}
#madrePage .decan{flex-wrap:wrap;row-gap:.35rem}
#madrePage .qty-d{margin-left:.3rem}
#madrePage .qty-d button{width:26px;height:28px;font-size:.9rem}
#madrePage .qty-d span{min-width:26px;line-height:28px}
@media(max-width:760px){
  /* en el celular la foto alterna de lado y la cinta pasa por detrás de la foto, no del texto */
  #madrePage .fila.der .card{grid-template-columns:minmax(0,1fr) 42%}
  #madrePage .fila.der .card .foto{grid-column:2;grid-row:1/7}
  #madrePage .fila.der .card .marca,#madrePage .fila.der .card .nombre,#madrePage .fila.der .card .chips,#madrePage .fila.der .card .precios,#madrePage .fila.der .card .decan,#madrePage .fila.der .card .acc{grid-column:1}
  #madrePage .fila .vin{justify-content:flex-start}
  #madrePage .fila.der .vin{justify-content:flex-end}
  #madrePage .card .nombre{font-size:1.5rem;overflow-wrap:anywhere}
}
#madrePage .mini{background:var(--papel);border:2px solid var(--tinta);color:var(--tinta);font:inherit;font-weight:700;font-size:.62rem;letter-spacing:.08em;text-transform:uppercase;padding:.35rem .5rem;cursor:pointer;box-shadow:2px 2px 0 var(--rosa)}
'''
# 5) JS: viñetas + render integrado al catálogo (carrito, precios y logos reales)
js_v=re.search(r"var CORAZON=.*?\n\];\n",proto,re.S).group(0)
js=r'''
// ═══════════════════════════════════════════════════════════════════
// 💐 PESTAÑA DÍA DE LA MADRE (prueba 2026-09-25): el diseño de dia-de-la-madre.html
// como pestaña del catálogo: usa los productos ya cargados (allProds), los precios
// del catálogo (calcP, con ofertas), los logos de marcas y el carrito real.
// ═══════════════════════════════════════════════════════════════════
'''+js_v+r'''
var _madreArmado=false, _madreIntentos=0;
function _mEsc(s){ return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); }
function _mPartes(nombre){
  var s=String(nombre||''); var marca='', resto=s;
  var i=s.indexOf(' - '); if(i>0){ marca=s.slice(0,i).trim(); resto=s.slice(i+3); }
  var tr=resto.split('|').map(function(x){return x.trim();}).filter(Boolean);
  return {marca:marca, nombre:tr[0]||resto, chips:tr.slice(1)};
}
function _madreProductos(){
  var ids=window.MADRE_IDS||[];
  var lista=(allProds||[]).filter(function(p){ return ids.length?ids.indexOf(p.id)>=0:(p.genero==='♀️'&&(p.stock_actual||0)>0&&/^http/.test(p.imagen_url||'')); });
  if(ids.length) lista.sort(function(a,b){ return ids.indexOf(a.id)-ids.indexOf(b.id); });
  else lista.sort(function(a,b){ return (b.stock_actual||0)-(a.stock_actual||0); });
  return ids.length?lista:lista.slice(0,10);
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
  var logo=(typeof window._marcaLogoHTML==='function')?window._marcaLogoHTML(marca,'madre-logo'):'';
  var marcaHtml=logo||('<span>'+_mEsc(marca.toUpperCase())+'</span>');
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
  if(!prods.length){ cont.innerHTML='<div class="cargando">No hay productos para mostrar</div>'; return; }
  cont.innerHTML=prods.map(function(p,i){
    return '<div class="fila '+(i%2?'der':'izq')+'">'+_madreTarjeta(p)+'<div class="vin anim" aria-hidden="true">'+VINETAS[i%VINETAS.length]()+'</div></div>';
  }).join('');
  setTimeout(_madreZig,60); setTimeout(_madreZig,600);
}
function _madreZig(){
  var rio=document.getElementById('madreRegalos'), svg=document.getElementById('madreZig'); if(!rio||!svg) return;
  var filas=[].slice.call(rio.querySelectorAll('.fila')); if(!filas.length) return;
  var W=rio.clientWidth, H=rio.clientHeight; var r0=rio.getBoundingClientRect();
  var movil=W<760;
  var ancho=movil?W*.46:W*.40;
  var xI=movil?W*.24:W*.70, xD=movil?W*.76:W*.30;   // en el celular la cinta va detrás de la foto (izquierda en filas izq, derecha en filas der)
  var centros=filas.map(function(f,i){ var b=f.getBoundingClientRect(); var y=b.top-r0.top+b.height/2; var x=(i%2===0)?xI:xD; return {x:x,y:y}; });
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
  if(!prods.length && _madreIntentos<12){ _madreIntentos++; setTimeout(_madreCargar,700); return; }
  // los ml no vienen en la carga general del catálogo: se piden solo para estos
  var sinMl=prods.filter(function(p){ return p.ml==null; }).map(function(p){ return p.id; });
  var pMl=sinMl.length?apiGet('productos','select=id,ml&id=in.('+sinMl.join(',')+')').catch(function(){ return []; }):Promise.resolve([]);
  pMl.then(function(rows){ var m={}; (rows||[]).forEach(function(r){ m[r.id]=r.ml; }); prods.forEach(function(p){ if(p.ml==null && m[p.id]!=null) p.ml=m[p.id]; }); _madreRender(prods); });
}
function renderMadre(){
  var el=document.getElementById('madrePage'); if(!el) return;
  if(!_madreArmado){
    _madreArmado=true;
    el.innerHTML=MADRE_HTML;
    var t=document.getElementById('madreCinta'); if(t){ var h=MADRE_MSJS.map(function(m){return '<span>'+_mEsc(m)+'</span>';}).join(''); t.innerHTML=h+h; }
  }
  _madreCargar();
}
var MADRE_MSJS=["Envío gratis en Córdoba","Pagás cuando lo recibís","100% originales","Precio VIP llevando 10 o más","Regalos con envío hasta el sábado 17","Combiná las unidades como quieras"];
'''
# el HTML de la portada + cinta + río + cierre, tomado del prototipo (sin la barra propia)
hero=re.search(r'<!-- ═══════════ PORTADA ═══════════ -->\n(.*?)<div class="cinta-msj"',proto,re.S).group(1)
cierre=re.search(r'<section class="cierre">(.*?)</section>',proto,re.S).group(1)
madre_html=hero+'<div class="cinta-msj" aria-hidden="true"><div class="track" id="madreCinta"></div></div>\n'+\
  '<section class="rio" id="madreRegalos"><div class="fondo" aria-hidden="true"><svg id="madreZig" preserveAspectRatio="none"></svg></div><div id="madreFilas"><div class="cargando">Buscando los regalos…</div></div></section>\n'+\
  '<section class="cierre">'+cierre.replace('Prototipo interno · los botones "Agregar" no cargan pedidos todavía','Prueba interna de la pestaña Día de la Madre')+'</section>\n<div class="grano" aria-hidden="true"></div>'
madre_html=madre_html.replace('<a class="btn" href="#regalos">','<a class="btn" href="#madreRegalos">')
js+='var MADRE_HTML='+__import__('json').dumps(madre_html,ensure_ascii=False)+';\n'
CLASES=['card','foto','tapa','marca','nombre','chips','chip','precios','pvip','pmas','decan','acc','qty','qty-d','agregar','fila','vin','rio','fondo','hero','txt','kicker','tit','riso','lead','fecha','btn','sec','escena','cinta-msj','track','cierre','caja','aviso','cargando','grano','hoja','mini','izq','der','rosa','violeta','dm-extra','anim']
_alt='|'.join(re.escape(c) for c in CLASES)
# CSS: toda .clase de la lista se renombra (en CSS un punto seguido de nombre siempre es clase)
css_all=re.sub(r'\.('+_alt+r')(?![\w-])', lambda m:'.md-'+m.group(1), scoped+extra_css)
# JS/HTML: solo los atributos class="..." (también escapados dentro del JSON) y los selectores usados por el JS
def _ren_val(val): return re.sub(r'(?<![\w-])('+_alt+r')(?![\w-])', lambda k:'md-'+k.group(1), val)
js_all=re.sub(r'class=(["\'])(.*?)\1', lambda m:'class='+m.group(1)+_ren_val(m.group(2))+m.group(1), js)
js_all=re.sub(r'class=\\"(.*?)\\"', lambda m:'class=\\"'+_ren_val(m.group(1))+'\\"', js_all)
for sel in ['.fila','.vin','.card','.anim']:
    js_all=js_all.replace("'"+sel+"'","'.md-"+sel[1:]+"'").replace('"'+sel+'"','".md-'+sel[1:]+'"')
bloque='\n<style id="madreCss">\n'+css_all+'</style>\n<script>\n'+js_all+'</script>\n'
s=s.replace('<!-- BELLE_BUILD 20260925-1630 inicio-movil -->','<!-- BELLE_BUILD 20260925-1900 prueba-dia-de-la-madre -->',1)
s=s.replace('</body>\n</html>',bloque+'</body>\n</html>',1)
open('index-madre.html','w',encoding='utf-8').write(s)
print('index-madre.html listo', len(s))
