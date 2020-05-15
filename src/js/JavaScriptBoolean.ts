import JavaScriptNodeBase from "./JavaScriptNodeBase.ts";
import JavaScriptNodeType from "./JavaScriptNodeType.ts";

interface JavaScriptBoolean extends JavaScriptNodeBase {
  type: JavaScriptNodeType.BOOLEAN;
  value: boolean;
}

export default JavaScriptBoolean;
