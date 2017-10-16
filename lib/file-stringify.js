'use strict';

const fs = require('fs');

function stringifyFileContents(file = process.argv[2]) {
    fs.readFile(file, (e, data) => {
        if (e) {
            throw e;
        }

        return data.toString();
    });
}

module.exports = stringifyFileContents;
