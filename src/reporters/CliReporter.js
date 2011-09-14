/**
 * Reports test results to the CLI
 *
 * Only supported in Node context
 */

if (typeof(module) === "undefined") {
	throw new Error("CliReporter only supported for Node");
}

module.exports = function(verbose) {
	var tests = {},
		firstRun = true,
		depth = 1,
		lineStats = { total: 0, pass: 0, fail: 0, ignore: 0, error: 0 },
		stats = { total: 0, pass: 0, fail: 0, ignore: 0, error: 0 },
		failures = [],
		maxLineLength = 60,
		currentColumn = 1,
		start;

	verbose = !!verbose;

	this.htmlDiffs = false;

	this.summary = function() {
		var passPercent = stats.total === 0 ? 0 : Math.round(10000 * stats.pass / stats.total) / 100;

		console.log();

		if (failures.length) {
			for (var i = 0; i < failures.length; i++) {
				console.log("--------------------------------------------");
				console.log(failures[i].name);
				printErrorOrFailure(failures[i].result);
				console.log();
			}
		}

		var totalTime = new Date().getTime() - start;

		console.log();
		console.log(stats.pass + "/" + stats.total + " - " + passPercent + "% - " + totalTime + "ms");
		console.log("  passed:  " + stats.pass);
		console.log("  failed:  " + stats.fail);
		console.log("  erred:   " + stats.error);
		console.log("  ignored: " + stats.ignore);
		console.log();
	};

	this.startTest = function(testObj) {
		if (firstRun) {
			console.log("Jarvis CLI");
			console.log(" by Tommy Montgomery");
			console.log();
			firstRun = false;
			start = new Date().getTime();
		}

		var test = {
			name: testObj.name,
			startTime: new Date().getTime(),
			hasChildTests: false
		};

		tests[testObj.id] = test;

		if (tests[testObj.parentId]) {
			tests[testObj.parentId].hasChildTests = true;
		}
		
		if (verbose) {
			console.log(new Array(depth).join(" ") + test.name);
			depth++;
		}
	};

	function printErrorOrFailure(result) {
		var indent = new Array(depth).join(" ");
		if (result.message) {
			console.error(indent + (result.message || ""));
		}

		console.log();
		
		for (var i = 0; i < result.stackTrace.length; i++) {
			console.error(indent + (i + 1) + ". " + result.stackTrace[i]);
		}
	}

	this.endTest = function(testObj) {
		var endTime = new Date().getTime(),
			test = tests[testObj.id],
			i;

		if (test === undefined) {
			console.dir(tests);
		}

		if (!test.hasChildTests) {
			switch (testObj.result.status) {
				case "fail":
					if (verbose) {
						printErrorOrFailure(testObj.result);
					} else {
						process.stdout.write("F");
						failures.push(testObj);
					}
					break;
				case "error":
					if (verbose) {
						printErrorOrFailure(testObj.result);
					} else {
						process.stdout.write("E");
						failures.push(testObj);
					}
					break;
				case "ignore":
					if (verbose) {
						console.error(new Array(depth).join(" ") + (testObj.result.message || ""));
					} else {
						process.stdout.write("I");
						failures.push(testObj);
					}
					break;
				case "pass":
					if (!verbose) {
						process.stdout.write(".");
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
		}

		if (verbose) {
			console.log();
			depth--;
			console.log(Array(depth).join(" ") + (endTime - test.startTime) + "ms " + testObj.assertions + " assertion" + (testObj.assertions !== 1 ? "s" : ""));
			console.log(Array(depth).join(" ") + "-----------------------------------");
		}

		tests[testObj.id] = undefined;
	};
};