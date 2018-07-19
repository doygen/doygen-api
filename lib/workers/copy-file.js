'use strict';

/* Classes */
const Worker = require('../worker').Worker;

/**
 * The 'CopyFileWorker' class provides the common API for a worker
 * that will copy a file to a destination.
 *
 */
class CopyFileWorker extends Worker {

    /**
     * Copies the file to destination.
     *
     * @override
     */
    doWork() {
        const output = this.extract(this.rule.output, this.makeWorkerContext(this.context, this.rule));
        this.doCopy(this.rule.file, output);
    }

    /**
     * Copies the file from the 'files' directory to the destination path.
     *
     * @param file
     * @param output
     */
    doCopy(file, output) {
        console.log('[copy] %s', output);

        this.copy(
            this.path.resolve(this.context.generatorPath, 'files', file),
            this.path.resolve(this.destinationPath, output)
        );
    }

}

module.exports.Worker = CopyFileWorker;
