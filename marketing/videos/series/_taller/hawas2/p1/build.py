import os,json,re
d=open('data.js').read();A=['fotos/'+f for f in set(re.findall(r"'(h\w+\.png|esc_\w+\.jpg|logo_rasasi_hd_k\.png)'",d))]
notes=set(re.findall(r"\['(\w+)','",d))
for f in os.listdir('fotos/obj'):
    if f.rsplit('_',1)[0] in notes: A.append('fotos/obj/'+f)
open('assets.js','w').write('window.__ASSETS='+json.dumps(A)+';');open('index.html','w').write(open('tpl.html').read());print(len(A))
