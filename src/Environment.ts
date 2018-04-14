import ChipmunkNode from "./nodes/ChipmunkNode";
import ChipmunkSymbol from "./nodes/ChipmunkSymbol";

class Environment {
  private data: Map<string, ChipmunkNode> = new Map();

  public constructor(public readonly outerEnv?: Environment,
                     bindSymbols: ChipmunkSymbol[] = [],
                     bindExpressions: ChipmunkNode[] = []) {
    for (let i: number = 0; i < bindSymbols.length; i++) {
      this.set(bindSymbols[i].name, bindExpressions[i]);
    }
  }

  public set(key: string, value: ChipmunkNode): void {
    this.data.set(key, value);
  }

  public get(key: string): ChipmunkNode {
    if (this.data.has(key)) {
      return this.data.get(key) as ChipmunkNode;
    } else if (this.outerEnv) {
      return this.outerEnv.get(key);
    }
    throw new Error(`symbol not bound: ${key}`);
  }
}

export default Environment;
