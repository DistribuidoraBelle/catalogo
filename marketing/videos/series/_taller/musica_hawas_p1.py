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
    sig=np.array(sig,dtype=float); m_=len(sig); f=min(int(0.006*SR),m_//2)
    if f>1: sig[:f]*=np.linspace(0,1,f); sig[-f:]*=np.linspace(1,0,f)
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

def piano(f,dur):
    n=int(dur*SR); t=np.arange(n)/SR
    x=np.sin(2*np.pi*f*t)+0.4*np.sin(4*np.pi*f*t)*np.exp(-t*3)+0.15*np.sin(6*np.pi*f*t)*np.exp(-t*6)
    return x*env(n,0.003,0.9)*np.minimum(1,(dur-t)/0.1).clip(0)*0.16
def glock(f,dur=0.8):
    n=int(dur*SR); t=np.arange(n)/SR; return (np.sin(2*np.pi*f*t)+0.3*np.sin(2*np.pi*2.76*f*t)*np.exp(-t*10))*env(n,0.001,0.35)*0.12
def uke(fs,t0,down=True,g=0.5):
    for i,f in enumerate(fs if down else fs[::-1]): add(guitar(f,0.7,0.5),t0+i*0.012,pan=0.25,g=g)
def clapsoft():
    n=int(0.2*SR); x=hp(lp(rng.standard_normal(n),4000),900); return x*env(n,0.001,0.04)*0.3

def clap(g=1.0):
    n=int(0.3*SR); x=hp(lp(rng.standard_normal(n),3500),900); e=np.zeros(n)
    for k,o in enumerate([0,0.008,0.016]): i=int(o*SR); e[i:]+=env(n-i,0.0005,0.012 if k<2 else 0.11)
    return x*e*0.5*g
def saw(f,n,d=0): t=np.arange(n)/SR; return 2*((t*f*(1+d))%1)-1
def stab(fs,dur,cut=2800):
    n=int(dur*SR); x=np.zeros(n)
    for f in fs:
        for d in (-0.006,0,0.006): x+=saw(f,n,d)
    return lp(x/(len(fs)*3),cut)*env(n,0.003,0.13)*0.9
def hpiano(fs,dur):   # piano house brillante
    return sum(piano(f,dur)+0.5*piano(f*2,dur) for f in fs)*1.6
def fbass(f,dur):
    n=int(dur*SR); t=np.arange(n)/SR; x=np.sign(np.sin(2*np.pi*f*t))*0.5+np.sin(2*np.pi*f*t)
    return lp(x,700+900*np.exp(-t*20).mean())*np.minimum(1,t/0.003)*np.exp(-t/0.25)*0.45
def chop(fs,dur=0.12):  # guitarra funk cortita
    return sum(guitar(f*2,dur+0.05,0.7) for f in fs)*0.6




# HAWAS P1 v2 · "Verano helado": La mayor, 118 BPM, tropical/piano house alegre: piano stabs, pluck marimba, claps, shaker, bajo saltarín
BPM=118; B=60/BPM
def marimba(f,dur=0.35):
    n=int(dur*SR); t=np.arange(n)/SR; x=np.sin(2*np.pi*f*t)+0.35*np.sin(2*np.pi*4*f*t)*np.exp(-t*30)
    return x*np.minimum(1,t/0.002)*np.exp(-t/0.14)*0.22
def shaker():
    n=int(0.07*SR); x=hp(rng.standard_normal(n),7000); t=np.arange(n)/SR; return x*np.minimum(1,t/0.01)*np.exp(-t/0.02)*0.07
def bbass(f,dur):
    n=int(dur*SR); t=np.arange(n)/SR; x=np.sin(2*np.pi*f*t)+0.3*np.sin(4*np.pi*f*t)
    return lp(x,600)*np.minimum(1,t/0.004)*np.exp(-t/0.22)*0.6
prog=[(57,[0,4,7,11]),(52,[0,4,7,14]),(54,[0,3,7,10]),(50,[0,4,7,11])]   # Amaj7 - Eadd9 - F#m7 - Dmaj7  (I-V-vi-IV)
HOOK=[(0,2),(0.75,1),(1.5,2),(2.5,3),(3,2),(3.5,1)]
bars=int(DUR/(4*B))+1
for bar in range(bars):
    t0=bar*4*B; root,q=prog[bar%4]; fs=[m(root+12+i) for i in q]; intro=bar<1
    add(pad([f/2 for f in fs[:3]],4*B+0.3),t0,g=0.45)
    for off in (0.5,1.5,2.5,3.25):   # piano house a contratiempo
        add(hpiano(fs[:3],0.45*B),t0+off*B,pan=-0.15,g=0.55)
    for off,d in HOOK: add(marimba(fs[d]*2),t0+off*B,pan=0.3,g=0.8)
    if bar%8>=4:
        for k in range(8): add(glock(fs[(k*2)%4]*4,0.5),t0+k*B/2,pan=-0.3,g=0.35)
    if intro: continue
    for b in range(4):
        add(kick(0.16,52),t0+b*B,g=0.6)
        if b%2==1: add(clap(0.55),t0+b*B,pan=0.05)
        for s16 in (0.5,):
            add(hat(),t0+b*B+s16*B,pan=0.25,g=1.0)
        add(shaker(),t0+b*B+0.25*B,pan=-0.3); add(shaker(),t0+b*B+0.75*B,pan=-0.3)
    for off,o in ((0,0),(0.75,0),(1.5,12),(2,7),(2.75,7),(3.5,12)): add(bbass(m(root-12+o),0.4*B),t0+off*B,g=0.85)
mix=np.stack([L,R],1)
mix=np.stack([lp(mix[:,0],6000),lp(mix[:,1],6000)],1)
mix=np.stack([hp(mix[:,0],45),hp(mix[:,1],45)],1)
fo=int(2*SR); mix[-fo:]*=np.linspace(1,0,fo)[:,None]; fi=int(0.3*SR); mix[:fi]*=np.linspace(0,1,fi)[:,None]
mix=mix/np.max(np.abs(mix))*0.9
wavfile.write(OUT,SR,(mix*32767).astype(np.int16)); print('ok')
