import SquirrelSymbol from "./types/SquirrelSymbol";
import SquirrelType from "./types/SquirrelType";

class Environment {
  private scope: Map<string, SquirrelType> = new Map();

  public constructor(public readonly parent?: Environment, binds: SquirrelSymbol[] = [], exprs: SquirrelType[] = []) {
    for (let i: number = 0; i < binds.length; i++) {
      if (exprs.length < i) {
        throw new Error("Lengths of binds and exprs lists must be equal");
      }
      this.set(binds[i].name, exprs[i]);
    }
  }

  public get(key: string): SquirrelType | null {
    if (this.scope.has(key)) {
      return this.scope.get(key) as SquirrelType;
    } else if (this.parent) {
      return this.parent.get(key);
    }
    return null;
  }

  public set(key: string, value: SquirrelType): void {
    this.scope.set(key, value);
  }
}

export default Environment;
