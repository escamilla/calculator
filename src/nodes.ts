class NumberNode {
  constructor(public value) {
    this.value = value;
  }

  toString() {
    return `${this.value}`;
  }
}

class SymbolNode {
  constructor(public value) {
    this.value = value;
  }

  toString() {
    return `${this.value}`;
  }
}

class StringNode {
  constructor(public value) {
    this.value = value;
  }

  toString() {
    return `"${this.value}"`;
  }
}

class ListNode {
  constructor(public elements) {
    this.elements = elements;
  }

  toString() {
    return `(${this.elements.map(element => element.toString()).join(' ')})`;
  }
}

class LambdaFunctionNode {
  constructor(public parameters, public body) {
    this.parameters = parameters;
    this.body = body;
  }

  toString() {
    return `(lambda ${this.parameters.toString()} ${this.body.toString()})`;
  }
}

export {
  NumberNode,
  SymbolNode,
  StringNode,
  ListNode,
  LambdaFunctionNode,
};
