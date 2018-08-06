'use strict';

/**
 * The 'Entity' class provides the common API for an entity in a Potter project.
 *
 * @constructor
 *
 * @param {Object} entity
 *
 * @property {String}   name        - the entity name.
 * @property {String}   plural      - plural name of the entity to show.
 * @property {Array}    properties  - the entity properties.
 */
class Entity {

    constructor(entity) {
        this._name = entity.name;
        this._labels = entity.labels;
        this._properties = this.toProperties(entity.properties);
        this._tags = entity.tags;
    }

    toProperties(properties) {
        let array = [];

        properties.forEach(prop => {
            array.push(new Property(this, prop));
        });
        return array;
    }

    get name() {
        return this._name;
    }

    get lowerName() {
        return this.name.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase();
    }

    get labels() {
        return this._labels;
    }

    get properties() {
        return this._properties;
    }

    get tags() {
        return this._tags;
    }

    tag(name) {
        if (!this.tags) return null;

        const index = this.tags.indexOf(name);

        if(index != -1) {
            return this.tags[index];
        }
        return null;
    }
}

class Property {

    constructor(entity, prop) {
        this._params = prop;
        this._entity = entity;

        this._name = prop.name;
        this._label = prop.label;
        this._type = prop.type;

        this._target = prop.target;
        this._cardinality = prop.cardinality;
        this._tags = prop.tags ? prop.tags : [];
    }

    get name() {
        return this._name;
    }

    get label() {
        return this._label;
    }

    get type() {
        return this._type;
    }

    get target() {
        return this._target;
    }

    get cardinality() {
        return this._cardinality;
    }

    get tags() {
        return this._tags;
    }

    get params() {
        return this._params;
    }

    get entity() {
        return this._entity;
    }

    tag(name) {
        const index = this.tags.indexOf(name);

        if(index != -1) {
            return this.tags[index];
        }
        return null;
    }
}

module.exports = Entity;