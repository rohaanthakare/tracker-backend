const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express');

// Application Imports
const routes = require('./routes');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
const port = 4191;
const server = app.listen(port, () => {
    console.log('Connected to Port - ' + port);
});

app.use('/api', routes);

app.use('/', function(req, res) {
    res.send('Invalid Endpoint');
});

