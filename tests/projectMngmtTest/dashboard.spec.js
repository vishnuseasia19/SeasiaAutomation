const { test, expect } = require('@playwright/test');
//const LoginPage = require('../../pages/login.page');
const DashboardPage = require('../../pages/projectManagement/dashboard.page.js');
const AttendancePage = require('../../pages/projectManagement/attendence.page.js');
const LeavePage = require('../../pages/projectManagement/leaveDetail.page.js');

test('Dashboard Navigation Test', async ({ page }) => {

  //const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
 
  const leave = new LeavePage(page);

  await page.goto('/dashboard');
  await dashboardPage.clickAttendance();
  await expect(attendance.header).toBeVisible();
  await expect(page).toHaveURL('https://seasiaconnect.com/userspecific-attendance');
  // await attendance.applyAttendence();
  // 🔹 Click Apply Attendance
//   await page.getByRole('button', { name: 'Apply For Attendance' }).click();

//   // 🔹 Select Date
//    await page.locator("input[placeholder*='Date']").click(); 
//    await page.getByRole('button', { name: '18' }).click();// better than .sc class
// //   // await page.getByRole('button', { name: '2' ,exact:true}).click(); // dynamic later
// //   const calendar = page.getByRole('dialog');
// // await calendar
// //   .getByRole('button', { name: '2', exact: true })
// //   .click();

//   // 🔹 Select Work Location
//   await page.getByRole('combobox', { name: 'Select Work Location' }).click();
//   await page.getByRole('option', { name: 'Work From Office' }).click();

//   // 🔹 Select Duration Type
//   //await page.getByText('Select Duration Type').click();
//   await page.getByRole('combobox', { name: 'Select Duration Type' }).click();
//   await page.getByRole('option', { name: 'Full Day (8 hours)' }).click();

//   // 🔹 Select Reason
//   //await page.getByText('Select Reason').click();
//   await page.getByRole('combobox',{name:'Select Reason'}).click();
//   await page.getByRole('option', { name: 'Tracker Issue' }).click(); 

//   await page.getByRole('button',{name:'Cancel'}).click();



const attendancePage = new AttendancePage(page);

  await attendancePage.clickApplyAttendance();
  await attendancePage.selectDate(18);
  await attendancePage.selectWorkLocation('Work From Office');
  await attendancePage.selectDuration('Full Day (8 hours)');
  await attendancePage.selectReason('Tracker Issue');
  await attendancePage.clickCancel();
  await page.goBack();

  await dashboardPage.clickLeavedetails();
  await expect(leave.header).toBeVisible();
  await expect(page).toHaveURL('https://seasiaconnect.com/leave-management');



  //await loginPage.login("4076", "Vishnu@1915");

  //await dashboardPage.navigateToBoard();

  //await expect(page).toHaveURL(/.*board/i);
  

});