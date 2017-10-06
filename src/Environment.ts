import Node from "./nodes/Node";

class Environment {
  private scope: Map<string, Node> = new Map();

  public constructor(public readonly parent?: Environment) { }

  public get(key: string): Node | null {
    if (this.scope.has(key)) {
      return this.scope.get(key) as Node;
    } else if (this.parent) {
      return this.parent.get(key);
    }
    return null;
  }

  public set(key: string, value: Node): void {
    this.scope.set(key, value);
  }
}

export default Environment;
