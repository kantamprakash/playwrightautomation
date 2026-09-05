const { defineConfig } = require('@playwright/test');
const { getExcelDataSync } = require('./src/testbase/excelSync');

/**
 * The Selenium BaseClass picked the browser from the "Browser" sheet of
 * data.xlsx (cell row 1, col 0 -> "firefox"). The same value drives the
 * Playwright project here. Override with the BROWSER env var if needed.
 *
 *   firefox        -> firefox
 *   chrome         -> chromium (Google Chrome channel)
 *   chromium       -> chromium (bundled)
 *   ie / edge      -> msedge channel  (Playwright has no Internet Explorer)
 *   webkit         -> webkit
 */
// driver.manage().window().maximize() -> a large desktop viewport.
const MAXIMIZED = { width: 1920, height: 1080 };
const BROWSER_PROJECTS = {
  firefox: { name: 'firefox', use: { browserName: 'firefox', viewport: MAXIMIZED } },
  chrome: { name: 'chrome', use: { browserName: 'chromium', channel: 'chrome', viewport: MAXIMIZED } },
  chromium: { name: 'chromium', use: { browserName: 'chromium', viewport: MAXIMIZED } },
  ie: { name: 'msedge', use: { browserName: 'chromium', channel: 'msedge', viewport: MAXIMIZED } },
  edge: { name: 'msedge', use: { browserName: 'chromium', channel: 'msedge', viewport: MAXIMIZED } },
  webkit: { name: 'webkit', use: { browserName: 'webkit', viewport: MAXIMIZED } },
};

let browserName = process.env.BROWSER;

if (!browserName) {
  try {
    browserName = getExcelDataSync('Browser', 1, 0);
  } catch (e) {
    browserName = 'chromium';
  }
}
const project = BROWSER_PROJECTS[(browserName || 'chromium').toLowerCase()] || BROWSER_PROJECTS.chromium;

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: 0,
  timeout: 60_000,
  expect: { timeout: 30_000 },
  reporter: process.env.CI
    ? [['list'], ['junit', { outputFile: 'test-output/junit-results.xml' }], ['html', { outputFolder: 'test-output', open: 'never' }]]
    : [['list'], ['html', { outputFolder: 'test-output', open: 'never' }]],
  use: {
    baseURL: 'https://online.actitime.com',
    actionTimeout: 30_000,
    navigationTimeout: 30_000,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },
  projects: [project],
});
