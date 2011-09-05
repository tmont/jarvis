if (typeof(module) === "undefined") {
	throw "This test suite is only relevant for running tests via node";
}

module.exports = function Asynchronous_tests() {
	return {
		setup: function(setupComplete) {
			setupComplete();
		},

		tearDown: function(tearDownComplete) {
			tearDownComplete();
		},

		test: function() {
			return [
				function Async_test1(testComplete) {
					Assert.that("foo", Is.equalTo("foo"));
					testComplete();
				},

				function Async_test2(testComplete) {
					//Assert.that("foo", Is.equalTo("bar"));
					testComplete(); //should never be executed
				},

				function Async_test3(testComplete) {
					Assert.willThrow();
					testComplete();
				},

				function Async_test4(testComplete) {
					Assert.that(1, Is.equalTo(1));
					testComplete();
				}
			];
		}
	};
};