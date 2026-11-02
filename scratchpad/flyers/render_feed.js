const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:1080,height:1350}});const page=await ctx.newPage();
for(const f of fs.readdirSync(__dirname).filter(f=>f.startsWith('feed-')&&f.endsWith('.html'))){ await page.goto('file://'+path.join(__dirname,f)); await page.evaluate(()=>document.fonts.ready); await page.waitForTimeout(1200); await page.screenshot({path:'/home/user/catalogo/flyers/'+f.replace('.html','.png')}); console.log(f); }
await b.close();})();
