import JavaScriptNode from "./JavaScriptNode";
import JavaScriptNodeBase from "./JavaScriptNodeBase";
import JavaScriptNodeType from "./JavaScriptNodeType";

interface JavaScriptAssignmentOperation extends JavaScriptNodeBase {
  type: JavaScriptNodeType.ASSIGNMENT_OPERATION;
  name: string;
  value: JavaScriptNode;
}

export default JavaScriptAssignmentOperation;
