const puppeteer = require("puppeteer");
const base = "https://mare-a8w2.onrender.com";

(async () => {
  const browser = await puppeteer.launch({headless:"new",args:["--no-sandbox","--disable-setuid-sandbox","--disable-dev-shm-usage"]});
  try {
    const routes=["/","/categorias","/buscar","/coleccion/ofertas","/mi-pedido","/favoritos","/informacion"];
    const results=[];
    for(const route of routes){
      const page=await browser.newPage();
      const errors=[];
      page.on("pageerror",e=>errors.push(String(e)));
      const response=await page.goto(base+route+"?maintenance-smoke="+Date.now(),{waitUntil:"domcontentloaded",timeout:30000});
      await new Promise(r=>setTimeout(r,3000));
      const body=await page.evaluate(()=>document.body?.innerText||"");
      results.push({route,status:response?.status()||0,maintenance:/SERVICIO EN\s+MANTENIMIENTO/i.test(body),indefinite:/TIEMPO INDEFINIDO/i.test(body),errors});
      await page.close();
    }
    const admin=await browser.newPage();
    const adminErrors=[];
    admin.on("pageerror",e=>adminErrors.push(String(e)));
    const ar=await admin.goto(base+"/mare0311/login?maintenance-smoke="+Date.now(),{waitUntil:"domcontentloaded",timeout:30000});
    await new Promise(r=>setTimeout(r,3000));
    const abody=await admin.evaluate(()=>document.body?.innerText||"");
    results.push({route:"/mare0311/login",status:ar?.status()||0,adminLogin:/iniciar|contraseña|correo|login/i.test(abody),maintenance:/SERVICIO EN MANTENIMIENTO/i.test(abody),errors:adminErrors});
    await admin.close();

    console.log(JSON.stringify(results,null,2));
    const publicBad=results.slice(0,7).filter(x=>x.status>=400||x.errors.length||!x.maintenance||!x.indefinite);
    const adminBad=results[7].status>=400||results[7].errors.length||results[7].maintenance;
    if(publicBad.length||adminBad) process.exit(2);
  } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exit(4)});
