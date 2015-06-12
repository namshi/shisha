#!/usr/bin/env node
'use strict';

var argv = require('yargs').argv;
var colors = require('colors');
var shisha = require('./../src/index');
var path = require('path');

var locals = {};

for (var local in argv) {
    locals[local] = argv[local];
}

var shishaFile = argv.smoke || (path.join(process.cwd(), '.smoke'));

var options = {
    caPath: argv.ca || null
};

try {
    var exitStatus = 0;

    shisha.smoke(shishaFile, locals, function(report) {

        report.forEach(function(test) {
            if (!test.result) {
                exitStatus = 1;
            }

            var method = test.result ? 'green' : 'red';

            console.log('{url} (expected: {expected}, actual: {actual})'
                .replace('{url}', test.url)
                .replace('{expected}', test.expected)
                .replace('{actual}', test.actual)
                [method]
            );
        });

        process.exit(exitStatus);
    }, options);
} catch (e) {
    console.log(e.message.red);
}
