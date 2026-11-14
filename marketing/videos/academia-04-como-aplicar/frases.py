import json,re,sys
F=[
('hook',"¿Te ponés perfume y a la hora ya no sentís nada?",1,0.05,2.89),
(None,"El problema no es el perfume.",1,3.55,5.30),
(None,"Es cómo te lo ponés.",1,5.80,7.01),
(None,"Mirá estos cinco trucos.",1,7.52,8.79),
('t1',"Uno:",1,9.39,9.66),('t1a',"hidratá la piel antes.",1,10.20,11.60),('t1b',"La crema atrapa el perfume",1,12.20,13.75),('t1c',"y lo hace durar mucho más.",1,13.80,15.52),
('t2',"Dos:",1,16.26,16.63),('t2a',"aplicalo en los puntos de pulso.",1,17.09,18.62),('t2b',"Cuello,",1,19.22,19.80),('t2c',"detrás de las orejas",1,19.85,20.95),('t2d',"y muñecas.",1,21.00,21.73),('t2e',"Ahí la piel está más caliente",1,22.35,24.00),('t2f',"y el aroma se activa.",1,24.05,25.31),
]
B2=json.load(open('b2.json')) if len(sys.argv)>1 else None
if B2: F+= [tuple(x) for x in B2]
else:
    F+=[('t3',"Tres: nunca frotes las muñecas.",2,0.05,2.6),('t3b',"Rompés las notas y el perfume se apaga más rápido.",2,3.1,6.4),
        ('t4',"Cuatro: rociá a unos quince centímetros.",2,7.0,9.8),('t4b',"Ni muy cerca, ni muy lejos.",2,10.3,12.0),
        ('t5',"Y cinco: un disparo en la ropa o en el pelo.",2,12.6,15.4),('t5b',"La tela guarda el aroma durante horas.",2,15.9,18.3),
        ('end',"¿Querés un perfume que te dure todo el día?",2,19.0,21.0),(None,"Escribinos BELLE por mensaje directo.",2,21.4,23.6)]
OFF={1:0.0,2:25.95}
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
cues['hook']=0;cues['dur']=round(F[-1][4]+OFF[2]+1.8,2)
open('timing.js','w').write('window.CUES='+json.dumps(cues)+';\nwindow.SUBS='+json.dumps(subs,ensure_ascii=False)+';\n')
print(cues)
