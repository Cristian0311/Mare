const puppeteer = require("puppeteer");

const base = "https://mare-a8w2.onrender.com";
// Production product cache fix deployed; verify bootstrap and catalog cards.
const routes = [
  "/",
  "/categorias",
  "/buscar",
  "/coleccion/ofertas",
  "/coleccion/novedades",
  "/coleccion/destacados",
  "/coleccion/mas-vendidos",
  "/mi-pedido",
  "/favoritos",
  "/informacion",
  "/informacion/como-comprar",
  "/informacion/entregas",
  "/informacion/faq",
  "/informacion/condiciones",
  "/informacion/contacto"
];

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"]
  });

  const results = [];
  try {
    for (const route of routes) {
      const page = await browser.newPage();
      const pageErrors = [];
      const consoleErrors = [];
      const requestFailures = [];

      page.on("pageerror", e => pageErrors.push(String(e)));
      page.on("console", msg => {
        if (msg.type() === "error") consoleErrors.push(msg.text());
      });
      page.on("requestfailed", req => requestFailures.push(req.url() + " :: " + (req.failure()?.errorText || "failed")));

      const response = await page.goto(base + route + "?smoke=" + Date.now(), {
        waitUntil: "domcontentloaded",
        timeout: 30000
      });

      await new Promise(resolve => setTimeout(resolve, 10000));

      const body = await page.evaluate(() => document.body?.innerText || "");
      const cards = await page.$$('[id^="product-card-"]');
      const fatalText = /Algo salió mal en este módulo|Error al iniciar MARÉ|Error al iniciar este módulo/i.test(body);

      results.push({
        route,
        status: response?.status() || 0,
        title: await page.title(),
        productCards: cards.length,
        fatalText,
        pageErrors,
        consoleErrors,
        requestFailures: requestFailures.slice(0, 20)
      });

      await page.close();
    }

    console.log(JSON.stringify(results, null, 2));

    const home = results[0];
    const bad = results.filter(r =>
      r.status >= 400 ||
      r.fatalText ||
      r.pageErrors.length > 0
    );

    if (!home || home.status >= 400 || home.fatalText || home.pageErrors.length || home.productCards === 0) {
      process.exit(2);
    }
    if (bad.length) process.exit(3);
  } finally {
    await browser.close();
  }
})().catch(err => {
  console.error(err);
  process.exit(4);
});
