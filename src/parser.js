
var replacePlaceholders = function(data, placeholders) {
    for(var placeholder in placeholders) {
        data = data.split('{{' + placeholder + '}}').join(placeholders[placeholder]);
    }

    return data;
};

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
    parse: function(rawData, placeholders) {
        var parsedData = [];

        if (Object.keys(placeholders).length > 0) {
            rawData = replacePlaceholders(rawData, placeholders);
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