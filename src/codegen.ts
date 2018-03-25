import * as fs from "fs";

import {
  CodeWithSourceMap,
  SourceNode,
} from "source-map";

import JavaScriptArray from "./js/JavaScriptArray";
import JavaScriptAssignmentOperation from "./js/JavaScriptAssignmentOperation";
import JavaScriptBinaryOperation from "./js/JavaScriptBinaryOperation";
import JavaScriptBoolean from "./js/JavaScriptBoolean";
import JavaScriptConditional from "./js/JavaScriptConditional";
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
  Lexer,
  Parser,
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
  const line: number = ast.line as number;
  const column: number = ast.column as number;

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
        return new JavaScriptBinaryOperation(line, column, operator, leftSide, rightSide);
      } else if (head.name === "def") {
        if (!(ast.items[1] instanceof SquirrelSymbol)) {
          throw new Error("first argument to def must be a symbol");
        }
        const leftSide: SquirrelSymbol = ast.items[1] as SquirrelSymbol;
        const rightSide: SquirrelType = ast.items[2];
        return new JavaScriptAssignmentOperation(line, column, leftSide.name, convertToJavaScriptAST(rightSide));
      } else if (head.name === "do") {
        const nodes: JavaScriptNode[] = ast.items.slice(1).map((item: SquirrelType) => convertToJavaScriptAST(item));
        return new JavaScriptIIFE(line, column, nodes);
      } else if (head.name === "if") {
        const condition: JavaScriptNode = convertToJavaScriptAST(ast.items[1]);
        const outcomeIfTrue: JavaScriptNode = convertToJavaScriptAST(ast.items[2]);
        const outcomeIfFalse: JavaScriptNode = convertToJavaScriptAST(ast.items[3]);
        return new JavaScriptConditional(line, column, condition, outcomeIfTrue, outcomeIfFalse);
      } else if (head.name === "lambda") {
        if (!(ast.items[1] instanceof SquirrelList)) {
          throw new Error("first argument to lambda must be list of parameters");
        }
        const paramList: SquirrelList = ast.items[1] as SquirrelList;
        const paramSymbols: SquirrelSymbol[] = paramList.items.map((item: SquirrelType) => item as SquirrelSymbol);
        const paramStrings: string[] = paramSymbols.map((item: SquirrelSymbol) => item.name);
        const body: JavaScriptNode = convertToJavaScriptAST(ast.items[2]);
        return new JavaScriptFunction(line, column, paramStrings, body);
      } else {
        const args: JavaScriptNode[] = ast.items.slice(1).map((item: SquirrelType) => convertToJavaScriptAST(item));
        return new JavaScriptFunctionCall(line, column, head.name, args);
      }
    }
    const items: JavaScriptNode[] = ast.items.map((item: SquirrelType) => convertToJavaScriptAST(item));
    return new JavaScriptArray(line, column, items);
  } else if (ast instanceof SquirrelBoolean) {
    return new JavaScriptBoolean(line, column, ast.value);
  } else if (ast instanceof SquirrelNil) {
    return new JavaScriptNull(line, column);
  } else if (ast instanceof SquirrelNumber) {
    return new JavaScriptNumber(line, column, ast.value);
  } else if (ast instanceof SquirrelString) {
    return new JavaScriptString(line, column, ast.value);
  } else if (ast instanceof SquirrelSymbol) {
    if (ast.name === "null") {
      return new JavaScriptNull(line, column);
    } else if (ast.name === "true") {
      return new JavaScriptBoolean(line, column, true);
    } else if (ast.name === "false") {
      return new JavaScriptBoolean(line, column, false);
    } else {
      return new JavaScriptVariable(line, column, ast.name);
    }
  }

  throw new Error("not implemented");
}

function convertToSourceNode(ast: JavaScriptNode, originalFilename: string | null = null): SourceNode {
  if (ast instanceof JavaScriptArray) {
    if (ast.items[0] instanceof JavaScriptFunction) {
      const functionString: SourceNode = convertToSourceNode(ast.items[0], originalFilename);
      const argStrings: SourceNode[] =
        ast.items.slice(1).map((item: JavaScriptNode) => convertToSourceNode(item, originalFilename));
      return new SourceNode(
        ast.line,
        ast.column,
        originalFilename,
        [functionString, "(", argStrings.join(", "), ")"],
      );
    } else {
      const itemStrings: SourceNode[] =
        ast.items.map((item: JavaScriptNode) => convertToSourceNode(item, originalFilename));
      return new SourceNode(
        ast.line,
        ast.column,
        originalFilename,
        ["[", itemStrings.join(", "), "]"],
      );
    }
  } else if (ast instanceof JavaScriptAssignmentOperation) {
    return new SourceNode(
      ast.line,
      ast.column,
      originalFilename,
      ["const ", ast.name, " = ", convertToSourceNode(ast.value, originalFilename), ";"],
    );
  } else if (ast instanceof JavaScriptBinaryOperation) {
    const leftSide: SourceNode = convertToSourceNode(ast.leftSide, originalFilename);
    const rightSide: SourceNode = convertToSourceNode(ast.rightSide, originalFilename);
    return new SourceNode(
      ast.line,
      ast.column,
      originalFilename,
      ["(", leftSide, " ", ast.operator, " ", rightSide, ")"],
    );
  } else if (ast instanceof JavaScriptBoolean) {
    return new SourceNode(
      ast.line,
      ast.column,
      originalFilename,
      ast.value ? "true" : "false",
    );
  } else if (ast instanceof JavaScriptConditional) {
    const condition: SourceNode = convertToSourceNode(ast.condition, originalFilename);
    const outcomeIfTrue: SourceNode = convertToSourceNode(ast.outcomeIfTrue, originalFilename);
    const outcomeIfFalse: SourceNode = convertToSourceNode(ast.outcomeIfFalse, originalFilename);
    return new SourceNode(
      ast.line,
      ast.column,
      originalFilename,
      ["(", condition, " ? ", outcomeIfTrue, " : ", outcomeIfFalse, ")"],
    );
  } else if (ast instanceof JavaScriptFunction) {
    return new SourceNode(
      ast.line,
      ast.column,
      originalFilename,
      ["(function(", ast.params.join(", "), ") {\nreturn ", convertToSourceNode(ast.body, originalFilename), ";\n})"],
    );
  } else if (ast instanceof JavaScriptFunctionCall) {
    const argString: string =
      ast.args.map((item: JavaScriptNode) => convertToSourceNode(item, originalFilename)).join(", ");
    return new SourceNode(
      ast.line,
      ast.column,
      originalFilename,
      [ast.functionName, "(", argString, ")"],
    );
  } else if (ast instanceof JavaScriptIIFE) {
    const statements: SourceNode[] = ast.nodes.slice(0, ast.nodes.length - 1)
      .map((node: JavaScriptNode) => convertToSourceNode(node, originalFilename));
    const functionBody: string = statements.join("\n");
    const returnValue: SourceNode = convertToSourceNode(ast.nodes[ast.nodes.length - 1], originalFilename);
    if (statements.length === 0) {
      return new SourceNode(
        ast.line,
        ast.column,
        originalFilename,
        ["(function() {\nreturn ", returnValue, ";\n})()"],
      );
    } else {
      return new SourceNode(
        ast.line,
        ast.column,
        originalFilename,
        ["(function() {\n", functionBody, "\nreturn ", returnValue, ";\n})()"],
      );
    }
  } else if (ast instanceof JavaScriptNull) {
    return new SourceNode(
      ast.line,
      ast.column,
      originalFilename,
      "null",
    );
  } else if (ast instanceof JavaScriptNumber) {
    return new SourceNode(
      ast.line,
      ast.column,
      originalFilename,
      ast.value.toString(),
    );
  } else if (ast instanceof JavaScriptString) {
    return new SourceNode(
      ast.line,
      ast.column,
      originalFilename,
      escapeString(ast.value),
    );
  } else if (ast instanceof JavaScriptVariable) {
    return new SourceNode(
      ast.line,
      ast.column,
      originalFilename,
      ast.name,
    );
  }

  throw new Error("not implemented");
}

function compileSquirrelFileToJavaScript(path: string): void {
  const input: string = fs.readFileSync(path).toString();
  const lexer: Lexer = new Lexer(input);
  const parser: Parser = new Parser(lexer.lex());
  const squirrelAst: SquirrelType = parser.parse();

  const javaScriptAst: JavaScriptNode = convertToJavaScriptAST(squirrelAst);
  const javaScriptCodeFile: string = path.replace(/.\w+$/, ".js");
  const javaScriptSourceMapFile: string = javaScriptCodeFile + ".map";

  const output: CodeWithSourceMap = convertToSourceNode(javaScriptAst, path).toStringWithSourceMap({
    file: javaScriptCodeFile,
  });
  fs.writeFileSync(javaScriptCodeFile, output.code + "\n//# sourceMappingURL=" + javaScriptSourceMapFile);
  fs.writeFileSync(javaScriptSourceMapFile, output.map);
}

export {
  compileSquirrelFileToJavaScript,
  convertToJavaScriptAST,
  convertToSourceNode,
};
