const path = require('path')
const fs = require('fs')
const readline = require('readline')
const constants = require('../utils/constants')
const logFilePath = path.join(__dirname, '../', constants.paths.logFile)

module.exports = {
    fetchLogsForDate: async function (searchParamStart, searchParamEnd) {
        console.log(searchParamStart)
        console.log(searchParamEnd)
        return new Promise((resolve, reject) => {
            const readStream = fs.createReadStream(logFilePath, {
                flag: 'a+',
                encoding: 'UTF-8',
                highWaterMark: 24,
                bufferSize: 64 * 1024,
            })

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
                            logs = await module.exports.fetchLogsInRange(lineStartIndex, lineEndIndex)
                            resolve(logs)
                        }
                    }
                }

                else if (line && line.includes(searchParamStart)) {
                    logs.push(line)
                }
            })

            rl.on('close', function () {
                resolve(logs)
            })
        })
    },

    fetchLogsForDatetimeRange: async function (startTS, endTS) {

        const startDatetime = new Date(startTS)
        const endDatetime = new Date(endTS)
        console.log(startDatetime)
        console.log(endDatetime)
        return new Promise((resolve, reject) => {
            const readStream = fs.createReadStream(logFilePath, {
                flag: 'a+',
                encoding: 'UTF-8',
                highWaterMark: 24,
                bufferSize: 64 * 1024,
            })

            const rl = readline.createInterface(readStream)
            let logs = []

            rl.on('line', async function (line) {
                let logDatetime = new Date(line.split(' ')[0])
                // console.log(logDatetime);

                let startDatetimeDiff = logDatetime - startDatetime
                let endDatetimeDiff = logDatetime - endDatetime
                console.log(startDatetimeDiff, endDatetimeDiff);
                if (startDatetimeDiff >= 0 && endDatetimeDiff <= 0) {
                    logs.push(line)
                }

                else if (startDatetime < 0 || endDatetimeDiff > 0) {
                    rl.close()
                    readStream.destroy()
                    resolve(logs)
                }
            })

            rl.on('close', function () {
                resolve(logs)
            })
        })
    },

    fetchLogsInRange: async function (startRow, endRow) {
        console.log(startRow)
        console.log(endRow)
        return new Promise((resolve, reject) => {
            const readStream = fs.createReadStream(logFilePath, {
                flag: 'a+',
                encoding: 'UTF-8',
                highWaterMark: 24,
                bufferSize: 64 * 1024,
            })
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
                        resolve(logs)
                    }
                    lineCount++
                }
            })
            rl.on('close', function () {
                resolve(logs)
            })
        })
    }
}