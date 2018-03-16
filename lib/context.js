'use strict';

/* Classes */
const Entity = require('./entity');
const Rules = require('./rules');

/**
 * The 'Context' class provides the common API for the context for the
 * entire execution of the generator.
 *
 * @constructor
 *
 * @property {Object} metadata    - the project's metadata.
 * @property {Array}  entities    - all the entities in metadata (if defined).
 * @property {Object} rulesMap    - map with all rules.
 * @property {Object} workersMap  - map with all workers available.
 *
 */
class Context {

    constructor() {
        this._metadata = {};
        this._entities = [];
        this.rulesMap = new Object();
        this.workersMap = new Object();
    }

    /* METADATA */

    /**
     * Adds the metadata to the context instance.
     *
     * @param {Object} metadata
     */
    addMetadata(metadata) {
        this._metadata = metadata;

        if(metadata.entities) {
            this.addEntities(metadata.entities);
        }
    }

    /**
     * Adds all the entities to the context instance.
     *
     * @param {Array} entitiesJSon
     */
    addEntities(entitiesJSon) {
        entitiesJSon.forEach(entity => {

            this.entities.push(new Entity(entity));
        });
    }

    /* RULES */

    /**
     * Adds all the rules to the context instance in the level hierarchy.
     *
     * @param {Array} rulesJSon
     * @param {Level} level
     */
    addRules(rulesJSon, level) {
        rulesJSon.forEach(r => {

            if(!this.rulesMap[r.port]) {
                this.rulesMap[r.port] = new Rules();
            }

            this.rulesMap[r.port].add(level, r);
        });
    }

    /* WORKERS */

    /**
     * Adds the workers to the context instance.
     *
     * @param {Array} workers
     */
    addWorkers(workers) {
        workers.forEach(w => {
            this.workersMap[w.constructor.name] = w;
        });
    }

    /* GETTERS */

    /**
     * Gets the rule of the specified port and selector.
     *
     * @param {String} portName
     * @param {String} selector
     * @returns {Object} The rule founded.
     */
    rule(portName, selector) {
        if(this.rulesMap[portName]) {
            return this.rulesMap[portName].searchRule(selector);
        }
        return {};
    }

    /**
     * Gets the metadata object.
     *
     * @returns {Object}
     */
    get metadata() {
        return this._metadata;
    }

    /**
     * Gets all the entities in the metadata.
     *
     * @returns {Array}
     */
    get entities() {
        return this._entities;
    }
}

module.exports = Context;