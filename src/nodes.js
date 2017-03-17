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

module.exports = {
  NumberNode,
  SymbolNode,
  SymbolicExpressionNode,
  QuotedExpressionNode,
};
