var jarvis = require('./jarvis');

function AsyncTestRunner(reporter) {
	this.reporter = reporter || jarvis.defaultReporter;
}

AsyncTestRunner.prototype = jarvis.Framework.TestRunner;

AsyncTestRunner.prototype.run = function(testFunc, parentId, testCompleteCallback) {
	if (!this.reporter) {
		throw new Error('No reporter given');
	}

	var test = new jarvis.Framework.Test(testFunc, parentId);

	this.startTest(test);
	runTest.call(this, test, testCompleteCallback);
};

function runTest(test, testCompleteCallback) {
	var self = this;

	function testIsComplete(err) {
		if (err) {
			test.error = new jarvis.Framework.Error(err, "fail");
		}

		if (jarvis.globalExpectedError !== undefined) {
			test.error = new jarvis.Framework.Error("Expected error to be thrown: " + jarvis.globalExpectedError, "fail");
		}

		test.tearDown(function(err) {
			if (err) {
				test.error = new jarvis.Framework.Error("An error occurred while tearing down the test: " + (err.toString ? err.toString() : err), "error", err);
			}
			
			self.endTest(test);
			testCompleteCallback();
		});
	}

	function runTestSuite(parentTest, tests, suiteCompleteCallback) {
		if (!tests.length) {
			//completed successfully
			suiteCompleteCallback();
			return;
		}

		var self = this;

		parentTest.tearDown(function(err) {
			if (err) {
				suiteCompleteCallback(err);
				return;
			}

			parentTest.setup(function(err) {
				if (err) {
					suiteCompleteCallback(err);
					return;
				}
				
				self.run(tests.shift(), parentTest.id /* parentId */, function(err) {
					if (err) {
						suiteCompleteCallback(err);
						return;
					}

					parentTest.tearDown(function(err) {
						if (err) {
							suiteCompleteCallback(err);
							return;
						}
						
						runTestSuite.call(self, parentTest, tests, suiteCompleteCallback);
					});
				});
			});
		});
	}

	test.setup(function(err) {
		if (err) {
			//setup failed, bail immediately
			test.error = new jarvis.Framework.Error("An error occurred while setting up the test: " + (err.toString ? err.toString() : err), "error", err);
			testIsComplete();
			return;
		}

		try {
			var childTests = test.func(testIsComplete /* this won't be executed if childTests !== undefined */);
			if (typeof(childTests) === "object") {
				if (jarvis.isArray(childTests)) {
					runTestSuite.call(self, test, childTests, testIsComplete);
				} else {
					self.run(childTests, test.id /* parentId */, testIsComplete);
				}
			}
		} catch (e) {
			test.error = self.handleError(e, test);
			testIsComplete();
		}

		//anything else is undefined behavior
	});
}

exports.run = function(test, reporter, callback) {
	new AsyncTestRunner(reporter).run(test, null, callback);
};

exports.Assert = {
	begin: function() {
		var queue = [], assertionError;
		return {
			that: function(actual, constraint, message) {
				queue.push({ actual: actual, constraint: constraint, message: message });
				return this;
			},

			run: function(callback) {
				if (assertionError) {
					throw new Error('An error has already been thrown, cannot continue the test');
				}
				if (queue.length === 0) {
					callback();
					return;
				}

				function runAssertion(ass) {
					try {
						jarvis.Framework.Assert.that(ass.actual, ass.constraint, ass.message);
						if (queue.length === 0) {
							//queue is empty, no assertions left to run
							callback();
							return;
						}

						//if no error, run the next assertion
						runAssertion(queue.shift());
					} catch (error) {
						//reset the queue
						queue = [];

						//store the error so that if run() is called again it doesn't actually run
						assertionError = error;

						//bail early, and pass the error along to the calling code
						callback(error);
					}
				}

				runAssertion(queue.shift());
			}
		};
	}
};
