const mongoose = require('mongoose');
const express = require('express');
const routes = require('./routes');

const app = express();

const port = 4000;
const server = app.listen(port, () => {
    console.log('Connected to Port - ' + port);
});

app.use('/', routes);