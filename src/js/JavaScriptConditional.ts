import JavaScriptNode from "./JavaScriptNode";

class JavaScriptConditional {
  public constructor(
    public readonly line: number,
    public readonly column: number,
    public readonly condition: JavaScriptNode,
    public readonly outcomeIfTrue: JavaScriptNode,
    public readonly outcomeIfFalse: JavaScriptNode,
  ) {}
}

export default JavaScriptConditional;
