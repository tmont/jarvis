/**
 * Jarvis: JavaScript unit testing library
 *   (c) 2011 Tommy Montgomery <http://tommymontgomery.com/>
 *
 * More information: <http://jarvis.tmont.com/>
 * 
 * Released under the WTFPL <http://sam.zoy.org/wtfpl/>
 */
(function(global, doc, undefined){
	var $ = global.Sizzle,
		Assert,
		Is,
		Has,
		globalAssertionCount = 0,
		testId = 1,
		globalExpectedError;
	
	function isArray(o) {
		return Object.prototype.toString.call(o) === '[object Array]';
	}
	
	function any(collection, predicate) {
		for (var i = 0; i < collection.length; i++) {
			if (predicate(collection[i])) {
				return true;
			}
		}
		
		return false;
	}
	
	function getTextRecursive(node) {
		var text = "",
			i = 0;
		
		if (node.nodeType === 3) {
			return node.nodeValue;
		}
		
		for (i = 0; i < node.childNodes.length; i++) {
			text += getTextRecursive(node.childNodes[i]);
		}
		
		return text;
	}
	
	function getFunctionName(func) {
		var match = /^\s*function\s([\w$]+)\s*\(\)\s\{/.exec(func.toString());
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
		return Jarvis.htmlDiffs &&
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
			var message;
			if (shouldUseHtmlDiff(expected, actual)) {
				return getDiffNodes(expected, actual);
			}
			
			message = "Failed asserting that two " + getType(expected) + "s are " + (negate ? "not " : "") + "identical" + "\n\n";
			return message + getBinaryFailureMessage(toString(expected), toString(actual));
		}
	}
	
	function EqualToConstraint(expected) {
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
			return "Expected " + toString(actual) + " to " + (negate ? "not " : "") + "match the regular expression " + regex.toString();
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
	
	function TrueConstraint() {
		this.isValidFor = function(actual) {
			return actual === true;
		};
		
		this.getFailureMessage = function(actual, negate) {
			return "Expected " + toString(actual) + " to " + (negate ? "not " : "") + "be true";
		}
	}
	
	function FalseConstraint() {
		this.isValidFor = function(actual) {
			return actual === false;
		};
		
		this.getFailureMessage = function(actual, negate) {
			return "Expected " + toString(actual) + " to " + (negate ? "not " : "") + "be false";
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
	}
	
	function ContainsKeyConstraint(key) {
		var equalTo = new EqualToConstraint(key);
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
	}
	
	function ObjectPropertyValueConstraint(property, constraint) {
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
	
	function InDomConstraint() {
		this.isValidFor = function(selector) {
			return $(selector).length > 0;
		};
		
		this.getFailureMessage = function(selector, negate) {
			return "Failed asserting that the DOM " + (negate ? "does not contain" : "contains") + " an element matching the selector\n   " + selector;
		};
	}
	
	function getFailureMessageForDomElementTextMatch(message, constraint, texts) {
		var messages = [],
			i, 
			j, 
			list,
			item;
		
		for (i = 0; i < texts.length; i++) {
			messages[i] = constraint.getFailureMessage(texts[i]);
		}
		
		if (typeof(messages[0]) !== "string") {
			//node list
			message = [doc.createTextNode(message)];
			list = doc.createElement("ol");
			for (i = 0; i < messages.length; i++) {
				item = doc.createElement("li");
				for (j = 0; j < messages[i].length; j++) {
					item.appendChild(messages[i][j]);
				}
				
				list.appendChild(item);
			}
			
			message.push(list);
		} else {
			for (i = 0; i < messages.length; i++) {
				message += (i + 1) + ") " + messages[i] + "\n\n";
			}
		}
		
		return message;
	}
	
	function DomElementTextConstraint(constraint) {
		var texts = [];
		
		this.isValidFor = function(selector) {
			return any($(selector), function(element) {
				if (element.childNodes.length === 1 && element.childNodes[0].nodeType === 3) {
					texts.push(element.childNodes[0].nodeValue);
					return constraint.isValidFor(element.childNodes[0].nodeValue);
				}
				
				return false;
			});
		};
		
		this.getFailureMessage = function(selector, negate) {
			var message = "Failed asserting a condition about the " + 
				"text for any of the DOM elements defined by the selector\n    " + selector + "\n\n";
			return getFailureMessageForDomElementTextMatch(message, constraint, texts);
		};
	}
	
	function DomElementFlattenedTextConstraint(constraint) {
		var texts = [];
		
		this.isValidFor = function(selector) {
			return any($(selector), function(element) {
				texts.push(getTextRecursive(element));
				return constraint.isValidFor(texts[texts.length - 1]);
			});
		};
		
		this.getFailureMessage = function(selector, negate) {
			var message = "Failed asserting a condition about the recursively flattened " + 
				"text for any of the DOM elements defined by the selector\n    " + selector + "\n\n";
			return getFailureMessageForDomElementTextMatch(message, constraint, texts);
		};
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
		this.TRUE = factory(new TrueConstraint());
		this.FALSE = factory(new FalseConstraint());
		
		this.empty = factory(new EmptyConstraint());
		
		this.undefined = factory(new UndefinedConstraint());
		
		this.inDom = factory(new InDomConstraint());
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
		
		this.text = function() {
			var iface = new AssertionInterface(function(constraint) {
				return new DomElementTextConstraint(constraint);
			});
			
			iface.not = new AssertionInterface(function(constraint) {
				return new NotConstraint(new DomElementTextConstraint(constraint));
			});
			
			return iface;
		}();
		
		this.flattenedText = function() {
			var iface = new AssertionInterface(function(constraint) {
				return new DomElementFlattenedTextConstraint(constraint);
			});
			
			iface.not = new AssertionInterface(function(constraint) {
				return new NotConstraint(new DomElementFlattenedTextConstraint(constraint));
			});
			
			return iface;
		}();
	}
	
	function cleanStackTrace(frames) {
		var newFrames = [],
			i;
		
		for (i = frames.length - 1; i >= 0; i--) {
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
		this.stackTrace = global.Jarvis.showStackTraces && !global.opera ? cleanStackTrace(global.getStackTrace({ e: thrownError })) : [];
	}
	
	Is = new AssertionInterface(function(constraint) { return constraint; });
	Is.not = new AssertionInterface(function(constraint) { return new NotConstraint(constraint); });
	
	Has = new CollectionAssertionInterface(function(constraint) { return constraint; });
	Has.no = new CollectionAssertionInterface(function(constraint) { return new NotConstraint(constraint); });
	Has.no.property = undefined; //doesn't really make sense to make this kind of negative assertion
	
	Assert = {
		that: function(actual, constraint, message) {
			if (!constraint.isValidFor(actual)) {
				var constraintMessage = constraint.getFailureMessage(actual);
				message = message ? message + "\n\n" : "";
				
				if (typeof(constraintMessage) === "string") {
					constraintMessage = message + constraintMessage;
				}
				
				throw new JarvisError(constraintMessage, "fail");
			}
			
			globalAssertionCount++;
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
	
	global.Assert = Assert;
	global.Is = Is;
	global.Has = Has;
	global.Jarvis = {
		defaultReporter: null,
		htmlDiffs: false,
		showStackTraces: false,
		
		reset: function() {
			globalAssertionCount = 0;
		},
		
		summary: function(reporter) {
			reporter = reporter || this.defaultReporter;
			if (!reporter) {
				throw "No reporter given";
			}
			
			reporter.summary(globalAssertionCount);
		},
		
		run: function(test, reporter, parentId) {
			var id = (testId++),
				caughtError,
				assertionCountAtStart = globalAssertionCount,
				i,
				result,
				expectedError,
				childTests,
				setup,
				tearDown,
				runLastTearDown = true,
				equalTo;
				
			if (typeof(test) !== "function") {
				setup = test.setup;
				tearDown = test.tearDown;
				test = test.test;
				if (typeof(test) !== "function") {
					throw "No test detected or is not a function";
				}
			}
			
			name = getFunctionName(test).replace(/_/g, " ");
			reporter = reporter || this.defaultReporter;
			if (!reporter) {
				throw "No reporter given";
			}
			
			reporter.startTest(name, id, parentId);
			try {
				setup && setup();
				childTests = test();
				expectedError = globalExpectedError;
				if (typeof(childTests) === "object") {
					
					if (isArray(childTests)) {
						//if the value is an array, then it's a suite of tests
						//if setup and tearDown were given, we should run them before and after each child test
						
						//we need to tear down because we setup before calling the test function
						//we'll call setup again before the first child test runs, so we need to reset the state
						runLastTearDown = false;
						tearDown && tearDown();
						
						for (i = 0; i < childTests.length; i++) {
							setup && setup();
							this.run(childTests[i], reporter, id);
							tearDown && tearDown();
						}
					} else {
						this.run(childTests, id);
					}
				}
				
				if (expectedError !== undefined) {
					throw new JarvisError("Expected " + toString(expectedError) + " to be thrown", "fail");
				}
			} catch (error) {
				if (!(error instanceof JarvisError)) {
					//not a jarvis error
					if (!expectedError) {
						expectedError = globalExpectedError;
					}
					
					//verify that it wasn't expected
					if (expectedError !== undefined) {
						//expectedError was set, so check to see if the thrown error matches what was expected
						equalTo = new EqualToConstraint(expectedError);
						if (expectedError !== true && !equalTo.isValidFor(error)) {
							error = new JarvisError(
								"Expected error, " + toString(expectedError) + ", did not match actual error, " + toString(error),
								"fail",
								error
							);
						} else {
							error = undefined;
							globalAssertionCount++; //count Assert.willThrow() successes as an assertion
						}
					} else {
						error = new JarvisError("An error occurred while running the test: " + (error.toString ? error.toString() : error), "error", error);
					}
				}
				
				caughtError = error;
			}
			
			if (runLastTearDown) {
				tearDown && tearDown();
			}
			
			result = {
				status: caughtError === undefined ? "pass" : caughtError.type,
				message: caughtError === undefined ? "" : caughtError.message,
				stackTrace: caughtError === undefined ? [] : caughtError.stackTrace,
				assertions: globalAssertionCount - assertionCountAtStart
			};
			
			reporter.endTest(result, id);
			globalExpectedError = undefined;
		}
	};
	
}(this, document));