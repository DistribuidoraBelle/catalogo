import os,json,re
A=[]
keep=set(re.findall(r'"([a-z0-9_]+\.png)"',open('data.js').read()))|{'f3747.png','logo_pr.png','logo_armaf_hd.png','logoB_ink.png'}
for root,ds,fs in os.walk("fotos",followlinks=True):
    for f in fs:
        if 'obj' in root or 'notas' in root and 'raw' not in root or (root=='fotos' and f in keep): A.append(os.path.join(root,f))
if os.path.isdir('extra'):
    for f in os.listdir('extra'):A.append('extra/'+f)
open("assets.js","w").write("window.__ASSETS="+json.dumps(A)+";")
css=open('style.css').read() if os.path.exists('style.css') else ''
open('index.html','w').write(open('../tpl2.html').read().replace('/*CSS*/',css))
print(len(A),'assets')
