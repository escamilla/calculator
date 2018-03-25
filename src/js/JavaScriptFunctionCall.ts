import JavaScriptNode from "./JavaScriptNode";

class JavaScriptFunctionCall {
  public constructor(
    public readonly line: number,
    public readonly column: number,
    public readonly functionName: string,
    public readonly args: JavaScriptNode[],
  ) {}
}

export default JavaScriptFunctionCall;
