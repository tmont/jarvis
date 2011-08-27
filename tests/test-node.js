global.Jarvis = require("../src/jarvis.js");
global.Assert = Jarvis.Framework.Assert;
global.Is = Jarvis.Framework.Is;
global.Has = Jarvis.Framework.Has;

var CliReporter = require("../src/reporters/CliReporter.js");
Jarvis.defaultReporter = new CliReporter();

require("./ConstraintTests.js");
require("./ExpectedErrorTests.js");
require("./FailureMessageTests.js");
require("./SampleTests.js");
require("./SetupAndTearDownTests.js");
Jarvis.summary();