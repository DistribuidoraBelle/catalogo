F=[
('hook',"Odyssey:",1,0.1,0.5),
('h2',"la serie de Armaf que conquistó el mundo.",1,1.0,3.28),
('h3',"Te la explico perfume por perfume.",1,3.6,5.6),
('h4',"Parte tres: los frescos.",1,6.11,8.2),
('p1',"Aqua:",1,8.87,9.19),
('n1',"pomelo, menta y lavanda sobre maderas frescas.",1,9.75,12.75),
('q1',"Como tirarte al mar en pleno verano.",1,13.27,15.23),
('m1',"El que usás de día, en el laburo o en el gym…",1,15.79,18.33),
(None,"y nunca cansa.",1,18.89,19.91),
('i1',"Se inspira en Invictus Platinum, de Paco Rabanne.",1,20.47,22.95),
('p2',"Tyrant:",1,23.65,24.15),
('n2',"toronja, pimienta y ambroxan.",1,24.71,26.71),
('q2',"Fresco, filoso y magnético, como una brisa con carácter.",1,27.33,31.07),
('m2',"Si te gusta el perfume más famoso del mundo, este es para vos.",1,31.65,35.37),
('i2',"Se inspira en Sauvage, de Dior.",1,35.93,37.55),
('p3',"Limoni Fresh:",1,38.29,39.11),
('n3',"limón, mandarina y notas marinas.",1,39.73,42.09),
('q3',"Sol italiano y agua salada en un solo spray.",1,42.69,45.25),
('m3',"El perfume del verano: lo probás… y te lo llevás.",1,45.77,49.21),
('i3',"Composición propia de Armaf.",1,49.73,51.21),
('p4',"Bahamas:",2,0.1,0.68),
('n4',"melón, sal marina y algas.",2,1.16,3.26),
('q4',"Una tarde de playa en el Caribe, con olor a mar.",2,3.78,6.46),
('m4',"El que te lleva de vacaciones con un solo spray.",2,6.98,9.42),
('i4',"Se inspira en Le Sel d'Issey, de Issey Miyake.",2,9.86,12.7),
('p5',"Mega Man:",2,13.5,14.04),
('n5',"jengibre, ananá y salvia.",2,14.54,16.46),
('q5',"Fresco, limpio y elegante, como una camisa recién planchada.",2,17.02,20.86),
('m5',"El comodín perfecto: va con todo y en todo momento.",2,21.38,24.9),
('i5',"Se inspira en Y Eau de Parfum, de Yves Saint Laurent.",2,25.3,28.4),
('p6',"Wild One:",2,29.06,29.58),
('n6',"pimienta, bergamota y lavanda.",2,30.02,32.22),
('q6',"Libre y salvaje, como manejar con las ventanillas bajas.",2,32.76,35.88),
('m6',"Frescura con carácter, para todos los días.",2,36.26,38.86),
('i6',"Se inspira en Sauvage, de Dior.",2,39.22,41.22),
('p7',"Nexus:",2,41.96,42.5),
('n7',"bergamota, notas marinas y salvia, sobre incienso.",2,42.96,46.4),
('q7',"Profundo como el mar de noche.",2,46.84,48.48),
('m7',"El fresco más elegante de la serie.",2,48.9,50.84),
('i7',"Se inspira en Acqua di Giò Profumo, de Giorgio Armani.",2,51.24,54.46),
('out',"¿Cuál es tu Odyssey?",2,55.0,55.86),
(None,"Contanos en los comentarios.",2,56.26,57.56),
('out2',"En la parte cuatro: frutales, florales… y la nueva Spicy Collection.",2,58.26,63.04),
('fol',"Y si querés ver las otras partes o más series de perfumes,",2,63.30,66.06),
(None,"están todas en nuestro perfil.",2,66.26,67.78),
(None,"¡Seguinos, que se viene mucho más!",2,68.18,70.00),
('end',"Y si querés el tuyo, lo encontrás en distribuidorabelle.com",2,70.81,74.31),
]
OFF={1:0.0,2:51.74}
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
cues['hook']=0;cues['t1']=-5;cues['dur']=round(OFF[2]+74.55+3.0,2)
open('timing.js','w').write('window.CUES='+json.dumps(cues)+';\nwindow.SUBS='+json.dumps(subs,ensure_ascii=False)+';\n')
print(cues)
