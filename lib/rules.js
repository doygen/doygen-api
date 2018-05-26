'use strict'

/* Domain */
const Level = require('./domain').Level;
const levels = [Level.LOCAL, Level.GENERATOR];

const selectors = [
    { key: 'entity', default: 'entity', 'by-class': { 'Entity': 'name', 'Property': 'entityName' } },
    { key: 'propertyType', default: 'propertyType', 'by-class': { 'Property': 'type' } },
    { key: 'cardinality', default: 'cardinality' },
    { key: 'propertyName', default: 'propertyName', 'by-class': { 'Property': 'name' } },
    { key: 'tag', default: 'tags' }
];

/**
 * The 'Rules' class provides the common API for the use of the rule by the ports.
 *
 * It aggregates all the available rules of the API, Generator and Project.
 *
 * This class can decide which specific rule should be used by the port, level and selector
 * passed by.
 *
 * The selector is used in a hierarchical way defining so, the precedence.
 *
 * @constructor
 *
 * @property {Object} rules - map with all the rules.
 */
class Rules {

    constructor() {
        this.rules = new Object();
    }

    /**
     * Adds a rule in the rules map by the level.
     *
     * Defines also the rule's worker.
     *
     * @param {Level} level
     * @param {Object} rule
     */
    add(level, rule) {
        const levelKey = level.toString();

        this._checkLevelMap(levelKey);

        this._checkWorker(rule);

        this._addToMap(rule, this.rules[levelKey]);
    }

    /**
     * Searches the specific rule by tem selector item informed.
     *
     * @param {Object} item
     * @param {Number} index
     * @returns {Object} Rule founded.
     */
    searchRule(item, index = 0) {
        let rule = this._deepSearchRule(item, this.rules[levels[index].toString()]);

        if(!rule.port) {
            if(index < levels.length - 1) {
                return this.searchRule(item, ++index);
            }
        }
        return rule ? rule : {};
    }

    /* PRIVATES METHODS */

    /**
     * Checks the map for the level specified.
     *
     * If does not exists, creates.
     *
     * @param {Level} level
     * @private
     */
    _checkLevelMap(level) {
        if(!this.rules[level]) {
            this.rules[level] = new Object();
        }
    }

    /**
     * Checks the worker of the rule.
     *
     * If it is not defined, try to find a default one.
     *
     * @param {Object} rule
     * @private
     */
    _checkWorker(rule) {
        if(!rule.worker) {
            rule.worker = this._defaultWorker(rule);
        }
    }

    /**
     * Add the rule to the map.
     *
     * @param {Object} rule
     * @param {Object} map
     * @param {Number} index
     * @private
     */
    _addToMap(rule, map, index = 0) {
        const selector = selectors[index];
        const key = rule[selector.key] ? rule[selector.key] : '*';

        if(index < selectors.length - 1) {
            if(!map[key]) {
                map[key] = new Object();
            }
            this._addToMap(rule, map[key], ++index);

        } else {
            map[key] = rule;
        }
    }

    /**
     * Defines the default worker.
     *
     * @param {Object} rule
     * @returns {String} The worker name.
     * @private
     */
    _defaultWorker(rule) {
        if(rule.template) {
            return 'TemplateBasedWorker';
        }

        if(rule['template-batch']) {
            return 'TemplateBatchWorker';
        }

        if(rule['template-path']) {
            return 'TemplatePathWorker';
        }

        if(rule.text) {
            return 'SimpleTextWorker';
        }

        if(rule.file) {
            return 'CopyFileWorker';
        }

        if(rule['copy-path']) {
            return 'CopyPathWorker';
        }

        if(rule.chain) {
            return 'PortChainWorker';
        }

        if(rule.zip) {
            return 'UnzipperWorker';
        }

        return 'DefaultWorker';
    }

    /**
     * Deep searches the rule until find the most specific one.
     *
     * It looks in the properties in the selector and verify if there is a more
     * specific rule in the map.
     *
     * @param {Object} item
     * @param {Object} map
     * @param {Number} index
     * @returns {Object} The most specific rule.
     * @private
     */
    _deepSearchRule(item, map = {}, index = 0) {
        const attribute = this._extractAttribute(item, map, selectors[index]);
        const key = attribute ? attribute : '*';

        let object = map[key] ? map[key] : map['*'];

        if(index < selectors.length - 1) {
            return this._deepSearchRule(item, object, ++index);
        }
        return object ? object : {};
    }

    /**
     * Extracts the attribute of the item
     *
     * @param {Object} item
     * @param {Object} map
     * @param {Object} selector
     * @returns {String}
     * @private
     */
    _extractAttribute(item, map, selector) {
        if(!item) return null;

        let key = selector['by-class'] ? selector['by-class'][item.constructor.name] : null;

        let result = this._extractResultFromAttribute(item[key], map, selector);

        return result ? result : this._extractResultFromAttribute(item[selector['default']], map, selector);
    }

    /**
     * Extracts the result value from the attribute.
     *
     * @param {Object} value
     * @param {Object} map
     * @param {Object} selector
     * @returns {String}
     * @private
     */
    _extractResultFromAttribute(value, map, selector) {
        let result = value;

        if(Array.isArray(value)) {
            result = '*';

            value.forEach(possible => {
                if(map[possible]) {
                    result = possible;
                    return;
                }
            });
        }
        return result ? result : null;
    }
}

module.exports = Rules;