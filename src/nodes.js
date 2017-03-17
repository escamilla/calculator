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

class SymbolicExpressionNode {
  constructor(operator, operands) {
    this.operator = operator;
    this.operands = operands;
  }

  toString() {
    return `(${this.operator} ${this.operands.join(' ')})`;
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

module.exports = {
  NumberNode,
  SymbolNode,
  SymbolicExpressionNode,
  QuotedExpressionNode,
};
