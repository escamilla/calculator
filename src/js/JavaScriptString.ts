import JavaScriptNodeBase from "./JavaScriptNodeBase";
import JavaScriptNodeType from "./JavaScriptNodeType";

interface JavaScriptString extends JavaScriptNodeBase {
  type: JavaScriptNodeType.STRING;
  value: string;
}

export default JavaScriptString;
