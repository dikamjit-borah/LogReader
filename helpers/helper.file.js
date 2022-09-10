const fs = require('fs')
const readline = require('readline')

module.exports = {

    readLogFile: async function (filePath) {
        return new Promise((resolve, reject) => {


            const readStream = fs.createReadStream(filePath, {
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

    getNthLine: async function (filePath, line_no, cb) {
        var stream = fs.createReadStream(filePath, {
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


    readFileSync: async function (filePath) {
        return new Promise((resolve, reject) => {
            const data = fs.readFileSync(filePath,
                { encoding: 'utf8', flag: 'r' })
            resolve(data)
        })


        // Display the file data
        //console.log(data)
    },

    countFileLines: async function (filePath) {
        return new Promise((resolve, reject) => {
            let lineCount = 0
            fs.createReadStream(filePath)
                .on("data", (buffer) => {
                    let idx = -1
                    lineCount--
                    do {
                        idx = buffer.indexOf(10, idx + 1)
                        lineCount++
                    } while (idx !== -1)
                }).on("end", () => {
                    resolve(lineCount)
                }).on("error", reject)
        })
    }
    /* let data
           await readStream.pipe(data)
           const data = fs.readFileSync(filePath, 'utf8') 
           
               readStream.on('data', (chunk) => {
               console.log(chunk)
               console.log("\n")
           }) */
}