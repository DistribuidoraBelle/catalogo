# rendfull.sh DIR AUDIO DUR OUT
D=$1;A=$2;DUR=$3;OUT=$4;cd $D;rm -rf frames;mkdir frames;N=$(python3 -c "import math;print(math.ceil($DUR*30))");Q=$(( (N+3)/4 ))
for j in 0 1 2 3; do a=$((j*Q)); b=$(( (j+1)*Q )); [ $b -gt $N ] && b=$N; DUR=$DUR N0=$a N1=$b node render_part.js $D x > p$j.log 2>&1 & done; wait
ffmpeg -y -loglevel error -framerate 30 -i frames/f%04d.jpg -i $A -c:v libx264 -crf 21 -preset slow -pix_fmt yuv420p -c:a aac -b:a 192k -shortest $OUT
echo done > r.log
