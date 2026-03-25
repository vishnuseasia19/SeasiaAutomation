class LoginPage {
  constructor(page) {
    this.page = page;
    this.username = page.getByPlaceholder('Username');
    this.password = page.getByPlaceholder('Password');
    this.rememberMe = page.getByRole('checkbox', { name: 'Remember Me' });
    this.loginBtn = page.getByRole("button", { name: "Login" });
    this.dashboardText = page.getByText('Dashboard').first();
  }
  async goto() {
    await this.page.goto("https://seasiaconnect.com/login");
  }

  async login(user) {
    await this.username.fill(user.username);
    await this.password.fill(user.password);
    await this.rememberMe.click();
    await this.loginBtn.click();
  }
    async isLoginSuccessful() {
    return await this.dashboardText.isVisible();
  }
}

module.exports = LoginPage;