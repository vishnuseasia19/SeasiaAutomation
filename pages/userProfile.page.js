class profilePage {
    constructor(page)
{
    this.page=page;
     this.profile = page.getByText('Vishnu');
    this.info=this.page.getByRole('menuitem', { name: 'Profile' });
    

    
}
async clickProfile(){
      await this.profile.click();
      await this.info.click();
}
}
module.exports=profilePage; 