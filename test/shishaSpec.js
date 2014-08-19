'use strict';

var assert = require('assert');
var mockserver = require('mockserver');
var shisha = require('../shisha');
var http = require('http');

describe('Shisha',function(){
	it('should be a valid node module', function(){
		assert.equal(typeof shisha, 'object');
	});
	// it('should be able to use command line arguments', function(){});
});

describe('Shisha: parser',function(){
	it('should be throw an error if there is no .smokefile', function(){
		shisha.use('./test/nosmokefile');
		assert.throws(function(){
			var config = shisha.parse();
		}, function(error){
            return /\.smokefile not found/.test(error);
        });
	});

	it('should be throw an error if the .smokefile has invalid syntax', function(){
		shisha.use('./test/invalidsmokefile');
		assert.throws(function(){
			var config = shisha.parse();
		}, function(error){
            return /\.smokefile is invalid/.test(error);
        });
	});

	it('should be able to parse a .smokefile to an object', function(){
		shisha.use('./test/validsmokefile');
		var config = shisha.parse();
		assert.equal(typeof config, 'object');
        assert.deepEqual(config,
            [
                {
                    "hostname": "127.0.0.1",
                    "port":     "9001",
                    "urls": {
                        "/return-200" : 200,
                        "/return-404" : 404,
                        "/return-500" : 500
                    }
                },
                {
                    "hostname": "127.0.0.1",
                    "port":     "9001",
                    "urls": {
                        "/return-200" : 200,
                        "/return-404" : 404,
                        "/return-500" : 500
                    }
                }
            ]
        );
	});
});

describe('Shisha: smoke tests',function(){
	var server;
	before(function(){
		if(server){
			server.close();
		}
		server = http.createServer(mockserver('./test/mocks')).listen(9001);
	});

	after(function(){
		server.close()
	});

	it('should be able to request all the urls from the smokefile object', function(){
		shisha.use('./test/validsmokefile');
		shisha.smoke(function(output){
            assert.equal(output.message,'Smoke test passed!');
        });
	});

	it('should be able to report when ever the smoke test failed', function(){
		shisha.use('./test/invalidsmokefile-with-errors');
		shisha.smoke(function(output){
            assert.equal(output.message,'Smoke test failed!');
        });
	});
});

