# crea cdnF<n>: data.js, cfg.js, timing (estimado o real), copia escena
import json,re,os,sys,shutil
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from guiones import PARTS,frases,cfg
S=os.path.dirname(os.path.abspath(__file__))+'/'
n=int(sys.argv[1]);mode=sys.argv[2] if len(sys.argv)>2 else 'est'
D=S+'cdnF%d/'%n;os.makedirs(D,exist_ok=True)
if D!=S+'cdnF1/':
  if D!=S+'cdnF1/':
    for f in ['scene.js','common.js','common2.js','render.js','render_part.js','style.css','build.py','logo.png']: shutil.copy(S+'cdnF1/'+f,D+f)
if not os.path.exists(D+'fotos'): os.symlink('../lux1/fotos',D+'fotos')
shutil.copy(S+'objs.js',D+'objs.js')
open(D+'cfg.js','w').write(cfg(n))
if n>1:
    PJ=json.load(open(S+'parts234.json'))[str(n)]['P']
    P=[]
    for i,e in enumerate(PJ):
        ins=e['ins'] or {}
        if not ins.get('img'):ins={'lbl':'COMPOSICIÓN PROPIA DE ARMAF' if e['name']=='MALEKA' else 'CREACIÓN ORIGINAL DE ARMAF'}
        P.append(dict(k=e['k'],name=e['name'],cut=e['cut'],N=e['N'],ins=ins,n='n%d'%(i+1),q='q%d'%(i+1),i='i%d'%(i+1),end='p%d'%(i+2) if i+1<len(PJ) else 'out',quote=e['quote'],mk=e['mk']))
    open(D+'data.js','w').write('var P='+json.dumps(P,ensure_ascii=False,indent=0)+';')
else:
    shutil.copy(S+'cdnF1/data.js',D+'data.js') if D!=S+'cdnF1/' else None
F=frases(n)
def syl(w):
    w=w.lower().replace('540','cinco cuatro cero').replace('300','trescientos')
    return max(1,len(re.findall(r'[aeiouáéíóúüy]+',w)))
if mode=='est':
    t=0.0;T=[]
    for k,txt in F:
        d=sum(syl(w) for w in txt.split())/5.6;T.append((k,txt,round(t,2),round(t+d,2)));t+=d+(0.5 if k and k[0] in 'pi' else 0.32)
    vdur=t
elif mode=='stt':
    from align_stt import align as al2
    R=al2(D+'mix/stt.json',F);vdur=float(os.popen("ffprobe -v error -show_entries format=duration -of csv=p=0 "+D+"mix/voz.wav").read());T=[(k,txt,a,z) for k,txt,a,z,ws in R];WT={k:ws for k,txt,a,z,ws in R}
else:
    sys.path.insert(0,S+'cdn');from align import align
    T=[(k,txt,a,z) for k,txt,a,z in align(D+'mix/voz.wav',F)]
    vdur=float(os.popen("ffprobe -v error -show_entries format=duration -of csv=p=0 "+D+"mix/voz.wav").read())
cues={};subs=[]
for k,txt,a,z in T:
    cues[k]=max(0,round(a-0.1,3))
    words=txt.split();W=[syl(w) for w in words];tot=sum(W);acc=0;wt=[]
    for w,ww in zip(words,W): wt.append((w,a+(z-a)*acc/tot)); acc+=ww
    if mode=='stt' and k in WT and len(WT[k])==len(wt): wt=WT[k]
    line=[]
    for j,(w,tt) in enumerate(wt):
        line.append({'s':w,'t':round(tt,3)})
        if len(line)>=6 or (len(line)>=3 and re.search(r'[,:…;]$',w)) or j==len(wt)-1:
            nxt=wt[j+1][1] if j+1<len(wt) else z
            subs.append({'t0':line[0]['t'],'t1':round(nxt+0.15 if j==len(wt)-1 else nxt-0.02,3),'w':line}); line=[]
cues['hook']=0;cues['t1']=-5;cues['dur']=round(vdur+3.0,2);cues['fol']=round(cues['out2']+3.6,2)
open(D+'timing.js','w').write('window.CUES='+json.dumps(cues)+';\nwindow.SUBS='+json.dumps(subs,ensure_ascii=False)+';\n')
print('parte',n,mode,'dur',cues['dur'])
