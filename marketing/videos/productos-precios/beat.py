# Beat house original a 120 BPM, sintetizado desde cero (sin samples) → libre de derechos.
import numpy as np, sys
from scipy.io import wavfile
from scipy.signal import butter, lfilter
SR=44100; BPM=120; B=60/BPM; DUR=float(sys.argv[1]) if len(sys.argv)>1 else 12.5
N=int(SR*DUR); L=np.zeros(N); R=np.zeros(N)
rng=np.random.default_rng(7)
def env(n,a=0.002,d=0.2):
    t=np.arange(n)/SR; e=np.minimum(1,t/a)*np.exp(-t/d); return e
def add(sig,t0,pan=0.0,g=1.0):
    i=int(t0*SR); j=min(N,i+len(sig));
    if i>=N: return
    s=sig[:j-i]*g; L[i:j]+=s*(1-max(0,pan)); R[i:j]+=s*(1+min(0,pan))
def lp(x,f): b,a=butter(2,f/(SR/2)); return lfilter(b,a,x)
def hp(x,f): b,a=butter(2,f/(SR/2),'high'); return lfilter(b,a,x)
# --- instrumentos
def kick():
    n=int(0.45*SR); t=np.arange(n)/SR; f=48+120*np.exp(-t*28); ph=2*np.pi*np.cumsum(f)/SR
    return np.sin(ph)*env(n,0.001,0.22)*1.0 + 0.3*np.sin(ph*2)*env(n,0.001,0.03)
def clap():
    n=int(0.3*SR); x=rng.standard_normal(n); x=hp(lp(x,3500),900)
    e=np.zeros(n)
    for k,o in enumerate([0,0.008,0.016]): i=int(o*SR); e[i:]+=env(n-i,0.0005,0.012 if k<2 else 0.12)
    return x*e*0.55
def hat(open_=False):
    n=int((0.22 if open_ else 0.05)*SR); x=hp(rng.standard_normal(n),7000)
    return x*env(n,0.0005,0.09 if open_ else 0.018)*(0.22 if open_ else 0.16)
def saw(f,n,det=0.0):
    t=np.arange(n)/SR; return 2*((t*f*(1+det))%1)-1
def stab(freqs,n):
    x=np.zeros(n)
    for f in freqs:
        for d in (-0.006,0,0.006): x+=saw(f,n,d)
    x=lp(x/ (len(freqs)*3),2600); return x*env(n,0.004,0.16)
def bass(f,n):
    t=np.arange(n)/SR; x=np.sin(2*np.pi*f*t)+0.35*np.sign(np.sin(2*np.pi*f*t))
    return lp(x,600)*np.minimum(1,t/0.004)*np.exp(-t/0.35)*0.5
# --- progresión Am - F - C - G (1 compás cada uno)
A3,F3,C4,G3=220.0,174.61,261.63,196.0
prog=[(A3/2,[A3,261.63,329.63]),(F3/2,[F3,220.0,261.63]),(C4/2,[C4,329.63,392.0]),(G3/2,[G3,246.94,293.66])]
beats=int(DUR/B)
side=np.ones(N)                      # sidechain (el bajo y los acordes "respiran" con el bombo)
for b in range(beats):
    t=b*B; bar=(b//4)%4; root,ch=prog[bar]
    intro = t<1.0
    add(kick(),t,g=0.0 if intro else 1.0)
    i=int(t*SR); n=int(0.32*SR); j=min(N,i+n); side[i:j]=np.minimum(side[i:j],1-0.75*np.exp(-np.arange(j-i)/SR/0.09))
    if b%2==1 and not intro: add(clap(),t,pan=0.05)
    for s in range(4):               # hats en semicorcheas, abierto en el contratiempo
        tt=t+s*B/4
        if s==2: add(hat(True),tt,pan=-0.25)
        else: add(hat(False),tt,pan=0.25,g=0.7 if s%2 else 1.0)
    # bajo en contratiempos (estilo house)
    add(bass(root,int(B/2*SR)),t+B/2,g=0.6)
    # stabs de acordes: patrón sincopado
    for off in (0.0,0.75) if b%2==0 else (0.5,):
        add(stab(ch,int(0.3*SR)),t+off*B,pan=(-0.3 if off else 0.3),g=1.3)
# riser de ruido al final de cada 8 compases y un "crash" al inicio
for t0 in (0.0,):
    n=int(1.0*SR); x=hp(rng.standard_normal(n),3000)*np.linspace(0,1,n)**2*0.12; add(x,max(0,1.0-1.0))
n=int(1.6*SR); crash=hp(rng.standard_normal(n),5000)*env(n,0.001,0.6)*0.25; add(crash,1.0)
# aplicar sidechain a todo menos al bombo (aproximación: a toda la mezcla, suave)
mix=np.stack([L,R],1)*(0.55+0.45*side)[:,None]
# filtro de apertura en la intro (0→1 s)
fade_in=np.clip(np.arange(N)/SR/1.0,0,1)
mix[:int(SR)]=np.stack([lp(mix[:int(SR),0],900),lp(mix[:int(SR),1],900)],1)*0.8
# fade out final
fo=int(1.2*SR); mix[-fo:]*=np.linspace(1,0,fo)[:,None]
mix=np.tanh(mix*1.4)/np.tanh(1.4)    # saturación/limitador suave
mix/=np.max(np.abs(mix))*1.05
wavfile.write(sys.argv[2] if len(sys.argv)>2 else 'beat.wav',SR,(mix*32767).astype(np.int16))
print('ok',DUR)
