F=[
('hook',"Odyssey:",1,0.05,0.48),
('h2',"la serie de Armaf que conquistó el mundo.",1,0.99,3.28),
('h3',"Te la explico perfume por perfume.",1,3.80,5.74),
('h4',"Parte uno: los dulces.",1,6.42,8.25),
('p1',"Mandarin Sky, el más famoso.",1,8.87,10.20),
(None,"Mandarina, caramelo y haba tonka:",1,11.66,13.92),
(None,"dulce, cítrico y adictivo.",1,14.47,16.40),
('p1i',"Se inspira en Scandal Pour Homme, de Jean Paul Gaultier.",1,16.87,19.35),
('p2',"Mandarin Sky Elixir:",1,20.08,21.54),
(None,"la versión más intensa,",1,22.09,23.55),
(None,"con vainilla, incienso y pimienta negra.",1,23.85,26.47),
('p2i',"Se inspira en Scandal Le Parfum.",1,26.86,28.53),
('p3',"Mandarin Sky Vintage:",1,29.16,30.70),
('p3i',"el mismo ADN de mandarina y caramelo, en una edición de colección.",1,31.15,35.00),
('p4',"Black Forest:",2,0.05,0.95),
(None,"cereza, caramelo, miel y praliné.",2,1.32,3.96),
(None,"Una torta selva negra en un frasco.",2,4.48,6.41),
('p4i',"Composición propia de Armaf.",2,6.86,8.35),
('p5',"Dubai Chocolat:",2,9.00,9.75),
(None,"pistacho, chocolate y knafeh.",2,10.26,12.30),
('p5i',"Se inspira en el viral chocolate de Dubái.",2,12.78,14.88),
('p6',"Candee:",2,15.53,15.90),
(None,"frutilla, frambuesa, durazno y caramelo.",2,16.41,19.27),
(None,"Frutal y goloso,",2,19.75,20.71),
('p6i',"se inspira en Burberry Her Elixir.",2,21.01,22.76),
('p7',"Marshmallow:",2,23.33,23.96),
(None,"malvavisco, vainilla y praliné, súper cremoso.",2,24.38,27.82),
('p7i',"Se inspira en Yum Boujee Marshmallow, de Kayali.",2,28.26,30.83),
('out',"¿Cuál es tu Odyssey?",2,31.46,32.31),
(None,"Contanos en los comentarios.",2,32.73,34.00),
('out2',"En la parte dos, los más intensos.",2,34.39,36.77),
('end',"Y si querés el tuyo, escribinos BELLE por mensaje directo.",2,37.12,40.47),
]
OFF={1:0.0,2:35.71}
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
cues['hook']=0;cues['t1']=-5;cues['dur']=round(OFF[2]+40.72+1.6,2)
open('timing.js','w').write('window.CUES='+json.dumps(cues)+';\nwindow.SUBS='+json.dumps(subs,ensure_ascii=False)+';\n')
print(cues)
