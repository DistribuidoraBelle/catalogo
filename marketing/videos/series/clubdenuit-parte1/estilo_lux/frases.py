F=[
('hook',"Club de Nuit:",1,0.00,0.73),
('h2',"la serie que hizo famosa a Armaf.",1,1.07,3.11),
('h4',"Parte uno: la familia Intense.",1,3.55,5.71),
('go',"¡Arrancamos!",1,6.04,6.98),
('p1',"Club de Nuit Man.",1,7.52,8.36),
('n1',"Mandarina, canela y cuero:",1,8.89,10.77),
('q1',"el clásico dorado que arrancó la leyenda.",1,11.20,13.41),
('i1',"Inspirado en One Million.",1,13.83,15.16),
('p2',"Man Improved Version.",1,15.62,16.94),
('n2',"Mismo ADN…",1,17.40,18.58),
('q2',"pero con más presencia y más duración.",1,18.91,21.09),
('i2',"También inspirado en One Million.",1,21.55,22.96),
('p3',"Intense Man.",1,23.45,24.23),
('n3',"Limón, ananá y abedul ahumado.",1,24.71,26.86),
('q3',"El clon más famoso del planeta.",1,27.26,29.11),
('i3',"Inspirado en Aventus, de Creed.",1,29.55,31.26),
('p4',"Intense Limited Edition.",1,31.69,33.11),
('n4',"El Intense en versión parfum:",1,33.57,35.08),
('q4',"más denso, más elegante.",1,35.58,37.21),
('i4',"Inspirado en Aventus.",1,37.64,38.81),
('p5',"Intense Extrait.",1,39.16,40.15),
('n5',"El ahumado se vuelve terciopelo.",1,40.57,42.26),
('q5',"Suave, redondo, carísimo.",1,42.66,44.99),
('i5',"Inspirado en Aventus.",1,45.46,46.65),
('p6',"Intense Extreme.",1,46.99,48.02),
('n6',"Humo, cuero y fruta, al máximo:",1,48.43,50.86),
('q6',"se siente a una cuadra.",1,51.14,52.42),
('i6',"Inspirado en Aventus.",1,52.87,54.03),
('p7',"Intense Overdose.",1,54.36,55.56),
('n7',"Ananá, ciruela y vainilla:",1,55.93,57.59),
('q7',"una sobredosis dulce que ya es furor.",1,57.88,60.04),
('i7',"Inspirado en Absolu Aventus.",1,60.50,62.11),
('p8',"Précieux One.",1,62.49,63.25),
('n8',"Caramelo, ananá y cuero, en extracto:",1,63.70,66.22),
('q8',"la joya de la familia.",1,66.52,67.79),
('i8',"Inspirado en Absolu Aventus.",1,68.21,69.81),
('out',"¿Con cuál te quedás?",1,70.18,70.98),
(None,"Comentalo.",1,71.30,71.82),
('out2',"Seguinos: en la parte dos, los frescos.",1,72.26,74.95),
('end',"Y el tuyo lo encontrás en distribuidorabelle.com",1,75.29,78.21),
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
cues['hook']=0;cues['t1']=-5;cues['dur']=round(78.48+3.0,2)
cues['fol']=round(cues['out2']+1.3,2)
open('timing.js','w').write('window.CUES='+json.dumps(cues)+';\nwindow.SUBS='+json.dumps(subs,ensure_ascii=False)+';\n')
print(cues)
