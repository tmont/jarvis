function getDomTests() {
	var element;
	
	return {
		setup: function() {
			element = document.createElement("div");
			element.id = "domtest";
			element.className = "class1 class2";
			element.setAttribute("foo", "bar");
			document.body.appendChild(element);
		},
		
		tearDown: function() {
			element.parentNode.removeChild(element);
		},
		
		test: function Dom_tests() {
			var textOnlyNode;
			var textOnlyNode2;
			var flattenedTextNode;
			
			return [
				function Should_find_node_by_id() {
					Assert.that("#domtest", Is.inDom);
					Assert.that("body > #domtest", Is.inDom);
					
					Assert.that("#foo", Is.not.inDom);
				},
				
				function Should_find_node_by_class() {
					Assert.that(".class1", Is.inDom);
					Assert.that("body > .class1", Is.inDom);
					Assert.that(".class2", Is.inDom);
					Assert.that(".class1.class2", Is.inDom);
					Assert.that("#domtest.class2", Is.inDom);
					
					Assert.that(".class3", Is.not.inDom);
				},
				
				function Should_find_node_by_attribute() {
					Assert.that("[foo]", Is.inDom);
					Assert.that("[foo='bar']", Is.inDom);
					
					Assert.that("[foo='baz']", Is.not.inDom);
				},
				
				function Should_show_failure_message_when_node_is_not_in_dom() {
					try {
						Assert.that("foo", Is.inDom);
						Assert.fail("foo should not be in the DOM");
					} catch (error) {
						Assert.that(error.message, Is.equalTo("Failed asserting that the DOM contains an element matching the selector\n   foo"));
					}
				},
				
				function Should_show_negated_failure_message_when_node_is_not_in_dom() {
					try {
						Assert.that("#domtest", Is.not.inDom);
						Assert.fail("#domtest should be in the DOM");
					} catch (error) {
						Assert.that(error.message, Is.equalTo("Failed asserting that the DOM does not contain an element matching the selector\n   #domtest"));
					}
				},
				
				{
					setup: function() {
						textOnlyNode = document.createElement("p");
						textOnlyNode.appendChild(document.createTextNode("This is some text"));
						
						textOnlyNode2 = document.createElement("p");
						textOnlyNode2.appendChild(document.createTextNode("This is also some text"));
						
						flattenedTextNode = document.createElement("p");
						flattenedTextNode.appendChild(document.createTextNode("Oh hai "));
						
						var innerNode = document.createElement("strong");
						innerNode.appendChild(document.createTextNode("inner text"));
						
						flattenedTextNode.appendChild(innerNode);
						
						element.appendChild(textOnlyNode);
						element.appendChild(textOnlyNode2);
						element.appendChild(flattenedTextNode);
					},
					
					tearDown: function() {
						textOnlyNode.parentNode.removeChild(textOnlyNode);
						textOnlyNode2.parentNode.removeChild(textOnlyNode2);
						flattenedTextNode.parentNode.removeChild(flattenedTextNode);
					},
					
					test: function Text_matching_tests() {
						return [
							function Should_match_element_with_one_text_node() {
								Assert.that("#domtest p", Has.text.equalTo("This is some text"));
								Assert.that("#domtest p", Has.text.equalTo("This is also some text"));
							},
							
							function Should_show_diffs_for_all_matched_elements_on_failure() {
								var expectedHtml = "Failed asserting a condition about the text for any of the DOM elements " +
									"defined by the selector\n    #domtest p\n\n<(ol|OL)><(li|LI)><(del|DEL)>lorem ipsum</(del|DEL)><(ins|INS)>This is some " + 
									"text</(ins|INS)></(li|LI)><(li|LI)><(del|DEL)>lorem ipsum</(del|DEL)><(ins|INS)>This is also some text</(ins|INS)></(li|LI)></(ol|OL)>";
								
								try {
									Assert.that("#domtest p", Has.text.equalTo("lorem ipsum"));
									Assert.fail("test did not throw an assertion error");
								} catch (error) {
									if (typeof(error.message) !== "object") {
										Assert.ignore("Not relevant unless error.message returns a collection of DOM nodes");
									}
									
									var dummy = document.createElement("pre");
									for (var i = 0; i < error.message.length; i++) {
										dummy.appendChild(error.message[i].cloneNode(true));
									}
									
									Assert.that(dummy.innerHTML, Is.regexMatch(new RegExp(expectedHtml)));
								}
							},
							
							function Should_show_error_messages_for_all_matched_elements_on_failure() {
								var expectedText = "Failed asserting a condition about the text for any of the DOM elements " +
									"defined by the selector\n    #domtest p\n\n" +
									"1) Expected \"This is some text\" to be null\n\n2) Expected \"This is also some text\" to be null\n\n";
								
								try {
									Assert.that("#domtest p", Has.text.NULL);
									Assert.fail("test did not throw an assertion error");
								} catch (error) {
									Assert.that(error.message, Is.equalTo(expectedText));
								}
							},
							
							function Should_match_text_recursively() {
								Assert.that("#domtest p", Has.flattenedText.equalTo("Oh hai inner text"));
							},
							
							function Should_show_error_messages_for_all_matched_elements_on_recursive_text_comparison_failure() {
								var expectedHtml = "Failed asserting a condition about the recursively flattened text for any of the DOM " + 
									"elements defined by the selector\n    #domtest p\n\n<(ol|OL)><(li|LI)><(del|DEL)>oh hai inner</(del|DEL)><(ins|INS)>This is " +
									"some</(ins|INS)><(span|SPAN)> text</(span|SPAN)></(li|LI)><(li|LI)><(del|DEL)>oh hai inner</(del|DEL)><(ins|INS)>This is also some</(ins|INS)><(span|SPAN)> text</(span|SPAN)>" +
									"</(li|LI)><(li|LI)><(del|DEL)>o</(del|DEL)><(ins|INS)>O</(ins|INS)><(span|SPAN)>h hai inner text</(span|SPAN)></(li|LI)></(ol|OL)>";
									
								try {
									Assert.that("#domtest p", Has.flattenedText.equalTo("oh hai inner text"));
									Assert.fail("test did not throw an assertion error");
								} catch (error) {
									if (typeof(error.message) !== "object") {
										Assert.ignore("Not relevant unless error.message returns a collection of DOM nodes");
									}
									var dummy = document.createElement("pre");
									for (var i = 0; i < error.message.length; i++) {
										dummy.appendChild(error.message[i].cloneNode(true));
									}
									
									Assert.that(dummy.innerHTML, Is.regexMatch(new RegExp(expectedHtml)));
								}
							}
						];
					}
				}
			];
		}
	};
}

Jarvis.run(getDomTests());