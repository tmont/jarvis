if (typeof(global.Jarvis) === "undefined") {
	throw "Expected global variable \"Jarvis\" to be set";
}

Jarvis.Framework.Reporters.CliReporter = function(verbose) {
	var tests = {},
		firstRun = true,
		depth = 1,
		lineStats = { total: 0, pass: 0, fail: 0, ignore: 0, error: 0 },
		stats = { total: 0, pass: 0, fail: 0, ignore: 0, error: 0 },
		maxLineLength = 60,
		currentColumn = 1;

	verbose = !!verbose;

	this.summary = function(totalAssertions) {
		var passPercent = stats.total === 0 ? 0 : Math.round(10000 * stats.pass / stats.total) / 100;

		console.log();
		console.log();
		console.log(stats.pass + "/" + stats.total + " - " + passPercent + "% - " + totalAssertions + " assertion" + (totalAssertions === 1 ? "" : "s"));
		console.log("  ignored: " + stats.ignore);
		console.log("  failed:  " + stats.fail);
		console.log("  erred:   " + stats.error);
	};

	this.startTest = function(name, id, parentId) {
		if (firstRun) {
			console.log("Jarvis CLI");
			console.log(" by Tommy Montgomery");
			console.log();
			firstRun = false;
		}

		var test = {
			name: name,
			startTime: new Date().getTime(),
			hasChildTests: false
		};

		tests[id] = test;

		if (tests[parentId]) {
			tests[parentId].hasChildTests = true;
		}
		
		if (verbose) {
			console.log(Array(depth).join(" ") + test.name);
		}
		
		depth++;
	};

	function printErrorOrFailure(result) {
		console.error(depth + (result.message || ""));
		console.log();
		var indent = Array(depth).join(" ");
		for (var i = 0; i < result.stackTrace.length; i++) {
			console.error(indent + (i + 1) + ". " + result.stackTrace[i]);
		}
	}

	this.endTest = function(result, id, parentId) {
		var endTime = new Date().getTime(),
			test = tests[id],
			i;

		if (!test.hasChildTests) {
			switch (result.status) {
				case "fail":
					if (verbose) {
						printErrorOrFailure(result);
					} else {
						process.stdout.write("F");
					}
					break;
				case "error":
					if (verbose) {
						printErrorOrFailure(result);
					} else {
						process.stdout.write("E");
					}
					break;
				case "ignore":
					if (verbose) {
						console.error(Array(depth).join(" ") + (result.message || ""));
					} else {
						process.stdout.write("I");
					}
					break;
				case "pass":
					if (!verbose) {
						process.stdout.write(".");
					}
					break;
			}

			stats[result.status]++;
			stats.total++;
			lineStats.total++;
			lineStats[result.status]++;
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
			console.log(Array(depth).join(" ") + (endTime - test.startTime) + "ms " + result.assertions + " assertion" + (result.assertions !== 1 ? "s" : ""));
			console.log(Array(depth).join(" ") + "-----------------------------------");
		}

		tests[id] = undefined;
	};
};

Jarvis.htmlDiffs = false;
Jarvis.defaultReporter = new Jarvis.Framework.Reporters.CliReporter();