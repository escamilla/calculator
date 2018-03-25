import * as fs from "fs";

import {
  CodeWithSourceMap,
  SourceNode,
} from "source-map";

import JavaScriptArray from "./js/JavaScriptArray";
import JavaScriptAssignmentOperation from "./js/JavaScriptAssignmentOperation";
import JavaScriptBinaryOperation from "./js/JavaScriptBinaryOperation";
import JavaScriptBoolean from "./js/JavaScriptBoolean";
import JavaScriptConditionalOperation from "./js/JavaScriptConditional";
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

const binaryOperators: string[] = ["!=", "%", "*", "+", "-", "/", "<", "<=", "=", ">", ">="];

function convertToJavaScriptAST(ast: SquirrelType): JavaScriptNode {
  const line: number = ast.line as number;
  const column: number = (ast.column as number) - 1;

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
        return new JavaScriptConditionalOperation(line, column, condition, outcomeIfTrue, outcomeIfFalse);
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

function compileJavaScriptArray(ast: JavaScriptArray,
                                sourceFile: string | null = null,
                                indent: number = 0): SourceNode {
  if (ast.items[0] instanceof JavaScriptFunction) {
    const functionNode: SourceNode = compileJavaScript(ast.items[0], sourceFile, indent);
    const argNodes: SourceNode[] =
      ast.items.slice(1).map((item: JavaScriptNode) => compileJavaScript(item, sourceFile, indent));
    const argNodesWithCommas: any[] = [];
    for (let i: number = 0; i < argNodes.length; i++) {
      argNodesWithCommas.push(argNodes[i]);
      if (i < argNodes.length - 1) {
        argNodesWithCommas.push(", ");
      }
    }
    return new SourceNode(
      ast.line,
      ast.column,
      sourceFile,
      [functionNode, "(", ...argNodesWithCommas, ")"],
    );
  } else {
    const itemNodes: SourceNode[] =
      ast.items.map((item: JavaScriptNode) => compileJavaScript(item, sourceFile, indent));
    const itemNodesWithCommas: any[] = [];
    for (let i: number = 0; i < itemNodes.length; i++) {
      itemNodesWithCommas.push(itemNodes[i]);
      if (i < itemNodes.length - 1) {
        itemNodesWithCommas.push(", ");
      }
    }
    return new SourceNode(
      ast.line,
      ast.column,
      sourceFile,
      ["[", ...itemNodesWithCommas, "]"],
    );
  }
}

function compileJavaScriptAssignmentOperation(ast: JavaScriptAssignmentOperation,
                                              sourceFile: string | null = null,
                                              indent: number = 0): SourceNode {
  const valueNode: SourceNode = compileJavaScript(ast.value, sourceFile, indent);
  return new SourceNode(
    ast.line,
    ast.column,
    sourceFile,
    [" ".repeat(indent), "const ", ast.name, " = ", valueNode, ";"],
  );
}

function compileJavaScriptBinaryOperation(ast: JavaScriptBinaryOperation,
                                          sourceFile: string | null = null,
                                          indent: number = 0): SourceNode {
    const leftSideNode: SourceNode = compileJavaScript(ast.leftSide, sourceFile, indent);
    const rightSideNode: SourceNode = compileJavaScript(ast.rightSide, sourceFile, indent);
    return new SourceNode(
      ast.line,
      ast.column,
      sourceFile,
      ["(", leftSideNode, " ", ast.operator, " ", rightSideNode, ")"],
    );
}

function compileJavaScriptConditionalOperation(ast: JavaScriptConditionalOperation,
                                               sourceFile: string | null = null,
                                               indent: number = 0): SourceNode {
  const conditionNode: SourceNode = compileJavaScript(ast.condition, sourceFile, indent);
  const outcomeIfTrueNode: SourceNode = compileJavaScript(ast.outcomeIfTrue, sourceFile, indent);
  const outcomeIfFalseNode: SourceNode = compileJavaScript(ast.outcomeIfFalse, sourceFile, indent);
  return new SourceNode(
    ast.line,
    ast.column,
    sourceFile,
    ["(", conditionNode, " ? ", outcomeIfTrueNode, " : ", outcomeIfFalseNode, ")"],
  );
}

function compileJavaScriptFunction(ast: JavaScriptFunction,
                                   sourceFile: string | null = null,
                                   indent: number = 0): SourceNode {
    const functionBodyNode: SourceNode = compileJavaScript(ast.body, sourceFile, indent);
    return new SourceNode(
      ast.line,
      ast.column,
      sourceFile,
      ["(function(", ast.params.join(", "), ") {\n", " ".repeat(indent + 2),
      "return ", functionBodyNode, ";\n", " ".repeat(indent), "})"],
    );
}

function compileJavaScriptFunctionCall(ast: JavaScriptFunctionCall,
                                       sourceFile: string | null = null,
                                       indent: number = 0): SourceNode {
  const argNodes: SourceNode[] = ast.args.map((item: JavaScriptNode) => compileJavaScript(item, sourceFile, indent));
  const argNodesWithCommas: any[] = [];
  for (let i: number = 0; i < argNodes.length; i++) {
    argNodesWithCommas.push(argNodes[i]);
    if (i !== argNodes.length - 1) {
      argNodesWithCommas.push(", ");
    }
  }
  return new SourceNode(
    ast.line,
    ast.column,
    sourceFile,
    [ast.functionName, "(", ...argNodesWithCommas, ")"],
  );
}

function compileJavaScriptIIFE(ast: JavaScriptIIFE,
                               sourceFile: string | null = null,
                               indent: number = 0): SourceNode {
  const statementNodes: SourceNode[] = ast.nodes.slice(0, ast.nodes.length - 1)
    .map((node: JavaScriptNode) => compileJavaScript(node, sourceFile, indent + 2));
  const statementNodesWithLineBreaks: any[] = [];
  statementNodes.forEach((statementNode: SourceNode) => {
    statementNodesWithLineBreaks.push(statementNode);
    statementNodesWithLineBreaks.push("\n");
  });
  const returnValueNode: SourceNode = compileJavaScript(ast.nodes[ast.nodes.length - 1], sourceFile, indent);
  if (statementNodes.length === 0) {
    return new SourceNode(
      ast.line,
      ast.column,
      sourceFile,
      ["(function() {\n", " ".repeat(indent + 2), "return ", returnValueNode, ";\n})()"],
    );
  } else {
    return new SourceNode(
      ast.line,
      ast.column,
      sourceFile,
      ["(function() {\n", ...statementNodes, "\n", " ".repeat(indent + 2), "return ", returnValueNode, ";\n})()"],
    );
  }
}

function compileJavaScript(ast: JavaScriptNode,
                           sourceFile: string | null = null,
                           indent: number = 0): SourceNode {
  if (ast instanceof JavaScriptArray) {
    return compileJavaScriptArray(ast, sourceFile, indent);
  } else if (ast instanceof JavaScriptAssignmentOperation) {
    return compileJavaScriptAssignmentOperation(ast, sourceFile, indent);
  } else if (ast instanceof JavaScriptBinaryOperation) {
    return compileJavaScriptBinaryOperation(ast, sourceFile, indent);
  } else if (ast instanceof JavaScriptBoolean) {
    return new SourceNode(
      ast.line,
      ast.column,
      sourceFile,
      ast.value ? "true" : "false",
    );
  } else if (ast instanceof JavaScriptConditionalOperation) {
    return compileJavaScriptConditionalOperation(ast, sourceFile, indent);
  } else if (ast instanceof JavaScriptFunction) {
    return compileJavaScriptFunction(ast, sourceFile, indent);
  } else if (ast instanceof JavaScriptFunctionCall) {
    return compileJavaScriptFunctionCall(ast, sourceFile, indent);
  } else if (ast instanceof JavaScriptIIFE) {
    return compileJavaScriptIIFE(ast, sourceFile, indent);
  } else if (ast instanceof JavaScriptNull) {
    return new SourceNode(
      ast.line,
      ast.column,
      sourceFile,
      "null",
    );
  } else if (ast instanceof JavaScriptNumber) {
    return new SourceNode(
      ast.line,
      ast.column,
      sourceFile,
      ast.value.toString(),
    );
  } else if (ast instanceof JavaScriptString) {
    return new SourceNode(
      ast.line,
      ast.column,
      sourceFile,
      escapeString(ast.value),
    );
  } else if (ast instanceof JavaScriptVariable) {
    return new SourceNode(
      ast.line,
      ast.column,
      sourceFile,
      ast.name,
    );
  } else {
    throw new Error("unrecognized node");
  }
}

function compileSquirrelFileToJavaScript(path: string): void {
  const input: string = fs.readFileSync(path).toString();
  const lexer: Lexer = new Lexer(input);
  const parser: Parser = new Parser(lexer.lex());
  const squirrelAst: SquirrelType = parser.parse();

  const javaScriptAst: JavaScriptNode = convertToJavaScriptAST(squirrelAst);
  const javaScriptCodeFile: string = path.replace(/.\w+$/, ".js");
  const javaScriptSourceMapFile: string = javaScriptCodeFile + ".map";

  const output: CodeWithSourceMap = compileJavaScript(javaScriptAst, path).toStringWithSourceMap({
    file: javaScriptCodeFile,
  });
  fs.writeFileSync(javaScriptCodeFile, output.code + "\n//# sourceMappingURL=" + javaScriptSourceMapFile);
  fs.writeFileSync(javaScriptSourceMapFile, output.map);
}

export {
  compileSquirrelFileToJavaScript,
  convertToJavaScriptAST,
  compileJavaScript,
};
