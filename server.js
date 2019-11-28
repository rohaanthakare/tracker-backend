const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express');

// Application Imports
const config = require('./configs/global.config');
const routes = require('./routes');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
const port = process.env.PORT || 4191;
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

