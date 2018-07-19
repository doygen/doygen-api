'use strict';

/* Classes */
const Command = require('../command').Command;
const Generator = require('../generator').Generator;

/**
 * The 'InstallerCommand' is the command to install a Potter generator.
 */
class InstallerCommand extends Command {

    /**
     * Gets the inital generator.
     *
     * @returns {ProjectGenerator}
     * @override
     */
    get generator() {
        return new InstallerGenerator();
    }

    /**
     * Pre-execution of the command.
     *
     * @param {Object} input
     * @override
     */
    pre(input) {
        console.log('[new] Potter generator: ' + input.generator.url);
    }

    /**
     * Parses the arguments into a input.
     *
     * @param {Array} args
     * @returns {Object}
     * @override
     */
    toInput(args) {
        return { generator: { url: args[0] } };
    }
}

/**
 * The 'InstallerGenerator' class is a generator to install a Potter generator.
 */
class InstallerGenerator extends Generator {

    /**
     * Gets the generator's path.
     *
     * @returns {String}
     */
    get generatorPath() {
        return __dirname;
    }

    /**
     * Gets the custom paramaters of the generator.
     *
     * @returns {Object}
     * @override
     */
    getParams() {
        return { "generator": { "url": this.input.generator.url } };
    }

    /**
     * Goes to destination path to works at the dist path.
     * 
     * No op
     *
     */
    goToDestination() {
    }
}

module.exports.Command = InstallerCommand;