F=[
('hook',"¿Por qué hay perfumes que amás…",1,0.05,1.66),
(None,"y otros que no soportás ni a un metro?",1,1.95,4.11),
(None,"No es casualidad.",1,4.76,5.62),
(None,"Cada perfume pertenece a una familia.",1,6.22,8.30),
(None,"Y si sabés cuál es la tuya,",1,8.79,10.16),
(None,"no le errás nunca más.",1,10.43,11.98),
('c1',"Los cítricos:",1,12.86,13.77),('c1s',"limón, bergamota, naranja.",1,14.20,16.21),('c1a',"Frescos, livianos, perfectos para el verano.",1,16.80,19.62),('c1p',"Como el CK One.",1,20.18,21.00),
('c2',"Los florales:",1,21.74,22.57),('c2s',"jazmín, rosa, flores blancas.",1,23.13,25.43),('c2a',"Delicados y románticos.",1,25.96,27.66),('c2p',"Como el Yara Rosa.",1,28.09,29.20),
('c3',"Los amaderados:",2,0.05,1.01),('c3s',"sándalo, cedro, vetiver.",2,1.47,3.48),('c3a',"Elegantes y seguros.",2,4.03,5.61),('c3p',"Como el Club de Nuit Intense.",2,6.05,7.38),
('c4',"Los orientales:",2,7.92,8.87),('c4s',"ámbar, especias, oud.",2,9.31,11.26),('c4a',"Intensos y sensuales, ideales para la noche.",2,11.88,14.91),('c4p',"Como el Amber Oud Gold.",2,15.46,16.79),
('c5',"Y los gourmand:",2,17.31,17.96),('c5s',"vainilla, caramelo, café.",2,18.54,20.42),('c5a',"Dulces y adictivos, de esos que te preguntan qué tenés puesto.",2,21.07,24.53),('c5p',"Como el Khamrah Qahwa.",2,25.06,26.06),
('end',"¿No sabés cuál es tu familia?",2,26.70,28.00),(None,"Escribinos BELLE por mensaje directo y te la encontramos.",2,28.47,31.76),
]
OFF={1:0.0,2:29.63}
import json,re
def syl(w): return max(1,len(re.findall(r'[aeiouáéíóúü]+',w.lower())))
cues={};subs=[]
for k,txt,b,a,z in F:
    a+=OFF[b];z+=OFF[b]
    if k: cues[k]=max(0,round(a-0.12,3))
    words=txt.split();W=[syl(w) for w in words];tot=sum(W);acc=0;wt=[]
    for w,ww in zip(words,W): wt.append((w,a+(z-a)*acc/tot)); acc+=ww
    line=[]
    for j,(w,tt) in enumerate(wt):
        line.append({'s':w,'t':round(tt,3)})
        if len(line)>=6 or (len(line)>=3 and re.search(r'[,:…]$',w)) or j==len(wt)-1:
            nxt=wt[j+1][1] if j+1<len(wt) else z
            subs.append({'t0':line[0]['t'],'t1':round(nxt+0.15 if j==len(wt)-1 else nxt-0.02,3),'w':line}); line=[]
cues['hook']=0;cues['dur']=round(OFF[2]+31.79+1.8,2)
open('timing.js','w').write('window.CUES='+json.dumps(cues)+';\nwindow.SUBS='+json.dumps(subs,ensure_ascii=False)+';\n')
print(cues)
