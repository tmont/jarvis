var suite = Jarvis.suite('Non passing status tests', {
	tests: [
		function Should_ignore_test() {
			try {
				Assert.ignore();
				Assert.fail('Assert.ignore() did not throw a JarvisError');
			} catch (error) {
				Assert.that(error.message, Is.empty());
				Assert.that(error.type, Is.equalTo('ignore'));
			}
		},

		function Should_ignore_test_with_message() {
			try {
				Assert.ignore('ignoring');
				Assert.fail('Assert.ignore() did not throw a JarvisError');
			} catch (error) {
				Assert.that(error.message, Is.equalTo('ignoring'));
				Assert.that(error.type, Is.equalTo('ignore'));
			}
		},

		function Should_fail_test() {
			try {
				Assert.fail();
				alert('Assert.fail() doesn\'t work');
			} catch (error) {
				Assert.that(error.message, Is.empty());
				Assert.that(error.type, Is.equalTo('fail'));
			}
		},

		function Should_fail_test_with_message() {
			try {
				Assert.fail('failing');
				alert('Assert.fail() doesn\'t work');
			} catch (error) {
				Assert.that(error.message, Is.equalTo('failing'));
				Assert.that(error.type, Is.equalTo('fail'));
			}
		}
	]
});

if (typeof(module) !== 'undefined') {
	module.exports = suite;
} else {
	Jarvis.run(suite);
}