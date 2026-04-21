class dashboardPage{
    constructor(page)
    {
        this.page=page;
        
   this.menuBtn = page.locator("//button[@aria-label='open drawer']");
    this.projectManagement = page.getByText("Project Management");
    this.boardLink = page.getByRole("link", { name: "Board", exact: true });
    this.createIssueBtn = page.getByRole("button", { name: "Create Issues", exact: true });
    this.attendanceCard = page.locator('text=Attendance Details');
    this.leaveCard = page.getByRole('heading', { name: 'Leaves Details' });
    //this.leaveRequestCard = page.locator('text=Leave Requests');
    
    

  }
  async clickAttendance() {
    await this.attendanceCard.click();
  }
    async clickLeavedetails()
{
 await this.leaveCard.click()
}
//   async open() {
//   await this.page.goto('/dashboard');
// }
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

