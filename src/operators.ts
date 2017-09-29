/* tslint:disable:object-literal-sort-keys */

import ListNode from "./nodes/ListNode";
import NumberNode from "./nodes/NumberNode";

const operators = {
  add: {
    checkArgs(operands) {
      return operands.length >= 2 &&
        operands.every((operand) => operand instanceof NumberNode);
    },
    method(operands) {
      return new NumberNode(
        operands.reduce((acc, operand) => acc + operand.value, 0));
    },
  },

  sub: {
    checkArgs(operands) {
      return operands.length === 2 &&
        operands.every((operand) => operand instanceof NumberNode);
    },
    method(operands) {
      return new NumberNode(operands[0].value - operands[1].value);
    },
  },

  mul: {
    checkArgs(operands) {
      return operands.length >= 2 &&
        operands.every((operand) => operand instanceof NumberNode);
    },
    method(operands) {
      return new NumberNode(
        operands.reduce((acc, operand) => acc * operand.value, 1));
    },
  },

  div: {
    checkArgs(operands) {
      return operands.length === 2 &&
        operands.every((operand) => operand instanceof NumberNode);
    },
    method(operands) {
      return new NumberNode(operands[0].value / operands[1].value);
    },
  },

  mod: {
    checkArgs(operands) {
      return operands.length === 2 &&
        operands.every((operand) => operand instanceof NumberNode);
    },
    method(operands) {
      return new NumberNode(operands[0].value % operands[1].value);
    },
  },

  pow: {
    checkArgs(operands) {
      return operands.length === 2 &&
        operands.every((operand) => operand instanceof NumberNode);
    },
    method(operands) {
      // eslint-disable-next-line no-restricted-properties
      return new NumberNode(Math.pow(operands[0].value, operands[1].value));
    },
  },

  list: {
    checkArgs(operands) {
      return operands.length > 0;
    },
    method(operands) {
      return new ListNode(operands);
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

  eq: {
    checkArgs(operands) {
      return operands.length === 2 &&
        operands.every((operand) => operand instanceof NumberNode);
    },
    method(operands) {
      return operands[0].value === operands[1].value ?
        new NumberNode(0) : new NumberNode(1);
    },
  },

  lt: {
    checkArgs(operands) {
      return operands.length === 2 &&
        operands.every((operand) => operand instanceof NumberNode);
    },
    method(operands) {
      return operands[0].value < operands[1].value ?
        new NumberNode(0) : new NumberNode(1);
    },
  },

  gt: {
    checkArgs(operands) {
      return operands.length === 2 &&
        operands.every((operand) => operand instanceof NumberNode);
    },
    method(operands) {
      return operands[0].value > operands[1].value ?
        new NumberNode(0) : new NumberNode(1);
    },
  },

  length: {
    checkArgs(operands) {
      return operands.length === 1 && operands[0] instanceof ListNode;
    },
    method(operands) {
      return new NumberNode(operands[0].elements.length);
    },
  },

  nth: {
    checkArgs(operands) {
      return operands.length === 2 &&
        operands[0] instanceof ListNode &&
        operands[1] instanceof NumberNode;
    },
    method(operands) {
      const index = operands[1].value - 1;
      return operands[0].elements[index];
    },
  },

  slice: {
    checkArgs(operands) {
      return operands.length === 3 &&
        operands[0] instanceof ListNode &&
        operands[1] instanceof NumberNode &&
        operands[2] instanceof NumberNode;
    },
    method(operands) {
      const { elements } = operands[0];
      const begin = operands[1].value;
      const end = operands[2].value;
      const sliced = elements.slice(begin, end);
      return new ListNode(sliced);
    },
  },

  concat: {
    checkArgs(operands) {
      return operands.length === 2 &&
        operands[0] instanceof ListNode &&
        operands[1] instanceof ListNode;
    },
    method(operands) {
      return new ListNode(operands[0].elements.concat(operands[1].elements));
    },
  },

  print: {
    checkArgs(operands) {
      return operands.length === 1;
    },
    method(operands) {
      console.log(operands[0].toString()); /* tslint:disable-line:no-console */
      return operands[0];
    },
  },
};

export default operators;