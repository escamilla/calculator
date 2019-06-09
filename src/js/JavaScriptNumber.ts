import JavaScriptNodeBase from "./JavaScriptNodeBase";
import JavaScriptNodeType from "./JavaScriptNodeType";

interface JavaScriptNumber extends JavaScriptNodeBase {
  type: JavaScriptNodeType.NUMBER;
  value: number;
}

export default JavaScriptNumber;
