'use strict';

/* Classes */
const Port = require('./port').Port;
const Context = require('./context');
const Level = require('./domain').Level;

/* Externals */
const fse = require('fs-extra');
const path = require('path');

/**
 * The 'Generator' class provides the common API for a Potter Generator.
 *
 * Every generator should extend this base class.
 *
 * @property
 */
class Generator {

    /**
     * Pre-execution method.
     *
     * If a generator needs to do something before run, it should override
     * this method.
     */
    pre() {

    }

    /**
     * Runs the generator.
     *
     * Defines the context and invoke the port: 'generator'.
     *
     * @param {Object} input
     */
    run(input) {
        this._input = input;

        this.pre();

        let context = this.context();

        this.goToDestination();

        Port.invoke(context, 'generator');
    }

    /* CONTEXT */

    /**
     * Creates the generator's context.
     *
     * @returns {Context}
     */
    context() {
        let context = new Context();

        context.input = this.input;
        context.params = this.params;

        this.addTemplatePaths(context);
        this.addMetadata(context);
        this.addWorkers(context);
        this.addRules(context);

        return context;
    }

    /* METADATA */

    /**
     * Adds the Metadata to the Context.
     *
     * @param {Context} context
     */
    addMetadata(context) {
        let metadataJSon = fse.readJsonSync(path.resolve(this._getBaseDir(Level.LOCAL), 'metadata.json'), { throws: false });

        context.addMetadata(metadataJSon ? metadataJSon : {});
    }

    /* TEMPLATES */

    addTemplatePaths(context) {
        context.generatorPath = this.generatorPath;
        context.templatePath = this.templatePath;
        context.localTemplate = path.resolve(process.cwd(), 'templates');
    }

    /* WORKERS */

    /**
     * Adds the Workers to the Context.
     *
     * Finds and adds workers from the API and the Generator.
     *
     * @param {Context} context
     */
    addWorkers(context) {
        /* API */
        context.addWorkers(this._findWorkers(Level.API));

        /* Generator */
        context.addWorkers(this._findWorkers(Level.GENERATOR));
    }

    /**
     * Finds the workers in the level.
     *
     * @param {Level} level
     * @returns {Array} Workers founded.
     * @private
     */
    _findWorkers(level) {
        let arrayWorkers = [];

        let dirWorkers = this.workersPath != null ? this.workersPath : path.resolve(this._getBaseDir(level), 'workers');
        let modulesList = fse.readdirSync(dirWorkers);

        modulesList.forEach(filePath => {

            let WorkerClass = require(path.resolve(dirWorkers, filePath)).Worker;

            arrayWorkers.push(new WorkerClass());
        });

        return arrayWorkers;
    }

    /* RULES */

    /**
     * Adds the rules to the Context.
     *
     * Retrieves and adds rules from the API, Generator and Local (Custom).
     *
     * @param {Context} context
     */
    addRules(context) {
        /* API */
        context.addRules(this._getRulesJSon(Level.API), Level.API);

        /* Generator */
        context.addRules(this._getRulesJSon(Level.GENERATOR), Level.GENERATOR);

        /* Local/Custom */
        context.addRules(this._getRulesJSon(Level.LOCAL), Level.LOCAL);
    }

    /**
     * Gets the rules from the 'rules.json' file and parse to JSon object.
     *
     * @param {Level} level
     * @returns {Array} Rules as JSon (Array).
     * @private
     */
    _getRulesJSon(level) {
        let rulesJson = fse.readJsonSync(path.resolve(this._getBaseDir(level), 'rules.json'), { throws: false });

        return rulesJson ? rulesJson : [];
    }

    /* GETTERS */

    /**
     * Gets the generator's parameters.
     *
     * By default, there is no one. But if necessary, can be overridden.
     *
     * @returns {Object} Parameters of the generator.
     */
    get params() {
        return {};
    }

    /**
     * Gets the generator's path.
     *
     * It is mandatory that this method be overridden.
     *
     * @example
     * get generatorPath() {
     *      return __dirname;
     * }
     *
     */
    get generatorPath() {
        throw Error('This method should be overriden.');
    }

    /**
     * The path to workers directory. With this information, it is possible to find
     * all workers available and register them.
     *
     * By default the Workers' path is '{base}/workers'.
     * If the workers are in a different path, this method should be overriden.
     *
     * @returns {String} Workers' path.
     */
    get workersPath() {
        return null;
    }

    /**
     * Gets the path for the templates' directory.
     *
     * By default the path is: '{base}/templates';
     * If the templates are in a different path, this method should be overriden.
     *
     * @returns {String} Templates' path.
     */
    get templatePath() {
        return path.resolve(this.generatorPath, 'templates');
    }

    /**
     * Gets the input from command line.
     *
     * @returns {Object} Input from command line.
     */
    get input() {
        return this._input;
    }

    /* PATH */

    /**
     * Gets the base directory for each level.
     *
     * @param {Level} level
     * @returns {String} Base directory.
     * @private
     */
    _getBaseDir(level) {
        if (level === Level.GENERATOR) {
            return this.generatorPath;

        } else if (level === Level.LOCAL) {
            return process.cwd();
        }
        return __dirname;
    }

    /**
     * Goes to destination path to works at the dist path.
     */
    goToDestination() {
        fse.mkdirsSync(path.resolve('dist', this.input.type));
        process.chdir(path.resolve('dist', this.input.type));
    }
}

module.exports.Generator = Generator;