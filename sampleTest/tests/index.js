var bm = require("./bm_test");
var connectionTest = require("./bm_connectionTest");
var crud_insert = require("./bm_crud_insert");


//TODO: display results as they are returned - to avoid data loss if something fails or hangs in middle

let results = [];
async function runBenchmarks() {
    try {
        results = await bm.runAllTest(connectionTest);
        results = await bm.runAllTest(crud_insert);
    } catch (error) {
        console.log(error)
    }
    displayResults();
    console.log('Done')
}

function displayResults() {
    results.forEach(function (result) {
        let name = result.name;
        let totaltime = result.totaltime[0] * 1000 + result.totaltime[1] / 1000000;
        let iteration = result.iteration
        console.log(`Test: ${name} , total time ${totaltime}ms for ${iteration} iterations.`)
    });
}

runBenchmarks();