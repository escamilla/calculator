import JavaScriptNode from "./JavaScriptNode";

class JavaScriptFunctionCall {
  public constructor(public readonly functionName: string, public readonly args: JavaScriptNode[]) {}
}

export default JavaScriptFunctionCall;
