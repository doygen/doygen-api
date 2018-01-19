'use strict';

const Port = require('./port'),
    Context = require('./context'),
    path = require('path');

class Generator {

    pre() {

    }

    run(input) {
        this._input = input;

        this.pre();

        this.port.invoke(this.context());
    }

    get port() {
        return new Port('generator');
    }

    context() {
        let context = new Context();

        context.input = this.input;
        context.templatePath = this.templatePath;
        context.customParams = this.params;

        this.addWorkers(context);
        this.addRules(context);

        return context;
    }

    addRules(context) {
        /* API */
        context.addRules(path.resolve(__dirname, 'rules.json'));

        /* Generator */
        context.addRules(path.resolve(this.generatorPath, 'rules.json'));

        /* Local/Custom */
        context.addRules(path.resolve(process.cwd(), 'rules.json'));
    }

    addWorkers(context) {
        /* API */
        context.addWorkers(path.resolve(__dirname, 'workers'));

        /* Generator */
        context.addWorkers(this.workersPath);
    }

    get params() {
        return {};
    }

    get generatorPath() {
        throw Error('This method should be overriden.');
    }

    get workersPath() {
        return path.resolve(this.generatorPath, 'workers');
    }

    get templatePath() {
        return path.resolve(this.generatorPath, 'templates');
    }

    get input() {
        return this._input;
    }
}

module.exports = Generator;