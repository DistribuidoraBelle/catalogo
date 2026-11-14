const {chromium}=require('playwright');const fs=require('fs');
const [,,dir,mode]=process.argv;const fps=30,dur=10.5;
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
await p.goto('file://'+dir+'/index.html',{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(400);
if(mode==='stills'){const ts=process.argv[4].split(',').map(Number);for(const t of ts){await p.evaluate(t=>render(t),t);await p.screenshot({path:`${dir}/still_${t}.png`});}}
else{fs.mkdirSync(dir+'/frames',{recursive:true});const n=Math.round(fps*dur);for(let i=0;i<n;i++){await p.evaluate(t=>render(t),i/fps);await p.screenshot({path:`${dir}/frames/f${String(i).padStart(4,'0')}.jpg`,type:'jpeg',quality:95});}}
await b.close();})();
