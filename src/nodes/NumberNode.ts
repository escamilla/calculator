import Node from "./Node";

class NumberNode extends Node {
  public constructor(public readonly value: number) {
    super();
  }

  public toString(): string {
    return `${this.value}`;
  }
}

export default NumberNode;
