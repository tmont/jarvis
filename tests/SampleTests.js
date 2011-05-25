function Sample_tests_showcasing_the_other_test_result_statuses() {
	return [
		function This_test_fails_and_displays_a_user_defined_message() {
			Assert.that(1, Is.equalTo(2), "1 should be equal to 2");
		},
		
		function Should_ignore_this_test() {
			Assert.ignore("Ignoring a test with Assert.ignore()");
			Assert.fail("tommy is a total idiot if this gets executed"); //never gets here
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

Jarvis.run(Sample_tests_showcasing_the_other_test_result_statuses);
Jarvis.run(Parent_with_all_children_ignored_should_have_ignore_status);