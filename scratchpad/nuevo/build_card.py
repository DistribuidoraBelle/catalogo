import os,sys,json
S=os.path.dirname(os.path.abspath(__file__)); REPO='/home/user/catalogo'
real='--real' in sys.argv; belle='--belle' in sys.argv
MARK='<!-- BELLE NUEVO · card -->'
s=open(REPO+'/card.html',encoding='utf-8').read()
if MARK in s: s=s[:s.index(MARK)].rstrip()+'\n</head>\n'+s[s.index('</head>')+len('</head>'):] if False else s
# si ya tiene el bloque (card.html real), se lo saca para regenerarlo
if MARK in s:
    a=s.index(MARK); b=s.index('<!-- /BELLE NUEVO · card -->')+len('<!-- /BELLE NUEVO · card -->')
    s=s[:a]+s[b:]
fonts='<link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&display=swap" rel="stylesheet">'
css=open(S+'/card_nuevo.css',encoding='utf-8').read()
if belle:
    sys.path.insert(0,S); from belle_paleta import bellizar
    css=bellizar(css)   # paleta Belle (dorados), igual que el catálogo
if real:
    # el tema de la card arranca cuando termina el CyberMonday (igual que el catálogo); ?nuevo=1 lo muestra antes
    bloque=(MARK+'\n'+fonts+'\n<script>(function(){try{var q=new URLSearchParams(location.search).get("nuevo");if(q==="0")return;'
            'var DESDE=Date.UTC(2026,10,5,3,0,0);if(q!=="1"&&Date.now()<DESDE)return;'
            'var st=document.createElement("style");st.id="cardNuevoCss";st.textContent='+json.dumps(css)+';document.head.appendChild(st);document.documentElement.classList.add("nv");}catch(e){}})();</script>\n<!-- /BELLE NUEVO · card -->')
    assert s.count('</head>')==1
    s=s.replace('</head>',bloque+'\n</head>',1)
    out=REPO+'/card.html'
else:
    a='<link href="https://fonts.googleapis.com/css2?family=Marcellus&family=Jost:wght@300..600&display=swap" rel="stylesheet">'
    assert s.count(a)==1
    s=s.replace(a,fonts)
    s=s.replace('</style>','</style>\n<!-- BELLE NUEVO · card de prueba -->\n<style id="cardNuevoCss">\n'+css+'\n</style>',1)
    out=REPO+'/card-nuevo-prueba.html'
# "1 unidad" → "Precio lista" (regla: no más x1 / 1 unidad)
s=s.replace("'1 unidad'","'Precio lista'").replace('>1 unidad<','>Precio lista<')
open(out,'w',encoding='utf-8').write(s); print('ok ->',out,len(s))
