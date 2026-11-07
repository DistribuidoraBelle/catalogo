// ══════════════════════════════════════════════════════════════════════════
//  belle-chat.js — "Chats de Belle", compartido por el panel y la app de ventas.
//
//  Lee wa_mensajes y wa_conversaciones (las mismas tablas que escribe el bot)
//  y deja contestar a mano cuando Belle no alcanza.
//
//  ── Por qué es un archivo aparte (07/11/2026) ──
//  Vivía adentro de belle.html. Ese día los avisos del equipo pasaron a las
//  apps y David empezó a recibir "hay un reclamo, metete": le llegaba el aviso
//  pero no tenía dónde leer la conversación. Copiar y pegar las 800 líneas en
//  ventas.html lo resolvía ese día y garantizaba que en un mes el panel y la
//  app mostraran cosas distintas. Así que salió a un archivo que cargan las
//  dos, y lo que se arregla acá se arregla en los dos lados.
//
//  Lo que la página que lo usa tiene que tener ya definido:
//    apiGet, apiPatch, toast, bellConfirm, fmt, SB_URL, SB_KEY, _authToken
//  (belle.html y ventas.html los tienen).
//
//  Lo que la página decide:
//    window.BELLE_CHAT_GASTO = false  → esconde "Cuánto cuesta Belle".
//      Lo usa ventas.html: David atiende los reclamos, pero el gasto de la API
//      es información del negocio y no la necesita para eso.
//    window.BELLE_CHAT_CONTENEDOR → id del div donde se dibuja ("waMontaje").
//    window.BELLE_CHAT_PAGINA     → id de la sección que lo contiene, para
//      saber si está visible al redimensionar ("page-chatbot").
//
//  Para montarlo:  _waMontar("id-del-contenedor")
// ══════════════════════════════════════════════════════════════════════════

/** El HTML del chat, con y sin el panel de gasto. */
var _WA_HTML_COMPLETO = `<div class="wa-app" id="waApp" style="position:relative">
  <div class="wa-gasto" id="waGasto" style="display:none">
    <div class="wa-gasto-head">
      <div>
        <div class="wa-gasto-tit">Cuánto cuesta Belle</div>
        <div class="wa-gasto-sub">Meta cobra los mensajes que inicia el negocio · Anthropic cobra cada respuesta · <span id="waGastoVivo">en vivo</span></div>
      </div>
      <button class="wa-head-ico" onclick="_waGastoCerrar()" title="Cerrar">✕</button>
    </div>
    <div class="wa-gasto-filtros">
      <button class="wa-gasto-chip act" data-p="hoy"  onclick="_waGastoPreset('hoy',this)">Hoy</button>
      <button class="wa-gasto-chip" data-p="7"    onclick="_waGastoPreset('7',this)">7 días</button>
      <button class="wa-gasto-chip" data-p="30"   onclick="_waGastoPreset('30',this)">30 días</button>
      <button class="wa-gasto-chip" data-p="mes"  onclick="_waGastoPreset('mes',this)">Este mes</button>
      <span class="wa-gasto-sep"></span>
      <input type="date" id="waGastoDesde" onchange="_waGastoPreset('custom')">
      <span style="color:#8696a0;font-size:.75rem">→</span>
      <input type="date" id="waGastoHasta" onchange="_waGastoPreset('custom')">
    </div>
    <div class="wa-gasto-body" id="waGastoBody">
      <div style="padding:26px;text-align:center;color:#8696a0;font-size:.82rem">Cargando…</div>
    </div>
  </div>
  <div class="wa-side">
    <div class="wa-side-head">
      <img src="belle-icon-512.png" class="wa-yo" alt="Belle">
      <div class="wa-yo-nom">Belle</div>
      <button class="wa-head-ico" onclick="_waGastoAbrir()" title="Cuánto cuesta Belle (Meta + Anthropic)" style="font-weight:700;font-family:Georgia,serif">$</button>
      <button class="wa-head-ico" onclick="_waCargar(true)" title="Actualizar">&#8635;</button>
    </div>
    <div class="wa-buscador">
      <input type="text" id="waBuscar" placeholder="Buscar un chat" oninput="_waPintarLista()">
    </div>
    <div class="wa-chats" id="waChats">
      <div style="padding:26px;text-align:center;color:#8696a0;font-size:.82rem">Cargando…</div>
    </div>
  </div>

  <div class="wa-main">
    <div class="wa-vacio" id="waVacio">
      <div style="font-size:3.4rem;opacity:.35">&#128172;</div>
      <div class="wa-vacio-t">Chats de Belle</div>
      <div style="max-width:400px;font-size:.83rem;line-height:1.6">
        Acá ves todo lo que Belle habla con los clientes por WhatsApp.<br>
        Elegí una conversación de la izquierda para leerla, y si hace falta
        podés meterte vos a contestar.
      </div>
    </div>

    <div class="wa-conv" id="waConv" style="display:none">
      <div class="wa-conv-head">
        <button class="wa-volver" onclick="_waCerrar()">&#8592;</button>
        <div class="wa-av" id="waConvAv">?</div>
        <div style="min-width:0">
          <div class="wa-conv-nom" id="waConvNom">—</div>
          <div class="wa-conv-sub" id="waConvSub"></div>
        </div>
        <button class="wa-sw on" id="waSw" onclick="_waToggleBot()">
          <span class="wa-sw-luz"></span><span class="wa-sw-txt" id="waSwTxt">Belle responde</span>
        </button>
      </div>

      <div class="wa-msgs" id="waMsgs"></div>

      <div class="wa-aviso" id="waAviso" style="display:none"></div>

      <div class="wa-escribir">
        <textarea id="waTexto" rows="1" placeholder="Escribí un mensaje"
          oninput="_waCrecer(this)" onkeydown="_waTecla(event)"></textarea>
        <button class="wa-enviar" id="waBtnEnviar" onclick="_waEnviar()" title="Enviar">&#10148;</button>
      </div>
    </div>
  </div>
</div>`;

var _WA_HTML_SIN_GASTO = `<div class="wa-app" id="waApp" style="position:relative">
  <div class="wa-side">
    <div class="wa-side-head">
      <img src="belle-icon-512.png" class="wa-yo" alt="Belle">
      <div class="wa-yo-nom">Belle</div>
      <button class="wa-head-ico" onclick="_waCargar(true)" title="Actualizar">&#8635;</button>
    </div>
    <div class="wa-buscador">
      <input type="text" id="waBuscar" placeholder="Buscar un chat" oninput="_waPintarLista()">
    </div>
    <div class="wa-chats" id="waChats">
      <div style="padding:26px;text-align:center;color:#8696a0;font-size:.82rem">Cargando…</div>
    </div>
  </div>

  <div class="wa-main">
    <div class="wa-vacio" id="waVacio">
      <div style="font-size:3.4rem;opacity:.35">&#128172;</div>
      <div class="wa-vacio-t">Chats de Belle</div>
      <div style="max-width:400px;font-size:.83rem;line-height:1.6">
        Acá ves todo lo que Belle habla con los clientes por WhatsApp.<br>
        Elegí una conversación de la izquierda para leerla, y si hace falta
        podés meterte vos a contestar.
      </div>
    </div>

    <div class="wa-conv" id="waConv" style="display:none">
      <div class="wa-conv-head">
        <button class="wa-volver" onclick="_waCerrar()">&#8592;</button>
        <div class="wa-av" id="waConvAv">?</div>
        <div style="min-width:0">
          <div class="wa-conv-nom" id="waConvNom">—</div>
          <div class="wa-conv-sub" id="waConvSub"></div>
        </div>
        <button class="wa-sw on" id="waSw" onclick="_waToggleBot()">
          <span class="wa-sw-luz"></span><span class="wa-sw-txt" id="waSwTxt">Belle responde</span>
        </button>
      </div>

      <div class="wa-msgs" id="waMsgs"></div>

      <div class="wa-aviso" id="waAviso" style="display:none"></div>

      <div class="wa-escribir">
        <textarea id="waTexto" rows="1" placeholder="Escribí un mensaje"
          oninput="_waCrecer(this)" onkeydown="_waTecla(event)"></textarea>
        <button class="wa-enviar" id="waBtnEnviar" onclick="_waEnviar()" title="Enviar">&#10148;</button>
      </div>
    </div>
  </div>
</div>`;

/**
 * Dibuja el chat adentro del contenedor que se le pase.
 *
 * Se monta una sola vez: si se llamara de nuevo, se perdería la conversación
 * abierta y lo que el usuario tenga escrito a medias.
 */
function _waMontar(idContenedor) {
  var c = document.getElementById(idContenedor);
  if (!c) { console.warn("[belle-chat] no encuentro el contenedor", idContenedor); return false; }
  if (c.getAttribute("data-wa-montado") === "1") return true;
  c.innerHTML = (window.BELLE_CHAT_GASTO === false) ? _WA_HTML_SIN_GASTO : _WA_HTML_COMPLETO;
  c.setAttribute("data-wa-montado", "1");
  return true;
}

function _waSvgSmall(){return "<svg width='16' height='16' viewBox='0 0 24 24' fill='white'><path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z'/></svg>";}

// ═══════════════════════════════════════════════════════════════════════
// CHATS DE BELLE — el bot de WhatsApp visto desde acá
//
// Lee wa_mensajes y wa_conversaciones (las mismas tablas que escribe el
// agente) y deja contestar a mano cuando el bot no alcanza.
//
// Para ENVIAR no se escribe en la base: se le pide a la Edge Function
// belle-whatsapp, que es la única que tiene el token de Meta. Esa función
// además calla al bot en esa conversación, así el cliente no recibe dos
// respuestas cruzadas.
// ═══════════════════════════════════════════════════════════════════════
var _waEstado={msgs:[],convs:{},nombres:{},activo:"",timer:null,cargando:false};

function _waEsc(s){return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;")
  .replace(/>/g,"&gt;").replace(/"/g,"&quot;");}

/** 5493512513030 -> "+54 9 351 251-3030" (si no reconoce el formato, lo deja como está) */
function _waTel(t){
  var d=String(t||"").replace(/[^0-9]/g,"");
  if(d.length===13&&d.indexOf("549")===0)
    return "+54 9 "+d.slice(3,6)+" "+d.slice(6,9)+"-"+d.slice(9);
  if(d.length===12&&d.indexOf("54")===0)
    return "+54 "+d.slice(2,5)+" "+d.slice(5,8)+"-"+d.slice(8);
  return d?("+"+d):"";
}

/** El nombre del cliente si lo tenemos fichado; si no, el número prolijo. */
function _waNombre(tel){ return _waEstado.nombres[tel] || _waTel(tel); }

/** Las dos iniciales para el redondelito del avatar. */
function _waIniciales(tel){
  var n=_waEstado.nombres[tel];
  if(!n) return "#";
  var p=n.trim().split(/\s+/);
  return ((p[0]||"")[0]||"").toUpperCase()+((p[1]||"")[0]||"").toUpperCase();
}

/** Un color estable por número: el mismo cliente siempre con el mismo tono. */
function _waColor(tel){
  var cols=["#6a7175","#0a7c68","#8e6a3f","#5d5f9e","#8a5a6d","#3f6f8e","#7a6b3e","#4f7a52"];
  var h=0,s=String(tel||"");
  for(var i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))>>>0;
  return cols[h%cols.length];
}

function _waHora(iso){
  var d=new Date(iso); if(isNaN(d))return "";
  return ("0"+d.getHours()).slice(-2)+":"+("0"+d.getMinutes()).slice(-2);
}

/** "HOY" / "AYER" / "14/8/2026", como los separadores de WhatsApp. */
function _waDia(iso){
  var d=new Date(iso); if(isNaN(d))return "";
  var hoy=new Date(), ayer=new Date(Date.now()-86400000);
  function ig(a,b){return a.getDate()===b.getDate()&&a.getMonth()===b.getMonth()&&a.getFullYear()===b.getFullYear();}
  if(ig(d,hoy))return "HOY";
  if(ig(d,ayer))return "AYER";
  return d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear();
}

/** En la lista, la hora si es de hoy; si no, el día. */
function _waHoraCorta(iso){
  var d=new Date(iso); if(isNaN(d))return "";
  var hoy=new Date();
  if(d.getDate()===hoy.getDate()&&d.getMonth()===hoy.getMonth()&&d.getFullYear()===hoy.getFullYear())
    return _waHora(iso);
  return _waDia(iso)==="AYER"?"Ayer":(d.getDate()+"/"+(d.getMonth()+1));
}

/**
 * Estira la app hasta el borde de abajo de la ventana.
 *
 * Se mide en vez de calcularse con un número fijo porque la barra de arriba
 * cambia de alto según el ancho (en el celular ocupa menos), y con una constante
 * quedaba un hueco o aparecía una barra de scroll de más.
 */
function _waAltura(){
  var app=document.getElementById("waApp"); if(!app)return;
  var arriba=app.getBoundingClientRect().top;
  var alto=Math.max(360, Math.round(window.innerHeight-arriba));
  app.style.height=alto+"px";
}

function _waAbrirPagina(){
  // Se monta acá y no al cargar la página: así el HTML entra una sola vez, y
  // recién cuando alguien abre la sección.
  _waMontar(window.BELLE_CHAT_CONTENEDOR || "waMontaje");
  _waCargar(true);
  _waDetenerRefresco();
  setTimeout(_waAltura,0);
  if(!window._waResize){
    window._waResize=true;
    window.addEventListener("resize",function(){
      var pg=document.getElementById(window.BELLE_CHAT_PAGINA || "page-chatbot");
      if(pg&&pg.style.display!=="none")_waAltura();
    });
  }
  // Cada 12 segundos alcanza: no es un chat en vivo entre nosotros, y consultar
  // más seguido solo suma pedidos al pedo.
  _waEstado.timer=setInterval(function(){ _waCargar(false); },12000);
}

function _waDetenerRefresco(){
  if(_waEstado.timer){clearInterval(_waEstado.timer);_waEstado.timer=null;}
  if(typeof _waGastoCerrar==='function') _waGastoCerrar();
}

function _waCargar(mostrarCarga){
  if(_waEstado.cargando)return Promise.resolve();
  _waEstado.cargando=true;

  return Promise.all([
    apiGet("wa_mensajes","select=id,telefono,rol,texto,creado_en,por_humano,media_archivo,media_tipo&order=id.desc&limit=800"),
    apiGet("wa_conversaciones","select=telefono,bot_activo").catch(function(){return [];})
  ]).then(function(res){
    var msgs=(res[0]||[]).slice().reverse();   // de la base vienen del más nuevo al más viejo
    _waEstado.msgs=msgs;
    _waEstado.convs={};
    (res[1]||[]).forEach(function(c){ _waEstado.convs[c.telefono]=c.bot_activo!==false; });

    // Los nombres se buscan una sola vez por sesión: no cambian entre refrescos
    // y son una consulta a otra tabla.
    return Object.keys(_waEstado.nombres).length ? null : _waCargarNombres(msgs);
  }).then(function(){
    _waPintarLista();
    if(_waEstado.activo){_waPintarBoton();_waPintarMsgs();}
    _waBadgeMenu();
  }).catch(function(e){
    console.error("[chats] no se pudieron cargar:",e);
    if(mostrarCarga){
      var c=document.getElementById("waChats");
      if(c)c.innerHTML="<div style='padding:26px;text-align:center;color:#8696a0;font-size:.82rem'>"+
        "No se pudieron cargar los chats.<br>"+_waEsc(e.message||"")+"</div>";
    }
  }).then(function(){ _waEstado.cargando=false; });
}

/**
 * Le pone nombre a los números cruzando con la ficha de clientes.
 *
 * El cruce es por los últimos 8 dígitos y no por el número entero: en la base
 * los teléfonos están cargados de mil formas (con 0, con 15, con +54, con
 * guiones) y comparar completo no matchearía casi nunca.
 */
function _waCargarNombres(msgs){
  var tels={};
  msgs.forEach(function(m){ if(m.telefono)tels[m.telefono]=1; });
  var lista=Object.keys(tels);
  if(!lista.length)return null;

  return apiGet("clientes","select=nombre,telefono_principal&limit=4000").then(function(cs){
    var porCola={};
    (cs||[]).forEach(function(c){
      var d=String(c.telefono_principal||"").replace(/[^0-9]/g,"");
      if(d.length>=8 && c.nombre) porCola[d.slice(-8)]=c.nombre;
    });
    lista.forEach(function(t){
      var d=String(t).replace(/[^0-9]/g,"");
      if(d.length>=8 && porCola[d.slice(-8)]) _waEstado.nombres[t]=porCola[d.slice(-8)];
    });
  }).catch(function(){ /* sin nombres se ve el número: molesta, pero no rompe */ });
}

/** Agrupa los mensajes por número y arma la lista, la más reciente arriba. */
function _waConversaciones(){
  var porTel={};
  _waEstado.msgs.forEach(function(m){
    if(!m.telefono)return;
    if(!porTel[m.telefono])porTel[m.telefono]={telefono:m.telefono,msgs:[]};
    porTel[m.telefono].msgs.push(m);
  });
  var arr=Object.keys(porTel).map(function(t){
    var c=porTel[t];
    c.ultimo=c.msgs[c.msgs.length-1];
    c.bot=_waEstado.convs[t]!==false;
    return c;
  });
  arr.sort(function(a,b){ return (b.ultimo?b.ultimo.id:0)-(a.ultimo?a.ultimo.id:0); });
  return arr;
}

function _waPintarLista(){
  var cont=document.getElementById("waChats"); if(!cont)return;
  var q=(gv("waBuscar")||"").toLowerCase().trim();
  var convs=_waConversaciones();

  if(q){
    var soloNum=q.replace(/[^0-9]/g,"");
    convs=convs.filter(function(c){
      return _waNombre(c.telefono).toLowerCase().indexOf(q)>=0 ||
             (soloNum&&String(c.telefono).indexOf(soloNum)>=0) ||
             (c.ultimo&&String(c.ultimo.texto||"").toLowerCase().indexOf(q)>=0);
    });
  }

  if(!convs.length){
    cont.innerHTML="<div style='padding:30px 20px;text-align:center;color:#8696a0;font-size:.82rem;line-height:1.6'>"+
      (q?"No hay chats que coincidan con esa búsqueda."
        :"Todavía no hay conversaciones.<br>Cuando alguien le escriba a Belle, aparece acá.")+"</div>";
    return;
  }

  var h="";
  convs.forEach(function(c){
    var u=c.ultimo||{};
    var prev=(u.rol==="assistant"?"<span style='color:#8696a0'>&#10003;&#10003; </span>":"")+
             _waEsc(String(u.texto||"").replace(/\n/g," ").slice(0,60));
    h+='<div class="wa-chat'+(c.telefono===_waEstado.activo?' act':'')+'" onclick="_waAbrirChat(\''+
       _waEsc(c.telefono)+'\')">'+
       '<div class="wa-av" style="background:'+_waColor(c.telefono)+'">'+_waEsc(_waIniciales(c.telefono))+'</div>'+
       '<div class="wa-chat-cuerpo">'+
         '<div class="wa-chat-l1"><div class="wa-chat-nom">'+_waEsc(_waNombre(c.telefono))+'</div>'+
         '<div class="wa-chat-hora">'+_waEsc(_waHoraCorta(u.creado_en))+'</div></div>'+
         '<div class="wa-chat-l2"><div class="wa-chat-prev">'+prev+'</div>'+
         (c.bot?'':'<span class="wa-pausa">VOS</span>')+'</div>'+
       '</div></div>';
  });
  cont.innerHTML=h;
}

function _waAbrirChat(tel){
  _waEstado.activo=tel;
  var app=document.getElementById("waApp"); if(app)app.classList.add("viendo");
  var v=document.getElementById("waVacio"); if(v)v.style.display="none";
  var c=document.getElementById("waConv"); if(c)c.style.display="flex";

  var av=document.getElementById("waConvAv");
  if(av){av.textContent=_waIniciales(tel);av.style.background=_waColor(tel);}
  var nom=document.getElementById("waConvNom"); if(nom)nom.textContent=_waNombre(tel);
  var sub=document.getElementById("waConvSub");
  if(sub)sub.textContent=_waEstado.nombres[tel]?_waTel(tel):"cliente sin ficha";

  _waPintarBoton();
  _waPintarMsgs();
  _waPintarLista();
  var t=document.getElementById("waTexto"); if(t)t.focus();
}

function _waCerrar(){
  _waEstado.activo="";
  var app=document.getElementById("waApp"); if(app)app.classList.remove("viendo");
  var c=document.getElementById("waConv"); if(c)c.style.display="none";
  var v=document.getElementById("waVacio"); if(v)v.style.display="flex";
  _waPintarLista();
}

function _waPintarMsgs(){
  var cont=document.getElementById("waMsgs"); if(!cont)return;
  var tel=_waEstado.activo;
  var msgs=_waEstado.msgs.filter(function(m){return m.telefono===tel;});

  // Solo se vuelve a dibujar si hay algo nuevo: si no, el refresco automático
  // te robaría el scroll cada 12 segundos mientras leés una charla vieja.
  var ultimo=msgs.length?msgs[msgs.length-1].id:0;
  if(cont.getAttribute("data-tel")===tel && cont.getAttribute("data-ult")===String(ultimo))return;

  var h="",diaAnt="";
  msgs.forEach(function(m){
    var dia=_waDia(m.creado_en);
    if(dia&&dia!==diaAnt){ h+='<div class="wa-dia"><span>'+_waEsc(dia)+'</span></div>'; diaAnt=dia; }
    var mio=m.rol==="assistant";
    // Lo que mandó el cliente. El hueco se pinta ahora y el archivo entra
    // cuando llegan las URLs firmadas (_waMedios), que se piden todas juntas.
    var audio="";
    if(m.media_archivo){
      audio='<div class="wa-media" id="waMe'+m.id+'" data-arch="'+_waEsc(m.media_archivo)+
        '" data-tipo="'+_waEsc(m.media_tipo||"")+'">'+
        '<div class="wa-media-cargando">'+_waMediaIcono(m.media_tipo)+' Cargando…</div></div>';
    }
    h+='<div class="wa-fila '+(mio?"mio":"suyo")+'"><div class="wa-burb">'+
       (m.por_humano?'<div class="wa-quien">Vos</div>':'')+
       audio+
       '<span class="wa-txt">'+_waEsc(m.texto)+'</span>'+
       '<span class="wa-meta">'+_waEsc(_waHora(m.creado_en))+
       (mio?'<span class="wa-tilde">&#10003;&#10003;</span>':'')+'</span>'+
       '<div style="clear:both"></div></div></div>';
  });
  if(!msgs.length)h='<div style="text-align:center;color:#8696a0;padding:40px;font-size:.82rem">Sin mensajes.</div>';

  cont.innerHTML=h;
  cont.setAttribute("data-tel",tel);
  cont.setAttribute("data-ult",String(ultimo));
  cont.scrollTop=cont.scrollHeight;
  _waPintarMedios(cont);
}

function _waMediaIcono(tipo){
  if(tipo==="foto")return "&#128247;";
  if(tipo==="video")return "&#127909;";
  return "&#127908;";
}

/* ═══ Lo que mandó el cliente ════════════════════════════════════════════
 * El bucket es privado —son la voz y las fotos de un cliente, no la foto de un
 * frasco— así que las URLs las firma la Edge Function después de chequear la
 * sesión del panel. Se piden TODAS las del chat de una sola vez: una llamada
 * por foto serían diez viajes para pintar la misma pantalla.
 *
 * Y se guardan 30 días: lo más viejo ya no está, y ahí se dice, en vez de
 * dejar un reproductor roto. */
function _waPintarMedios(cont){
  var cajas=cont.querySelectorAll(".wa-media[data-arch]");
  if(!cajas.length)return;

  var archivos=[],porArchivo={};
  for(var i=0;i<cajas.length;i++){
    var a=cajas[i].getAttribute("data-arch");
    if(!a)continue;
    if(!porArchivo[a]){ porArchivo[a]=[]; archivos.push(a); }
    porArchivo[a].push(cajas[i]);
  }

  fetch(SB_URL+"/functions/v1/belle-whatsapp/medios",{
    method:"POST",
    headers:{"Authorization":"Bearer "+(_authToken||SB_KEY),"Content-Type":"application/json"},
    body:JSON.stringify({archivos:archivos})
  }).then(function(r){return r.json();}).then(function(d){
    if(d.error)throw new Error(d.error);
    var urls=d.urls||{};
    archivos.forEach(function(arch){
      var url=urls[arch];
      porArchivo[arch].forEach(function(caja){
        var tipo=caja.getAttribute("data-tipo");
        if(!url){
          caja.innerHTML='<div class="wa-media-err">'+_waMediaIcono(tipo)+
            ' Ya no está guardado (se borran a los '+(d.dias||30)+' días)</div>';
          return;
        }
        if(tipo==="foto"){
          caja.innerHTML='<img class="wa-media-foto" src="'+_waEsc(url)+
            '" alt="Foto del cliente" onclick="_waLupa(this.src)" loading="lazy">';
        } else if(tipo==="video"){
          caja.innerHTML='<video controls preload="metadata" src="'+_waEsc(url)+'"></video>';
        } else {
          caja.innerHTML='<audio controls preload="metadata" src="'+_waEsc(url)+'"></audio>';
        }
      });
    });
  }).catch(function(e){
    for(var i=0;i<cajas.length;i++){
      cajas[i].innerHTML='<div class="wa-media-err">No se pudo abrir: '+
        _waEsc(e.message||String(e))+'</div>';
    }
  });
}

/** La foto en grande. Se cierra tocando en cualquier lado o con Escape. */
function _waLupa(src){
  var lupa=document.createElement("div");
  lupa.className="wa-lupa";
  lupa.innerHTML='<img src="'+_waEsc(src)+'" alt="">';
  function cerrar(){ lupa.remove(); document.removeEventListener("keydown",tecla); }
  function tecla(e){ if(e.key==="Escape")cerrar(); }
  lupa.onclick=cerrar;
  document.addEventListener("keydown",tecla);
  document.body.appendChild(lupa);
}

function _waPintarBoton(){
  var sw=document.getElementById("waSw"), txt=document.getElementById("waSwTxt");
  var aviso=document.getElementById("waAviso");
  var activo=_waEstado.convs[_waEstado.activo]!==false;
  if(sw)sw.className="wa-sw"+(activo?" on":"");
  if(txt)txt.textContent=activo?"Belle responde":"Respondés vos";
  if(aviso){
    aviso.style.display=activo?"none":"block";
    aviso.innerHTML="Belle no contesta en este chat porque lo tomaste vos. "+
      "Tocá <b>Respondés vos</b> arriba para devolvérselo.";
  }
}

function _waToggleBot(){
  var tel=_waEstado.activo; if(!tel)return;
  var activo=_waEstado.convs[tel]!==false;
  var nuevo=!activo;
  _waEstado.convs[tel]=nuevo;   // se pinta ya, sin esperar al servidor
  _waPintarBoton(); _waPintarLista();

  _waLlamar("bot",{telefono:tel,activo:nuevo}).catch(function(e){
    _waEstado.convs[tel]=activo;   // no se pudo: se vuelve atrás
    _waPintarBoton(); _waPintarLista();
    toast("No se pudo cambiar: "+(e.message||e),'terr');
  });
}

// ═══════════════════════════════════════════════════════════════════════
// CUÁNTO CUESTA BELLE
// La cuenta la hace la Edge Function (ruta /gasto): junta la factura de Meta
// (pricing_analytics, en pesos) con los tokens que Belle gastó en Anthropic
// (wa_costos, en dólares, pasados a pesos con la cotización del catálogo).
// Acá solo se elige el rango y se muestra. Mientras está abierto se refresca
// solo cada 30 segundos.
// ═══════════════════════════════════════════════════════════════════════
var _waGasto={timer:null,preset:'hoy',cargando:false};

function _waGastoHoy(){ return new Date().toLocaleDateString('en-CA',{timeZone:'America/Argentina/Cordoba'}); }
function _waGastoRango(){
  var hoy=_waGastoHoy();
  var d=new Date(hoy+'T12:00:00');
  function iso(x){ return x.toLocaleDateString('en-CA'); }
  if(_waGasto.preset==='hoy') return {desde:hoy,hasta:hoy};
  if(_waGasto.preset==='7'){ d.setDate(d.getDate()-6); return {desde:iso(d),hasta:hoy}; }
  if(_waGasto.preset==='30'){ d.setDate(d.getDate()-29); return {desde:iso(d),hasta:hoy}; }
  if(_waGasto.preset==='mes') return {desde:hoy.slice(0,8)+'01',hasta:hoy};
  var a=gv('waGastoDesde')||hoy, b=gv('waGastoHasta')||hoy;
  if(a>b){ var t=a; a=b; b=t; }
  return {desde:a,hasta:b};
}
function _waGastoAbrir(){
  var el=document.getElementById('waGasto'); if(!el) return;
  el.style.display='flex';
  var r=_waGastoRango();
  var i1=document.getElementById('waGastoDesde'), i2=document.getElementById('waGastoHasta');
  if(i1&&!i1.value) i1.value=r.desde;
  if(i2&&!i2.value) i2.value=r.hasta;
  _waGastoCargar();
  if(_waGasto.timer) clearInterval(_waGasto.timer);
  _waGasto.timer=setInterval(_waGastoCargar,30000);
}
function _waGastoCerrar(){
  var el=document.getElementById('waGasto'); if(el) el.style.display='none';
  if(_waGasto.timer){ clearInterval(_waGasto.timer); _waGasto.timer=null; }
}
function _waGastoPreset(p, btn){
  _waGasto.preset=p;
  document.querySelectorAll('.wa-gasto-chip').forEach(function(c){ c.classList.toggle('act', c.getAttribute('data-p')===p); });
  if(p!=='custom'){
    var r=_waGastoRango();
    var i1=document.getElementById('waGastoDesde'), i2=document.getElementById('waGastoHasta');
    if(i1) i1.value=r.desde; if(i2) i2.value=r.hasta;
  }
  _waGastoCargar();
}
function _waGastoCargar(){
  if(_waGasto.cargando) return;
  var el=document.getElementById('waGasto'); if(!el||el.style.display==='none') return;
  _waGasto.cargando=true;
  var r=_waGastoRango();
  fetch(SB_URL+"/functions/v1/belle-whatsapp/gasto?desde="+r.desde+"&hasta="+r.hasta,{
    headers:{"Authorization":"Bearer "+(_authToken||SB_KEY)}
  }).then(function(res){
    return res.json().catch(function(){return {};}).then(function(b){
      if(!res.ok) throw new Error(b.error||("error "+res.status));
      return b;
    });
  }).then(_waGastoPintar).catch(function(e){
    var body=document.getElementById('waGastoBody');
    if(body) body.innerHTML="<div class='wa-gasto-aviso'>No se pudo consultar el gasto: "+_waEsc(e.message||e)+"</div>";
  }).then(function(){ _waGasto.cargando=false; });
}
function _waGastoPintar(g){
  var body=document.getElementById('waGastoBody'); if(!body) return;
  var ars=function(n){ return '$ '+Math.round(n||0).toLocaleString('es-AR'); };
  var usd=function(n){ return 'US$ '+(Number(n||0)).toLocaleString('es-AR',{minimumFractionDigits:2,maximumFractionDigits:4}); };
  var fecha=function(d){ var p=String(d).split('-'); return p[2]+'/'+p[1]; };
  var mismoDia=(g.desde===g.hasta);
  var maxDia=0; (g.dias||[]).forEach(function(d){ maxDia=Math.max(maxDia, (d.meta_ars||0)+(d.anthropic_usd||0)*(g.cotizacion_usd||0)); });

  var h="<div class='wa-gasto-tot'>"+
    "<div class='wa-gasto-card'><div class='k'>Meta · WhatsApp</div><div class='v'>"+ars(g.meta_ars)+"</div>"+
      "<div class='s'>"+(g.meta_cobrados||0)+" mensaje"+(g.meta_cobrados===1?'':'s')+" con costo · "+(g.meta_gratis||0)+" gratis</div></div>"+
    "<div class='wa-gasto-card'><div class='k'>Anthropic · Claude</div><div class='v'>"+usd(g.anthropic_usd)+"</div>"+
      "<div class='s'>"+ars(g.anthropic_ars)+" · "+(g.respuestas||0)+" respuesta"+(g.respuestas===1?'':'s')+"</div></div>"+
    "<div class='wa-gasto-card total'><div class='k'>Total</div><div class='v'>"+ars(g.total_ars)+"</div>"+
      "<div class='s'>"+(mismoDia?fecha(g.desde):fecha(g.desde)+' → '+fecha(g.hasta))+" · dólar a "+ars(g.cotizacion_usd)+"</div></div>"+
  "</div>";
  if(g.aviso) h+="<div class='wa-gasto-aviso'>⚠ "+_waEsc(g.aviso)+"</div>";
  if(!(g.dias||[]).length){
    h+="<div style='padding:20px;text-align:center;color:#8696a0;font-size:.8rem'>Sin gasto en este rango.</div>";
  } else {
    h+="<table class='wa-gasto-tabla'><thead><tr><th>Día</th><th>Meta</th><th>Anthropic</th><th>Resp.</th><th style='width:32%'></th><th class='n'>Total</th></tr></thead><tbody>";
    g.dias.slice().reverse().forEach(function(d){
      var aArs=(d.anthropic_usd||0)*(g.cotizacion_usd||0), tot=(d.meta_ars||0)+aArs;
      var pm=maxDia?Math.round((d.meta_ars||0)/maxDia*100):0, pa=maxDia?Math.round(aArs/maxDia*100):0;
      h+="<tr><td>"+fecha(d.dia)+"</td><td>"+ars(d.meta_ars)+"</td><td>"+usd(d.anthropic_usd)+"</td><td>"+(d.respuestas||0)+"</td>"+
        "<td><div class='wa-gasto-bar' style='display:flex;gap:2px'><i class='meta' style='width:"+pm+"%'></i><i style='width:"+pa+"%'></i></div></td>"+
        "<td class='n'><b>"+ars(tot)+"</b></td></tr>";
    });
    h+="</tbody></table>"+
      "<div style='font-size:.62rem;color:#8696a0;margin-top:8px'><span style='display:inline-block;width:10px;height:6px;background:#4f8ef7;border-radius:2px;vertical-align:middle'></span> Meta &nbsp; "+
      "<span style='display:inline-block;width:10px;height:6px;background:#00a884;border-radius:2px;vertical-align:middle'></span> Anthropic</div>";
  }
  body.innerHTML=h;
}

/** Le habla a la Edge Function del agente con la sesión del admin. */
function _waLlamar(ruta,cuerpo){
  return fetch(SB_URL+"/functions/v1/belle-whatsapp/"+ruta,{
    method:"POST",
    headers:{"Content-Type":"application/json","Authorization":"Bearer "+(_authToken||SB_KEY)},
    body:JSON.stringify(cuerpo)
  }).then(function(r){
    return r.json().catch(function(){return {};}).then(function(b){
      if(!r.ok)throw new Error(b.error||("error "+r.status));
      return b;
    });
  });
}

function _waCrecer(el){ el.style.height="auto"; el.style.height=Math.min(el.scrollHeight,110)+"px"; }

function _waTecla(ev){
  // Enter manda, Shift+Enter hace un renglón nuevo. Igual que WhatsApp Web.
  if(ev.key==="Enter"&&!ev.shiftKey){ ev.preventDefault(); _waEnviar(); }
}

function _waEnviar(){
  var tel=_waEstado.activo; if(!tel)return;
  var ta=document.getElementById("waTexto"); if(!ta)return;
  var texto=(ta.value||"").trim(); if(!texto)return;

  var btn=document.getElementById("waBtnEnviar");
  if(btn)btn.disabled=true;
  ta.disabled=true;

  _waLlamar("responder",{telefono:tel,texto:texto}).then(function(){
    ta.value=""; _waCrecer(ta);
    _waEstado.convs[tel]=false;   // enviar a mano calla al bot; el panel lo refleja
    _waPintarBoton();
    // Se pide de nuevo en vez de dibujar el mensaje a mano: así aparece con su
    // id y su hora reales, no con los que invente el navegador.
    var c=document.getElementById("waMsgs"); if(c)c.removeAttribute("data-ult");
    return _waCargar(false);
  }).catch(function(e){
    toast("No se pudo enviar: "+(e.message||e),'terr');
  }).then(function(){
    if(btn)btn.disabled=false;
    ta.disabled=false; ta.focus();
  });
}

/**
 * El puntito del menú: cuántas conversaciones esperan una respuesta nuestra.
 * Se cuentan las que quedaron con el último mensaje del cliente.
 */
function _waBadgeMenu(){
  var b=document.getElementById("waMenuBadge"); if(!b)return;
  var n=_waConversaciones().filter(function(c){
    return c.ultimo && c.ultimo.rol==="user";
  }).length;
  b.textContent=n;
  b.style.display=n?"inline-flex":"none";
}
