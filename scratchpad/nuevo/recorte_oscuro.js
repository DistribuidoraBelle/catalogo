// Recorte de fondo blanco para modo oscuro (versión nueva). px = ImageData.data, devuelve true si recortó.
function recortarFondo(px,w,h){
  var i,n=0,lum=0;
  for(var x=0;x<w;x+=3){ i=x*4; lum+=px[i]*.299+px[i+1]*.587+px[i+2]*.114; i=((h-1)*w+x)*4; lum+=px[i]*.299+px[i+1]*.587+px[i+2]*.114; n+=2; }
  for(var y=0;y<h;y+=3){ i=(y*w)*4; lum+=px[i]*.299+px[i+1]*.587+px[i+2]*.114; i=(y*w+w-1)*4; lum+=px[i]*.299+px[i+1]*.587+px[i+2]*.114; n+=2; }
  if(lum/n<222) return false;
  // fondo = blanco NEUTRO (los tres canales altos y parecidos). Un frasco crema o rosado pálido no es fondo.
  var MINC=226, DIF=16, seen=new Uint8Array(w*h), st=new Int32Array(w*h), sp=0;
  function fondo(k){ var j=k*4, r=px[j],g=px[j+1],b=px[j+2]; var mn=r<g?(r<b?r:b):(g<b?g:b), mx=r>g?(r>b?r:b):(g>b?g:b); return mn>=MINC&&(mx-mn)<=DIF; }
  for(var x2=0;x2<w;x2++){ st[sp++]=x2; st[sp++]=(h-1)*w+x2; } for(var y2=0;y2<h;y2++){ st[sp++]=y2*w; st[sp++]=y2*w+w-1; }
  while(sp>0){ var k=st[--sp]; if(seen[k]||!fondo(k)) continue; seen[k]=1; var xx=k%w; if(xx>0)st[sp++]=k-1; if(xx<w-1)st[sp++]=k+1; if(k>=w)st[sp++]=k-w; if(k<w*(h-1))st[sp++]=k+w; }
  // bandas de borde (1 y 2 px hacia adentro del objeto): los píxeles claros del contorno se funden en vez de quedar como filete blanco
  var band=new Uint8Array(w*h);
  for(var k1=0;k1<w*h;k1++){ if(seen[k1]) continue; var xa=k1%w; if((xa>0&&seen[k1-1])||(xa<w-1&&seen[k1+1])||(k1>=w&&seen[k1-w])||(k1<w*(h-1)&&seen[k1+w])) band[k1]=1; }
  for(var k3=0;k3<w*h;k3++){ if(seen[k3]||band[k3]) continue; var xb=k3%w; if((xb>0&&band[k3-1]===1)||(xb<w-1&&band[k3+1]===1)||(k3>=w&&band[k3-w]===1)||(k3<w*(h-1)&&band[k3+w]===1)) band[k3]=2; }
  for(var k2=0;k2<w*h;k2++){
    var j=k2*4, l=px[j]*.299+px[j+1]*.587+px[j+2]*.114, a;
    if(seen[k2]){ a=(255-l)/(255-MINC); a=a<0?0:(a>1?1:a); px[j+3]=Math.round(px[j+3]*a*a); }
    else if(band[k2]===1){ a=(255-l)/(255-150); a=a<0?0:(a>1?1:a); px[j+3]=Math.round(px[j+3]*a); }
    else if(band[k2]===2){ a=(255-l)/(255-215); a=a<0?0:(a>1?1:a); px[j+3]=Math.round(px[j+3]*(0.55+0.45*a)); }
  }
  return true;
}
if(typeof module!=='undefined') module.exports=recortarFondo;
