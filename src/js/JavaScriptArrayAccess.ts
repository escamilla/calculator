import JavaScriptNode from "./JavaScriptNode";
import JavaScriptNodeBase from "./JavaScriptNodeBase";
import JavaScriptNodeType from "./JavaScriptNodeType";

interface JavaScriptArrayAccess extends JavaScriptNodeBase {
  type: JavaScriptNodeType.ARRAY_ACCESS;
  array: JavaScriptNode;
  index: JavaScriptNode;
}

export default JavaScriptArrayAccess;
