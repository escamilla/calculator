import CoreFunction from "./CoreFunction";

import INode from "../nodes/INode";
import ListNode from "../nodes/ListNode";
import NumberNode from "../nodes/NumberNode";

function add(...args: INode[]): INode {
  const arg0: NumberNode = args[0] as NumberNode;
  const arg1: NumberNode = args[1] as NumberNode;
  return new NumberNode(arg0.value + arg1.value);
}

function sub(...args: INode[]): INode {
  const arg0: NumberNode = args[0] as NumberNode;
  const arg1: NumberNode = args[1] as NumberNode;
  return new NumberNode(arg0.value - arg1.value);
}

function mul(...args: INode[]): INode {
  const arg0: NumberNode = args[0] as NumberNode;
  const arg1: NumberNode = args[1] as NumberNode;
  return new NumberNode(arg0.value * arg1.value);
}

function div(...args: INode[]): INode {
  const arg0: NumberNode = args[0] as NumberNode;
  const arg1: NumberNode = args[1] as NumberNode;
  return new NumberNode(arg0.value / arg1.value);
}

function mod(...args: INode[]): INode {
  const arg0: NumberNode = args[0] as NumberNode;
  const arg1: NumberNode = args[1] as NumberNode;
  return new NumberNode(arg0.value % arg1.value);
}

function pow(...args: INode[]): INode {
  const arg0: NumberNode = args[0] as NumberNode;
  const arg1: NumberNode = args[1] as NumberNode;
  return new NumberNode(Math.pow(arg0.value, arg1.value));
}

function list(...args: INode[]): INode {
  return new ListNode(args);
}

function sequence(...args: INode[]): INode {
  return args[args.length - 1];
}

function eq(...args: INode[]): INode {
  const arg0: NumberNode = args[0] as NumberNode;
  const arg1: NumberNode = args[1] as NumberNode;
  return arg0.value === arg1.value ? new NumberNode(0) : new NumberNode(1);
}

function lt(...args: INode[]): INode {
  const arg0: NumberNode = args[0] as NumberNode;
  const arg1: NumberNode = args[1] as NumberNode;
  return arg0.value < arg1.value ? new NumberNode(0) : new NumberNode(1);
}

function gt(...args: INode[]): INode {
  const arg0: NumberNode = args[0] as NumberNode;
  const arg1: NumberNode = args[1] as NumberNode;
  return arg0.value > arg1.value ? new NumberNode(0) : new NumberNode(1);
}

function length(...args: INode[]): INode {
  const arg0: ListNode = args[0] as ListNode;
  return new NumberNode(arg0.elements.length);
}

function nth(...args: INode[]): INode {
  const arg0: ListNode = args[0] as ListNode;
  const arg1: NumberNode = args[1] as NumberNode;
  return arg0.elements[arg1.value - 1];
}

function slice(...args: INode[]): INode {
  const arg0: ListNode = args[0] as ListNode;
  const arg1: NumberNode = args[1] as NumberNode;
  const arg2: NumberNode = args[2] as NumberNode;
  return new ListNode(arg0.elements.slice(arg1.value, arg2.value));
}

function concat(...args: INode[]): INode {
  const arg0: ListNode = args[0] as ListNode;
  const arg1: ListNode = args[1] as ListNode;
  return new ListNode(arg0.elements.concat(arg1.elements));
}

function print(...args: INode[]): INode {
  console.log(args[0].toString()); // tslint:disable-line:no-console
  return args[0];
}

const coreFunctions: Map<string, CoreFunction> = new Map();
coreFunctions.set("add", add);
coreFunctions.set("sub", sub);
coreFunctions.set("mul", mul);
coreFunctions.set("div", div);
coreFunctions.set("mod", mod);
coreFunctions.set("pow", pow);
coreFunctions.set("list", list);
coreFunctions.set("sequence", sequence);
coreFunctions.set("eq", eq);
coreFunctions.set("gt", gt);
coreFunctions.set("lt", lt);
coreFunctions.set("length", length);
coreFunctions.set("nth", nth);
coreFunctions.set("slice", slice);
coreFunctions.set("concat", concat);
coreFunctions.set("print", print);

export default coreFunctions;
