import Node from "./Node";

class ListNode extends Node {
  public constructor(public readonly elements: Node[]) {
    super();
  }

  public toString(): string {
    return `(${this.elements.map((element: Node) => element.toString()).join(" ")})`;
  }
}

export default ListNode;
