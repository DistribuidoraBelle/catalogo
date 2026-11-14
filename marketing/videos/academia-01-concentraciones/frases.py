# (clave_de_escena o None, texto en pantalla, bloque, inicio, fin)  — tiempos medidos con silencedetect
F=[
('hook',"¿Por qué hay perfumes que a las dos horas ya no los sentís…",1,0.05,3.14),
(None,"y otros que te duran hasta el otro día?",1,3.55,5.47),
('box',"No es la marca.",1,6.13,6.87),
(None,"Es una sigla que está en la caja…",1,7.48,9.10),
(None,"y casi nadie la mira.",1,9.58,10.85),
('stay',"Quedate, que al final te digo cuál te conviene a vos.",1,11.58,14.26),
('c1',"Todo perfume es alcohol mezclado con esencia.",1,15.14,17.72),
('c1ess',"La esencia es lo que huele.",1,18.28,19.80),
('c1mas',"Y cuanta más esencia tiene… más dura en tu piel.",1,20.36,23.18),
('c1sig',"Esa cantidad es lo que te dice la sigla.",1,23.86,26.05),
('c2',"La más suave es la Eau de Cologne:",2,0.05,2.07),
(None,"del 2 al 5% de esencia.",2,2.60,4.78),
(None,"Te dura una o dos horas.",2,5.41,7.27),
('edt',"Después viene la Eau de Toilette,",2,7.86,9.67),
(None,"la famosa EDT:",2,9.97,11.44),
(None,"hasta un 15%.",2,11.98,13.47),
(None,"Entre tres y cinco horas.",2,14.00,15.59),
('fres',"Frescas, ideales para el calor, la oficina o después del gimnasio.",2,16.08,20.02),
('c3',"La Eau de Parfum, EDP:",2,20.63,22.64),
(None,"del 15 al 20%.",2,23.23,25.13),
(None,"De cinco a ocho horas.",2,25.67,27.21),
(None,"La favorita de casi todos.",2,27.60,29.23),
('parfum',"El Parfum, o Extrait:",2,29.68,31.23),
(None,"hasta un 30%.",2,31.79,33.22),
(None,"Con pocas gotas te dura todo el día.",2,33.73,35.86),
('elixir',"Y el Elixir:",2,36.43,37.24),
(None,"una versión reforzada, más profunda y más oscura.",2,37.72,40.96),
(None,"Ideal para la noche.",2,41.42,42.39),
('c4',"¿Entonces, cuál te conviene?",3,0.05,1.72),
('ck',"Si buscás algo fresco para el día y el verano:",3,2.21,4.53),
(None,"una EDT, como el CK One.",3,4.90,7.26),
('mom',"Si querés que te dure de la mañana a la noche:",3,7.73,10.08),
(None,"un Extrait, como el Momento de Riiffs.",3,10.47,12.54),
('tip',"Y un tip: el perfume dura más en la piel hidratada.",3,12.98,16.04),
(None,"Ponete crema antes.",3,16.44,17.52),
('end',"¿No sabés cuál es el tuyo?",3,17.98,19.12),
(None,"Escribinos BELLE por mensaje directo y te asesoramos.",3,19.52,22.72),
]
OFF={1:0.0,2:26.76,3:69.84}
import json,re
def syl(w): return max(1,len(re.findall(r'[aeiouáéíóúü]+',w.lower())) + (1 if re.search(r'\d',w) else 0))
cues={};subs=[]
for k,txt,b,a,z in F:
    a+=OFF[b];z+=OFF[b]
    if k: cues[k]=round(a-0.12,3)   # la animación arranca apenas antes de la palabra
    words=txt.split();W=[syl(w) for w in words];tot=sum(W);acc=0;wt=[]
    for w,ww in zip(words,W): wt.append((w,a+(z-a)*acc/tot)); acc+=ww
    line=[]
    for j,(w,tt) in enumerate(wt):
        line.append({'s':w,'t':round(tt,3)})
        if len(line)>=6 or (len(line)>=3 and re.search(r'[,:…]$',w)) or j==len(wt)-1:
            nxt=wt[j+1][1] if j+1<len(wt) else z
            subs.append({'t0':line[0]['t'],'t1':round(nxt+0.15 if j==len(wt)-1 else nxt-0.02,3),'w':line}); line=[]
cues['dur']=round(OFF[3]+24.69+1.8,2)
open('timing.js','w').write('window.CUES='+json.dumps(cues)+';\nwindow.SUBS='+json.dumps(subs,ensure_ascii=False)+';\n')
print(cues)
