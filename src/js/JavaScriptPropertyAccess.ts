import JavaScriptNode from "./JavaScriptNode";
import JavaScriptNodeBase from "./JavaScriptNodeBase";
import JavaScriptNodeType from "./JavaScriptNodeType";

interface JavaScriptPropertyAccess extends JavaScriptNodeBase {
  type: JavaScriptNodeType.PROPERTY_ACCESS;
  object: JavaScriptNode;
  propertyName: string;
}

export default JavaScriptPropertyAccess;
