F=[
('hook',"Odyssey:",1,0.1,0.5),
('h2',"la serie de Armaf que conquistó el mundo.",1,1.0,3.28),
('h3',"Te la explico perfume por perfume.",1,3.8,5.78),
('h4',"Parte tres: frescos y frutales.",1,6.34,8.98),
('p1',"Aqua:",1,9.72,10.04),
('n1',"pomelo, menta y lavanda sobre maderas frescas.",1,10.6,13.6),
('q1',"Como tirarte al mar en pleno verano.",1,14.12,16.08),
('m1',"El que usás de día, en el laburo o en el gym…",1,16.64,19.18),
(None,"y nunca cansa.",1,19.74,20.76),
('i1',"Se inspira en Invictus Platinum, de Paco Rabanne.",1,21.32,23.8),
('p2',"Tyrant:",1,24.5,25.0),
('n2',"toronja, pimienta y ambroxan.",1,25.56,27.56),
('q2',"Fresco, filoso y magnético, como una brisa con carácter.",1,28.18,31.92),
('m2',"Si te gusta el perfume más famoso del mundo, este es para vos.",1,32.5,36.22),
('i2',"Se inspira en Sauvage, de Dior.",1,36.78,38.4),
('p3',"Limoni Fresh:",1,39.14,39.96),
('n3',"limón, mandarina y notas marinas.",1,40.58,42.94),
('q3',"Sol italiano y agua salada en un solo spray.",1,43.54,46.1),
('m3',"El perfume del verano: lo probás… y te lo llevás.",1,46.62,50.06),
('i3',"Composición propia de Armaf.",1,50.58,52.06),
('p4',"Go Mango:",2,0.14,0.78),
('n4',"mango maduro, jengibre y ámbar.",2,1.32,3.66),
('q4',"Una fruta tropical bajo un sol que quema.",2,4.2,6.52),
('m4',"Diferente a todo lo que tenés: el que todos te van a preguntar.",2,7.0,10.56),
('i4',"Se inspira en God of Fire, de Stéphane Humbert Lucas.",2,11.14,13.98),
('p5',"Femme White:",2,14.94,15.6),
('n5',"nardos, jazmín y vainilla.",2,16.2,18.14),
('q5',"Limpia y luminosa, como sábanas blancas al sol.",2,18.78,21.68),
('m5',"Elegante y suave: ideal para todos los días.",2,22.26,25.26),
('i5',"Es composición propia de Armaf,",2,25.82,27.38),
(None,"y va para el lado de Gucci Bloom, Valentino Donna y Coco Mademoiselle.",2,27.64,31.36),
('p6',"Femme Black:",2,32.36,33.0),
('n6',"ciruela, miel y cacao entre flores blancas.",2,33.62,36.56),
('q6',"Misteriosa y seductora, como una noche de gala.",2,36.98,39.74),
('m6',"Para ella, cuando quiere dejar huella.",2,40.26,42.26),
('i6',"Composición propia, que va para el lado de",2,42.84,44.8),
(None,"Good Girl, de Carolina Herrera, y My Burberry Black.",2,44.92,47.62),
('out',"¿Cuál es tu Odyssey?",2,48.3,49.4),
(None,"Contanos en los comentarios.",2,49.82,51.1),
('out2',"Y si querés ver las otras partes o más series de perfumes,",2,51.5,54.26),
(None,"están todas en nuestro perfil.",2,54.46,55.98),
(None,"¡Seguinos, que se viene mucho más!",2,56.38,58.2),
('end',"Y si querés el tuyo, lo encontrás en distribuidorabelle.com",2,58.6,61.92),
]
OFF={1:0.0,2:52.59}
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
cues['hook']=0;cues['t1']=-5;cues['dur']=round(OFF[2]+62.08+3.0,2)
open('timing.js','w').write('window.CUES='+json.dumps(cues)+';\nwindow.SUBS='+json.dumps(subs,ensure_ascii=False)+';\n')
print(cues)
