
module.exports.formatClientData = formatClientData;
module.exports.transportJsonFormatter = transportJsonFormatter;

function formatClientData(req) {
    return {
        remoteAddress: req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress,
        acceptLanguage: req.headers["Accept-Language"],
        userAgent: req.headers["User-Agent"],
    }
}

function transportJsonFormatter(options) {
    return JSON.stringify({
        timestamp: dateHelper.format(Date.now()),
        level: options.level.toUpperCase(),
        statusCode: options.meta.error != null ? options.meta.error.statusCode : null,
        message: options.message || '',
        metadata: options.meta
    }) + ",";
}