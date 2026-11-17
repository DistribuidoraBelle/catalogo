F=[
('hook',"Odyssey:",1,0.0,0.52),
('h2',"la serie de Armaf que conquistó el mundo.",1,0.99,3.25),
('h3',"Te la explico perfume por perfume.",1,3.82,5.75),
('h4',"Parte uno: los dulces.",1,6.34,8.17),
('p1',"Mandarin Sky:",1,8.85,9.80),
('q1',"un atardecer naranja que se derrite en caramelo.",1,10.40,13.07),
('n1',"Mandarina y haba tonka,",1,13.78,15.22),
(None,"con un final que no querés que termine.",1,15.51,17.49),
('m1',"Dicen que es un rompecuellos…",1,18.18,19.71),
(None,"y no por nada es el más vendido de la serie.",1,20.14,22.52),
('i1',"Se inspira en Scandal Pour Homme, de Jean Paul Gaultier.",1,23.11,25.84),
('p2',"Mandarin Sky Elixir:",1,26.61,28.14),
('q2',"el mismo cielo…",1,28.73,29.66),
(None,"pero de noche.",1,30.04,30.68),
('n2',"Vainilla, incienso y pimienta negra que te envuelven como un abrazo oscuro.",1,31.38,35.99),
('m2',"Más intenso, más duradero:",1,36.69,38.56),
(None,"el favorito de los que quieren dejar huella.",1,39.13,41.06),
('i2',"Se inspira en Scandal Le Parfum.",1,41.67,43.50),
('p3',"Mandarin Sky Vintage:",1,44.21,45.77),
('n3',"el clásico con alma de colección,",1,46.23,48.12),
('q3',"como una foto vieja que todavía huele a verano.",1,48.69,51.11),
('m3',"Una edición especial que los coleccionistas no dejan pasar.",1,51.72,54.85),
('p4',"Black Forest:",2,0.12,0.90),
('n4',"cerezas, miel y praliné…",2,1.42,3.34),
('q4',"un postre prohibido que se lleva en la piel.",2,4.00,6.30),
('m4',"Es de esos que hacen que todos te pregunten qué tenés puesto.",2,6.96,9.94),
('i4',"Composición propia de Armaf.",2,10.46,11.86),
('p5',"Dubai Chocolat:",2,12.60,13.50),
('n5',"pistacho, chocolate y knafeh.",2,13.98,16.10),
('q5',"El capricho más viral del mundo, convertido en perfume.",2,16.62,19.54),
('m5',"Si te gustan los gourmand, este es furor.",2,20.04,22.50),
('p6',"Candee:",2,23.14,23.52),
('n6',"frutillas, frambuesas y caramelo.",2,24.00,26.14),
('q6',"Una tarde de feria,",2,26.72,27.74),
(None,"dulce y coqueta.",2,28.10,29.24),
('m6',"El perfume que les gusta a todas.",2,29.76,31.28),
('i6',"Se inspira en Burberry Her Elixir.",2,31.66,33.70),
('p7',"Marshmallow:",2,34.34,34.92),
('q7',"suave como una nube de azúcar.",2,35.48,37.22),
('n7',"Cremoso, tierno,",2,37.70,39.04),
(None,"imposible de no abrazar.",2,39.36,40.76),
('m7',"Ideal para regalar: no falla nunca.",2,41.30,43.50),
('i7',"Se inspira en Yum Boujee Marshmallow, de Kayali.",2,44.02,46.76),
('p8',"Toffee Coffee:",2,47.08,47.76),
('n8',"café, dulce de leche y toffee.",2,48.30,50.52),
('q8',"Como un café con leche de cafetería cara…",2,51.12,53.22),
(None,"pero en la piel.",2,53.76,54.82),
('m8',"El mimo dulce que se vuelve adicción.",2,55.54,57.54),
('i8',"Se inspira en Amore Caffè, de Mancera.",2,58.08,60.50),
('p9',"Soda Pop:",2,61.52,62.10),
('n9',"cola helada, jengibre y menta, sobre vainilla.",2,62.64,65.76),
('q9',"Como abrir una gaseosa bien fría en pleno verano.",2,66.42,69.24),
('m9',"El más divertido y original de toda la serie.",2,69.82,72.20),
('i9',"Se inspira en Tonka Cola, de Mancera.",2,72.72,75.00),
('out',"¿Cuál es tu Odyssey?",2,75.76,76.62),
(None,"Contanos en los comentarios.",2,77.04,78.32),
('out2',"En la parte dos, los más intensos.",2,78.80,81.04),
('fol',"Y si querés ver las otras partes o más series de perfumes,",2,81.30,84.06),
(None,"están todas en nuestro perfil.",2,84.26,85.78),
(None,"¡Seguinos, que se viene mucho más!",2,86.18,88.00),
('end',"Y si querés el tuyo, lo encontrás en distribuidorabelle.com",2,88.79,92.05),
]
OFF={1:0.0,2:55.47}
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
cues['hook']=0;cues['t1']=-5;cues['dur']=round(OFF[2]+92.31+3.0,2)
open('timing.js','w').write('window.CUES='+json.dumps(cues)+';\nwindow.SUBS='+json.dumps(subs,ensure_ascii=False)+';\n')
print(cues)
