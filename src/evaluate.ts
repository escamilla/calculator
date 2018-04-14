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
      if (head.name === "def") {
        const arg1: ChipmunkNode = ast.items[1];
        if (arg1.type !== ChipmunkNodeType.SYMBOL) {
          const expectedType: string = ChipmunkNodeType[ChipmunkNodeType.SYMBOL];
          const actualType: string = ChipmunkNodeType[arg1.type];
          throw new Error(`expected first argument to '${head.name}' to be of type ` +
            `${expectedType} but got type ${actualType}`);
        }
        const key: string = arg1.name;
        const value: ChipmunkNode = evaluate(ast.items[2], env, ioHandler);
        env.set(key, value);
        return value;
      } else if (head.name === "if") {
        const condition: ChipmunkNode = ast.items[1];
        const result: ChipmunkNode = evaluate(condition, env, ioHandler);

        if (result.type !== ChipmunkNodeType.BOOLEAN) {
          const expectedType: string = ChipmunkNodeType[ChipmunkNodeType.BOOLEAN];
          const actualType: string = ChipmunkNodeType[result.type];
          throw new Error(`expected first argument to '${head.name}' to be of type ` +
            `${expectedType} but got type ${actualType}`);
        }

        if (result.value) {
          return evaluate(ast.items[2], env, ioHandler);
        } else {
          return evaluate(ast.items[3], env, ioHandler);
        }
      } else if (head.name === "lambda") {
        const arg1: ChipmunkNode = ast.items[1];
        if (arg1.type !== ChipmunkNodeType.LIST) {
          const expectedType: string = ChipmunkNodeType[ChipmunkNodeType.LIST];
          const actualType: string = ChipmunkNodeType[arg1.type];
          throw new Error(`expected first argument to '${head.name}' to be of type ` +
            `${expectedType} but got type ${actualType}`);
        }

        const functionParams: ChipmunkSymbol[] = arg1.items.map((item: ChipmunkNode) => {
          if (item.type !== ChipmunkNodeType.SYMBOL) {
            const expectedType: string = ChipmunkNodeType[ChipmunkNodeType.SYMBOL];
            const actualType: string = ChipmunkNodeType[item.type];
            throw new Error(`expected first argument to '${head.name}' to be list containing ` +
              `items of type ${expectedType} but got type ${actualType}`);
          }
          return item;
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
      } else if (head.name === "quote") {
        return ast.items[1];
      } else if (head.name === "set") {
        const arg1: ChipmunkNode = ast.items[1];
        if (arg1.type !== ChipmunkNodeType.SYMBOL) {
          const expectedType: string = ChipmunkNodeType[ChipmunkNodeType.SYMBOL];
          const actualType: string = ChipmunkNodeType[arg1.type];
          throw new Error(`expected first argument to '${head.name}' to be of type ` +
            `${expectedType} but got type ${actualType}`);
        }
        const key: string = arg1.name;
        const envToUpdate: Environment = env.find(key);
        const value: ChipmunkNode = evaluate(ast.items[2], env, ioHandler);
        envToUpdate.set(key, value);
        return value;
      }
    }

    const evaluatedList: ChipmunkList = {
      type: ChipmunkNodeType.LIST,
      items: ast.items.map((item: ChipmunkNode) => evaluate(item, env, ioHandler)),
    };

    const item0: ChipmunkNode = evaluatedList.items[0];
    if (item0.type !== ChipmunkNodeType.FUNCTION) {
      const actualType: string = ChipmunkNodeType[item0.type];
      throw new Error("expected first item of list to be of type FUNCTION but got type " +
        actualType);
    }

    const fn: ChipmunkFunction = item0;
    const args: ChipmunkNode[] = evaluatedList.items.slice(1);
    return fn.callable(args, ioHandler);
  }

  return ast;
}

export default evaluate;
