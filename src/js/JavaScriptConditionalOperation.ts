import JavaScriptNode from "./JavaScriptNode";
import JavaScriptNodeBase from "./JavaScriptNodeBase";
import JavaScriptNodeType from "./JavaScriptNodeType";

interface JavaScriptConditionalOperation extends JavaScriptNodeBase {
  type: JavaScriptNodeType.CONDITIONAL_OPERATION;
  condition: JavaScriptNode;
  valueIfTrue: JavaScriptNode;
  valueIfFalse: JavaScriptNode;
}

export default JavaScriptConditionalOperation;
