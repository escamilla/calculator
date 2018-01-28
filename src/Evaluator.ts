import SquirrelBoolean from "./types/SquirrelBoolean";
import SquirrelFunction from "./types/SquirrelFunction";
import SquirrelList from "./types/SquirrelList";
import SquirrelNumber from "./types/SquirrelNumber";
import SquirrelString from "./types/SquirrelString";
import SquirrelSymbol from "./types/SquirrelSymbol";
import SquirrelType from "./types/SquirrelType";

import Environment from "./Environment";

import namespace from "./core";

const specialForms: string[] = ["if", "lambda", "let", "quote", "unquote"];

class Evaluator {
  private evaluatorEnv: Environment;

  public constructor(private readonly ast: SquirrelType, parentEnv?: Environment) {
    this.evaluatorEnv = new Environment(parentEnv);

    this.evaluatorEnv.set("true", new SquirrelBoolean(true));
    this.evaluatorEnv.set("false", new SquirrelBoolean(false));

    namespace.forEach((value: SquirrelFunction, key: string) => {
      this.evaluatorEnv.set(key, value);
    });
  }

  public evaluate(): SquirrelType {
    return this.evaluateNode(this.ast, new Environment(this.evaluatorEnv));
  }

  private evaluateNode(node: SquirrelType, env: Environment): SquirrelType {
    if (node instanceof SquirrelNumber ||
        node instanceof SquirrelString ||
        node instanceof SquirrelFunction) {
      return node;
    } else if (node instanceof SquirrelSymbol) {
      return this.evaluateSymbolNode(node, env);
    } else if (node instanceof SquirrelList) {
      return this.evaluateListNode(node, env);
    }
    throw new Error(`unknown node type: ${node.constructor.name}`);
  }

  private evaluateSymbolNode(node: SquirrelSymbol, env: Environment): SquirrelType {
    return env.get(node.name) || node;
  }

  private evaluateListNode(node: SquirrelList, env: Environment): SquirrelType {
    const operator: SquirrelType = this.evaluateNode(node.elements[0], new Environment(env));

    let operands: SquirrelType[];
    if (operator instanceof SquirrelSymbol && specialForms.includes(operator.name)) {
      operands = node.elements.slice(1);
      switch (operator.name) {
        case "if":
          return this.evaluateIfOperation(operator, operands, env);
        case "lambda":
          return this.evaluateLambdaOperation(operator, operands, env);
        case "let":
          return this.evaluateLetOperation(operator, operands, env);
        case "quote":
          return this.evaluateQuoteOperation(operator, operands);
      }
    }

    operands = node.elements.slice(1).map((el: SquirrelType) => this.evaluateNode(el, new Environment(env)));

    if (operator instanceof SquirrelFunction) {
      return operator.callable(operands);
    }

    throw new Error("first item of symbolic expression must be a symbol or lambda function");
  }

  private evaluateIfOperation(operator: SquirrelSymbol, operands: SquirrelType[], env: Environment): SquirrelType {
    const condition: SquirrelType = this.evaluateNode(operands[0], env);
    if (!(condition instanceof SquirrelBoolean)) {
      throw new Error("test condition in if expression must evaluate to a boolean value");
    }
    const outcome: SquirrelType = condition.value ? operands[1] : operands[2];
    return this.evaluateNode(outcome, env);
  }

  private evaluateLambdaOperation(operator: SquirrelSymbol, operands: SquirrelType[], env: Environment): SquirrelType {
    if (operands.length !== 2) {
      throw new Error("lambda operator takes exactly two arguments");
    }

    if (!(operands[0] instanceof SquirrelList && operands[1] instanceof SquirrelList)) {
      throw new Error("both arguments to lambda operator must be lists");
    }

    const binds: SquirrelList = operands[0] as SquirrelList;
    const functionParams: SquirrelSymbol[] = binds.elements.map((item: SquirrelType) => {
      if (!(item instanceof SquirrelSymbol)) {
        throw new Error("expected list of symbols for function parameters");
      }
      return item as SquirrelSymbol;
    });
    const functionBody: SquirrelType = operands[1];

    const newFunction: SquirrelFunction = new SquirrelFunction((functionArgs: SquirrelType[]): SquirrelType => {
      return this.evaluateNode(functionBody, new Environment(env, functionParams, functionArgs));
    });

    newFunction.isUserDefined = true;
    newFunction.env = env;
    newFunction.params = functionParams;
    newFunction.body = functionBody;
    return newFunction;
  }

  private evaluateLetOperation(operator: SquirrelSymbol, operands: SquirrelType[], env: Environment): SquirrelType {
    if (operands.length !== 2) {
      throw new Error("let operator takes exactly two arguments");
    }

    if (!(operands[0] instanceof SquirrelSymbol)) {
      throw new Error("first argument to let operator must be a symbol");
    }

    const key: string = (operands[0] as SquirrelSymbol).name;
    const value: SquirrelType = this.evaluateNode(operands[1], env);

    if (env.parent) {
      env.parent.set(key, value);
    }
    return value;
  }

  private evaluateQuoteOperation(operator: SquirrelSymbol, operands: SquirrelType[]): SquirrelType {
    if (operands.length !== 1) {
      throw new Error("quote operator takes exactly one argument");
    }
    return operands[0];
  }
}

export default Evaluator;
