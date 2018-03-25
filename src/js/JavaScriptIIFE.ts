import JavaScriptNode from "./JavaScriptNode";

// immediately-invoked function expression
class JavaScriptIIFE {
  public constructor(
    public readonly line: number,
    public readonly column: number,
    public nodes: JavaScriptNode[],
  ) {}
}

export default JavaScriptIIFE;
