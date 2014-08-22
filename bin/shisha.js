#!/usr/bin/env node
'use strict';

var argv = require('yargs').argv;
var colors = require('colors');

var shisha = require('./../src/index');

var ph = {};

for (var placeholder in argv) {
    ph[placeholder] = argv[placeholder];
}

colors.setTheme({
    info: 'green',
    error: 'red'
});

shisha.use(argv.directory || process.cwd(), ph);
try {
    var exitStatus = 0;

    shisha.smoke(function(report) {
        for(var url in report) {
            var test = report[url];

            if (!test.result) {
                exitStatus = 1;
            }

            var method = test.result ? 'info' : 'error';

            console.log('{url} (expected: {expected}, actual: {actual})'
                .replace('{url}', url)
                .replace('{expected}', test.expected)
                .replace('{actual}', test.actual)
                [method]
            );
        }

        process.exit(exitStatus);
});
} catch (e) {
    console.log(e.message.error);
}