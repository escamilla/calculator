import JavaScriptNode from "./JavaScriptNode";

class JavaScriptConditional {
  public constructor(public readonly condition: JavaScriptNode,
                     public readonly outcomeIfTrue: JavaScriptNode,
                     public readonly outcomeIfFalse: JavaScriptNode) {}
}

export default JavaScriptConditional;
