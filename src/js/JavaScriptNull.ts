import JavaScriptNodeBase from "./JavaScriptNodeBase.ts";
import JavaScriptNodeType from "./JavaScriptNodeType.ts";

interface JavaScriptNull extends JavaScriptNodeBase {
  type: JavaScriptNodeType.NULL;
}

export default JavaScriptNull;
