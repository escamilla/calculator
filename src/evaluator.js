const {
  NumberNode,
  SymbolNode,
  StringNode,
  ListNode,
  LambdaFunctionNode,
} = require('./nodes');

const Environment = require('./environment');
const operators = require('./operators');

const specialForms = ['if', 'let', 'quote', 'unquote'];

class Evaluator {
  constructor(ast, globalEnv = null) {
    this.ast = ast;
    this.globalEnv = globalEnv;
  }

  evaluate() {
    return this.evaluateNode(this.ast, new Environment(this.globalEnv));
  }

  evaluateNode(node, env) {
    if (node instanceof NumberNode ||
        node instanceof StringNode ||
        node instanceof LambdaFunctionNode) {
      return node;
    } else if (node instanceof SymbolNode) {
      return this.evaluateSymbolNode(node, env);
    } else if (node instanceof ListNode) {
      return this.evaluateListNode(node, env);
    }
    throw new Error(`unknown node type: ${node.constructor.name}`);
  }

  evaluateSymbolNode(node, env) {
    return env.get(node.value) || node;
  }

  evaluateListNode(node, env) {
    const operator = this.evaluateNode(node.elements[0], new Environment(env));

    if (operator instanceof SymbolNode && specialForms.includes(operator.value)) {
      const operands = node.elements.slice(1);
      if (operator.value === 'if') {
        return this.evaluateIfOperation(operator, operands, env);
      } else if (operator.value === 'let') {
        return this.evaluateLetOperation(operator, operands, env);
      } else if (operator.value === 'quote') {
        return this.evaluateQuoteOperation(operator, operands);
      } else if (operator.value === 'unquote') {
        return this.evaluateUnquoteOperation(operator, operands, env);
      }
    }

    const operands = node.elements.slice(1).map(el => this.evaluateNode(el, new Environment(env)));

    if (operator instanceof SymbolNode) {
      return this.evaluateOperation(operator, operands, env);
    } else if (operator instanceof LambdaFunctionNode) {
      return this.evaluateLambdaFunction(operator, operands, env);
    }

    throw new Error('first item of symbolic expression must be a symbol or lambda function');
  }

  evaluateIfOperation(operator, operands, env) {
    const condition = this.evaluateNode(operands[0], env);
    if (!(condition instanceof NumberNode)) {
      throw new Error('condition in if expression must evaluate to a number representing a boolean value');
    }
    const outcome = condition.value === 0 ? operands[1] : operands[2];
    return this.evaluateNode(outcome, env);
  }

  evaluateLetOperation(operator, operands, env) {
    if (operands.length !== 2) {
      throw new Error('let operator takes exactly two arguments');
    }

    if (!(operands[0] instanceof SymbolNode)) {
      throw new Error('first argument to let operator must be a symbol');
    }

    const key = operands[0].value;
    const value = this.evaluateNode(operands[1], env);

    if (env.parent !== null) {
      env.parent.set(key, value);
    }
    return value;
  }

  evaluateQuoteOperation(operator, operands) {
    if (operands.length !== 1) {
      throw new Error('quote operator takes exactly one argument');
    }
    return operands[0];
  }

  evaluateUnquoteOperation(operator, operands, env) {
    if (operands.length !== 1) {
      throw new Error('unquote operator takes exactly one argument');
    }
    return this.evaluateNode(operands[0], env);
  }

  evaluateOperation(operator, operands, env) {
    if (operator.value === 'if') {
      const condition = this.evaluateNode(operands[0], env);
      const outcome = condition.value === 0 ? operands[1] : operands[2];
      return this.evaluateNode(outcome, env);
    }

    if (operators[operator.value].checkArgs(operands)) {
      return operators[operator.value].method(operands, env);
    }

    throw new Error(`invalid arguments for operator: ${operator.value}`);
  }

  evaluateLambdaFunction(operator, operands, env) {
    const parameters = operator.parameters.elements;
    const body = operator.body;

    const expected = parameters.length;
    const actual = operands.length;
    if (expected !== actual) {
      throw new Error(`lambda function takes ${expected} arguments but got ${actual}`);
    }

    const lambdaEnv = new Environment(env);
    for (let i = 0; i < expected; i += 1) {
      const key = parameters[i].value;
      const value = operands[i];
      lambdaEnv.set(key, value);
    }

    return this.evaluateNode(body, lambdaEnv);
  }
}

module.exports = Evaluator;
