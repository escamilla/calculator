import JavaScriptNode from "./JavaScriptNode.ts";
import JavaScriptNodeBase from "./JavaScriptNodeBase.ts";
import JavaScriptNodeType from "./JavaScriptNodeType.ts";

interface JavaScriptMethodCall extends JavaScriptNodeBase {
  type: JavaScriptNodeType.METHOD_CALL;
  object: JavaScriptNode;
  methodName: string;
  args: JavaScriptNode[];
}

export default JavaScriptMethodCall;
