var faker = require('faker');


faker.seed(15121996);

var User = require('./user');

const numuser = 200;

const ROLES = [
    'Investors',
    'Startups',
    'Charities',
    'Donators'
];

var users = {};
var roles = {};
var allUsers = [];
var companies = [];

for (var i = 0; i < 4; i++)
    roles[ROLES[i]] = [];

var defaultUser = new User('johnDue', 'John Due', '12345abcde', 'Investors', 'johndue@gmail.com', faker.internet.avatar(),
    'Melbourne', 'VIC', '3053');

allUsers.push(defaultUser);

users['johnDue'] = defaultUser;
roles['Investors'].push('johnDue');


// Create username
for (let i = 0; i < numuser; i++) {
    var username = faker.internet.userName();

    while (username in users) {
        username = faker.internet.userName();
    }

    // Create 12 companies
    if (i < 12) {
        var user = new User(
            username,
            faker.company.companyName(),
            faker.internet.password(),
            "Investors",
            faker.internet.email(),
            "/images/" + (i + 1) + ".png"
        );
        roles["Investors"].push(username);
        companies.push(username);
        users[username] = user;
    } else {

        var userRole = ROLES[Math.floor((Math.random() * 4))];
        var user = new User(username,
            faker.name.firstName() + " " + faker.name.lastName(),
            faker.internet.password(),
            userRole,
            faker.internet.email(),
            faker.internet.avatar()
        );


        roles[userRole].push(username);

        users[username] = user;
    }
}

var investments = [];
var donations = [];
var interactions = {};

// Create interaction
for (let i = 0; i < 20; i++) {
    var writer = roles["Startups"][Math.floor(Math.random() * roles["Startups"].length)];
    var actor;
    if (i < 4)
        actor = "johnDue";
    else
        actor = roles["Investors"][Math.floor(Math.random() * roles["Investors"].length)];
    var idPicture = Math.floor(Math.random() * 300) + 600;
    var idPicture2 = Math.floor(Math.random() * 300) + 600;
    var interaction = {
        id: i,
        url: `/interaction/${i}`,
        thumbnail: "https://picsum.photos/" + idPicture,
        thumbnail2: "https://picsum.photos/" + idPicture2,
        title: faker.commerce.productName(),
        subtitle: faker.lorem.sentence(),
        writer: writer,
        actor: actor,
        rating: Math.floor(Math.random() * 11),
        funds: Math.floor(Math.random() * 100000)
    }
    investments.push(i);
    interactions[i] = interaction;
    users[writer].projects.push(i);
    users[writer].totalFunds += interaction.funds;
    users[actor].projects.push(i);
    users[actor].totalFunds += interaction.funds;
}

for (let i = 20; i < 40; i++) {
    var writer = roles["Charities"][Math.floor(Math.random() * roles["Charities"].length)];
    var actor = roles["Donators"][Math.floor(Math.random() * roles["Donators"].length)];
    var interaction = {
        id: i,
        thumbnail: faker.image.avatar(),
        title: faker.commerce.productName(),
        subtitle: faker.lorem.sentence(),
        writer: writer,
        actor: actor,
        rating: Math.floor(Math.random() * 11),
        funds: Math.floor(Math.random() * 100000)
    }
    donations.push(i);
    interactions[i] = interaction;
    users[writer].projects.push(i);
    users[writer].totalFunds += interaction.funds;
    users[actor].projects.push(i);
    users[actor].totalFunds += interaction.funds;
}

function interactionSorting(a, b) {
    if (interactions[a].rating < interactions[b].rating) {
        return 1;
    } else if (interactions[a].rating > interactions[b].rating) {
        return -1;
    } else {
        if (interactions[a].funds < interactions[b].funds) {
            return 1;
        } else if (interactions[a].funds > interactions[b].funds) {
            return -1;
        } return 0;
    }
}

function userSorting(a, b) {
    if (users[a].funds < users[b].funds) {
        return 1;
    } else if (users[a].funds > users[b].funds) {
        return -1;
    } else {
        return 0;
    }
}

donations.sort(interactionSorting);
investments.sort(interactionSorting);
for (var i = 0; i < 4; i++)
    roles[ROLES[i]].sort(userSorting);

function getCompanies() {
    return companies.slice();
}

function getInteraction(id) {
    return interactions[id];
}

function getTopInteraction(type, limit) {
    if (type == "Donation")
        return donations.slice(0, limit);
    else
        return investments.slice(0, limit);
}

function getTopUser(type, limit) {
    return roles[type].slice(0, limit);
}


function authenticate(username, password) {
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

function getUser(username) {
    return users[username];
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

function getProjectUser(username) {
    var personal_project = [];
    for (var i = 0; i < users[username].projects.length; i++)
        personal_project.push(interactions[users[username].projects[i]]);
    return personal_project;
}


module.exports = {
    authenticate: authenticate,
    findUser: findUser,
    getInteraction: getInteraction,
    getTopInteraction: getTopInteraction,
    getUser: getUser,
    getTopUser: getTopUser,
    getCompanies: getCompanies,
    getProjectUser: getProjectUser
}

