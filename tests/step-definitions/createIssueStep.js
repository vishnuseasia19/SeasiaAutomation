const { Given, When, Then } = require('@cucumber/cucumber');
const LoginPage = require('../../pages/projectManagement/login.page.js');
const UserProfilePage = require('../../pages/userProfile.page.js');
const DashboardPage = require('../../pages/projectManagement/dashboard.page.js');
const CreateIssuePage = require('../../pages/projectManagement/createIssue.page.js');

Given('the user is on the login page', async function () {
  this.loginPage = new LoginPage(this.page);
  await this.loginPage.goto();
});

When('the user logs in with valid credentials', async function () {
  await this.loginPage.login({ username: "4076", password: "Vishnu@1915" });
});

Then('the user profile page should be displayed', async function () {
  this.userProfile = new UserProfilePage(this.page);
  await this.userProfile.clickProfile();
});

When('the user navigates to the project board', async function () {
  this.dashboardPage = new DashboardPage(this.page);
  // Waiting for the page to navigate automatically after login
  await this.page.waitForURL('**/dashboard**', { timeout: 30000 }).catch(() => {}); 
  await this.dashboardPage.navigateToBoard();
});

When('the user clicks on create issue', async function () {
  await this.dashboardPage.clickCreateIssue();
});

Then('the user fills in task details', async function () {
  this.createIssuePage = new CreateIssuePage(this.page);
  await this.createIssuePage.createTask();
});

Then('the user cancels the issue creation', async function () {
  await this.createIssuePage.cancelIssue();
});