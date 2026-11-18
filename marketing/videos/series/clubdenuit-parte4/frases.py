F=[
('hook',"Club de Nuit:",1,0.00,0.75),
('h2',"la serie que hizo famosa a Armaf en todo el mundo.",1,1.15,4.03),
('h3',"Te la explico perfume por perfume.",1,4.54,6.37),
('h4',"Parte cuatro: los femeninos.",1,6.85,8.92),
('p1',"Club de Nuit Woman:",1,9.62,10.71),
('n1',"naranja, durazno y rosa, sobre pachulí.",1,11.26,14.15),
('q1',"Elegante y luminosa: el clásico femenino de Armaf.",1,14.66,18.07),
('m1',"Viene en tres versiones: Eau de Parfum, Extrait y Extreme Edition, cada una más intensa que la anterior.",1,18.55,25.17),
('i1',"Se inspiran en Coco Mademoiselle, de Chanel.",1,25.62,27.82),
('p2',"Intense Woman:",1,28.55,29.50),
('n2',"rosa, azafrán y oud, sobre pachulí y vainilla.",1,30.03,33.56),
('q2',"Una rosa negra, profunda y misteriosa.",1,33.96,36.64),
('m2',"Para la mujer que deja huella.",1,37.06,38.50),
('i2',"Se inspira en Noir de Noir, de Tom Ford.",1,38.88,41.28),
('p3',"White Imperiale:",1,41.89,42.87),
('n3',"lichi, rosa turca y vainilla, con incienso.",1,43.33,46.42),
('q3',"Romántica y delicada, como un ramo de rosas blancas.",1,46.82,50.23),
('m3',"Lujo de nicho, al alcance de la mano.",1,50.58,52.80),
('i3',"Se inspira en Delina Exclusif, de Parfums de Marly.",1,53.19,55.94),
('p4',"Maleka:",1,56.60,57.09),
('n4',"lichi, iris y praliné, sobre sándalo.",1,57.55,60.28),
('q4',"Femenina, dulce y sofisticada, como una reina.",1,60.70,64.12),
('m4',"Una joya que enamora a primera olida.",1,64.52,66.54),
('i4',"Composición propia de Armaf.",1,66.93,68.64),
('p5',"Lionheart Woman:",2,0.00,1.09),
('n5',"vainilla, lavanda, cacao y jengibre.",2,1.61,4.63),
('q5',"Una caricia cálida y golosa.",2,5.26,7.00),
('m5',"El perfume que se vuelve tu firma.",2,7.50,9.19),
('i5',"Se inspira en Goddess, de Burberry.",2,9.68,11.65),
('p6',"Précieux Four:",2,12.19,12.98),
('n6',"sal marina, frutos rojos y crema batida, sobre vainilla.",2,13.40,17.25),
('q6',"Un postre a la orilla del mar.",2,17.72,19.21),
('m6',"Dulce, salado y adictivo.",2,19.72,21.66),
('i6',"Se inspira en Gaultier Divine, de Jean Paul Gaultier.",2,22.10,24.72),
('p7',"Bling Gold:",2,25.32,25.98),
('n7',"heliotropo, coco y vainilla, sobre palo santo.",2,26.37,29.60),
('q7',"Brillo dorado y cremoso, como una joya.",2,29.98,32.62),
('m7',"Una creación original,",2,33.05,34.19),
('i7',"que va para el lado de Goddess, Bianco Latte y Devotion.",2,34.53,37.65),
('out',"¿Cuál es tu Club de Nuit?",2,38.20,39.16),
(None,"Contanos en los comentarios.",2,39.49,40.76),
('fol',"Y si querés ver las otras partes o más series de perfumes, están todas en nuestro perfil:",2,41.06,45.41),
(None,"seguinos, que se viene mucho más.",2,45.82,47.72),
('end',"Y si querés el tuyo, lo encontrás en distribuidorabelle.com",2,48.01,51.34),
]
OFF={1:0.0,2:68.99}
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
cues['hook']=0;cues['t1']=-5;cues['dur']=round(OFF[2]+51.60+3.0,2)
if 'out2' not in cues: cues['out2']=cues['fol']
open('timing.js','w').write('window.CUES='+json.dumps(cues)+';\nwindow.SUBS='+json.dumps(subs,ensure_ascii=False)+';\n')
print(cues)
