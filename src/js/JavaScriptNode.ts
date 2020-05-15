import JavaScriptArray from "./JavaScriptArray.ts";
import JavaScriptArrayAccess from "./JavaScriptArrayAccess.ts";
import JavaScriptAssignmentOperation from "./JavaScriptAssignmentOperation.ts";
import JavaScriptBinaryOperation from "./JavaScriptBinaryOperation.ts";
import JavaScriptBoolean from "./JavaScriptBoolean.ts";
import JavaScriptConditionalOperation from "./JavaScriptConditionalOperation.ts";
import JavaScriptConsoleLogStatement from "./JavaScriptConsoleLogStatement.ts";
import JavaScriptFunctionCall from "./JavaScriptFunctionCall.ts";
import JavaScriptFunctionDefinition from "./JavaScriptFunctionDefinition.ts";
import JavaScriptIIFE from "./JavaScriptIIFE.ts";
import JavaScriptMethodCall from "./JavaScriptMethodCall.ts";
import JavaScriptNull from "./JavaScriptNull.ts";
import JavaScriptNumber from "./JavaScriptNumber.ts";
import JavaScriptPropertyAccess from "./JavaScriptPropertyAccess.ts";
import JavaScriptString from "./JavaScriptString.ts";
import JavaScriptVariable from "./JavaScriptVariable.ts";

type JavaScriptNode =
  | JavaScriptArray
  | JavaScriptArrayAccess
  | JavaScriptAssignmentOperation
  | JavaScriptBinaryOperation
  | JavaScriptBoolean
  | JavaScriptConditionalOperation
  | JavaScriptConsoleLogStatement
  | JavaScriptFunctionCall
  | JavaScriptFunctionDefinition
  | JavaScriptIIFE
  | JavaScriptMethodCall
  | JavaScriptNull
  | JavaScriptNumber
  | JavaScriptPropertyAccess
  | JavaScriptString
  | JavaScriptVariable;

export default JavaScriptNode;
