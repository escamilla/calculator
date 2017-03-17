const {
  NumberNode,
  SymbolNode,
  SymbolicExpressionNode,
  QuotedExpressionNode,
  LambdaFunctionNode,
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
    if (node instanceof NumberNode ||
        node instanceof QuotedExpressionNode ||
        node instanceof LambdaFunctionNode) {
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
    const evaluatedItems = node.items.map(item => this.evaluateNode(item, new Environment(env)));
    const operator = evaluatedItems[0];
    const operands = evaluatedItems.slice(1);

    let result;
    if (operator instanceof SymbolNode) {
      result = this.evaluateOperation(operator, operands, env);
    } else if (operator instanceof LambdaFunctionNode) {
      result = this.evaluateLambdaFunction(operator, operands, env);
    } else {
      throw new Error('first item of symbolic expression must be a symbol or lambda function');
    }

    // the result might be an s-expression, so another evaluation is necessary
    return this.evaluateNode(result, new Environment(env));
  }

  evaluateOperation(operator, operands, env) {
    if (operators[operator.value].checkArgs(operands)) {
      return operators[operator.value].method(operands, env);
    }
    throw new Error(`invalid arguments for operator: ${operator.value}`);
  }

  evaluateLambdaFunction(operator, operands, env) {
    const parameters = operator.parameters.value.items;
    const body = operator.body.value;

    const expected = parameters.length;
    const actual = operands.length;
    if (expected !== actual) {
      throw new Error(`lambda function takes ${expected} arguments but got ${actual}`);
    }

    const lambdaEnv = new Environment(env);
    for (let i = 0; i < expected; i += 1) {
      const key = parameters[i].value;
      const value = operands[i];
      lambdaEnv.define(key, value);
    }

    return this.evaluateNode(body, lambdaEnv);
  }
}

module.exports = Evaluator;
