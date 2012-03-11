function Parent_with_all_children_ignored_should_have_ignore_status() {
	return [
		function Ignore_test1() {
			Assert.ignore();
		},
		
		function Ignore_test2() {
			Assert.ignore();
		},
		
		function Ignore_test3() {
			Assert.ignore();
		}
	];
}

var suite = Jarvis.suite('Sample tests showcasing the other test result statuses', {
	tests: [
		Jarvis.test('Fails and displays a user defined message', function() {
			Assert.that(1, Is.equalTo(2), '1 should be equal to 2');
		}),
		Jarvis.test('Should ignore this test', function() {
			Assert.ignore("Ignoring a test with Assert.ignore()");
			Assert.fail("tommy is a total idiot if this gets executed"); //never gets here
		}),
		Jarvis.test('Show a pretty diff when string equality fails', function() {
			var expected = "this is a story all about how my life\ngot flipped turned upside down";
			var actual = "that was a storey all about how my life\ngot twisted turned Upside down";

			Assert.that(expected, Is.equalTo(actual));
		}),
		Jarvis.test('I AM ERROR', function() {
			foo
		})
	]
});

module.exports = suite;
//Jarvis.run(Parent_with_all_children_ignored_should_have_ignore_status);