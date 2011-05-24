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
		return match !== null ? match[1] : "<unnamed function>";
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
				
				return object;
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
		this.conjunction = "is identical to";
	}
	
	function EqualToConstraint(expected) {
		this.isValidFor = function(actual) {
			if (expected !== null && typeof(expected) === "object") {
				return compareIterables(actual, expected);
			}
			
			return actual == expected;
		};
		this.conjunction = "is equal to";
	}
	
	function LessThanConstraint(expected) {
		this.isValidFor = function(actual) {
			return actual < expected;
		};
		this.conjunction = "is less than";
	}
	
	function LessThanOrEqualToConstraint(expected) {
		this.isValidFor = function(actual) {
			return actual <= expected;
		};
		this.conjunction = "is less than or equal to";
	}
	
	function GreaterThanConstraint(expected) {
		this.isValidFor = function(actual) {
			return actual > expected;
		};
		this.conjunction = "is greater than";
	}
	
	function GreaterThanOrEqualToConstraint(expected) {
		this.isValidFor = function(actual) {
			return actual >= expected;
		};
		this.conjunction = "is greater than or equal to";
	}
	
	function RegexConstraint(regex) {
		this.isValidFor = function(actual) {
			return typeof(actual) === "string" && regex.match(actual);
		};
		this.conjunction = "matches";
	}

	function NotConstraint(constraint) {
		this.isValidFor = function(actual) {
			return !constraint.isValidFor(actual);
		};
		
		this.conjunction = constraint.conjunction.replace(/\bis\b/g, "is not").replace(/\bmatches\b/g, "does not match").replace(/\contains\b/g, "does not contain");
	}
	
	function NullConstraint() {
		this.isValidFor = function(actual) {
			return actual === null;
		};
		this.conjunction = "is null";
	}
	
	function EmptyConstraint() {
		this.isValidFor = function(actual) {
			return actual === null 
				|| actual === ""
				|| actual === undefined
				|| (actual.length && actual.length === 0);
		};
		this.conjunction = "is empty";
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
		
		this.conjunction = "contains";
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
		
		this.conjunction = "contains property";
	}
	
	function LengthConstraint(length) {
		this.isValidFor = function(actual) {
			return actual.length !== undefined && actual.length === length;
		};
		this.conjunction = "has length";
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
	
	Assert = function() {
		function getFailureMessage(actual, constraint, message) {
			return (message ? message + "\n\n" : "") + 
				"Failed asserting that " + 
				toString(actual) + 
				" " + 
				constraint.conjunction;
		}
		
		return {
			that: function(actual, constraint, message) {
				assertionCount++;
				if (!constraint.isValidFor(actual)) {
					throw new JarvisError(getFailureMessage(actual, constraint, message), "fail");
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
	}();
	
	function ConsoleReporter() {
		var tests = {};
		
		this.startTest = function(name, id) {
			var test = { 
				name: name,
				startTime: new Date().getTime()
			};
			
			tests[id] = test;
			
			console.group(test.name);
		};
		
		this.endTest = function(result, id) {
			var endTime = new Date().getTime();
			var test = tests[id];
			
			switch (result.status) {
				case "fail":
				case "error":
					console.error(result.message);
					break;
				case "ignore":
					console.warn(result.message);
					break;
			}
			
			console.log("    %dms, %d assertion%s", endTime - test.startTime, result.assertions, result.assertions !== 1 ? "s" : "");
			console.groupEnd();
			tests[id] = undefined;
		};
	}
	
	function HtmlReporter(doc, container) {
		doc = doc || document;
		container = container || doc.body;
		var tests = {};
		
		function getAggregateStatus(results) {
			var status = "pass";
			for (var i = 0; i < results.length; i++) {
				if (results[i] !== "pass") {
					if (results[i] === "ignore" && (i === 0 || status === "ignore")) {
						//parent status gets set to ignore only if ALL child statuses are ignore
						status = "ignore";
					} else {
						//otherwise it's a fail and we bail
						status = "fail";
						break;
					}
				}
			}
			
			return status;
		}
		
		this.startTest = function(name, id, parentId) {
			var element = doc.createElement("div");
			element.className = "jarvis-test jarvis-test-result-running";
			var title = doc.createElement("p");
			title.appendChild(doc.createTextNode(name));
			
			element.appendChild(title);
			
			var test = { 
				name: name,
				startTime: new Date().getTime(),
				endTime: 0,
				element: element,
				parentId: parentId,
				childContainer: null,
				childResults: []
			};
			
			var parent;
			if (tests[parentId]) {
				if (!tests[parentId].childContainer) {
					var childContainer = doc.createElement("div");
					childContainer.className = "jarvis-child-test-container";
					childContainer.style.display = "none";
					tests[parentId].element.appendChild(childContainer);
					tests[parentId].childContainer = childContainer;
				}
				
				parent = tests[parentId].childContainer;
			} else {
				parent = container;
			}
			
			parent.appendChild(test.element);
			
			tests[id] = test;
		};
		
		this.endTest = function(result, id) {
			var test = tests[id],
				parent,
				actualStatus,
				info = "",
				messageContainer,
				i,
				childResultCount;
				
			test.endTime = new Date().getTime();
			test.assertions = result.assertions;
			
			childResultCount = {
				fail: 0,
				pass: 0,
				ignore: 0,
				error: 0,
				total: test.childResults.length,
			};
			
			for (i = 0; i < test.childResults.length; i++) {
				childResultCount[test.childResults[i]]++;
			}
			
			actualStatus = getAggregateStatus(test.childResults);
			if (actualStatus === "pass") {
				actualStatus = result.status;
			}
			
			if (test.parentId) {
				//update parent
				tests[test.parentId].childResults.push(actualStatus);
			}
			
			test.element.className = "jarvis-test jarvis-test-result-" + actualStatus;
			
			if (childResultCount.total > 0) {
				info = 
					"[" + 
						childResultCount.pass + " / " + childResultCount.total + " - " + 
						(Math.round(childResultCount.pass * 10000 / childResultCount.total) / 100) + 
					"%] ";
			}
			
			info += "(" + (test.endTime - test.startTime) + "ms, " + test.assertions + " assertions)";
			test.element.firstChild.appendChild(doc.createTextNode(" " + info));
			
			if (result.message) {
				messageContainer = doc.createElement("pre");
				messageContainer.appendChild(doc.createTextNode(result.message));
				messageContainer.style.display = "none";
				test.element.appendChild(messageContainer);
			}
			if (result.message || childResultCount.total > 0) {
				test.element.firstChild.style.cursor = "pointer";
				test.element.firstChild.onclick = titleClick;
			}
			
			delete tests[id];
		};
		
		function titleClick() {
			var display = this.nextSibling.style.display;
			this.nextSibling.style.display = display === "none" ? "block" : "none";
		}
	}
	
	var testId = 1;
	
	global.Assert = Assert;
	global.Is = Is;
	global.Has = Has;
	global.Has = Has;
	global.Jarvis = {
		reporter: new ConsoleReporter(),
		ConsoleReporter: ConsoleReporter,
		HtmlReporter: HtmlReporter,
		
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
				
				if (expectedError) {
					//expectedError was set, so check to see if the thrown error matches what was expected
					var equalTo = new EqualToConstraint(expectedError);
					if (expectedError !== true && !equalTo.isValidFor(error)) {
						caughtError = new JarvisError(
							"Expected error, " + toString(expectedError) + ", did not match actual error, " + toString(error),
							"fail"
						);
					}
				} else {
					if (typeof(error["!!jarvis"]) === "undefined") {
						//not a jarvis error
						error = new JarvisError("An error occurred while running the test: " + (error.toString ? error.toString() : error), "error");
					}
					
					caughtError = error;
				}
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