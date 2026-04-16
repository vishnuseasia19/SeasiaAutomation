const {test, expect} = require('@playwright/test');
//const LoginPage = require('../../pages/login.page.js');
const DashboardPage = require('../../pages/projectManagement/dashboard.page.js');
const CreateIssuePage = require('../../pages/projectManagement/CreateIssue.page.js');
const InProgressPage = require('../../pages/projectManagement/inProgress.page.js');
//const { asyncWrapProviders } = require('node:async_hooks');

test('Task inProgress ', async({page})=>
{ 
    
  //const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const createIssuePage = new CreateIssuePage(page);
  const inProgressPage = new InProgressPage(page);
 await page.goto('/dashboard');

 // await loginPage.goto();
  //await loginPage.login(user);
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
      .locator('text=API testing (Playwright)')
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