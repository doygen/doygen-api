'use strict';

/* Classes */
const Generator = require('./generator');

/**
 * The 'Command' class provides the common API for define commands for the generator.
 *
 */
class Command {

    /**
     * Gets the initial generator.
     *
     * @returns {Generator}
     */
    get generator() {
        return new Generator();
    }

    /**
     * Pre-execution method.
     *
     * @param {Object} input
     */
    pre(input) {

    }

    /**
     * Executes the command.
     *
     * @param {Array} args
     */
    execute(args) {
        let input = this.toInput(args);

        this.pre(input);

        this.generator.run(input);
    }

    /**
     * Parse the arguments to an input.
     *
     * @param {Array} args
     * @returns {Object}
     */
    toInput(args) {
        return { };
    }
}

module.exports.Command = Command;