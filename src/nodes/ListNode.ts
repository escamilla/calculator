import INode from "./INode";

class ListNode implements INode {
  constructor(public readonly elements: INode[]) { }

  public toString(): string {
    return `(${this.elements.map((element: INode) => element.toString()).join(" ")})`;
  }
}

export default ListNode;
