var moment = require('moment');

module.exports.format = format;

function format(date, format) {
    if(!format){
        format = "YYYY-MM-DD HH:mm:ss";
    }
    return moment.utc(date).format(format);
}