F=[
('hook',"Hay perfumes que entran a la habitación antes que vos…",1,0.05,3.05),
(None,"y siguen ahí cuando ya te fuiste.",1,3.66,5.48),
(None,"Te explico por qué.",1,6.18,6.94),
('p',"Tu perfume arma una burbuja invisible a tu alrededor.",1,7.54,10.66),
(None,"Eso es la proyección:",1,11.31,12.68),
(None,"hasta dónde llega tu aroma mientras estás quieto.",1,13.28,15.80),
('p2',"Puede ser íntima,",1,16.42,17.56),
(None,"pegada a la piel.",1,18.02,18.82),
('p3',"Moderada,",1,19.40,20.02),
(None,"a un brazo de distancia.",1,20.31,21.59),
('p4',"O fuerte,",1,22.13,22.70),
(None,"que llena toda la habitación.",1,23.00,24.46),
('e',"La estela es otra cosa:",1,25.10,26.62),
(None,"es el rastro que dejás cuando te movés…",1,27.13,29.19),
('e2',"lo que queda en el aire cuando ya te fuiste.",1,29.70,31.72),
('e3',"La proyección es tu burbuja.",1,32.31,33.95),
(None,"La estela, tu firma.",1,34.45,35.86),
('f',"¿Qué las hace más fuertes?",2,0.05,1.31),
(None,"La concentración:",2,1.81,2.75),
(None,"un Parfum llega más lejos que una Eau de Toilette.",2,3.24,6.12),
('f2',"Las notas de fondo, como ámbar, oud y vainilla.",2,6.60,9.74),
('f3',"Y el calor,",2,10.28,10.90),
(None,"que expande el perfume.",2,11.19,12.39),
('x',"Ojo con el error más común:",2,12.87,14.39),
(None,"un perfume muy potente en un lugar cerrado, como el ascensor o la oficina.",2,14.85,18.92),
('x2',"No deja respirar.",2,19.40,20.39),
('x3',"O perfumes de invierno en pleno verano:",2,20.92,22.79),
('x4',"con el calor, empalagan a todos.",2,23.19,25.19),
('t',"Tip Belle:",2,25.69,26.22),
(None,"armá tu guardarropa de perfumes.",2,26.68,28.41),
('t2',"Uno fresco para el día, uno intenso para la noche,",2,28.78,31.63),
(None,"uno suave para la oficina, y uno especial para dejar huella.",2,31.98,35.38),
('t2b',"Y sumá uno por temporada:",2,35.83,37.10),
('t2c',"floral en primavera, cítrico en verano, especiado en otoño y ambarado en invierno.",2,37.56,42.38),
(None,"Vas a estar listo para cualquier momento…",2,42.83,44.92),
('t3',"y para los demás,",2,45.42,46.25),
(None,"vas a ser un misterio.",2,46.64,47.51),
(None,"¿Qué se habrá puesto hoy?",2,48.18,49.14),
('end',"¿Querés armar tu guardarropa de perfumes?",2,49.70,51.53),
(None,"Escribinos BELLE por mensaje directo.",2,51.91,54.30),
]
OFF={1:0.0,2:36.6}
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
cues['hook']=0;cues['t1']=cues['p'];cues['f']=max(cues['f'],cues['e3']+3.2);cues['dur']=round(OFF[2]+54.36+1.4,2)
open('timing.js','w').write('window.CUES='+json.dumps(cues)+';\nwindow.SUBS='+json.dumps(subs,ensure_ascii=False)+';\n')
print(cues)
