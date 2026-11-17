F=[
('hook',"Odyssey:",1,0.05,0.57),
('h2',"la serie de Armaf que conquistó el mundo.",1,0.93,3.21),
('h3',"Te la explico perfume por perfume.",1,3.62,5.53),
('h4',"Parte uno: los dulces.",1,6.01,7.84),
('p1',"Mandarin Sky, el más famoso.",1,8.26,10.48),
(None,"Mandarina, caramelo y haba tonka:",1,10.89,13.08),
(None,"dulce, cítrico y adictivo.",1,13.47,15.50),
('p1i',"Se inspira en Scandal Pour Homme, de Jean Paul Gaultier.",1,15.86,18.53),
('p2',"Mandarin Sky Elixir:",1,18.99,20.46),
(None,"la versión más intensa,",1,20.77,22.21),
(None,"con vainilla, incienso y pimienta negra.",1,22.42,25.00),
('p2i',"Se inspira en Scandal Le Parfum.",1,25.30,27.04),
('p3',"Mandarin Sky Vintage:",1,27.51,28.94),
('p3i',"el mismo ADN de mandarina y caramelo, en una edición de colección.",1,29.20,33.33),
('p4',"Black Forest:",2,0.05,0.90),
(None,"cereza, caramelo, miel y praliné.",2,1.22,3.77),
(None,"Una torta selva negra en un frasco.",2,4.12,6.02),
('p4i',"Composición propia de Armaf.",2,6.33,7.82),
('p5',"Dubai Chocolat:",2,8.33,9.31),
(None,"pistacho, chocolate y knafeh.",2,9.64,11.65),
('p5i',"Se inspira en el viral chocolate de Dubái.",2,11.94,13.97),
('p6',"Candee:",2,14.41,14.86),
(None,"frutilla, frambuesa, durazno y caramelo.",2,15.23,18.02),
(None,"Frutal y goloso,",2,18.27,19.31),
('p6i',"se inspira en Burberry Her Elixir.",2,19.52,21.28),
('p7',"Marshmallow:",2,21.73,22.42),
(None,"malvavisco, vainilla y praliné, súper cremoso.",2,22.73,26.07),
('p7i',"Se inspira en Yum Boujee Marshmallow, de Kayali.",2,26.30,28.89),
('out',"¿Cuál es tu Odyssey?",2,29.35,30.26),
(None,"Contanos en los comentarios.",2,30.53,31.90),
('out2',"En la parte dos, los más intensos.",2,32.25,34.64),
('end',"Y si querés el tuyo, escribinos BELLE por mensaje directo.",2,34.90,38.27),
]
OFF={1:0.0,2:33.68}
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
cues['hook']=0;cues['t1']=-5;cues['dur']=round(OFF[2]+38.45+1.6,2)
open('timing.js','w').write('window.CUES='+json.dumps(cues)+';\nwindow.SUBS='+json.dumps(subs,ensure_ascii=False)+';\n')
print(cues)
