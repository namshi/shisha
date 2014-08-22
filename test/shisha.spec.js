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
	it('should be throw an error if there is no .smoke', function(){
        var f = false;

        try {
            shisha.smoke('./test/noshishafile/.test', {domain: '127.0.0.1:9001'});
            f = true;
        } catch (e) {
            assert.equal(e.code, 'ENOENT');
        }

        if (f) {
            assert.fail(null, null, 'This should not be called');
        }
	});
    it('should be throw an error if the .smoke has invalid syntax', function(){
        var f = false;

        try {
            shisha.smoke('./test/invalidshishafile/.smoke', {domain: '127.0.0.1:9001'}, function(){});
            f = true;
        } catch (e) {
            assert.equal(e.message, 'Invalid config file');
        }

        if (f) {
            assert.fail(null, null, 'This should not be called');
        }
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
        shisha.smoke('./test/validshishafile-with-errors/.smoke', {domain: '127.0.0.1:9001'}, function(output){
            var keys = Object.keys(output);
            assert.equal(output[keys].result, false);
            done();
        });
    });

	it('should be able to request all the urls from the shisha object', function(done){
		shisha.smoke('./test/validshishafile/.smoke', {domain: '127.0.0.1:9001'}, function(output){
            for (var url in output) {
                assert.equal(output[url].result, true);
            }
            done();
        });
	});
});