const http = require('http');
const fs = require('fs');
const url = require('url');
const { join } = require('path');
const constants = require('./utils/constants');
const basicUtils = require('./utils/basic.utils');

const PORT = process.env.PORT || 8081

const server = http.createServer((req, res) => {
    const urlparse = url.parse(req.url, true);

    if (urlparse.pathname == constants.endpoints.logView && req.method == 'GET') {
        try {
            const data = fs.readFileSync(__dirname + join(constants.paths.logFile), 'utf8');
            console.log(data);
            return basicUtils.generateResponse(res, 200, { 'Content-Type': 'application/json' }, constants.messages.LOG_VIEW_SUCCESS)
        } catch (err) {
            console.error(err);
            return basicUtils.generateResponse(res, 200, { 'Content-Type': 'application/json' }, constants.messages.LOG_VIEW_ERR)
        }
    }
});

server.listen(PORT, () => {
    console.log(`LogReader running on port ${PORT}`);
})