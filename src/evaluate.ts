import Environment from "./Environment";
import IOHandler from "./io/IOHandler";
import ChipmunkFunction from "./nodes/ChipmunkFunction";
import ChipmunkList from "./nodes/ChipmunkList";
import ChipmunkNode from "./nodes/ChipmunkNode";
import ChipmunkNodeType from "./nodes/ChipmunkNodeType";
import ChipmunkSymbol from "./nodes/ChipmunkSymbol";

function evaluate(ast: ChipmunkNode, env: Environment, ioHandler: IOHandler): ChipmunkNode {
  if (ast.type === ChipmunkNodeType.SYMBOL) {
    return env.get(ast.name);
  }

  if (ast.type === ChipmunkNodeType.LIST) {
    if (ast.items.length === 0) {
      return ast;
    }

    const head: ChipmunkNode = ast.items[0];
    if (head.type === ChipmunkNodeType.SYMBOL) {
      if (head.name === "if") {
        const condition: ChipmunkNode = ast.items[1];
        const result: ChipmunkNode = evaluate(condition, env, ioHandler);
        if (result.type === ChipmunkNodeType.BOOLEAN) {
          if (result.value) {
            return evaluate(ast.items[2], env, ioHandler);
          } else {
            return evaluate(ast.items[3], env, ioHandler);
          }
        } else {
          throw new Error("test condition in if expression must evaluate to a boolean value");
        }
      } else if (head.name === "lambda") {
        const binds: ChipmunkList = ast.items[1] as ChipmunkList;
        const functionParams: ChipmunkSymbol[] = binds.items.map((item: ChipmunkNode) => {
          if (item.type !== ChipmunkNodeType.SYMBOL) {
            throw new Error("expected list of symbols for function parameters");
          }
          return item as ChipmunkSymbol;
        });
        const functionBody: ChipmunkNode = ast.items[2];

        const newFunction: ChipmunkFunction = {
          type: ChipmunkNodeType.FUNCTION,
          callable: (functionArgs: ChipmunkNode[]): ChipmunkNode => {
            return evaluate(functionBody, new Environment(env, functionParams, functionArgs), ioHandler);
          },
          isUserDefined: true,
          params: functionParams,
          body: functionBody,
        };

        return newFunction;
      } else if (head.name === "def") {
        const key: string = (ast.items[1] as ChipmunkSymbol).name;
        const value: ChipmunkNode = evaluate(ast.items[2], env, ioHandler);
        env.set(key, value);
        return value;
      } else if (head.name === "quote") {
        return ast.items[1];
      }
    }

    const evaluatedList: ChipmunkList = {
      type: ChipmunkNodeType.LIST,
      items: ast.items.map((item: ChipmunkNode) => evaluate(item, env, ioHandler)),
    };
    const fn: ChipmunkFunction = evaluatedList.items[0] as ChipmunkFunction;
    const args: ChipmunkNode[] = evaluatedList.items.slice(1);
    return fn.callable(args, ioHandler);
  }

  return ast;
}

export default evaluate;
