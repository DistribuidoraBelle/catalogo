# mezclar.sh DIR MUSICA_PY DUR
D=$1;M=$2;DUR=$3;cd $D/mix
python3 $M $DUR musica.wav 1 >/dev/null
ffmpeg -y -loglevel error -i voz.wav -af "highpass=f=70,treble=g=-2:f=7000,acompressor=threshold=-20dB:ratio=3:attack=8:release=120,loudnorm=I=-17:LRA=7:TP=-2:linear=true,aresample=44100" -ac 2 vc.wav
MV=$(ffmpeg -i musica.wav -af volumedetect -f null - 2>&1 | grep mean_volume | sed 's/.*: \(.*\) dB/\1/')
G=$(python3 -c "print(round(-26.5-($MV),2))")
ffmpeg -y -loglevel error -i musica.wav -i vc.wav -filter_complex "[0:a]volume=${G}dB[m];[1:a]asplit=2[v][sc];[m][sc]sidechaincompress=threshold=0.05:ratio=4:attack=20:release=300[md];[v]apad=whole_dur=$DUR[vp];[md][vp]amix=inputs=2:normalize=0:duration=longest,alimiter=limit=0.8:level=disabled,afade=t=out:st=$(python3 -c "print($DUR-2.2)"):d=2.2" -t $DUR mezcla.wav
ffmpeg -i mezcla.wav -af volumedetect -f null - 2>&1 | grep -E "mean|max"
