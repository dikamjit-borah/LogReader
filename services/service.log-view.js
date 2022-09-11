const path = require('path')
const fs = require('fs')
const readline = require('readline')
const constants = require('../utils/constants')
const config = require('../config/config')
const logFilePath = path.join(__dirname, '../', constants.paths.logFile)

module.exports = {

    fetchLogsForDatetimeRange: async function (startTS, endTS) {
        if (!fs.existsSync(logFilePath)) {
            return ([null, constants.messages.LOG_FILE_NOT_EXIST])
        }
        const startDatetime = new Date(startTS)
        const endDatetime = new Date(endTS)

        return new Promise((resolve, reject) => {

            const readStream = fs.createReadStream(logFilePath, config.readstreamConfig)

            const rl = readline.createInterface(readStream)
            let logs = []

            rl.on('line', async function (line) {
                let logDatetime = new Date(line.split(' ')[0])

                let startDatetimeDiff = logDatetime - startDatetime
                let endDatetimeDiff = logDatetime - endDatetime

                if (startDatetimeDiff >= 0 && endDatetimeDiff <= 0) {
                    logs.push(line)
                }

                else if (startDatetime < 0 || endDatetimeDiff > 0) {
                    rl.close()
                    readStream.destroy()
                    resolve([logs, null])
                }
            })

            rl.on('close', function () {
                resolve([logs, null])
            })

            readStream.on('error', function (err) {
                console.log(err);
                reject([null, "" + err])
            })
        })
    },

    fetchLogsForDates: async function (searchParamStart, searchParamEnd) {
        if (!fs.existsSync(logFilePath)) {
            return ([null, constants.messages.LOG_FILE_NOT_EXIST])
        }

        return new Promise((resolve, reject) => {
            const readStream = fs.createReadStream(logFilePath, config.readstreamConfig)

            const rl = readline.createInterface(readStream)
            let logs = []
            let lineCount = 0
            let lineStartIndex = 0
            let lineEndIndex = 0

            rl.on('line', async function (line) {
                if (searchParamStart && searchParamEnd && searchParamStart != searchParamEnd) {
                    if (line) {
                        if (!lineStartIndex && line.includes(searchParamStart)) {
                            lineStartIndex = lineCount
                        }

                        lineCount++

                        if (line.includes(searchParamEnd)) {
                            lineEndIndex = lineCount
                            readStream.destroy()
                            logs = await module.exports.fetchLogsInRowRange(lineStartIndex, lineEndIndex)
                            if (logs) {
                                if (logs[1]) reject(logs[1])
                                if (logs[0] && logs[0].length) resolve([logs[0], null])
                            }
                            reject([null, constants.messages.SMTHNG_WRNG])
                        }

                    }
                }

            })

            readStream.on('end', async function () {
                lineEndIndex = lineCount
                logs = await module.exports.fetchLogsInRowRange(lineStartIndex, lineEndIndex)
                if (logs) {
                    if (logs[1]) reject(logs[1])
                    if (logs[0] && logs[0].length) resolve([logs[0], null])//if both start and end date are present but the end date is not found (eof reached) resolve in 'end' event of readstream
                }
                reject([null, constants.messages.SMTHNG_WRNG])
            })

            rl.on('close', function () {
                if (!searchParamEnd) resolve([logs, null]) //if only logs of a single date required resolve here else in readstream's end event
            })

            readStream.on('error', function (err) {
                console.log(err);
                reject([null, "" + err])
            })
        })
    },

    fetchLogsForDatetime: async function (searchParam) {
        if (!fs.existsSync(logFilePath)) {
            return ([null, constants.messages.LOG_FILE_NOT_EXIST])
        }

        return new Promise((resolve, reject) => {
            const readStream = fs.createReadStream(logFilePath, config.readstreamConfig)

            const rl = readline.createInterface(readStream)
            let logs = []

            rl.on('line', async function (line) {
                if (line && line.includes(searchParam)) {
                    logs.push(line)
                }
            })

            rl.on('close', function () {
                resolve([logs, null])
            })

            readStream.on('error', function (err) {
                console.log(err);
                reject([null, "" + err])
            })
        })
    },

    fetchLogsInRowRange: async function (startRow, endRow) {
        if (!fs.existsSync(logFilePath)) {
            return ([null, constants.messages.LOG_FILE_NOT_EXIST])
        }

        return new Promise((resolve, reject) => {
            const readStream = fs.createReadStream(logFilePath, config.readstreamConfig)
            let logs = []
            let lineCount = 0
            const rl = readline.createInterface(readStream)
            rl.on('line', function (line) {
                if (line) {
                    if (lineCount >= startRow && lineCount <= endRow) {
                        logs.push(line)
                    }
                    if (lineCount > endRow) {
                        rl.close()
                        readStream.destroy()
                        resolve([logs, null])
                    }
                    lineCount++
                }
            })

            rl.on('close', function () {
                resolve([logs, null])
            })

            readStream.on('error', function (err) {
                console.log(err);
                reject([null, "" + err])
            })

        })
    }
}