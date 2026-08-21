const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  
  await page.goto('http://localhost:3000/categorias');
  await new Promise(r => setTimeout(r, 1000));
  
  await page.goto('http://localhost:3000/producto/tenis-converse-99gl');
  await new Promise(r => setTimeout(r, 1000));
  
  await page.goto('http://localhost:3000/mare0311/login');
  await new Promise(r => setTimeout(r, 1000));
  
  await browser.close();
})();
