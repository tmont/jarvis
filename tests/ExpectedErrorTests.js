var suite = Jarvis.suite('Failure and expected error tests', {
	tests: [
		Jarvis.suite('Expected error tests', {
			tests: [
				function Should_expect_any_error_to_be_thrown() {
					Assert.willThrow();
					throw 'error\'d';
				},

				function Cannot_throw_true() {
					try {
						Assert.willThrow(true);
						Assert.fail('Assert.willThrow(true) didn\'t throw');
					} catch (error) {
						Assert.that(error.message, Is.equalTo('Cannot set expected error to true'));
						Assert.that(error.type, Is.equalTo('error'));
					}
				},

				function Should_expect_exact_error_object_to_be_thrown() {
					Assert.willThrow({ foo: 'bar' });
					throw { foo: 'bar' };
				}
			]
		}),

		Jarvis.suite('Tests that fail even when they succeed', {
			tests: [
				function Should_fail_if_expected_error_was_not_thrown() {
					Assert.willThrow('never thrown');
				},

				function Should_not_catch_JarvisError() {
					Assert.willThrow();
					Assert.that(1, Is.equalTo(2), 'This assertion is preceded by Assert.willThrow()');
				}
			]
		})
	]
});

if (typeof(module) === "undefined") {
	Jarvis.run(suite);
} else {
	module.exports = suite;
}