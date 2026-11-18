tpl=open('tpl.html').read()
open('index.html','w').write(tpl.replace('/*HELPERS*/','').replace('/*HOOK*/',''))
