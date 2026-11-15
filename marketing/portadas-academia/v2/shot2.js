const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
const names={5:'portada_05_donde_aplicar_9x16.png',6:'portada_06_proyeccion_estela_9x16.png',7:'portada_especial01_errores_9x16.png'};
for(const n of [5,6,7]){await p.goto('file://'+__dirname+'/cover2.html#'+n,{waitUntil:'networkidle'});await p.reload({waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(500);
await p.screenshot({path:__dirname+'/../'+names[n]});}
await b.close();})();
