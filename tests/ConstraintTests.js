var suite = Jarvis.suite('Constraint tests', [
	Jarvis.suite('Equality tests', [
		function Strings_are_equal_to_strings() {
			Assert.that('foo', Is.equalTo('foo'));
			Assert.that('', Is.equalTo(''));
			Assert.that('foo', Is.not.equalTo('bar'));
		},

		function String_equality_is_case_sensitive() {
			Assert.that('foo', Is.not.equalTo('Foo'));
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
			Assert.that(this['foo'], Is.equalTo(undefined));
		},

		function Undefined_is_equal_to_undefined_for_object_properties() {
			Assert.that({ foo: undefined }, Is.equalTo({ foo: undefined }));
		},

		function Null_is_equal_to_null() {
			Assert.that(null, Is.equalTo(null));
		},

		function Null_is_equal_to_undefined() {
			Assert.that(null, Is.equalTo(undefined));
			Assert.that(undefined, Is.equalTo(null));
		},

		function True_is_equal_to_true() {
			Assert.that(true, Is.equalTo(true));
		},

		function True_is_equal_to_1() {
			Assert.that(true, Is.equalTo(1));
			Assert.that(1, Is.equalTo(true));
		},

		function False_is_equal_to_false() {
			Assert.that(false, Is.equalTo(false));
		},

		function False_is_equal_to_0() {
			Assert.that(false, Is.equalTo(0));
			Assert.that(0, Is.equalTo(false));
		},

		function False_is_equal_to_empty_string() {
			Assert.that(false, Is.equalTo(''));
			Assert.that('', Is.equalTo(false));
		},

		function Null_is_not_equal_to_empty_string() {
			Assert.that(null, Is.not.equalTo(''));
			Assert.that('', Is.not.equalTo(null));
		},

		function Object_references_are_equal() {
			var obj = {};
			Assert.that(obj, Is.equalTo(obj));
		},

		function Objects_are_equal_if_all_properties_are_equal() {
			function f() {}

			var expected = {
				foo: 'bar',
				baz: 125,
				beff: {
					bat: 'lol'
				},
				func: f
			};

			var actual = {
				foo: 'bar',
				baz: 125,
				beff: {
					bat: 'lol'
				},
				func: f
			};

			Assert.that(actual, Is.equalTo(expected));
			Assert.that({ foo: 'bar' }, Is.not.equalTo({ foo: 'baz' }));
		},

		function Object_instances_are_equal() {
			function f() {}

			Assert.that(new f(), Is.equalTo(new f()));
		},

		function Regular_expressions_are_equal() {
			Assert.that(/foo/, Is.equalTo(/foo/));
		},

		function Empty_objects_are_equal() {
			Assert.that({}, Is.equalTo({}));
		},

		function Empty_objects_are_not_equal_to_nonempty_objects() {
			Assert.that({}, Is.not.equalTo({ foo: 'bar' }));
		},

		function Nonempty_objects_are_not_equal_to_empty_objects() {
			Assert.that({ foo: 'bar' }, Is.not.equalTo({}));
		},

		function Cyclic_objects_do_not_cause_infinite_loops() {
			var obj = {};
			obj.foo = obj;
			var other = { foo: obj };
			Assert.that(obj, Is.equalTo(other));
			Assert.that(other, Is.equalTo(obj));
			Assert.that(other, Is.not.identicalTo(obj));
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

			var expected = [1, null, f, 'foo', { foo: 'bar', obj: {} }];
			var actual = [1, null, f, 'foo', { foo: 'bar', obj: {} }];
			Assert.that(actual, Is.equalTo(expected));
		},

		function Function_references_are_equal() {
			function f() {}
			function g() {}

			Assert.that(f, Is.equalTo(f));
			Assert.that(f, Is.not.equalTo(g));

			var u = function () {};
			var v = function () {};
			Assert.that(u, Is.equalTo(u));
			Assert.that(u, Is.not.equalTo(v));
		}
	]),

	Jarvis.suite('Regular expression constraint tests', [
		function Should_match_regular_expression() {
			Assert.that('foo', Is.regexMatch(/foo/));
			Assert.that('foo', Is.regexMatch(/f/));
			Assert.that('foo', Is.regexMatch(/FOO/i));
			Assert.that('foo', Is.regexMatch(new RegExp('foo')));

			Assert.that('foo', Is.not.regexMatch(new RegExp('bar')));
			Assert.that('foo', Is.not.regexMatch(/foot$/));
		},

		function Should_fail_if_input_is_not_a_string() {
			Assert.that(null, Is.not.regexMatch(/foo/));
			Assert.that(undefined, Is.not.regexMatch(/foo/));
			Assert.that(100, Is.not.regexMatch(/foo/));
		}
	]),

	Jarvis.suite('Empty tests', [
		function Empty_string_is_empty() {
			Assert.that('', Is.empty());
		},

		function Null_is_empty() {
			Assert.that(null, Is.empty());
		},

		function Empty_object_is_empty() {
			Assert.that({}, Is.empty());
		},

		function Empty_array_is_empty() {
			Assert.that([], Is.empty());
		},

		function Nonempty_object_is_not_empty() {
			Assert.that({ foo: 'bar' }, Is.not.empty());
		},

		function Nonempty_array_is_not_empty() {
			Assert.that([0], Is.not.empty());
		},

		function Zero_is_not_empty() {
			Assert.that(0, Is.not.empty());
		},

		function Undefined_is_empty() {
			Assert.that(undefined, Is.empty());
		}
	]),

	Jarvis.suite('Null tests', [
		function Null_is_null() {
			Assert.that(null, Is.NULL());
		},

		function Empty_string_is_not_null() {
			Assert.that('', Is.not.NULL());
		},

		function Zero_is_not_null() {
			Assert.that(0, Is.not.NULL());
		},

		function Undefined_is_not_null() {
			Assert.that(undefined, Is.not.NULL());
		}
	]),

	Jarvis.suite('Boolean tests', [
		function True_is_true() {
			Assert.that(true, Is.TRUE());
		},

		function One_is_not_true() {
			Assert.that(1, Is.not.TRUE());
		},

		function False_is_false() {
			Assert.that(false, Is.FALSE());
		},

		function Zero_is_not_false() {
			Assert.that(0, Is.not.FALSE());
		},

		function Empty_string_is_not_false() {
			Assert.that('', Is.not.FALSE());
		},

		function Undefined_is_not_false() {
			Assert.that(undefined, Is.not.FALSE());
		},

		function Null_is_not_false() {
			Assert.that(null, Is.not.FALSE());
		}
	]),

	Jarvis.suite('Undefined tests', [
		function Undefined_is_undefined() {
			Assert.that(undefined, Is.undefined());
		},

		function Empty_string_is_not_undefined() {
			Assert.that('', Is.not.undefined());
		},

		function Zero_is_not_undefined() {
			Assert.that(0, Is.not.undefined());
		},

		function Undefined_variable_is_undefined() {
			Assert.that(this['foo'], Is.undefined());
		}
	]),

	Jarvis.suite('Inequality tests', [
		function Integers_are_greater_than_integers() {
			Assert.that(5, Is.greaterThan(3));
		},

		function Floats_are_greater_than_floats() {
			Assert.that(5.7, Is.greaterThan(3.3));
		},

		function Integers_are_less_than_integers() {
			Assert.that(3, Is.lessThan(5));
		},

		function Floats_are_less_than_floats() {
			Assert.that(3.4, Is.lessThan(5.7));
		},

		function Integers_are_greater_than_or_equal_to_integers() {
			Assert.that(5, Is.greaterThanOrEqualTo(5));
			Assert.that(5, Is.greaterThanOrEqualTo(3));
		},

		function Floats_are_greater_than_or_equal_to_floats() {
			Assert.that(5.7, Is.greaterThanOrEqualTo(3.3));
			Assert.that(5.7, Is.greaterThanOrEqualTo(5.7));
		},

		function Integers_are_less_than_or_equal_to_integers() {
			Assert.that(3, Is.lessThanOrEqualTo(5));
			Assert.that(3, Is.lessThanOrEqualTo(3));
		},

		function Floats_are_less_than_or_equal_to_floats() {
			Assert.that(3.4, Is.lessThanOrEqualTo(5.7));
			Assert.that(3.4, Is.lessThanOrEqualTo(3.4));
		},

		function Strings_are_less_than_strings_based_on_the_alphabet() {
			Assert.that("foo", Is.lessThan("goo"));
			Assert.that("zebra", Is.not.lessThan("Apple"));
		}
	]),

	Jarvis.suite('Exact equality tests', [
		function Strings_are_identical_to_strings() {
			Assert.that('foo', Is.identicalTo('foo'));
			Assert.that('', Is.identicalTo(''));
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
			var obj = { foo: 'bar' };
			Assert.that(obj, Is.identicalTo(obj));
		},

		function Object_copies_are_never_identical() {
			var obj1 = { foo: 'bar' };
			var obj2 = { foo: 'bar' };
			Assert.that(obj1, Is.not.identicalTo(obj2));
		},

		function Array_references_are_identical() {
			var arr = [1, 'foo'];
			Assert.that(arr, Is.identicalTo(arr));
		},

		function Array_copies_are_never_identical() {
			var arr1 = [1, 'foo'];
			var arr2 = [1, 'foo'];
			Assert.that(arr1, Is.not.identicalTo(arr2));
		},

		function Function_references_are_identical() {
			function f() {}

			Assert.that(f, Is.identicalTo(f));
		}
	]),

	Jarvis.suite('Collection tests', [
		Jarvis.suite('Collection key and value tests', [
			function Array_contains_value() {
				function f() {}

				var collection = [1, 'foo', f, { foo: 'bar' }];

				Assert.that(collection, Has.value(1));
				Assert.that(collection, Has.value('foo'));
				Assert.that(collection, Has.value(f));
				Assert.that(collection, Has.value({ foo: 'bar' }));
			},

			function Object_contains_value() {
				function f() {}

				var collection = {
					a: 1,
					b: 'foo',
					c: f,
					d: { foo: 'bar' }
				};

				Assert.that(collection, Has.value(1));
				Assert.that(collection, Has.value('foo'));
				Assert.that(collection, Has.value(f));
				Assert.that(collection, Has.value({ foo: 'bar' }));
			},

			function Collection_does_not_contain_value() {
				function f() {}

				var collection = [1, 'foo', { foo: 'bar' }];

				Assert.that(collection, Has.no.value(4));
				Assert.that(collection, Has.no.value('bar'));
				Assert.that(collection, Has.no.value({}));
				Assert.that(collection, Has.no.value(null));
				Assert.that(collection, Has.no.value(undefined));
			},

			function Array_contains_key() {
				Assert.that([1, 2, 3], Has.key(0));
				Assert.that([1, 2, 3], Has.key(1));
				Assert.that([1, 2, 3], Has.key(2));
				Assert.that([1, 2, 3], Has.no.key(3));
				Assert.that([], Has.no.key(undefined));
			}
		]),

		Jarvis.suite('Object property tests', [
			function Should_find_property_value() {
				Assert.that({ foo: 'bar' }, Has.property('foo').equalTo('bar'));
			},

			function Should_not_find_property_value() {
				Assert.that({ foo: 'bar' }, Has.property('foo').not.equalTo('baz'));
			},

			function Should_find_array_length() {
				Assert.that([1, 2, 3], Has.property('length').greaterThan(2));
			}
		])
	])

]);

if (typeof(module) === 'undefined') {
	Jarvis.run(suite);
} else {
	module.exports = suite;
}