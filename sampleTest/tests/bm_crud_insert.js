var fs = require("fs");

var { Connection, Request, TYPES } = require("tedious");

const config = JSON.parse(
    fs.readFileSync('./perfConfigSpec.json', 'utf8')
).config;

let tests = {
    suiteName: 'CRUD: Insert',
    before: function (resolve, reject) {
        this.connection = new Connection(config);
        this.connection.on("connect", (err) => {
            if (err) reject(err);
            resolve();
        });
    },
    after: function (resolve, reject) {
        this.connection.on("end", (err) => {
            if (err) reject(err);
            resolve();
        })
        this.connection.close();
    },
    test: {
        test1: {
            name: "CRUD: Insert - BIT",
            params: {
                tableName: "tds_bit",
                sqlType: "Bit",
            },
            beforeEachTest: function (resolve, reject, params) {
                createTable(resolve, reject, params, connection);
            },
            afterEachTest: function (resolve, reject, params) {
                dropTable(resolve, reject, params, connection)
            },
            exec: function (resolve, reject, params) {
                var request = new Request(`INSERT INTO ${params.tableName} ([c1]) VALUES (@c1)`, () => resolve());
                request.addParameter("c1", TYPES.Bit, true);
                connection.execSql(request);
            }
        },
        test2: {
            name: "CRUD: Insert - INT",
            params: {
                tableName: "tds_int",
                sqlType: "Int",
            },
            beforeEachTest: function (resolve, reject, params) {
                createTable(resolve, reject, params, connection);
            },
            afterEachTest: function (resolve, reject, params) {
                dropTable(resolve, reject, params, connection)
            },
            exec: function (resolve, reject, params) {
                var request = new Request(`INSERT INTO ${params.tableName} ([c1]) VALUES (@c1)`, () => resolve());
                request.addParameter("c1", TYPES.Int, 5);
                connection.execSql(request);
            }
        }
    }
};

function createTable(resolve, reject, params, connection) {
    var request = new Request(`IF OBJECT_ID('${params.tableName}', 'U') IS NOT NULL DROP TABLE ${params.tableName}; create table ${params.tableName}(c1 ${params.sqlType})`, (err) => {
        if (err) reject(err);
        resolve();
    });
    connection.execSql(request);
}

function dropTable(resolve, reject, params, connection){
    var request = new Request(`DROP TABLE ${params.tableName}`, function (err) {
        if (err)
            reject(err)
        resolve();
    });
    connection.execSql(request);
}

module.exports = tests;
