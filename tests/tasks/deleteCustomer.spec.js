const { test } = require('../../src/fixtures/baseTest');

// JavaScript port of com.krn.actitime.tasks.DeleteCustomer
test('testDeleteCustomer', { tag: ['@customer', '@functionality'] }, async ({ page, tp, xlib }) => {
  await tp.clickOnTasks();

  const custName = await xlib.getExcelData('DeleteCustomer', 1, 0);
  await page.locator("xpath=(//input[@placeholder='Quick search by name ...'])[1]").fill(custName);
  await page.locator("xpath=//span[text()='" + custName + "']/../../..//div[@class='editButton']").click();
  await page.locator("xpath=(//div[text()='ACTIONS'])[1]").click();
  await page.locator("xpath=(//div[text()='Delete'])[2]").click();
  await page.locator("xpath=//span[text()='Delete permanently']").click();
});
