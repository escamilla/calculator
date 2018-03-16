import JavaScriptArray from "./JavaScriptArray";
import JavaScriptBoolean from "./JavaScriptBoolean";
import JavaScriptNull from "./JavaScriptNull";
import JavaScriptNumber from "./JavaScriptNumber";
import JavaScriptString from "./JavaScriptString";

type JavaScriptNode =
  JavaScriptArray |
  JavaScriptBoolean |
  JavaScriptNull |
  JavaScriptNumber |
  JavaScriptString;

export default JavaScriptNode;
