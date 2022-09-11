const path = require('path')
const fs = require('fs')
const readline = require('readline')
const constants = require('../utils/constants')
const logFilePath = path.join(__dirname, '../', constants.paths.logFile)

module.exports = {
    fetchLogsForDate: function (date) {
        return new Promise((resolve, reject) => {
            const readStream = fs.createReadStream(logFilePath, {
                flag: 'a+',
                encoding: 'UTF-8',
                highWaterMark: 24,
                bufferSize: 64 * 1024
            })

            const rl = readline.createInterface(readStream)
            let logs = []

            rl.on('line', function (line) {
                if (line && line.includes(date)) {
                    logs.push(line)
                }
            })

            rl.on('close', function () {
                resolve(logs)
            })
        })
    }
}