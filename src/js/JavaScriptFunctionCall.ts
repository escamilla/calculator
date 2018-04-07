import JavaScriptNode from "./JavaScriptNode";
import JavaScriptNodeBase from "./JavaScriptNodeBase";
import JavaScriptNodeType from "./JavaScriptNodeType";

interface JavaScriptFunctionCall extends JavaScriptNodeBase {
  type: JavaScriptNodeType.FUNCTION_CALL;
  functionName: string;
  args: JavaScriptNode[];
}

export default JavaScriptFunctionCall;
