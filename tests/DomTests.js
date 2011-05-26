function getDomTests() {
	var element;
	
	return {
		setup: function() {
			element = document.createElement("div");
			element.id = "domtest";
			document.body.appendChild(element);
		},
		
		tearDown: function() {
			element.parentNode.removeChild(element);
		},
		
		test: function Dom_tests() {
			var textOnlyNode;
			var textOnlyNode2;
			var flattenedTextNode;
			
			return {
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
								"defined by the selector\n    #domtest p\n\n<ol><li><del>lorem ipsum</del><ins>This is some " + 
								"text</ins></li><li><del>lorem ipsum</del><ins>This is also some text</ins></li></ol>";
							
							try {
								Assert.that("#domtest p", Has.text.equalTo("lorem ipsum"));
								Assert.fail("test did not throw an assertion error");
							} catch (error) {
								var dummy = document.createElement("pre");
								for (var i = 0; i < error.message.length; i++) {
									dummy.appendChild(error.message[i].cloneNode(true));
								}
								
								Assert.that(dummy.innerHTML, Is.equalTo(expectedHtml));
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
								"elements defined by the selector\n    #domtest p\n\n<ol><li><del>oh hai inner</del><ins>This is " +
								"some</ins><span> text</span></li><li><del>oh hai inner</del><ins>This is also some</ins><span> text</span>" +
								"</li><li><del>o</del><ins>O</ins><span>h hai inner text</span></li></ol>";
								
							try {
								Assert.that("#domtest p", Has.flattenedText.equalTo("oh hai inner text"));
								Assert.fail("test did not throw an assertion error");
							} catch (error) {
								var dummy = document.createElement("pre");
								for (var i = 0; i < error.message.length; i++) {
									dummy.appendChild(error.message[i].cloneNode(true));
								}
								
								Assert.that(dummy.innerHTML, Is.equalTo(expectedHtml));
							}
						},
					];
				}
			};
		}
	};
}

Jarvis.run(getDomTests());