/**
 * Reports test results to the CLI
 *
 * Only supported in Node context
 */

if (typeof(module) === "undefined") {
	throw new Error("CliReporter only supported for Node");
}

module.exports = function(verbose, useColor) {
	var tests = {},
		firstRun = true,
		depth = 1,
		lineStats = { total: 0, pass: 0, fail: 0, ignore: 0, error: 0 },
		stats = { total: 0, pass: 0, fail: 0, ignore: 0, error: 0 },
		failures = [],
		maxLineLength = 60,
		currentColumn = 1,
		formatter = useColor ? require('ansi-color').set : String,
		start;

	verbose = !!verbose;

	this.htmlDiffs = false;

	this.summary = function() {
		var passPercent = stats.total === 0 ? 0 : Math.round(10000 * stats.pass / stats.total) / 100;

		console.log();

		if (failures.length) {
			for (var i = 0; i < failures.length; i++) {
				console.log(formatter("---------------------------------------------------", "yellow"));
				var color = 'red';
				if (failures[i].result.status === 'ignore') {
					color = 'blue';
				} else if (failures[i].result.status === 'error') {
					color = 'magenta';
				}
				console.log(formatter(failures[i].name, color));
				printErrorOrFailure(failures[i].result);
				console.log();
			}
		}

		var totalTime = new Date().getTime() - start;

		console.log();
		console.log(formatter(stats.pass + "/" + stats.total + " - " + passPercent + "% - " + totalTime + "ms", "bold+underline"));
		console.log(formatter("  passed:  ") + formatter(stats.pass, "bold"));
		console.log(formatter("  failed:  ", "red") + formatter(stats.fail, "bold"));
		console.log(formatter("  erred:   ", "magenta") + formatter(stats.error, "bold"));
		console.log(formatter("  ignored: ", "blue") + formatter(stats.ignore, "bold"));
		console.log();
	};

	this.startTest = function(testObj) {
		if (firstRun) {
			start = new Date().getTime();
			firstRun = false;
		}
		
		var test = {
			name: testObj.name,
			startTime: testObj.start
		};

		if (verbose) {
			console.log(new Array(depth).join(" ") + test.name);
		}
	};

	this.startTestSuite = function(suite) {
		if (verbose) {
			console.log(new Array(depth).join(" ") + suite.name);
			depth++;
		}
	};

	this.endTestSuite = function(suite) {
		if (verbose) {
			console.log(new Array(depth).join(" ") + "suite finished");
			depth--;
		}
	};

	function printErrorOrFailure(result) {
		var indent = new Array(depth).join(" ");
		if (result.message) {
			console.log(indent + (result.message || ""));
		}

		console.log();

		if (result.status !== 'ignore') {
			for (var i = 0; i < result.stackTrace.length; i++) {
				console.log(indent + (i + 1) + ". " + result.stackTrace[i]);
			}
		}
	}

	this.endTest = function(testObj) {
		var endTime = new Date().getTime(),
			i;

		//console.dir(testObj);

		switch (testObj.result.status) {
			case "fail":
				if (verbose) {
					printErrorOrFailure(testObj.result);
				} else {
					process.stdout.write(formatter("F", "red"));
					failures.push(testObj);
				}
				break;
			case "error":
				if (verbose) {
					printErrorOrFailure(testObj.result);
				} else {
					process.stdout.write(formatter("E", "magenta"));
					failures.push(testObj);
				}
				break;
			case "ignore":
				if (verbose) {
					console.error(new Array(depth).join(" ") + (testObj.result.message || ""));
				} else {
					process.stdout.write(formatter("I", "blue"));
					failures.push(testObj);
				}
				break;
			case "pass":
				if (!verbose) {
					process.stdout.write(formatter("."));
				}
				break;
		}

		stats[testObj.result.status]++;
		stats.total++;
		lineStats.total++;
		lineStats[testObj.result.status]++;
		if (!verbose) {
			currentColumn++;
			if (currentColumn > maxLineLength) {
				currentColumn = 1;
				console.log(" " + lineStats.pass + "/" + lineStats.total + " [" + stats.pass + "/" + stats.total + "]");
				lineStats = { total: 0, pass: 0, fail: 0, ignore: 0, error: 0 };
			}
		}

		if (verbose) {
			console.log();
			console.log(new Array(depth).join(" ") + (endTime - testObj.startTime) + "ms " + testObj.assertions + " assertion" + (testObj.assertions !== 1 ? "s" : ""));
			console.log(new Array(depth).join(" ") + "-----------------------------------");
		}
	};
};