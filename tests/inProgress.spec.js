const {test, expect} = require('@playwright/test');
const LoginPage = require('../PageObject/login.page.js');
const DashboardPage = require('../PageObject/dashboard.page.js');
const CreateIssuePage = require('../PageObject/CreateIssue.page.js');
const InProgressPage = require('../PageObject/inProgress.page.js');
const { asyncWrapProviders } = require('node:async_hooks');

test('Task inProgress ', async({page})=>
{ 
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const createIssuePage = new CreateIssuePage(page);
  const inProgressPage = new InProgressPage(page);
  const user = {username: "4076",
                password : "Vishnu@1915"
              };

  await loginPage.goto();
  await loginPage.login(user);
  await dashboardPage.navigateToBoard();
  await dashboardPage.clickCreateIssue();

  await createIssuePage.createTask();

  await createIssuePage.cancelIssue();
  await inProgressPage.source.click();
  await inProgressPage.sprintBacklogBtn.click();
  await inProgressPage.InProgressOption.click();
  await inProgressPage.goBackBtn.click();

  await expect(
  page.locator("//div[@data-rbd-droppable-id='In Progress']")
      .locator('text=playwright task')
).toBeVisible();
  // await inProgressPage.source.click();
  // await expect(inProgressPage.sprintBacklogBtn).toHaveText('In Progress');



  // const source = await page.locator('text=playwright task');
  // await source.click();
  // const panel = page.locator('text=Assignee').first(); // stable element in panel
  // await panel.waitFor();
  // await page.locator('#mui-component-select-status').click();
  // await page.getByRole('option',{name:'In Progress'}).click();
  //await page.mouse.click(50, 200);// click on top left side of page


  await page.pause();




})