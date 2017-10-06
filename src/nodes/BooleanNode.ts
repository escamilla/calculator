import Node from "./Node";

class BooleanNode extends Node {
  public constructor(public readonly value: boolean) {
    super();
  }

  public toString(): string {
    return this.value ? "true" : "false";
  }
}

export default BooleanNode;
