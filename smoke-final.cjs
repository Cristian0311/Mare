const puppeteer = require("puppeteer");
const base = "https://mare-a8w2.onrender.com";
(async () => {
  const browser = await puppeteer.launch({headless:"new",args:["--no-sandbox","--disable-setuid-sandbox","--disable-dev-shm-usage"]});
  const results=[];
  try {
    const page=await browser.newPage();
    page.setViewport({width:1440,height:1000});
    const errors=[]; const consoleErrors=[];
    page.on("pageerror",e=>errors.push(String(e)));
    page.on("console",m=>{if(m.type()==="error")consoleErrors.push(m.text());});
    const response=await page.goto(base+"/?smoke="+Date.now(),{waitUntil:"domcontentloaded",timeout:30000});
    await new Promise(r=>setTimeout(r,10000));
    const cards=await page.$$('[id^="product-card-"]');
    const body=await page.evaluate(()=>document.body?.innerText||"");
    results.push({route:"/",status:response?.status()||0,cards:cards.length,fatal:/Algo salió mal|Error al iniciar/i.test(body),errors,consoleErrors});
    const card=cards[0];
    if(!card) throw new Error("No hay producto en home.");
    await card.click(); await new Promise(r=>setTimeout(r,3000));
    const productPath=new URL(page.url()).pathname;
    await page.close();

    const detail=await browser.newPage();
    const de=[];const dce=[];
    detail.on("pageerror",e=>de.push(String(e)));
    detail.on("console",m=>{if(m.type()==="error")dce.push(m.text());});
    await detail.evaluateOnNewDocument(()=>{localStorage.clear();sessionStorage.clear();});
    const dr=await detail.goto(base+productPath+"?smoke=deeplink-"+Date.now(),{waitUntil:"domcontentloaded",timeout:30000});
    await new Promise(r=>setTimeout(r,12000));
    const db=await detail.evaluate(()=>document.body?.innerText||"");
    const h1=await detail.$("h1");
    const hasName=db.trim().length>100 && !/Producto no encontrado/i.test(db);
    results.push({route:productPath,status:dr?.status()||0,hasH1:!!h1,hasProductContent:hasName,fatal:/Algo salió mal|Error al iniciar|Producto no encontrado/i.test(db),errors:de,consoleErrors:dce});
    await detail.close();

    const mobile=await browser.newPage();
    const me=[];const mce=[];
    mobile.on("pageerror",e=>me.push(String(e)));
    mobile.on("console",m=>{if(m.type()==="error")mce.push(m.text());});
    await mobile.setViewport({width:390,height:844});
    const mr=await mobile.goto(base+"/?smoke=mobile-"+Date.now(),{waitUntil:"domcontentloaded",timeout:30000});
    await new Promise(r=>setTimeout(r,8000));
    const mc=await mobile.$$('[id^="product-card-"]');
    results.push({route:"/ mobile",status:mr?.status()||0,cards:mc.length,fatal:false,errors:me,consoleErrors:mce});
    await mobile.close();

    console.log(JSON.stringify(results,null,2));
    const bad=results.filter(x=>x.status>=400||x.fatal||x.errors.length||x.consoleErrors.length);
    if(bad.length || results[0].cards===0 || !results[1].hasH1 || !results[1].hasProductContent || results[2].cards===0) process.exit(2);
  } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exit(3)});
