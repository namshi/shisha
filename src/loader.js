var fs = require('fs');

var loader = {
    load: function(filePath) {
        return fs.readFileSync(filePath, {encoding: 'utf8'});
    }
};

module.exports = loader;
