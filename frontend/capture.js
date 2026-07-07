/* eslint-disable @typescript-eslint/no-require-imports */
const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    colorScheme: 'dark' // 13-dark-mode.png
  });
  const page = await context.newPage();
  
  const baseUrl = 'http://localhost:3002';
  const outDir = '../README-assets/screenshots';
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  try {
    // 01-home-dashboard.png
    await page.goto(baseUrl);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: `${outDir}/01-home-dashboard.png` });
    await page.screenshot({ path: `${outDir}/13-dark-mode.png` }); // It is dark mode by default

    // 02-wallet-selection.png
    // Click connect wallet if available
    const connectBtn = await page.$('button:has-text("Connect")');
    if (connectBtn) {
      await connectBtn.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: `${outDir}/02-wallet-selection.png` });
      
      // Close modal (usually click outside or close button)
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);
    }

    // Since we don't have the wallet extension, we'll navigate to other pages
    // 05-send-payment-form.png
    await page.goto(`${baseUrl}/send`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: `${outDir}/05-send-payment-form.png` });

    // 08-payment-history.png
    await page.goto(`${baseUrl}/history`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: `${outDir}/08-payment-history.png` });

    // 09-smart-contract-page.png
    await page.goto(`${baseUrl}/contract`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: `${outDir}/09-smart-contract-page.png` });

    // 12-mobile-responsive.png
    const mobileContext = await browser.newContext({
      viewport: { width: 375, height: 812 },
    });
    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto(baseUrl);
    await mobilePage.waitForLoadState('networkidle');
    await mobilePage.screenshot({ path: `${outDir}/12-mobile-responsive.png` });
    await mobileContext.close();

    console.log("Screenshots captured.");
  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
  }
})();
