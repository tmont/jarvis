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

Jarvis.run(Sample_tests_showcasing_the_other_test_result_statuses);