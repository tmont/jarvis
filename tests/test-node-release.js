global.Jarvis = require("../build/2.0/node/jarvis.js");
global.Assert = Jarvis.Framework.Assert;
global.Is = Jarvis.Framework.Is;
global.Has = Jarvis.Framework.Has;

require("../build/2.0/node/CliReporter.js");

require("./ConstraintTests.js");
require("./ExpectedErrorTests.js");
require("./FailureMessageTests.js");
require("./SampleTests.js");
require("./SetupAndTearDownTests.js");