'use strict';

/* Externals */
const fse = require('fs-extra');
const path = require('path');

/**
 * The 'Builder' class provides the common API for a Potter Builder.
 *
 * Do a pre-process on all metadata files of the project.
 *
 */
class Builder {

    /**
     * Run the pre-process.
     *
     * Gets all builders available in the generator and executes them. At the end,
     * the output metadata is written in the 'metadata.json' file.
     *
     * @param generatorPath
     * @param input
     * @static
     */
    static run(generatorPath, input) {
        let metadataJSon = Builder.projectMetadata();

        Builder.buildersByOrder(generatorPath).forEach(builder => {
            let metadataBuilder = builder.run(Builder.fromFile(builder.metadataFile));

            metadataJSon = Object.assign(metadataJSon, metadataBuilder);
        });

        Builder.writeMetadataFile(metadataJSon, input);
    }

    /**
     * Gets all the builders ordered by priority.
     *
     * @param generatorPath
     * @returns {Array}
     * @static
     */
    static buildersByOrder(generatorPath) {
        const arrayBuilders = [];

        const dirBuilders = path.resolve(generatorPath, 'builders');

        fse.readdirSync(dirBuilders).forEach(filePath => {
            let BuilderWorkerClass = require(path.resolve(dirBuilders, filePath)).BuilderWorker;

            arrayBuilders.push(new BuilderWorkerClass());
        });

        arrayBuilders.sort(function(a,b) { return a.priority - b.priority });
        return arrayBuilders;
    }

    /**
     * Gets the metadata from the 'project.son' file.
     *
     * @returns {*}
     * @static
     */
    static projectMetadata() {
        return Builder.fromFile('project.json');
    }

    /**
     * Gets the metadata from a '.json' file.
     *
     * @param jsonFile
     * @returns {*}
     * @static
     */
    static fromFile(jsonFile) {
        return fse.readJsonSync(path.resolve(process.cwd(), jsonFile), { throws: false });
    }

    /**
     * Writes the 'metadata.json' file.
     *
     * @param metadataJSon
     * @param input
     * @static
     */
    static writeMetadataFile(metadataJSon, input) {
        fse.outputFileSync(path.resolve(process.cwd(), 'meta', input.type, 'metadata.json'), JSON.stringify(metadataJSon, null, '  '));
    }
}

/**
 * The 'BuilderWorker' class provides the common API for all builder workers of the generator.
 *
 * All builder workers should extend this class.
 *
 * @property {String} metadataFile  - name of metadata file.
 * @property {Integer} priority     - the priority for ordering the builders.
 *
 */
class BuilderWorker {

    /**
     * Constructor.
     *
     * @param metadataFile
     * @param priority
     */
    constructor(metadataFile, priority) {
        this._metadataFile = metadataFile;
        this._priority = priority;
    }

    /**
     * Run the builder worker.
     *
     * It changes, if necessary, the original metadata returning the custom one.
     *
     * @param metadata
     * @returns {*}
     */
    run(metadata) {
        return metadata;
    }

    /**
     * Gets the name of the metadata file.
     *
     * @returns {*}
     */
    get metadataFile() {
        return this._metadataFile;
    }

    /**
     * Gets the priority of the execution.
     *
     * @returns {*}
     */
    get priority() {
        return this._priority;
    }
}

module.exports.Builder = Builder;
module.exports.BuilderWorker = BuilderWorker;