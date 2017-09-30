class SymbolNode {
  constructor(public value: string) { }

  public toString(): string {
    return `${this.value}`;
  }
}

export default SymbolNode;
