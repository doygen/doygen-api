'use strict';

/* Classes */
const CopyFileWorker = require('./copy-file');

/**
 * The 'CopyPathWorker' class provides the common API for a worker
 * that will copy the entire path recursively to a destination.
 *
 */
class CopyPathWorker extends CopyFileWorker {

    /**
     * Copies all files from the path to destination.
     *
     * @override
     */
    doWork() {
        this.files.forEach(file => {
            let output = this.data.output + file.substr(file.lastIndexOf('/'));

            this.doCopy(file, output);
        });
    }

    /**
     * A helper to get the files from the path of the rule.
     *
     * @returns {Array}
     */
    get files() {
        return this.allFiles(this.path.resolve(this.context.generatorPath, 'files', this.data.path));
    }

    /**
     * A helper to get the data from the rule.
     *
     * @returns {Object}
     */
    get data() {
        return this.rule['copy-path'];
    }
}

module.exports = CopyPathWorker;