/**
 *  1. Read the file from the file system
 *  2  Parse the file : get the url and status code mapping -> map object
 *  3. Process the map object one by one
 *      1. Http call to the url and assert the status code from the map object
 *
 */
'use strict';

var fs = require('fs');
var http = require('http');

var shisha = {
    directory: '.',
    use: function (directory) {
        this.directory = directory;
    },
    parse: function () {
        var parseData;

        if (!fs.existsSync(shisha.directory + '/.smokefile')) {
            throw new Error('.smokefile not found');
        }

        try {
            parseData = JSON.parse(fs.readFileSync(shisha.directory + '/.smokefile'));
        } catch (e) {
            throw new Error('.smokefile is invalid');
        }

        return parseData;
    },
    smoke: function (callback) {
        var report = {},
            data = shisha.parse(),
            message = 'Smoke test passed!',
            urlsCount = 0,

            addToReport = function (data, url, urlIndex) {
                return function (res) {
                    var hostname = data.hostname,
                        port = data.port,
                        urls = data.urls;

                    if (urls[url] !== res.statusCode) {
                        report[hostname + ':' + port + url + '_' + urlIndex] = 'fail';
                        message = 'Smoke test failed!';
                    } else {
                        report[hostname + ':' + port + url + '_' + urlIndex] = 'pass';
                    }

                    if (Object.keys(report).length === urlsCount) {
                        report.message = message;
                        callback(report);
                    }
                };
            },

            processSmokeData = function (data) {
                for (var url in data.urls) {
                    http.get({
                        hostname: data.hostname,
                        port: data.port,
                        path: url
                    }, addToReport(data, url, ++urlsCount));
                }
            };

        for (var i = 0; i < data.length; i++) {
            processSmokeData(data[i]);
        }
    }
};

module.exports = shisha;