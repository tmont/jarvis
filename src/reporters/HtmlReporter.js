(function(global, doc, undefined){
	
	var imageSource = {
			running: "data:image/gif;base64,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",
			pass: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAKfSURBVDjLpZPrS1NhHMf9O3bOdmwDCWREIYKEUHsVJBI7mg3FvCxL09290jZj2EyLMnJexkgpLbPUanNOberU5taUMnHZUULMvelCtWF0sW/n7MVMEiN64AsPD8/n83uucQDi/id/DBT4Dolypw/qsz0pTMbj/WHpiDgsdSUyUmeiPt2+V7SrIM+bSss8ySGdR4abQQv6lrui6VxsRonrGCS9VEjSQ9E7CtiqdOZ4UuTqnBHO1X7YXl6Daa4yGq7vWO1D40wVDtj4kWQbn94myPGkCDPdSesczE2sCZShwl8CzcwZ6NiUs6n2nYX99T1cnKqA2EKui6+TwphA5k4yqMayopU5mANV3lNQTBdCMVUA9VQh3GuDMHiVcLCS3J4jSLhCGmKCjBEx0xlshjXYhApfMZRP5CyYD+UkG08+xt+4wLVQZA1tzxthm2tEfD3JxARH7QkbD1ZuozaggdZbxK5kAIsf5qGaKMTY2lAU/rH5HW3PLsEwUYy+YCcERmIjJpDcpzb6l7th9KtQ69fi09ePUej9l7cx2DJbD7UrG3r3afQHOyCo+V3QQzE35pvQvnAZukk5zL5qRL59jsKbPzdheXoBZc4saFhBS6AO7V4zqCpiawuptwQG+UAa7Ct3UT0hh9p9EnXT5Vh6t4C22QaUDh6HwnECOmcO7K+6kW49DKqS2DrEZCtfuI+9GrNHg4fMHVSO5kE7nAPVkAxKBxcOzsajpS4Yh4ohUPPWKTUh3PaQEptIOr6BiJjcZXCwktaAGfrRIpwblqOV3YKdhfXOIvBLeREWpnd8ynsaSJoyESFphwTtfjN6X1jRO2+FxWtCWksqBApeiFIR9K6fiTpPiigDoadqCEag5YUFKl6Yrciw0VOlhOivv/Ff8wtn0KzlebrUYwAAAABJRU5ErkJggg==",
			ignore: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAABzSURBVDjLY/j//z9Dzqzj0UB8E8puA+KnBNgVQNwEYoM4WSRqBrEfQdmeIOIhiZph7BYg3sZApmY4myLNIFcwUKAZzB5wL7SNeoFKXiinIDlXgohUpLRNiuZakOUwL3gB8TEcGh5D2TVAfAnKLgbiDhAbAJ0nqHy8Qq7oAAAAAElFTkSuQmCC",
			error: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAIsSURBVDjLpVNLSJQBEP7+h6uu62vLVAJDW1KQTMrINQ1vPQzq1GOpa9EppGOHLh0kCEKL7JBEhVCHihAsESyJiE4FWShGRmauu7KYiv6Pma+DGoFrBQ7MzGFmPr5vmDFIYj1mr1WYfrHPovA9VVOqbC7e/1rS9ZlrAVDYHig5WB0oPtBI0TNrUiC5yhP9jeF4X8NPcWfopoY48XT39PjjXeF0vWkZqOjd7LJYrmGasHPCCJbHwhS9/F8M4s8baid764Xi0Ilfp5voorpJfn2wwx/r3l77TwZUvR+qajXVn8PnvocYfXYH6k2ioOaCpaIdf11ivDcayyiMVudsOYqFb60gARJYHG9DbqQFmSVNjaO3K2NpAeK90ZCqtgcrjkP9aUCXp0moetDFEeRXnYCKXhm+uTW0CkBFu4JlxzZkFlbASz4CQGQVBFeEwZm8geyiMuRVntzsL3oXV+YMkvjRsydC1U+lhwZsWXgHb+oWVAEzIwvzyVlk5igsi7DymmHlHsFQR50rjl+981Jy1Fw6Gu0ObTtnU+cgs28AKgDiy+Awpj5OACBAhZ/qh2HOo6i+NeA73jUAML4/qWux8mt6NjW1w599CS9xb0mSEqQBEDAtwqALUmBaG5FV3oYPnTHMjAwetlWksyByaukxQg2wQ9FlccaK/OXA3/uAEUDp3rNIDQ1ctSk6kHh1/jRFoaL4M4snEMeD73gQx4M4PsT1IZ5AfYH68tZY7zv/ApRMY9mnuVMvAAAAAElFTkSuQmCC",
			fail: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAJPSURBVDjLpZPLS5RhFMYfv9QJlelTQZwRb2OKlKuINuHGLlBEBEOLxAu46oL0F0QQFdWizUCrWnjBaDHgThCMoiKkhUONTqmjmDp2GZ0UnWbmfc/ztrC+GbM2dXbv4ZzfeQ7vefKMMfifyP89IbevNNCYdkN2kawkCZKfSPZTOGTf6Y/m1uflKlC3LvsNTWArr9BT2LAf+W73dn5jHclIBFZyfYWU3or7T4K7AJmbl/yG7EtX1BQXNTVCYgtgbAEAYHlqYHlrsTEVQWr63RZFuqsfDAcdQPrGRR/JF5nKGm9xUxMyr0YBAEXXHgIANq/3ADQobD2J9fAkNiMTMSFb9z8ambMAQER3JC1XttkYGGZXoyZEGyTHRuBuPgBTUu7VSnUAgAUAWutOV2MjZGkehgYUA6O5A0AlkAyRnotiX3MLlFKduYCqAtuGXpyH0XQmOj+TIURt51OzURTYZdBKV2UBSsOIcRp/TVTT4ewK6idECAihtUKOArWcjq/B8tQ6UkUR31+OYXP4sTOdisivrkMyHodWejlXwcC38Fvs8dY5xaIId89VlJy7ACpCNCFCuOp8+BJ6A631gANQSg1mVmOxxGQYRW2nHMha4B5WA3chsv22T5/B13AIicWZmNZ6cMchTXUe81Okzz54pLi0uQWp+TmkZqMwxsBV74Or3od4OISPr0e3SHa3PX0f3HXKofNH/UIG9pZ5PeUth+CyS2EMkEqs4fPEOBJLsyske48/+xD8oxcAYPzs4QaS7RR2kbLTTOTQieczfzfTv8QPldGvTGoF6/8AAAAASUVORK5CYII="
		},
	
		css = "\
.jarvis-test {\
	border: 1px solid black;\
	color: black;\
	font-family: \"Trebuchet MS\", \"Droid sans Mono\", Calibri, Verdana, sans-serif;\
	padding: 5px;\
	margin-bottom: 2px;\
	margin-top: 2px;\
	font-size: 14px;\
	position: relative;\
}\
.jarvis-test .jarvis-test {\
	margin-left: 10px;\
}\
\
.jarvis-test p {\
	font-weight: bold;\
	padding: 0;\
	margin: 0;\
}\
\
.jarvis-test pre {\
	font-family: Consolas, Inconsolata, \"Courier New\", monospace;\
	background-color: white;\
}\
\
.jarvis-test-result-running, .jarvis-test-result-pass, .jarvis-test-result-ignore, .jarvis-test-result-error, .jarvis-test-result-fail {\
	padding-left: 20px;\
}\
\
.jarvis-icon {\
	width: 16px;\
	height: 16px;\
	position: absolute;\
	left: 2px;\
}\
\
.jarvis-test-result-running {\
	background-color: #CCCCCC;\
}\
.jarvis-test-result-pass {\
	background-color: #BBEEBA;\
}\
.jarvis-test-result-ignore {\
	background-color: #CCCCFF;\
}\
.jarvis-test-result-error {\
	background-color: #FFCC99;\
}\
.jarvis-test-result-fail {\
	background-color: #FFCCCC;\
}\
\
.jarvis-test ins {\
	background-color: #66FF66;\
	text-decoration: none;\
}\
.jarvis-test del {\
	background-color: #FF6666;\
	text-decoration: none;\
}\
";
	
	global.Jarvis.HtmlReporter = function(container) {
		var tests = {};
		container = container || doc.body;
		
		this.startTest = function(name, id, parentId) {
			var element = doc.createElement("div"),
				title = doc.createElement("p"),
				icon = doc.createElement("img"),
				parent,
				childContainer,
				test = { 
					name: name,
					startTime: new Date().getTime(),
					endTime: 0,
					element: element,
					icon: icon,
					title: title,
					parentId: parentId,
					childContainer: null,
					childResults: {
						fail: 0,
						pass: 0,
						ignore: 0,
						error: 0,
						total: 0
					}
				};
			
			element.className = "jarvis-test jarvis-test-result-running";
			title.appendChild(doc.createTextNode(name));
			
			icon.className = "jarvis-icon";
			icon.src = imageSource.running;
			
			element.appendChild(icon);
			element.appendChild(title);
			
			if (tests[parentId]) {
				if (!tests[parentId].childContainer) {
					childContainer = doc.createElement("div");
					childContainer.className = "jarvis-child-test-container";
					childContainer.style.display = global.Jarvis.collapsedByDefault ? "none" : "block";
					tests[parentId].element.appendChild(childContainer);
					tests[parentId].childContainer = childContainer;
				}
				
				parent = tests[parentId].childContainer;
			} else {
				parent = container;
			}
			
			parent.appendChild(test.element);
			tests[id] = test;
		};
		
		this.endTest = function(result, id) {
			var test = tests[id],
				parent,
				actualStatus,
				info = "",
				messageContainer,
				i;
				
			test.endTime = new Date().getTime();
			test.assertions = result.assertions;
			
			actualStatus = "pass";
			if (test.childResults.ignore === test.childResults.total) {
				actualStatus = "ignore";
			} else if (test.childResults.fail > 0 || test.childResults.error > 0) {
				actualStatus = "fail";
			}
			
			if (test.childResults.total === 0) {
				actualStatus = result.status;
			}
			
			if (test.parentId) {
				//update parent
				parent = tests[test.parentId];
				if (test.childResults.total === 0) {
					parent.childResults[actualStatus]++;
					parent.childResults.total++;
				} else {
					parent.childResults.pass += test.childResults.pass;
					parent.childResults.error += test.childResults.error;
					parent.childResults.fail += test.childResults.fail;
					parent.childResults.ignore += test.childResults.ignore;
					parent.childResults.total += test.childResults.total;
				}
			}
			
			test.element.className = "jarvis-test jarvis-test-result-" + actualStatus;
			test.icon.src = imageSource[actualStatus];
			
			if (test.childResults.total > 0) {
				info = 
					"[" + 
						test.childResults.pass + " / " + test.childResults.total + " - " + 
						(Math.round(test.childResults.pass * 10000 / test.childResults.total) / 100) + 
					"%] ";
				
				addGradient(test);
			}
			
			info += "(" + (test.endTime - test.startTime) + "ms, " + test.assertions + " assertions)";
			test.title.appendChild(doc.createTextNode(" " + info));
			
			if (result.message) {
				messageContainer = doc.createElement("pre"); 
				
				if (result.message[0] && typeof(result.message[0].nodeType) !== "undefined") {
					for (i = 0; i < result.message.length; i++) {
						messageContainer.appendChild(result.message[i]);
					}
				} else {
					messageContainer.appendChild(doc.createTextNode(result.message));
				}
				
				messageContainer.style.display = global.Jarvis.collapsedByDefault ? "none" : "block";
				test.element.appendChild(messageContainer);
			}
			if (result.message || test.childResults.total > 0) {
				test.title.style.cursor = "pointer";
				test.title.onclick = titleClick;
			}
			
			delete tests[id];
		};
		
		function titleClick() {
			var display = this.nextSibling.style.display;
			this.nextSibling.style.display = display === "none" ? "block" : "none";
			return false;
		}
		
		function addGradient(test) {
			var failPercent,
				passPercent,
				errorPercent,
				ignorePercent,
				failColor,
				passColor,
				errorColor,
				ignoreColor,
				gradients = [];
				
			//safari and webkit gradients
			failPercent = Math.round(test.childResults.fail / test.childResults.total * 100);
			passPercent = Math.round(test.childResults.pass / test.childResults.total * 100);
			ignorePercent = Math.round(test.childResults.ignore / test.childResults.total * 100);
			errorPercent = Math.round(test.childResults.error / test.childResults.total * 100);
			
			failColor = "#FFCCCC";
			passColor = "#CCFFCC";
			errorColor = "#FFCC99";
			ignoreColor = "#CCCCFF";
		
			if (failPercent > 0) {
				gradients.push(failColor + " " + failPercent + "%");
			}
			if (errorPercent > 0) {
				gradients.push(errorColor + " " + (failPercent + errorPercent) + "%");
			}
			if (ignorePercent > 0) {
				gradients.push(ignoreColor + " " + (failPercent + errorPercent + ignorePercent) + "%");
			}
			
			gradients.push(passColor + " 100%");
			
			if (/Firefox/.test(global.navigator.userAgent)) {
				//mozilla
				test.element.style.backgroundImage = "-moz-linear-gradient(left, " + gradients.join(", ") + ")";
			} else if (/WebKit/.test(global.navigator.userAgent)) {
				//webkit (safari/chrome)
				test.element.style.backgroundImage = "-webkit-linear-gradient(left, " + gradients.join(", ") + ")";
			}
		}
	};
	
	global.Jarvis.reporter = new Jarvis.HtmlReporter();
	global.Jarvis.htmlDiffs = true;
	global.Jarvis.collapsedByDefault = true;
	
	//add stylesheet
	(function(){
		var style = doc.createElement("style"),
			head = doc.getElementsByTagName("head")[0];
		
		style.setAttribute("type", "text/css");
		
		if (style.styleSheet) {
			style.styleSheet.cssText = css;
		} else {
			style.appendChild(doc.createTextNode(css));
		}
		
		//append to head element
		
		if (!head) {
			head = doc.createElement("head");
			doc.documentElement.insertBefore(head, doc.body);
		}
		
		head.appendChild(style);
	}());

}(this, document));