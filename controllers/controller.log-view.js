const fs = require('fs');
const path = require('path');
const basicUtils = require('../utils/basic.utils');
const constants = require('../utils/constants');

module.exports = {
    logView: async function (req, res) {
        try {
            const logFilePath = path.join(__dirname, '../', constants.paths.logFile)
            const readStream = fs.createReadStream(logFilePath, {
                flag: 'a+',
                encoding: 'UTF-8',
                highWaterMark: 24
            })
            readStream.on('data', (chunk) => {
                console.log(chunk);
                console.log("\n");
            })
            /* let data
            await readStream.pipe(data)
            const data = fs.readFileSync(logFilePath, 'utf8'); */
            return basicUtils.generateResponse(res, 200, { 'Content-Type': 'application/json' }, constants.messages.LOG_VIEW_SUCCESS)
        } catch (err) {
            console.error(err);
            return basicUtils.generateResponse(res, 500, { 'Content-Type': 'application/json' }, constants.messages.LOG_VIEW_ERR)
        }
    }
}