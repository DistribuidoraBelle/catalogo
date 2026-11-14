F=[
('hook',"¿Te pasó que un perfume en la tienda huele a una cosa…",1,0.05,2.85),
(None,"y a las tres horas huele a otra?",1,3.14,4.74),
(None,"No te estafaron.",1,5.39,6.28),
(None,"Es la pirámide olfativa.",1,6.82,8.21),
(None,"Y casi nadie sabe usarla.",1,8.69,10.31),
('c1',"Arriba de todo están las notas de salida.",1,11.05,13.16),
(None,"Son las primeras que sentís:",1,13.69,15.03),
('c1s',"cítricos, especias, frescura.",1,15.53,17.92),
(None,"Duran unos quince minutos.",1,18.60,20.09),
('c2',"Después aparece el corazón:",1,20.83,22.25),
('c2s',"flores, frutas, lo dulce.",1,22.89,24.96),
(None,"Es la personalidad del perfume, y dura unas cuatro horas.",1,25.64,29.28),
('c3',"Y abajo, el fondo:",2,0.05,1.31),
('c3s',"vainilla, maderas, ámbar, almizcle.",2,1.87,4.85),
(None,"Es lo que queda en tu ropa hasta el otro día.",2,5.51,7.30),
('c4',"Mirá el Khamrah Qahwa:",2,7.92,8.85),
('k1',"arranca con canela y cardamomo,",2,9.43,11.09),
('k2',"sigue con praliné y frutas confitadas,",2,11.49,13.81),
('k3',"y termina en vainilla y café.",2,14.13,15.71),
('tip',"Por eso: nunca compres un perfume por los primeros cinco minutos.",2,16.26,20.16),
(None,"Esperá a que llegue el fondo.",2,20.61,21.84),
('end',"¿Querés que te ayudemos a elegir el tuyo?",2,22.46,24.07),
(None,"Escribinos BELLE por mensaje directo.",2,24.52,26.68),
]
OFF={1:0.0,2:29.71}
import json,re
def syl(w): return max(1,len(re.findall(r'[aeiouáéíóúü]+',w.lower())) + (1 if re.search(r'\d',w) else 0))
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
cues['hook']=0
cues['dur']=round(OFF[2]+26.91+1.8,2)
open('timing.js','w').write('window.CUES='+json.dumps(cues)+';\nwindow.SUBS='+json.dumps(subs,ensure_ascii=False)+';\n')
print(cues)
