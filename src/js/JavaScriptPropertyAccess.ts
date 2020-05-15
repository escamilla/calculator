import JavaScriptNode from "./JavaScriptNode.ts";
import JavaScriptNodeBase from "./JavaScriptNodeBase.ts";
import JavaScriptNodeType from "./JavaScriptNodeType.ts";

interface JavaScriptPropertyAccess extends JavaScriptNodeBase {
  type: JavaScriptNodeType.PROPERTY_ACCESS;
  object: JavaScriptNode;
  propertyName: string;
}

export default JavaScriptPropertyAccess;
