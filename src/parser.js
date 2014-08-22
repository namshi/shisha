/**
 * Renders data with locals
 *
 * @param data
 * @param locals
 * @returns {*}
 */
var render = function(data, locals) {
    for(var local in locals) {
        data = data.split('{{' + local+ '}}').join(locals[local]);
    }

    return data;
};

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
    var linkStatusCode = rawData.split(' ');

    if (linkStatusCode.length !== 2) {
        throw new Error('Invalid config file');
    }

    return {
        url: linkStatusCode[0],
        status: linkStatusCode[1]
    };
};

var parser = {
    /**
     * Parses rawData by rendering locals and constructing
     * the testing array
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
     * @param rawData
     * @param locals
     * @returns {Array}
     */
    parse: function(rawData, locals) {
        var parsedData = [];

        if (Object.keys(locals).length > 0) {
            rawData = render(rawData, locals);
        }

        rawData = rawData.split('\n');

        if (rawData.length === 0) {
            throw new Error('Invalid config file');
        }

        for(var i = 0; i < rawData.length; i++) {
            parsedData.push(buildParsedObject(rawData[i]));
        }

        return parsedData;
    }
};

module.exports = parser;