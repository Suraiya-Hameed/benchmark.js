var fs = require("fs");

var { Connection, Request, TYPES } = require("tedious");

const config = JSON.parse(
    fs.readFileSync('./perfConfigSpec.json', 'utf8')
).config;

/**
 * Object containing all the test cases
 */
let tests = {
    suiteName: 'Test Connection',
    /**
     * Executed once, before starting any test 
     * @param: resolve called if function is sucessful
     * @param: reject called if function runs into error
     */
    before: function (resolve, reject) {
        resolve();
    },
    /**
     * Executed once, after all the tests are done
     * @param: resolve called if function is sucessful
     * @param: reject called if function runs into error
     */
    after: function (resolve, reject) {
        resolve();
    },
    test: {
        test1: {
            name: "ConnectionTest: Open and Close Connection",
            connection: null,
            /**
             * Executed once, before starting n itertions of test
             * @param: resolve called if function is sucessful
             * @param: reject called if function runs into error
             */
            beforeEachTest: function (resolve, reject) {
                resolve();
            },
            /**
             * Executed once, after finishing n itertions of test
             * @param: resolve called if function is sucessful
             * @param: reject called if function runs into error
             */
            afterEachTest: function (resolve, reject) {
                resolve();
            },
             /**
             * Executed before starting each n itertions of test
             * @param: resolve called if function is sucessful
             * @param: reject called if function runs into error
             */
            beforeEachRun: function (resolve, reject) {
                resolve();
            },
             /**
             * Actual test that needs to be benchmarked
             * @param: resolve called if function is sucessful
             * @param: reject called if function runs into error
             */
            exec: function (resolve, reject) {
                this.connection = new Connection(config);
                this.connection.on("connect", () => {
                    this.connection.close();
                });

                this.connection.on("end", () => {
                    resolve();
                })
            },
             /**
             * Executed after completing each n itertions of test
             * @param: resolve called if function is sucessful
             * @param: reject called if function runs into error
             */
            afterEachRun: function (resolve, reject) {
                resolve();
            }
        },

        test2: {
            name: "ConnectionTest: Open Connection",
            connection: null,
            beforeEachTest: function (resolve, reject) {
                resolve();
            },
            afterEachTest: function (resolve, reject) {
                resolve();
            },
            beforeEachRun: function (resolve, reject) {
                resolve();
            },
            exec: function (resolve, reject) {
                this.connection = new Connection(config);
                this.connection.on("connect", () => {
                    resolve();
                });
            },
            afterEachRun: function (resolve, reject) {
                this.connection.on("end", () => {
                    resolve();
                })
                this.connection.close();
            }
        },

        test3: {
            name: "ConnectionTest: Close Connection",
            connection: null,
            beforeEachTest: function (resolve, reject) {
                resolve();
            },
            afterEachTest: function (resolve, reject) {
                resolve();
            },
            beforeEachRun: function (resolve, reject) {
                this.connection = new Connection(config);
                this.connection.on("connect", () => {
                    resolve();
                });
            },
            exec: function (resolve, reject) {
                this.connection.on("end", () => {
                    resolve();
                })
                this.connection.close();
            },
            afterEachRun: function (resolve, reject) {
                resolve();
            }
        },

    }
}

module.exports = tests;