var _ = require('lodash');

/**
 * Renders a string with locals
 *
 * @param data
 * @param locals
 * @returns {*}
 */
module.exports = (function(){
    var engine = _;
    engine.templateSettings.interpolate = /{{([\s\S]+?)}}/g;

    return {
        render: function(content, locals){
            return engine.template(content, locals);
        }
    };
})();