'use strict';

/* Classes */
const Worker = require('../worker').Worker;

/**
 * The 'CmdWorker' class provides the common API for a worker
 * that will just return a text.
 *
 */
class CmdWorker extends Worker {

    /**
     * Executes an OS command with its main part and params part
     *
     * @override
     */
    doWork() {
        this.cmd(this.rule.main, this.rule.params);
    }

}

module.exports.Worker = CmdWorker;