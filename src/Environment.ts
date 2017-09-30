class Environment {
  private scope: Map<string, any>;

  constructor(public readonly parent: Environment = null) {
    this.scope = new Map();
  }

  public get(key: string): any {
    if (this.scope.has(key)) {
      return this.scope.get(key);
    } else if (this.parent !== null) {
      return this.parent.get(key);
    }
    return null;
  }

  public set(key: string, value: any): void {
    this.scope.set(key, value);
  }
}

export default Environment;
