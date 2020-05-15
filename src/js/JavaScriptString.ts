import JavaScriptNodeBase from "./JavaScriptNodeBase.ts";
import JavaScriptNodeType from "./JavaScriptNodeType.ts";

interface JavaScriptString extends JavaScriptNodeBase {
  type: JavaScriptNodeType.STRING;
  value: string;
}

export default JavaScriptString;
