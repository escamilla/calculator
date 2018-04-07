import JavaScriptNode from "./JavaScriptNode";
import JavaScriptNodeBase from "./JavaScriptNodeBase";
import JavaScriptNodeType from "./JavaScriptNodeType";

interface JavaScriptBinaryOperation extends JavaScriptNodeBase {
  type: JavaScriptNodeType.BINARY_OPERATION;
  operator: string;
  leftSide: JavaScriptNode;
  rightSide: JavaScriptNode;
}

export default JavaScriptBinaryOperation;
