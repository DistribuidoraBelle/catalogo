import re
P='html.nv:not(.cyber)'; out=[]
for ln in open('paneles_src.css'):
    ln=ln.rstrip('\n')
    if ln.startswith('@ @media'):
        body=ln[len('@ @media (max-width:680px){'):-1]
        rules=re.findall(r'([^{}]+)\{([^{}]*)\}',body)
        out.append('@media (max-width:680px){'+''.join(P+' '+s.strip()+'{'+d+'}' for s,d in rules)+'}')
    elif ln.startswith('@'):
        i=ln.index('{'); sels=ln[:i]; decl=ln[i:]
        # los selectores se separan con ",@" (una coma sola puede estar adentro de un [style*="..."])
        partes=sels.split(',@'); parts=[]
        for i,p in enumerate(partes):
            if i>0: p='@'+p
            p=p.strip()
            parts.append((P+' '+p[2:].strip()) if p.startswith('@ ') else (P+p[1:]) if p.startswith('@') else (P+' '+p))
        out.append(','.join(parts)+decl)
    else: out.append(ln)
open('nuevo_paneles.css','w').write('\n'.join(out)+'\n'); print(len(out))
