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
                console.time(constants.events.readFile)
                const result = await serviceLogFile.fetchLogsForDatetimeRange(parseInt(startTS), parseInt(endTS))
                console.timeEnd(constants.events.readFile)
                if (result && result.length) return basicUtils.generateResponse(res, 200, { 'Content-Type': 'application/json' }, constants.messages.LOG_VIEW_SUCCESS, { count: result.length, logs: result })
                else return basicUtils.generateResponse(res, 200, { 'Content-Type': 'application/json' }, constants.messages.LOG_VIEW_NO_DATA)
            }

            if (startDate && Date.parse(startDate) && endDate && Date.parse(endDate)) {
                //if client requests logs between two dates
                console.log("client requests logs between two dates")
                console.time(constants.events.readFile)
                const result = await serviceLogFile.fetchLogsForDates(startDate, endDate)
                console.timeEnd(constants.events.readFile)
                if (result && result.length) return basicUtils.generateResponse(res, 200, { 'Content-Type': 'application/json' }, constants.messages.LOG_VIEW_SUCCESS, { count: result.length, logs: result })
                else return basicUtils.generateResponse(res, 200, { 'Content-Type': 'application/json' }, constants.messages.LOG_VIEW_NO_DATA)
            }

            if (startDate && Date.parse(startDate)) {
                //if client requests logs for a particular date
                console.log("client requests logs for a particular date");
                console.time(constants.events.readFile)
                const result = await serviceLogFile.fetchLogsForDates(startDate)
                console.timeEnd(constants.events.readFile)
                if (result && result.length) return basicUtils.generateResponse(res, 200, { 'Content-Type': 'application/json' }, constants.messages.LOG_VIEW_SUCCESS, { count: result.length, logs: result })
                else return basicUtils.generateResponse(res, 200, { 'Content-Type': 'application/json' }, constants.messages.LOG_VIEW_NO_DATA)
            }

            if (startTS && parseInt(startTS)) {
                //if client requests logs for a particular time in a particular date
                console.log("client requests logs for a particular time in a particular date");
                const datetimeIso = new Date(parseInt(startTS)).toISOString()
                console.time(constants.events.readFile)
                const result = await serviceLogFile.fetchLogsForDates(datetimeIso)
                console.timeEnd(constants.events.readFile)
                if (result && result.length) return basicUtils.generateResponse(res, 200, { 'Content-Type': 'application/json' }, constants.messages.LOG_VIEW_SUCCESS, { count: result.length, logs: result })
                else return basicUtils.generateResponse(res, 200, { 'Content-Type': 'application/json' }, constants.messages.LOG_VIEW_NO_DATA)
            }

            return basicUtils.generateResponse(res, 200, { 'Content-Type': 'application/json' }, constants.messages.LOG_VIEW_FAIL)
        } catch (err) {
            console.error(err)
            return basicUtils.generateResponse(res, 500, { 'Content-Type': 'application/json' }, constants.messages.LOG_VIEW_ERR)
        }
    },
}


