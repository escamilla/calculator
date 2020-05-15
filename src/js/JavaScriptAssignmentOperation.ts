import JavaScriptNode from "./JavaScriptNode.ts";
import JavaScriptNodeBase from "./JavaScriptNodeBase.ts";
import JavaScriptNodeType from "./JavaScriptNodeType.ts";

interface JavaScriptAssignmentOperation extends JavaScriptNodeBase {
  type: JavaScriptNodeType.ASSIGNMENT_OPERATION;
  name: string;
  value: JavaScriptNode;
}

export default JavaScriptAssignmentOperation;
