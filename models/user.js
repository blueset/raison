class User {
    constructor(username, name, password, roles, email, image, city, state, zipCode) {
        this.username = username;
        this.name = name;
        this.password = password;
        this.role = roles;
        this.email = email;
        this.image = image;
        this.city = city;
        this.state = state;
        this.zipCode = zipCode;
    }
}

module.exports = User;