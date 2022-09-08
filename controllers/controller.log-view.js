const fs = require('fs');
const path = require('path');
const basicUtils = require('../utils/basic.utils');
const constants = require('../utils/constants');

module.exports = {
    logView: function (req, res) {
        try {
            const logFilePath = path.join(__dirname, '../', constants.paths.logFile)
            const data = fs.readFileSync(logFilePath, 'utf8');
            return basicUtils.generateResponse(res, 200, { 'Content-Type': 'application/json' }, constants.messages.LOG_VIEW_SUCCESS)
        } catch (err) {
            console.error(err);
            return basicUtils.generateResponse(res, 500, { 'Content-Type': 'application/json' }, constants.messages.LOG_VIEW_ERR)
        }
    }
}