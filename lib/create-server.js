'use strict';

const http = require('http');
const path = require('path');
const url = require('url');
const fs = require('fs');
const port = process.argv[2] || 3000;

http.createServer(function(req, res) {
    const uri = url.parse(req.url).pathname
    const filename = path.join(process.cwd(), uri);
    const contentTypesByExtension = {
        '.html': 'text/html',
        '.css':  'text/css',
    };

    fs.exists(filename, function(exists) {
        if(!exists) {
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.write('<!DOCTYPE html><html lang="en-US"><head><meta charset="UTF-8">'
            + '<meta description="Simple server created using node.js.">'
            + '<link rel="stylesheet" type="text/css" href="./app/style.css"/>'
            + '<link rel="icon" href="./app/favicon.png" sizes="16x16" type="image/png">'
            + '<title>A Simple Node Server</title></head><body><div><h1>404, Page not found.</h1><br>'
            + '<a href=".">Return home.</a><br><div></body></html>');
            res.end();
            return;
        }

        if (fs.statSync(filename).isDirectory()) filename += './app/index.html';

        fs.readFile(filename, 'binary', function(err, file) {
            if(err) {
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
}).listen(parseInt(port, 10));
