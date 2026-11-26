import sys,subprocess,json,os
v=sys.argv[1]; vf=int(sys.argv[2]) if len(sys.argv)>2 else 0
cues=subprocess.check_output(['python3','voz/cues.py',v],cwd='.').decode().strip()
html=open('video.html').read().replace('<script>\nvar C=window.CUES','<script>window.CUES='+cues+';window.VF='+str(vf)+';</script><script>\nvar C=window.CUES',1)
open('index.html','w').write(html); print(cues)
