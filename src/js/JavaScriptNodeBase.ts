import JavaScriptNodeType from "./JavaScriptNodeType.ts";

interface JavaScriptNodeBase {
  type: JavaScriptNodeType;
  line: number;
  column: number;
}

export default JavaScriptNodeBase;
