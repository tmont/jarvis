var suite = Jarvis.suite('Setup and tear down tests', (function(){
	var foo = 'original';

	return {
		tests: [
			function Uses_bound_variable_without_setup_and_teardown1() {
				Assert.that(foo, Is.equalTo('original'));
			},

			Jarvis.suite('Modified bound variable and resets it', {
				setup: function() {
					foo = 'setup';
				},
				tearDown: function() {
					foo = 'teardown';
				},
				tests: [
					function Setup_and_tear_down_test1() {
						Assert.that(foo, Is.equalTo('setup'));
						foo = 'something else';
					},

					function Setup_and_tear_down_test2() {
						Assert.that(foo, Is.equalTo('setup'));
						foo = 'something else again';
					}
				]
			}),

			function Uses_bound_variable_without_setup_and_teardown2() {
				Assert.that(foo, Is.equalTo('teardown'));
			}
		]
	};
}()));

if (typeof(module) !== 'undefined') {
	module.exports = suite;
} else {
	Jarvis.run(suite);
}