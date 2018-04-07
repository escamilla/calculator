import JavaScriptNodeBase from "./JavaScriptNodeBase";
import JavaScriptNodeType from "./JavaScriptNodeType";

interface JavaScriptVariable extends JavaScriptNodeBase {
  type: JavaScriptNodeType.VARIABLE;
  name: string;
}

export default JavaScriptVariable;
