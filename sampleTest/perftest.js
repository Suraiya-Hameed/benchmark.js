var
  Benchmark = require('../benchmark'),
  Connection = require('tedious').Connection,
  Request = require('tedious').Request;

var config = {
  userName: 'sa',
  password: '*****',
  server: 'localhost'
};

function test(deferred) {
  const connection = new Connection(config);

  connection.on('connect', (err) => {
    if (err) {
      console.log('connect: ', err);
      throw err;
    }

    const req = new Request('SELECT @@SERVERNAME', (err, rows) => {
      connection.close();
      deferred.resolve();
    });

    req.on('row', (columns) => {
      columns.forEach(function(element) {
        console.log('Value: ', element.value);
      });
    });

    connection.execSql(req);
  });
}

function bmTest() {
  const bm = new Benchmark('selectVersion', {
    defer: true,
    fn: function(deferred) {
      test(deferred);
    }
    , 'initCount': 1000  // number of times to repeat the operation
    , 'maxSamples': 50  // number of iterations to sample over
  },
    );
  bm.on('complete', function(event) {
    console.log(String(event.target));
    console.log('average time: ', bm.timeForBenchmarkExec, 's for ', bm.initCount, 'operations');
  });
  bm.run({ 'async': true });
}


bmTest();
