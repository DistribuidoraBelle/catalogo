import re
a=open('../acad04/index.html').read()
h0=a.index('// ───────────────────────── helpers'); h1=a.index('var CUES=window.CUES',h0)
helpers=a[h0:h1]
hk0=a.index('// ═══════════════ GANCHO'); hk1=a.index('window.render=render;',hk0)
hook=a[hk0:hk1]
beats=open('beats.js').read()
hook=re.sub(r'var HK_BEATS=\[.*?\n\];',beats.strip(),hook,count=1,flags=re.S)
hook=hook.replace("$('sub').style.opacity=t<end?0:show;","")
tpl=open('tpl.html').read()
open('index.html','w').write(tpl.replace('/*HELPERS*/',helpers).replace('/*HOOK*/',hook))
