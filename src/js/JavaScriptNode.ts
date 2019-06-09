import JavaScriptArray from "./JavaScriptArray";
import JavaScriptArrayAccess from "./JavaScriptArrayAccess";
import JavaScriptAssignmentOperation from "./JavaScriptAssignmentOperation";
import JavaScriptBinaryOperation from "./JavaScriptBinaryOperation";
import JavaScriptBoolean from "./JavaScriptBoolean";
import JavaScriptConditionalOperation from "./JavaScriptConditionalOperation";
import JavaScriptConsoleLogStatement from "./JavaScriptConsoleLogStatement";
import JavaScriptFunctionCall from "./JavaScriptFunctionCall";
import JavaScriptFunctionDefinition from "./JavaScriptFunctionDefinition";
import JavaScriptIIFE from "./JavaScriptIIFE";
import JavaScriptMethodCall from "./JavaScriptMethodCall";
import JavaScriptNull from "./JavaScriptNull";
import JavaScriptNumber from "./JavaScriptNumber";
import JavaScriptPropertyAccess from "./JavaScriptPropertyAccess";
import JavaScriptString from "./JavaScriptString";
import JavaScriptVariable from "./JavaScriptVariable";

type JavaScriptNode = JavaScriptArray
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
