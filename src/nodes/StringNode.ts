import INode from "./INode";

class StringNode implements INode {
  public constructor(public readonly value: string) { }

  public toString(): string {
    return `"${this.value}"`;
  }
}

export default StringNode;
