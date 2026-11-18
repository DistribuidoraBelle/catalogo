// MODO PORTADA (Instagram) — estilo F
var COVC={'01':['#E8A21E','#5A2A06'],'02':['#2F86D6','#06204A'],'03':['#B8263E','#3A0610'],'04':['#E07AA0','#4A1030']};
function renderCover(){var out=DEFS;var col=COVC[INTRO.n]||['#E8A21E','#5A2A06'];out+=bgF(col[0],col[1]);
 var ns={};P.forEach(function(p){notesOf(p).slice(0,3).forEach(function(n){ns[n]=1;});});var notes=Object.keys(ns);
 out+=T('SERIE · ARMAF',540,120,{f:'Montserrat',w:800,s:30,c:'#fff',ls:12});
 out+=big('CLUB DE',380,250,0.97)+big('NUIT',790,470,1,0,'#111');
 out+=explode(0,1.4,notes,540,1150,34,INTRO.n*7+3,false,600);
 var N=P.length,hm=(N-1)/2;for(var i=0;i<N;i++){var u=(i-hm)/hm;var x=540+u*430,y=1180+u*u*110;out+='<g transform="rotate('+(u*10)+' '+x+' '+(y+200)+')">'+img(P[i].cut,x,y,Math.abs(u)<0.3?560:460,1,0,'filter="url(#ds)"')+'</g>';}
 out+=explode(0,1.4,notes,540,1150,34,INTRO.n*7+3,true,600);
 out+=medal(1470,0.92,0.9);
 out+=pill('PARTE '+INTRO.n,540,1720,40,'#fff',col[1],1);
 out+=T(INTRO.t,540,1840,{f:'Anton',s:Math.min(130,1900/INTRO.t.length),c:'#fff',ls:2});
 out+=T(N+' PERFUMES EXPLICADOS UNO X UNO',540,1895,{f:'Montserrat',w:800,s:30,c:'#fff',ls:4});
 document.getElementById('sv').innerHTML=out;document.getElementById('sub').innerHTML='';var wm=document.getElementById('wm');if(wm)wm.style.display='none';
 out='';}
