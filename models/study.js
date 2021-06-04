var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var studySchema = new Schema({
    name: { type : String, required: true},
    country: { type : String, required: true},
    result: { type : Number, required: true},
    dna: [{ type : String}],

    date : { type: Date, default: Date.now}

});
        

module.exports = mongoose.model('Study', studySchema);
