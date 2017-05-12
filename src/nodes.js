class NumberNode {
  constructor(value) {
    this.value = value;
  }

  toString() {
    return `${this.value}`;
  }
}

class SymbolNode {
  constructor(value) {
    this.value = value;
  }

  toString() {
    return `${this.value}`;
  }
}

class StringNode {
  constructor(value) {
    this.value = value;
  }

  toString() {
    return `"${this.value}"`;
  }
}

class ListNode {
  constructor(elements) {
    this.elements = elements;
  }

  toString() {
    return `(${this.elements.map(element => element.toString()).join(' ')})`;
  }
}

class LambdaFunctionNode {
  constructor(parameters, body) {
    this.parameters = parameters;
    this.body = body;
  }

  toString() {
    return `(lambda ${this.parameters.toString()} ${this.body.toString()})`;
  }
}

module.exports = {
  NumberNode,
  SymbolNode,
  StringNode,
  ListNode,
  LambdaFunctionNode,
};
