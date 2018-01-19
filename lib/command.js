'use strict';

const Generator = require('./generator');

class Command {

    get generator() {
        return new Generator();
    }

    pre(input) {

    }

    execute(args) {
        let input = this.toInput(args);

        this.pre(input);

        this.generator.run(input);
    }

    toInput(args) {
        return { };
    }
}

module.exports = Command;