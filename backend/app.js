"use strict";

const express = require('express');
const app = express();
const http = require('http');

const port = 8081;
http.createServer(app).listen(port);
console.log('Rest Demo Listening on port', port);


// CORS
app.use(function(req, res, next) {
  	res.header("Access-Control-Allow-Origin", "*");
  	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  	return next();
});

// standard routes
app.use(express.static('public'));
app.use('/facebook_connect', require('./routes/facebook_connect'));
app.use('/recs', require('./routes/recs'));
app.use('/like', require('./routes/like'));
app.use('/superLike', require('./routes/superLike'));
app.use('/pass', require('./routes/pass'));

// Register  handler for caught error
app.use(function(err, req, res, next) {
    console.error(err.stack || err);
    res.status(err.status || 500).send(err);
});