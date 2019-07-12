var express = require('express');
var bodyParser = require('body-parser');
var mainController = require('./controllers/main.js')
var app = express();
var server = require('http').createServer(app);


app.set('view engine', 'ejs'); //Sets up EJS view engine template
app.use(express.static('./public')); //Static files/routing
app.use(bodyParser.json());



mainController(app, server); //Fires main.js controller


server.listen(3000);
