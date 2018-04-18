"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var User = function User(username, name, password, roles, email, image, city, state, zipCode) {
    _classCallCheck(this, User);

    this.username = username;
    this.name = name;
    this.password = password;
    this.roles = roles;
    this.email = email;
    this.image = image;
    this.city = city;
    this.state = state;
    this.zipCode = zipCode;
};

model.exports = User;
