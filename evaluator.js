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
    let result;
    switch (operator) {
      case '+':
        result = operands.reduce((acc, operand) => {
          return acc + operand.value;
        }, 0);
        break;
      case '-':
        result = operands[0].value - operands[1].value;
        break;
      case '*':
        result = operands.reduce((acc, operand) => {
          return acc * operand.value;
        }, 1);
        break;
      case '/':
        result = operands[0].value / operands[1].value;
        break;
    }
    return {
      type: 'number',
      value: result
    };
  }
}

module.exports = Evaluator;
