var request = require('http-https');
var url = require('url');
var loader = require('./loader');
var parser = require('./parser');

var shisha = {
    directory: null,
    placeholders: {},
    use: function (directory, placeholders) {
        this.directory = directory;
        this.placeholders = placeholders;
    },
    parse: function () {
        var rawData = loader.load(this.directory);

        return parser.parse(rawData, this.placeholders);
    },
    smoke: function (callback) {
        var report = {},
            data = shisha.parse(),
            urlsCount = 0,
            addToReport = function (url, status) {
                return function (res) {
                    report[url] = {
                        expected: status,
                        actual: res.statusCode,
                        result: status === res.statusCode.toString()
                    };

                    if (Object.keys(report).length === data.length) {
                        callback(report);
                    }
                };
            },
            processSmokeData = function (reqUrl, expectedStatus) {
                var options = url.parse(reqUrl);
                options.agent = false;
                request.request(options, addToReport(reqUrl, expectedStatus, ++urlsCount)).end();
            };

        for (var i = 0; i < data.length; i++) {
            processSmokeData(data[i].url, data[i].status);
        }
    }
};

module.exports = shisha;