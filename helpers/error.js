module.exports.handleError = handleError;

function handleError(err, innerErr) {
    if (innerErr.statusCode) {
        return innerErr;
    }

    err.innerError = innerErr;
    return err;
}