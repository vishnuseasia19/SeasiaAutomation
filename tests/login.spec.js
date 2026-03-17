const {test,expect} = require('@playwright/test');

test('loginPage',async({page})=>
{
    await page.goto("https://seasiaconnect.com/login");
    await page.getByPlaceholder("Username").fill("4076");
    await page.getByPlaceholder("Password").fill("Vishnu@1915");
    await page.getByRole('checkbox', { name: 'Remember Me' }).click();
    await page.getByRole("button",{name: "Login"}).click();
   
    await page.waitForLoadState('networkidle');
    
const isVisible = await page.getByText('Dashboard').first().isVisible();

if (isVisible) {
    console.log("Login Successfully");
} else {
    console.log("Enter the Correct Credentials..");
}

await page.locator("//button[@aria-label='open drawer']").click();
await  page.getByText("Project Management").click();
//await page.waitForLoadState('networkidle');

await page.getByRole("link",{name:"Board",exact:true}).click();

await page.waitForLoadState('networkidle');
await page.getByRole("button",{name:"Create Issues",exact:true}).click();

await page.getByRole('button', { name: "Issue Type" }).nth(0).click();
await page.getByRole('option', { name: "Task" }).click();
await page.getByLabel('Summary').fill("Login to create Task");

await page.locator('.ql-editor').fill(
  "1. Login to seasiaconnect. 2. navigate to dashboard. 3. go to project management, 4. board. 5. create issue"
);



    await page.pause();

})