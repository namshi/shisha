/**
 *	1. Read the file from the file system
 *	2  Parse the file : get the url and status code mapping -> map object
 *	3. Process the map object one by one
 *		1. Http call to the url and assert the status code from the map object
 *	
 */

var fs = require('fs');
var http = require('http');

var shisha = {
    directory: '.',
    use : function(directory) {
        this.directory = directory;
    },
    parse: function() {
        if (!fs.existsSync(shisha.directory + '/.smokefile')) {
            throw new Error('.smokefile not found');
        }

        var data = fs.readFileSync(shisha.directory + '/.smokefile');
        var data2;
        try {
            data2 = JSON.parse(data);
        } catch (e){
            throw new Error('.smokefile is invalid');
        }

        return data2;

    },
    smoke: function(){
        var report = {};
        var data = shisha.parse();
        var message = 'all good!';
        var report = {};

        for(var i = 0; i < data.length; i++) {
            var hostname = data[i].hostname;
            var port = data[i].port;
            var urls = data[i].urls;
            for(var url in urls) {
                http.get({
                    hostname: hostname,
                    port: port,
                    path: url
                }, function(res){
                    if (urls[url] !== res.statusCode) {
                        message = 'some errors :(';
                    }


                });
            }
        }




        for(var key in data) {
            http.get({


            })



        }

        return {message: 'all good!'};
    }
};

module.exports = shisha;
