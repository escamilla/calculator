import JavaScriptArray from "./JavaScriptArray";
import JavaScriptAssignmentOperation from "./JavaScriptAssignmentOperation";
import JavaScriptBinaryOperation from "./JavaScriptBinaryOperation";
import JavaScriptBoolean from "./JavaScriptBoolean";
import JavaScriptConditionalOperation from "./JavaScriptConditionalOperation";
import JavaScriptFunctionCall from "./JavaScriptFunctionCall";
import JavaScriptFunctionDefinition from "./JavaScriptFunctionDefinition";
import JavaScriptIIFE from "./JavaScriptIIFE";
import JavaScriptNull from "./JavaScriptNull";
import JavaScriptNumber from "./JavaScriptNumber";
import JavaScriptString from "./JavaScriptString";
import JavaScriptVariable from "./JavaScriptVariable";

type JavaScriptNode = JavaScriptArray
                    | JavaScriptAssignmentOperation
                    | JavaScriptBinaryOperation
                    | JavaScriptBoolean
                    | JavaScriptConditionalOperation
                    | JavaScriptFunctionCall
                    | JavaScriptFunctionDefinition
                    | JavaScriptIIFE
                    | JavaScriptNull
                    | JavaScriptNumber
                    | JavaScriptString
                    | JavaScriptVariable;

export default JavaScriptNode;
