F=[
('hook',"¿Querés que cuando pases, todos se den vuelta por tu perfume?",1,0.05,3.02),
('h2',"Hay lugares donde siempre tenés que ponerte perfume…",1,3.72,6.39),
('h3',"y casi nadie lo hace.",1,6.94,8.09),
('m',"Uno: las muñecas.",1,8.94,10.47),
('m2',"Cada vez que movés las manos, el aroma se esparce a tu alrededor.",1,10.90,14.15),
('c',"Dos: los costados del cuello.",1,14.91,16.79),
('c2',"La piel está calentita,",1,17.27,18.44),
('c3',"y eso hace que tu perfume proyecte:",1,18.81,20.49),
('c4',"que lo sientan cuando se acercan a vos.",1,20.93,22.82),
('n',"Tres: la nuca.",1,23.46,24.76),
('n2',"Cuando caminás, va dejando tu estela…",1,25.22,27.27),
('n2b',"ese rastro que queda cuando ya pasaste.",1,27.73,29.67),
('n3',"De la estela y la proyección te hablo en otro video.",1,30.14,32.68),
('b',"¿Querés que proyecte todavía más?",2,0.05,1.75),
('b1',"Ponelo en la parte de arriba de los brazos.",2,2.28,4.34),
('b2',"Ahí no hay roce con nada, así que dura más…",2,4.74,7.36),
('b3',"y cada vez que movés los brazos, lo esparcís.",2,7.88,10.41),
('x',"Y ojo: nunca en el centro, abajo del mentón, ni en el pecho.",2,10.98,14.92),
('x2',"El olor sube directo a tu nariz…",2,15.52,17.21),
('x3',"y pasa esto: fatiga olfativa.",2,17.62,19.89),
('x4',"Lo olés tanto, que tu cerebro lo anula…",2,20.57,22.79),
('x5',"y dejás de sentir tu propio perfume.",2,23.24,25.04),
('x6',"Y si no pasa eso, terminás empalagado de tanto olerlo.",2,25.72,28.82),
('r',"Muñecas, cuello y nuca.",2,29.52,31.47),
('r2',"Y si querés más: los brazos.",2,31.95,33.87),
('e',"¿Querés un perfume que proyecte de verdad?",2,34.39,36.24),
(None,"Escribinos BELLE por mensaje directo.",2,36.72,39.10),
]
OFF={1:0.0,2:33.39}
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
cues['hook']=0;cues['t1']=cues['m'];cues['dur']=round(OFF[2]+39.39+1.6,2)
open('timing.js','w').write('window.CUES='+json.dumps(cues)+';\nwindow.SUBS='+json.dumps(subs,ensure_ascii=False)+';\n')
print(cues)
