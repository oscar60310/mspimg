var express = require('express');
var http = require('http');
var image = require('./image');
var app = express();
var port = process.env.port || 1337;
app.post('/image',image.web);
http.createServer(app).listen(port);