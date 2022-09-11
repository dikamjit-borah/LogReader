const url = require('url');
const serviceLogFile = require('../services/service.log-view');
const basicUtils = require('../utils/basic.utils')
const constants = require('../utils/constants')

module.exports = {
    logView: async function (req, res) {
        try {
            const queryObject = url.parse(req.url, true).query;
            const { startDate, endDate, startTS, endTS } = { ...queryObject }

            if (startTS && parseInt(startTS) && endTS && parseInt(endTS)) {
                //if client requests logs for a particular date and time range 
                console.log("client requests logs for a particular date and time range ")
                try {
                    console.time(constants.events.readFile)
                    const result = await serviceLogFile.fetchLogsForDatetimeRange(parseInt(startTS), parseInt(endTS))
                    console.timeEnd(constants.events.readFile)
                    if (result) {
                        if (result[1]) return basicUtils.generateResponse(res, 500, constants.messages.LOG_VIEW_ERR, { error: result[1] })
                        if (result[0] && result[0].length) return basicUtils.generateResponse(res, 200, constants.messages.LOG_VIEW_SUCCESS, { count: result[0].length, logs: result[0] })
                        else return basicUtils.generateResponse(res, 200, constants.messages.LOG_VIEW_NO_DATA)
                    }
                    return basicUtils.generateResponse()
                } catch (error) {
                    return basicUtils.generateResponse(res, 500, constants.messages.LOG_VIEW_ERR, { error: "" + error })
                }
            }

            if (startDate && Date.parse(startDate) && endDate && Date.parse(endDate)) {
                //if client requests logs between two dates
                console.log("client requests logs between two dates")
                try {
                    console.time(constants.events.readFile)
                    const result = await serviceLogFile.fetchLogsForDates(startDate, endDate)
                    console.timeEnd(constants.events.readFile)
                    if (result) {
                        if (result[1]) return basicUtils.generateResponse(res, 500, constants.messages.LOG_VIEW_ERR, { error: result[1] })
                        if (result[0] && result[0].length) return basicUtils.generateResponse(res, 200, constants.messages.LOG_VIEW_SUCCESS, { count: result[0].length, logs: result[0] })
                        else return basicUtils.generateResponse(res, 200, constants.messages.LOG_VIEW_NO_DATA)
                    }
                    return basicUtils.generateResponse()
                } catch (error) {
                    return basicUtils.generateResponse(res, 500, constants.messages.LOG_VIEW_ERR, { error: "" + error })
                }
            }

            if (startDate && Date.parse(startDate)) {
                //if client requests logs for a particular date
                console.log("client requests logs for a particular date");
                try {
                    console.time(constants.events.readFile)
                    const result = await serviceLogFile.fetchLogsForDatetime(startDate)
                    console.timeEnd(constants.events.readFile)
                    if (result) {
                        if (result[1]) return basicUtils.generateResponse(res, 500, constants.messages.LOG_VIEW_ERR, { error: result[1] })
                        if (result[0] && result[0].length) return basicUtils.generateResponse(res, 200, constants.messages.LOG_VIEW_SUCCESS, { count: result[0].length, logs: result[0] })
                        else return basicUtils.generateResponse(res, 200, constants.messages.LOG_VIEW_NO_DATA)
                    }
                    return basicUtils.generateResponse()
                } catch (error) {
                    return basicUtils.generateResponse(res, 500, constants.messages.LOG_VIEW_ERR, { error: "" + error })
                }
            }

            if (startTS && parseInt(startTS)) {
                //if client requests logs for a particular time in a particular date
                console.log("client requests logs for a particular time in a particular date");
                try {
                    const datetimeIso = new Date(parseInt(startTS)).toISOString()
                    console.time(constants.events.readFile)
                    const result = await serviceLogFile.fetchLogsForDatetime(datetimeIso)
                    console.timeEnd(constants.events.readFile)
                    if (result) {
                        if (result[1]) return basicUtils.generateResponse(res, 500, constants.messages.LOG_VIEW_ERR, { error: result[1] })
                        if (result[0] && result[0].length) return basicUtils.generateResponse(res, 200, constants.messages.LOG_VIEW_SUCCESS, { count: result[0].length, logs: result[0] })
                        else return basicUtils.generateResponse(res, 200, constants.messages.LOG_VIEW_NO_DATA)
                    }
                    return basicUtils.generateResponse()
                } catch (error) {
                    return basicUtils.generateResponse(res, 500, constants.messages.LOG_VIEW_ERR, { error: "" + error })
                }
            }

            return basicUtils.generateResponse(res, 200, constants.messages.LOG_VIEW_FAIL)
        } catch (error) {
            return basicUtils.generateResponse(res, 500, constants.messages.LOG_VIEW_ERR, { error: "" + error })
        }
    },
}


