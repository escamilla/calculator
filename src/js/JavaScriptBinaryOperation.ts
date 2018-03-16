import JavaScriptNode from "./JavaScriptNode";

class JavaScriptBinaryOperation {
  public constructor(public readonly operator: string,
                     public readonly leftSide: JavaScriptNode,
                     public readonly rightSide: JavaScriptNode) {}
}

export default JavaScriptBinaryOperation;
