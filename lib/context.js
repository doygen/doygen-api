'use strict';

const fse = require('fs-extra'),
    path = require('path'),
    Worker = require('./worker');

class Context {

    constructor() {
        this._rulesMap = new Object();
        this._workersMap = new Object();
    }

    addRules(rulesPath) {
        let rulesJSON = fse.readJsonSync(rulesPath, { throws: false });

        if(rulesJSON) {

            rulesJSON.forEach(r => {

                if(!this.rulesMap[r.port]) {
                    this.rulesMap[r.port] = { worker: new Worker(), configuration: {} };
                }

                this.rulesMap[r.port].worker = this.workersMap[r.worker];
                this.rulesMap[r.port].configuration = Object.assign(this.rulesMap[r.port].configuration, r.configuration);
            });
        }
    }

    addWorkers(workersPath) {
        const modulesList = fse.readdirSync(workersPath);

        modulesList.forEach(filePath => {

            let WorkerClass = require(path.resolve(workersPath, filePath));

            let worker = new WorkerClass();
            this.workersMap[worker.constructor.name] = worker;
        });
    }

    rules(portName) {
        return this.rulesMap[portName];
    }

    get rulesMap() {
        return this._rulesMap;
    }

    get workersMap() {
        return this._workersMap;
    }
}

module.exports = Context;