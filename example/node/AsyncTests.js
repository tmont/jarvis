module.exports = function My_async_tests(testCompleteCallback) {
	var http = require('http');
	var options = {
		host: 'www.google.com',
		port: 80,
		method: 'GET'
	};

	var request = http.request(options, function(response) {
		Assert.begin()
			.that(response, Has.property('statusCode').equalTo(201))
			.that(response, Has.property('statusCode').equalTo(205), 'this should not be called')
			.run(testCompleteCallback);
	});

	request.end();
};