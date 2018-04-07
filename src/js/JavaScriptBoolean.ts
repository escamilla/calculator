import JavaScriptNodeBase from "./JavaScriptNodeBase";
import JavaScriptNodeType from "./JavaScriptNodeType";

interface JavaScriptBoolean extends JavaScriptNodeBase {
  type: JavaScriptNodeType.BOOLEAN;
  value: boolean;
}

export default JavaScriptBoolean;
