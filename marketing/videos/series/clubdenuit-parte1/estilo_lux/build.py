import os,json
A=[]
for root,ds,fs in os.walk("fotos"):
    for f in fs:
        if f.lower().endswith((".png",".jpg")): A.append(os.path.join(root,f))
open("assets.js","w").write("window.__ASSETS="+json.dumps(A)+";")
tpl=open('tpl.html').read()
open('index.html','w').write(tpl.replace('/*HELPERS*/','').replace('/*HOOK*/',''))
