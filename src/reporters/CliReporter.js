(function(jarvis, undefined){
	if (!console) {
		throw "A console is required to report to the CLI";
	}

	jarvis.Framework.Reporters.CliReporter = function() {
		var tests = {}, indent = "";

		this.summary = function(totalAssertions) {
			//not implemented
		};

		this.startTest = function(name, id) {
			var test = {
				name: name,
				startTime: new Date().getTime()
			};

			tests[id] = test;

			console.log(indent + test.name);
			indent += "  ";
		};

		this.endTest = function(result, id) {
			var endTime = new Date().getTime(),
				test = tests[id];

			switch (result.status) {
				case "fail":
				case "error":
					console.error(indent + (result.message || ""));
					console.log("");
					for (var i = 0; i < result.stackTrace.length; i++) {
						console.error(indent + (i + 1) + ". " + result.stackTrace[i]);
					}
					break;
				case "ignore":
					console.warn(indent + (result.message || ""));
					break;
			}

			indent = indent.substring(0, indent.length - 2);
			console.log(indent + (endTime - test.startTime) + "ms " + result.assertions + " assertion" + (result.assertions !== 1 ? "s" : ""));
			console.log(indent + "-----------------------------------");
			tests[id] = undefined;
		};
	};

	jarvis.htmlDiffs = false;
	jarvis.defaultReporter = new jarvis.Framework.Reporters.CliReporter();
}(Jarvis));