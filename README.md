# playwrightautomation

Playwright (JavaScript) port of the Actitime **Selenium + TestNG + Apache POI**
automation project found in `Downloads/Project/Actitime`.

The behaviour, locators, test data and flow are kept identical — only the
framework changes (Selenium WebDriver + TestNG -> Playwright Test).

## Structure

| Selenium (Java)                                   | Playwright (JavaScript)                     |
| ------------------------------------------------- | ------------------------------------------- |
| `com.krn.actitime.testbase.BaseClass`             | `src/fixtures/baseTest.js`                  |
| `com.krn.actitime.testbase.ExcelLibrary`          | `src/testbase/excelLibrary.js`             |
| `com.krn.actitime.pageclasses.TasksPage`          | `src/pageclasses/tasksPage.js`             |
| `com.krn.actitime.tasks.CreateCustomer`           | `tests/tasks/createCustomer.spec.js`       |
| `com.krn.actitime.tasks.DeleteCustomer`           | `tests/tasks/deleteCustomer.spec.js`       |
| `com.krn.actitime.users.CreateUser`               | `tests/users/createUser.spec.js`          |
| `com.krn.actitime.users.DeleteUser`               | `tests/users/deleteUser.spec.js`          |
| `Data/data.xlsx`                                   | `data/data.xlsx` (unchanged copy)          |
| TestNG suite XMLs (`smoke.xml`, `customer.xml`, …) | tag filters — see below                    |

The original TestNG suite XMLs are kept under `testng-suites-reference/` for
traceability.

## Learning the project

`docs/Playwright-Tutorial.pdf` (source: `docs/tutorial.html`) is a hands-on
tutorial that explains this project file by file and teaches Playwright by
mapping every Selenium/TestNG concept to its Playwright equivalent. Regenerate
the PDF after editing the HTML with `node docs/genpdf.js`.

## Lifecycle mapping

| TestNG                        | Playwright                                          |
| ----------------------------- | -------------------------------------------------- |
| `@BeforeClass openBrowser()`  | browser chosen in `playwright.config.js` from the `Browser` sheet + `goto` / title assert in `beforeEach` |
| `@BeforeMethod login()`       | `test.beforeEach` in `baseTest.js`                 |
| `@AfterMethod logout()`       | `test.afterEach` in `baseTest.js`                  |
| `@AfterClass closeBrowser()`  | Playwright disposes the page/context automatically |

## Setup

```bash
npm install
npx playwright install
```

## Running

```bash
npm test                  # all tests (functionlaity.xml)
npm run test:smoke        # smoke.xml   -> CreateCustomer + CreateUser
npm run test:customer     # customer.xml -> CreateCustomer + DeleteCustomer
npm run test:user         # user.xml     -> CreateUser + DeleteUser
npm run test:functionality # functionlaity.xml -> all four
npm run report            # open the HTML report
```

Browser comes from `data/data.xlsx` (`Browser` sheet). Override per run:

```bash
BROWSER=chromium npm test
```
