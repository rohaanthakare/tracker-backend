const mongoose = require('mongoose');
const express = require('express');

// Application Imports
const config = require('./configs/global.config');
const routes = require('./routes');

const app = express();

const port = 4000;
const server = app.listen(port, () => {
    console.log('Connected to Port - ' + port);
});

// Connect to Database
mongoose.connect(config.database);
mongoose.connection.on('connected', () => {
    console.log('Connected to Database - ' + config.database);
});

mongoose.connection.on('error', () => {
    console.log('Error while connecting to Database - ' + config.database);
});

app.use('/api', routes);

app.use('/', function(req, res) {
    res.send('Invalid Endpoint');
});

