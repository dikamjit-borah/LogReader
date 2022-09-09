const fs = require('fs');
const path = require('path');
const readline = require('readline');
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
            /* readStream.on('data', (chunk) => {
                console.log(chunk);
                console.log("\n");
            }) */

            const result = await new Promise((resolve, reject) => {
                const rl = readline.createInterface(readStream);
                let logs = [];
                //const regEx = new RegExp(text, "i")
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
                        console.log(line);

                    }
                });
                rl.on('close', function () {
                    console.log('finished search')
                    resolve(logs)
                });
            })

            /* let data
            await readStream.pipe(data)
            const data = fs.readFileSync(logFilePath, 'utf8'); */
            return basicUtils.generateResponse(res, 200, { 'Content-Type': 'application/json' }, constants.messages.LOG_VIEW_SUCCESS, { data: result })
        } catch (err) {
            console.error(err);
            return basicUtils.generateResponse(res, 500, { 'Content-Type': 'application/json' }, constants.messages.LOG_VIEW_ERR)
        }
    }
}