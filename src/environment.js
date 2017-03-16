class Environment {
  constructor(parent) {
    this.parent = parent || null;
    this.definitions = {};
  }

  define(key, value) {
    this.definitions[key] = value;
  }

  lookUp(key) {
    if (Object.prototype.hasOwnProperty.call(this.definitions, key)) {
      return this.definitions[key];
    }
    if (this.parent !== null) {
      return this.parent.lookUp(key);
    }
    return null;
  }

}

module.exports = Environment;
