F=[
('hook',"Odyssey:",1,0.1,0.5),
('h2',"la serie de Armaf que conquistó el mundo.",1,1.06,3.32),
('h3',"Te la explico perfume por perfume.",1,3.9,5.78),
('h4',"Parte cuatro: frutales, florales… y la Spicy Collection.",1,6.26,10.74),
('p1',"Li'chi Lush:",1,11.48,12.18),
('n1',"lichi, durazno y frambuesa, entre flores blancas y caramelo.",1,12.74,16.64),
('q1',"Un jardín de frutas exóticas al atardecer.",1,17.26,19.58),
('m1',"Delicado, femenino y súper original.",1,20.18,22.86),
('i1',"Se inspira en Harrods Ruby Naga, de Stéphane Humbert Lucas.",1,23.48,26.6),
('p2',"Pink Pop:",1,27.22,27.82),
('n2',"frutilla, durazno y ananá, sobre vainilla.",1,28.38,31.3),
('q2',"Rosa, alegre y burbujeante, como un chicle de frutas.",1,32.0,35.28),
('m2',"El perfume que te pone de buen humor.",1,35.8,37.52),
('i2',"Se inspira en Kurky, de Maison Francis Kurkdjian.",1,38.12,40.78),
('p3',"French Kiss:",1,41.42,42.14),
('n3',"coco, frutilla y rosa, con praliné y vainilla.",1,42.66,46.04),
('q3',"Un beso dulce en una tarde de París.",1,46.72,48.72),
('m3',"Romántico y adictivo: el que te van a querer oler de cerca.",1,49.26,52.62),
('i3',"Se inspira en Vanilla Powder, de Matière Première, con un toque de Delina.",1,53.32,58.3),
('p4',"Go Mango:",1,58.94,59.58),
('n4',"mango maduro, jengibre y ámbar.",1,60.12,62.46),
('q4',"Una fruta tropical bajo un sol que quema.",1,63.0,65.32),
('m4',"Diferente a todo lo que tenés: el que todos te van a preguntar.",1,65.8,69.36),
('i4',"Se inspira en God of Fire, de Stéphane Humbert Lucas.",1,69.94,72.78),
('p5',"Femme White:",1,73.74,74.4),
('n5',"nardos, jazmín y vainilla.",1,75.0,76.94),
('q5',"Limpia y luminosa, como sábanas blancas al sol.",1,77.58,80.48),
('m5',"Elegante y suave: ideal para todos los días.",1,81.06,84.06),
('i5',"Es composición propia de Armaf,",1,84.62,86.18),
(None,"y va para el lado de Gucci Bloom, Valentino Donna y Coco Mademoiselle.",1,86.44,90.16),
('p6',"Femme Black:",1,91.16,91.8),
('n6',"ciruela, miel y cacao entre flores blancas.",1,92.42,95.36),
('q6',"Misteriosa y seductora, como una noche de gala.",1,95.78,98.54),
('m6',"Para ella, cuando quiere dejar huella.",1,99.06,101.06),
('i6',"Composición propia, que va para el lado de",1,101.64,103.6),
(None,"Good Girl, de Carolina Herrera, y My Burberry Black.",1,103.72,106.42),
('sx',"Y ahora, la novedad más picante:",1,106.9,109.14),
(None,"la Spicy Collection.",1,109.58,110.94),
('p7',"Bloody Hot:",1,111.49,112.21),
('n7',"tomate, especias y pimienta negra… con frutilla dulce.",1,112.61,116.36),
('q7',"Inspirado en el trago Bloody Mary: atrevido como pocos.",1,116.87,120.47),
('m7',"El perfume más audaz de la serie.",1,120.85,122.71),
('i7',"Composición propia de Armaf.",1,123.16,124.65),
('p8',"Jalapeach-O:",1,125.28,126.11),
('n8',"durazno jugoso con jalapeño y pimienta timur, sobre praliné.",1,126.68,130.37),
('q8',"Dulce y picante a la vez: una locura que funciona.",1,130.77,134.12),
('m8',"Para los que se animan a lo distinto.",1,134.52,136.05),
('i8',"Composición propia de Armaf.",1,136.52,137.94),
('p9',"Ring My Bell:",1,138.54,139.33),
('n9',"morrón, pomelo y pimienta, sobre cedro y vetiver.",1,139.91,143.43),
('q9',"Verde, especiado y amaderado.",1,143.81,145.94),
('m9',"Una rareza de colección.",1,146.3,147.67),
('i9',"Composición propia, que va para el lado de Santal 33, de Le Labo.",1,148.04,151.8),
('out',"¿Cuál es tu Odyssey?",1,152.6,153.7),
(None,"Contanos en los comentarios.",1,154.12,155.4),
('out2',"Y si querés ver las otras partes o más series de perfumes,",1,155.8,158.56),
(None,"están todas en nuestro perfil.",1,158.76,160.28),
(None,"¡Seguinos, que se viene mucho más!",1,160.68,162.5),
('end',"Y si querés el tuyo, lo encontrás en distribuidorabelle.com",1,162.9,166.22),
]
OFF={1:0.0}
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
cues['hook']=0;cues['t1']=-5;cues['dur']=round(166.38+3.0,2)
open('timing.js','w').write('window.CUES='+json.dumps(cues)+';\nwindow.SUBS='+json.dumps(subs,ensure_ascii=False)+';\n')
print(cues)
