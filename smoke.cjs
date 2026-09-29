const puppeteer = require("puppeteer");

const base = "https://mare-a8w2.onrender.com";

(async () => {
  const browser = await puppeteer.launch({headless:"new",args:["--no-sandbox","--disable-setuid-sandbox","--disable-dev-shm-usage"]});
  try {
    const checks=[];
    async function visit(route, viewport) {
      const page=await browser.newPage();
      await page.setViewport(viewport);
      const errors=[];
      const consoleErrors=[];
      page.on("pageerror",e=>errors.push(String(e)));
      page.on("console",m=>{if(m.type()==="error") consoleErrors.push(m.text());});
      const response=await page.goto(base+route+"?smoke="+Date.now(),{waitUntil:"domcontentloaded",timeout:30000});
      await new Promise(r=>setTimeout(r,8000));
      const body=await page.evaluate(()=>document.body?.innerText||"");
      checks.push({route,viewport:viewport.width,status:response?.status()||0,title:await page.title(),cards:await page.$$('[id^="product-card-"]').then(a=>a.length),fatal:/Algo salió mal en este módulo|Error al iniciar MARÉ|Error al iniciar este módulo/i.test(body),errors,consoleErrors});
      return page;
    }

    const desktop=await visit("/",{width:1440,height:1000});
    if ((await desktop.$$('[id^="product-card-"]')).length===0) throw new Error("La página principal no muestra productos en escritorio.");

    const productCard=await desktop.$('[id^="product-card-"]');
    if(!productCard) throw new Error("No hay tarjetas de producto en la página principal.");
    await productCard.click();
    await new Promise(r=>setTimeout(r,1000));
    const productPath=new URL(desktop.url()).pathname;
    if(!productPath.startsWith('/producto/')) throw new Error("La tarjeta de producto no abre el detalle.");
    const addButton=await desktop.$('[id^="btn-add-"]:not([disabled])');
    if(addButton){
      await addButton.click();
      await new Promise(r=>setTimeout(r,500));
    }

    const detailPage=await browser.newPage();
    await detailPage.setViewport({width:1440,height:1000});
    const detailErrors=[];
    const detailConsoleErrors=[];
    detailPage.on("pageerror",e=>detailErrors.push(String(e)));
    detailPage.on("console",m=>{if(m.type()==="error") detailConsoleErrors.push(m.text());});
    await detailPage.goto(base+productPath+"?smoke=deeplink-"+Date.now(),{waitUntil:"domcontentloaded",timeout:30000});
    await detailPage.evaluate(()=>{localStorage.clear(); sessionStorage.clear();});
    await detailPage.reload({waitUntil:"domcontentloaded",timeout:30000});
    await new Promise(r=>setTimeout(r,12000));
    const detailBody=await detailPage.evaluate(()=>document.body?.innerText||"");
    const detailH1=(await detailPage.$("h1"))!==null;
    const detailHasName=detailBody.toLowerCase().includes("ventiladores") || detailBody.toLowerCase().includes("f6");
    checks.push({route:productPath,viewport:"desktop-detail-deeplink",status:200,title:await detailPage.title(),hasH1:detailH1,hasProductName:detailHasName,fatal:/Algo salió mal en este módulo|Error al iniciar MARÉ|Error al iniciar este módulo|Producto no encontrado/i.test(detailBody),errors:detailErrors,consoleErrors:detailConsoleErrors});
    await detailPage.close();
    await desktop.close();

    const mobile=await visit("/",{width:390,height:844});
    if ((await mobile.$$('[id^="product-card-"]')).length===0) throw new Error("La página principal no muestra productos en móvil.");
    await mobile.close();

    const admin=await visit("/mare0311/login",{width:1440,height:1000});
    const adminBody=await admin.evaluate(()=>document.body?.innerText||"");
    if(/Algo salió mal|Error al iniciar/i.test(adminBody)) throw new Error("El login administrativo muestra un error fatal.");
    await admin.close();

    const bad=checks.filter(x=>x.status>=400||x.fatal||x.errors.length);
    console.log(JSON.stringify(checks,null,2));
    if(bad.length) process.exit(2);
  } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exit(4)});
