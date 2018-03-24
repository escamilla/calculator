import JavaScriptArray from "./js/JavaScriptArray";
import JavaScriptAssignmentOperation from "./js/JavaScriptAssignmentOperation";
import JavaScriptBinaryOperation from "./js/JavaScriptBinaryOperation";
import JavaScriptBoolean from "./js/JavaScriptBoolean";
import JavaScriptFunction from "./js/JavaScriptFunction";
import JavaScriptFunctionCall from "./js/JavaScriptFunctionCall";
import JavaScriptIIFE from "./js/JavaScriptIIFE";
import JavaScriptNode from "./js/JavaScriptNode";
import JavaScriptNull from "./js/JavaScriptNull";
import JavaScriptNumber from "./js/JavaScriptNumber";
import JavaScriptString from "./js/JavaScriptString";
import JavaScriptVariable from "./js/JavaScriptVariable";

import {
  escapeString,
  SquirrelBoolean,
  SquirrelList,
  SquirrelNil,
  SquirrelNumber,
  SquirrelString,
  SquirrelSymbol,
  SquirrelType,
} from "squirrel-core";

const binaryOperators: string[] = ["+", "-", "*", "/", "%", "=", "!=", ">", ">=", "<", "<="];

function convertToJavaScriptAST(ast: SquirrelType): JavaScriptNode {
  if (ast instanceof SquirrelList) {
    const head: SquirrelType = ast.items[0];
    if (head instanceof SquirrelSymbol) {
      if (binaryOperators.includes(head.name)) {
        let operator: string = head.name;
        if (operator === "=") {
          operator = "===";
        } else if (operator === "!=") {
          operator = "!==";
        }
        const leftSide: JavaScriptNode = convertToJavaScriptAST(ast.items[1]);
        const rightSide: JavaScriptNode = convertToJavaScriptAST(ast.items[2]);
        return new JavaScriptBinaryOperation(operator, leftSide, rightSide);
      } else if (head.name === "def") {
        if (!(ast.items[1] instanceof SquirrelSymbol)) {
          throw new Error("first argument to def must be a symbol");
        }
        const leftSide: SquirrelSymbol = ast.items[1] as SquirrelSymbol;
        const rightSide: SquirrelType = ast.items[2];
        return new JavaScriptAssignmentOperation(leftSide.name, convertToJavaScriptAST(rightSide));
      } else if (head.name === "do") {
        const nodes: JavaScriptNode[] = ast.items.slice(1).map((item: SquirrelType) => convertToJavaScriptAST(item));
        return new JavaScriptIIFE(nodes);
      } else if (head.name === "lambda") {
        if (!(ast.items[1] instanceof SquirrelList)) {
          throw new Error("first argument to lambda must be list of parameters");
        }
        const paramList: SquirrelList = ast.items[1] as SquirrelList;
        const paramSymbols: SquirrelSymbol[] = paramList.items.map((item: SquirrelType) => item as SquirrelSymbol);
        const paramStrings: string[] = paramSymbols.map((item: SquirrelSymbol) => item.name);
        const body: JavaScriptNode = convertToJavaScriptAST(ast.items[2]);
        return new JavaScriptFunction(paramStrings, body);
      } else {
        const args: JavaScriptNode[] = ast.items.slice(1).map((item: SquirrelType) => convertToJavaScriptAST(item));
        return new JavaScriptFunctionCall(head.name, args);
      }
    }
    const items: JavaScriptNode[] = ast.items.map((item: SquirrelType) => convertToJavaScriptAST(item));
    return new JavaScriptArray(items);
  } else if (ast instanceof SquirrelBoolean) {
    return new JavaScriptBoolean(ast.value);
  } else if (ast instanceof SquirrelNil) {
    return new JavaScriptNull();
  } else if (ast instanceof SquirrelNumber) {
    return new JavaScriptNumber(ast.value);
  } else if (ast instanceof SquirrelString) {
    return new JavaScriptString(ast.value);
  } else if (ast instanceof SquirrelSymbol) {
    if (ast.name === "null") {
      return new JavaScriptNull();
    } else if (ast.name === "true") {
      return new JavaScriptBoolean(true);
    } else if (ast.name === "false") {
      return new JavaScriptBoolean(false);
    } else {
      return new JavaScriptVariable(ast.name);
    }
  }

  throw new Error("not implemented");
}

function generateJavaScriptSourceCode(ast: JavaScriptNode): string {
  if (ast instanceof JavaScriptArray) {
    if (ast.items[0] instanceof JavaScriptFunction) {
      const functionString: string = generateJavaScriptSourceCode(ast.items[0]);
      const argStrings: string[] = ast.items.slice(1).map((item: JavaScriptNode) => generateJavaScriptSourceCode(item));
      return `${functionString}(${argStrings.join(", ")})`;
    } else {
      const itemStrings: string[] = ast.items.map((item: JavaScriptNode) => generateJavaScriptSourceCode(item));
      return "[" + itemStrings.join(", ") + "]";
    }
  } else if (ast instanceof JavaScriptAssignmentOperation) {
    const leftSide: string = ast.name;
    const rightSide: string = generateJavaScriptSourceCode(ast.value);
    return `const ${leftSide} = ${rightSide};`;
  } else if (ast instanceof JavaScriptBinaryOperation) {
    const leftSide: string = generateJavaScriptSourceCode(ast.leftSide);
    const rightSide: string = generateJavaScriptSourceCode(ast.rightSide);
    return `(${leftSide} ${ast.operator} ${rightSide})`;
  } else if (ast instanceof JavaScriptBoolean) {
    return ast.value ? "true" : "false";
  } else if (ast instanceof JavaScriptFunction) {
    const functionParams: string[] = ast.params;
    const paramString: string = functionParams.join(", ");
    const bodyString: string = generateJavaScriptSourceCode(ast.body);
    return `(function(${paramString}) {\nreturn ${bodyString};\n})`;
  } else if (ast instanceof JavaScriptFunctionCall) {
    const argString: string = ast.args.map((item: JavaScriptNode) => generateJavaScriptSourceCode(item)).join(", ");
    return `${ast.functionName}(${argString})`;
  } else if (ast instanceof JavaScriptIIFE) {
    const statements: string[] = ast.nodes.slice(0, ast.nodes.length - 1)
                                          .map((node: JavaScriptNode) => generateJavaScriptSourceCode(node));
    const lastStatement: string = `return ${generateJavaScriptSourceCode(ast.nodes[ast.nodes.length - 1])};`;
    statements.push(lastStatement);
    const functionBody: string = statements.join("\n");
    return `(function() {\n${functionBody}\n})()`;
  } else if (ast instanceof JavaScriptNull) {
    return "null";
  } else if (ast instanceof JavaScriptNumber) {
    return ast.value.toString();
  } else if (ast instanceof JavaScriptString) {
    return escapeString(ast.value);
  } else if (ast instanceof JavaScriptVariable) {
    return ast.name;
  }

  throw new Error("not implemented");
}

export { convertToJavaScriptAST, generateJavaScriptSourceCode };
