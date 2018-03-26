var express = require('express');
var path = require('path');

/**
 * Register static libraries
 * @param {express} app 
 */
module.exports = function (app) {
    app.use('/bootstrap/js', express.static(path.join(__dirname, '../node_modules/bootstrap/dist/js')));
    app.use('/bootstrap/css', express.static(path.join(__dirname, '../node_modules/bootstrap/dist/css')));
    app.use('/jquery', express.static(path.join(__dirname, '../node_modules/jquery/dist')));
};
