function Failure_message_tests() {
	return [
		function Equality_failure_messages() {
			return [
				function Should_show_function_names_in_failure_message() {
					function func1() {}
					function func2() {}
					
					try {
						Assert.that(func1, Is.equalTo(func2));
					} catch (error) {
						Assert.that(error.message, Is.equalTo("Failed asserting that two functions are equal\n\nExpected: [Function(func2)]\nActual:   [Function(func1)]"));
					}
				},
				
				function Comparing_two_strings_should_show_a_diff() {
					var expected = "this is a story all about how my life got flipped turned upside down";
					var actual =   "this is a storey all about how my life got twisted turned Upside down";
					var expectedHtml = 
						"<(span|SPAN)>this is a stor</(span|SPAN)><(del|DEL)>e</(del|DEL)><(span|SPAN)>y all about how my life got " +
						"</(span|SPAN)><(del|DEL)>twist</(del|DEL)><(ins|INS)>flipp</(ins|INS)><(span|SPAN)>ed turned </(span|SPAN)><(del|DEL)>U</(del|DEL)>"+
						"<(ins|INS)>u</(ins|INS)><(span|SPAN)>pside down</(span|SPAN)>";
					
					try {
						Assert.that(expected, Is.equalTo(actual));
					} catch (error) {
						var dummy = document.createElement("pre");
						for (var i = 0; i < error.message.length; i++) {
							dummy.appendChild(error.message[i].cloneNode(true));
						}
						
						Assert.that(dummy.innerHTML, Is.regexMatch(new RegExp(expectedHtml)));
					}
				},
				
				function Should_show_human_readable_message_for_numbers() {
					try {
						Assert.that(12, Is.equalTo(36));
					} catch (error) {
						Assert.that(error.message, Is.equalTo("Failed asserting that two numbers are equal\n\nExpected: 36\nActual:   12"));
					}
				},
				
				function Should_show_human_readable_message_for_strings_without_diff() {
					var original = Jarvis.htmlDiffs;
					Jarvis.htmlDiffs = false;
					try {
						Assert.that("foo", Is.equalTo("bar"));
						Jarvis.htmlDiffs = original;
					} catch (error) {
						Jarvis.htmlDiffs = original;
						Assert.that(error.message, Is.equalTo("Failed asserting that two strings are equal\n\nExpected: \"bar\"\nActual:   \"foo\""));
					}
				},
				
				function Should_truncate_long_strings() {
					var original = Jarvis.htmlDiffs;
					Jarvis.htmlDiffs = false;
					
					var longString = new Array(201).join("x");
					try {
						Assert.that("hello world!", Is.equalTo(longString));
						Jarvis.htmlDiffs = original;
					} catch (error) {
						Jarvis.htmlDiffs = original;
						var expectedString = new Array(51).join("x") + "..." + new Array(51).join("x");
						Assert.that(error.message, Is.equalTo("Failed asserting that two strings are equal\n\nExpected: \"" + expectedString + "\"\nActual:   \"hello world!\""));
					}
				},
				
				function Should_print_something_visible_for_empty_string() {
					var original = Jarvis.htmlDiffs;
					Jarvis.htmlDiffs = false;
					
					try {
						Assert.that("", Is.equalTo("not empty"));
						Jarvis.htmlDiffs = original;
					} catch (error) {
						Jarvis.htmlDiffs = original;
						Assert.that(error.message, Is.equalTo("Failed asserting that two strings are equal\n\nExpected: \"not empty\"\nActual:   <empty string>"));
					}
				},
				
				function Should_print_something_visible_for_null() {
					try {
						Assert.that(null, Is.equalTo("foo"));
					} catch (error) {
						Assert.that(error.message, Is.equalTo("Failed asserting that two strings are equal\n\nExpected: \"foo\"\nActual:   <null>"));
					}
				},
				
				function Should_print_something_visible_for_undefined() {
					try {
						Assert.that(undefined, Is.equalTo("foo"));
					} catch (error) {
						Assert.that(error.message, Is.equalTo("Failed asserting that two strings are equal\n\nExpected: \"foo\"\nActual:   <undefined>"));
					}
				},
				
				function Should_print_object_types_when_comparing_objects() {
					function foo() {}
					
					try {
						Assert.that(new foo(), Is.equalTo({}));
					} catch (error) {
						Assert.that(error.message, Is.equalTo("Failed asserting that two objects are equal\n\nExpected: [Object(Object)]\nActual:   [Object(foo)]"));
					}
				},
				
				function Should_print_regex_comparing_with_a_regex() {
					try {
						Assert.that(true, Is.equalTo(/foo/));
					} catch (error) {
						Assert.that(error.message, Is.equalTo("Failed asserting that two objects are equal\n\nExpected: [Object(RegExp:/foo/)]\nActual:   true"));
					}
				},
				
				function Should_print_array_length_when_comparing_arrays() {
					try {
						Assert.that([], Is.equalTo([1, 2, 3]));
					} catch (error) {
						Assert.that(error.message, Is.equalTo("Failed asserting that two arrays are equal\n\nExpected: [Array(length=3)]\nActual:   [Array(length=0)]"));
					}
				},
				
				function Should_show_human_readable_message_for_booleans() {
					try {
						Assert.that(false, Is.equalTo(true));
					} catch (error) {
						Assert.that(error.message, Is.equalTo("Failed asserting that two booleans are equal\n\nExpected: true\nActual:   false"));
					}
				}
			];
		},
		
		function Other_constraint_failure_messages() {
			return [
				function Should_show_readable_message_for_undefined_constraint() {
					try {
						Assert.that(3, Is.undefined);
					} catch (error) {
						Assert.that(error.message, Is.equalTo("Expected 3 to be undefined"));
					}
				},
				
				function Should_show_readable_less_than_message() {
					try {
						Assert.that(3, Is.lessThan(1));
					} catch (error) {
						Assert.that(error.message, Is.equalTo("Expected 3 to be less than 1"));
					}
				},
				
				function Should_show_readable_less_than_or_equal_message() {
					try {
						Assert.that(3, Is.lessThanOrEqualTo(1));
					} catch (error) {
						Assert.that(error.message, Is.equalTo("Expected 3 to be less than or equal to 1"));
					}
				},
				
				function Should_show_readable_greater_than_message() {
					try {
						Assert.that(1, Is.greaterThan(3));
					} catch (error) {
						Assert.that(error.message, Is.equalTo("Expected 1 to be greater than 3"));
					}
				},
				
				function Should_show_readable_greater_than_or_equal_message() {
					try {
						Assert.that(1, Is.greaterThanOrEqualTo(3));
					} catch (error) {
						Assert.that(error.message, Is.equalTo("Expected 1 to be greater than or equal to 3"));
					}
				},
				
				function Should_show_readable_message_for_empty_constraint() {
					try {
						Assert.that("foo", Is.empty);
					} catch (error) {
						Assert.that(error.message, Is.equalTo("Expected \"foo\" to be empty"));
					}
				},
				
				function Should_show_readable_message_for_null_constraint() {
					try {
						Assert.that(1, Is.NULL);
					} catch (error) {
						Assert.that(error.message, Is.equalTo("Expected 1 to be null"));
					}
				}
			];
		},
		
		function Negated_failure_messages() {
			return [
				function Should_show_negated_message_for_undefined_constraint() {
					try {
						Assert.that(undefined, Is.not.undefined);
					} catch (error) {
						Assert.that(error.message, Is.equalTo("Expected <undefined> to not be undefined"));
					}
				},
				
				function Should_show_negated_message_for_collection_contains() {
					try {
						Assert.that({ foo: "bar" }, Contains.not.value("bar"));
					} catch (error) {
						Assert.that(error.message, Is.equalTo("Expected [Object(Object)] to not contain the value \"bar\""));
					}
				},
				
				function Should_show_negated_message_for_equality() {
					try {
						Assert.that(1, Is.not.equalTo(3));
					} catch (error) {
						Assert.that(error.message, Is.regexMatch(/^Failed assserting that two numbers are equal/));
					}
				},
				
				function Should_show_negated_message_for_exact_equality() {
					try {
						Assert.that(1, Is.not.identicalTo(3));
					} catch (error) {
						Assert.that(error.message, Is.regexMatch(/^Failed assserting that two numbers are identical/));
					}
				},
				
				function Should_show_negated_less_than_message() {
					try {
						Assert.that(1, Is.not.lessThan(3));
					} catch (error) {
						Assert.that(error.message, Is.equalTo("Expected 1 to not be less than 3"));
					}
				},
				
				function Should_show_negated_less_than_message() {
					try {
						Assert.that(1, Is.not.lessThan(3));
					} catch (error) {
						Assert.that(error.message, Is.equalTo("Expected 1 to not be less than 3"));
					}
				},
				
				function Should_show_negated_less_than_or_equal_message() {
					try {
						Assert.that(1, Is.not.lessThanOrEqualTo(3));
					} catch (error) {
						Assert.that(error.message, Is.equalTo("Expected 1 to not be less than or equal to 3"));
					}
				},
				
				function Should_show_negated_greater_than_message() {
					try {
						Assert.that(3, Is.not.greaterThan(1));
					} catch (error) {
						Assert.that(error.message, Is.equalTo("Expected 3 to not be greater than 1"));
					}
				},
				
				function Should_show_negated_greater_than_or_equal_message() {
					try {
						Assert.that(3, Is.not.greaterThanOrEqualTo(1));
					} catch (error) {
						Assert.that(error.message, Is.equalTo("Expected 3 to not be greater than or equal to 1"));
					}
				},
				
				function Should_show_negated_message_for_empty_constraint() {
					try {
						Assert.that("", Is.not.empty);
					} catch (error) {
						Assert.that(error.message, Is.equalTo("Expected <empty string> to not be empty"));
					}
				},
				
				function Should_show_negated_message_for_null_constraint() {
					try {
						Assert.that(null, Is.not.NULL);
					} catch (error) {
						Assert.that(error.message, Is.equalTo("Expected <null> to not be null"));
					}
				}
			];
		}
	];
}

Jarvis.run(Failure_message_tests);