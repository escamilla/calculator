class SymbolNode {
  constructor(public value) {
    this.value = value;
  }

  public toString() {
    return `${this.value}`;
  }
}

export default SymbolNode;
