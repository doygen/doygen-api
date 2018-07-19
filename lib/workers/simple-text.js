'use strict';

/* Classes */
const Worker = require('../worker').Worker;

/**
 * The 'SimpleTextWorker' class provides the common API for a worker
 * that will just return a text.
 *
 */
class SimpleTextWorker extends Worker {

    /**
     * Returns the text from the rule.
     *
     * @param {Context} context
     * @param {Object} rule
     * @returns {String}
     * @override
     */
    render(context, rule) {
        return this.extract(rule.text, this.makeWorkerContext(context, rule));
    }

}

module.exports.Worker = SimpleTextWorker;