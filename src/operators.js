const {
  NumberNode,
  SymbolNode,
  SymbolicExpressionNode,
  QuotedExpressionNode,
  LambdaFunctionNode,
} = require('./nodes');

const operators = {

  add: {
    checkArgs(operands) {
      return operands.length >= 2 &&
        operands.every(operand => operand instanceof NumberNode);
    },
    method(operands) {
      return new NumberNode(
        operands.reduce((acc, operand) => acc + operand.value, 0));
    },
  },

  sub: {
    checkArgs(operands) {
      return operands.length === 2 &&
        operands.every(operand => operand instanceof NumberNode);
    },
    method(operands) {
      return new NumberNode(operands[0].value - operands[1].value);
    },
  },

  mul: {
    checkArgs(operands) {
      return operands.length >= 2 &&
        operands.every(operand => operand instanceof NumberNode);
    },
    method(operands) {
      return new NumberNode(
        operands.reduce((acc, operand) => acc * operand.value, 1));
    },
  },

  div: {
    checkArgs(operands) {
      return operands.length === 2 &&
        operands.every(operand => operand instanceof NumberNode);
    },
    method(operands) {
      return new NumberNode(operands[0].value / operands[1].value);
    },
  },

  mod: {
    checkArgs(operands) {
      return operands.length === 2 &&
        operands.every(operand => operand instanceof NumberNode);
    },
    method(operands) {
      return new NumberNode(operands[0].value % operands[1].value);
    },
  },

  pow: {
    checkArgs(operands) {
      return operands.length === 2 &&
        operands.every(operand => operand instanceof NumberNode);
    },
    method(operands) {
      return new NumberNode(operands[0].value ** operands[1].value);
    },
  },

  list: {
    checkArgs(operands) {
      return operands.length > 0;
    },
    method(operands) {
      return new QuotedExpressionNode(new SymbolicExpressionNode(operands));
    },
  },

  quote: {
    checkArgs(operands) {
      return operands.length === 1;
    },
    method(operands) {
      return new QuotedExpressionNode(operands[0]);
    },
  },

  unquote: {
    checkArgs(operands) {
      return operands.length === 1 && operands[0] instanceof QuotedExpressionNode;
    },
    method(operands) {
      return operands[0].value;
    },
  },

  sequence: {
    checkArgs(operands) {
      return operands.length >= 1;
    },
    method(operands) {
      return operands[operands.length - 1];
    },
  },

  let: {
    checkArgs(operands) {
      return operands.length === 2 &&
        operands[0] instanceof QuotedExpressionNode &&
        operands[0].value instanceof SymbolNode;
    },
    method(operands, env) {
      const key = operands[0].value.value;
      const value = operands[1];
      if (env.parent !== null) {
        env.parent.define(key, value);
      }
      return value;
    },
  },

  lambda: {
    checkArgs(operands) {
      if (operands.length !== 2) {
        return false;
      }
      if (!(operands[0] instanceof QuotedExpressionNode)) {
        return false;
      }
      if (!(operands[1] instanceof QuotedExpressionNode)) {
        return false;
      }
      if (!(operands[0].value instanceof SymbolicExpressionNode)) {
        return false;
      }
      return true;
    },
    method(operands) {
      const parameters = operands[0];
      const body = operands[1];
      return new LambdaFunctionNode(parameters, body);
    },
  },

  eq: {
    checkArgs(operands) {
      return operands.length === 2 &&
        operands.every(operand => operand instanceof NumberNode);
    },
    method(operands) {
      return operands[0].value === operands[1].value ?
        new NumberNode(0) : new NumberNode(1);
    },
  },

  lt: {
    checkArgs(operands) {
      return operands.length === 2 &&
        operands.every(operand => operand instanceof NumberNode);
    },
    method(operands) {
      return operands[0].value < operands[1].value ?
        new NumberNode(0) : new NumberNode(1);
    },
  },

  gt: {
    checkArgs(operands) {
      return operands.length === 2 &&
        operands.every(operand => operand instanceof NumberNode);
    },
    method(operands) {
      return operands[0].value > operands[1].value ?
        new NumberNode(0) : new NumberNode(1);
    },
  },

  if: {
    checkArgs(operands) {
      return operands.length === 3 &&
        operands[0] instanceof NumberNode &&
        operands[1] instanceof QuotedExpressionNode &&
        operands[2] instanceof QuotedExpressionNode;
    },
    method(operands) {
      const condition = operands[0].value;
      const outcome = condition === 0 ? operands[1] : operands[2];
      return new SymbolicExpressionNode([new SymbolNode('unquote'), outcome]);
    },
  },

  length: {
    checkArgs(operands) {
      return operands.length === 1 &&
        operands[0] instanceof QuotedExpressionNode &&
        operands[0].value instanceof SymbolicExpressionNode;
    },
    method(operands) {
      return new NumberNode(operands[0].value.items.length);
    },
  },

  nth: {
    checkArgs(operands) {
      return operands.length === 2 &&
        operands[0] instanceof QuotedExpressionNode &&
        operands[0].value instanceof SymbolicExpressionNode &&
        operands[1] instanceof NumberNode;
    },
    method(operands) {
      const index = operands[1].value - 1;
      return operands[0].value.items[index];
    },
  },

  slice: {
    checkArgs(operands) {
      return operands.length === 3 &&
        operands[0] instanceof QuotedExpressionNode &&
        operands[0].value instanceof SymbolicExpressionNode &&
        operands[1] instanceof NumberNode &&
        operands[2] instanceof NumberNode;
    },
    method(operands) {
      const { items } = operands[0].value;
      const begin = operands[1].value;
      const end = operands[2].value;
      const sliced = items.slice(begin, end);
      return new QuotedExpressionNode(new SymbolicExpressionNode(sliced));
    },
  },

  concat: {
    checkArgs(operands) {
      return operands.length === 2 &&
        operands[0] instanceof QuotedExpressionNode &&
        operands[0].value instanceof SymbolicExpressionNode &&
        operands[1] instanceof QuotedExpressionNode &&
        operands[1].value instanceof SymbolicExpressionNode;
    },
    method(operands) {
      const leftItems = operands[0].value.items;
      const rightItems = operands[1].value.items;
      const joined = leftItems.concat(rightItems);
      return new QuotedExpressionNode(new SymbolicExpressionNode(joined));
    },
  },

  print: {
    checkArgs(operands) {
      return operands.length === 1;
    },
    method(operands) {
      console.log(operands[0].toString());
      return operands[0];
    },
  },

};

module.exports = operators;
