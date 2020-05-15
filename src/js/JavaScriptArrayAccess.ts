import JavaScriptNode from "./JavaScriptNode.ts";
import JavaScriptNodeBase from "./JavaScriptNodeBase.ts";
import JavaScriptNodeType from "./JavaScriptNodeType.ts";

interface JavaScriptArrayAccess extends JavaScriptNodeBase {
  type: JavaScriptNodeType.ARRAY_ACCESS;
  array: JavaScriptNode;
  index: JavaScriptNode;
}

export default JavaScriptArrayAccess;
