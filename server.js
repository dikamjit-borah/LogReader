const http = require('http');
const url = require('url');
const fs = require('fs');
const PORT = process.env.PORT || 8081

const server = http.createServer((req, res) => {

    const urlparse = url.parse(req.url, true);

    if (urlparse.pathname == '/log/read' && req.method == 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write("Reading log file")
        res.end("Ended reading");
    }
});

server.listen(PORT, () => {
    console.log(`LogReader running on port ${PORT}`);
})