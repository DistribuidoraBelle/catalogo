# Genera timing.js (CUES + SUBS karaoke) a partir de los inicios de cada frase.
import json,sys,re
SEC=[('hook',"¿Por qué hay perfumes que a las dos horas ya no los sentís… y otros que te duran hasta el otro día?"),
('box',"No es la marca. Es una sigla que está en la caja… y casi nadie la mira."),
('stay',"Quedate, que al final te digo cuál te conviene a vos."),
('c1',"Todo perfume es alcohol mezclado con esencia."),
('c1ess',"La esencia es lo que huele."),
('c1mas',"Y cuanta más esencia tiene… más dura en tu piel."),
('c1sig',"Esa cantidad es lo que te dice la sigla."),
('c2',"La más suave es la Eau de Cologne: del 2 al 5% de esencia. Te dura una o dos horas."),
('edt',"Después viene la Eau de Toilette, la famosa EDT: hasta un 15%. Entre tres y cinco horas."),
('fres',"Frescas, ideales para el calor, la oficina o después del gimnasio."),
('c3',"La Eau de Parfum, EDP: del 15 al 20%. De cinco a ocho horas. La favorita de casi todos."),
('parfum',"El Parfum, o Extrait: hasta un 30%. Con pocas gotas te dura todo el día."),
('elixir',"Y el Elixir: una versión reforzada, más profunda y más oscura. Ideal para la noche."),
('c4',"¿Entonces, cuál te conviene?"),
('ck',"Si buscás algo fresco para el día y el verano: una EDT, como el CK One."),
('mom',"Si querés que te dure de la mañana a la noche: un Extrait, como el Momento de Riiffs."),
('tip',"Y un tip: el perfume dura más en la piel hidratada. Ponete crema antes."),
('end',"¿No sabés cuál es el tuyo? Escribinos BELLE por mensaje directo y te asesoramos.")]
cues=json.load(open(sys.argv[1]))           # {"hook":0,...,"dur":69, opcional "ends":{key:t_fin_de_voz}}
ends=cues.get('ends',{})
order=[k for k,_ in SEC]+['dur']
subs=[]
def syl(w): return max(1,len(re.findall(r'[aeiouáéíóú]+',w.lower())))
for i,(k,txt) in enumerate(SEC):
    t0=cues[k]+0.05; t1=ends.get(k, cues[order[i+1]]-0.25)
    words=txt.split()
    W=[syl(w)+ (1.5 if re.search(r'[.,:…?]$',w) else 0) for w in words]
    tot=sum(W); acc=0; wt=[]
    for w,ww in zip(words,W): wt.append((w,t0+(t1-t0)*acc/tot)); acc+=ww
    # cortar en renglones de hasta 6 palabras, cortando en puntuación
    line=[]
    for j,(w,tt) in enumerate(wt):
        line.append({'s':w,'t':round(tt,3)})
        if len(line)>=6 or re.search(r'[.:?…]$',w) or (len(line)>=4 and w.endswith(',')) or j==len(wt)-1:
            nxt=wt[j+1][1] if j+1<len(wt) else t1
            subs.append({'t0':line[0]['t'],'t1':round(nxt-0.02,3),'w':line}); line=[]
c={k:v for k,v in cues.items() if k!='ends'}
open('timing.js','w').write('window.CUES='+json.dumps(c)+';\nwindow.SUBS='+json.dumps(subs,ensure_ascii=False)+';\n')
print(len(subs),'renglones')
