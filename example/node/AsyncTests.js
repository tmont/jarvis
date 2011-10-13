module.exports = function Sample_async_tests() {
	var http = require('http');

	return [
		function Should_connect_to_google(testCompleteCallback) {
			var options = {
				host: 'www.google.com',
				port: 80,
				method: 'GET'
			};

			http.request(options, function(response) {
				var responseBody = '';
				
				response.on('data', function(chunk) {
					responseBody += chunk;
				});

				response.on('end', function() {
					Assert.begin()
						.that(response, Has.property('statusCode').equalTo(200))
						.that(responseBody, Has.property('length').greaterThan(1000))
						.run(testCompleteCallback);
				});
			}).end();
		},

		function Should_catch_error(testCompleteCallback) {
			var expectedError = new Error('ENOTFOUND, Domain name not found');
			expectedError.code = 'ENOTFOUND';
			expectedError.errno = 4;

			Assert.willThrow(expectedError);
			
			var options = {
				host: 'foo',
				port: 80,
				method: 'GET'
			};

			var request = http.request(options, function(response) {
				testCompleteCallback(new Error('Expected request to fail'));
			});

			request.on('error', function(error) {
				testCompleteCallback(error);
			});

			request.end();
		},

		function Should_expect_error(testCompleteCallback) {
			Assert.willThrow();
			testCompleteCallback();
		},

		function Should_ignore_test(testCompleteCallback) {
			testCompleteCallback({ ignore: 'Ignoring this test' });
		},

		function Should_fail_test(testCompleteCallback) {
			testCompleteCallback({ fail: 'Failing this test' });
		}
	];

};