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
					Assert.that(/foo/, Is.equalTo(/foo/));
					Assert.that(new f(), Is.equalTo(new f()));
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

Jarvis.run(Constraint_tests);