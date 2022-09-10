const fs = require('fs')
const path = require('path')
const readline = require('readline')

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
            const count = await this.countFileLines(logFilePath)
            console.log(count)
            basicUtils.getMemoryUsage()

            console.timeEnd(constants.events.readFile)


            return basicUtils.generateResponse(res, 200, { 'Content-Type': 'application/json' }, constants.messages.LOG_VIEW_SUCCESS, { data: null })
        } catch (err) {
            console.error(err)
            return basicUtils.generateResponse(res, 500, { 'Content-Type': 'application/json' }, constants.messages.LOG_VIEW_ERR)
        }
    },

    readLogFile: async function (logFilePath) {
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


                //if startdate 
                //if enddate
                //if either start or end date present show logs of only that date
                //push to log arraylisst lines having the datestamp
                //in api response send in paginated manner - nextPagePresent:true

                //if startdate + enddate
                //if no date

                if (line && line.includes("2020-01-18T07")) {
                    logs.push(line)
                }
            })
            rl.on('close', function () {
                resolve(logs)
            })

        })
    },

    getNthLine: async function (logFilePath, line_no, cb) {
        var stream = fs.createReadStream(logFilePath, {
            flags: 'r',
            encoding: 'utf-8',
            fd: null,
            mode: '0666',
            bufferSize: 64 * 1024
        })

        var fileData = ''
        stream.on('data', function (data) {
            fileData += data

            var lines = fileData.split('\n')

            if (lines.length >= +line_no) {
                stream.destroy()
                cb(null, lines[+line_no])
            }
            // Add this else condition to remove all unnecesary data from the variable
            else
                fileData = Array(lines.length).join('\n')

        })

        stream.on('error', function () {
            console.log("sfsfsfs")
            cb('Error', null)
        })

        stream.on('end', function () {
            console.log("fucckk")
            cb('File end reached without finding line', null)
        })
    },


    readFileSync: async function (logFilePath) {
        return new Promise((resolve, reject) => {
            const data = fs.readFileSync(logFilePath,
                { encoding: 'utf8', flag: 'r' })
            resolve(data)
        })


        // Display the file data
        //console.log(data)
    },

    countFileLines: async function(filePath){
        return new Promise((resolve, reject) => {
        let lineCount = 0
        fs.createReadStream(filePath)
          .on("data", (buffer) => {
            let idx = -1
            lineCount--
            do {
              idx = buffer.indexOf(10, idx+1)
              lineCount++
            } while (idx !== -1)
          }).on("end", () => {
            resolve(lineCount)
          }).on("error", reject)
        })
      }
    /* let data
           await readStream.pipe(data)
           const data = fs.readFileSync(logFilePath, 'utf8') 
           
               readStream.on('data', (chunk) => {
               console.log(chunk)
               console.log("\n")
           }) */
}