class dashboardPage{
    constructor(page)
    {
        this.page=page;
        
   this.menuBtn = page.locator("//button[@aria-label='open drawer']");
    this.projectManagement = page.getByText("Project Management");
    this.boardLink = page.getByRole("link", { name: "Board", exact: true });
    this.createIssueBtn = page.getByRole("button", { name: "Create Issues", exact: true });
  }
  async navigateToBoard() {
    await this.menuBtn.click();
    await this.projectManagement.click();
    await this.boardLink.click();
  }
    async clickCreateIssue() {
    await this.createIssueBtn.click();
  }

    }
    module.exports=dashboardPage;

