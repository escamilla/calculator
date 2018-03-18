import JavaScriptArray from "./JavaScriptArray";
import JavaScriptBinaryOperation from "./JavaScriptBinaryOperation";
import JavaScriptBoolean from "./JavaScriptBoolean";
import JavaScriptNull from "./JavaScriptNull";
import JavaScriptNumber from "./JavaScriptNumber";
import JavaScriptString from "./JavaScriptString";

type JavaScriptNode =
  JavaScriptArray |
  JavaScriptBinaryOperation |
  JavaScriptBoolean |
  JavaScriptNull |
  JavaScriptNumber |
  JavaScriptString;

export default JavaScriptNode;
