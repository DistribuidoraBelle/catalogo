import json,sys
sys.path.insert(0,'.')
from data import *
g=sys.argv[1]; C=json.load(open(f'cues_{g}.json')); box=json.load(open('box.json'))
keys=['aries','tauro','géminis','cáncer','leo','virgo','libra','escorpio','sagitario','capricornio','acuario','piscis']
signs=[]
for i,s in enumerate(SIGNS):
    signs.append(dict(id=s[0],n=s[1],g=s[2],d=s[3],e=s[4],ec=s[5],f=FR[g][i],b=B[g][i],bn=[N[k] for k in B[g][i]],t0=C[keys[i]],box=box[s[0]]))
D=dict(cues=C,signs=signs,smoke='rgba(70,185,255,.85)' if g=='h' else 'rgba(255,95,180,.85)',star='#8fd8ff' if g=='h' else '#ff9ccf',tint='rgba(70,160,255,.16)' if g=='h' else 'rgba(255,90,170,.16)')
open(f'idx_{g}.html','w').write(open('tpl.html').read().replace('<script>\nvar D=window.D','<script>window.D='+json.dumps(D,ensure_ascii=False)+';</script><script>\nvar D=window.D',1))
