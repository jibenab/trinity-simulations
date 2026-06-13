const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  await page.goto('file:///Users/jibenab/Documents/trinity App/Trinity-simulations/simulation/exponents-basics.html');
  await page.waitForTimeout(2000);
  await browser.close();
})();
