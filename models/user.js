class User {
    constructor(username, name, password, role, email, image, logo) {
        this.username = username;
        this.name = name;
        this.password = password;
        this.role = role;
        this.email = email;
        this.image = image;
        this.projects = [];
        this.totalFunds = 0;
    }
}

module.exports = User;