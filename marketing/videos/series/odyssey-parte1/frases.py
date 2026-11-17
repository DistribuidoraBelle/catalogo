F=[
('hook',"Odyssey:",1,0.05,0.47),
('h2',"la serie de Armaf que conquistó el mundo.",1,0.94,3.28),
('h3',"Te la explico perfume por perfume.",1,3.80,5.76),
('h4',"Parte uno: los dulces.",1,6.34,8.09),
('p1',"Mandarin Sky:",1,8.70,9.56),
('q1',"un atardecer naranja que se derrite en caramelo.",1,10.12,12.83),
('n1',"Mandarina y haba tonka,",1,13.47,14.88),
(None,"con un final que no querés que termine.",1,15.18,17.14),
('i1',"Se inspira en Scandal Pour Homme, de Jean Paul Gaultier.",1,17.79,20.30),
('p2',"Mandarin Sky Elixir:",1,20.95,22.31),
('q2',"el mismo cielo…",1,22.93,23.92),
(None,"pero de noche.",1,24.36,24.99),
('n2',"Vainilla, incienso y pimienta negra que te envuelven como un abrazo oscuro.",1,25.70,30.24),
('i2',"Se inspira en Scandal Le Parfum.",1,30.89,32.70),
('p3',"Mandarin Sky Vintage:",1,33.27,34.70),
('n3',"el clásico con alma de colección,",1,35.19,37.08),
('q3',"como una foto vieja que todavía huele a verano.",1,37.57,40.10),
('p4',"Black Forest:",2,0.05,0.95),
('n4',"cerezas, miel y praliné…",2,1.40,3.39),
('q4',"un postre prohibido que se lleva en la piel.",2,4.02,6.27),
('i4',"Composición propia de Armaf.",2,6.74,8.23),
('p5',"Dubai Chocolat:",2,8.91,9.67),
('n5',"pistacho, chocolate y knafeh.",2,10.24,12.28),
('q5',"El capricho más viral del mundo, convertido en perfume.",2,12.75,15.83),
('p6',"Candee:",2,16.41,16.77),
('n6',"frutillas, frambuesas y caramelo.",2,17.33,19.51),
('q6',"Una tarde de feria,",2,20.01,21.15),
(None,"dulce y coqueta.",2,21.35,22.35),
('i6',"Se inspira en Burberry Her Elixir.",2,22.75,24.55),
('p7',"Marshmallow:",2,25.11,25.72),
('q7',"suave como una nube de azúcar.",2,26.18,27.99),
('n7',"Cremoso,",2,28.42,29.09),
(None,"tierno,",2,29.32,29.81),
(None,"imposible de no abrazar.",2,30.03,31.51),
('i7',"Se inspira en Yum Boujee Marshmallow, de Kayali.",2,31.94,34.54),
('out',"¿Cuál es tu Odyssey?",2,35.10,35.96),
(None,"Contanos en los comentarios.",2,36.33,37.63),
('out2',"En la parte dos, los más intensos.",2,38.04,40.43),
('end',"Y si querés el tuyo, lo encontrás en distribuidorabelle.com",2,40.92,44.55),
]
OFF={1:0.0,2:40.75}
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
cues['hook']=0;cues['t1']=-5;cues['dur']=round(OFF[2]+44.60+3.0,2)
open('timing.js','w').write('window.CUES='+json.dumps(cues)+';\nwindow.SUBS='+json.dumps(subs,ensure_ascii=False)+';\n')
print(cues)
