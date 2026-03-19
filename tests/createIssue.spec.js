const { test, expect } = require('@playwright/test');
const LoginPage = require('../PageObject/login.page.js');
const DashboardPage = require('../PageObject/dashboard.page.js');
const CreateIssuePage = require('../PageObject/CreateIssue.page.js');

test('Create Issue Test', async ({ page }) => {

  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const createIssuePage = new CreateIssuePage(page);

  await loginPage.goto();
  await loginPage.login("4076", "Vishnu@1915");

  await dashboardPage.navigateToBoard();
  await dashboardPage.clickCreateIssue();

  await createIssuePage.createTask();

  await createIssuePage.cancelIssue();

});