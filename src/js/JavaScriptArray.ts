import JavaScriptNode from "./JavaScriptNode";

class JavaScriptArray {
  public constructor(
    public readonly line: number,
    public readonly column: number,
    public readonly items: JavaScriptNode[],
  ) {}
}

export default JavaScriptArray;
