(function(global, doc, undefined){
	
	var Assert,
		Is,
		Contains,
		assertionCount = 0,
		globalExpectedError;
	
	function isArray(o) {
		return Object.prototype.toString.call(o) === '[object Array]';
	}
	
	function getFunctionName(func) {
		var match = /^function\s([\w$]+)\(\)\s\{/.exec(func.toString());
		if (!match && func.constructor) {
			return getFunctionName(func.constructor);
		}
		
		return match !== null ? match[1] : "<unnamed function>";
	}
	
	//adapted from diff_match_patch.diff_prettyHtml()
	function getDiffNodes(expected, actual) {
		//compute diff
		var diff = new diff_match_patch();
		var diffs = diff.diff_main(expected, actual);
		diff.diff_cleanupSemantic(diffs);
		
		var html = [];
		var i = 0;
		var pattern_amp = /&/g;
		var pattern_lt = /</g;
		var pattern_gt = />/g;
		var pattern_para = /\n/g;
		for (var x = 0; x < diffs.length; x++) {
			var op = diffs[x][0];    // Operation (insert, delete, equal)
			var data = diffs[x][1];  // Text of change.
			var text = data.replace(pattern_amp, "&amp;")
				.replace(pattern_lt, "&lt;")
				.replace(pattern_gt, "&gt;")
				.replace(pattern_para, "&para;<br />");
			
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
		
		var html = html.join('');
		
		var pre = doc.createElement("pre");
		pre.innerHTML = html;
		
		var nodes = pre.cloneNode(true).children;
		var actualNodes = [];
		for (var i = 0; i < nodes.length; i++) {
			actualNodes[i] = nodes[i];
		}
		pre = null;
		return actualNodes;
	}
	
	function getBinaryFailureMessage(expected, actual) {
		return "Expected: " + expected + "\nActual:   " + actual;
	}
	
	function getType(object) {
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
	}
	
	function compareIterables(left, right) {
		var key, constraint;
		
		for (key in right) {
			constraint = new EqualToConstraint(right[key]);
			if (typeof(left[key]) === "undefined" || !constraint.isValidFor(left[key])) {
				return false;
			}
		}
		
		for (key in left) {
			constraint = new EqualToConstraint(left[key]);
			if (typeof(right[key]) === "undefined" || !constraint.isValidFor(right[key])) {
				return false;
			}
		}
		
		return true;
	}
	
	function shouldUseHtmlDiff(expected, actual) {
		return typeof(global.diff_match_patch) !== "undefined" && 
			Jarvis.htmlDiffs && 
			doc && 
			doc.createElement && 
			typeof(actual) === "string" && 
			typeof(expected) === "string";
	}
	
	function IdenticalToConstraint(expected) {
		this.isValidFor = function(actual) {
			return actual === expected;
		};
		
		this.getFailureMessage = function(actual, negate) {
			if (shouldUseHtmlDiff(expected, actual)) {
				return getDiffNodes(expected, actual);
			}
			
			var message = "Failed asserting that two " + getType(expected) + "s are " + (negate ? "not " : "") + "identical\n\n";
			return message + getBinaryFailureMessage(toString(expected), toString(actual));
		}
	}
	
	function EqualToConstraint(expected) {
		this.isValidFor = function(actual) {
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
			if (shouldUseHtmlDiff(expected, actual)) {
				return getDiffNodes(expected, actual);
			}
			
			var message = "Failed asserting that two " + getType(expected) + "s are " + (negate ? "not " : "") + "equal\n\n";
			return message + getBinaryFailureMessage(toString(expected), toString(actual));
		};
	}
	
	function LessThanConstraint(expected) {
		this.isValidFor = function(actual) {
			return actual < expected;
		};
		this.getFailureMessage = function(actual, negate) {
			return "Expected " + toString(actual) + " to " + (negate ? "not " : "") + "be less than " + toString(expected);
		}
	}
	
	function LessThanOrEqualToConstraint(expected) {
		this.isValidFor = function(actual) {
			return actual <= expected;
		};
		this.getFailureMessage = function(actual, negate) {
			return "Expected " + toString(actual) + " to " + (negate ? "not " : "") + "be less than or equal to " + toString(expected);
		}
	}
	
	function GreaterThanConstraint(expected) {
		this.isValidFor = function(actual) {
			return actual > expected;
		};
		this.getFailureMessage = function(actual, negate) {
			return "Expected " + toString(actual) + " to " + (negate ? "not " : "") + "be greater than " + toString(expected);
		}
	}
	
	function GreaterThanOrEqualToConstraint(expected) {
		this.isValidFor = function(actual) {
			return actual >= expected;
		};
		this.getFailureMessage = function(actual, negate) {
			return "Expected " + toString(actual) + " to " + (negate ? "not " : "") + "be greater than or equal to " + toString(expected);
		}
	}
	
	function RegexConstraint(regex) {
		this.isValidFor = function(actual) {
			return typeof(actual) === "string" && regex.test(actual);
		};
		this.getFailureMessage = function(actual, negate) {
			return "Expected " + toString(actual) + " to " + (negate ? "not " : "") + "match the regular expression " + toString(regex);
		}
	}

	function NotConstraint(constraint) {
		this.isValidFor = function(actual) {
			return !constraint.isValidFor(actual);
		};
		
		this.getFailureMessage = function(actual) {
			return constraint.getFailureMessage(actual, true);
		};
	}
	
	function NullConstraint() {
		this.isValidFor = function(actual) {
			return actual === null;
		};
		
		this.getFailureMessage = function(actual, negate) {
			return "Expected " + toString(actual) + " to " + (negate ? "not " : "") + "be null";
		}
	}
	
	function EmptyConstraint() {
		this.isValidFor = function(actual) {
			return actual === null || 
				actual === "" || 
				actual === undefined || 
				(typeof(actual) === "object" && compareIterables(actual, {}));
		};
		
		this.getFailureMessage = function(actual, negate) {
			return "Expected " + toString(actual) + " to " + (negate ? "not " : "") + "be empty";
		}
	}
	
	function UndefinedConstraint() {
		this.isValidFor = function(actual) {
			return actual === undefined;
		};
		
		this.getFailureMessage = function(actual, negate) {
			return "Expected " + toString(actual) + " to " + (negate ? "not " : "") + "be undefined";
		}
	}
	
	function ContainsValueConstraint(value) {
		var equalTo = new EqualToConstraint(value);
		this.isValidFor = function(collection) {
			for (var key in collection) {
				if (equalTo.isValidFor(collection[key])) {
					return true;
				}
			}
			
			return false;
		};
		
		this.getFailureMessage = function(actual, negate) {
			return "Expected " + toString(actual) + " to " + (negate ? "not " : "") + "contain the value " + toString(value);
		}
	}
	
	function ContainsKeyConstraint(key) {
		var equalTo = new EqualToConstraint(key);
		this.isValidFor = function(collection) {
			for (var i in collection) {
				if (equalTo.isValidFor(i)) {
					return true;
				}
			}
			
			return false;
		};
		
		this.getFailureMessage = function(actual, negate) {
			return "Expected " + toString(actual) + " to " + (negate ? "not " : "") + "contain the key " + toString(key);
		}
	}
	
	function ObjectPropertyValueConstraint(property, constraint) {
		this.isValidFor = function(actual) {
			if (!actual || typeof(actual[property]) === "undefined") {
				return false;
			}
			
			return constraint.isValidFor(actual[property]);
		};
		
		this.getFailureMessage = function(actual) {
			var message = "Failed making an assertion on an object with property \"" + property + "\"\n\n";
			var constraintMessage = constraint.getFailureMessage(actual[property]);
			
			if (typeof(constraintMessage) !== "string") {
				//node list (e.g. HTML for diff between strings)
				message = doc.createTextNode(message);
				constraintMessage.unshift(message);
				return constraintMessage;
			}
			
			return message + constraintMessage;
		}
	}
	
	function AssertionInterface(factory) {
		this.identicalTo = function(expected) {
			return factory(new IdenticalToConstraint(expected));
		};
		
		this.equalTo = function(expected) {
			return factory(new EqualToConstraint(expected));
		};
		
		this.lessThan = function(expected) {
			return factory(new LessThanConstraint(expected));
		};
		
		this.lessThanOrEqualTo = function(expected) {
			return factory(new LessThanOrEqualToConstraint(expected));
		};
		
		this.greaterThan = function(expected) {
			return factory(new GreaterThanConstraint(expected));
		};
		
		this.greaterThanOrEqualTo = function(expected) {
			return factory(new GreaterThanOrEqualToConstraint(expected));
		};
		
		this.regexMatch = function(regex) {
			return factory(new RegexConstraint(regex));
		};
		
		this.NULL = factory(new NullConstraint());
		
		this.empty = factory(new EmptyConstraint());
		
		this.undefined = factory(new UndefinedConstraint());
	};
	
	function CollectionAssertionInterface(factory) {
		this.value = function(value) {
			return factory(new ContainsValueConstraint(value));
		};
		
		this.key = function(key) {
			return factory(new ContainsKeyConstraint(key));
		};
		
		this.property = function(property) {
			var iface = new AssertionInterface(function(constraint) {
				return new ObjectPropertyValueConstraint(property, constraint);
			});
			
			iface.not = new AssertionInterface(function(constraint) {
				return new NotConstraint(new ObjectPropertyValueConstraint(property, constraint));
			});
			
			return iface;
		};
	}
	
	function JarvisError(message, type) { 
		this.message = message; 
		this.type = type;
		this["!!jarvis"] = true;
	}
	
	Is = new AssertionInterface(function(constraint) { return constraint; });
	Is.not = new AssertionInterface(function(constraint) { return new NotConstraint(constraint); });
	
	Contains = new CollectionAssertionInterface(function(constraint) { return constraint; });
	Contains.not = new CollectionAssertionInterface(function(constraint) { return new NotConstraint(constraint); });
	Contains.not.property = undefined; //doesn't really make sense to make this kind of negative assertion
	
	Assert = {
		that: function(actual, constraint, message) {
			assertionCount++;
			if (!constraint.isValidFor(actual)) {
				message = message ? message + "\n\n" : "";
				
				var constraintMessage = constraint.getFailureMessage(actual);
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
	};
	
	var testId = 1;
	
	global.Assert = Assert;
	global.Is = Is;
	global.Contains = Contains;
	global.Jarvis = {
		reporter: null,
		htmlDiffs: false,
		
		Error: JarvisError,
		
		run: function(test, parentId) {
			var id = (testId++),
				caughtError,
				assertionCountAtStart = assertionCount,
				i,
				result,
				expectedError,
				tests,
				setup = function() {},
				tearDown = function() {};
				
			if (typeof(test) !== "function") {
				setup = test.setup;
				tearDown = test.tearDown;
				test = test.test;
				if (!test) {
					throw "No test detected";
				}
			}
			
			name = getFunctionName(test).replace(/_/g, " ");
			
			this.reporter.startTest(name, id, parentId);
			try {
				setup && setup();
				tests = test();
				expectedError = globalExpectedError;
				if (typeof(tests) === "object") {
					if (isArray(tests)) {
						//run a suite of tests
						for (i = 0; i < tests.length; i++) {
							this.run(tests[i], id);
						}
					} else {
						this.run(tests, id);
					}
				}
				
				if (expectedError !== undefined) {
					throw new JarvisError("Expected " + toString(expectedError) + " to be thrown", "fail");
				}
			} catch (error) {
				if (typeof(error["!!jarvis"]) === "undefined") {
					//not a jarvis error
					if (!expectedError) {
						expectedError = globalExpectedError;
					}
					
					//verify that it wasn't expected
					if (expectedError !== undefined) {
						//expectedError was set, so check to see if the thrown error matches what was expected
						var equalTo = new EqualToConstraint(expectedError);
						if (expectedError !== true && !equalTo.isValidFor(error)) {
							error = new JarvisError(
								"Expected error, " + toString(expectedError) + ", did not match actual error, " + toString(error),
								"fail"
							);
						} else {
							error = undefined;
						}
					} else {
						error = new JarvisError("An error occurred while running the test: " + (error.toString ? error.toString() : error), "error");
					}
				}
				
				caughtError = error;
			}
			
			tearDown && tearDown();
			
			result = {
				status: caughtError === undefined ? "pass" : caughtError.type,
				message: caughtError === undefined ? "" : caughtError.message,
				assertions: assertionCount - assertionCountAtStart
			};
			
			this.reporter.endTest(result, id);
			globalExpectedError = undefined;
		}
	};
	
}(this, document));