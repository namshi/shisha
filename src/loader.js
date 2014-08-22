var fs = require('fs');

var loader = {
    load: function(path) {
        if (!fs.existsSync(path + '/.shishafile')) {
            throw new Error('.shishafile not found');
        }

        return fs.readFileSync(path + '/.shishafile', {encoding: 'utf8'});
    }
};

module.exports = loader;
