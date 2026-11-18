const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();for(const n of [1,2,3,4]){const d=process.argv[2]+'/cdnF'+n;const p=await b.newPage({viewport:{width:1080,height:1920}});
await p.goto('file://'+d+'/cover.html',{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);await p.waitForFunction('window.__ready===true',{timeout:120000});await p.waitForTimeout(500);
await p.evaluate(()=>render(0));await p.waitForTimeout(300);await p.screenshot({path:process.argv[2]+'/portada_cdn_p'+n+'.png'});await p.close();}await b.close();})();
