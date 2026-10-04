const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('response', response => console.log('PAGE RESPONSE:', response.status(), response.url()));
  page.on('requestfailed', request => console.log('PAGE REQUEST FAILED:', request.failure().errorText, request.url()));

  console.log('Navigating to deployed site...');
  await page.goto('https://81fr.github.io/hgmhasbi/', { waitUntil: 'networkidle2' });
  
  console.log('Clicking Settings...');
  // Find a div/button containing "الإعدادات"
  await page.evaluate(() => {
    const elements = Array.from(document.querySelectorAll('*')).filter(e => e.textContent.includes('الإعدادات'));
    for(let e of elements) {
      if(e.tagName === 'DIV' && e.className === 'sidebar-item') { // Try to find sidebar item
         e.click();
         break;
      }
    }
  });
  
  await page.waitForTimeout(3000); // wait for 3s to see if it crashes
  
  const content = await page.content();
  if (content.includes('Something went wrong!')) {
      console.log('ERROR BOUNDARY TRIGGERED!');
  } else {
      console.log('No error boundary detected.');
  }
  
  await browser.close();
})();
