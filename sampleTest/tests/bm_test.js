var fs = require("fs");

var { Connection, Request, TYPES } = require("tedious");
var results = [];

const iterations = JSON.parse(
    fs.readFileSync('./perfConfigSpec.json', 'utf8')
).iterations;

async function runAllTest(tests) {
    if (tests.before)
        await callFunction(tests.before);
    for (key in tests.test) {
        if (tests.test.hasOwnProperty(key)) {
            let currentTest = tests.test[key];
            let totalTimer = [0, 0];
            if (currentTest.beforeEachTest)
                await callFunction(currentTest.beforeEachTest, currentTest.params);

            for (var i = 0; i < iterations; i++) {
                let val = await runBenchmark(currentTest);
                totalTimer[0] += val[0];
                totalTimer[1] += val[1];
            }

            if (currentTest.afterEachTest)
                await callFunction(currentTest.afterEachTest, currentTest.params);

            results.push({
                name: currentTest.name,
                totaltime: totalTimer,
                iteration: iterations
            })
        }
    }
    if (tests.after) {
        await callFunction(tests.after);
    }
    return results;
}

async function runBenchmark(test) {
    var start, end;
    end = 0;
    if (test.beforeEachRun)
        await callFunction(test.beforeEachRun, test.params);
    if (test.exec) {
        start = process.hrtime();
        await callFunction(test.exec, test.params);
        end = process.hrtime(start);
    }
    if (test.afterEachRun)
        await callFunction(test.afterEachRun, test.params);
    return end;
}

function callFunction(fn, params) {
    return new Promise((resolve, reject) => {
        fn(resolve, reject, params);
    });
}

module.exports.runAllTest = runAllTest;
