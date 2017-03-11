class NumberNode {
  constructor(value) {
    this.value = value;
  }
}

class SymbolNode {
  constructor(value) {
    this.value = value;
  }
}

class SymbolicExpressionNode {
  constructor(operator, operands) {
    this.operator = operator;
    this.operands = operands;
  }
}

class QuotedExpressionNode {
  constructor(value) {
    this.value = value;
  }
}

module.exports = {
  NumberNode,
  SymbolNode,
  SymbolicExpressionNode,
  QuotedExpressionNode
};
