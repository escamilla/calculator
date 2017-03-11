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
      case 'quoted-expression':
        return node;
    }
  }

  evaluateSymbolicExpression(node) {
    const evaluatedOperands = node.operands.map((operand) => {
      return this.evaluateNode(operand);
    });
    const result = this.evaluateOperation(node.operator, evaluatedOperands);
    // the result might be an s-expression, so another evaluation is necessary
    return this.evaluateNode(result);
  }

  evaluateOperation(operator, operands) {
    if (operators[operator.value].checkArgs(operands)) {
      return operators[operator.value].method(operands);
    }
    throw new Error(`invalid arguments for operator: ${operator.value}`);
  }
}

module.exports = Evaluator;
