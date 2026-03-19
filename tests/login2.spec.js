const { test, expect } = require('@playwright/test');
const LoginPage = require('../PageObject/login.page');

test('Login Test', async ({ page }) => {

  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login("4076","Vishnu@1915");

await expect(loginPage.dashboardText).toBeVisible();

});