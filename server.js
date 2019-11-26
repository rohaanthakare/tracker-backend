const mongoose = require('mongoose');
const express = require('express');

// Application Imports
const routes = require('./routes');

const app = express();

const port = 4000;
const server = app.listen(port, () => {
    console.log('Connected to Port - ' + port);
});

app.use('/api', routes);

app.use('/', function(req, res) {
    res.send('Invalid Endpoint');
});

