F=[
('hook',"Esto es lo que tiene adentro tu perfume.",1,0.05,2.11),
('h2',"Y si aprendés a leerlo…",1,2.45,3.68),
('h3',"nunca más comprás un perfume a ciegas.",1,3.95,6.01),
('p',"Cada perfume se arma con ingredientes que se llaman notas.",1,6.57,9.89),
('ml',"Pensalas como los colores de un cuadro:",1,10.22,11.89),
(None,"solas son simples…",1,12.22,13.64),
('ml2',"juntas,",1,13.98,14.56),
('ml3',"son una obra.",1,14.76,15.58),
('ci',"Los cítricos —bergamota, limón, naranja—",1,16.11,19.26),
('ci2',"son el primer golpe de frescura.",1,19.57,21.23),
(None,"Duran poco,",1,21.54,22.20),
(None,"pero enamoran.",1,22.46,23.21),
('fl',"Las flores",1,23.61,24.34),
('fl1',"—rosa, jazmín, lavanda—",1,24.60,26.55),
('fl2',"le dan el alma romántica.",1,26.88,28.29),
('du',"Lo dulce",1,28.67,29.35),
('du1',"—vainilla, caramelo, café, haba tonka—",1,29.64,32.56),
('du2',"es lo adictivo.",1,32.89,33.71),
('du3',"Lo que hace que te pregunten:",1,34.03,35.25),
('du4',"¿qué tenés puesto?",1,35.44,36.24),
('es',"Las especias",1,36.62,37.52),
('es1',"—pimienta, canela, cardamomo—",1,37.77,39.76),
('es2',"le suman calor y carácter.",1,40.07,41.67),
('ma',"Y las maderas",1,41.98,42.83),
('ma1',"—cedro, sándalo, pachulí—",1,43.06,44.86),
('ma2',"son la base elegante que te acompaña todo el día.",1,45.18,47.74),
('tr',"Ahora,",2,0.05,0.45),
(None,"las tres palabras que más se leen…",2,0.69,2.46),
(None,"y menos se entienden.",2,2.89,3.99),
('oud',"Oud:",2,4.50,4.79),
(None,"una madera oscura y misteriosa,",2,5.25,6.99),
(None,"de las más caras del mundo.",2,7.18,8.63),
('amb',"Ámbar:",2,9.12,9.58),
(None,"ojo,",2,9.98,10.33),
(None,"no es la piedra.",2,10.54,11.45),
('amb2',"Es una mezcla cálida de resinas y vainilla,",2,11.84,14.20),
(None,"como un abrazo.",2,14.46,15.21),
('alm',"Almizcle:",2,15.69,16.32),
(None,"ese olor a piel limpia que hace que un perfume se sienta tuyo.",2,16.73,19.86),
('ac',"Y acá viene la magia:",2,20.34,21.45),
(None,"cuando mezclás notas, nace un olor que no existía.",2,21.85,24.54),
('ac2',"Eso es un acorde,",2,24.95,25.82),
(None,"como en la música:",2,26.03,26.78),
('ac3',"tres teclas,",2,27.09,27.82),
('ac4',"una canción.",2,28.02,28.71),
('ac5',"Labdano, vainilla y benjuí…",2,29.11,31.26),
('ac6',"y nace el acorde ámbar.",2,31.67,33.10),
('cj',"Así que la próxima vez, dá vuelta la caja:",2,33.52,35.74),
('cj2',"si ves cítricos, va a ser fresco;",2,36.14,37.92),
('cj3',"si ves vainilla y maderas,",2,38.30,39.63),
(None,"cálido y duradero.",2,39.86,40.99),
('cm',"Contame en los comentarios:",2,41.42,42.64),
(None,"¿cuál es tu nota favorita?",2,42.95,44.12),
('end',"Y si querés uno con las notas que te gustan, escribinos BELLE por mensaje directo.",2,44.51,48.67),
]
OFF={1:0.0,2:48.28}
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
        if len(line)>=6 or (len(line)>=3 and re.search(r'[,:…—]$',w)) or j==len(wt)-1:
            nxt=wt[j+1][1] if j+1<len(wt) else z
            subs.append({'t0':line[0]['t'],'t1':round(nxt+0.15 if j==len(wt)-1 else nxt-0.02,3),'w':line}); line=[]
cues['hook']=0;cues['t1']=-5;cues['dur']=round(OFF[2]+48.86+1.6,2)
open('timing.js','w').write('window.CUES='+json.dumps(cues)+';\nwindow.SUBS='+json.dumps(subs,ensure_ascii=False)+';\n')
print(cues)
