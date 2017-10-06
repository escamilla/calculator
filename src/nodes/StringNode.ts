import Node from "./Node";

class StringNode extends Node {
  public constructor(public readonly value: string) {
    super();
  }

  public toString(): string {
    return `"${this.value}"`;
  }
}

export default StringNode;
