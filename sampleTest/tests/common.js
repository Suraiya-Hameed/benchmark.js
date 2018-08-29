"use strict";

var fs = require("fs");
var Benchmark = require("benchmark");
var Connection = require('tedious').Connection;
var config = require('./connectionConfig');

function createConnection(cb) {
  var connection = new Connection(config);
  connection.on("connect", function() {
    cb(connection);
  });
}

async function createBenchmark(test) {
      return  await runBenchmark(test);
}

function runBenchmark(test) {
  var memStart, memMax = memStart = process.memoryUsage().rss;

  return new Promise((resolve, reject) => {
    
  test.setup(function(err) {
    if (err) throw err;

    var bm = new Benchmark(test.name, {
      defer: true,
      fn: function(deferred) {
        test.exec(function(err) {
          if (err) throw err;

          memMax = Math.max(memMax, process.memoryUsage().rss);

          deferred.resolve();
        });
      },
      'initCount': 10,  // number of times to repeat the operation
      'maxSamples': 10  // number of iterations to sample over
    });

    bm.on("complete", function(event) {
      console.log(String(event.target))
      console.log('average time: ', bm.timeForBenchmarkExec, 's for ', bm.initCount, 'operations');
      console.log("Memory:", (memMax - memStart)/1024/1024, "MiB")

      test.teardown(function(err) {
        if (err) throw err;
        resolve();
      });
    });
    
    bm.run({ "async": false });
  });
  })
}


module.exports.createBenchmark = createBenchmark;
module.exports.createConnection = createConnection;

