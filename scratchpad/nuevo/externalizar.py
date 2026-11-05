# Los bloques grandes de JavaScript embebido pasan a archivos con nombre FIJO (js/catalogo-1.js, js/nuevoJs.js…) y el HTML
# los referencia con ?v=<hash del contenido>: el navegador los cachea compilados entre visitas y renueva solo lo que cambió.
# Se editan como cualquier archivo; al correr la build se actualiza el ?v=. Mismo lugar y orden, sin async/defer.
import re,os,hashlib,glob
REPO='/home/user/catalogo'; MIN=20000
def _h(t): return hashlib.sha1(t.encode('utf-8')).hexdigest()[:10]
def procesar(path):
    s=open(path,encoding='utf-8').read(); out=[]; pos=0; n=0
    for m in re.finditer(r'<script(\s[^>]*)?>([\s\S]*?)</script>',s):
        attrs=m.group(1) or ''; body=m.group(2)
        msrc=re.search(r'src="(js/[A-Za-z0-9_-]+\.js)(?:\?v=[0-9a-f]+)?"',attrs)
        if msrc:   # ya externo: refrescar el ?v= con el contenido actual del archivo
            fn=msrc.group(1); fp=REPO+'/'+fn
            if os.path.exists(fp):
                v=_h(open(fp,encoding='utf-8').read()); nattrs=attrs.replace(msrc.group(0),'src="'+fn+'?v='+v+'"')
                out.append(s[pos:m.start()]); out.append('<script'+nattrs+'>'+body+'</script>'); pos=m.end()
            continue
        if 'src=' in attrs or len(body)<MIN: continue
        n+=1; mid=re.search(r'id="([A-Za-z0-9_-]+)"',attrs); nombre=(mid.group(1) if mid else 'catalogo-'+str(n))
        fn='js/'+nombre+'.js'; fp=REPO+'/'+fn; os.makedirs(REPO+'/js',exist_ok=True)
        if not os.path.exists(fp) or open(fp,encoding='utf-8').read()!=body: open(fp,'w',encoding='utf-8').write(body)
        out.append(s[pos:m.start()]); out.append('<script'+attrs+' src="'+fn+'?v='+_h(body)+'"></script>'); pos=m.end()
    out.append(s[pos:]); open(path,'w',encoding='utf-8').write(''.join(out))
def limpiar():
    refs=set()
    for h in glob.glob(REPO+'/*.html'): refs.update(re.findall(r'src="(js/[^"?]+)',open(h,encoding='utf-8').read()))
    for j in glob.glob(REPO+'/js/*.js'):
        if 'js/'+os.path.basename(j) not in refs: os.remove(j)
if __name__=='__main__':
    import sys
    for f in sys.argv[1:]: procesar(REPO+'/'+f)
    limpiar()
