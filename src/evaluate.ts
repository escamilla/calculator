import Environment from "./Environment";
import IOHandler from "./IOHandler";
import SquirrelBoolean from "./types/SquirrelBoolean";
import SquirrelFunction from "./types/SquirrelFunction";
import SquirrelList from "./types/SquirrelList";
import SquirrelSymbol from "./types/SquirrelSymbol";
import SquirrelType from "./types/SquirrelType";

function evaluate(ast: SquirrelType, env: Environment, ioHandler: IOHandler): SquirrelType {
  if (ast instanceof SquirrelSymbol) {
    return env.get(ast.name);
  }

  if (ast instanceof SquirrelList) {
    if (ast.items.length === 0) {
      return ast;
    }

    const head: SquirrelType = ast.items[0];
    if (head instanceof SquirrelSymbol) {
      if (head.name === "if") {
        const condition: SquirrelType = ast.items[1];
        const result: SquirrelType = evaluate(condition, env, ioHandler);
        if (result instanceof SquirrelBoolean) {
          if (result.value) {
            return evaluate(ast.items[2], env, ioHandler);
          } else {
            return evaluate(ast.items[3], env, ioHandler);
          }
        } else {
          throw new Error("test condition in if expression must evaluate to a boolean value");
        }
      } else if (head.name === "lambda") {
        const binds: SquirrelList = ast.items[1] as SquirrelList;
        const functionParams: SquirrelSymbol[] = binds.items.map((item: SquirrelType) => {
          if (!(item instanceof SquirrelSymbol)) {
            throw new Error("expected list of symbols for function parameters");
          }
          return item as SquirrelSymbol;
        });
        const functionBody: SquirrelType = ast.items[2];

        const newFunction: SquirrelFunction = new SquirrelFunction((functionArgs: SquirrelType[]): SquirrelType => {
          return evaluate(functionBody, new Environment(env, functionParams, functionArgs), ioHandler);
        });

        newFunction.isUserDefined = true;
        newFunction.params = functionParams;
        newFunction.body = functionBody;

        return newFunction;
      } else if (head.name === "def") {
        const key: string = (ast.items[1] as SquirrelSymbol).name;
        const value: SquirrelType = evaluate(ast.items[2], env, ioHandler);
        env.set(key, value);
        return value;
      } else if (head.name === "quote") {
        return ast.items[1];
      }
    }

    const evaluatedList: SquirrelList = new SquirrelList(ast.items.map(
      (item: SquirrelType) => evaluate(item, env, ioHandler)));
    const fn: SquirrelFunction = evaluatedList.items[0] as SquirrelFunction;
    const args: SquirrelType[] = evaluatedList.items.slice(1);
    return fn.callable(args, ioHandler);
  }

  return ast;
}

export default evaluate;
