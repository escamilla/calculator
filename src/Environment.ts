import SquirrelNode from "./nodes/SquirrelNode";
import SquirrelSymbol from "./nodes/SquirrelSymbol";

class Environment {
  private data: Map<string, SquirrelNode> = new Map();

  public constructor(public readonly outerEnv?: Environment,
                     bindSymbols: SquirrelSymbol[] = [],
                     bindExpressions: SquirrelNode[] = []) {
    for (let i: number = 0; i < bindSymbols.length; i++) {
      this.set(bindSymbols[i].name, bindExpressions[i]);
    }
  }

  public set(key: string, value: SquirrelNode): void {
    this.data.set(key, value);
  }

  public get(key: string): SquirrelNode {
    if (this.data.has(key)) {
      return this.data.get(key) as SquirrelNode;
    } else if (this.outerEnv) {
      return this.outerEnv.get(key);
    }
    throw new Error(`symbol not bound: ${key}`);
  }
}

export default Environment;
