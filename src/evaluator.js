const operators = require('./operators');

class Evaluator {
  constructor(ast) {
    this.ast = ast;
  }

  evaluate() {
    return this.evaluateNode(this.ast);
  }

  evaluateNode(node) {
    switch (node.type) {
      case 'symbolic-expression':
        return this.evaluateSymbolicExpression(node);
      case 'number':
      case 'symbol':
        return node;
    }
  }

  evaluateSymbolicExpression(node) {
    const evaluatedOperands = node.operands.map((operand) => {
      return this.evaluateNode(operand);
    });
    return this.evaluateOperation(node.operator, evaluatedOperands);
  }

  evaluateOperation(operator, operands) {
    if (operators[operator.value].checkArgs(operands)) {
      return operators[operator.value].method(operands);
    }
    throw new Error(`invalid arguments for operator: ${operator.value}`);
  }
}

module.exports = Evaluator;
