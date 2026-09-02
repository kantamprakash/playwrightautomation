const { test } = require('../../src/fixtures/baseTest');

// JavaScript port of com.krn.actitime.tasks.CreateCustomer
test('testCreateCustomer', { tag: ['@customer', '@functionality', '@smoke'] }, async ({ page, tp, xlib }) => {
  await tp.clickOnTasks();
  await tp.clickOnAddNew();

  await page.locator("xpath=//div[text()='New Customer']").click();

  const custName = await xlib.getExcelData('CreateCustomer', 1, 0);
  const desc = await xlib.getExcelData('CreateCustomer', 1, 1);

  await page.locator("xpath=(//input[@placeholder='Enter Customer Name'])[2]").fill(custName);
  await page.locator("xpath=//textarea[@placeholder='Enter Customer Description']").fill(desc);
  await page.locator("xpath=//div[text()='Create Customer']").click();
});
