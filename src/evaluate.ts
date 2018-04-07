import Environment from "./Environment";
import IOHandler from "./io/IOHandler";
import SquirrelFunction from "./nodes/SquirrelFunction";
import SquirrelList from "./nodes/SquirrelList";
import SquirrelNode from "./nodes/SquirrelNode";
import SquirrelNodeType from "./nodes/SquirrelNodeType";
import SquirrelSymbol from "./nodes/SquirrelSymbol";

function evaluate(ast: SquirrelNode, env: Environment, ioHandler: IOHandler): SquirrelNode {
  if (ast.type === SquirrelNodeType.SYMBOL) {
    return env.get(ast.name);
  }

  if (ast.type === SquirrelNodeType.LIST) {
    if (ast.items.length === 0) {
      return ast;
    }

    const head: SquirrelNode = ast.items[0];
    if (head.type === SquirrelNodeType.SYMBOL) {
      if (head.name === "if") {
        const condition: SquirrelNode = ast.items[1];
        const result: SquirrelNode = evaluate(condition, env, ioHandler);
        if (result.type === SquirrelNodeType.BOOLEAN) {
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
        const functionParams: SquirrelSymbol[] = binds.items.map((item: SquirrelNode) => {
          if (item.type !== SquirrelNodeType.SYMBOL) {
            throw new Error("expected list of symbols for function parameters");
          }
          return item as SquirrelSymbol;
        });
        const functionBody: SquirrelNode = ast.items[2];

        const newFunction: SquirrelFunction = {
          type: SquirrelNodeType.FUNCTION,
          callable: (functionArgs: SquirrelNode[]): SquirrelNode => {
            return evaluate(functionBody, new Environment(env, functionParams, functionArgs), ioHandler);
          },
          isUserDefined: true,
          params: functionParams,
          body: functionBody,
        };

        return newFunction;
      } else if (head.name === "def") {
        const key: string = (ast.items[1] as SquirrelSymbol).name;
        const value: SquirrelNode = evaluate(ast.items[2], env, ioHandler);
        env.set(key, value);
        return value;
      } else if (head.name === "quote") {
        return ast.items[1];
      }
    }

    const evaluatedList: SquirrelList = {
      type: SquirrelNodeType.LIST,
      items: ast.items.map((item: SquirrelNode) => evaluate(item, env, ioHandler)),
    };
    const fn: SquirrelFunction = evaluatedList.items[0] as SquirrelFunction;
    const args: SquirrelNode[] = evaluatedList.items.slice(1);
    return fn.callable(args, ioHandler);
  }

  return ast;
}

export default evaluate;
