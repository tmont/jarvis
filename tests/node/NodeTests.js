var Jarvis = global.Jarvis = require("../../src/jarvis.js");
require("../../src/reporters/CliReporter.js");
var Assert = Jarvis.Framework.Assert,
	Is = Jarvis.Framework.Is,
	Has = Jarvis.Framework.Has;

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