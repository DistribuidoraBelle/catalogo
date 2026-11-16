F=[
('hook',"A tu amiga le queda increíble…",1,0.05,1.74),
('h2',"y a vos,",1,2.13,2.75),
(None,"el mismo perfume, no te queda igual.",1,2.96,4.97),
('h3',"No es tu imaginación:",1,5.43,6.58),
('h4',"es química.",1,6.91,7.62),
(None,"Te explico.",1,8.00,8.53),
('lab',"El perfume no flota sobre tu piel:",1,8.96,10.81),
('lab2',"reacciona con ella.",1,11.14,12.28),
('lab3',"Tu piel es un laboratorio…",1,12.69,14.15),
('lab4',"y cada laboratorio da un resultado distinto.",1,14.50,17.04),
('ph',"Primero:",1,17.56,18.02),
(None,"el pH.",1,18.35,19.12),
('ph2',"Es qué tan ácida es tu piel,",1,19.54,21.04),
('ph3',"y cambia de persona a persona.",1,21.31,22.86),
('ph4',"El mismo perfume puede volverse más dulce, más ácido…",1,23.24,26.66),
('ph5',"o más apagado.",1,26.93,27.69),
('gr',"Segundo:",1,28.22,28.80),
(None,"piel grasa o piel seca.",1,29.21,30.76),
('gr2',"La grasa atrapa las moléculas del perfume y lo hace durar más.",1,31.15,34.61),
('gr3',"La seca lo deja escapar rápido.",1,34.94,36.97),
('te',"Tercero:",2,0.05,0.57),
(None,"la temperatura.",2,0.94,1.83),
('te2',"Si tu piel es más calentita,",2,2.29,3.79),
('te3',"el perfume se evapora más rápido y proyecta más.",2,4.01,6.85),
('co',"Cuarto:",2,7.33,7.76),
(None,"lo que comés.",2,8.10,8.96),
('co2',"Las comidas picantes, el ajo, el alcohol o el cigarrillo",2,9.33,12.87),
('co3',"cambian tu olor natural.",2,13.06,14.26),
('co4',"Y también influyen las hormonas y algunos medicamentos.",2,14.58,17.40),
('ba',"Y quinto:",2,17.75,18.34),
(None,"tus bacterias.",2,18.69,19.54),
('ba2',"Tenés millones en la piel…",2,19.84,21.34),
('ba3',"y algunas se comen moléculas del perfume y lo transforman.",2,21.64,24.85),
('tip',"Por eso, nunca compres un perfume porque le queda bien a otra persona.",2,25.25,28.74),
('tip2',"Probalo en tu piel,",2,29.06,29.95),
('tip3',"esperá treinta minutos…",2,30.18,31.58),
('tip4',"y ahí decidí.",2,31.85,32.67),
('cta',"¿Querés encontrar el que va con tu química?",2,33.06,34.84),
('end',"Escribinos BELLE por mensaje directo.",2,35.10,37.45),
]
OFF={1:0.0,2:37.32}
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
cues['hook']=0;cues['t1']=-5;cues['dur']=round(OFF[2]+37.64+1.6,2)
open('timing.js','w').write('window.CUES='+json.dumps(cues)+';\nwindow.SUBS='+json.dumps(subs,ensure_ascii=False)+';\n')
print(cues)
