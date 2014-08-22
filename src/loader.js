var fs = require('fs');

var loader = {
    /**
     * Loads filePath from the file system
     *
     * @param filePath
     * @returns {*}
     */
    load: function(filePath) {
        return fs.readFileSync(filePath, {encoding: 'utf8'});
    }
};

module.exports = loader;
