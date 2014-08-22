var http = require('http-https');
var url = require('url');
var loader = require('./loader');
var parser = require('./parser');

/**
 * Loads and parses the config file (shishaFile)
 * Also passes locals to the loaded data
 *
 * @param shishaFile
 * @param locals
 * @returns {*}
 */
function parse(shishaFile, locals) {
    return parser.parse(loader.load(shishaFile), locals);
}

var shisha = {
    /**
     * Main method to start the smoking process
     *
     * @param shishaFile
     * @param locals
     * @param callback
     */
    smoke: function (shishaFile, locals, callback) {
        var report = {},
            data = parse(shishaFile, locals),
            urlsCount = 0,
            /**
             * A callback function to the request that adds the formatted result
             * to the report object
             *
             * @param url
             * @param status
             * @returns {Function}
             */
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
            /**
             * Performs the smoke test on a reqUrl
             *
             * @param reqUrl
             * @param expectedStatus
             */
            processSmokeData = function (reqUrl, expectedStatus) {
                var options = url.parse(reqUrl);
                options.agent = false;
                http.request(options, addToReport(reqUrl, expectedStatus, ++urlsCount)).end();
            };

        for (var i = 0; i < data.length; i++) {
            processSmokeData(data[i].url, data[i].status);
        }
    }
};

module.exports = shisha;