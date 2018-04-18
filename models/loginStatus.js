class LoginStatus {
    constructor() {
        this.login = false;
    }

    login() {
        this.login = true;
    }

    logout() {
        this.logout = false;
    }

    isLogIn() {
        return this.login === true;
    }
}

model.exports = LoginStatus;