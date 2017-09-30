import INode from "./INode";
import ListNode from "./ListNode";

class LambdaNode implements INode {
  constructor(public readonly parameters: ListNode, public readonly body: INode) { }

  public toString(): string {
    return `(lambda ${this.parameters.toString()} ${this.body.toString()})`;
  }
}

export default LambdaNode;
