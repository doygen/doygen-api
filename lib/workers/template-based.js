'use strict';

const Worker = require('../worker'),
    path = require('path');

class TemplateBasedWorker extends Worker {

    doWork() {
        this.writeFromTemplate(this.configuration.template, this.configuration.output);
    }

    writeFromTemplate(name, destination) {

        console.log('[create] %s', destination);
        this.fs.copyTpl(path.resolve(this.templatePath, name), path.resolve(process.cwd(), destination), this.toTemplateContext());
    }

    toTemplateContext() {

        return Object.assign({}, this.context.customParams, this.configuration);
    }

    get templatePath() {
        return this.context.templatePath;
    }
}

module.exports = TemplateBasedWorker;