var suite = Jarvis.suite('Sample tests showcasing the other test result statuses', {
	tests: [
		function Fails_and_displays_a_user_defined_message() {
			Assert.that(1, Is.equalTo(2), '1 should be equal to 2');
		},
		function Should_ignore_this_test() {
			Assert.ignore("Ignoring a test with Assert.ignore()");
			Assert.fail("tommy is a total idiot if this gets executed"); //never gets here
		},
		function Show_a_pretty_diff_when_string_equality_fails() {
			var expected = "this is a story all about how my life\ngot flipped turned upside down";
			var actual = "that was a storey all about how my life\ngot twisted turned Upside down";

			Assert.that(expected, Is.equalTo(actual));
		},
		function I_AM_ERROR() {
			foo
		}
	]
});

if (typeof(module) !== 'undefined') {
	module.exports = suite;
} else {
	Jarvis.run(suite);
}