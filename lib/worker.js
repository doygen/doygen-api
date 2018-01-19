'use strict';

var memFs = require('mem-fs'),
    editor = require('mem-fs-editor'),
    store = memFs.create(),
    fs = editor.create(store);

const fse = require('fs-extra'),
    Port = require('./port');


class Worker {

    run(context, configuration) {
        this._context = context;
        this._configuration = configuration;

        this.doWork();

        this.end();
    }

    doWork() { }

    invoke(port) {
        new Port(port).invoke(this.context);
    }

    end() {
        fs.commit(function() { });
    }

    get context() {
        return this._context;
    }

    get input() {
        return this.context.input;
    }

    get configuration() {
        return this._configuration;
    }

    get fs() {
        return fs;
    }

    goTo(pathTo) {
        process.chdir(pathTo);
    }

    mkdir(dirPath) {
        fse.mkdirsSync(dirPath);
    }
}

module.exports = Worker;