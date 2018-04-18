var faker = require('faker');

var User = require('./user');

const numuser = 100;

const ROLES = [
    'Investors',
    'Startups',
    'Charities',
    'Donators'
];

var users = {};
var roles = {};
var allUsers = [];

for (let role in ROLES)
    roles[role] = [0];

var defaultUser = new User('johnDue', 'John Due', '12345abcde', 'Investors', 'johndue@gmail.com', faker.internet.avatar(),
    'Melbourne', 'VIC', '3053');

users['johnDue'] = defaultUser;

for (var i = 0; i < numuser; i++) {
    var username = faker.internet.userName();

    while (username in users) {
        username = faker.internet.userName();
    }

    var userRole = ROLES[Math.floor((Math.random() * 4))];
    var user = new User(username,
        faker.name.firstName() + " " + faker.name.lastName(),
        faker.internet.password(),
        userRole,
        faker.internet.email(),
        faker.internet.avatar(),
        faker.address.city(),
        faker.address.state(),
        faker.address.zipCode());

    if (userRole in roles)
        roles[userRole].push(username);
    else
        roles[userRole] = [username];
    users[username] = user;
}

function authenticate(username, password) {
    console.log(username, password);
    if (username in users) {
        if (users[username].password === password) {
            return  {
                found: true,
                match: true,
                user: users[username]
            }
        }
        else return {
            found: true,
            match: false,
            user: null};
    } else return  {
        found: false,
        match: false,
        user: null
    }
}

function findUser(username) {
    if (username in users) return {
        found: true,
        user: users[username]
    };
    else return {
        found: false,
        user: null
    }
}


module.exports = {
    authenticate: authenticate,
    findUser: findUser
}
