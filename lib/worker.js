'use strict';

/* Classes */
const Port = require('./port').Port;

/* File System Utils */
var memFs = require('mem-fs'),
    editor = require('mem-fs-editor'),
    store = memFs.create(),
    fs = editor.create(store);

const fse = require('fs-extra');
const path = require('path');
const recursive = require('recursive-readdir-sync');

/* Process Utils */
const { spawnSync } = require('child_process');

/**
 * The 'Worker' class provides the common API for all workers of the generator.
 *
 * Provides plenty of helpers, utilities, file system's functionality...
 *
 * All workers should extend this class.
 *
 * @property {Context} context  - context of the generator.
 * @property {Object} rule      - rule of the port from the worker is invoked.
 *
 */
class Worker {

    /**
     * Runs the worker.
     *
     * @param {Context} context
     * @param {Object} rule
     */
    run(context, rule) {
        this._context = context;
        this._rule = rule;

        this.doWork();

        this.end();
    }

    /**
     * Where the work is actually done.
     *
     * If the worker is not a render worker only, this method should be
     * overriden.
     */
    doWork() { }

    /**
     * Renders some component based on the rule.
     *
     * @param {Context} context
     * @param {Object} rule
     * @returns {String}
     */
    render(context, rule) {
        return '';
    }

    /**
     * Invokes another port from the worker instance.
     *
     * @param {String} port
     * @param {Object} selector
     */
    invoke(port, selector = null) {
        Port.invoke(this.context, port, selector);
    }

    /**
     * Invokes the port specified for all the items in the collection.
     *
     * @param {String} port
     * @param {Array} collection
     */
    invokeLoop(port, collection = []) {
        collection.forEach(item => this.invoke(port, item));
    }

    /**
     * Pos-execution method.
     */
    end() {
        this.flush();
    }

    /* Attributes */

    /**
     * Gets the generator context.
     *
     * @returns {Context}
     */
    get context() {
        return this._context;
    }

    set context(context) {
        return this._context = context;
    }

    /**
     * Gets the rule that invoked the worker.
     *
     * @returns {Object}
     */
    get rule() {
        return this._rule;
    }

    /**
     * Makes the context for the worker execution.
     *
     * This context consists in the variable '$' referencing the worker instance,
     * the rule's configuration, metadata and parameters.
     *
     * @param {Object} rule
     * @returns {Object} The worker's execution context.
     */
    makeWorkerContext(context, rule) {
        this.context = context;

        return Object.assign(
            { "$": this, metadata: this.context.metadata, entities: this.context.entities },
            { config: rule.configuration },
            rule.params, this.context.params);
    }

    /* Helpers */

    /**
     * A helper to get the generator input from the context.
     *
     * @returns {Object}
     */
    get input() {
        return this.context.input;
    }

    /**
     * A helper to get the rule's configuration.
     *
     * @returns {Object}
     */
    get configuration() {
        return this.rule.configuration ? this.rule.configuration : {};
    }

    /**
     * A helper to get the general item from rule's parameter.
     *
     * This can be use if the port is not customized for a specific selector.
     *
     * @returns {Object}
     */
    get item() {
        return this.rule.params.item;
    }

    /**
     * A helper to get the entities from the generator context.
     *
     * This can be use if the metadata contains entities.
     *
     * @returns {Object}
     */
    get entities() {
        return this.context.entities;
    }

    /**
     * A helper to get the entity from rule's parameter.
     *
     * This can be use if the port is specific for the selector with type 'Entity'.
     *
     * @returns {Object}
     */
    get entity() {
        return this.rule.params.entity;
    }

    /**
     * A helper to get the property from rule's parameter.
     *
     * This can be use if the port is specific for the selector with type 'Property'.
     *
     * @returns {Object}
     */
    get property() {
        return this.rule.params.property;
    }

    /* Files System */

    /**
     * Gets the destination path for file system operations.
     *
     * @returns {String} Path where the worker should work.
     */
    get destinationPath() {
        return process.cwd();
    }

    /**
     * An util for get and resolve paths easier.
     *
     * @returns {Object}
     */
    get path() {
        return path;
    }

    /**
     * An util for file system operation.
     *
     * @returns {Object}
     */
    get fs() {
        return fs;
    }

    /**
     * Flushes the file system util instance.
     */
    flush() {
        fs.commit([], function() { });
    }

    /**
     * Changes the process work path.
     *
     * @param {String} pathTo
     */
    goTo(pathTo) {
        process.chdir(pathTo);
    }

    /**
     * Creates a directory.
     *
     * If the directory already exists, do nothing.
     *
     * @param {String} dirPath
     */
    mkdir(dirPath) {
        fse.mkdirsSync(dirPath);
    }

    /**
     * Copies a file.
     *
     * @param file
     * @param destination
     */
    copy(file, destination) {
        fse.copySync(file, destination);
    }

    /**
     * Executes a command in the terminal.
     *
     * @param {String} command
     * @param {Array} args
     */
    cmd(command, args) {
        const child = spawnSync(command, args, { stdio: 'inherit' });
    }

    /**
     * Reads a file.
     *
     * @param {String} filePath
     * @returns {String}
     */
    readFile(filePath) {
        return String(fs.read(filePath, { throws: false }));
    }

    /**
     * Gets all files recursively of the directory.
     *
     * @param dirPath
     * @returns {Array}
     */
    allFiles(dirPath) {
        return recursive(dirPath);
    }

    /**
     * Check if a file exists.
     *
     * @param {String} filePath
     * @returns {String}
     */
    exists(filePath) {
        return this.fs.exists(filePath);
    }

    /* Utils */

    /**
     * Extracts an value from the object.
     *
     * If the value is a variable, uses regex to find.
     *
     * @param {String} value
     * @param {Object} object
     * @returns {String}
     */
    extract(value, object) {
        if (object === null) return value;

        const variable = new RegExp('\\$\\{[\\w\\.]+\\}', 'g');
        let result = value;

        if(variable.test(value)) {
            const variableKeys = new RegExp('(\\$\\{)|(\\})', 'g');

            value.match(variable).forEach(group => {
                const key = String(group).replace(variableKeys, '');

                result = result.replace(group, this.deepSearch(key, object));
            });
        }
        return result;
    }

    /**
     * Gets the value from the object by a deep search.
     *
     * @param {String} value
     * @param {Object} object
     * @returns {Object}
     */
    deepSearch(value, object) {
        return eval('object.' + value);
    }
}

module.exports.Worker = Worker;