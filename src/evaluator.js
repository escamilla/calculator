const {
  NumberNode,
  SymbolNode,
  SymbolicExpressionNode,
  QuotedExpressionNode
} = require('./nodes');
const operators = require('./operators');

class Evaluator {
  constructor(ast) {
    this.ast = ast;
  }

  evaluate() {
    return this.evaluateNode(this.ast);
  }

  evaluateNode(node) {
    if (node instanceof NumberNode || node instanceof SymbolNode || node instanceof QuotedExpressionNode) {
      return node;
    } else if (node instanceof SymbolicExpressionNode) {
      return this.evaluateSymbolicExpression(node);
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
