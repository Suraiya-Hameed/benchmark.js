var fs = require("fs");

var { Connection, Request, TYPES } = require("tedious");

const config = JSON.parse(
    fs.readFileSync('./perfConfigSpec.json', 'utf8')
).config;

/**
 * Object containing all the test cases
 */
let tests = {
    suiteName: 'CRUD: Insert',
    /**
     * Executed once, before starting any test 
     * @param: resolve called if function is sucessful
     * @param: reject called if function runs into error
     */
    before: function (resolve, reject) {
        this.connection = new Connection(config);
        this.connection.on("connect", (err) => {
            if (err) reject(err);
            resolve();
        });
    },
    /**
     * Executed once, after all the tests are done
     * @param: resolve called if function is sucessful
     * @param: reject called if function runs into error
     */
    after: function (resolve, reject) {
        this.connection.on("end", (err) => {
            if (err) reject(err);
            resolve();
        })
        this.connection.close();
    },
    /**
     * Object that contains all the tests to be executed
     */
    test: {
    }
};

function createTable(resolve, reject, params, connection) {
    let query = `IF OBJECT_ID('${params.tableName}', 'U') IS NOT NULL DROP TABLE ${params.tableName}; create table ${params.tableName}(c1 ${params.sqlType}`;

    if (params.scale && params.precision) {
        query += `(${params.precision}, ${params.scale})`;
    } else if (params.precision)
        query += `(${params.precision})`;
    else if (params.scale)
        query += `(${params.scale})`;
    else if (params.length)
        query += `(${params.length})`;

    query += `)`;

    var request = new Request(query, (err) => {
        if (err) reject(err);
        resolve();
    });
    connection.execSql(request);
}

function dropTable(resolve, reject, params, connection) {
    var request = new Request(`DROP TABLE ${params.tableName}`, function (err) {
        if (err)
            reject(err)
        resolve();
    });
    connection.execSql(request);
}

/**
 * Object containing all the data types to test in CRUD:Insert
 */
testTypes = {
    bit: {
        name: 'BIT',
        type: TYPES.Bit,
        value: false
    },
    tinyint: {
        name: 'TINYINT',
        type: TYPES.TinyInt,
        value: 5
    },
    smallint: {
        name: 'SMALLINT',
        type: TYPES.SmallInt,
        value: 56
    },
    int: {
        name: 'INT',
        type: TYPES.Int,
        value: 5
    },
    bigint: {
        name: 'BIGINT',
        type: TYPES.BigInt,
        value: 9875
    },
    numeric: {
        name: 'NUMERIC',
        type: TYPES.Numeric,
        value: 65.9884,
        precision: 9,
        scale: 4
    },
    decimal: {
        name: 'DECIMAL',
        type: TYPES.Decimal,
        value: 65.9884,
        precision: 9,
        scale: 4
    },
    smallmoney: {
        name: 'SMALLMONEY',
        type: TYPES.SmallMoney,
        value: 3148.29
    },
    money: {
        name: 'MONEY',
        type: TYPES.Money,
        value: 3148.29
    },
    float: {
        name: 'FLOAT',
        type: TYPES.Float,
        value: 1.79E+308
    },
    real: {
        name: 'REAL',
        type: TYPES.Real,
        value: 1.18E-38
    },
    smalldatetime: {
        name: 'SMALLDATETIME',
        type: TYPES.SmallDateTime,
        value: new Date()
    },
    datetime: {
        name: 'DATETIME',
        type: TYPES.DateTime,
        value: new Date()
    },
    datetime2: {
        name: 'DATETIME2',
        type: TYPES.DateTime2,
        value: new Date(),
        scale: 3
    },
    datetimeoffset: {
        name: 'DATETIMEOFFSET',
        type: TYPES.DateTimeOffset,
        value: new Date(),
        scale: 4
    },
    time: {
        name: 'TIME',
        type: TYPES.Time,
        value: new Date(),
        scale: 3
    },
    date: {
        name: 'DATE',
        type: TYPES.Date,
        value: new Date()
    },
    char: {
        name: 'CHAR',
        type: TYPES.Char,
        value: 'charDataTest',
        length: 32
    },
    varchar: {
        name: 'VARCHAR',
        type: TYPES.VarChar,
        value: 'VarCharDataTest',
        length: 100
    },
    text: {
        name: 'TEXT',
        type: TYPES.Text,
        value: 'TExt test data '
    },
    nchar: {
        name: 'NCHAR',
        type: TYPES.NChar,
        value: 'ncharDataTest',
        length: 32
    },
    nvarchar: {
        name: 'NVARCHAR',
        type: TYPES.NVarChar,
        value: 'NVarCharDataTest',
        length: 100
    },
    binary: {
        name: 'BINARY',
        type: TYPES.Binary,
        value: Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]),
        length: 32
    },
    varbinary: {
        name: 'VARBINARY',
        type: TYPES.VarBinary,
        value: Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72, 0x66, 0x65, 0x72]),
        length: 100
    },
    image: {
        name: 'IMAGE',
        type: TYPES.Image,
        value: Buffer.from('Image test data ')
    },
    uniqueIdentifier: {
        name: 'UNIQUEIDENTIFIER',
        type: TYPES.UniqueIdentifier,
        value: "0E984725-C51C-4BF4-9960-E1C80E27ABA0"
    }
    // TODO: add NTEXT, UDT, Variant, Xml types once driver supports insert operation on them
};

// add individual tests to the "tests.test" object based on the data types to test in "testTypes"
(() => {
    let test = tests.test;
    for (key in testTypes) {
        if (testTypes.hasOwnProperty(key)) {
            let testName = 'CRUD: Insert Type ' + testTypes[key].name;
            test[testName] = {
                name: testName,
                params: {
                    tableName: "tds_" + key,
                    sqlType: testTypes[key].name,
                    type: testTypes[key].type,
                    value: testTypes[key].value,
                    precision: testTypes[key].precision,
                    scale: testTypes[key].scale,
                    length: testTypes[key].length
                },
                beforeEachTest: function (resolve, reject, params) {
                    createTable(resolve, reject, params, connection);
                },
                afterEachTest: function (resolve, reject, params) {
                    dropTable(resolve, reject, params, connection)
                },
                exec: function (resolve, reject, params) {
                    var request = new Request(`INSERT INTO ${params.tableName} ([c1]) VALUES (@c1)`, () => resolve());
                    let options = {
                        scale: params.scale,
                        precision: params.precision,
                        length: params.length
                    }
                    request.addParameter("c1", params.type, params.value, options);
                    connection.execSql(request);
                }
            }
        }
    }
})();


module.exports = tests;
