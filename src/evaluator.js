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
    return operators[operator](operands);
  }
}

module.exports = Evaluator;
