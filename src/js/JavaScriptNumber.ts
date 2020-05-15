import JavaScriptNodeBase from "./JavaScriptNodeBase.ts";
import JavaScriptNodeType from "./JavaScriptNodeType.ts";

interface JavaScriptNumber extends JavaScriptNodeBase {
  type: JavaScriptNodeType.NUMBER;
  value: number;
}

export default JavaScriptNumber;
