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

  public find(key: string): Environment {
    if (this.data.has(key)) {
      return this;
    } else if (this.outerEnv) {
      return this.outerEnv.find(key);
    }
    throw new Error(`symbol not found: ${key}`);
  }

  public set(key: string, value: ChipmunkNode): void {
    this.data.set(key, value);
  }

  public get(key: string): ChipmunkNode {
    return this.find(key).data.get(key) as ChipmunkNode;
  }
}

export default Environment;
