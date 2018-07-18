'use strict';

/* Classes */
const Worker = require('../../worker').Worker;
const path = require('path');
const git = require('simple-git');

/**
 * The 'InstallerWorker' class is the initial worker that install the Potter generator.
 */
class InstallerWorker extends Worker {

    /**
     * Executes the worker.
     *
     * @override
     */
    doWork() {
        const potterPath = path.resolve(process.env.HOME, '.potter');

        console.log('[create] %s', '~/.potter');
        this.mkdir(potterPath);

        this.goTo(potterPath);

        console.log('[git] %s', this.input.generator.url);
        git(potterPath).clone(this.input.generator.url);
    }
}

module.exports.Worker = InstallerWorker;