const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:1080,height:1920},deviceScaleFactor:1});const page=await ctx.newPage();
for(const f of fs.readdirSync(__dirname).filter(f=>f.endsWith('.html'))){ await page.goto('file://'+path.join(__dirname,f)); await page.waitForTimeout(400); await page.evaluate(()=>document.fonts.ready); await page.waitForTimeout(1200);
 const ok=await page.evaluate(()=>document.fonts.check('900 20px Unbounded')); const out='/home/user/catalogo/flyers/'+f.replace('.html','.png'); await page.screenshot({path:out}); console.log(f,'unbounded:',ok,'->',out); }
await b.close();})();
