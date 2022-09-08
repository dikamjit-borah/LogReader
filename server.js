const http = require('http');
const url = require('url');
const constants = require('./utils/constants');
const controllerLogView = require('./controllers/controller.log-view');

const PORT = process.env.PORT || 8081

const server = http.createServer((req, res) => {
    const urlparse = url.parse(req.url, true);

    if (urlparse.pathname == constants.endpoints.logView && req.method == 'GET') {
        return controllerLogView.logView(req, res)
    }
})

server.listen(PORT, () => {
    console.log(`LogReader running on port ${PORT}`);
})