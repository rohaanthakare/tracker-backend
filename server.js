const mongoose = require('mongoose');
const express = require('express');
const routes = require('./routes');

const app = express();
mongoose.connect('mongodb://localhost:27017/tracker', {
    useNewUrlParser: true
}).then(() => {
    console.log('Connected to Tracker Database');
}, error => {
    console.log('Error while connection to Tracker Database');
});

const port = 4000;
const server = app.listen(port, () => {
    console.log('Connected to Port - ' + port);
});

app.use('/', routes);