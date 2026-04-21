const { test,expect } = require('@playwright/test');
const ProfilePage = require('../../pages/userProfile.page');
const DashboardPage = require('../../pages/projectManagement/dashboard.page');
test('clickProfile', async ({ page }) => {
    const profilePage = new ProfilePage(page);
    const dashboardPage = new DashboardPage(page);
    await page.goto('/dashboard');
    await profilePage.clickProfile();
    await expect(page.getByRole('heading',{name:'User Profile'})).toBeVisible();

})