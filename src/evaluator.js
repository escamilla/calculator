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
      case 'operation':
        return this.evaluateOperationNode(node);
      case 'number':
      case 'symbol':
        return node;
    }
  }

  evaluateOperationNode(node) {
    const evaluatedOperands = node.operands.map((operand) => {
      return this.evaluateNode(operand);
    });
    return this.evaluateOperation(node.operator, evaluatedOperands);
  }

  evaluateOperation(operator, operands) {
    if (operators[operator].checkArgs(operands)) {
      return operators[operator].method(operands);
    }
    throw new Error(`invalid arguments for operator: ${operator}`);
  }
}

module.exports = Evaluator;
