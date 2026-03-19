const { test, expect } = require('@playwright/test');
const LoginPage = require('../PageObject/login.page');
const DashboardPage = require('../PageObject/dashboard.page.js');

test('Dashboard Navigation Test', async ({ page }) => {

  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);

  await loginPage.goto();
  await loginPage.login("4076", "Vishnu@1915");

  await dashboardPage.navigateToBoard();

  await expect(page).toHaveURL(/.*board/i);

});