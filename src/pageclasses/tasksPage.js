/**
 * JavaScript port of com.krn.actitime.pageclasses.TasksPage.
 * The Playwright `page` is injected via the constructor instead of being
 * passed to every method (as the Selenium `WebDriver` was).
 */
class TasksPage {
  constructor(page) {
    this.page = page;
  }

  async clickOnTasks() {
    await this.page.locator("xpath=//a[@href='/hni/tasks/tasklist.do']").click();
  }

  async clickOnAddNew() {
    await this.page.locator("xpath=//div[@class='addNewButton']").click();
  }
}

module.exports = { TasksPage };
