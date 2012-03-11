var suite = Jarvis.suite('Parent with all children ignored should have ignore status', {
	tests:[
		function Ignore_test1() {
			Assert.ignore();
		},

		function Ignore_test2() {
			Assert.ignore();
		},

		function Ignore_test3() {
			Assert.ignore();
		}
	]
});

module.exports = suite;