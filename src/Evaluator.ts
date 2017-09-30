import INode from "./nodes/INode";
import LambdaNode from "./nodes/LambdaNode";
import ListNode from "./nodes/ListNode";
import NumberNode from "./nodes/NumberNode";
import StringNode from "./nodes/StringNode";
import SymbolNode from "./nodes/SymbolNode";

import Environment from "./Environment";
import operators from "./operators";

const specialForms: string[] = ["if", "lambda", "let", "quote", "unquote"];

class Evaluator {
  public constructor(private readonly ast: INode, private readonly globalEnv?: Environment) { }

  public evaluate(): INode {
    return this.evaluateNode(this.ast, new Environment(this.globalEnv));
  }

  private evaluateNode(node: INode, env: Environment): INode {
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

  private evaluateSymbolNode(node: SymbolNode, env: Environment): INode {
    return env.get(node.value) || node;
  }

  private evaluateListNode(node: ListNode, env: Environment): INode {
    const operator: INode = this.evaluateNode(node.elements[0], new Environment(env));

    let operands: INode[];
    if (operator instanceof SymbolNode && specialForms.includes(operator.value)) {
      operands = node.elements.slice(1);
      if (operator.value === "if") {
        return this.evaluateIfOperation(operator, operands, env);
      } else if (operator.value === "lambda") {
        return this.evaluateLambdaOperation(operator, operands);
      } else if (operator.value === "let") {
        return this.evaluateLetOperation(operator, operands, env);
      } else if (operator.value === "quote") {
        return this.evaluateQuoteOperation(operator, operands);
      } else if (operator.value === "unquote") {
        return this.evaluateUnquoteOperation(operator, operands, env);
      }
    }

    operands = node.elements.slice(1).map((el: INode) => this.evaluateNode(el, new Environment(env)));

    if (operator instanceof SymbolNode) {
      return this.evaluateOperation(operator, operands, env);
    } else if (operator instanceof LambdaNode) {
      return this.evaluateLambdaFunction(operator, operands, env);
    }

    throw new Error("first item of symbolic expression must be a symbol or lambda function");
  }

  private evaluateIfOperation(operator: SymbolNode, operands: INode[], env: Environment): INode {
    const condition: INode = this.evaluateNode(operands[0], env);
    if (!(condition instanceof NumberNode)) {
      throw new Error("condition in if expression must evaluate to a number representing a boolean value");
    }
    const outcome: INode = condition.value === 0 ? operands[1] : operands[2];
    return this.evaluateNode(outcome, env);
  }

  private evaluateLambdaOperation(operator: SymbolNode, operands: INode[]): INode {
    if (operands.length !== 2) {
      throw new Error("lambda operator takes exactly two arguments");
    }

    if (!(operands[0] instanceof ListNode && operands[1] instanceof ListNode)) {
      throw new Error("both arguments to lambda operator must be lists");
    }

    const parameters: ListNode = operands[0] as ListNode;
    const body: INode = operands[1];
    return new LambdaNode(parameters, body);
  }

  private evaluateLetOperation(operator: SymbolNode, operands: INode[], env: Environment): INode {
    if (operands.length !== 2) {
      throw new Error("let operator takes exactly two arguments");
    }

    if (!(operands[0] instanceof SymbolNode)) {
      throw new Error("first argument to let operator must be a symbol");
    }

    const key: string = (operands[0] as SymbolNode).value;
    const value: INode = this.evaluateNode(operands[1], env);

    if (env.parent) {
      env.parent.set(key, value);
    }
    return value;
  }

  private evaluateQuoteOperation(operator: SymbolNode, operands: INode[]): INode {
    if (operands.length !== 1) {
      throw new Error("quote operator takes exactly one argument");
    }
    return operands[0];
  }

  private evaluateUnquoteOperation(operator: SymbolNode, operands: INode[], env: Environment): INode {
    if (operands.length !== 1) {
      throw new Error("unquote operator takes exactly one argument");
    }
    return this.evaluateNode(operands[0], env);
  }

  private evaluateOperation(operator: SymbolNode, operands: INode[], env: Environment): INode {
    if (operators[operator.value].checkArgs(operands)) {
      return operators[operator.value].method(operands, env);
    }

    throw new Error(`invalid arguments for operator: ${operator.value}`);
  }

  private evaluateLambdaFunction(operator: LambdaNode, operands: INode[], env: Environment): INode {
    const parameters: INode[] = operator.parameters.elements;
    const body: INode = operator.body;

    const expected: number = parameters.length;
    const actual: number = operands.length;
    if (expected !== actual) {
      throw new Error(`lambda function takes ${expected} arguments but got ${actual}`);
    }

    const lambdaEnv: Environment = new Environment(env);
    for (let i: number = 0; i < expected; i += 1) {
      const key: string = (parameters[i] as SymbolNode).value;
      const value: INode = operands[i];
      lambdaEnv.set(key, value);
    }

    return this.evaluateNode(body, lambdaEnv);
  }
}

export default Evaluator;
