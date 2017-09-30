/* tslint:disable:object-literal-sort-keys */

import ListNode from "./nodes/ListNode";
import NumberNode from "./nodes/NumberNode";

const operators: any = {
  add: {
    checkArgs(operands: any[]): boolean {
      return operands.length >= 2 &&
        operands.every((operand) => operand instanceof NumberNode);
    },
    method(operands: any[]): NumberNode {
      return new NumberNode(
        operands.reduce((acc, operand) => acc + operand.value, 0));
    },
  },

  sub: {
    checkArgs(operands: any[]): boolean {
      return operands.length === 2 &&
        operands.every((operand) => operand instanceof NumberNode);
    },
    method(operands: any[]): NumberNode {
      return new NumberNode(operands[0].value - operands[1].value);
    },
  },

  mul: {
    checkArgs(operands: any[]): boolean {
      return operands.length >= 2 &&
        operands.every((operand) => operand instanceof NumberNode);
    },
    method(operands: any[]): NumberNode {
      return new NumberNode(
        operands.reduce((acc, operand) => acc * operand.value, 1));
    },
  },

  div: {
    checkArgs(operands: any[]): boolean {
      return operands.length === 2 &&
        operands.every((operand) => operand instanceof NumberNode);
    },
    method(operands: any[]): NumberNode {
      return new NumberNode(operands[0].value / operands[1].value);
    },
  },

  mod: {
    checkArgs(operands: any[]): boolean {
      return operands.length === 2 &&
        operands.every((operand) => operand instanceof NumberNode);
    },
    method(operands: any[]): NumberNode {
      return new NumberNode(operands[0].value % operands[1].value);
    },
  },

  pow: {
    checkArgs(operands: any[]): boolean {
      return operands.length === 2 &&
        operands.every((operand) => operand instanceof NumberNode);
    },
    method(operands: any[]): NumberNode {
      return new NumberNode(Math.pow(operands[0].value, operands[1].value));
    },
  },

  list: {
    checkArgs(operands: any[]): boolean {
      return operands.length > 0;
    },
    method(operands: any[]): ListNode {
      return new ListNode(operands);
    },
  },

  sequence: {
    checkArgs(operands: any[]): boolean {
      return operands.length >= 1;
    },
    method(operands: any[]): any {
      return operands[operands.length - 1];
    },
  },

  eq: {
    checkArgs(operands: any[]): boolean {
      return operands.length === 2 &&
        operands.every((operand) => operand instanceof NumberNode);
    },
    method(operands: any[]): NumberNode {
      return operands[0].value === operands[1].value ?
        new NumberNode(0) : new NumberNode(1);
    },
  },

  lt: {
    checkArgs(operands: any[]): boolean {
      return operands.length === 2 &&
        operands.every((operand) => operand instanceof NumberNode);
    },
    method(operands: any[]): NumberNode {
      return operands[0].value < operands[1].value ?
        new NumberNode(0) : new NumberNode(1);
    },
  },

  gt: {
    checkArgs(operands: any[]): boolean {
      return operands.length === 2 &&
        operands.every((operand) => operand instanceof NumberNode);
    },
    method(operands: any[]): NumberNode {
      return operands[0].value > operands[1].value ?
        new NumberNode(0) : new NumberNode(1);
    },
  },

  length: {
    checkArgs(operands: any[]): boolean {
      return operands.length === 1 && operands[0] instanceof ListNode;
    },
    method(operands: any[]): NumberNode {
      return new NumberNode(operands[0].elements.length);
    },
  },

  nth: {
    checkArgs(operands: any[]): boolean {
      return operands.length === 2 &&
        operands[0] instanceof ListNode &&
        operands[1] instanceof NumberNode;
    },
    method(operands: any[]): any {
      const index = operands[1].value - 1;
      return operands[0].elements[index];
    },
  },

  slice: {
    checkArgs(operands: any[]): boolean {
      return operands.length === 3 &&
        operands[0] instanceof ListNode &&
        operands[1] instanceof NumberNode &&
        operands[2] instanceof NumberNode;
    },
    method(operands: any[]): ListNode {
      const { elements } = operands[0];
      const begin = operands[1].value;
      const end = operands[2].value;
      const sliced = elements.slice(begin, end);
      return new ListNode(sliced);
    },
  },

  concat: {
    checkArgs(operands: any[]): boolean {
      return operands.length === 2 &&
        operands[0] instanceof ListNode &&
        operands[1] instanceof ListNode;
    },
    method(operands: any[]): ListNode {
      return new ListNode(operands[0].elements.concat(operands[1].elements));
    },
  },

  print: {
    checkArgs(operands: any[]): boolean {
      return operands.length === 1;
    },
    method(operands: any[]): any {
      console.log(operands[0].toString()); /* tslint:disable-line:no-console */
      return operands[0];
    },
  },
};

export default operators;
