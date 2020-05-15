import JavaScriptNode from "./JavaScriptNode.ts";
import JavaScriptNodeBase from "./JavaScriptNodeBase.ts";
import JavaScriptNodeType from "./JavaScriptNodeType.ts";

interface JavaScriptFunctionCall extends JavaScriptNodeBase {
  type: JavaScriptNodeType.FUNCTION_CALL;
  functionName: string;
  args: JavaScriptNode[];
}

export default JavaScriptFunctionCall;
