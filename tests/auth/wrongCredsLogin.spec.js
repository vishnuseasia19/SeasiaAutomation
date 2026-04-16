// const {test,expect} = require('@playwright/test');
// const LoginPage = require("../../pages/login.page.js");
// const { log } = require('node:console');
// test('Wrong Creds', async({page})=>
// {   
//     const wrongUser={
//         username: "vishnu",
//         password:"12345678"
//     }
//     const loginPage=new LoginPage(page);
//     await loginPage.goto();
//     await loginPage.login(wrongUser);
//   const toast = page.locator('.Toastify__toast'); 

// await toast.waitFor(); 

// const message = await toast.textContent();
// console.log('Popup Message:', message);
//     await page.pause();
// })