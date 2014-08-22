'use strict';

var assert = require('assert');
var mockserver = require('mockserver');
var shisha = require('../src/index');
var http = require('http');

describe('Shisha',function(){
	it('should be a valid node module', function(){
		assert.equal(typeof shisha, 'object');
	});
});

describe('Shisha: parser',function(){
	it('should be throw an error if there is no .shishafile', function(){
		shisha.use('./test/noshishafile', {domain: '127.0.0.1:9001'});
		assert.throws(function(){
			var config = shisha.parse();
		}, function(error){
            return /\.shishafile not found/.test(error);
        });
	});

	it('should be throw an error if the .shishafile has invalid syntax', function(){
		shisha.use('./test/invalidshishafile', {domain: '127.0.0.1:9001'});
		assert.throws(function(){
			var config = shisha.parse();
		}, function(error){
            return /\.shishafile is invalid/.test(error);
        });
	});

	it('should be able to parse a .shishafile to an object', function(){
		shisha.use('./test/validshishafile', {domain: '127.0.0.1:9001'});
		var config = shisha.parse();
		assert.equal(typeof config, 'object');
        assert.deepEqual(config,
            [
                {
                    url: 'http://127.0.0.1:9001/return-200',
                    status: 200
                },
                {
                    url: 'http://127.0.0.1:9001/return-404',
                    status: 404
                },
                {
                    url: 'http://127.0.0.1:9001/return-500',
                    status: 500
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
		server.close();
	});

    it('should be able to report when ever the smoke test failed', function(done){
        shisha.use('./test/validshishafile-with-errors', {domain: '127.0.0.1:9001'});
        shisha.smoke(function(output){
            var keys = Object.keys(output);
            assert.equal(output[keys].result, false);
            done();
        });
    });

	it('should be able to request all the urls from the shisha object', function(done){
		shisha.use('./test/validshishafile', {domain: '127.0.0.1:9001'});
		shisha.smoke(function(output){
            for (var url in output) {
                assert.equal(output[url].result, true);
            }
            done();
        });
	});
});