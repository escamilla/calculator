import JavaScriptNode from "./JavaScriptNode";

class JavaScriptBinaryOperation {
  public constructor(
    public readonly line: number,
    public readonly column: number,
    public readonly operator: string,
    public readonly leftSide: JavaScriptNode,
    public readonly rightSide: JavaScriptNode,
  ) {}
}

export default JavaScriptBinaryOperation;
