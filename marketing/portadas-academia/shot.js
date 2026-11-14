const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
for(const n of [1,2,3]){await p.goto('file://'+__dirname+'/cover.html#'+n,{waitUntil:'networkidle'});await p.reload({waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(400);
await p.screenshot({path:__dirname+'/portada_0'+n+'_9x16.png'});await p.screenshot({path:__dirname+'/portada_0'+n+'_3x4.png',clip:{x:0,y:240,width:1080,height:1440}});}
await b.close();})();
