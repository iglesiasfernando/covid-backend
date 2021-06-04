var error = require('throw.js');
var studyModel = require('../models/study');
var errorHelper = require('../helpers/error');
const { groupBy } = require('lodash');
var config = require('../config').get(process.env.NODE_ENV);

module.exports.insert = insert;
module.exports.getAll = getAll;
module.exports.getStats = getStats;
module.exports.getByKey = getByKey;




function insert(study, callback) {
    studyModel.create(study, function (err, result) {
        if (err) {
            if (err.name === 'MongoError' && err.code === 11000)
                return callback(errorHelper.handleError(new error.BadRequest("Identificador must be unique."), err));
            if (err.name === 'ValidationError')
                return callback(errorHelper.handleError(new error.BadRequest("Validation error"), err));

            return callback(errorHelper.handleError(new error.InternalServerError("Unexpected Mongoose error while creating a new study"), err));
        }

        return callback(null, result);
    });

    }

    function getStats(resultStudy,callback) {
        studyModel.count({ "result" : resultStudy}).exec(function (err, result) {
            if (err) {
                return callback(errorHelper.handleError(new error.InternalServerError("Unexpected Mongoose error while retreaving studies"), err));
            }
            return callback(null, result);
        });
    }
    function getByKey(keyElement,searchArray,callback) {
        var obj = {};
        obj[keyElement] = searchArray;
        studyModel.find(obj).exec(function (err, result) {
            if (err) {
                return callback(errorHelper.handleError(new error.InternalServerError("Unexpected Mongoose error while retreaving studies"), err));
            }
            return callback(null, result);
        });
    
    }
    
    function getAll(callback) {
        studyModel.find().exec(function (err, result) {
            if (err) {
                return callback(errorHelper.handleError(new error.InternalServerError("Unexpected Mongoose error while retreaving studies"), err));
            }
            return callback(null, result);
        });
    
    }