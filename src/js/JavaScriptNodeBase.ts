import JavaScriptNodeType from "./JavaScriptNodeType";

interface JavaScriptNodeBase {
  type: JavaScriptNodeType;
  line: number;
  column: number;
}

export default JavaScriptNodeBase;
