const {chromium}=require('playwright');const fs=require('fs');
const [,,dir,mode,arg]=process.argv;
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
await p.goto('file://'+dir+'/'+(process.env.IDX||'index.html')+'',{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);await p.waitForFunction('window.__ready===true',{timeout:60000});
const waitBg=()=>p.evaluate(()=>{const im=document.getElementById('bg');return (!im||im.complete)?1:new Promise(r=>{im.onload=im.onerror=r})});
if(mode==='stills'){for(const t of arg.split(',').map(Number)){await p.evaluate(t=>render(t),t);await waitBg();await p.waitForTimeout(80);await p.screenshot({path:`${dir}/st_${t}.png`});}}
else{const [n0,n1]=arg.split('-').map(Number);fs.mkdirSync(dir+'/frames',{recursive:true});for(let i=n0;i<n1;i++){await p.evaluate(t=>render(t),i/30);await waitBg();await p.screenshot({path:`${dir}/frames/f${String(i).padStart(4,'0')}.jpg`,type:'jpeg',quality:93});}}
await b.close();})();
