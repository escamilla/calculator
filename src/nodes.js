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

class SymbolicExpressionNode {
  constructor(items) {
    this.items = items;
  }

  toString() {
    return `(${this.items.map(item => item.toString()).join(' ')})`;
  }
}

class QuotedExpressionNode {
  constructor(value) {
    this.value = value;
  }

  toString() {
    return `'${this.value.toString()}`;
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
  SymbolicExpressionNode,
  QuotedExpressionNode,
  LambdaFunctionNode,
};
