#!/bin/bash
S=/tmp/claude-0/-home-user-catalogo/8e9e085a-f7d4-5023-9c93-b86d877f9570/scratchpad/mk/signos; cd $S
for g in h m; do
  END=$(python3 -c "import json;print(json.load(open('cues_$g.json'))['end'])"); N=$(python3 -c "import math;print(math.ceil($END*30))")
  rm -rf frames; mkdir frames; q=$(( (N+3)/4 ))
  for k in 0 1 2 3; do a=$((k*q)); b=$(( (k+1)*q )); [ $b -gt $N ] && b=$N; IDX=idx_$g.html node rend3.js $PWD frames $a-$b > r$k.log 2>&1 & done; wait
  echo "$g frames $(ls frames|wc -l)/$N"
  ffmpeg -nostdin -loglevel error -y -i vfinal_$g.wav -af "highpass=f=70,treble=g=-2:f=7000,acompressor=threshold=-24dB:ratio=2.5:attack=8:release=200,apad" -t $END -ar 48000 vp.wav
  L=$(ffmpeg -nostdin -i vp.wav -af ebur128 -f null - 2>&1 | awk '/I:/{v=$2} END{print v}'); G=$(python3 -c "print(-17-($L))")
  ffmpeg -nostdin -loglevel error -y -i vp.wav -af "volume=${G}dB,alimiter=limit=0.8" -ac 2 v.wav
  MV=$(ffmpeg -nostdin -i mus_$g.mp3 -af volumedetect -f null - 2>&1 | awk '/mean_volume/{print $5}'); MG=$(python3 -c "print(-27-($MV))"); FO=$(python3 -c "print($END-1.5)")
  ffmpeg -nostdin -loglevel error -y -i mus_$g.mp3 -af "volume=${MG}dB,afade=t=out:st=$FO:d=1.5,apad" -t $END -ar 48000 -ac 2 m.wav
  ffmpeg -nostdin -loglevel error -y -i m.wav -i v.wav -filter_complex "[0][1]sidechaincompress=threshold=0.05:ratio=2:attack=30:release=900[mm];[mm][1]amix=inputs=2:normalize=0,alimiter=limit=0.95[a]" -map "[a]" mix_$g.wav
  ffmpeg -nostdin -loglevel error -y -framerate 30 -i frames/f%04d.jpg -i mix_$g.wav -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest -movflags +faststart signos_$g.mp4
  echo "$g done $(ffprobe -v error -show_entries format=duration -of csv=p=0 signos_$g.mp4)"
done
