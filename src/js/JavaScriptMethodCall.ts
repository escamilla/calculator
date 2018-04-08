import JavaScriptNode from "./JavaScriptNode";
import JavaScriptNodeBase from "./JavaScriptNodeBase";
import JavaScriptNodeType from "./JavaScriptNodeType";

interface JavaScriptMethodCall extends JavaScriptNodeBase {
  type: JavaScriptNodeType.METHOD_CALL;
  object: JavaScriptNode;
  methodName: string;
  args: JavaScriptNode[];
}

export default JavaScriptMethodCall;
