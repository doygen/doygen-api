'use strict';

/* Classes */
const Worker = require('../worker').Worker;

const AdmZip = require('adm-zip');

/**
 * The 'UnzipperWorker' class provides the common API for a worker
 * that will call all ports in the chain.
 *
 */
class UnzipperWorker extends Worker {

    /**
     * Unzips the file into a destination path.
     *
     * @override
     */
    doWork() {
        const output = this.extract(this.zip.output, this.makeWorkerContext(this.context, this.rule));
        this.unzip(this.zip.file, output);
    }

    /**
     * Unzips the file into output.
     *
     * @param file
     * @param output
     */
    unzip(file, output) {
        console.log('[unzip] %s', output);

        new AdmZip(this.path.resolve(this.context.generatorPath, 'zip', file))
            .extractAllTo(this.path.resolve(this.destinationPath, output), true);
    }

    /**
     * A helper to get the zio informations.
     *
     * @returns {Object}
     */
    get zip() {
       return this.rule.zip;
    }
}

module.exports.Worker = UnzipperWorker;
