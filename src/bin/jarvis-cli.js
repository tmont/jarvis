#!/usr/bin/env node
(function(){

	var path = require("path"), fs = require("fs");
	var processName = path.basename(process.argv[1]);

	function help() {
		console.log("Jarvis 2.0.0");
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

		console.log("  jarvis --whitelist Tests?\\\\.js$ /path/to/tests");
		console.log("    Run all tests (recursively) in /path/to/tests whose filename ends with Tests.js or Test.js");
		console.log();

		console.log("Options");
		console.log("  --help, -h                Show this help");
		console.log("  --version                 Print the version number");
		console.log("  --usage                   Show terse usage details");
		console.log("  --verbose, -v             Display more verbose output (not applicable with --reporter)");
		console.log("  --no-prologue             Don't show the product information prologue");
		console.log("  --no-global               Don't make the Jarvis, Assert, Is and Has variables available globally");
		console.log("  --no-summary              Don't print a summary when all tests are complete");
		console.log("  --async                   Run tests pseudo-asynchronously");
		console.log("  --whitelist [regex]       If a directory is given, filter files using regex as a white list; ");
		console.log("                            this will override any blacklist given");
		console.log("  --blacklist [regex]       If a directory is given, filter files using regex as a black list");
		console.log("  --reporter, -r [reporter] Use the specified reporter. \"reporter\" is require()'d verbatim, so make");
		console.log("                            sure the file/module exists");

		console.log();
	}

	function usage() {
		console.log(processName + " [options] file1 [file2 [...]]");
		console.log();
		console.log("Run \"" + processName + " --help\" for details");
	}

	function parseAndValidateArgs(args) {
		var options = {
			reporter: null,
			verbose: false,
			usage: false,
			global: true,
			showSummary: true,
			help: false,
			async: false,
			whitelist: null,
			blacklist: null,
			showVersion: false,
			showPrologue: true
		};

		var files = [];

		for (var i = 0; i < args.length; i++) {
			switch (args[i]) {
				case "--reporter":
				case "-r":
					if (i >= args.length - 1) {
						throw new Error("Reporter not given");
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
				case "--version":
					options.showVersion = true;
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
				case "--no-prologue":
					options.showPrologue = false;
					break;
				case "--async":
					options.async = true;
					break;
				case '--whitelist':
				case '--blacklist':
					if (i >= args.length - 1) {
						throw new Error("Expected argument for " + args[i].substring(2));
					}

					options[args[i].substring(2)] = new RegExp(args[++i]);
					break;
				default:
					files.push(args[i]);
					break;
			}
		}

		if (!files.length && !options.help && !options.usage && !options.showVersion) {
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
		usage();
		process.exit(1);
	}

	if (args.options.help) {
		help();
		process.exit(0);
	}

	if (args.options.usage) {
		usage();
		process.exit(0);
	}

	if (args.options.showVersion) {
		console.log("2.0.2");
		process.exit(0);
	}

	var jarvis = require("../jarvis");
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

	function recursiveDirWalk(dir) {
		var files = [];

		try {
			if (fs.lstatSync(dir).isDirectory()) {
				var subFiles = fs.readdirSync(dir);
				for (var i = 0; i < subFiles.length; i++) {
					var fullName = dir + '/' + subFiles[i];
					if (subFiles[i] === '.' || subFiles[i] === '..') {
						continue;
					}

					if (fs.lstatSync(fullName).isDirectory()) {
						files = files.concat(recursiveDirWalk(fullName));
					} else if (fileIsValid(fullName)) {
						files.push(fullName);
					}
				}
			}
		} catch (e) {
			//not a file
		}

		return files;
	}

	function fileIsValid(fileName) {
		if (args.options.whitelist) {
			return args.options.whitelist.test(fileName);
		} else if (args.options.blacklist) {
			return !args.options.blacklist.test(fileName);
		}

		return true;
	}

	var testFiles = [];
	for (var i = 0; i < args.files.length; i++) {
		var realFile = fs.realpathSync(args.files[i]);
		try {
			if (fs.lstatSync(realFile).isDirectory()) {
				testFiles = testFiles.concat(recursiveDirWalk(realFile));
			} else if (fileIsValid(realFile)) {
				testFiles.push(realFile);
			}
		} catch (e) {
			//do nothing, file doesn't exist
		}
	}

	if (!testFiles.length) {
		console.error('No tests given');
		process.exit(1);
	}

	if (args.options.showPrologue) {
		console.log("Jarvis CLI");
		console.log(" by Tommy Montgomery");
		console.log();
	}

	if (!args.options.async) {
		for (i = 0; i < testFiles.length; i++) {
			jarvis.run(require(testFiles[i]));
		}

		console.log();

		if (args.options.showSummary) {
			jarvis.summary();
		}
	} else {
		var jarvisAsync = require('../jarvis.async');
		if (args.options.global) {
			global.Assert = jarvisAsync.Assert;
		}

		(function runNext() {
			if (!testFiles.length) {
				console.log();

				if (args.options.showSummary) {
					jarvis.summary();
				}
				return;
			}

			jarvisAsync.run(require(testFiles.shift()), null, runNext);
		}());
	}
}());