/**
 * This file contains an example of how to use Jarvis to
 * facilitate running selenium tests.
 *
 * Run "java -jar ../../lib/selenium-standalone-server-2.5.0.jar", and then
 * in another terminal run "jarvis --async SeleniumExampleTests.js" to run the tests.
 */

var soda = require("soda");

module.exports = function() {
	var selenium;

	var seleniumEnd = function(testComplete) {
		return function(err) {
			this.command("testComplete", [], function(completeErr) {
				testComplete(completeErr || err);
			});
		};
	};

	return {
		setup: function(setupComplete) {
			selenium = soda.createClient({
				url: "http://www.duckduckgo.com/",
				browser: "firefox"
			});

			selenium = selenium.chain.session();
			setupComplete();
		},

		tearDown: function(tearDownComplete) {
			tearDownComplete();
		},

		test: function Selenium_tests() {
			return [
				function Search_duckduckgo_for_jarvis(testComplete) {
					selenium
						.open("/")
						.waitForPageToLoad(2000)
						.type("id=hfih", "jarvis javascript")
						.click("id=hfbh")
						.waitForPageToLoad(2000)
						.assertTextPresent("Jarvis: JavaScript unit testing framework")
						.end(seleniumEnd(testComplete));
				},

				function Search_github_for_jarvis(testComplete) {
					selenium
						.open("https://github.com/")
						.waitForPageToLoad(5000)
						.type("name=q", "jarvis")
						.keyPress("name=q", 13)
						.waitForPageToLoad(5000)
						.assertElementPresent("css=h2.title > a[href='/tmont/jarvis']")
						.end(seleniumEnd(testComplete));
				},

				function Test_that_totally_fails(testComplete) {
					selenium
						.open('http://www.google.com/')
						.waitForPageToLoad(5000)
						.assertTextPresent('foobiefoobie')
						.end(seleniumEnd(testComplete));
				}
			];
		}
	};
};