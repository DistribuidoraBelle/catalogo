import os,json,re
need=set(re.findall(r"'(h\d+\.png)'",open('data.js').read()))
A=['fotos/'+f for f in need]
notes=set(re.findall(r"\['(\w+)','",open('data.js').read()))
for f in os.listdir('fotos/obj'):
    if f.rsplit('_',1)[0] in notes: A.append('fotos/obj/'+f)
open('assets.js','w').write('window.__ASSETS='+json.dumps(A)+';')
open('index.html','w').write(open('tpl.html').read())
print(len(A))
