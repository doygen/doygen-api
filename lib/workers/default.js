'use strict';

/* Classes */
const Worker = require('../worker').Worker;

/**
 * The 'DefaultWorker' class is the default worker in case the rule does not
 * have an defined worker.
 *
 */
class DefaultWorker extends Worker {

    /**
     * Do nothing.
     *
     * @override
     */
    doWork() {

    }

}

module.exports.Worker = DefaultWorker;
