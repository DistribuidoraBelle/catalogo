F=[
('hook',"Club de Nuit:",1,0.00,0.72),
('h2',"la serie que hizo famosa a Armaf en todo el mundo.",1,1.16,4.04),
('h3',"Te la explico perfume por perfume.",1,4.51,7.61),
('h4',"Parte dos: los frescos.",1,7.93,8.76),
('p1',"Sillage:",1,9.34,9.92),
('n1',"bergamota, grosella y jengibre, sobre almizcle.",1,10.37,13.72),
('q1',"Frío y brillante, como agua de deshielo en la montaña.",1,14.24,17.35),
('m1',"El más elegante para el día.",1,17.88,19.39),
('i1',"Se inspira en Silver Mountain Water, de Creed.",1,19.90,22.34),
('p2',"Milestone:",1,22.98,23.64),
('n2',"notas marinas, frutos rojos y violeta.",1,24.14,26.66),
('q2',"Sal en la piel y sandía fresca: verano en la costa.",1,27.12,30.46),
('m2',"El fresco que todos te van a pedir.",1,30.95,32.85),
('i2',"Se inspira en Millésime Impérial, de Creed.",1,33.26,35.58),
('p3',"Iconic:",1,36.15,36.78),
('n3',"pomelo, menta y jengibre, sobre incienso y sándalo.",1,37.23,40.68),
('q3',"Azul profundo, limpio y seguro.",1,41.15,43.50),
('m3',"Para el trabajo, la cita y todo lo demás.",1,44.01,46.73),
('i3',"Se inspira en Bleu de Chanel.",1,47.09,48.52),
('p4',"Iconic Extrait:",1,49.08,50.20),
('n4',"pomelo, jengibre e incienso, en extracto.",1,50.67,53.59),
('q4',"El mismo azul… pero más profundo.",1,54.03,56.42),
('m4',"Más madera, más incienso y más duración.",1,56.94,59.73),
('i4',"Se inspira en Bleu de Chanel.",1,60.14,61.84),
('p5',"Urban Man:",2,0.00,0.64),
('n5',"bergamota, menta y cardamomo, sobre vetiver y pachulí.",2,1.17,4.91),
('q5',"Elegancia de ciudad, entre traje y zapatillas.",2,5.48,8.37),
('m5',"Un clásico moderno que nunca falla.",2,8.75,10.98),
('i5',"Se inspira en Mr. Burberry.",2,11.44,12.80),
('p6',"Urban Elixir:",2,13.48,14.29),
('n6',"pomelo, especias y ambroxan.",2,14.74,16.85),
('q6',"Fresco, picante y adictivo.",2,17.34,19.24),
('m6',"Un híbrido con toques de Aventus y Baccarat Rouge.",2,19.72,22.39),
('i6',"Se inspira en Sauvage, de Dior.",2,22.76,24.47),
('p7',"Elite:",2,25.03,25.50),
('n7',"té verde, pimienta y rosa, sobre vetiver.",2,25.96,28.78),
('q7',"Verde, chispeante y sofisticado.",2,29.29,31.34),
('m7',"Lo más nuevo de la serie, para paladares exigentes.",2,31.76,34.65),
('i7',"Se inspira en Wild Vetiver, de Creed.",2,35.04,37.06),
('out',"¿Cuál es tu Club de Nuit?",2,37.62,38.62),
(None,"Contanos en los comentarios.",2,38.98,40.26),
('out2',"En la parte tres, ámbar y nocturnos.",2,40.73,43.23),
('fol',"Y si querés ver las otras partes o más series de perfumes, están todas en nuestro perfil:",2,43.61,48.01),
(None,"seguinos, que se viene mucho más.",2,48.40,50.39),
('end',"Y si querés el tuyo, lo encontrás en distribuidorabelle.com",2,50.73,54.40),
]
OFF={1:0.0,2:62.19}
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
cues['hook']=0;cues['t1']=-5;cues['dur']=round(OFF[2]+54.40+3.0,2)
if 'out2' not in cues: cues['out2']=cues['fol']
open('timing.js','w').write('window.CUES='+json.dumps(cues)+';\nwindow.SUBS='+json.dumps(subs,ensure_ascii=False)+';\n')
print(cues)
