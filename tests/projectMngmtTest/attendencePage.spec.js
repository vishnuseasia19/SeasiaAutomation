const { test, expect } = require('@playwright/test');
const AttendancePage = require('../../pages/projectManagement/attendence.page.js');
const DashboardPage = require('../../pages/projectManagement/dashboard.page.js');

test('attendancePage verification', async ({ page }) => {

  const dashboardPage = new DashboardPage(page);
  const attendancePage = new AttendancePage(page);

  await page.goto('/dashboard');

  // Open sidebar (use ONLY one)
  await dashboardPage.menuBtn.click();

  // Navigate to attendance page
  await attendancePage.navigateToAttendance();

  // Validate
  await attendancePage.validateStatus('01 Apr, 2026', 'Present');

});


// const { test, expect } = require('@playwright/test');
// const AttendencePage = require('../../pages/projectManagement/attendence.page');
// const DashboardPage = require('../../pages/projectManagement/dashboard.page.js');
// test('attendencePage verifiction', async ({ page }) => {
//     const dashboardPage = new DashboardPage(page);
//     await page.goto('/dashboard');
//    await dashboardPage.menuBtn.click();
//     // await page.locator("//button[@aria-label='open drawer']");
// //     const date = '01 Apr, 2026'
// //     await page.getByRole('button',{name:'Report Management'}).click();
// //     await page.getByRole('link', { name: 'User Attendance', exact: true }).click();
// //     const tableContainer=await page.locator("table[aria-label='simple table']");
// //      await tableContainer.waitFor({ state: 'visible' });
// //      const row = await tableContainer.getByRole('row',{name:date});
// // //   .filter({ hasText: '01 Apr, 2026' });
// // await expect(row.getByRole('cell').nth(3)).toHaveText('Present');
// //   console.log(row); 

//  await page.getByRole('button', { name: 'open drawer' }).click();

//   await attendancePage.navigateToAttendance();

//   await attendancePage.validateStatus('01 Apr, 2026', 'Present');
     
// })