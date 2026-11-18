# Alinea frases (con clave) a segmentos de voz detectados por silencios, por programación dinámica.
import subprocess,re,sys,json
def segs(wav,th='-38dB',d='0.25'):
    out=subprocess.run(['ffmpeg','-i',wav,'-af','silencedetect=n=%s:d=%s'%(th,d),'-f','null','-'],capture_output=True,text=True).stderr
    dur=float(subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',wav],capture_output=True,text=True).stdout)
    ss=[float(x) for x in re.findall(r'silence_start: ([\d.]+)',out)];se=[float(x) for x in re.findall(r'silence_end: ([\d.]+)',out)]
    S=[];t=0.0
    for a,b in zip(ss,se+[dur]*(len(ss)-len(se))):
        if a-t>0.05:S.append((t,a))
        t=b
    if dur-t>0.15:S.append((t,dur))
    return S
def syl(t):
    t=t.lower().replace('1 million','uan milion').replace('540','cinco cuatro cero')
    return max(1,len(re.findall(r'[aeiouáéíóúüy]+',t)))
def align(wav,P):
    S=segs(wav);N=len(S);M=len(P)
    if M>N: raise SystemExit('%s: %d frases > %d segmentos'%(wav,M,N))
    L=[s[1]-s[0] for s in S];sy=[syl(p[1]) for p in P]
    rate=sum(sy)/sum(L)
    INF=1e18;dp=[[INF]*(N+1) for _ in range(M+1)];bk=[[0]*(N+1) for _ in range(M+1)];dp[0][0]=0
    for i in range(1,M+1):
        for j in range(i,N-(M-i)+1):
            for k in range(i-1,j):
                if dp[i-1][k]>=INF:continue
                d=S[j-1][1]-S[k][0];exp=sy[i-1]/rate
                c=dp[i-1][k]+((d-exp)/max(exp,0.4))**2
                if c<dp[i][j]:dp[i][j]=c;bk[i][j]=k
    res=[];j=N
    for i in range(M,0,-1):
        k=bk[i][j];res.append((P[i-1][0],P[i-1][1],round(S[k][0],2),round(S[j-1][1],2)));j=k
    return res[::-1]
