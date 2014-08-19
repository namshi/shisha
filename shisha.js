/**
 *  1. Read the file from the file system
 *  2  Parse the file : get the url and status code mapping -> map object
 *  3. Process the map object one by one
 *      1. Http call to the url and assert the status code from the map object
 *
 */

var fs = require('fs');
var http = require('http');

var shisha = {
    directory: '.',
    use:       function (directory)
    {
        this.directory = directory;
    },
    parse:     function ()
    {
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
    smoke:     function (callback)
    {
        var report = {},
            data = shisha.parse(),
            message = 'Smoke test passed!',
            report = {},
            urlsCount = 0,
            hostname,
            port,
            urls;

        for (var i = 0; i < data.length; i++) {
            hostname = data[i].hostname;
            port = data[i].port;
            urls = data[i].urls;

            for (var url in urls) {

                urlsCount++;

                http.get({
                    hostname: hostname,
                    port:     port,
                    path:     url
                }, (function (url, urlsCount){
                    return function (res)
                    {
                        if (urls[url] !== res.statusCode) {
                            report[hostname + ':' + port + url] = 'fail';
                            message = 'Smoke test failed!';
                        } else {
                            report[hostname + ':' + port + url] = 'pass';
                        }
                        if (Object.keys(report).length === urlsCount) {
                            report.message = message;
                            callback(report);
                        }
                    }
                })(url, urlsCount));
            }
        }
    }
};

module.exports = shisha;