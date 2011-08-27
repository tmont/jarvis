/**
 * Jarvis DOM extensions
 */
(function(jarvis, $, doc){
	function getTextRecursive(node) {
		var text = "",
			i = 0;

		if (node.nodeType === 3) {
			return node.nodeValue;
		}

		for (i = 0; i < node.childNodes.length; i++) {
			text += getTextRecursive(node.childNodes[i]);
		}

		return text;
	}

	function any(collection, predicate) {
		for (var i = 0; i < collection.length; i++) {
			if (predicate(collection[i])) {
				return true;
			}
		}

		return false;
	}

	function InDomConstraint() {
		this.isValidFor = function(selector) {
			return $(selector).length > 0;
		};

		this.getFailureMessage = function(selector, negate) {
			return "Failed asserting that the DOM " + (negate ? "does not contain" : "contains") + " an element matching the selector\n   " + selector;
		};
	}

	function getFailureMessageForDomElementTextMatch(message, constraint, texts) {
		var messages = [],
			i,
			j,
			list,
			item;

		for (i = 0; i < texts.length; i++) {
			messages[i] = constraint.getFailureMessage(texts[i]);
		}

		if (typeof(messages[0]) !== "string") {
			//node list
			message = [doc.createTextNode(message)];
			list = doc.createElement("ol");
			for (i = 0; i < messages.length; i++) {
				item = doc.createElement("li");
				for (j = 0; j < messages[i].length; j++) {
					item.appendChild(messages[i][j]);
				}

				list.appendChild(item);
			}

			message.push(list);
		} else {
			for (i = 0; i < messages.length; i++) {
				message += (i + 1) + ") " + messages[i] + "\n\n";
			}
		}

		return message;
	}

	function DomElementTextConstraint(constraint) {
		var texts = [];

		this.isValidFor = function(selector) {
			return any($(selector), function(element) {
				if (element.childNodes.length === 1 && element.childNodes[0].nodeType === 3) {
					texts.push(element.childNodes[0].nodeValue);
					return constraint.isValidFor(element.childNodes[0].nodeValue);
				}

				return false;
			});
		};

		this.getFailureMessage = function(selector, negate) {
			var message = "Failed asserting a condition about the " +
				"text for any of the DOM elements defined by the selector\n    " + selector + "\n\n";
			return getFailureMessageForDomElementTextMatch(message, constraint, texts);
		};
	}

	function DomElementFlattenedTextConstraint(constraint) {
		var texts = [];

		this.isValidFor = function(selector) {
			return any($(selector), function(element) {
				texts.push(getTextRecursive(element));
				return constraint.isValidFor(texts[texts.length - 1]);
			});
		};

		this.getFailureMessage = function(selector, negate) {
			var message = "Failed asserting a condition about the recursively flattened " +
				"text for any of the DOM elements defined by the selector\n    " + selector + "\n\n";
			return getFailureMessageForDomElementTextMatch(message, constraint, texts);
		};
	}

	jarvis.Framework.CollectionAssertionInterface.prototype.text = function() {
		var assertionInterface = new jarvis.Framework.AssertionInterface(function(constraint) {
			return new DomElementTextConstraint(constraint);
		});

		assertionInterface.not = new jarvis.Framework.AssertionInterface(function(constraint) {
			return new jarvis.Framework.Constraints.Not(new DomElementTextConstraint(constraint));
		});

		return assertionInterface;
	}();

	jarvis.Framework.CollectionAssertionInterface.prototype.flattenedText = function() {
		var assertionInterface = new jarvis.Framework.AssertionInterface(function(constraint) {
			return new DomElementFlattenedTextConstraint(constraint);
		});

		assertionInterface.not = new jarvis.Framework.AssertionInterface(function(constraint) {
			return new jarvis.Framework.Constraints.Not(new DomElementFlattenedTextConstraint(constraint));
		});

		return assertionInterface;
	}();

	jarvis.Framework.AssertionInterface.prototype.inDom = function() {
		return this.factory(new InDomConstraint());
	};

	//add DOM-related constraints to collection
	jarvis.Framework.Constraints.DomElementText = DomElementTextConstraint;
	jarvis.Framework.Constraints.DomElementFlattenedText = DomElementFlattenedTextConstraint;
	jarvis.Framework.Constraints.InDom = InDomConstraint;

}(Jarvis, Sizzle, document));