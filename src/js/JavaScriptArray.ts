import JavaScriptNode from "./JavaScriptNode.ts";
import JavaScriptNodeBase from "./JavaScriptNodeBase.ts";
import JavaScriptNodeType from "./JavaScriptNodeType.ts";

interface JavaScriptArray extends JavaScriptNodeBase {
  type: JavaScriptNodeType.ARRAY;
  items: JavaScriptNode[];
}

export default JavaScriptArray;
