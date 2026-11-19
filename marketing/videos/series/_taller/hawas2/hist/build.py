import json,re
A=['fotos/'+f for f in set(re.findall(r"'(h\w+\.png)'",open('data.js').read()))]+['fotos/logo_armaf_hd.png']
open('assets.js','w').write('window.__ASSETS='+json.dumps(A)+';');open('index.html','w').write(open('tpl.html').read());print(len(A))
