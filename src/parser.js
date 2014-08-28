var templating = require('./templating');

/**
 * Builds the parsed object from rawData in the following form:
 * {
 *      url: 'urlToTest',
 *      status: 'expectedStatusCode'
 * }
 *
 * @param rawData
 * @returns {{url: *, status: *}}
 */
var buildParsedObject = function(rawData){
    var parts   = rawData.split(' ');
    var status  = parts.pop();
    var url     = parts.join('');

    if (!url || !status) {
        throw new Error('Invalid config file');
    }

    return {
        url: url,
        status: status
    };
};

var parser = {
    /**
     * Parses rawData constructing
     * the testing list.
     *
     * [
     *      {
     *          url: 'urlToTest',
     *          status: 'expectedStatusCode'
     *      },
     *      {
     *          ....
     *      },
     *
     *      ....
     * ]
     * 
     * The rawData is basically a newline-separated
     * string like:
     * http://google.com 200\nhttp://gaaaagle.com 404...
     *
     * @param rawData
     * @returns {Array}
     */
    parse: function(rawData) {
        var parsedData = [];

        rawData = rawData.split('\n');

        if (rawData.length === 0) {
            throw new Error('Invalid config file');
        }

        for(var i = 0; i < rawData.length; i++) {
            if (rawData[i] !== '') {
                parsedData.push(buildParsedObject(rawData[i]));
            }
        }

        return parsedData;
    }
};

module.exports = parser;