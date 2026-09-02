const base = require('@playwright/test');
const { ExcelLibrary } = require('../testbase/excelLibrary');
const { TasksPage } = require('../pageclasses/tasksPage');

const expect = base.expect;

/**
 * JavaScript port of com.krn.actitime.testbase.BaseClass.
 *
 * TestNG lifecycle  ->  Playwright equivalent
 *   @BeforeClass  openBrowser  -> handled by playwright.config.js (browser is
 *                                 chosen from the "Browser" sheet) + the goto
 *                                 and title assertion in beforeEach
 *   @BeforeMethod login        -> test.beforeEach
 *   @AfterMethod  logout       -> test.afterEach
 *   @AfterClass   closeBrowser -> Playwright closes the context/page itself
 *
 * `xlib` and `tp` are exposed as fixtures so each test reads them the same way
 * the Java tests referenced the inherited `xlib` / `tp` fields.
 */
const test = base.test.extend({
  xlib: async ({}, use) => {
    await use(new ExcelLibrary());
  },
  tp: async ({ page }, use) => {
    await use(new TasksPage(page));
  },
});

test.beforeEach(async ({ page, xlib }) => {
  // --- openBrowser() ---
  await page.goto('/hni/login.do');
  await expect(page).toHaveTitle('actiTIME - Login');

  // --- login() ---
  const un = await xlib.getExcelData('Login', 1, 0);
  const pw = await xlib.getExcelData('Login', 1, 1);
  await page.locator('#username').fill(un);
  await page.locator('input[name="pwd"]').fill(pw);
  await page.locator('#loginButton').click();
  await expect(page.locator("xpath=//h3[text()='Enter Time-Track for']")).toHaveText('Enter Time-Track for');
});

test.afterEach(async ({ page }) => {
  // --- logout() ---
  await page.locator("xpath=//button[@data-testid='popup_menu_button_profile']").click();
});

module.exports = { test, expect };
