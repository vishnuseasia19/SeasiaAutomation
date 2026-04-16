class createIssuePage{
    constructor(page){
        this.page=page;

    this.dialog = page.getByRole('dialog', { name: /Create Issue/i });

    this.issueType = this.dialog.getByRole('button', { name: "Issue Type" }).nth(0);
    this.summary = this.dialog.getByLabel('Summary');
    this.description = page.locator('.ql-editor');

    this.assignee = this.dialog.getByLabel('Assignee');
    this.priorityDropdown = this.dialog.locator('div', { hasText: /^Priority/ }).first();
    this.severityDropdown = this.dialog.locator('div', { hasText: /^Severity/ });

    this.devEffort = this.dialog.getByLabel("Dev Efforts");
    this.qaEffort = this.dialog.getByLabel("QA Efforts");

    this.cancelBtn = this.dialog.getByRole('button', { name: "Cancel" });
    }

   async createTask() {
    await this.issueType.click();
    await this.page.getByRole('option', { name: "Task" }).click();

    await this.summary.fill("Login to create Task");

    await this.description.fill(
      "Steps to reproduce issue..."
    );
        await this.assignee.click();
    await this.page.getByRole('option', { name: "Vishnu" }).click();

    await this.priorityDropdown.getByRole('button').click();
    await this.page.getByRole('option', { name: "High",exact:true }).click();

    await this.severityDropdown.getByRole('button').click();
    await this.page.getByRole('option', { name: "Low" ,exact: true }).click();

    await this.devEffort.fill("0");
    await this.qaEffort.fill("8");
 }
     async cancelIssue() {
    await this.cancelBtn.click();
  }

  }
  module.exports=createIssuePage;
  
