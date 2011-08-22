require("../../src/bootstrap/jarvis.bootstrap.node.js");

function Node_tests() {
	return [
		function Failed_test() {
			Assert.that(4, Is.equalTo(5));
		},

		function Test_that_succeeds() {
			Assert.that(4, Is.not.equalTo(5));
		}
	];
}

Jarvis.run(Node_tests);