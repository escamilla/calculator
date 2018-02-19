import SquirrelSymbol from "./types/SquirrelSymbol";
import SquirrelType from "./types/SquirrelType";

class Environment {
  private data: Map<string, SquirrelType> = new Map();

  public constructor(public readonly outerEnv?: Environment,
                     bindSymbols: SquirrelSymbol[] = [],
                     bindExpressions: SquirrelType[] = []) {
    for (let i: number = 0; i < bindSymbols.length; i++) {
      this.set(bindSymbols[i].name, bindExpressions[i]);
    }
  }

  public set(key: string, value: SquirrelType): void {
    this.data.set(key, value);
  }

  public get(key: string): SquirrelType {
    if (this.data.has(key)) {
      return this.data.get(key) as SquirrelType;
    } else if (this.outerEnv) {
      return this.outerEnv.get(key);
    }
    throw new Error(`symbol not bound: ${key}`);
  }
}

export default Environment;
