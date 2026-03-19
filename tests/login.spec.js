const {test,expect} = require('@playwright/test');

test('loginPage',async({page})=>
{ test.setTimeout(60000);
    await page.goto("https://seasiaconnect.com/login");
    await page.getByPlaceholder("Username").fill("4076");
    await page.getByPlaceholder("Password").fill("Vishnu@1915");
    await page.getByRole('checkbox', { name: 'Remember Me' }).click();
    await page.getByRole("button",{name: "Login"}).click();
   
  //  await page.waitForLoadState('networkidle');
    
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

//await page.waitForLoadState('networkidle');

const createPage = page.getByRole('dialog', { name: /Create Issue/i });
await page.getByRole("button",{name:"Create Issues",exact:true}).click();

await createPage.getByRole('button', { name: "Issue Type" }).nth(0).click();
await page.getByRole('option', { name: "Task" }).click();
await page.getByLabel('Summary').fill("Login to create Task");

await page.locator('.ql-editor').fill(
  "1. Login to seasiaconnect. 2. navigate to dashboard. 3. go to project management, 4. board. 5. create issue"
);

 //await page.locator("(//label[normalize-space()='Assignee'])[1]").selectOption("Vishnu");
 //await page.getByRole('option', { name: "Vishnu" }).click();

 await createPage.getByLabel('Assignee').click();
 await page.getByRole('option', { name: "Vishnu" }).click();
 
 // priority
const priorityContainer = createPage.locator('div', { hasText: /^Priority/ }).first();
await priorityContainer.getByRole('button').click();
await page.getByRole('option', { name:"High" ,exact: true}).click();
//Severity
await createPage.locator('div',{hasText:/^Severity/}).getByRole('button').click();
await page.getByRole('option', { name: "Low" , exact:true}).click();

// QA hours
await createPage.getByLabel("Dev Efforts").fill("0");
//await createPage.locator()
await createPage.getByLabel("QA Efforts").fill("8");

await expect(createPage.getByText("Note: Once an estimation is added, it can't be changed in the future. If QA is not applicable to this project, you can enter 0.")).toBeVisible();

await createPage.getByRole('button', { name:"Cancel" }).click();
  await page.pause();

})
