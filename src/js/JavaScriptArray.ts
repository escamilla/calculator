import JavaScriptNode from "./JavaScriptNode";
import JavaScriptNodeBase from "./JavaScriptNodeBase";
import JavaScriptNodeType from "./JavaScriptNodeType";

interface JavaScriptArray extends JavaScriptNodeBase {
  type: JavaScriptNodeType.ARRAY;
  items: JavaScriptNode[];
}

export default JavaScriptArray;
