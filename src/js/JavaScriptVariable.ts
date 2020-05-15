import JavaScriptNodeBase from "./JavaScriptNodeBase.ts";
import JavaScriptNodeType from "./JavaScriptNodeType.ts";

interface JavaScriptVariable extends JavaScriptNodeBase {
  type: JavaScriptNodeType.VARIABLE;
  name: string;
}

export default JavaScriptVariable;
