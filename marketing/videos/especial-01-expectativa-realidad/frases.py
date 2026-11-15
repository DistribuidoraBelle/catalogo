F=[
('hook',"Gastás un montón en tu perfume…",1,0.05,1.83),
(None,"y a la hora ya no huele a nada.",1,2.29,4.07),
(None,"No es el perfume:",1,4.61,5.49),
(None,"sos vos.",1,5.94,6.58),
('r',"¿Te ponés perfume y frotás las muñecas?",1,7.25,9.31),
(None,"Error.",1,9.79,10.25),
('r2',"El roce calienta la piel y rompe las notas de salida.",1,10.83,13.78),
('r3',"Rociá…",1,14.31,14.91),
(None,"y dejá que se seque solo.",1,15.22,16.55),
('s',"La piel seca no retiene el perfume:",1,17.04,18.90),
(None,"lo absorbe y se evapora.",1,19.32,20.88),
('s2',"El truco:",1,21.44,21.99),
(None,"una crema sin aroma antes.",1,22.48,24.19),
('s3',"Las moléculas se agarran a la piel…",1,24.67,26.39),
(None,"y duran horas.",1,26.67,27.90),
('n',"¿Rociás al aire y caminás a través de la nube?",2,0.05,2.42),
(None,"Lindo para las películas…",2,2.98,4.33),
('n2',"pero la mitad termina en el piso.",2,4.84,6.48),
('n3',"Directo a la piel,",2,6.99,7.85),
(None,"a un palmo.",2,8.21,8.89),
('b',"Y el más común:",2,9.55,10.33),
(None,"guardarlo en el baño.",2,10.84,11.90),
('b2',"El calor, el vapor y la luz lo arruinan.",2,12.48,15.06),
('b3',"Guardalo en un lugar fresco y oscuro.",2,15.63,17.38),
('c',"No necesitás otro perfume…",2,17.85,19.31),
(None,"necesitás usarlo bien.",2,19.80,21.18),
('end',"¿Querés uno que dure de verdad?",2,21.79,23.09),
(None,"Escribinos BELLE por mensaje directo.",2,23.52,25.95),
]
OFF={1:0.0,2:28.32}
import json,re
def syl(w): return max(1,len(re.findall(r'[aeiouáéíóúü]+',w.lower())))
cues={};subs=[]
for k,txt,b,a,z in F:
    a+=OFF[b];z+=OFF[b]
    if k: cues[k]=max(0,round(a-0.12,3))
    words=txt.split();W=[syl(w) for w in words];tot=sum(W);acc=0;wt=[]
    for w,ww in zip(words,W): wt.append((w,a+(z-a)*acc/tot)); acc+=ww
    line=[]
    for j,(w,tt) in enumerate(wt):
        line.append({'s':w,'t':round(tt,3)})
        if len(line)>=6 or (len(line)>=3 and re.search(r'[,:…]$',w)) or j==len(wt)-1:
            nxt=wt[j+1][1] if j+1<len(wt) else z
            subs.append({'t0':line[0]['t'],'t1':round(nxt+0.15 if j==len(wt)-1 else nxt-0.02,3),'w':line}); line=[]
cues['hook']=0;cues['t1']=cues['r'];cues['dur']=round(OFF[2]+25.95+1.6,2)
open('timing.js','w').write('window.CUES='+json.dumps(cues)+';\nwindow.SUBS='+json.dumps(subs,ensure_ascii=False)+';\n')
print(cues)
