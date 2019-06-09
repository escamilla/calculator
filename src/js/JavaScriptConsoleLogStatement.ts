import JavaScriptNode from "./JavaScriptNode";
import JavaScriptNodeBase from "./JavaScriptNodeBase";
import JavaScriptNodeType from "./JavaScriptNodeType";

interface JavaScriptConsoleLogStatement extends JavaScriptNodeBase {
  type: JavaScriptNodeType.CONSOLE_LOG_STATEMENT;
  object: JavaScriptNode;
}

export default JavaScriptConsoleLogStatement;
