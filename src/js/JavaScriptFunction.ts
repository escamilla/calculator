import JavaScriptNode from "./JavaScriptNode";

class JavaScriptFunction {
  public constructor(
    public readonly line: number,
    public readonly column: number,
    public readonly params: string[],
    public readonly body: JavaScriptNode,
  ) {}
}

export default JavaScriptFunction;
