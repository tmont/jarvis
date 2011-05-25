function Setup_and_tear_down_tests() {
	var foo = "original";
	
	return [
		function Uses_bound_variable_without_setup_and_teardown1() {
			Assert.that(foo, Is.equalTo("original"));
		}, 
		
		{
			setup: function() {
				foo = "bar";
			},
			
			tearDown: function() {
				foo = "foo";
			},
			
			test: function Modifies_bound_variable_and_resets_it() {
				return [
					function Setup_and_tear_down_test1() {
						Assert.that(foo, Is.equalTo("bar"));
					},
					
					function Setup_and_tear_down_test2() {
						Assert.that(foo, Is.equalTo("bar"));
					}
				];
			}
		},
		
		function Uses_bound_variable_without_setup_and_teardown2() {
			Assert.that(foo, Is.equalTo("foo"));
		}
	];
	
	return ;
}

Jarvis.run(Setup_and_tear_down_tests);