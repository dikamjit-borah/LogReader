const constants = require("./constants")

module.exports = {
    generateResponse: function (res, statusCode, headers, message, fields) {
        let response = {
            statusCode: 500,
            message: constants.messages.SMTHNG_WRNG,
        }
        if (statusCode) response.statusCode = statusCode
        if (message) response.message = message
        if (fields) {
            response['data'] = fields
        }

        res.writeHead(statusCode ? statusCode : 500, headers)
        res.write(JSON.stringify(response))
        res.end()
        return
    },
}