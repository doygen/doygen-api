'use strict';

class Port {

    constructor(name) {
        this._name = name;
    }

    invoke(context) {
        let rules = context.rules(this.name);

        rules.worker.run(context, rules.configuration);
    }

    get name() {
        return this._name;
    }
}

module.exports = Port;