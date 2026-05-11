const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const LoginPage = require('../../pages/projectManagement/login.page');



When(
  'the user enters username {string} and password {string}',
  async function (username, password) {
    await this.loginPage.login({ username, password });
  }
)

When('clicks on the login button', async function () {
  // Login action including button click is already handled in the previous step
});

Then('the user should be redirected to the dashboard', async function () {
  await this.page.waitForURL('**/dashboard**', { timeout: 15000 }).catch(() => {});
  console.log("Current URL: " + this.page.url());
  const isVisible = await this.loginPage.isLoginSuccessful();
  await expect(isVisible).toBeTruthy();
});