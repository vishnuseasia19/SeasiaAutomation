const { test, expect } = require('@playwright/test');
const LoginPage = require('../../pages/projectManagement/login.page.js');
const DashboardPage = require('../../pages/projectManagement/dashboard.page.js');
const CreateIssuePage = require('../../pages/projectManagement/CreateIssue.page.js');

test('Create Issue Test', async ({ page }) => {

  const loginPage = new LoginPage(page);
  // await page.goto('/dashboard'); // This line is no longer needed as loginPage.goto() will handle navigation
  const dashboardPage = new DashboardPage(page);
  const createIssuePage = new CreateIssuePage(page);

  await loginPage.goto();
  //await loginPage.login("4076", "Vishnu@1915");
 
  await page.goto('/dashboard');
  await dashboardPage.navigateToBoard();
  await dashboardPage.clickCreateIssue();

  await createIssuePage.createTask();

  await createIssuePage.cancelIssue();
  

});