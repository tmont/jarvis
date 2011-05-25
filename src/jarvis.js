(function(global, undefined){
	
	var Assert,
		Is,
		Has,
		assertionCount = 0,
		globalExpectedError;
	
	function isArray(o) {
		return Object.prototype.toString.call(o) === '[object Array]';
	}
	
	function getFunctionName(func) {
		var match = /function\s([\w$]+)\(\)\s\{/.exec(func.toString());
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
		console.log(html);
		
		var pre = document.createElement("pre");
		pre.innerHTML = html;
		
		var nodes = pre.cloneNode(true).children;
		var actualNodes = [];
		for (var i = 0; i < nodes.length; i++) {
			actualNodes[i] = nodes[i];
		}
		pre = null;
		return actualNodes;
	}
	
	function getBinaryFailureMessage(actual, expected) {
		return "Expected: " + expected + "\nActual:   " + actual;
	}
	
	function getType(object) {
		var type = typeof(object);
		switch (type) {
			case "string":
			case "number":
			case "boolean":
			case "function":
				return type;
			case "object":
				if (object === null) {
					return "null";
				}
				if (object === undefined) {
					return "undefined";
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
					object = object.substring(0, 50) + "..." + object.substring(object.substring.length - 50);
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
				return "[Object(" + getFunctionName(object.constructor.toString()) + ")]: " + object.toString();
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
	
	function IdenticalToConstraint(expected) {
		this.isValidFor = function(actual) {
			return actual === expected;
		};
		
		this.getFailureMessage = function(actual) {
			if (Jarvis.htmlDiffs && typeof(actual) === "string" && typeof(expected) === "string") {
				return getDiffNodes(expected, actual);
			}
			
			return getBinaryFailureMessage(toString(expected), toString(actual));
		}
	}
	
	function EqualToConstraint(expected) {
		this.isValidFor = function(actual) {
			if (expected !== null && typeof(expected) === "object") {
				return compareIterables(actual, expected);
			}
			
			return actual == expected;
		};
		
		this.getFailureMessage = function(actual) {
			if (Jarvis.htmlDiffs && typeof(actual) === "string" && typeof(expected) === "string") {
				return getDiffNodes(expected, actual);
			}
			
			return getBinaryFailureMessage(toString(expected), toString(actual));
		}
	}
	
	function LessThanConstraint(expected) {
		this.isValidFor = function(actual) {
			return actual < expected;
		};
		this.getFailureMessage = function(actual) {
			return "Expected " + toString(actual) + " to be less than " + toString(expected);
		}
	}
	
	function LessThanOrEqualToConstraint(expected) {
		this.isValidFor = function(actual) {
			return actual <= expected;
		};
		this.getFailureMessage = function(actual) {
			return "Expected " + toString(actual) + " to be less than or equal to " + toString(expected);
		}
	}
	
	function GreaterThanConstraint(expected) {
		this.isValidFor = function(actual) {
			return actual > expected;
		};
		this.getFailureMessage = function(actual) {
			return "Expected " + toString(actual) + " to be greater than " + toString(expected);
		}
	}
	
	function GreaterThanOrEqualToConstraint(expected) {
		this.isValidFor = function(actual) {
			return actual >= expected;
		};
		this.getFailureMessage = function(actual) {
			return "Expected " + toString(actual) + " to be greater than or equal to " + toString(expected);
		}
	}
	
	function RegexConstraint(regex) {
		this.isValidFor = function(actual) {
			return typeof(actual) === "string" && regex.match(actual);
		};
		this.getFailureMessage = function(actual) {
			return "Expected " + toString(actual) + " to match the regular expression " + toString(expected);
		}
	}

	function NotConstraint(constraint) {
		this.isValidFor = function(actual) {
			return !constraint.isValidFor(actual);
		};
		
		this.getFailureMessage = function(actual) {
			return constraint.getFailureMessage(actual).replace(/\bto\b/g, "to not");
		};
	}
	
	function NullConstraint() {
		this.isValidFor = function(actual) {
			return actual === null;
		};
		
		this.getFailureMessage = function(actual) {
			return "Expected " + toString(actual) + " to be null";
		}
	}
	
	function EmptyConstraint() {
		this.isValidFor = function(actual) {
			return actual === null 
				|| actual === ""
				|| actual === undefined
				|| (actual.length && actual.length === 0);
		};
		
		this.getFailureMessage = function(actual) {
			return "Expected " + toString(actual) + " to be empty";
		}
	}
	
	function ContainsMemberConstraint(value) {
		var equalTo = new EqualToConstraint(value);
		this.isValidFor = function(collection) {
			for (var key in collection) {
				if (equalTo.isValidFor(collection[key])) {
					return true;
				}
			}
			
			return false;
		};
		
		this.getFailureMessage = function(actual) {
			return "Expected " + toString(actual) + " to contain " + toString(value);
		}
	}
	
	function ContainsPropertyConstraint(property) {
		var equalTo = new EqualToConstraint(property);
		this.isValidFor = function(collection) {
			for (var key in collection) {
				if (equalTo.isValidFor(key)) {
					return true;
				}
			}
			
			return false;
		};
		
		this.getFailureMessage = function(actual) {
			return "Expected " + toString(actual) + " to contain the property " + toString(property);
		}
	}
	
	function LengthConstraint(length) {
		this.isValidFor = function(actual) {
			return actual.length !== undefined && actual.length === length;
		};
		this.getFailureMessage = function(actual) {
			return "Expected " + toString(actual) + " to have " + toString(expected) + " elements";
		}
	}
	
	function AssertionInterface(factory) {
		this.identicalTo = function(expected) {
			return factory(new IdenticalToConstraint(expected));
		},
		
		this.equalTo = function(expected) {
			return factory(new EqualToConstraint(expected));
		},
		
		this.lessThan = function(expected) {
			return factory(new LessThanConstraint(expected));
		},
		
		this.lessThanOrEqualTo = function(expected) {
			return factory(new LessThanOrEqualToConstraint(expected));
		},
		
		this.greaterThan = function(expected) {
			return factory(new GreaterThanConstraint(expected));
		},
		
		this.greaterThanOrEqualTo = function(expected) {
			return factory(new GreaterThanOrEqualToConstraint(expected));
		},
		
		this.stringMatching = function(regex) {
			return factory(new RegexConstraint(regex));
		},
		
		this.NULL = factory(new NullConstraint()),
		
		this.empty = factory(new EmptyConstraint())
	};
	
	function CollectionAssertionInterface(factory) {
		this.member = function(value) {
			return factory(new ContainsMemberConstraint(value));
		};
		
		this.length = function(length) {
			return factory(new LengthConstraint(length));
		};
		
		this.property = function(property) {
			return factory(new ContainsPropertyConstraint(property));
		};
	}
	
	function JarvisError(message, type) { 
		this.message = message; 
		this.type = type;
		this["!!jarvis"] = true;
	}
	
	Is = new AssertionInterface(function(constraint) { return constraint; });
	Is.not = new AssertionInterface(function(constraint) { return new NotConstraint(constraint); });
	
	Has = new CollectionAssertionInterface(function(constraint) { return constraint; });
	Has.not = new CollectionAssertionInterface(function(constraint) { return new NotConstraint(constraint); });
	
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
			globalExpectedError = expectedError || true;
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
	global.Has = Has;
	global.Jarvis = {
		reporter: null,
		htmlDiffs: false,
		
		Error: JarvisError,
		
		run: function(test, name, parentId) {
			var id = (testId++),
				caughtError,
				assertionCountAtStart = assertionCount,
				i,
				result,
				expectedError,
				tests;
				
			name = name || getFunctionName(test).replace(/_/g, " ");
			
			this.reporter.startTest(name, id, parentId);
			try {
				tests = test();
				expectedError = globalExpectedError;
				if (tests !== undefined) {
					for (i = 0; i < tests.length; i++) {
						this.run(tests[i], null, id);
					}
				}
				
				if (expectedError) {
					throw new JarvisError("Expected error to be thrown", "fail");
				}
			} catch (error) {
				if (!expectedError) {
					expectedError = globalExpectedError;
				}
				
				if (typeof(error["!!jarvis"]) === "undefined") {
					//not a jarvis error
					
					//verify that it wasn't expected
					if (expectedError) {
						//expectedError was set, so check to see if the thrown error matches what was expected
						var equalTo = new EqualToConstraint(expectedError);
						if (expectedError !== true && !equalTo.isValidFor(error)) {
							caughtError = new JarvisError(
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
			
			
			
			result = {
				status: caughtError === undefined ? "pass" : caughtError.type,
				message: caughtError === undefined ? "" : caughtError.message,
				assertions: assertionCount - assertionCountAtStart
			};
			
			this.reporter.endTest(result, id);
			globalExpectedError = undefined;
		}
	};
	
}(this))