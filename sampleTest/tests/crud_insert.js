var tedious = require("tedious");
var Request = tedious.Request;
var TYPES = tedious.TYPES;
var common = require("./common");

function setup(cb) {
    common.createConnection((_connection) => {
        connection = _connection;
        var request = new Request(`IF OBJECT_ID('${this.tableName}', 'U') IS NOT NULL DROP TABLE ${this.tableName}; create table ${this.tableName}(c1 ${this.sqlType})`, function (err) {
            if (err) return cb(err);
            cb();
        });
        connection.execSql(request);
    });
}

function teardown(cb) {
    var request = new Request(`DROP TABLE ${this.tableName}`, function (err) {
        connection.close();
        cb(err);
    });
    connection.execSql(request);
}

// TODO: make exec a seperate function once we decide on dynamic data for columns
let allTests = {
    bitVal: {
        name: "Insert Test - BIT",
        tableName: "tds_bit",
        sqlType: "Bit",
        setup: setup,
        exec: function (cb) {
            var request = new Request(`INSERT INTO ${this.tableName} ([c1]) VALUES (@c1)`, cb);
            request.addParameter("c1", TYPES.Bit, true);
            connection.execSql(request);
        },
        teardown: teardown,
    },

    intVal: {
        name: "Insert Test - INT",
        tableName: "tds_int",
        sqlType: "Int",
        setup: setup,
        exec: function (cb) {
            var request = new Request(`INSERT INTO ${this.tableName} ([c1]) VALUES (@c1)`, cb);
            request.addParameter("c1", TYPES.Int, 5);
            connection.execSql(request);
        },
        teardown: teardown
    }
}

async function testInsert() {
    for (key in allTests) {
        if (allTests.hasOwnProperty(key)) {
            await common.createBenchmark(allTests[key])
        }
    }
}

testInsert();