const { test, expect } = require('@playwright/test');
//const LoginPage = require('../../pages/login.page');
const DashboardPage = require('../../pages/projectManagement/dashboard.page.js');

test('Dashboard Navigation Test', async ({ page }) => {

  //const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);

  await page.goto('/dashboard');
  //await loginPage.login("4076", "Vishnu@1915");

  await dashboardPage.navigateToBoard();

  await expect(page).toHaveURL(/.*board/i);

});