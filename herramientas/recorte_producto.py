# recorta una región (fracciones x0,y0,x1,y1) y saca el fondo blanco conectado al borde
import sys,numpy as np
from PIL import Image,ImageFilter
from scipy import ndimage as ndi
src,dst,x0,y0,x1,y1=sys.argv[1],sys.argv[2],*map(float,sys.argv[3:7]);tol=int(sys.argv[7]) if len(sys.argv)>7 else 14
im=Image.open(src).convert('RGB');W,H=im.size;im=im.crop((int(x0*W),int(y0*H),int(x1*W),int(y1*H)))
im=im.resize((im.width*2,im.height*2),Image.LANCZOS)
a=np.asarray(im).astype(int);mn,mx=a.min(2),a.max(2)
white=(mn>=255-tol)&((mx-mn)<=14)
lab,n=ndi.label(white);edge=set(np.unique(np.r_[lab[0],lab[-1],lab[:,0],lab[:,-1]]))-{0}
bg=np.isin(lab,list(edge))
fg=~bg;fg=ndi.binary_opening(fg,iterations=2)
lab2,n2=ndi.label(fg)
if n2>1:
  sizes=ndi.sum(fg,lab2,range(1,n2+1));big=[i+1 for i,s_ in enumerate(sizes) if s_>0.03*sizes.max()];fg=np.isin(lab2,big)
fg=ndi.binary_fill_holes(fg) if len(sys.argv)>8 else fg
fg=ndi.binary_erosion(fg,iterations=2)
al=Image.fromarray((fg*255).astype('uint8')).filter(ImageFilter.GaussianBlur(1.2))
out=im.convert('RGBA');out.putalpha(al);bb=out.getbbox();out=out.crop(bb);out.save(dst)
