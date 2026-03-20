const {test, expect} = require('@playwright/test');
const LoginPage = require('../PageObject/login.page.js');
const DashboardPage = require('../PageObject/dashboard.page.js');
const CreateIssuePage = require('../PageObject/CreateIssue.page.js');
const { text } = require('node:stream/consumers');

test('drag and drop', async ({ page }) => {
 test.setTimeout(120000);
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const createIssuePage = new CreateIssuePage(page);

  await loginPage.goto();
  await loginPage.login("4076", "Vishnu@1915");

  await dashboardPage.navigateToBoard();
  await dashboardPage.clickCreateIssue();

  await createIssuePage.createTask();

  await createIssuePage.cancelIssue();
  
  const source = await page.locator('text=playwright task');
  const targetCol=await page.locator("//div[@data-rbd-droppable-id='In Progress']");
    await expect(source).toBeVisible();
      await expect(targetCol).toBeVisible();
      // Scroll into view (important)
  await source.scrollIntoViewIfNeeded();
  await targetCol.scrollIntoViewIfNeeded();
  const sourceBox = await source.boundingBox();
  const targetBox = await targetCol.boundingBox();
  if (!sourceBox || !targetBox) throw new Error("Element not found");
  await page.mouse.move(
    sourceBox.x + sourceBox.width / 2,
    sourceBox.y + sourceBox.height / 2
  );

  await page.mouse.down();

  // Move slowly (important for React DnD)
  await page.mouse.move(
    targetBox.x + targetBox.width / 2,
    targetBox.y + 50,   // drop inside column (not top border)
    { steps: 15 }
  );
      
  await page.mouse.up();

});