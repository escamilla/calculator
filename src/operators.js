const {NumberNode} = require('./nodes');

const operators = {

  add: {
    checkArgs(operands) {
      return operands.length >= 2 &&
        operands.every((operand) => operand instanceof NumberNode);
    },
    method(operands) {
      return new NumberNode(
        operands.reduce((acc, operand) => {
          return acc + operand.value;
        }, 0));
    }
  },

  sub: {
    checkArgs(operands) {
      return operands.length === 2 &&
        operands.every((operand) => operand instanceof NumberNode);
    },
    method(operands) {
      return new NumberNode(operands[0].value - operands[1].value);
    }
  },

  mul: {
    checkArgs(operands) {
      return operands.length >= 2 &&
        operands.every((operand) => operand instanceof NumberNode);
    },
    method(operands) {
      return new NumberNode(
        operands.reduce((acc, operand) => {
          return acc * operand.value;
        }, 1));
    }
  },

  div: {
    checkArgs(operands) {
      return operands.length === 2 &&
        operands.every((operand) => operand instanceof NumberNode);
    },
    method(operands) {
      return new NumberNode(operands[0].value / operands[1].value);
    }
  },

  mod: {
    checkArgs(operands) {
      return operands.length === 2 &&
        operands.every((operand) => operand instanceof NumberNode);
    },
    method(operands) {
      return new NumberNode(operands[0].value % operands[1].value);
    }
  },

  pow: {
    checkArgs(operands) {
      return operands.length === 2 &&
        operands.every((operand) => operand instanceof NumberNode);
    },
    method(operands) {
      return new NumberNode(Math.pow(operands[0].value, operands[1].value));
    }
  }

};

module.exports = operators;
