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

    getMemoryUsage: function () {
        const formatMemoryUsage = (data) => `${Math.round(data / 1024 / 1024 * 100) / 100} MB`
        const memoryData = process.memoryUsage()

        const memoryUsage = {
            rss: `${formatMemoryUsage(memoryData.rss)} -> Resident Set Size - total memory allocated for the process execution`,
            heapTotal: `${formatMemoryUsage(memoryData.heapTotal)} -> total size of the allocated heap`,
            heapUsed: `${formatMemoryUsage(memoryData.heapUsed)} -> actual memory used during the execution`,
            external: `${formatMemoryUsage(memoryData.external)} -> V8 external memory`,
        }
        console.log(memoryUsage)
    }
}