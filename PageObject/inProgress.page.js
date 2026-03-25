class inProgressPage {
    constructor(page)
    {
        this.page=page;
        this.source=this.page.locator('text=playwright task');
        this.sprintBacklogBtn=this.page.locator('#mui-component-select-status');
        this.InProgressOption=this.page.getByRole('option',{name:'In Progress'});
        this.goBackBtn=this.page.locator('.MuiBox-root.css-1frq8dh'); 
    }
}
module.exports=inProgressPage;