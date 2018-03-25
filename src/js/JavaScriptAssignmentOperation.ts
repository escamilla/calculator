import JavaScriptNode from "./JavaScriptNode";

class JavaScriptAssignmentOperation {
  public constructor(
    public readonly line: number,
    public readonly column: number,
    public readonly name: string,
    public readonly value: JavaScriptNode,
  ) {}
}

export default JavaScriptAssignmentOperation;
