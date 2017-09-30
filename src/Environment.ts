import INode from "./nodes/INode";

class Environment {
  private scope: Map<string, INode> = new Map();

  constructor(public readonly parent: Environment = null) { }

  public get(key: string): INode {
    if (this.scope.has(key)) {
      return this.scope.get(key);
    } else if (this.parent !== null) {
      return this.parent.get(key);
    }
    return null;
  }

  public set(key: string, value: INode): void {
    this.scope.set(key, value);
  }
}

export default Environment;
