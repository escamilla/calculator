class NumberNode {
  constructor(public readonly value: number) { }

  public toString(): string {
    return `${this.value}`;
  }
}

export default NumberNode;
