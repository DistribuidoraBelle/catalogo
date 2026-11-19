const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
for(const [h,o] of [[process.argv[2],process.argv[3]],[process.argv[4],process.argv[5]]]){await p.goto('file://'+h,{waitUntil:'networkidle'});await p.waitForFunction('window.__ok===1');await p.waitForTimeout(500);await p.screenshot({path:o});}
await b.close();})();
