import puppeteer from 'puppeteer';
import { spawn } from 'child_process';

const server = spawn('npm', ['start']);
server.stdout.on('data', (data) => console.log(`Server: ${data}`));
server.stderr.on('data', (data) => console.error(`Server Error: ${data}`));

setTimeout(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));
  
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  await browser.close();
  server.kill();
  process.exit(0);
}, 3000);
