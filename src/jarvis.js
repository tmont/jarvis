/**
 * Jarvis: JavaScript unit testing library
 *   Tommy Montgomery <http://tommymontgomery.com/>
 *
 * More information: <http://jarvis.tmont.com/>
 * 
 * Released under the WTFPL <http://sam.zoy.org/wtfpl/>
 */
(function(exports, doc, undefined){
	var constraints,
		testId = 1,
		globalExpectedError,
		emptyFunc = function() {},
		jarvis = exports;
	
	function isArray(o) {
		return Object.prototype.toString.call(o) === '[object Array]';
	}
	
	function getFunctionName(func) {
		var match = /^\s*function\s([\w\$]+)\([^\)]*\)\s*\{/.exec(func.toString());
		return match ? match[1] : "<anonymous>";
	}
	
	//adapted from diff_match_patch.diff_prettyHtml()
	function getDiffNodes(expected, actual) {
		//compute diff
		var diff = new diff_match_patch(),
			diffs = diff.diff_main(expected, actual),
			html = [],
			i,
			pre,
			nodes,
			actualNodes,
			x,
			op,
			data,
			text;
		
		diff.diff_cleanupSemantic(diffs);
		
		for (x = 0; x < diffs.length; x++) {
			op = diffs[x][0];    // Operation (insert, delete, equal)
			data = diffs[x][1];  // Text of change.
			text = data.replace(/&/g, "&amp;")
				.replace(/</g, "&lt;")
				.replace(/>/g, "&gt;")
				.replace(/\r\n/g, "&crarr;&para;<br />")
				.replace(/\r/g, "&crarr;<br />")
				.replace(/\n/g, "&para;<br />");
			
			switch (op) {
				case 1:
					html[x] = "<ins>" + text + "</ins>";
					break;
				case -1:
					html[x] = "<del>" + text + "</del>";
					break;
				case 0:
					html[x] = "<span>" + text + "</span>";
					break;
			}
			
			if (op !== -1) {
				i += data.length;
			}
		}
		
		html = html.join('');
		
		pre = doc.createElement("pre");
		pre.innerHTML = html;
		
		nodes = pre.cloneNode(true).children;
		actualNodes = [];
		for (i = 0; i < nodes.length; i++) {
			actualNodes[i] = nodes[i];
		}
		pre = null;
		return actualNodes;
	}

	function getBinaryFailureMessage(expected, actual) {
		return "Expected: " + expected + "\n" + "Actual:   " + actual;
	}
	
	function getType(object) {
		if (object instanceof RegExp) {
			//chrome thinks a RegExp is a function
			return "object";
		}
		
		var type = typeof(object);
		switch (type) {
			case "string":
			case "number":
			case "boolean":
			case "function":
			case "undefined":
				return type;
			case "object":
				if (object === null) {
					return "null";
				}
				if (isArray(object)) {
					return "array";
				}
				
				return "object";
			default:
				return "object";
		}
	}
	
	function toString(object) {
		switch (getType(object)) {
			case "string":
				if (object === "") {
					return "<empty string>";
				}
				
				if (object.length > 100) {
					//truncate it
					object = object.substring(0, 50) + "..." + object.substring(object.length - 50);
				}
				
				return "\"" + object + "\"";
			case "number":
			case "boolean":
				return object;
			case "null":
				return "<null>";
			case "undefined":
				return "<undefined>";
			case "object":
				if (object instanceof RegExp) {
					return "[Object(RegExp:" + object.toString() + ")]";
				}
				
				return "[Object(" + getFunctionName(object.constructor.toString()) + ")]";
			case "array":
				return "[Array(length=" + object.length + ")]";
			case "function":
				try {
					return "[Function(" + getFunctionName(object.toString()) + ")]";
				} catch (e) {
					return "[Function]";
				}
		}

		throw "getType() returned an invalid value";
	}
	
	function compareIterables(left, right) {
		var key,
			errorInScope = typeof(Error) !== "undefined",
			rightIsError = errorInScope && right instanceof Error,
			leftIsError = errorInScope && left instanceof Error;

		//ignore Error.stack, so that we can more easily compare thrown errors
		for (key in right) {
			if (key === "stack" && rightIsError) {
				continue;
			}

			if (typeof(left[key]) === "undefined" || !new constraints.EqualTo(right[key]).isValidFor(left[key])) {
				return false;
			}
		}

		for (key in left) {
			if (key === "stack" && leftIsError) {
				continue;
			}

			if (typeof(right[key]) === "undefined" || !new constraints.EqualTo(left[key]).isValidFor(right[key])) {
				return false;
			}
		}
		
		return true;
	}
	
	function shouldUseHtmlDiff(expected, actual) {
		return exports.htmlDiffs &&
			doc && 
			doc.createElement && 
			typeof(actual) === "string" && 
			typeof(expected) === "string";
	}

	constraints = {
		IdenticalTo: function(expected) {
			this.isValidFor = function(actual) {
				return actual === expected;
			};

			this.getFailureMessage = function(actual, negate) {
				var message;
				if (shouldUseHtmlDiff(expected, actual)) {
					return getDiffNodes(expected, actual);
				}

				message = "Failed asserting that two " + getType(expected) + "s are " + (negate ? "not " : "") + "identical" + "\n\n";
				return message + getBinaryFailureMessage(toString(expected), toString(actual));
			}
		},

		EqualTo: function(expected) {
			this.isValidFor = function(actual) {
				if (expected === actual) {
					//short circuit for reference equality
					return true;
				}

				//regular expressions are a special case, because they're handled differently in different browsers
				if (actual instanceof RegExp && expected instanceof RegExp) {
					return actual.toString() === expected.toString();
				}

				//testing for null because typeof(null) === "object"
				if (expected !== null && typeof(expected) === "object") {
					return actual !== null &&
						typeof(actual) === "object" &&
						getFunctionName(actual.constructor) === getFunctionName(expected.constructor) &&
						compareIterables(actual, expected);
				}

				return actual == expected;
			};

			this.getFailureMessage = function(actual, negate) {
				var message;
				if (shouldUseHtmlDiff(expected, actual)) {
					return getDiffNodes(expected, actual);
				}

				message = "Failed asserting that two " + getType(expected) + "s are " + (negate ? "not " : "") + "equal" + "\n\n";
				return message + getBinaryFailureMessage(toString(expected), toString(actual));
			};
		},

		LessThan: function(expected) {
			this.isValidFor = function(actual) {
				return actual < expected;
			};

			this.getFailureMessage = function(actual, negate) {
				return "Expected " + toString(actual) + " to " + (negate ? "not " : "") + "be less than " + toString(expected);
			}
		},

		LessThanOrEqualTo: function(expected) {
			this.isValidFor = function(actual) {
				return actual <= expected;
			};

			this.getFailureMessage = function(actual, negate) {
				return "Expected " + toString(actual) + " to " + (negate ? "not " : "") + "be less than or equal to " + toString(expected);
			}
		},

		GreaterThan: function(expected) {
			this.isValidFor = function(actual) {
				return actual > expected;
			};

			this.getFailureMessage = function(actual, negate) {
				return "Expected " + toString(actual) + " to " + (negate ? "not " : "") + "be greater than " + toString(expected);
			}
		},

		GreaterThanOrEqualTo: function(expected) {
			this.isValidFor = function(actual) {
				return actual >= expected;
			};

			this.getFailureMessage = function(actual, negate) {
				return "Expected " + toString(actual) + " to " + (negate ? "not " : "") + "be greater than or equal to " + toString(expected);
			}
		},

		Regex: function(regex) {
			this.isValidFor = function(actual) {
				return typeof(actual) === "string" && regex.test(actual);
			};

			this.getFailureMessage = function(actual, negate) {
				return "Expected " + toString(actual) + " to " + (negate ? "not " : "") + "match the regular expression " + regex.toString();
			}
		},

		Not: function(constraint) {
			this.isValidFor = function(actual) {
				return !constraint.isValidFor(actual);
			};

			this.getFailureMessage = function(actual) {
				return constraint.getFailureMessage(actual, true);
			};
		},

		Null: function() {
			this.isValidFor = function(actual) {
				return actual === null;
			};

			this.getFailureMessage = function(actual, negate) {
				return "Expected " + toString(actual) + " to " + (negate ? "not " : "") + "be null";
			}
		},

		True: function() {
			this.isValidFor = function(actual) {
				return actual === true;
			};

			this.getFailureMessage = function(actual, negate) {
				return "Expected " + toString(actual) + " to " + (negate ? "not " : "") + "be true";
			}
		},

		False: function() {
			this.isValidFor = function(actual) {
				return actual === false;
			};

			this.getFailureMessage = function(actual, negate) {
				return "Expected " + toString(actual) + " to " + (negate ? "not " : "") + "be false";
			}
		},

		Empty: function() {
			this.isValidFor = function(actual) {
				return actual === null ||
					actual === "" ||
					actual === undefined ||
					(typeof(actual) === "object" && compareIterables(actual, {}));
			};

			this.getFailureMessage = function(actual, negate) {
				return "Expected " + toString(actual) + " to " + (negate ? "not " : "") + "be empty";
			}
		},

		Undefined: function() {
			this.isValidFor = function(actual) {
				return actual === undefined;
			};

			this.getFailureMessage = function(actual, negate) {
				return "Expected " + toString(actual) + " to " + (negate ? "not " : "") + "be undefined";
			}
		},

		ContainsValue: function(value) {
			var equalTo = new constraints.EqualTo(value);

			this.isValidFor = function(collection) {
				var key;
				for (key in collection) {
					if (equalTo.isValidFor(collection[key])) {
						return true;
					}
				}

				return false;
			};

			this.getFailureMessage = function(actual, negate) {
				return "Expected " + toString(actual) + " to " + (negate ? "not " : "") + "contain the value " + toString(value);
			}
		},

		ContainsKey: function(key) {
			var equalTo = new constraints.EqualTo(key);
			this.isValidFor = function(collection) {
				var i;
				for (i in collection) {
					if (equalTo.isValidFor(i)) {
						return true;
					}
				}

				return false;
			};

			this.getFailureMessage = function(actual, negate) {
				return "Expected " + toString(actual) + " to " + (negate ? "not " : "") + "contain the key " + toString(key);
			}
		},

		ObjectPropertyValue: function(property, constraint) {
			this.isValidFor = function(actual) {
				if (!actual || typeof(actual[property]) === "undefined") {
					return false;
				}

				return constraint.isValidFor(actual[property]);
			};

			this.getFailureMessage = function(actual) {
				var message = "Failed making an assertion on an object with property \"" + property + "\"" + "\n\n",
					constraintMessage = constraint.getFailureMessage(actual[property]);

				if (typeof(constraintMessage) !== "string") {
					//node list (e.g. HTML for diff between strings)
					message = doc.createTextNode(message);
					constraintMessage.unshift(message);
					return constraintMessage;
				}

				return message + constraintMessage;
			}
		}
	};

	function AssertionInterface(factory) {
		this.factory = factory;
	}
	
	AssertionInterface.prototype = {
		identicalTo: function(expected) {
			return this.factory(new  constraints.IdenticalTo(expected));
		},
		
		equalTo: function(expected) {
			return this.factory(new  constraints.EqualTo(expected));
		},
		
		lessThan: function(expected) {
			return this.factory(new  constraints.LessThan(expected));
		},
		
		lessThanOrEqualTo: function(expected) {
			return this.factory(new  constraints.LessThanOrEqualTo(expected));
		},
		
		greaterThan: function(expected) {
			return this.factory(new constraints.GreaterThan(expected));
		},
		
		greaterThanOrEqualTo: function(expected) {
			return this.factory(new constraints.GreaterThanOrEqualTo(expected));
		},
		
		regexMatch: function(regex) {
			return this.factory(new constraints.Regex(regex));
		},
		
		NULL: function() { return this.factory(new constraints.Null()) },
		TRUE: function() { return this.factory(new constraints.True()) },
		FALSE: function() { return this.factory(new constraints.False()) },
		empty: function() { return this.factory(new constraints.Empty()) },
		"undefined": function() { return this.factory(new constraints.Undefined()) }
	};
	
	function CollectionAssertionInterface(factory) {
		this.factory = factory;
	}

	CollectionAssertionInterface.prototype = {
		value: function(value) {
			return this.factory(new constraints.ContainsValue(value));
		},

		key: function(key) {
			return this.factory(new constraints.ContainsKey(key));
		},

		property: function(property) {
			var assertionInterface = new AssertionInterface(function(constraint) {
				return new constraints.ObjectPropertyValue(property, constraint);
			});

			assertionInterface.not = new AssertionInterface(function(constraint) {
				return new constraints.Not(new constraints.ObjectPropertyValue(property, constraint));
			});

			return assertionInterface;
		}
	};

	function cleanStackTrace(frames) {
		var newFrames = [],
			i;
		
		for (i = frames.length - 1; i >= 0; i--) {
			//get rid of superfluous stack frames in chrome/ie
			if (/(Object doesn't support property or method 'undef'|Object.createException)/.test(frames[i])) {
				break;
			}
			
			newFrames.unshift(frames[i]);
		}
		
		return newFrames;
	}

	function JarvisError(message, type, thrownError) { 
		this.message = message;
		this.type = type;
		this.stackTrace = [];

		var error = !thrownError || typeof(thrownError.stack) === "undefined" ? new Error() : thrownError;
		if (typeof(error.stack) !== "undefined") {
			//node and browsers that support it
			this.stackTrace = error.stack
				.split("\n")
				//.slice(2) //only applicable to node
				.filter(function(frame) { return !/\(module\.js:\d+:\d+\)$/.test(frame) && !/^\s*$/.test(frame); })
				.map(function(frame) { return frame.replace(/^\s*at\s*/, ""); });
		} else if (shouldShowStackTraceInBrowser()) {
			this.stackTrace = cleanStackTrace(window.getStackTrace({ e: thrownError }));
		}
	}

	function shouldShowStackTraceInBrowser() {
		return typeof(window) !== "undefined" &&
			exports.showStackTraces &&
			typeof(window.getStackTrace) !== "undefined" &&
			typeof(window.opera) === "undefined";
	}

	function identity(x) {
		return x;
	}

	function negatedIdentity(x) {
		return new constraints.Not(x);
	}

	var TestRunner = {
		run: function() {},
		reporter: null,
		handleError: function(error, test) {
			if (!(error instanceof JarvisError)) {
				//not a jarvis error
				if (!test.expectedError) {
					test.expectedError = globalExpectedError;
				}

				//verify that it wasn't expected
				if (test.expectedError !== undefined) {
					//expectedError was set, so check to see if the thrown error matches what was expected
					if (test.expectedError !== true && !new constraints.EqualTo(test.expectedError).isValidFor(error)) {
						error = new JarvisError(
							"Expected error, " + toString(test.expectedError) + ", did not match actual error, " + toString(error),
							"fail",
							error
						);
					} else {
						error = undefined;
					}
				} else {
					error = new JarvisError("An error occurred while running the test: " + (error.toString ? error.toString() : error), "error", error);
				}
			}

			return error;
		}
	};

	exports.Framework = {
		Reporters: {}, //only relevant for browser context
		Error: JarvisError,
		Constraints: constraints,
		Test: Test,
		TestRunner: TestRunner,
		Assert: {
			that: function(actual, constraint, message) {
				if (!constraint.isValidFor(actual)) {
					var constraintMessage = constraint.getFailureMessage(actual);
					message = message ? message + "\n\n" : "";

					if (typeof(constraintMessage) === "string") {
						constraintMessage = message + constraintMessage;
					}

					throw new JarvisError(constraintMessage, "fail");
				}
			},

			willThrow: function(expectedError) {
				if (expectedError === true) {
					throw new JarvisError("Cannot set expected error to true", "error");
				}

				globalExpectedError = expectedError !== undefined ? expectedError : true;
			},

			fail: function(message) {
				throw new JarvisError(message, "fail");
			},

			ignore: function(message) {
				throw new JarvisError(message, "ignore");
			}
		},
		AssertionInterface: AssertionInterface,
		CollectionAssertionInterface: CollectionAssertionInterface,
		Is: function() {
			var is = new AssertionInterface(identity);
			is.not = new AssertionInterface(negatedIdentity);
			return is;
		}(),
		Has: function() {
			var has = new CollectionAssertionInterface(identity);
			has.no = new CollectionAssertionInterface(negatedIdentity);
			has.no.property = undefined; //doesn't really make sense to make this kind of negative assertion
			return has;
		}()
	};

	exports.defaultReporter = null;
	exports.htmlDiffs = false;
	exports.showStackTraces = false;

	exports.summary = function(reporter) {
		reporter = reporter || this.defaultReporter;
		if (!reporter) {
			throw new Error("No reporter given");
		}

		reporter.summary();
	};

	function emptyCallbackHandler(callback) {
		callback && callback();
	}

	function Test(func, parentId) {
		this.setup = emptyCallbackHandler;
		this.tearDown = emptyCallbackHandler;
		this.func = func;
		this.id = ++testId;
		this.parentId = parentId;
		this.expectedError = undefined;
		this.assertions = 0;
		this.start = null;
		this.end = null;
		this.duration = Infinity;
		this.result = {
			status: "pass",
			message: "",
			stackTrace: []
		};

		this.startTest = function() {
			this.start = new Date().getTime();
		};
		
		this.endTest = function(error) {
			this.end = new Date().getTime();
			this.duration = this.end - this.start;

			this.result.status = error === undefined ? "pass" : error.type;
			this.result.message = error === undefined ? "" : error.message;
			this.result.stackTrace = error === undefined ? [] : error.stackTrace;
		};

		if (typeof(func) !== "function") {
			this.setup = func["setup"] || emptyFunc;
			this.tearDown = func["tearDown"] || emptyFunc;
			this.func = func["test"];
		}

		if (typeof(this.func) !== "function") {
			throw new Error("No test detected or given test is not a function");
		}

		this.name = getFunctionName(this.func).replace(/_/g, " ");
	}

	function SynchronousTestRunner(reporter) {
		this.reporter = reporter;
	}

	function runTest(test) {
		var runLastTearDown = true,
			error;

		try {
			test.setup();

			var childTests = test.func();
			test.expectedError = globalExpectedError;

			if (typeof(childTests) === "object") {
				if (isArray(childTests)) {
					//test suite
					runLastTearDown = false;
					test.tearDown();

					for (var i = 0; i < childTests.length; i++) {
						test.setup();
						this.run(childTests[i], test.id /* parentId */);
						test.tearDown();
					}
				} else {
					this.run(childTests, test.id /* parentId */);
				}
			}

			if (globalExpectedError) {
				throw new JarvisError("Expected error to be thrown: " + globalExpectedError, "fail");
			}
		} catch (e) {
			error = this.handleError(e, test);
		}

		if (runLastTearDown) {
			test.tearDown();
		}

		//reset global error
		globalExpectedError = undefined;
		test.endTest(error);
		this.reporter.endTest(test);
	}

	SynchronousTestRunner.prototype = TestRunner;

	SynchronousTestRunner.prototype.run = function(testFunc, parentId) {
		if (!this.reporter) {
			throw new Error("No reporter given");
		}

		var test = new Test(testFunc, parentId);

		test.startTest();
		this.reporter.startTest(test);
		runTest.call(this, test);
	};

	exports.run = function(test, reporter) {
		new SynchronousTestRunner(reporter || jarvis.defaultReporter).run(test);
	};


}(typeof(exports) === "undefined" ? (this["Jarvis"] = {}) : exports, typeof(document) !== "undefined" ? document : null));