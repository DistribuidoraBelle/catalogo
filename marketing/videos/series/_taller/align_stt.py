# Alinea el guion (frases con clave) contra la transcripción con tiempos por palabra (ElevenLabs Scribe)
import json,re,unicodedata,difflib
def norm(w):
    w=unicodedata.normalize('NFD',w.lower());w=''.join(c for c in w if unicodedata.category(c)!='Mn')
    return re.sub(r'[^a-z0-9]','',w)
def align(stt_path,F):
    J=json.load(open(stt_path));W=[w for w in J['words'] if w.get('type','word')=='word']
    tw=[norm(w['text']) for w in W]
    sw=[];own=[]
    for pi,(k,txt) in enumerate(F):
        for w in txt.split():
            n=norm(w)
            if n: sw.append(n);own.append((pi,w))
    sm=difflib.SequenceMatcher(None,sw,tw,autojunk=False)
    T=[None]*len(sw)
    for a,b,size in sm.get_matching_blocks():
        for i in range(size): T[a+i]=(W[b+i]['start'],W[b+i]['end'])
    # interpolar huecos
    idx=[i for i,x in enumerate(T) if x]
    for i in range(len(T)):
        if T[i] is None:
            prev=max([j for j in idx if j<i],default=None);nxt=min([j for j in idx if j>i],default=None)
            if prev is None: T[i]=(T[nxt][0],T[nxt][0])
            elif nxt is None: T[i]=(T[prev][1],T[prev][1]+0.3)
            else:
                f=(i-prev)/(nxt-prev);t=T[prev][1]+(T[nxt][0]-T[prev][1])*f;T[i]=(t,t+0.2)
    out=[];words={}
    for (pi,w),t in zip(own,T): words.setdefault(pi,[]).append((w,t))
    for pi,(k,txt) in enumerate(F):
        ws=words.get(pi,[])
        out.append((k,txt,ws[0][1][0],ws[-1][1][1],[(w,round(t[0],3)) for w,t in ws]))
    return out
