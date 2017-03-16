const {
  NumberNode,
  SymbolNode,
  QuotedExpressionNode,
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

};

module.exports = operators;
