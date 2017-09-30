import INode from "./nodes/INode";

class Environment {
  private scope: Map<string, INode> = new Map();

  public constructor(public readonly parent?: Environment) { }

  public get(key: string): INode | null {
    if (this.scope.has(key)) {
      return this.scope.get(key) as INode;
    } else if (this.parent) {
      return this.parent.get(key);
    }
    return null;
  }

  public set(key: string, value: INode): void {
    this.scope.set(key, value);
  }
}

export default Environment;
