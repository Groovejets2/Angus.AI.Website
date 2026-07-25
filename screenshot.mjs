import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

// Try both ports
let url = 'http://localhost:3000';
try {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 10000 });
} catch {
  url = 'http://localhost:3001';
  await page.goto(url, { waitUntil: 'networkidle', timeout: 10000 });
}

// Take full page screenshot
await page.screenshot({ path: 'screenshot-full.png', fullPage: true });

// Take screenshot of footer (email section)
const footer = await page.locator('footer');
if (footer) {
  await footer.screenshot({ path: 'screenshot-footer.png' });
}

await browser.close();
console.log('Screenshots saved');
