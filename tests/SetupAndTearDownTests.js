function Setup_and_tear_down_tests() {
	var foo = "original";
	
	return [
		function Uses_bound_variable_without_setup_and_teardown1() {
			Assert.that(foo, Is.equalTo("original"));
		}, 
		
		{
			setup: function() {
				foo = "setup";
			},
			
			tearDown: function() {
				foo = "teardown";
			},
			
			test: function Modifies_bound_variable_and_resets_it() {
				return [
					function Setup_and_tear_down_test1() {
						Assert.that(foo, Is.equalTo("setup"));
						foo = "something else";
					},
					
					function Setup_and_tear_down_test2() {
						Assert.that(foo, Is.equalTo("setup"));
						foo = "something else again";
					}
				];
			}
		},
		
		function Uses_bound_variable_without_setup_and_teardown2() {
			Assert.that(foo, Is.equalTo("teardown"));
		}
	];
}

Jarvis.run(Setup_and_tear_down_tests);