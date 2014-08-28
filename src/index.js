var http    = require('http-https');
var url     = require('url');
var loader  = require('./loader');

var shisha = {
    /**
     * Main method to start the smoking process
     *
     * @param data
     * @param locals
     * @param callback
     */
    smoke: function (data, locals, callback) {
        var report = [];
        
        if (!callback) {
            callback = locals;
            locals = {};
        }

        resources = loader.load(data, locals);
        
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
                report.push({
                    url: url,
                    expected: status,
                    actual: res.statusCode,
                    result: status == res.statusCode.toString()
                });

                if (Object.keys(report).length === resources.length) {
                    callback(report);
                }
            };
        };
        
        for (var i = 0; i < resources.length; i++) {
            var options = url.parse(resources[i].url);
            options.agent = false;
            http.request(options, addToReport(resources[i].url, resources[i].status)).end();
        }
    }
};

module.exports = shisha;