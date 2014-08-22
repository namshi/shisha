var _ = require('lodash');

/**
 * Renders data with locals
 *
 * @param data
 * @param locals
 * @returns {*}
 */
var templating = (function(){
    engine = _;
    engine.templateSettings.interpolate = /{{([\s\S]+?)}}/g;

    return {
        render: function(content, locals){
            return engine.template(content, locals);
        }
    };
})();

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
            rawData = templating.render(rawData, locals);
        }

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