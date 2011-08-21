(function(window){
	if (!window || typeof(window.Jarvis) === "undefined") {
		throw "Include jarvis.js before bootstrapping";
	}

	window.Assert = window.Jarvis.Framework.Assert;
	window.Is = window.Jarvis.Framework.Is;
	window.Has = window.Jarvis.Framework.Has;

}(window));