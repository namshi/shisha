var fs = require('fs');
var _ = require('lodash');
var parser = require('./parser');
var templating = require('./templating');

/**
 * Loads the resources from a file.
 */
var loadFromFile = function(path) {
    return parser.parse(fs.readFileSync(path, {encoding: 'utf8'}));
};

/**
 * Loads the resources from a list.
 * 
 * ie. [{url: 'http://google.com', status: 200}]
 */
var loadFromList = function(list) {
    var result = [];

    _.each(list, function(resource){
      result.push({
        url: resource.url,
        status: resource.status
      });
    });
    
    return result;  
};

/**
 * Loads the resources from an object.
 * 
 * ie. { 'http://google.com': 200 }
 * 
 */
var loadFromObject = function(object) {
    var result = [];

    _.each(object, function(status, url){
      result.push({
        url: url,
        status: status
      });
    });
    
    return result;  
};

var loader = {
    /**
     * Figures out what `something` is
     * and loads it in a shisha-compatible
     * list of resources.
     *
     * @param something
     * @returns {*}
     */
    load: function(something, locals) {
        var resources;
        
        if (typeof something === 'string') {
          resources = loadFromFile(something);  
        } else if (_.isArray(something)) {
          resources = loadFromList(something);
        } else {
          resources = loadFromObject(something);
        }
        
        return _.map(resources, function(resource){
          return {
            url: templating.render(resource.url, locals),
            status: resource.status
          };
        });
    }
};

module.exports = loader;
