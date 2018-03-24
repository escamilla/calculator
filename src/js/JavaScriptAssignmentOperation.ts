import JavaScriptNode from "./JavaScriptNode";

class JavaScriptAssignmentOperation {
  public constructor(public readonly name: string,
                     public readonly value: JavaScriptNode) {}
}

export default JavaScriptAssignmentOperation;
