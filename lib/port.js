'use strict';

/**
 * The 'Port' class provides the common API for the Indirect Widget pattern use.
 *
 * Potter Generators uses the concept of 'Port' to define, select and use different workers based
 * on the rules and selectors of the port.
 *
 * @constructor
 *
 * @property {String} name      - name of the port.
 * @property {Object} selector  - selector to filter the rules for the specific one.
 */
class Port {

    constructor(name, selector) {
        this._name = name;
        this._selector = selector;
    }

    /**
     * Gets the rule from the generator context.
     *
     * It uses the port's name and the selector to find the most specific rule.
     *
     * @param {Context} context
     * @returns {Object} Rule founded.
     */
    getRule(context) {
        let rule = context.rule(this.name, this.selector);
        rule.params = this.getParams();

        return rule;
    }

    /**
     * Gets the parameters to be added to rule's parameters.
     *
     * If it is necessary to customize the parameters, this method should
     * be overridden.
     *
     * @returns {Object}
     */
    getParams() {
        return { item: this.selector };
    }

    /**
     * Gets the port's name.
     *
     * @returns {String}
     */
    get name() {
        return this._name;
    }

    /**
     * Gets the port's selector.
     *
     * @returns {Object}
     */
    get selector() {
        return this._selector;
    }

    /* STATIC METHODS */

    /**
     * Invokes a port.
     *
     * @param {Context} context
     * @param {String} portName
     * @param {Object} selector
     * @static
     */
    static invoke(context, portName, selector = null) {
        const port = Port.openPort(portName, selector);

        let rule = port.getRule(context);
        context.workersMap[rule.worker].run(context, rule);
    }

    /**
     * Renders some component from the port specified using the selector.
     *
     * This method calls the worker's method: 'render'.
     * Does not invoke the worker's method 'run'!
     *
     * @param {Context} context
     * @param {String} portName
     * @param {Object} selector
     * @returns {String}
     * @static
     */
    static render(context, portName, selector = null) {
        const port = Port.openPort(portName, selector);

        let rule = port.getRule(context);
        return context.workersMap[rule.worker].render(context, rule);
    }

    /**
     * Opens a port with the selector.
     *
     * Some selectors can get a customize port.
     *
     * @param {String} port
     * @param {Object} selector
     * @returns {Port}
     */
    static openPort(port, selector) {
        if (selector) {
            let selectorType = selector.constructor.name;

            if (selectorType === 'Entity') {
                return new PortEntity(port, selector);
            }

            if (selectorType === 'Property') {
                return new PortProperty(port, selector);
            }
        }
        return new Port(port, selector);
    }
}

/**
 * The 'PortEntity' class is a port specific for a selector of 'Entity' type.
 *
 * @extends Port
 *
 */
class PortEntity extends Port {

    /**
     * Get the parameters for 'Entity' type.
     *
     * @returns {Object}
     * @override
     */
    getParams() {
        return { item: this.selector, entity: this.selector };
    }
}

/**
 * The 'PortProperty' class is a port specific for a selector of 'Property' type.
 *
 * @extends Port
 *
 */
class PortProperty extends Port {

    /**
     * Get the parameters for 'Property' type.
     *
     * @returns {Object}
     * @override
     */
    getParams() {
        return { item: this.selector, property: this.selector };
    }
}

module.exports.Port = Port;