# Música original sintetizada (sin samples): 4 estilos con groove + vibra romántica.
import numpy as np, sys
from scipy.io import wavfile
from scipy.signal import butter, lfilter
SR=44100; DUR=float(sys.argv[1]); OUT=sys.argv[2]; V=sys.argv[3]
N=int(SR*DUR); L=np.zeros(N); R=np.zeros(N); rng=np.random.default_rng(3)
def lp(x,f): b,a=butter(2,min(f,SR/2-100)/(SR/2)); return lfilter(b,a,x)
def hp(x,f): b,a=butter(2,f/(SR/2),'high'); return lfilter(b,a,x)
def env(n,a=0.002,d=0.2): t=np.arange(n)/SR; return np.minimum(1,t/a)*np.exp(-t/d)
def adsr(n,a,r): t=np.arange(n)/SR; e=np.minimum(1,t/a); k=int(r*SR); 
def add(sig,t0,pan=0.0,g=1.0):
    i=int(t0*SR)
    if i>=N or i<0: return
    j=min(N,i+len(sig)); s=sig[:j-i]*g; L[i:j]+=s*(1-max(0,pan)); R[i:j]+=s*(1+min(0,pan))
def m(n): return 440*2**((n-69)/12)
# ── instrumentos
def kick(d=0.3,p=50):
    n=int(0.5*SR); t=np.arange(n)/SR; f=p+110*np.exp(-t*30); ph=2*np.pi*np.cumsum(f)/SR
    return np.sin(ph)*env(n,0.001,d)
def snare(g=0.5):
    n=int(0.25*SR); t=np.arange(n)/SR; x=hp(lp(rng.standard_normal(n),6000),1200)*env(n,0.001,0.07)
    return (x*0.8+np.sin(2*np.pi*190*t)*env(n,0.001,0.05)*0.6)*g
def snap():
    n=int(0.12*SR); x=hp(lp(rng.standard_normal(n),5000),1800); return x*env(n,0.0005,0.025)*0.6
def rim():
    n=int(0.08*SR); t=np.arange(n)/SR; return (np.sin(2*np.pi*1700*t)+0.5*hp(rng.standard_normal(n),3000))*env(n,0.0005,0.012)*0.35
def hat(o=False):
    n=int((0.2 if o else 0.05)*SR); return hp(rng.standard_normal(n),8000)*env(n,0.0005,0.08 if o else 0.015)*(0.16 if o else 0.12)
def shaker():
    n=int(0.09*SR); return hp(lp(rng.standard_normal(n),11000),5000)*np.sin(np.linspace(0,np.pi,n))**2*0.09
def conga(f):
    n=int(0.3*SR); t=np.arange(n)/SR; fr=f*(1+0.3*np.exp(-t*40)); return np.sin(2*np.pi*np.cumsum(fr)/SR)*env(n,0.001,0.12)*0.4
def sub(f,dur,glide=False):
    n=int(dur*SR); t=np.arange(n)/SR; fr=f*(1+(0.5*np.exp(-t*25) if glide else 0))
    x=np.sin(2*np.pi*np.cumsum(fr)/SR); x=x+0.2*np.tanh(3*x)
    return x*np.minimum(1,t/0.005)*np.minimum(1,(dur-t)/0.03).clip(0)*0.55
def logdrum(f,dur=0.35):
    n=int(dur*SR); t=np.arange(n)/SR; fr=f*(1+0.8*np.exp(-t*35)); x=np.sin(2*np.pi*np.cumsum(fr)/SR)
    return np.tanh(2.2*x)*env(n,0.002,0.18)*0.5
def rhodes(f,dur):
    n=int(dur*SR); t=np.arange(n)/SR
    x=np.sin(2*np.pi*f*t+0.9*np.exp(-t*3)*np.sin(2*np.pi*f*t))+0.25*np.sin(2*np.pi*14*f*t)*np.exp(-t*25)
    trem=1+0.15*np.sin(2*np.pi*5*t); return x*env(n,0.003,1.2)*trem*np.minimum(1,(dur-t)/0.08).clip(0)*0.2
def pad(fs,dur):
    n=int(dur*SR); t=np.arange(n)/SR; x=np.zeros(n)
    for f in fs:
        for d in (-0.004,0,0.004): x+=2*((t*f*(1+d))%1)-1
    x=lp(x/(len(fs)*3),1400); return x*np.minimum(1,t/0.6)*np.minimum(1,(dur-t)/0.5).clip(0)*0.22
def guitar(f,dur=0.8,bright=0.5):   # Karplus-Strong
    n=int(dur*SR); P=int(SR/f); buf=rng.uniform(-1,1,P); out=np.zeros(n)
    for i in range(n):
        out[i]=buf[i%P]; buf[i%P]=0.996*(bright*buf[i%P]+(1-bright)*buf[(i+1)%P]) if True else 0
    return lp(out,4500)*0.35
def lead(f,dur,kind='soft'):
    n=int(dur*SR); t=np.arange(n)/SR; vib=1+0.006*np.sin(2*np.pi*5.5*t)*np.minimum(1,t/0.25)
    ph=2*np.pi*np.cumsum(f*vib)/SR
    if kind=='flute': x=np.sin(ph)+0.15*np.sin(2*ph)+0.04*hp(rng.standard_normal(n),3000)
    elif kind=='bell': x=np.sin(ph)+0.4*np.sin(3.5*ph)*np.exp(-t*6)
    else: x=np.sin(ph)+0.3*np.sin(2*ph)+0.12*np.sin(3*ph)
    e=np.minimum(1,t/0.03)*np.minimum(1,(dur-t)/0.08).clip(0)*(0.85+0.15*np.exp(-t*4))
    return lp(x,3500)*e*0.22
def chord(root,q):  # q: lista de intervalos
    return [m(root+i) for i in q]
MAJ7=[0,4,7,11]; MIN7=[0,3,7,10]; MAJ=[0,4,7]; MIN=[0,3,7]; ADD9=[0,4,7,14]; M9=[0,3,7,14]
# ── estilos
if V=='1':   # Reggaetón romántico suave (dembow) · La menor: Am - F - C - G · 92 BPM
    BPM=92; prog=[(57,MIN7),(53,MAJ7),(48,ADD9),(55,MAJ)]
    mel=[(0,76,.5),(.5,74,.5),(1,72,1),(2,71,.5),(2.5,72,.5),(3,74,1),  (4,72,.5),(4.5,72,.5),(5,69,1.5),(6.5,67,.5),(7,69,1),
         (8,76,.5),(8.5,77,.5),(9,76,1),(10,74,.5),(10.5,72,.5),(11,74,1), (12,71,.5),(12.5,72,.5),(13,74,.75),(13.75,72,.25),(14,71,2)]
    mkind='flute'
elif V=='2': # R&B / neo-soul · Re mayor con séptimas: Dmaj7 - Bm7 - Em7 - A7 · 88 BPM
    BPM=88; prog=[(50,MAJ7),(47,MIN7),(52,MIN7),(45,[0,4,7,10])]
    mel=[(0.5,78,.5),(1,76,.5),(1.5,74,1.5),(3.5,73,.5),(4,74,.5),(4.5,76,1),(5.5,78,.5),(6,81,1.5),(7.5,78,.5),
         (8,76,1),(9,74,.5),(9.5,76,.5),(10,79,1.5),(11.5,78,.5),(12,76,.75),(12.75,74,.25),(13,73,1),(14,74,2)]
    mkind='soft'
elif V=='3': # Afro-pop / amapiano romántico · Fa mayor: Fmaj7 - Dm9 - Bbmaj7 - C · 110 BPM
    BPM=110; prog=[(53,MAJ7),(50,M9),(46,MAJ7),(48,ADD9)]
    mel=[(0,72,.75),(.75,74,.75),(1.5,76,1),(2.5,77,.5),(3,76,1),(4,74,.75),(4.75,72,.75),(5.5,69,1.5),(7,72,1),
         (8,72,.75),(8.75,74,.75),(9.5,76,1),(10.5,79,.5),(11,77,1),(12,76,.75),(12.75,74,.75),(13.5,72,2.5)]
    mkind='bell'
else:        # Pop latino / bachata-pop romántico · Mi menor: Em - C - G - D · 124 BPM
    BPM=124; prog=[(52,MIN),(48,MAJ),(55,MAJ),(50,MAJ)]
    mel=[(0,71,.5),(.5,71,.5),(1,74,.5),(1.5,71,.5),(2,69,1),(3,67,1),(4,67,.5),(4.5,69,.5),(5,71,1),(6,72,1),(7,71,1),
         (8,71,.5),(8.5,74,.5),(9,76,1),(10,74,.5),(10.5,72,.5),(11,71,1),(12,69,.5),(12.5,71,.5),(13,67,1),(14,66,1),(15,67,1)]
    mkind='flute'
B=60/BPM; bars=int(DUR/(4*B))+1
for bar in range(bars):
    t0=bar*4*B; root,q=prog[bar%4]; fs=chord(root,q); intro=bar==0; full=bar>=2
    # pads / acordes
    if V=='2':
        for off,d in ((0,1.5),(1.75,0.6),(2.5,1.4)): add(sum(rhodes(f,d*B) for f in fs),t0+off*B,pan=-0.1)
    elif V=='4':
        for s in range(8):  # guitarra punteada estilo bachata
            if s in (0,3,4,6): add(guitar(fs[[0,1,2,1][s%4]]*2,0.6,0.55),t0+s*B/2,pan=0.3,g=0.7)
        add(pad(fs,4*B),t0,g=0.6)
    else:
        add(pad(fs,4*B),t0,g=0.9 if V=='1' else 0.7)
        if V=='3':
            for off in (0.5,1.5,2.5,3.25): add(sum(rhodes(f,0.4*B) for f in fs),t0+off*B,pan=0.2,g=0.7)
        if V=='1':
            for off in (0,0.75,1.5,2,2.75,3.5): add(guitar(fs[int(off*2)%len(fs)]*2,0.5,0.6),t0+off*B,pan=0.35,g=0.45)
    if intro: continue
    # batería + bajo
    for b in range(4):
        t=t0+b*B
        if V=='1':   # dembow: bombo 1, 2, 3, 4 · caja en 1.75 y 2.5 del patrón
            add(kick(0.25,52),t,g=0.9); add(snare(0.45),t+0.75*B); 
            if b%2==1: add(snare(0.4),t+0.5*B)
            for s in range(4): add(hat(),t+s*B/4,pan=0.25,g=0.8 if s%2 else 1)
            add(sub(m(root-12),0.7*B),t,g=0.9)
        elif V=='2': # R&B: swing, bombo sincopado, chasquido en 2 y 4
            if b in (0,2): add(kick(0.3,48),t)
            if b==2: add(kick(0.3,48),t+0.75*B,g=0.7)
            if b%2==1: add(snap(),t,pan=0.1); add(snare(0.25),t)
            for s in range(2): add(hat(),t+(0 if s==0 else 0.62)*B,pan=0.3,g=1 if s==0 else 0.6)
            if b in (0,2): add(sub(m(root-12),1.4*B,True),t,g=0.8)
        elif V=='3': # amapiano: log drum, shaker continuo, bombo a 4
            add(kick(0.22,50),t,g=0.8)
            for s in range(4): add(shaker(),t+s*B/4,pan=-0.3+0.2*s,g=1 if s%2 else 0.6)
            if b%2==1: add(rim(),t+0.5*B,pan=0.2)
            for off in ((0.75,),(0.5,),(0.25,0.75),(0.5,))[b]: add(logdrum(m(root-12+(7 if off==0.25 else 0))),t+off*B,g=0.8)
        else:        # pop latino: 4 en el piso, clave, congas
            add(kick(0.25,50),t,g=0.9)
            if b%2==1: add(snare(0.35),t)
            add(hat(True),t+0.5*B,pan=0.3,g=0.8)
            for off,f in ((0.25,320),(0.75,240)): add(conga(f),t+off*B,pan=-0.35)
            add(sub(m(root-12),0.45*B),t+0.5*B,g=0.8); add(sub(m(root-12),0.4*B),t,g=0.5)
# melodía principal (frase de 4 compases; entra en el compás 2 y se repite)
plen=16*B; k=0
while 4*B+k*plen<DUR:
    for (s,n,d) in mel: add(lead(m(n),d*B*0.95,mkind),4*B+k*plen+s*B,pan=0.05,g=0.9 if k%2==0 else 0.75)
    k+=1
mix=np.stack([L,R],1)
# reverb simple (eco difuso)
for dl,gn in ((0.031,0.25),(0.047,0.2),(0.073,0.15),(0.11,0.1)):
    d=int(dl*SR); mix[d:]+=np.stack([mix[:-d,1],mix[:-d,0]],1)*gn
fo=int(1.5*SR); mix[-fo:]*=np.linspace(1,0,fo)[:,None]; fi=int(0.3*SR); mix[:fi]*=np.linspace(0,1,fi)[:,None]
mix=np.tanh(mix*1.3); mix/=np.max(np.abs(mix))*1.05
wavfile.write(OUT,SR,(mix*32767).astype(np.int16)); print('ok',V)
