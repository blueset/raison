"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LoginStatus = function () {
    function LoginStatus() {
        _classCallCheck(this, LoginStatus);

        this.login = false;
    }

    _createClass(LoginStatus, [{
        key: "login",
        value: function login() {
            this.login = true;
        }
    }, {
        key: "logout",
        value: function logout() {
            this.logout = false;
        }
    }, {
        key: "isLogIn",
        value: function isLogIn() {
            return this.login === true;
        }
    }]);

    return LoginStatus;
}();

model.exports = LoginStatus;
