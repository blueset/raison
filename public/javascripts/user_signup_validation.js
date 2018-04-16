function signup_validation(document, recaptchaResponse) {
    console.log(recaptchaResponse);
    console.log(document.getElementsByClassName("form")[0]);

    var results = [];
    var firstName = document.getElementById("inputFirstname");
    var lastname = document.getElementById("inputLastname");
    var email = document.getElementById("inputEmail");
    var password = document.getElementById("inputPassword");
    var passwordRepeat = document.getElementById("inputPasswordRepeat");
    var city = document.getElementById("inputCity");
    var state = document.getElementById("inputState");
    var zip = document.getElementById("inputZip");


}