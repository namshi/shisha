var http    = require('http-https');
var url     = require('url');
var loader  = require('./loader');
var fs      = require('fs');

var shisha = {
    /**
     * Main method to start the smoking process
     *
     * @param data
     * @param locals
     * @param callback
     * @param options
     */
    smoke: function (data, locals, callback, options) {
        var report = [];

        if (!options) {
            if (!callback) {
                callback = locals;
                locals = {};
            }

            if (typeof callback != 'function') {
                options = callback;
                callback = locals;
                locals = {};
            }
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
        
        var testResource = function (resource) {
            var requestOptions = url.parse(resource.url(locals));
            requestOptions.agent = false;

            if (options && options.caPath) {
                requestOptions.ca = [ fs.readFileSync(options.caPath) ];
            }

            http.request(requestOptions, addToReport(resource.url, resource.status)).end();
        };
        
        for (var i = 0; i < resources.length; i++) {
          testResource({
            url: resources[i].url,
            status: resources[i].status
          });
        }
    }
};

module.exports = shisha;