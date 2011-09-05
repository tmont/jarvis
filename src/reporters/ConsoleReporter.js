/**
 * Reports test results to the console
 *
 * Supported in browser and Node contexts, although Node doesn't
 * define console.group() and console.groupEnd() by default.
 */
(function(undefined){
	function ConsoleReporter() {
		var tests = {};

		this.htmlDiffs = false;
		this.summary = function() {};
		this.startTest = function(testObj) {
			var test = { 
				name: testObj.name,
				startTime: new Date().getTime()
			};
			
			tests[testObj.id] = test;
			
			console.group(test.name);
		};
		
		this.endTest = function(testObj) {
			var endTime = new Date().getTime(),
				test = tests[testObj.id];
			
			switch (testObj.result.status) {
				case "fail":
				case "error":
					console.error(testObj.result.message || "");
					break;
				case "ignore":
					console.warn(testObj.result.message || "");
					break;
			}
			
			console.log("  " + (endTime - test.startTime) + "ms " + testObj.assertions + " assertion" + (testObj.assertions !== 1 ? "s" : ""));
			console.groupEnd();
			tests[testObj.id] = undefined;
		};
	}

	if (typeof(exports) === "undefined") {
		if (typeof(Jarvis) === "undefined") {
			throw new Error("Jarvis must be defined before defining a reporter");
		}

		Jarvis.Framework.Reporters.ConsoleReporter = ConsoleReporter;
		Jarvis.defaultReporter = new ConsoleReporter();
	} else {
		exports = new ConsoleReporter();
	}
	
}());