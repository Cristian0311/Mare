const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000/categorias');
  await new Promise(r => setTimeout(r, 2000));
  console.log('URL after /categorias:', page.url());
  
  await page.goto('http://localhost:3000/producto/tenis-converse-99gl');
  await new Promise(r => setTimeout(r, 2000));
  console.log('URL after /producto/...:', page.url());
  
  await browser.close();
})();
