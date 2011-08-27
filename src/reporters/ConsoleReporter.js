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
		
		this.startTest = function(name, id) {
			var test = { 
				name: name,
				startTime: new Date().getTime()
			};
			
			tests[id] = test;
			
			console.group(test.name);
		};
		
		this.endTest = function(result, id) {
			var endTime = new Date().getTime(),
				test = tests[id];
			
			switch (result.status) {
				case "fail":
				case "error":
					console.error(result.message || "");
					break;
				case "ignore":
					console.warn(result.message || "");
					break;
			}
			
			console.log("  " + (endTime - test.startTime) + "ms " + result.assertions + " assertion" + (result.assertions !== 1 ? "s" : ""));
			console.groupEnd();
			tests[id] = undefined;
		};
	}

	if (typeof(exports) === "undefined") {
		if (typeof(Jarvis) === "undefined") {
			throw "Jarvis must be defined before defining a reporter";
		}

		Jarvis.Framework.Reporters.ConsoleReporter = ConsoleReporter;
		Jarvis.defaultReporter = new ConsoleReporter();
	} else {
		exports = new ConsoleReporter();
	}
	
}());