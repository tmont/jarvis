function Constraint_tests() {
	return [
		function Equality_constraint_tests() {
			return [
				function Strings_are_equal_to_strings() {
					Assert.that("foo", Is.equalTo("foo"));
					Assert.that("", Is.equalTo(""));
					Assert.that("foo", Is.not.equalTo("bar"));
				},
				
				function String_equality_is_case_sensitive() {
					Assert.that("foo", Is.not.equalTo("Foo"));
				},
				
				function Integers_are_equal_to_integers() {
					Assert.that(5, Is.equalTo(5));
					Assert.that(4, Is.not.equalTo(2));
				},
				
				function Floats_are_equal_to_floats() {
					Assert.that(4.7, Is.equalTo(4.7));
					Assert.that(4.9, Is.equalTo(4.9000));
				},
				
				function Integers_are_equal_to_floats() {
					Assert.that(5, Is.equalTo(5.0000));
				},
				
				function Undefined_is_equal_to_undefined() {
					Assert.that(undefined, Is.equalTo(undefined));
					Assert.that(this["foo"], Is.equalTo(undefined));
				},
				
				function Null_is_equal_to_null() {
					Assert.that(null, Is.equalTo(null));
				},
				
				function Null_is_equal_to_undefined() {
					Assert.that(null, Is.equalTo(undefined));
				},
				
				function True_is_equal_to_true() {
					Assert.that(true, Is.equalTo(true));
				},
				
				function True_is_equal_to_1() {
					Assert.that(true, Is.equalTo(1));
				},
				
				function False_is_equal_to_false() {
					Assert.that(false, Is.equalTo(false));
				},
				
				function False_is_equal_to_0() {
					Assert.that(false, Is.equalTo(0));
				},
				
				function Object_references_are_equal() {
					var obj = {};
					Assert.that(obj, Is.equalTo(obj));
				},
				
				function Objects_are_equal_if_all_properties_are_equal() {
					function f() {}
					var expected = {
						foo: "bar",
						baz: 125,
						beff: {
							bat: "lol"
						},
						func: f
					};
					
					var actual = {
						foo: "bar",
						baz: 125,
						beff: {
							bat: "lol"
						},
						func: f
					};
					
					Assert.that(actual, Is.equalTo(expected));
					Assert.that(/foo/, Is.equalTo(/foo/), "regex objects must be equal");
					Assert.that({ foo: "bar" }, Is.not.equalTo({ foo: "baz" }));
				},
				
				function Empty_objects_are_equal() {
					Assert.that({}, Is.equalTo({}));
				},
				
				function Empty_objects_are_not_equal_to_nonempty_objects() {
					Assert.that({}, Is.not.equalTo({ foo: "bar" }));
				},
				
				function Nonempty_objects_are_not_equal_to_empty_objects() {
					Assert.that({ foo: "bar" }, Is.not.equalTo({}));
				},
				
				function Object_types_are_not_equal_if_constructor_types_do_not_match() {
					Assert.that(1, Is.not.equalTo({}));
				},
				
				function Array_references_are_equal() {
					var arr = [];
					Assert.that(arr, Is.equalTo(arr));
				},
				
				function Empty_arrays_are_equal() {
					Assert.that([], Is.equalTo([]));
				},
				
				function Arrays_are_equal_if_all_elements_are_equal() {
					function f() {}
					var expected = [1, null, f, "foo", { foo: "bar", obj: {} }];
					var actual = [1, null, f, "foo", { foo: "bar", obj: {} }];
					Assert.that(actual, Is.equalTo(expected));
				},
				
				function Function_references_are_equal() {
					function f() {}
					function g() {}
					
					Assert.that(f, Is.equalTo(f));
					Assert.that(f, Is.not.equalTo(g));
					
					var u = function() {};
					var v = function() {};
					Assert.that(u, Is.equalTo(u));
					Assert.that(u, Is.not.equalTo(v));
				}
			];
		},
		
		function Regular_expression_constraint_tests() {
			return [
				function Should_match_regular_expression() {
					Assert.that("foo", Is.regexMatch(/foo/));
					Assert.that("foo", Is.regexMatch(/f/));
					Assert.that("foo", Is.regexMatch(/FOO/i));
					Assert.that("foo", Is.regexMatch(new RegExp("foo")));
					
					Assert.that("foo", Is.not.regexMatch(new RegExp("bar")));
					Assert.that("foo", Is.not.regexMatch(/foot$/));
				},
				
				function Should_fail_if_input_is_not_a_string() {
					Assert.that(null, Is.not.regexMatch(/foo/));
					Assert.that(undefined, Is.not.regexMatch(/foo/));
					Assert.that(100, Is.not.regexMatch(/foo/));
 				}
			];
		},
		
		function Empty_tests() {
			return [
				function Empty_string_is_empty() {
					Assert.that("", Is.empty);
				},
				
				function Null_is_empty() {
					Assert.that(null, Is.empty);
				},
				
				function Empty_object_is_empty() {
					Assert.that({}, Is.empty);
				},
				
				function Empty_array_is_empty() {
					Assert.that([], Is.empty);
				},
				
				function Nonempty_object_is_not_empty() {
					Assert.that({ foo: "bar" }, Is.not.empty);
				},
				
				function Nonempty_array_is_not_empty() {
					Assert.that([0], Is.not.empty);
				},
				
				function Zero_is_not_empty() {
					Assert.that(0, Is.not.empty);
				}
			];
		},
		
		function Exact_equality_tests() {
			return [
				function Strings_are_identical_to_strings() {
					Assert.that("foo", Is.identicalTo("foo"));
					Assert.that("", Is.identicalTo(""));
				},
				
				function Integers_are_identical_to_integers() {
					Assert.that(5, Is.identicalTo(5));
				},
				
				function Integers_are_identical_to_floats() {
					Assert.that(5, Is.identicalTo(5.00));
				},
				
				function Floats_are_identical_to_floats() {
					Assert.that(5.7, Is.identicalTo(5.7));
				},
				
				function Undefined_is_identical_to_undefined() {
					Assert.that(undefined, Is.identicalTo(undefined));
					Assert.that(this["foo"], Is.identicalTo(undefined));
				},
				
				function Null_is_identical_to_null() {
					Assert.that(null, Is.identicalTo(null));
				},
				
				function True_is_identical_to_true() {
					Assert.that(true, Is.identicalTo(true));
				},
				
				function True_is_not_identical_to_1() {
					Assert.that(true, Is.not.identicalTo(1));
				},
				
				function False_is_identical_to_false() {
					Assert.that(false, Is.identicalTo(false));
				},
				
				function False_is_not_identical_to_0() {
					Assert.that(false, Is.not.identicalTo(0));
				},
				
				function Object_references_are_identical() {
					var obj = { foo: "bar" };
					Assert.that(obj, Is.identicalTo(obj));
				},
				
				function Object_copies_are_never_identical() {
					var obj1 = { foo: "bar" };
					var obj2 = { foo: "bar" };
					Assert.that(obj1, Is.not.identicalTo(obj2));
				},
				
				function Array_references_are_identical() {
					var arr = [1, "foo"];
					Assert.that(arr, Is.identicalTo(arr));
				},
				
				function Array_copies_are_never_identical() {
					var arr1 = [1, "foo"];
					var arr2 = [1, "foo"];
					Assert.that(arr1, Is.not.identicalTo(arr2));
				},
				
				function Function_references_are_identical() {
					function f() {}
					Assert.that(f, Is.identicalTo(f));
				}
			];
		},
		
		function Collection_tests() {
			return [
				function Collection_key_and_value_tests() {
					return [
						function Array_contains_value() {
							function f() {}
							var collection = [1, "foo", f, { foo: "bar" }];
							
							Assert.that(collection, Contains.value(1));
							Assert.that(collection, Contains.value("foo"));
							Assert.that(collection, Contains.value(f));
							Assert.that(collection, Contains.value({ foo: "bar" }));
						},
						
						function Object_contains_value() {
							function f() {}
							var collection = {
								a: 1, 
								b: "foo", 
								c: f, 
								d: { foo: "bar" }
							};
							
							Assert.that(collection, Contains.value(1));
							Assert.that(collection, Contains.value("foo"));
							Assert.that(collection, Contains.value(f));
							Assert.that(collection, Contains.value({ foo: "bar" }));
						},
						
						function Collection_does_not_contain_value() {
							function f() {}
							var collection = [1, "foo",  { foo: "bar" }];
							
							Assert.that(collection, Contains.not.value(4));
							Assert.that(collection, Contains.not.value("bar"));
							Assert.that(collection, Contains.not.value({}));
							Assert.that(collection, Contains.not.value(null));
							Assert.that(collection, Contains.not.value(undefined));
						},
						
						function Array_contains_key() {
							Assert.that([1, 2, 3], Contains.key(0));
							Assert.that([1, 2, 3], Contains.key(1));
							Assert.that([1, 2, 3], Contains.key(2));
							Assert.that([1, 2, 3], Contains.not.key(3));
							Assert.that([], Contains.not.key(undefined));
						}
					];
				},
				
				function Object_property_value_tests() {
					return [
						function Should_find_property_value() {
							Assert.that({ foo: "bar" }, Contains.property("foo").equalTo("bar"));
						},
						
						function Should_not_find_property_value() {
							Assert.that({ foo: "bar" }, Contains.property("foo").not.equalTo("baz"));
						},
						
						function Should_find_array_length() {
							Assert.that([1, 2, 3], Contains.property("length").greaterThan(2));
						}
					];
				}
			];
		}
	];
}

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
					var expectedHtml = "<span>this is a stor</span><del>e</del><span>y all about how my life got </span><del>twist</del><ins>flipp</ins><span>ed turned </span><del>U</del><ins>u</ins><span>pside down</span>";
					
					try {
						Assert.that(expected, Is.equalTo(actual));
					} catch (error) {
						var dummy = document.createElement("pre");
						for (var i = 0; i < error.message.length; i++) {
							dummy.appendChild(error.message[i].cloneNode(true));
						}
						
						Assert.that(dummy.innerHTML, Is.equalTo(expectedHtml));
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
						Assert.that(new foo(), Is.equalTo(/foo/));
					} catch (error) {
						Assert.that(error.message, Is.equalTo("Failed asserting that two objects are equal\n\nExpected: [Object(RegExp)]\nActual:   [Object(foo)]"));
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
		}
	];
}

function Sample_tests_showcasing_the_other_test_result_statuses() {
	return [
		function Should_ignore_this_test() {
			Assert.ignore("Ignoring a test with Assert.ignore()");
			Assert.fail("tommy is a total idiot if this gets executed"); //never gets here
		},
		
		function Fail_using_assertion() {
			Assert.fail("Failtime with Assert.fail()");
		},
		
		function Show_a_pretty_diff_when_string_equality_fails() {
			var expected = "this is a story all about how my life\ngot flipped turned upside down";
			var actual =   "that was a storey all about how my life\ngot twisted turned Upside down";
			
			Assert.that(expected, Is.equalTo(actual));
		},
		
		function I_AM_ERROR() {
			foo
		}
	];
}

Jarvis.run(Constraint_tests);
Jarvis.run(Failure_message_tests);
Jarvis.run(Sample_tests_showcasing_the_other_test_result_statuses);