class ListNode {
  constructor(public elements) {
    this.elements = elements;
  }

  public toString() {
    return `(${this.elements.map((element) => element.toString()).join(" ")})`;
  }
}

export default ListNode;
