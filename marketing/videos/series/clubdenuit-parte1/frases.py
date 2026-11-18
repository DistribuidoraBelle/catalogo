F=[
('hook',"Club de Nuit:",1,0.00,0.73),
('h2',"la serie que hizo famosa a Armaf en todo el mundo.",1,1.14,4.03),
('h3',"Te la explico perfume por perfume.",1,4.67,6.52),
('h4',"Parte uno: los originales y la familia Intense.",1,7.23,10.49),
('p1',"Club de Nuit Man:",1,11.13,12.14),
('n1',"mandarina, canela y cuero, sobre ámbar.",1,12.67,15.37),
('q1',"Un clásico seductor, dorado como un lingote.",1,15.92,18.97),
('m1',"El que arrancó toda la leyenda.",1,19.47,21.14),
('i1',"Se inspira en 1 Million, de Paco Rabanne.",1,21.62,23.69),
('p2',"Club de Nuit Man Improved Version:",1,24.34,26.30),
('n2',"el mismo ADN, pero renovado.",1,26.76,28.76),
('q2',"Más brillo, más presencia y más duración.",1,29.23,31.97),
('m2',"Para los que aman el clásico y quieren más.",1,32.43,34.75),
('i2',"Se inspira en 1 Million, de Paco Rabanne.",1,35.15,37.17),
('p3',"Club de Nuit Intense Man:",1,37.76,39.40),
('n3',"limón, ananá y abedul ahumado.",1,39.91,42.20),
('q3',"Un traje negro con olor a éxito.",1,42.66,44.59),
('m3',"El clon más famoso del planeta.",1,45.07,46.93),
('i3',"Se inspira en Aventus, de Creed.",1,47.38,49.07),
('p4',"Intense Man Limited Edition Parfum:",1,49.70,52.01),
('n4',"el Intense, en versión parfum.",1,52.52,54.30),
('q4',"Más denso, más elegante, más profundo.",1,54.78,57.63),
('m4',"Una edición limitada para los que buscan lo mejor.",1,58.07,60.43),
('i4',"Se inspira en Aventus, de Creed.",1,60.90,62.59),
('p5',"Intense Man Extrait:",2,0.00,1.38),
('n5',"el ahumado se vuelve terciopelo.",2,1.97,3.87),
('q5',"Más suave, más redondo, más lujoso.",2,4.46,6.22),
('m5',"El favorito de los que encontraban el Intense muy fuerte.",2,6.51,10.63),
('i5',"Se inspira en Aventus, de Creed.",2,11.16,12.98),
('p6',"Intense Man Extreme Edition:",2,13.68,15.46),
('n6',"grosella, abedul y pachulí, al máximo.",2,15.95,18.91),
('q6',"Humo, cuero y fruta, sin frenos.",2,19.37,21.90),
('m6',"Para los que quieren que se sienta a una cuadra.",2,22.26,24.23),
('i6',"Se inspira en Aventus, de Creed.",2,24.74,26.53),
('p7',"Intense Overdose:",2,27.21,28.52),
('n7',"ananá, ciruela y vainilla, sobre pachulí.",2,28.93,31.67),
('q7',"Una sobredosis dulce de la fórmula más famosa.",2,32.09,34.89),
('m7',"Lo nuevo de la familia, que ya es furor.",2,35.27,37.47),
('i7',"Se inspira en Absolu Aventus, de Creed.",2,37.94,40.20),
('p8',"Précieux One:",2,40.76,41.60),
('n8',"ananá, caramelo y cuero, en extracto.",2,42.04,44.71),
('q8',"Una joya oscura en frasco de lujo.",2,45.11,47.15),
('m8',"La versión más refinada del ADN Aventus.",2,47.52,50.38),
('i8',"Se inspira en Absolu Aventus, de Creed.",2,50.75,53.00),
('out',"¿Cuál es tu Club de Nuit?",2,53.67,54.65),
(None,"Contanos en los comentarios.",2,55.06,56.35),
('out2',"En la parte dos, los frescos.",2,56.74,58.66),
('fol',"Y si querés ver las otras partes o más series de perfumes, están todas en nuestro perfil:",2,58.99,63.46),
(None,"seguinos, que se viene mucho más.",2,63.86,65.94),
('end',"Y si querés el tuyo, lo encontrás en distribuidorabelle.com",2,66.31,69.92),
]
OFF={1:0.0,2:63.23}
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
cues['hook']=0;cues['t1']=-5;cues['dur']=round(OFF[2]+69.92+3.0,2)
if 'out2' not in cues: cues['out2']=cues['fol']
open('timing.js','w').write('window.CUES='+json.dumps(cues)+';\nwindow.SUBS='+json.dumps(subs,ensure_ascii=False)+';\n')
print(cues)
