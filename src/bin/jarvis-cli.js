#!/usr/bin/env node
(function(){

	var path = require("path"), fs = require("fs");
	var processName = path.basename(process.argv[1]);

	function help() {
		console.log("Jarvis");
		console.log("  Unit testing framework by Tommy Montgomery");
		console.log("  http://jarvis.tmont.com/");
		console.log();

		console.log("Usage");
		console.log("  " + processName + " [options] file1 [file2, [...]]");

		console.log();
		console.log("Examples");

		console.log("  jarvis /path/to/MyTest.js");
		console.log("    Run a single test");
		console.log();

		console.log("  jarvis /path/to/MyTest1.js /path/to/MyTest2.js");
		console.log("    Run multiple tests");
		console.log();

		console.log("  jarvis -v /path/to/MyTest.js");
		console.log("    Run a test with verbose output");
		console.log();

		console.log("  jarvis -r /path/to/MyCustomReporter.js /path/to/MyTest.js");
		console.log("    Run a test using a custom reporter");
		console.log();

		console.log("Options");
		console.log("  --help, -h                Show this help");
		console.log("  --usage                   Show terse usage details");
		console.log("  --verbose, -v             Display more verbose output (not applicable with --reporter)");
		console.log("  --no-global               Don't make the Jarvis, Assert, Is and Has variables available globally");
		console.log("  --no-summary              Don't print a summary when all test are complete");
		console.log("  --reporter, -r [reporter] Use the specified reporter. \"reporter\" is require()'d verbatim, so make sure the file/module exists");
	}

	function usage(exitCode) {
		console.log(processName + " [--help|-h] [--usage] [--verbose|-v] [--reporter|-r reporter] [--no-global] [--no-summary] file1 [file2 [...]]");
		process.exit(exitCode || 0);
	}

	function parseAndValidateArgs(args) {
		var options = {
			reporter: null,
			verbose: false,
			usage: false,
			global: true,
			showSummary: true,
			help: false
		};

		var files = [];

		for (var i = 0; i < args.length; i++) {
			switch (args[i]) {
				case "--reporter":
				case "-r":
					if (i >= args.length - 1) {
						throw "Reporter not given";
					}

					options.reporter = args[++i];
					break;
				case "--help":
				case "-h":
					options.help = true;
					break;
				case "--usage":
					options.usage = true;
					break;
				case "--verbose":
				case "-v":
					options.verbose = true;
					break;
				case "--no-global":
					options.global = false;
					break;
				case "--no-summary":
					options.showSummary = false;
					break;
				default:
					files.push(args[i]);
					break;
			}
		}

		if (!files.length && !options.help && !options.usage) {
			throw "No test specified";
		}

		return {
			options: options,
			files: files
		};
	}

	var args;
	try {
		args = parseAndValidateArgs(process.argv.slice(2));
	} catch (err) {
		console.error(err);
		console.log();
		usage(1);
	}

	if (args.options.help) {
		help();
		process.exit(0);
	}

	if (args.options.usage) {
		usage();
	}

	var jarvis = require("../jarvis.js");
	if (args.options.global) {
		global.Jarvis = jarvis;
		global.Assert = jarvis.Framework.Assert;
		global.Is = jarvis.Framework.Is;
		global.Has = jarvis.Framework.Has;
	}

	if (args.options.reporter) {
		var customReporter = require(args.options.reporter);
		jarvis.defaultReporter = new customReporter();
	} else {
		var CliReporter = require("../reporters/CliReporter.js");
		jarvis.defaultReporter = new CliReporter(args.options.verbose);
	}

	for (var i = 0; i < args.files.length; i++) {
		var fileName = process.cwd() + "/" + args.files[i];
		var test = require(fileName);
		jarvis.run(test);
	}

	if (args.options.showSummary) {
		jarvis.summary();
	}

	console.log();

}());