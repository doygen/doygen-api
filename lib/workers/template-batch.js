'use strict';

/* Classes */
const TemplateBasedWorker = require('./template-based').Worker;

/**
 * The 'TemplateBatchWorker' class provides the common API for a worker
 * that will execute a copy based in template for a lot a files in one execution.
 *
 */
class TemplateBatchWorker extends TemplateBasedWorker {

    /**
     * Executes the template worker for all templates in the batch.
     *
     * @override
     */
    doWork() {
        this.batch.forEach(item => this.writeFromTemplate(item.template, item.output));
    }

    /* Helpers */

    /**
     * A helper to get the template batch from the rule.
     *
     * @returns {Array}
     */
    get batch() {
        return this.rule.templateBatch;
    }
}

module.exports.Worker = TemplateBatchWorker;