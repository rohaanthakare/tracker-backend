const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const Agenda = require('agenda');

// Application Imports
const config = require('./configs/global.config');
const routes = require('./routes');
const ROUTES_WIHTOUT_AUTH = require('./routes').ROUTES_WIHTOUT_AUTH;
const TrackerMailer = require('./modules/global/trackermailer.service');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
const port = process.env.PORT || 4191;
const server = app.listen(port, () => {
    console.log('Connected to Port - ' + port);
});

// Connect to Database
mongoose.set('debug', true);
mongoose.connect(config.database);
mongoose.connection.on('connected', () => {
    console.log('Connected to Database - ' + config.database);
    agenda = new Agenda({
        db: {
            address: config.database
        }
    });

    require('./agenda.sch');
});

mongoose.connection.on('error', () => {
    console.log('Error while connecting to Database - ' + config.database);
});

app.use("/api/bank-logo", express.static(path.join(__dirname, 'public/bank_logos')));
app.use("/mailImage", express.static(path.join(__dirname, 'public/images')));

app.use(function (req, res, next) {  
    if(ROUTES_WIHTOUT_AUTH.includes(req.originalUrl) || ROUTES_WIHTOUT_AUTH.includes(req._parsedUrl['pathname'])) {
        console.log('----Auth not required----');
        next();
    } else {
        let token = req.headers['authorization'];
        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
        }

        if (token) {
            jwt.verify(token, config.token_secret, (err, decoded) => {
                if (err) {
                    return res.status(403).json({
                        status: false,
                        message: 'Token is invalid'
                    });
                } else {
                    req.current_user = decoded;
                    next();
                }
            });
            app.use('/api', routes);
        } else {
            return res.json({
                status: false,
                message: 'Auth token in not supplied'
            });
        }
    }
});

app.use('/api', routes);

app.use('/', function(req, res) {
    res.status(404).send('Invalid Endpoint');
});

