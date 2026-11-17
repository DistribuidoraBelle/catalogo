const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
const names={1:'odyssey_p1_dulces',2:'odyssey_p2_intensos',3:'odyssey_p3_frescos',4:'odyssey_p4_frutales_spicy'};
for(const n of (process.argv[2]||'1,2,3,4').split(',')){await p.goto('file://'+__dirname+'/cover.html#'+n,{waitUntil:'networkidle'});await p.reload({waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(500);
await p.screenshot({path:__dirname+'/portada_'+names[n]+'_9x16.png'});}
await b.close();})();
