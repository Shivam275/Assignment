class LoginPage {
    constructor(page) {
        this.page = page;
        this.username = page.getByPlaceholder('Username');
        this.password = page.getByPlaceholder('Password');
        this.loginButton = page.getByRole('button', { name: 'Login' });
    }

    async navigate() {
        const baseURL = process.env.BASE_URL;
        if (!baseURL) {
            throw new Error('BASE_URL must be set to open OrangeHRM');
        }

        await this.page.goto(baseURL);
    }

    async login(username, password) {
        await this.username.fill(username);
        await this.password.fill(password);
        await this.loginButton.click();
    }
}

module.exports = LoginPage;
