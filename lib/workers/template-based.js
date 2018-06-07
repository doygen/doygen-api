'use strict';

/* Classes */
const Worker = require('../worker').Worker;
const Port = require('../port').Port;
const Beautifier = require('../beautifier').Beautifier;

const ejs = require('ejs');

/**
 * The 'TemplateBasedWorker' class provides the common API for a worker
 * that uses a template to generate yours output.
 */
class TemplateBasedWorker extends Worker {

    /**
     * Executes the template worker invoking the template writer.
     *
     * @override
     */
    doWork() {
        this.writeFromTemplate(this.rule.template, this.rule.output);
    }

    /**
     * Renders the template.
     *
     * @param {Context} context
     * @param {Object} rule
     * @returns {String}
     * @override
     */
    render(context, rule) {
        let result = '';

        ejs.renderFile(this._template(rule.template), this.makeWorkerContext(rule), function(err, data) {
            result = data ? data : '';
        });
        return result;
    }

    /**
     * Overrides the invocation of the port because all the port invokes
     * in a template should be a render invoke.
     *
     * @param port
     * @param selector
     * @returns {String}
     * @override
     */
    invoke(port, selector = null) {
        return Port.render(this.context, port, selector);
    }

    /**
     * Invoke a port for all items in the collection as a render invoke.
     *
     * Concatenates all the results as one.
     *
     * @param {String} port
     * @param {Array} collection
     * @returns {String}
     * @override
     */
    invokeLoop(port, collection) {
        let result = '';
        collection.forEach(item => {
            result += this.invoke(port, item);
        });
        return result;
    }

    /**
     * Writes the template into the output.
     *
     * @param {String} name
     * @param {String} destination
     */
    writeFromTemplate(name, destination) {
        let templateContext = this.makeWorkerContext(this.rule);

        name = this.extract(name, templateContext);
        destination = this.extract(destination, templateContext);

        console.log('[create] %s', destination);
        this.fs.copyTpl(this._template(name), this._output(destination), templateContext);

        this.beautify(this._output(destination));
    }

    /**
     * Beautify the template output and writes it.
     *
     * @param {String} file
     */
    beautify(file) {
        this.fs.write(file, Beautifier.beautify(file, this.readFile(file)));
    }

    /**
     * A helper to get the template path from the context.
     *
     * @returns {String}
     */
    get templatePath() {
        return this.context.templatePath;
    }

    /**
     * Get the template.
     *
     * @param {String} name
     * @returns {String}
     * @private
     */
    _template(name) {
        const localTemplate = this.path.resolve(this.context.localTemplate, name);
        return this.exists(localTemplate) ? localTemplate : this.path.resolve(this.templatePath, name);
    }

    /**
     * Get the output.
     *
     * @param {String} name
     * @returns {String}
     * @private
     */
    _output(name) {
        return this.path.resolve(this.destinationPath, name);
    }
}

module.exports.Worker = TemplateBasedWorker;