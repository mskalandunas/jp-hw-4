'use strict';

const http = require('http');
const path = require('path');
const url = require('url');
const fs = require('fs');
const html = require(`${__dirname}/html.json`);
const port = process.argv[2] || 3000;

http.createServer((req, res) => {
    const uri = url.parse(req.url).pathname
    const filename = path.join(process.cwd(), uri);
    const contentTypesByExtension = {
        '.html': 'text/html'
    };

    fs.exists(filename, (exists) => {
        if (!exists) {
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.write(JSON.stringify(html['404']));
            res.end();
            return;
        }

        if (fs.statSync(filename).isDirectory()) {
            filename += './app/index.html';
        }

        fs.readFile(filename, 'binary', (err, file) => {
            if (err) {
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.write(err + '\n');
                res.end();
                return;
            }

            const headers = {};
            const contentType = contentTypesByExtension[path.extname(filename)];

            if (contentType) {
                headers['Content-Type'] = contentType;
            }

            res.writeHead(200, headers);
            res.write(file, 'binary');
            res.end();
        });
    });
}).listen(parseInt(port, 10), () => {
    console.log(`Listening at ${port}.`);
});
