import json,sys
v=sys.argv[1]; import os; d=json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)),f'stt_{v}.json')))
W=[w for w in d['words'] if w.get('type')=='word']
def find(tok,n=1):
    c=0
    for w in W:
        if w['text'].lower().strip('¡!.,:').startswith(tok):
            c+=1
            if c==n: return round(w['start'],2)
    return None
C={'aten':W[0]['start'],'noche':find('esta'),'black':find('black'),'dist1':find('distribuidora'),'p210':find('doscientos'),'off':find('hasta'),'may':find('precios'),'uni':find('comprando'),'vie':find('viernes'),'h48':find('solamente'),'alarm':find('poné'),'noche2':find('esta',2),'dist2':find('distribuidora',2),'end':round(W[-1]['end'],2)}
print(json.dumps(C))
