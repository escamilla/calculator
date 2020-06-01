export enum JavaScriptNodeType {
  ARRAY,
  ARRAY_ACCESS,
  ASSIGNMENT_OPERATION,
  BINARY_OPERATION,
  BOOLEAN,
  CONDITIONAL_OPERATION,
  CONSOLE_LOG_STATEMENT,
  FUNCTION_CALL,
  FUNCTION_DEFINITION,
  IIFE,
  METHOD_CALL,
  NULL,
  NUMBER,
  PROPERTY_ACCESS,
  STRING,
  VARIABLE,
}

export interface JavaScriptArray extends JavaScriptNodeBase {
  type: JavaScriptNodeType.ARRAY;
  items: JavaScriptNode[];
}

export interface JavaScriptArrayAccess extends JavaScriptNodeBase {
  type: JavaScriptNodeType.ARRAY_ACCESS;
  array: JavaScriptNode;
  index: JavaScriptNode;
}

export interface JavaScriptAssignmentOperation extends JavaScriptNodeBase {
  type: JavaScriptNodeType.ASSIGNMENT_OPERATION;
  name: string;
  value: JavaScriptNode;
}

export interface JavaScriptBinaryOperation extends JavaScriptNodeBase {
  type: JavaScriptNodeType.BINARY_OPERATION;
  operator: string;
  leftSide: JavaScriptNode;
  rightSide: JavaScriptNode;
}

export interface JavaScriptBoolean extends JavaScriptNodeBase {
  type: JavaScriptNodeType.BOOLEAN;
  value: boolean;
}

export interface JavaScriptConditionalOperation extends JavaScriptNodeBase {
  type: JavaScriptNodeType.CONDITIONAL_OPERATION;
  condition: JavaScriptNode;
  valueIfTrue: JavaScriptNode;
  valueIfFalse: JavaScriptNode;
}

export interface JavaScriptConsoleLogStatement extends JavaScriptNodeBase {
  type: JavaScriptNodeType.CONSOLE_LOG_STATEMENT;
  object: JavaScriptNode;
}

export interface JavaScriptFunctionCall extends JavaScriptNodeBase {
  type: JavaScriptNodeType.FUNCTION_CALL;
  functionName: string;
  args: JavaScriptNode[];
}

export interface JavaScriptFunctionDefinition extends JavaScriptNodeBase {
  type: JavaScriptNodeType.FUNCTION_DEFINITION;
  params: string[];
  body: JavaScriptNode;
}

export interface JavaScriptIIFE extends JavaScriptNodeBase {
  type: JavaScriptNodeType.IIFE;
  nodes: JavaScriptNode[];
  isRootNode: boolean;
}

export interface JavaScriptMethodCall extends JavaScriptNodeBase {
  type: JavaScriptNodeType.METHOD_CALL;
  object: JavaScriptNode;
  methodName: string;
  args: JavaScriptNode[];
}

export interface JavaScriptNodeBase {
  type: JavaScriptNodeType;
  line: number;
  column: number;
}

export interface JavaScriptNull extends JavaScriptNodeBase {
  type: JavaScriptNodeType.NULL;
}

export interface JavaScriptNumber extends JavaScriptNodeBase {
  type: JavaScriptNodeType.NUMBER;
  value: number;
}

export interface JavaScriptPropertyAccess extends JavaScriptNodeBase {
  type: JavaScriptNodeType.PROPERTY_ACCESS;
  object: JavaScriptNode;
  propertyName: string;
}

export interface JavaScriptString extends JavaScriptNodeBase {
  type: JavaScriptNodeType.STRING;
  value: string;
}

export interface JavaScriptVariable extends JavaScriptNodeBase {
  type: JavaScriptNodeType.VARIABLE;
  name: string;
}

export type JavaScriptNode =
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
