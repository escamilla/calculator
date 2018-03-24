import JavaScriptArray from "./JavaScriptArray";
import JavaScriptAssignmentOperation from "./JavaScriptAssignmentOperation";
import JavaScriptBinaryOperation from "./JavaScriptBinaryOperation";
import JavaScriptBoolean from "./JavaScriptBoolean";
import JavaScriptFunction from "./JavaScriptFunction";
import JavaScriptFunctionCall from "./JavaScriptFunctionCall";
import JavaScriptIIFE from "./JavaScriptIIFE";
import JavaScriptNull from "./JavaScriptNull";
import JavaScriptNumber from "./JavaScriptNumber";
import JavaScriptString from "./JavaScriptString";
import JavaScriptVariable from "./JavaScriptVariable";

type JavaScriptNode =
  JavaScriptArray |
  JavaScriptAssignmentOperation |
  JavaScriptBinaryOperation |
  JavaScriptBoolean |
  JavaScriptFunction |
  JavaScriptFunctionCall |
  JavaScriptIIFE |
  JavaScriptNull |
  JavaScriptNumber |
  JavaScriptString |
  JavaScriptVariable;

export default JavaScriptNode;
