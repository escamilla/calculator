import JavaScriptNodeBase from "./JavaScriptNodeBase";
import JavaScriptNodeType from "./JavaScriptNodeType";

interface JavaScriptNull extends JavaScriptNodeBase {
  type: JavaScriptNodeType.NULL;
}

export default JavaScriptNull;
