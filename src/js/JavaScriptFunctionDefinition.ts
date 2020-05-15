import JavaScriptNode from "./JavaScriptNode.ts";
import JavaScriptNodeBase from "./JavaScriptNodeBase.ts";
import JavaScriptNodeType from "./JavaScriptNodeType.ts";

interface JavaScriptFunctionDefinition extends JavaScriptNodeBase {
  type: JavaScriptNodeType.FUNCTION_DEFINITION;
  params: string[];
  body: JavaScriptNode;
}

export default JavaScriptFunctionDefinition;
