class ListNode {
  constructor(public readonly elements: any[]) { }

  public toString(): string {
    return `(${this.elements.map((element) => element.toString()).join(" ")})`;
  }
}

export default ListNode;
