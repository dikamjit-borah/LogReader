const path = require('path')
const helperFile = require('../helpers/helper.file')
const basicUtils = require('../utils/basic.utils')
const constants = require('../utils/constants')

module.exports = {
    logView: async function (req, res) {
        try {
            const logFilePath = path.join(__dirname, '../', constants.paths.logFile)

            /*  console.time(constants.events.getLine)
             this.getNthLine(logFilePath, 100000, (err, line)=>{
                 if(err) console.log(err)
                 console.log(line)
             })
             console.timeEnd(constants.events.getLine) */

            console.time(constants.events.readFile)
            basicUtils.getMemoryUsage()
            /* this.getNthLine(logFilePath, 100000, (err, data) => {
                console.log(err)
                console.log(data)
                basicUtils.getMemoryUsage()
            }) */
            const count = await helperFile.countFileLines(logFilePath)
            //if(count>threshold assign to worker)
            console.log(count)
            basicUtils.getMemoryUsage()

            console.timeEnd(constants.events.readFile)
            return basicUtils.generateResponse(res, 200, { 'Content-Type': 'application/json' }, constants.messages.LOG_VIEW_SUCCESS, { data: null })
        } catch (err) {
            console.error(err)
            return basicUtils.generateResponse(res, 500, { 'Content-Type': 'application/json' }, constants.messages.LOG_VIEW_ERR)
        }
    },
}