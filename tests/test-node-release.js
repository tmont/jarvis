global.Jarvis = require("../build/2.0/node/jarvis.js");
global.Assert = jarvis.Framework.Assert;
global.Is = jarvis.Framework.Is;
global.Has = jarvis.Framework.Has;

require("../build/2.0/node/CliReporter.js");

require("./ConstraintTests.js");
require("./ExpectedErrorTests.js");
require("./FailureMessageTests.js");
require("./SampleTests.js");
require("./SetupAndTearDownTests.js");