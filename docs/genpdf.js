// Renders docs/tutorial.html -> docs/Playwright-Tutorial.pdf using the
// Chromium that Playwright already installed.  Run:  node docs/genpdf.js
const path = require('path');
const { chromium } = require('playwright');

const htmlPath = path.join(__dirname, 'tutorial.html');
const pdfPath = path.join(__dirname, 'Playwright-Tutorial.pdf');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('file://' + htmlPath, { waitUntil: 'networkidle' });
  await page.emulateMedia({ media: 'print' });
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '16mm', bottom: '18mm', left: '15mm', right: '15mm' },
    displayHeaderFooter: true,
    headerTemplate: '<div></div>',
    footerTemplate:
      '<div style="width:100%;font-size:8px;color:#888;padding:0 15mm;display:flex;justify-content:space-between;">' +
      '<span>From Selenium to Playwright &mdash; playwrightautomation</span>' +
      '<span>Page <span class="pageNumber"></span> / <span class="totalPages"></span></span>' +
      '</div>',
  });
  await browser.close();
  console.log('PDF written:', pdfPath);
})();
