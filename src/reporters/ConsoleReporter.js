(function(global, undefined){
	
	global.ConsoleReporter = function() {
		var tests = {};
		
		this.summary = function(totalAssertions) {
			//not implemented
		};
		
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
	};
	
	global.Jarvis.htmlDiffs = false;
	global.Jarvis.defaultReporter = new ConsoleReporter();
	
}(this));