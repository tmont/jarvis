global.Jarvis = require("../src/jarvis.js");
require("../src/reporters/CliReporter.js");

global.Assert = Jarvis.Framework.Assert;
global.Is = Jarvis.Framework.Is;
global.Has = Jarvis.Framework.Has;

require("./ConstraintTests.js");
require("./ExpectedErrorTests.js");
require("./FailureMessageTests.js");
require("./SampleTests.js");
require("./SetupAndTearDownTests.js");