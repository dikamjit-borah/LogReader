const url = require('url');
const helperFile = require('../helpers/helper.file');
const { fetchLogsInRange } = require('../services/service.log-file');
const serviceLogFile = require('../services/service.log-file');
const basicUtils = require('../utils/basic.utils')
const constants = require('../utils/constants')

module.exports = {
    logView: async function (req, res) {
        try {
            const queryObject = url.parse(req.url, true).query;
            const { startDate, endDate, startTS, endTS } = { ...queryObject }

            if (startTS && Date.parse(startTS) && endTS && Date.parse(endTS)) {
                //if client requests logs for a particular date and time range 
            }

            if (startDate && Date.parse(startDate) && endDate && Date.parse(endDate)) {
                //if client requests logs between two dates
                console.log("client requests logs between two dates");
                console.time(constants.events.readFile)
                const result = await serviceLogFile.fetchLogsForDate(startDate, endDate)
                console.timeEnd(constants.events.readFile)
                if (result && result.length) return basicUtils.generateResponse(res, 200, { 'Content-Type': 'application/json' }, constants.messages.LOG_VIEW_SUCCESS, { count: result.length, logs: result })
                else return basicUtils.generateResponse(res, 200, { 'Content-Type': 'application/json' }, constants.messages.LOG_VIEW_NO_DATA)
            }

            if (startDate && Date.parse(startDate)) {
                //if client requests logs for a particular date
                console.log("client requests logs for a particular date");
                console.time(constants.events.readFile)
                const result = await serviceLogFile.fetchLogsForDate(startDate)
                console.timeEnd(constants.events.readFile)
                if (result && result.length) return basicUtils.generateResponse(res, 200, { 'Content-Type': 'application/json' }, constants.messages.LOG_VIEW_SUCCESS, { count: result.length, logs: result })
                else return basicUtils.generateResponse(res, 200, { 'Content-Type': 'application/json' }, constants.messages.LOG_VIEW_NO_DATA)
            }

            if (startTS && parseInt(startTS)) {
                //if client requests logs for a particular time in a particular date
                console.log("client requests logs for a particular time in a particular date");
                const datetimeIso = new Date(parseInt(startTS)).toISOString()
                console.time(constants.events.readFile)
                const result = await serviceLogFile.fetchLogsForDate(datetimeIso)
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


