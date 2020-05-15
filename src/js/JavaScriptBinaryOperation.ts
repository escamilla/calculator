import JavaScriptNode from "./JavaScriptNode.ts";
import JavaScriptNodeBase from "./JavaScriptNodeBase.ts";
import JavaScriptNodeType from "./JavaScriptNodeType.ts";

interface JavaScriptBinaryOperation extends JavaScriptNodeBase {
  type: JavaScriptNodeType.BINARY_OPERATION;
  operator: string;
  leftSide: JavaScriptNode;
  rightSide: JavaScriptNode;
}

export default JavaScriptBinaryOperation;
