'use strict';

/* Classes */
const Command = require('../command').Command;
const Generator = require('../generator').Generator;

/**
 * The 'ProjectCommand' is the command to create a Potter project.
 */
class ProjectCommand extends Command {

    /**
     * Gets the inital generator.
     *
     * @returns {ProjectGenerator}
     * @override
     */
    get generator() {
        return new ProjectGenerator();
    }

    /**
     * Pre-execution of the command.
     *
     * @param {Object} input
     * @override
     */
    pre(input) {
        console.log('[new] Potter project: ' + input.project.name);
    }

    /**
     * Parses the arguments into a input.
     *
     * @param {Array} args
     * @returns {Object}
     * @override
     */
    toInput(args) {
        return { project: { name: args[0] } };
    }
}

/**
 * The 'ProjectGenerator' class is a generator to create a Potter project.
 */
class ProjectGenerator extends Generator {

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
    get params() {
        return { "project": { "name": this.input.project.name } };
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

module.exports.Command = ProjectCommand;