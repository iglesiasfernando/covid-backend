var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var winston = require('winston-levelonly');
var http = require('http');

var config = require('./config').get(process.env.NODE_ENV);
var dateHelper = require('./helpers/date');
var logHelper = require('./helpers/log');


// DATABASE  -------------------------------------------------- //
var mongoose = require('mongoose');
mongoose.connect(config.database.connectionstring, { useMongoClient: true });


// REQUEST SETTINGS  ------------------------------------------ //
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser.json());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With,responseType , Content-Type, Accept");
    
    return next();
});

// PORT ------------------------------------------------------- //
var port = process.env.PORT || config.port;
var server = http.Server(app);
server.listen(port);
console.log("Listening on port: " + port);


app.use('/covid', require('./routes/covid'));

// ERROR HANDLING --------------------------------------------- //
app.use(errorHandler);

// ERROR LOGGING --------------------------------------------- //
var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.File)({
            name: 'error-file',
            filename: './logs/filelog-error.json',
            level: 'error',
            levelOnly: true,
            json: false,
            formatter: logHelper.transportJsonFormatter
        }),
        new (winston.transports.File)({
            name: 'warn-file',
            filename: './logs/filelog-warn.json',
            level: 'warn',
            levelOnly: true,
            json: false,
            formatter: logHelper.transportJsonFormatter
        }),
        new (winston.transports.Console)({ name: "console-info", level: 'info', levelOnly: true }),
        new (winston.transports.Console)({ name: "console-silly", level: 'silly', levelOnly: true }),
        new (winston.transports.Console)({ name: "console-debug", level: 'debug', levelOnly: true }),
        new (winston.transports.Console)({ name: "console-verbose", level: 'verbose', levelOnly: true })
    ]
});

// FUNCTIONS -------------------------------------------------- //
function errorHandler(err, req, res, next) {

    logger.log((err.level || "error"), err.message, { headers: logHelper.formatClientData(req), error: err, stackTrace: err.stack });

    if (err.statusCode) {
        res.status(err.statusCode).json({ error: err, stackTrace: err.stack });
    } else {
        res.status(500).json({ message: "Unexpected (but handled) error: " + err.message, stackTrace: err.stack });
    }
}
