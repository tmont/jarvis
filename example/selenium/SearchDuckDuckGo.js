/**
 * This file contains an example of how to use Jarvis to
 * facilitate running selenium tests.
 *
 * Run "java -jar ../../lib/selenium-standalone-server-2.5.0.jar", and then
 * run "jarvis SearchDuckDuckGo.js" to run the test.
 */

var soda = require("soda");
var jarvis = require("/usr/local/lib/node_modules/jarvis");

module.exports = function() {
	var selenium;

	return {
		setup: function() {
			selenium = soda.createClient({
				url: "http://www.duckduckgo.com/",
				browser: "firefox"
			});

			selenium = selenium.chain.session();
		},

		tearDown: function() {

		},

		test: function Selenium_tests() {
			return [
				function Search_duckduckgo_for_jarvis(guid) {
					selenium
						.open("/")
						.waitForPageToLoad(2000)
						.type("id=hfih", "jarvis javascript")
						.click("id=hfbh")
						.waitForPageToLoad(2000)
						.assertTextPresent("Jarvis: JavaScript unit testing framework");

					selenium
						.end(function(err) {
							this.command("testComplete", [], function(completeErr) {
								if (completeErr) {
									throw new Error("Unable to issue testComplete command to selenium: \"" + completeErr + "\"");
								}
							});

							if (err) {
								throw new jarvis.Error("An error occurred", "error", err);
							}
						});
				}
			];
		}
	};
};