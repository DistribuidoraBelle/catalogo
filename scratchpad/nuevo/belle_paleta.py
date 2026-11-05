# Paleta Belle: equivalencias de la paleta del Cyber (celeste, violeta, rosa, amarillo, tinta azul) a dorados, mostazas, cobre y tinta marrón.
import re
BELLE={
  '0b1020':'241a0c','06080f':'0b0c0e',                                   # tinta
  '22d3ee':'c4965a','bdf0f8':'f3e8d3','164753':'5a4616','0e7490':'a06a2a','0891b2':'a9763f','0f766e':'7a5a1e',   # celeste → dorado
  '8b5cf6':'b8863a','7c3aed':'a06a2a','6d28d9':'8a5a22','ddd6fe':'eadbbd','3b2d6e':'4a3614','5a8fc4':'c4965a',    # violeta → dorado oscuro
  'ff3d8d':'b9652f','fbd0e4':'f5dfcf','5b2342':'4a2a14','be185d':'9c4f1f','e11d74':'9c4f1f','c45a8f':'b9652f',    # rosa → cobre
  'ffc53d':'e8b86d','ffe9a8':'f6e6c4','fde68a':'f0d9a6','fff6d6':'fbf3e2',                                        # amarillo → dorado claro
  '0f1629':'101214','131c33':'181b20','182341':'20242b','2a3558':'2b3038','1a2440':'1d2127',                                                          # fondos oscuros
  'e1e6f2':'e4d6ba','cfd5e6':'dccbaa','f3f4fa':'f6efe1','eef0f7':'f3ebdc','5b6480':'6b583a','4b5578':'6b583a','7f89a8':'8c877d','8a93b2':'8c877d','aab3cf':'b8b2a7','dfe3ef':'e4d6ba',  # grises azulados → arena
}
def bellizar(t):
    for a,b in BELLE.items():
        t=re.sub('#'+a+r'\b',' #'+b,t,flags=re.I).replace(' #'+b,'#'+b)
        t=re.sub('%23'+a+r'\b','%23'+b,t,flags=re.I)
        ra=','.join(str(int(a[i:i+2],16)) for i in (0,2,4)); rb=','.join(str(int(b[i:i+2],16)) for i in (0,2,4))
        t=re.sub(r'rgba?\(\s*'+ra.replace(',',r'\s*,\s*')+r'\s*([,)])',lambda m:'rgba('+rb+m.group(1) if m.group(1)==',' else 'rgb('+rb+')',t)
    return t
