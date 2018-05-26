'use strict';

/* Classes */
const Worker = require('../../worker').Worker;

/**
 * The 'ProjectWorker' class is the initial worker that create the Potter project.
 */
class ProjectWorker extends Worker {

    /**
     * Executes the worker.
     *
     * @override
     */
    doWork() {
        const projectName = this.input.project.name;

        console.log('[create] %s', projectName);
        this.mkdir(projectName);

        this.goTo(projectName);

        this._writing();
    }

    /**
     * Writes all the initial files for a Potter project.
     *
     * @private
     */
    _writing() {
        this._writePotter();
        this._writeMetadata();
        this._writeRules();
    }

    /**
     * Writes the Potter file.
     *
     * @private
     */
    _writePotter() {
        this.invoke('potter-file');
    }

    /**
     * Writes the Metadata file.
     *
     * @private
     */
    _writeMetadata() {
        this.invoke('metadata-file');
    }

    /**
     * Writes the Rules file.
     *
     * @private
     */
    _writeRules() {
        this.invoke('rules-file');
    }
}

module.exports.Worker = ProjectWorker;