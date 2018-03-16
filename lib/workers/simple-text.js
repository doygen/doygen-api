'use strict';

/* Classes */
const Worker = require('../worker');

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
        return rule.text;
    }

}

module.exports = SimpleTextWorker;