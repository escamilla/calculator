import JavaScriptNode from "./JavaScriptNode.ts";
import JavaScriptNodeBase from "./JavaScriptNodeBase.ts";
import JavaScriptNodeType from "./JavaScriptNodeType.ts";

interface JavaScriptConsoleLogStatement extends JavaScriptNodeBase {
  type: JavaScriptNodeType.CONSOLE_LOG_STATEMENT;
  object: JavaScriptNode;
}

export default JavaScriptConsoleLogStatement;
