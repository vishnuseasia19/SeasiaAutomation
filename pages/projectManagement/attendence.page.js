const { expect } = require('@playwright/test');

class attendancePage{
    constructor(page)
    {
        this.page=page;

      this.header = page.locator('text=User Attendance').nth(0);
  //     this.selectYear=page.locator("button[title='Open']"); 
  //     this.selectMonth=page.locator("#outlined-basic");
  //     this.applyForAttendenceBtn=page.getByRole('buttom',{name:'Apply For Attendance'});
  //     this.selectDate=page.locator('.sc-eeMvmM ');
  //     this.yearSelect=page.locator('#select-22');
  //  this.date = (day) => page.getByRole('button', { name: `${day}` });
  //    this.workLocationDropdown = page.getByText('Select Work Location');
  //   this.workLocationOption = (option) => page.getByRole('option', { name: option });

  //    this.workingHours = page.getByText('Select Duration Type');
  //   this.workingHourOption = (option) => page.getByRole('option', { name: option });

  //    this.reason = page.getByText('Select Reason');
  //   this.reasonOption = (option) => page.getByRole('option', { name: option });
      
  //   }
  //   async applyAttendence(day = '2')
  //   {
  //     await this.applyForAttendenceBtn.click();
  //     await this.selectDate.click();
  //     await this.date(day).click();

  //   // Handle custom dropdown properly
  //   await this.workLocationDropdown.click();
  //   await this.workLocationOption('Work From Office').click();
  //    await this.workingHours.click();
  //    await this.workingHourOption('Work From Office').click();
  //    await this.reason.click();
  //    await this.reasonOption('Tracker Issue').click();



       // 🔹 Buttons
    this.applyForAttendanceBtn = page.getByRole('button', { name: 'Apply For Attendance' });
    this.cancelBtn = page.getByRole('button', { name: 'Cancel' });

    // 🔹 Date Picker
    this.dateInput = page.locator("input[placeholder*='Date']");
    this.dateButton = (day) => page.getByRole('button', { name: `${day}` });

    // 🔹 Work Location
    this.workLocationDropdown = page.getByRole('combobox', { name: 'Select Work Location' });
    this.workLocationOption = (option) => page.getByRole('option', { name: option });

    // 🔹 Duration Type
    this.durationDropdown = page.getByRole('combobox', { name: 'Select Duration Type' });
    this.durationOption = (option) => page.getByRole('option', { name: option });

    // 🔹 Reason
    this.reasonDropdown = page.getByRole('combobox', { name: 'Select Reason' });
    this.reasonOption = (option) => page.getByRole('option', { name: option });


     // Navigation
    this.reportManagementBtn = page.getByRole('button', { name: 'Report Management' });
    this.userAttendanceLink = page.getByRole('link', { name: 'User Attendance' });

    // Table
    this.table = page.locator("table[aria-label='simple table']");
    this.rows = this.table.locator('tbody tr');

    }
     async navigateToAttendance() {
    await this.reportManagementBtn.click();
    await this.userAttendanceLink.click();
    await this.table.waitFor({ state: 'visible' });
  }
  // Get specific cell from row
  getCell(row, index) {
    return row.locator('td').nth(index);
  }

  // Get row by date
  getRowByDate(date) {
    return this.table.getByRole('row', { name: date });
  }
   //  Validate status
  async validateStatus(date, expectedStatus) {
    const row = this.getRowByDate(date);

    await expect(row).toBeVisible();
    await expect(this.getCell(row, 3)).toHaveText(expectedStatus);
  }


  // 🔹 Actions
  async clickApplyAttendance() {
    await this.applyForAttendanceBtn.click();
  }

  async selectDate(day) {
    await this.dateInput.click();
    await this.dateButton(day).click();
  }

  async selectWorkLocation(option) {
    await this.workLocationDropdown.click();
    await this.workLocationOption(option).click();
  }

  async selectDuration(option) {
    await this.durationDropdown.click();
    await this.durationOption(option).click();
  }

  async selectReason(option) {
    await this.reasonDropdown.click();
    await this.reasonOption(option).click();
  }

  async clickCancel() {
    await this.cancelBtn.click();
  }

 

    }


module.exports=attendancePage;