'use strict';

/* Classes */
const TemplateBasedWorker = require('./template-based').Worker;

/**
 * The 'TemplatePathWorker' class provides the common API for a worker
 * that will execute all the templates from a path.
 *
 */
class TemplatePathWorker extends TemplateBasedWorker {

    /**
     * Executes the template worker for all templates in path.
     *
     * @override
     */
    doWork() {

        this.files.forEach(file => {
            let fileName = this.data.output + file.substr(file.lastIndexOf(this.data.path + '/') + this.data.path.length);

            this.writeFromTemplate(file,  fileName);
        });
    }

    /* Helpers */

    /**
     * A helper to get the files from the path of the rule.
     *
     * @returns {Array}
     */
    get files() {
        return this.allFiles(this.path.resolve(this.templatePath, this.data.path));
    }

    /**
     * A helper to get the data from the rule.
     *
     * @returns {Object}
     */
    get data() {
        return this.rule['template-path'];
    }
}

module.exports.Worker = TemplatePathWorker;