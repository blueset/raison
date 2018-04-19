var express = require('express');
var router = express.Router();

var db = require('../models/db');

/* GET home page. */

function createAuthorCard(interaction) {
  var writer = db.getUser(interaction.writer);
  var author = {
      id: interaction.id,
      image: interaction.thumbnail,
      title: interaction.title,
      author: {
        name: writer.name,
        avatar: writer.image
      }
  }

  return author;
}

router.get('/', function(req, res, next) {
  res.locals.interactions = db.getTopInteraction("Investment", 5);
  res.locals.donators = db.getTopUser("Donators", 8);
  res.locals.companies = db.getCompanies();
  //console.log(res.locals.companies);
  res.locals.authors = [];
  for (var i = 0; i < res.locals.interactions.length; i++)
    res.locals.authors.push(createAuthorCard(db.getInteraction(res.locals.interactions[i])));

  for (var i = 0; i < res.locals.donators.length; i++)
      res.locals.donators[i] = db.getUser(res.locals.donators[i]);

  for (var i = 0; i < res.locals.companies.length; i++)
      res.locals.companies[i] = db.getUser(res.locals.companies[i]);


  res.locals.user = req.user;
  res.render('landing/landing', { title: 'Raison — Connecting Investors, Startups, Donators & Charities.' });
});

router.get('/search', function (req, res, next) {
  res.render('search', { title: 'Search — Raison' });
});

module.exports = router;
