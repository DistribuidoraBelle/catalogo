F=[
('hook',"Hay una madera que vale más que el oro…",1,0.05,2.07),
('h2',"y seguro está en uno de tus perfumes.",1,2.70,4.96),
('h3',"Se llama oud.",1,5.49,6.43),
('ar',"Sale de un árbol del sudeste asiático:",1,7.09,9.04),
('ar2',"el Aquilaria.",1,9.47,10.12),
('ar3',"Pero ojo:",1,10.75,11.26),
('ar4',"el árbol sano no huele a nada.",1,11.72,13.71),
('he',"El secreto es una herida.",1,14.25,15.80),
('he2',"Cuando el árbol se lastima y lo ataca un hongo,",1,16.33,18.75),
('he3',"se defiende fabricando una resina oscura y perfumada,",1,18.96,22.09),
('he4',"que le llena la madera de vetas negras.",1,22.54,24.64),
('he5',"Eso es el oud.",1,25.11,26.13),
('he6',"Y en la naturaleza,",1,26.65,27.59),
(None,"pasa en muy pocos árboles.",1,27.80,29.53),
('ex',"Para extraerlo, se corta la madera,",2,0.05,2.10),
('ex2',"se separan a mano las vetas oscuras,",2,2.39,4.50),
('ex3',"se dejan en remojo…",2,4.50,5.85),
('ex4',"y se destilan durante días.",2,6.41,8.17),
('ex5',"De decenas de kilos de madera salen apenas unos mililitros de aceite.",2,8.74,12.87),
('ti',"Y no hay un solo oud:",2,13.37,14.70),
('ti1',"el de India es intenso y animal;",2,15.31,17.40),
('ti2',"el de Camboya,",2,17.90,18.78),
(None,"dulce y frutal;",2,18.99,19.94),
('ti3',"el de Tailandia y Laos, ahumado;",2,20.38,22.29),
('ti4',"y el de Malasia e Indonesia, más suave y amaderado.",2,22.71,25.75),
('pr',"Es escaso,",2,26.37,26.99),
('pr2',"tarda años en formarse",2,27.43,28.60),
('pr3',"y está protegido.",2,28.60,29.95),
('pr4',"Por eso el de mejor calidad se paga,",2,30.43,32.58),
('pr5',"gramo por gramo, más caro que el oro.",2,32.81,34.88),
('ac',"Y por eso muchos perfumes usan un acorde de oud:",2,35.41,38.14),
('ac2',"una recreación de ese olor,",2,38.60,40.15),
(None,"más accesible.",2,40.38,41.15),
('im',"El oud le da profundidad,",2,41.72,43.16),
('im2',"misterio y una duración enorme.",2,43.48,45.70),
('im3',"Es el alma de los perfumes árabes.",2,46.19,48.09),
('cta',"¿Querés probar uno con oud?",2,48.60,49.63),
('end',"Escribinos BELLE por mensaje directo.",2,50.15,52.31),
]
OFF={1:0.0,2:30.16}
import json,re
def syl(w): return max(1,len(re.findall(r'[aeiouáéíóúü]+',w.lower())))
cues={};subs=[]
for k,txt,b,a,z in F:
    a+=OFF[b];z+=OFF[b]
    if k: cues[k]=max(0,round(a-0.1,3))
    words=txt.split();W=[syl(w) for w in words];tot=sum(W);acc=0;wt=[]
    for w,ww in zip(words,W): wt.append((w,a+(z-a)*acc/tot)); acc+=ww
    line=[]
    for j,(w,tt) in enumerate(wt):
        line.append({'s':w,'t':round(tt,3)})
        if len(line)>=6 or (len(line)>=3 and re.search(r'[,:…;]$',w)) or j==len(wt)-1:
            nxt=wt[j+1][1] if j+1<len(wt) else z
            subs.append({'t0':line[0]['t'],'t1':round(nxt+0.15 if j==len(wt)-1 else nxt-0.02,3),'w':line}); line=[]
cues['hook']=0;cues['t1']=-5;cues['dur']=round(OFF[2]+52.56+1.6,2)
open('timing.js','w').write('window.CUES='+json.dumps(cues)+';\nwindow.SUBS='+json.dumps(subs,ensure_ascii=False)+';\n')
print(cues)
