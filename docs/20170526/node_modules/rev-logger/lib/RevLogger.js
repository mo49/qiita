"use strict";

const fs = require('fs');
const path = require('path');
const execSync = require('child_process').execSync;

const chokidar = require('chokidar');

class RevLogger {
    constructor (files) {
        this.files = files || {};
    }
    
    versions () {
        const data = {};
        Object.keys(this.files).forEach((key) => {
            data[key] = this.version(key);
        });
        return data;
    }

    version (key) {
        const filePath = this.files[key];
        const dirName = path.dirname(filePath);
        const baseName = path.basename(filePath);

        if (!fs.existsSync(filePath)) {
            return 1;
        }
        
        const log = execSync(
            `cd ${dirName} && git log --oneline ${baseName} | wc -l`
        ).toString();
        const diff = execSync(
            `cd ${dirName} && git diff HEAD --name-only ${baseName} | wc -l`
        ).toString();
        return (parseInt(log) || 1) + parseInt(diff);
    }

    values () {
        return Object.keys(this.files).map((key) => {
            return this.files[key];
        });
    }

    watch (cb) {
        const files = this.values();
        let cached = this.versions();
        chokidar.watch(files).on('change', () => {
            const changed = this.versions();

            let isUpdated = false;
            Object.keys(changed).forEach((key) => {
                isUpdated = isUpdated || (cached[key] !== changed[key]);
            });
            cached = changed;

            if (isUpdated) {
                (cb || new Function())(changed);
            }
        });
    }
};

module.exports = RevLogger;
