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
		
		function Equality_failure_messages() {
			return [
				function Should_show_function_names_in_failure_message() {
					function func1() {}
					function func2() {}
					
					try {
						Assert.that(func1, Is.equalTo(func2));
					} catch (error) {
						Assert.that(error.message, Is.equalTo("Expected: [Function(func1)]\nActual:   [Function(func2)]"));
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
		}
	];
};

function Sample_tests_showcasing_the_other_test_result_statuses() {
	return [
		function Should_ignore_this_test() {
			Assert.ignore("Ignoring a test with Assert.ignore()");
			
			Assert.fail(); //never gets here
		},
		
		function Fail_using_assertion() {
			Assert.fail("Failtime with Assert.fail()");
		},
		
		function Show_a_pretty_diff_when_string_equality_fails() {
			var expected = "this is a story all about how my life\ngot flipped turned upside down";
			var actual =   "that was a storey all about how my life\ngot twisted turned Upside down";
			
			Assert.that(expected, Is.equalTo(actual));
		}
	];
}

Jarvis.run(Constraint_tests);
Jarvis.run(Sample_tests_showcasing_the_other_test_result_statuses);