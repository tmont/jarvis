if (typeof(module) === "undefined") {
	throw "This test suite is only relevant for running tests via node";
}

module.exports = function All_tests() {
	return [
		require("./ConstraintTests.js"),
		require("./ExpectedErrorTests.js"),
		require("./FailureMessageTests.js"),
		require("./NonPassingStatusTests.js"),
		require("./SampleTests.js"),
		require("./SetupAndTearDownTests.js")
	];
};