'use strict';

var assert = require('assert');
var mockserver = require('mockserver');
var shisha = require('../');

describe('Shisha',function(){
	it('should be a valid node module', function(){
		assert.equal(typeof shisha, 'object');
	});
	// it('should be able to use command line arguments', function(){});
});

describe('Shisha: parser',function(){
	it('should be throw an error if there is no .smokefile', function(){
		shisha.use('./nosmokefile');
		assert.throws(function(){
			var config = shisha.parse();
		}, '.smokefile not found');
	});

	it('should be throw an error if the .smokefile has invalid syntax', function(){
		shisha.use('./invalidsmokefile');
		assert.throws(function(){
			var config = shisha.parse();
		}, '.smokefile is invalid');
	});

	it('should be able to parse a .smokefile to an object', function(){
		shisha.use('./validsmokefile');
		var config = shisha.parse();
		assert.equal(typeof config, 'object');
		assert.equal(config, {
			'url1' : 200,
			'url2' : 404,
			'url3' : 200
		});
	});
});

describe('Shisha: smoke tests',function(){
	var server;
	before(function(){
		server = http.createServer(mockserver('mocks')).listen(9001);
	});

	after(function(){
		server.close()
	});

	it('should be able to request all the urls from the smokefile object', function(){
		shisha.use('./validsmokefile');
		var output = shisha.smoke();
		assert.equal(output,{
			'message': 'all good'
		});
	});

	it('should be able to request all the urls from the smokefile object', function(){
		shisha.use('./	');
		var output = shisha.smoke();
		assert.equal(output,{
			'message': 'all good'
		});
	});
});

