const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    const errors = [];
    page.on('pageerror', error => {
      errors.push(error.message);
      console.log('❌ PAGE ERROR:', error.message);
    });

    page.on('console', msg => {
      const type = msg.type();
      if (type === 'error' || type === 'warning') {
        console.log(`⚠️ CONSOLE ${type.toUpperCase()}:`, msg.text());
      }
    });

    console.log('🌐 Navigating to http://localhost:5177...\n');
    await page.goto('http://localhost:5177', {
      waitUntil: 'networkidle0',
      timeout: 10000
    });

    await page.waitForTimeout(2000);

    const appState = await page.evaluate(() => {
      const app = document.querySelector('#app');
      return {
        exists: !!app,
        hasChildren: app ? app.children.length > 0 : false,
        childCount: app ? app.children.length : 0,
        innerHTML: app ? app.innerHTML.substring(0, 500) : '',
        computedStyle: app ? {
          display: window.getComputedStyle(app).display,
          visibility: window.getComputedStyle(app).visibility,
          height: window.getComputedStyle(app).height
        } : null
      };
    });

    console.log('📊 APP DIV STATE:');
    console.log(`   Exists: ${appState.exists}`);
    console.log(`   Has Children: ${appState.hasChildren}`);
    console.log(`   Child Count: ${appState.childCount}`);
    console.log(`   Display: ${appState.computedStyle?.display}`);
    console.log(`   Visibility: ${appState.computedStyle?.visibility}`);
    console.log(`   Height: ${appState.computedStyle?.height}`);
    console.log(`   Content Preview: ${appState.innerHTML.substring(0, 200)}\n`);

    const screenshotPath = 'screenshot.png';
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`📸 Screenshot saved to: ${screenshotPath}\n`);

    if (errors.length > 0) {
      console.log('❌ JavaScript Errors Found:');
      errors.forEach(err => console.log(`   - ${err}`));
    } else {
      console.log('✅ No JavaScript errors detected');
    }

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await browser.close();
  }
})();
