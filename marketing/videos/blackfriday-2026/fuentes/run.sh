#!/bin/bash
cd /tmp/claude-0/-home-user-catalogo/8e9e085a-f7d4-5023-9c93-b86d877f9570/scratchpad/bf
V=$1; python3 mk.py $V 192 >/dev/null
END=$(python3 -c "import json,subprocess;c=json.loads(subprocess.check_output(['python3','voz/cues.py','$V']));print(c['end']+2.4)")
N=$(python3 -c "import math;print(math.ceil($END*30))")
rm -rf frames; mkdir frames; q=$(( (N+3)/4 ))
for k in 0 1 2 3; do a=$((k*q)); b=$(( (k+1)*q )); [ $b -gt $N ] && b=$N; node rend.js $PWD frames $a-$b > r$k.log 2>&1 & done; wait
echo "frames $(ls frames|wc -l)/$N"
# audio
ffmpeg -nostdin -loglevel error -y -i voz/voz_$V.mp3 -af "highpass=f=70,treble=g=-2:f=7000,acompressor=threshold=-24dB:ratio=2.5:attack=8:release=200" -ar 48000 vproc.wav
L=$(ffmpeg -nostdin -i vproc.wav -af ebur128 -f null - 2>&1 | awk '/I:/{v=$2} END{print v}')
G=$(python3 -c "print(-17-($L))")
ffmpeg -nostdin -loglevel error -y -i vproc.wav -af "volume=${G}dB,alimiter=limit=0.8,adelay=150|150,apad" -t $END -ar 48000 -ac 2 voice.wav
MV=$(ffmpeg -nostdin -i mus/m1.mp3 -af volumedetect -f null - 2>&1 | awk '/mean_volume/{print $5}')
MG=$(python3 -c "print(-27-($MV))")
FO=$(python3 -c "print($END-1.6)")
ffmpeg -nostdin -loglevel error -y -i mus/m1.mp3 -af "volume=${MG}dB,lowpass=f=12000,afade=t=out:st=$FO:d=1.6,apad" -t $END -ar 48000 -ac 2 music.wav
ffmpeg -nostdin -loglevel error -y -i music.wav -i voice.wav -filter_complex "[0][1]sidechaincompress=threshold=0.05:ratio=2:attack=30:release=900[m];[m][1]amix=inputs=2:normalize=0,alimiter=limit=0.95[a]" -map "[a]" mix.wav
ffmpeg -nostdin -loglevel error -y -framerate 30 -i frames/f%04d.jpg -i mix.wav -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest -movflags +faststart video1_blackfriday_$V.mp4
echo done $V $END
