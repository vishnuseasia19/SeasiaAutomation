class LeavePage {
  constructor(page) {
    this.page = page;
this.header = page.locator('text=Leave Management').nth(0);
  }
}

module.exports = LeavePage;