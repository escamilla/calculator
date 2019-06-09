import JavaScriptNode from "./JavaScriptNode";
import JavaScriptNodeBase from "./JavaScriptNodeBase";
import JavaScriptNodeType from "./JavaScriptNodeType";

interface JavaScriptFunctionDefinition extends JavaScriptNodeBase {
  type: JavaScriptNodeType.FUNCTION_DEFINITION;
  params: string[];
  body: JavaScriptNode;
}

export default JavaScriptFunctionDefinition;
