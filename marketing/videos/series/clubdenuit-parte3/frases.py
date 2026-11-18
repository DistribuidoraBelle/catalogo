F=[
('hook',"Club de Nuit:",1,0.00,0.76),
('h2',"la serie que hizo famosa a Armaf en todo el mundo.",1,1.18,4.06),
('h3',"Te la explico perfume por perfume.",1,4.56,7.57),
('h4',"Parte tres: ámbar y nocturnos.",1,8.03,9.39),
('p1',"Untold:",1,10.00,10.53),
('n1',"azafrán, jazmín y ámbar gris.",1,11.01,13.30),
('q1',"Cristal, fuego y caramelo en el aire.",1,13.78,16.32),
('m1',"El que te hace oler a perfume de trescientos dólares.",1,16.76,19.32),
('i1',"Se inspira en Baccarat Rouge 540.",1,19.74,22.12),
('p2',"Lionheart Man:",1,22.75,23.70),
('n2',"lavanda, vainilla, miel y tabaco.",1,24.20,26.82),
('q2',"Dulce, cálido y seductor, como un león de noche.",1,27.39,30.63),
('m2',"El que te hace rugir en cada salida.",1,31.11,33.02),
('i2',"Se inspira en Le Male Elixir, de Jean Paul Gaultier.",1,33.48,35.93),
('p3',"Oud:",1,36.51,36.77),
('n3',"durazno, maracuyá y oud camboyano, sobre vainilla.",1,37.36,40.61),
('q3',"Fruta tropical y madera sagrada.",1,41.20,43.16),
('m3',"Lujo árabe para destacar en serio.",1,43.56,45.63),
('i3',"Se inspira en Erba Pura, de Xerjoff.",1,46.12,48.24),
('p4',"Bling:",1,48.88,49.27),
('n4',"cítricos, flores y vainilla, sobre maderas aterciopeladas.",1,49.71,53.52),
('q4',"Brillante como una noche en Dubái.",1,53.92,55.64),
('m4',"Para los que nacieron para brillar.",1,56.04,57.51),
('i4',"Se inspira en Valaya, de Parfums de Marly.",1,58.04,60.64),
('p5',"Intenso Fuego:",2,0.00,1.08),
('n5',"maracuyá, mango y pimienta negra, con cuero y oud.",2,1.59,5.25),
('q5',"Fruta tropical sobre brasas.",2,5.76,7.52),
('m5',"El lanzamiento más caliente de la serie.",2,7.80,10.23),
('i5',"Muchos lo comparan con Oud Maracujá, de Maison Crivelli.",2,10.80,14.04),
('p6',"Précieux Two:",2,14.42,15.06),
('n6',"cítricos, especias y regaliz ahumado, sobre ámbar y oud.",2,15.61,19.68),
('q6',"Oscuro, magnético y misterioso.",2,20.19,22.74),
('m6',"Un extracto para los que buscan algo distinto.",2,23.21,25.45),
('i6',"Toma el ADN de Sauvage Elixir, de Dior.",2,25.87,28.40),
('p7',"Timeless:",2,29.05,29.66),
('n7',"avellana, pimienta negra y tabaco con miel, sobre cuero.",2,30.11,33.82),
('q7',"Elegancia que no pasa de moda.",2,34.30,36.12),
('m7',"Un perfume que se vuelve tu firma.",2,36.48,38.15),
('i7',"Una creación cien por ciento original de Armaf.",2,38.58,41.20),
('out',"¿Cuál es tu Club de Nuit?",2,41.81,42.81),
(None,"Contanos en los comentarios.",2,43.14,44.48),
('out2',"En la parte cuatro, los femeninos.",2,44.87,46.91),
('fol',"Y si querés ver las otras partes o más series de perfumes, están todas en nuestro perfil:",2,47.23,51.66),
(None,"seguinos, que se viene mucho más.",2,52.02,54.00),
('end',"Y si querés el tuyo, lo encontrás en distribuidorabelle.com",2,54.33,57.66),
]
OFF={1:0.0,2:60.99}
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
cues['hook']=0;cues['t1']=-5;cues['dur']=round(OFF[2]+57.93+3.0,2)
if 'out2' not in cues: cues['out2']=cues['fol']
open('timing.js','w').write('window.CUES='+json.dumps(cues)+';\nwindow.SUBS='+json.dumps(subs,ensure_ascii=False)+';\n')
print(cues)
