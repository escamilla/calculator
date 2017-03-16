const {
  NumberNode,
  SymbolNode,
  SymbolicExpressionNode,
  QuotedExpressionNode,
} = require('./nodes');

const Environment = require('./environment');
const operators = require('./operators');

class Evaluator {
  constructor(ast) {
    this.ast = ast;
  }

  evaluate() {
    return this.evaluateNode(this.ast, new Environment());
  }

  evaluateNode(node, env) {
    if (node instanceof NumberNode || node instanceof QuotedExpressionNode) {
      return node;
    } else if (node instanceof SymbolNode) {
      return this.evaluateSymbolNode(node, env);
    } else if (node instanceof SymbolicExpressionNode) {
      return this.evaluateSymbolicExpression(node, env);
    }
    throw new Error(`unknown node type: ${node.constructor.name}`);
  }

  evaluateSymbolNode(node, env) {
    return env.lookUp(node.value) || node;
  }

  evaluateSymbolicExpression(node, env) {
    const evaluatedOperands =
      node.operands.map(operand => this.evaluateNode(operand, new Environment(env)));
    const result = this.evaluateOperation(node.operator, evaluatedOperands, env);
    // the result might be an s-expression, so another evaluation is necessary
    return this.evaluateNode(result, new Environment(env));
  }

  evaluateOperation(operator, operands, env) {
    if (operators[operator.value].checkArgs(operands)) {
      return operators[operator.value].method(operands, env);
    }
    throw new Error(`invalid arguments for operator: ${operator.value}`);
  }
}

module.exports = Evaluator;
