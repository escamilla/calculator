import ListNode from "./ListNode";
import Node from "./Node";

class LambdaNode extends Node {
  public constructor(public readonly parameters: ListNode, public readonly body: Node) {
    super();
  }

  public toString(): string {
    return `(lambda ${this.parameters.toString()} ${this.body.toString()})`;
  }
}

export default LambdaNode;
