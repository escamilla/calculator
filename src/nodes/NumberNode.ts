import INode from "./INode";

class NumberNode implements INode {
  constructor(public readonly value: number) { }

  public toString(): string {
    return `${this.value}`;
  }
}

export default NumberNode;
