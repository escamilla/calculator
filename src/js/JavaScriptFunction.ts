import JavaScriptNode from "./JavaScriptNode";

class JavaScriptFunction {
  public constructor(public readonly params: string[], public readonly body: JavaScriptNode) {}
}

export default JavaScriptFunction;
