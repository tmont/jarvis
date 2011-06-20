(function(global, doc, undefined){
	if (!doc) {
		return;
	}
	
	var EOL = !+"\v1" ? "\r" : "\n",
		imageSource = {
			running: "data:image/gif;base64,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",
			pass: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAKfSURBVDjLpZPrS1NhHMf9O3bOdmwDCWREIYKEUHsVJBI7mg3FvCxL09290jZj2EyLMnJexkgpLbPUanNOberU5taUMnHZUULMvelCtWF0sW/n7MVMEiN64AsPD8/n83uucQDi/id/DBT4Dolypw/qsz0pTMbj/WHpiDgsdSUyUmeiPt2+V7SrIM+bSss8ySGdR4abQQv6lrui6VxsRonrGCS9VEjSQ9E7CtiqdOZ4UuTqnBHO1X7YXl6Daa4yGq7vWO1D40wVDtj4kWQbn94myPGkCDPdSesczE2sCZShwl8CzcwZ6NiUs6n2nYX99T1cnKqA2EKui6+TwphA5k4yqMayopU5mANV3lNQTBdCMVUA9VQh3GuDMHiVcLCS3J4jSLhCGmKCjBEx0xlshjXYhApfMZRP5CyYD+UkG08+xt+4wLVQZA1tzxthm2tEfD3JxARH7QkbD1ZuozaggdZbxK5kAIsf5qGaKMTY2lAU/rH5HW3PLsEwUYy+YCcERmIjJpDcpzb6l7th9KtQ69fi09ePUej9l7cx2DJbD7UrG3r3afQHOyCo+V3QQzE35pvQvnAZukk5zL5qRL59jsKbPzdheXoBZc4saFhBS6AO7V4zqCpiawuptwQG+UAa7Ct3UT0hh9p9EnXT5Vh6t4C22QaUDh6HwnECOmcO7K+6kW49DKqS2DrEZCtfuI+9GrNHg4fMHVSO5kE7nAPVkAxKBxcOzsajpS4Yh4ohUPPWKTUh3PaQEptIOr6BiJjcZXCwktaAGfrRIpwblqOV3YKdhfXOIvBLeREWpnd8ynsaSJoyESFphwTtfjN6X1jRO2+FxWtCWksqBApeiFIR9K6fiTpPiigDoadqCEag5YUFKl6Yrciw0VOlhOivv/Ff8wtn0KzlebrUYwAAAABJRU5ErkJggg==",
			ignore: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAKcSURBVDjLpZPLa9RXHMU/d0ysZEwmMQqZiTaP0agoaKGJUiwIxU0hUjtUQaIuXHSVbRVc+R8ICj5WvrCldJquhVqalIbOohuZxjDVxDSP0RgzyST9zdzvvffrQkh8tBs9yy9fPhw45xhV5X1U8+Yhc3U0LcEdVxdOVq20OA0ooQjhpnfhzuDZTx6++m9edfDFlZGMtXKxI6HJnrZGGtauAWAhcgwVnnB/enkGo/25859l3wIcvpzP2EhuHNpWF9/dWs/UnKW4EOGDkqhbQyqxjsKzMgM/P1ymhlO5C4ezK4DeS/c7RdzQoa3x1PaWenJjJZwT9rQ1gSp/js1jYoZdyfX8M1/mp7uFaTR8mrt29FEMQILr62jQ1I5kA8OF59jIItVA78dJertTiBNs1ZKfLNG+MUHX1oaURtIHEAOw3p/Y197MWHEJEUGCxwfHj8MTZIcnsGKxzrIURYzPLnJgbxvG2hMrKdjItjbV11CYKeG8R7ygIdB3sBMFhkem0RAAQ3Fuka7UZtRHrasOqhYNilOwrkrwnhCU/ON5/q04vHV48ThxOCuoAbxnBQB+am65QnO8FqMxNCjBe14mpHhxBBGCWBLxD3iyWMaYMLUKsO7WYH6Stk1xCAGccmR/Ozs/bKJuXS39R/YgIjgROloSDA39Deit1SZWotsjD8pfp5ONqZ6uTfyWn+T7X0f59t5fqDhUA4ry0fYtjJcWeZQvTBu4/VqRuk9/l9Fy5cbnX+6Od26s58HjWWaflwkusKGxjm1bmhkvLXHvh1+WMbWncgPfZN+qcvex6xnUXkzvSiYP7EvTvH4toDxdqDD4+ygT+cKMMbH+3MCZ7H9uAaDnqytpVX8cDScJlRY0YIwpAjcNcuePgXP/P6Z30QuoP4J7WbYhuQAAAABJRU5ErkJggg==",
			error: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAIsSURBVDjLpVNLSJQBEP7+h6uu62vLVAJDW1KQTMrINQ1vPQzq1GOpa9EppGOHLh0kCEKL7JBEhVCHihAsESyJiE4FWShGRmauu7KYiv6Pma+DGoFrBQ7MzGFmPr5vmDFIYj1mr1WYfrHPovA9VVOqbC7e/1rS9ZlrAVDYHig5WB0oPtBI0TNrUiC5yhP9jeF4X8NPcWfopoY48XT39PjjXeF0vWkZqOjd7LJYrmGasHPCCJbHwhS9/F8M4s8baid764Xi0Ilfp5voorpJfn2wwx/r3l77TwZUvR+qajXVn8PnvocYfXYH6k2ioOaCpaIdf11ivDcayyiMVudsOYqFb60gARJYHG9DbqQFmSVNjaO3K2NpAeK90ZCqtgcrjkP9aUCXp0moetDFEeRXnYCKXhm+uTW0CkBFu4JlxzZkFlbASz4CQGQVBFeEwZm8geyiMuRVntzsL3oXV+YMkvjRsydC1U+lhwZsWXgHb+oWVAEzIwvzyVlk5igsi7DymmHlHsFQR50rjl+981Jy1Fw6Gu0ObTtnU+cgs28AKgDiy+Awpj5OACBAhZ/qh2HOo6i+NeA73jUAML4/qWux8mt6NjW1w599CS9xb0mSEqQBEDAtwqALUmBaG5FV3oYPnTHMjAwetlWksyByaukxQg2wQ9FlccaK/OXA3/uAEUDp3rNIDQ1ctSk6kHh1/jRFoaL4M4snEMeD73gQx4M4PsT1IZ5AfYH68tZY7zv/ApRMY9mnuVMvAAAAAElFTkSuQmCC",
			fail: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAJPSURBVDjLpZPLS5RhFMYfv9QJlelTQZwRb2OKlKuINuHGLlBEBEOLxAu46oL0F0QQFdWizUCrWnjBaDHgThCMoiKkhUONTqmjmDp2GZ0UnWbmfc/ztrC+GbM2dXbv4ZzfeQ7vefKMMfifyP89IbevNNCYdkN2kawkCZKfSPZTOGTf6Y/m1uflKlC3LvsNTWArr9BT2LAf+W73dn5jHclIBFZyfYWU3or7T4K7AJmbl/yG7EtX1BQXNTVCYgtgbAEAYHlqYHlrsTEVQWr63RZFuqsfDAcdQPrGRR/JF5nKGm9xUxMyr0YBAEXXHgIANq/3ADQobD2J9fAkNiMTMSFb9z8ambMAQER3JC1XttkYGGZXoyZEGyTHRuBuPgBTUu7VSnUAgAUAWutOV2MjZGkehgYUA6O5A0AlkAyRnotiX3MLlFKduYCqAtuGXpyH0XQmOj+TIURt51OzURTYZdBKV2UBSsOIcRp/TVTT4ewK6idECAihtUKOArWcjq/B8tQ6UkUR31+OYXP4sTOdisivrkMyHodWejlXwcC38Fvs8dY5xaIId89VlJy7ACpCNCFCuOp8+BJ6A631gANQSg1mVmOxxGQYRW2nHMha4B5WA3chsv22T5/B13AIicWZmNZ6cMchTXUe81Okzz54pLi0uQWp+TmkZqMwxsBV74Or3od4OISPr0e3SHa3PX0f3HXKofNH/UIG9pZ5PeUth+CyS2EMkEqs4fPEOBJLsyske48/+xD8oxcAYPzs4QaS7RR2kbLTTOTQieczfzfTv8QPldGvTGoF6/8AAAAASUVORK5CYII=",
			collapse: "data:image/gif;base64,R0lGODlhCwALAMQGAK2traKiotra2sTExOvr66GhoRy+Z1ogufz8/NfX19vb2/X19eXl5fn5+fDw8ODg4JiYmAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAAYALAAAAAALAAsAAAU5oAFAZAkBRiEgbIsIBdTMNE0ueJ6TTu/7JALhQCQKSYykUkl6OJ9PkmJKpUICg4R2mxgEUqZSwRACADs=",
			expand: "data:image/gif;base64,R0lGODlhCwALAMQGAK2traKiotra2sTExOvr66GhoRy+Z/z8/NfX1/X19eXl5fDw8ODg4Nvb21ogufn5+ZiYmAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAAYALAAAAAALAAsAAAVAoAFAZAkBRiEcbHsIBfTMNE0meOLkCbn8CwdwQSIQHEikkaRoKhxOBYlBZTiqDFJjy+VCAgOEeIwYBFKmUsEQAgA7"
		},
	
		css = "\
/* new clearfix */\n\
.clearfix:after {\n\
    visibility: hidden;\n\
    display: block;\n\
    font-size: 0;\n\
    content: \" \";\n\
    clear: both;\n\
    height: 0;\n\
}\n\
* html .clearfix             { zoom: 1; } /* IE6 */\n\
*:first-child+html .clearfix { zoom: 1; } /* IE7 */\n\
\n\
.jarvis-test {\n\
	color: black;\n\
	font-family: \"Trebuchet MS\", \"Droid sans Mono\", Calibri, Verdana, sans-serif;\n\
	padding: 5px;\n\
	margin: 8px auto;\n\
	opacity: .9;\n\
	filter: alpha(opacity=90);\n\
	font-size: 14px;\n\
	position: relative;\n\
	box-shadow: 0 8px 5px -5px rgba(0, 0, 0, 0.5), 0 1px 2px rgba(0, 0, 0, 0.3), 0 0 20px rgba(0, 0, 0, 0.1) inset;\n\
	-moz-box-shadow: 0 8px 5px -5px rgba(0, 0, 0, 0.5), 0 1px 2px rgba(0, 0, 0, 0.3), 0 0 20px rgba(0, 0, 0, 0.1) inset;\n\
	-webkit-box-shadow: 0 8px 5px -5px rgba(0, 0, 0, 0.5), 0 1px 2px rgba(0, 0, 0, 0.3), 0 0 20px rgba(0, 0, 0, 0.1) inset;\n\
}\n\
.jarvis-test .jarvis-test {\n\
	margin-left: 10px;\n\
}\n\
.jarvis-test-info {\n\
	font-family: Consolas, Inconsolata, Monaco, \"Courier New\", monospace;\n\
	font-size: 12px;\n\
	font-weight: normal;\n\
	float: right;\n\
	line-height: 18px;\n\
}\n\
\n\
.jarvis-test p {\n\
	font-weight: bold;\n\
	padding: 0;\n\
	margin: 0;\n\
	text-shadow: 2px -1px 1px #CCCCCC;\n\
	color: #000000;\n\
}\n\
.jarvis-test p img {\n\
	margin-right: 3px;\n\
	width: 11px;\n\
	height: 11px;\n\
}\n\
.jarvis-test:hover {\n\
	opacity: 1;\n\
	filter: alpha(opacity=100);\n\
}\n\
\n\
.jarvis-stack-trace {\n\
	color: #990000;\n\
	margin-top: 20px;\n\
}\n\
\n\
.jarvis-summary {\n\
	background-color: #EEEEEE;\n\
	font-size: 20px;\n\
}\n\
.jarvis-summary .jarvis-test-info {\n\
	font-size: 16px;\n\
	font-weight: bold;\n\
	line-height: 24px;\n\
}\n\
\n\
.jarvis-test pre {\n\
	font-family: Consolas, Inconsolata, \"Courier New\", monospace;\n\
	color: #000000;\n\
	padding: 5px;\n\
	overflow-x: auto;\n\
	background-color: #FFFFFF;\n\
	box-shadow: 0 15px 10px -10px rgba(0, 0, 0, 0.5), 0 1px 4px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 0, 0, 0.1) inset;\n\
	-moz-box-shadow: 0 15px 10px -10px rgba(0, 0, 0, 0.5), 0 1px 4px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 0, 0, 0.1) inset;\n\
	-webkit-box-shadow: 0 15px 10px -10px rgba(0, 0, 0, 0.5), 0 1px 4px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 0, 0, 0.1) inset;\n\
}\n\
\n\
.jarvis-test-result-running, .jarvis-test-result-pass, .jarvis-test-result-ignore, .jarvis-test-result-error, .jarvis-test-result-fail {\n\
	padding-left: 20px;\n\
}\n\
\n\
.jarvis-icon {\n\
	width: 16px;\n\
	height: 16px;\n\
	position: absolute;\n\
	left: 2px;\n\
}\n\
\n\
.jarvis-test-result-running {\n\
	background-color: #CCCCCC;\n\
}\n\
.jarvis-test-result-pass {\n\
	background-color: #BBEEBA;\n\
}\n\
.jarvis-test-result-ignore {\n\
	background-color: #CCCCFF;\n\
}\n\
.jarvis-test-result-error {\n\
	background-color: #FFCC99;\n\
}\n\
.jarvis-test-result-fail {\n\
	background-color: #FFCCCC;\n\
}\n\
\n\
.jarvis-test ins {\n\
	background-color: #66FF66;\n\
	text-decoration: none;\n\
}\n\
.jarvis-test del {\n\
	background-color: #FF6666;\n\
	text-decoration: none;\n\
}";
	
	global.Jarvis.HtmlReporter = function(container, options) {
		options = options || { collapsedByDefault: true };
		var tests = {}, 
			totals = {
				pass: 0,
				fail: 0,
				error: 0,
				ignore: 0,
				total: 0,
				elapsedTime: 0
			},
			collapsedByDefault = !!options.collapsedByDefault;
		
		container = container || doc.body;
		
		this.summary = function(totalAssertions) {
			var summary = doc.createElement("div"),
				title = doc.createElement("p"),
				infoContainer = doc.createElement("span")
				percent = totals.total === 0 ? 0 : Math.round(totals.pass * 10000 / totals.total) / 100;
			
			summary.className = "jarvis-test jarvis-summary";
			
			title.className = "clearfix";
			title.appendChild(doc.createTextNode("Summary"));
			
			infoContainer.className = "jarvis-test-info";
			infoContainer.appendChild(doc.createTextNode(totals.pass + "/" + totals.total + " " + percent + "% (" + totals.elapsedTime + "ms, " + totalAssertions + " assertion" + (totalAssertions !== 1 ? "s" : "") + ")"));
			
			summary.appendChild(title);
			title.appendChild(infoContainer);
			
			addGradient(totals, summary);
			
			container.appendChild(summary);
		},
		
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
			title.className = "clearfix";
			title.appendChild(doc.createTextNode(name));
			
			icon.className = "jarvis-icon";
			icon.src = imageSource.running;
			
			element.appendChild(icon);
			element.appendChild(title);
			
			if (tests[parentId]) {
				if (!tests[parentId].childContainer) {
					childContainer = doc.createElement("div");
					childContainer.className = "jarvis-child-test-container";
					childContainer.style.display = collapsedByDefault ? "none" : "block";
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
				infoContainer,
				messageContainer,
				list,
				item,
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
					totals.total++;
					totals[actualStatus]++;
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
				info = 	test.childResults.pass + "/" + test.childResults.total + " " + 
					(Math.round(test.childResults.pass * 10000 / test.childResults.total) / 100) + "% ";
				
				addGradient(test.childResults, test.element);
			}
			
			info += "(" + (test.endTime - test.startTime) + "ms, " + test.assertions + " assertion" + (test.assertions !== 1 ? "s" : "") + ")";
			infoContainer = doc.createElement("span");
			infoContainer.className = "jarvis-test-info";
			infoContainer.appendChild(doc.createTextNode(info));
			test.title.appendChild(infoContainer);
			
			if (result.message || result.stackTrace.length > 0) {
				messageContainer = doc.createElement("pre");
				
				if (result.message) {
					if (result.message[0] && typeof(result.message[0].nodeType) !== "undefined") {
						for (i = 0; i < result.message.length; i++) {
							messageContainer.appendChild(result.message[i]);
						}
					} else {
						messageContainer.appendChild(doc.createTextNode(result.message.replace(/\n/g, EOL)));
					}
				}
				
				if (result.stackTrace.length > 0) {
					list = doc.createElement("ol");
					list.className = "jarvis-stack-trace";
					for (i = 0; i < result.stackTrace.length; i++) {
						item = doc.createElement("li");
						item.appendChild(doc.createTextNode(result.stackTrace[i]));
						list.appendChild(item);
					}
					
					messageContainer.appendChild(list);
				}
				
				messageContainer.style.display = collapsedByDefault ? "none" : "block";
				test.element.appendChild(messageContainer);
			}
			
			if (result.message || test.childResults.total > 0) {
				test.title.style.cursor = "pointer";
				test.title.insertBefore(doc.createElement("img"), test.title.firstChild);
				test.title.firstChild.src = collapsedByDefault ? imageSource.expand : imageSource.collapse;
				test.title.firstChild.alt = collapsedByDefault ? "+" : "-";
				test.title.onclick = titleClick;
			}
			
			totals.elapsedTime += (test.endTime - test.startTime);
			delete tests[id];
		};
		
		function titleClick() {
			var display = this.nextSibling.style.display;
			this.nextSibling.style.display = display === "none" ? "block" : "none";
			this.firstChild.src = display === "none" ? imageSource.collapse : imageSource.expand;
			this.firstChild.alt = display === "none" ? "-" : "+";
			return false;
		}
		
		function addGradient(totals, element) {
			if (!/(Firefox|WebKit|Opera)/i.test(global.navigator.userAgent)) {
				return;
			}
			
			var failPercent = Math.round(totals.fail / totals.total * 100),
				passPercent = Math.round(totals.pass / totals.total * 100),
				errorPercent = Math.round(totals.error / totals.total * 100),
				ignorePercent = Math.round(totals.ignore / totals.total * 100),
				gradients = [];
				
			if (failPercent > 0) {
				gradients.push("#FFCCCC 0%");
			}
			if (errorPercent > 0) {
				gradients.push("#FFCC99 " + failPercent + "%");
			}
			if (ignorePercent > 0) {
				gradients.push("#CCCCFF " + (errorPercent + failPercent) + "%");
			}
			if (passPercent > 0) {
				gradients.push("#CCFFCC " + (failPercent + errorPercent + ignorePercent)  + "%");
			}
			
			if (/Firefox/i.test(global.navigator.userAgent)) {
				element.style.backgroundImage = "-moz-linear-gradient(left, " + gradients.join(", ") + ")";
			} else if (/WebKit/i.test(global.navigator.userAgent)) {
				element.style.backgroundImage = "-webkit-linear-gradient(left, " + gradients.join(", ") + ")";
			} else if (/Opera/i.test(global.navigator.userAgent)) {
				element.style.backgroundImage = "-o-linear-gradient(left, " + gradients.join(", ") + ")";
			}
		}
	};
	
	global.Jarvis.defaultReporter = new Jarvis.HtmlReporter();
	global.Jarvis.htmlDiffs = true;
	global.Jarvis.showStackTraces = true;
	
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
			doc.body.parentNode.insertBefore(head, doc.body);
		}
		
		head.appendChild(style);
	}());

}(this, this["document"]));