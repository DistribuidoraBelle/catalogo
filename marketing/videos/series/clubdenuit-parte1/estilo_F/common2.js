// objetos recortados reales
function OB(note,i){var L=OBJ[note]||OBJ.mandarina;return L[i%L.length];}
function oimg(o,cx,cy,size,rot,op,extra){if(op<=0)return '';var w=o[1],h=o[2],k=size/Math.max(w,h);w*=k;h*=k;
 return '<image href="fotos/obj/'+o[0]+'" x="'+(cx-w/2)+'" y="'+(cy-h/2)+'" width="'+w+'" height="'+h+'" opacity="'+op+'" transform="rotate('+(rot||0)+' '+cx+' '+cy+')" '+(extra||'')+'/>';}
function notesOf(p){var r=[];p.N.forEach(function(n){if(OBJ[n[0]])r.push(n[0]);});return r.length?r:['mandarina'];}
function allNotes(){return Object.keys(OBJ);}
// lluvia de objetos: devuelve svg. seed, notas, t local, densidad, zona
function rain(t,notes,seed,n,o){o=o||{};var s='',H=1920+400;var items=[];
 for(var i=0;i<n;i++){var r1=hsh(seed+i*3.1),r2=hsh(seed+i*7.7),r3=hsh(seed+i*1.9),r4=hsh(seed+i*5.3);
  var z=0.35+r3*0.65;var size=(o.min||90)+z*((o.max||300)-(o.min||90));var sp=(o.sp||260)*(0.5+z);
  var y=((r2*H+t*sp)%H)-200;var x=r1*1080+Math.sin(t*0.8+i)*30*z;var rot=r4*360+t*(r1-0.5)*120;
  items.push({z:z,svg:oimg(OB(notes[i%notes.length],Math.floor(r4*9)),x,y,size,rot,o.op==null?1:o.op,z<0.55&&o.blur?'filter="url(#'+o.blur+')"':'')});}
 items.sort(function(a,b){return a.z-b.z;});items.forEach(function(it){s+=it.svg;});return s;}
