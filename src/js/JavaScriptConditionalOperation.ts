import JavaScriptNode from "./JavaScriptNode.ts";
import JavaScriptNodeBase from "./JavaScriptNodeBase.ts";
import JavaScriptNodeType from "./JavaScriptNodeType.ts";

interface JavaScriptConditionalOperation extends JavaScriptNodeBase {
  type: JavaScriptNodeType.CONDITIONAL_OPERATION;
  condition: JavaScriptNode;
  valueIfTrue: JavaScriptNode;
  valueIfFalse: JavaScriptNode;
}

export default JavaScriptConditionalOperation;
