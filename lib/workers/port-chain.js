'use strict';

/* Classes */
const Worker = require('../worker').Worker;
const Port = require('../port').Port;

/**
 * The 'PortChainWorker' class provides the common API for a worker
 * that will call all ports in the chain.
 *
 */
class PortChainWorker extends Worker {

    /**
     * Call all ports in the chain.
     *
     * @override
     */
    doWork() {
        console.log(JSON.stringify(this.rule));
        this.rule.chain.forEach(port => {
           Port.invoke(this.context, port);
        });
    }

}

module.exports.Worker = PortChainWorker;