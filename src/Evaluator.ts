import BooleanNode from "./nodes/BooleanNode";
import LambdaNode from "./nodes/LambdaNode";
import ListNode from "./nodes/ListNode";
import Node from "./nodes/Node";
import NumberNode from "./nodes/NumberNode";
import StringNode from "./nodes/StringNode";
import SymbolNode from "./nodes/SymbolNode";

import Environment from "./Environment";

import CoreFunction from "./functions/CoreFunction";
import coreFunctions from "./functions/coreFunctions";

const specialForms: string[] = ["if", "lambda", "let", "quote", "unquote"];

class Evaluator {
  private evaluatorEnv: Environment;

  public constructor(private readonly ast: Node, parentEnv?: Environment) {
    this.evaluatorEnv = new Environment(parentEnv);
    this.evaluatorEnv.set("true", new BooleanNode(true));
    this.evaluatorEnv.set("false", new BooleanNode(false));
  }

  public evaluate(): Node {
    return this.evaluateNode(this.ast, new Environment(this.evaluatorEnv));
  }

  private evaluateNode(node: Node, env: Environment): Node {
    if (node instanceof NumberNode ||
        node instanceof StringNode ||
        node instanceof LambdaNode) {
      return node;
    } else if (node instanceof SymbolNode) {
      return this.evaluateSymbolNode(node, env);
    } else if (node instanceof ListNode) {
      return this.evaluateListNode(node, env);
    }
    throw new Error(`unknown node type: ${node.constructor.name}`);
  }

  private evaluateSymbolNode(node: SymbolNode, env: Environment): Node {
    return env.get(node.value) || node;
  }

  private evaluateListNode(node: ListNode, env: Environment): Node {
    const operator: Node = this.evaluateNode(node.elements[0], new Environment(env));

    let operands: Node[];
    if (operator instanceof SymbolNode && specialForms.includes(operator.value)) {
      operands = node.elements.slice(1);
      switch (operator.value) {
        case "if":
          return this.evaluateIfOperation(operator, operands, env);
        case "lambda":
          return this.evaluateLambdaOperation(operator, operands);
        case "let":
          return this.evaluateLetOperation(operator, operands, env);
        case "quote":
          return this.evaluateQuoteOperation(operator, operands);
        case "unquote":
          return this.evaluateUnquoteOperation(operator, operands, env);
      }
    }

    operands = node.elements.slice(1).map((el: Node) => this.evaluateNode(el, new Environment(env)));

    if (operator instanceof SymbolNode) {
      return this.evaluateOperation(operator, operands, env);
    } else if (operator instanceof LambdaNode) {
      return this.evaluateLambdaFunction(operator, operands, env);
    }

    throw new Error("first item of symbolic expression must be a symbol or lambda function");
  }

  private evaluateIfOperation(operator: SymbolNode, operands: Node[], env: Environment): Node {
    const condition: Node = this.evaluateNode(operands[0], env);
    if (!(condition instanceof BooleanNode)) {
      throw new Error("test condition in if expression must evaluate to a boolean value");
    }
    const outcome: Node = condition.value ? operands[1] : operands[2];
    return this.evaluateNode(outcome, env);
  }

  private evaluateLambdaOperation(operator: SymbolNode, operands: Node[]): Node {
    if (operands.length !== 2) {
      throw new Error("lambda operator takes exactly two arguments");
    }

    if (!(operands[0] instanceof ListNode && operands[1] instanceof ListNode)) {
      throw new Error("both arguments to lambda operator must be lists");
    }

    const parameters: ListNode = operands[0] as ListNode;
    const body: Node = operands[1];
    return new LambdaNode(parameters, body);
  }

  private evaluateLetOperation(operator: SymbolNode, operands: Node[], env: Environment): Node {
    if (operands.length !== 2) {
      throw new Error("let operator takes exactly two arguments");
    }

    if (!(operands[0] instanceof SymbolNode)) {
      throw new Error("first argument to let operator must be a symbol");
    }

    const key: string = (operands[0] as SymbolNode).value;
    const value: Node = this.evaluateNode(operands[1], env);

    if (env.parent) {
      env.parent.set(key, value);
    }
    return value;
  }

  private evaluateQuoteOperation(operator: SymbolNode, operands: Node[]): Node {
    if (operands.length !== 1) {
      throw new Error("quote operator takes exactly one argument");
    }
    return operands[0];
  }

  private evaluateUnquoteOperation(operator: SymbolNode, operands: Node[], env: Environment): Node {
    if (operands.length !== 1) {
      throw new Error("unquote operator takes exactly one argument");
    }
    return this.evaluateNode(operands[0], env);
  }

  private evaluateOperation(operator: SymbolNode, operands: Node[], env: Environment): Node {
    if (coreFunctions.has(operator.value)) {
      const coreFunction: CoreFunction = coreFunctions.get(operator.value) as CoreFunction;
      return coreFunction.apply(null, operands);
    }

    throw new Error(`invalid arguments for operator: ${operator.value}`);
  }

  private evaluateLambdaFunction(operator: LambdaNode, operands: Node[], env: Environment): Node {
    const parameters: Node[] = operator.parameters.elements;
    const body: Node = operator.body;

    const expected: number = parameters.length;
    const actual: number = operands.length;
    if (expected !== actual) {
      throw new Error(`lambda function takes ${expected} arguments but got ${actual}`);
    }

    const lambdaEnv: Environment = new Environment(env);
    for (let i: number = 0; i < expected; i += 1) {
      const key: string = (parameters[i] as SymbolNode).value;
      const value: Node = operands[i];
      lambdaEnv.set(key, value);
    }

    return this.evaluateNode(body, lambdaEnv);
  }
}

export default Evaluator;
