F=[
('hook',"Odyssey:",1,0.08,0.5),
('h2',"la serie de Armaf que conquistó el mundo.",1,1.0,3.28),
('h3',"Te la explico perfume por perfume.",1,3.78,5.7),
('h4',"Parte dos: los intensos.",1,6.18,8.24),
('p1',"Odyssey Homme:",1,8.98,9.82),
('n1',"cardamomo, neroli y vainilla sobre maderas cálidas.",1,10.38,13.82),
('q1',"Como un traje a medida que huele a lujo.",1,14.36,16.38),
('m1',"Lo usás una vez… y se vuelve tu firma.",1,17.0,19.5),
('i1',"Se inspira en Tom Ford Noir Extreme.",1,20.14,22.24),
('p2',"Homme White:",1,22.98,23.72),
('n2',"mandarina, vainilla y especias suaves.",1,24.34,26.88),
('q2',"Dulce, limpio y seductor,",1,27.54,29.38),
(None,"como una camisa blanca recién planchada.",1,29.86,31.96),
('m2',"Es el que más elogios junta en una cita.",1,32.62,34.62),
('i2',"Se inspira en Stronger With You, de Emporio Armani.",1,35.22,37.82),
('p3',"Spectra:",1,38.6,39.08),
('n3',"canela, manzana y lavanda, envueltas en vainilla y tabaco.",1,39.64,43.3),
('q3',"Dulce, potente, imposible de ignorar.",1,43.94,46.82),
('m3',"Entrás a un lugar… y se enteran todos.",1,47.42,49.7),
('i3',"Se inspira en Ultra Male, de Jean Paul Gaultier.",1,50.28,52.74),
('p4',"Artisto:",1,53.38,53.9),
('n4',"coco, haba tonka y frutas tropicales.",1,54.48,57.02),
('q4',"Un verano en la piel… pero en versión noche.",1,57.6,60.0),
('m4',"El que te hace oler a vacaciones todo el año.",1,60.58,62.84),
('i4',"Se inspira en Le Beau Le Parfum, de Jean Paul Gaultier.",1,63.42,66.16),
('p5',"Revolution:",2,0.14,0.82),
('n5',"ananá y grosella que estallan sobre praliné y vainilla.",2,1.32,4.32),
('q5',"Frutal, dulce y con actitud.",2,4.94,7.10),
('m5',"Para los que no quieren oler igual que todos.",2,7.68,9.68),
('i5',"Composición propia de Armaf.",2,10.18,11.66),
('p6',"Aoud:",2,12.30,12.64),
('n6',"azafrán, lavanda y oud.",2,13.22,15.16),
('q6',"Madera oscura y especias, como entrar a un palacio árabe.",2,15.72,18.98),
('m6',"Lujo de nicho, a un precio que no lo parece.",2,19.50,22.53),
('i6',"Se inspira en Oud for Greatness, de Initio.",2,23.15,25.90),
('p7',"Eau de Montagne:",2,26.48,27.28),
('n7',"almendra, leche y vainilla, con cacao y sándalo.",2,27.80,31.34),
('q7',"Suave y cremoso, como una nevada dulce.",2,31.94,34.36),
('m7',"La joyita escondida de la serie:",2,34.96,36.54),
(None,"pocos la conocen… y todos preguntan.",2,37.08,39.52),
('i7',"Se inspira en Blanche Bête, de Liquides Imaginaires.",2,40.08,42.44),
('out',"¿Cuál es tu Odyssey?",2,42.94,43.80),
(None,"Contanos en los comentarios.",2,44.24,45.52),
('out2',"En la parte tres, los frescos y frutales.",2,45.94,48.44),
('end',"Y si querés el tuyo, lo encontrás en distribuidorabelle.com",2,48.80,52.06),
]
OFF={1:0.0,2:66.75}
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
cues['hook']=0;cues['t1']=-5;cues['dur']=round(OFF[2]+52.3+3.0,2)
open('timing.js','w').write('window.CUES='+json.dumps(cues)+';\nwindow.SUBS='+json.dumps(subs,ensure_ascii=False)+';\n')
print(cues)
