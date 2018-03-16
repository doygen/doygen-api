/**
 * Defines the Level for define where the generator should
 * discover, select and use the resources.
 *
 * @type {Object}
 */
const LEVEL = Object.freeze({
    API: Symbol("api"),
    GENERATOR: Symbol("generator"),
    LOCAL: Symbol("local")
});

module.exports.Level = LEVEL;