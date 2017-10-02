"use strict";

const optimist = require('optimist');
const colors = require('colors');

const RevLogger = require(__dirname + '/RevLogger');

(function () {
    const argv = optimist
            .boolean('h')
            .alias('h', 'help')
            .default('h', false)
            .describe('h', 'show this help.')

            .argv;

    if (argv.h) {
        optimist.showHelp();
        return;
    }

    const files = argv._;
    const revLogger = new RevLogger(files);
    const versions = revLogger.versions();
    Object.keys(files).forEach((index, key) => {
        console.log([
            String(versions[key]).green,
            files[key]
        ].join('\t'));
    });
})();
