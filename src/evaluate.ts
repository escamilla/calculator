// tslint:disable:prefer-switch

import Environment from "./Environment";

import SquirrelBoolean from "./types/SquirrelBoolean";
import SquirrelFunction from "./types/SquirrelFunction";
import SquirrelList from "./types/SquirrelList";
import SquirrelSymbol from "./types/SquirrelSymbol";
import SquirrelType from "./types/SquirrelType";

function evaluate(input: SquirrelType, env: Environment): SquirrelType {
  if (!(input instanceof SquirrelList)) {
    return _evaluate(input, env);
  }

  if (input.elements.length === 0) {
    return input;
  }

  const head: SquirrelType = input.elements[0];
  if (head instanceof SquirrelSymbol) {
    if (head.name === "eval") {
      const expr: SquirrelType = evaluate(input.elements[1], env);
      return evaluate(expr, env);
    } else if (head.name === "if") {
      const condition: SquirrelType = input.elements[1];
      const result: SquirrelType = evaluate(condition, env);
      if (result instanceof SquirrelBoolean) {
        if (result.value) {
          return evaluate(input.elements[2], env);
        } else {
          return evaluate(input.elements[3], env);
        }
      } else {
        throw new Error("test condition in if expression must evaluate to a boolean value");
      }
    } else if (head.name === "lambda") {
      const binds: SquirrelList = input.elements[1] as SquirrelList;
      const functionParams: SquirrelSymbol[] = binds.elements.map((item: SquirrelType) => {
        if (!(item instanceof SquirrelSymbol)) {
          throw new Error("expected list of symbols for function parameters");
        }
        return item as SquirrelSymbol;
      });
      const functionBody: SquirrelType = input.elements[2];

      const newFunction: SquirrelFunction = new SquirrelFunction((functionArgs: SquirrelType[]): SquirrelType => {
        return evaluate(functionBody, new Environment(env, functionParams, functionArgs));
      });

      newFunction.isUserDefined = true;
      newFunction.params = functionParams;
      newFunction.body = functionBody;

      return newFunction;
    } else if (head.name === "let") {
      const key: string = (input.elements[1] as SquirrelSymbol).name;
      const value: SquirrelType = evaluate(input.elements[2], env);
      env.set(key, value);
      return value;
    } else if (head.name === "quote") {
      return input.elements[1];
    }
  }

  const evaluatedList: SquirrelList = _evaluate(input, env) as SquirrelList;
  const fn: SquirrelFunction = evaluatedList.elements[0] as SquirrelFunction;
  const args: SquirrelType[] = evaluatedList.elements.slice(1);
  return fn.callable(args);
}

function _evaluate(ast: SquirrelType, env: Environment): SquirrelType {
  if (ast instanceof SquirrelSymbol) {
    return env.get(ast.name) || ast;
  } else if (ast instanceof SquirrelList) {
    return new SquirrelList(ast.elements.map((item: SquirrelType) => evaluate(item, env)));
  }
  return ast;
}

export default evaluate;
