import * as fs from "fs";

import {
  CodeWithSourceMap,
  SourceNode,
} from "source-map";

import JavaScriptArray from "./js/JavaScriptArray";
import JavaScriptAssignmentOperation from "./js/JavaScriptAssignmentOperation";
import JavaScriptBinaryOperation from "./js/JavaScriptBinaryOperation";
import JavaScriptConditionalOperation from "./js/JavaScriptConditionalOperation";
import JavaScriptFunctionCall from "./js/JavaScriptFunctionCall";
import JavaScriptFunctionDefinition from "./js/JavaScriptFunctionDefinition";
import JavaScriptIIFE from "./js/JavaScriptIIFE";
import JavaScriptNode from "./js/JavaScriptNode";
import JavaScriptNodeType from "./js/JavaScriptNodeType";

import {
  escapeString,
  Parser,
  SquirrelList,
  SquirrelNode,
  SquirrelNodeType,
  SquirrelSymbol,
  Tokenizer,
} from "squirrel-core";

const binaryOperators: string[] = ["!=", "%", "*", "+", "-", "/", "<", "<=", "=", ">", ">="];

function convertToJavaScriptAST(ast: SquirrelNode): JavaScriptNode {
  const line: number = ast.line as number;
  const column: number = (ast.column as number) - 1;

  if (ast.type === SquirrelNodeType.LIST) {
    const head: SquirrelNode = ast.items[0];
    if (head.type === SquirrelNodeType.SYMBOL) {
      if (binaryOperators.includes(head.name)) {
        let operator: string = head.name;
        if (operator === "=") {
          operator = "===";
        } else if (operator === "!=") {
          operator = "!==";
        }
        const leftSide: JavaScriptNode = convertToJavaScriptAST(ast.items[1]);
        const rightSide: JavaScriptNode = convertToJavaScriptAST(ast.items[2]);
        return { type: JavaScriptNodeType.BINARY_OPERATION, operator, leftSide, rightSide, line, column };
      } else if (head.name === "def") {
        if (ast.items[1].type !== SquirrelNodeType.SYMBOL) {
          throw new Error("first argument to def must be a symbol");
        }
        const name: string = (ast.items[1] as SquirrelSymbol).name;
        const value: JavaScriptNode = convertToJavaScriptAST(ast.items[2]);
        return { type: JavaScriptNodeType.ASSIGNMENT_OPERATION, name, value, line, column };
      } else if (head.name === "do") {
        const nodes: JavaScriptNode[] = ast.items.slice(1).map((item: SquirrelNode) => convertToJavaScriptAST(item));
        return { type: JavaScriptNodeType.IIFE, nodes, line, column };
      } else if (head.name === "if") {
        const condition: JavaScriptNode = convertToJavaScriptAST(ast.items[1]);
        const valueIfTrue: JavaScriptNode = convertToJavaScriptAST(ast.items[2]);
        const valueIfFalse: JavaScriptNode = convertToJavaScriptAST(ast.items[3]);
        return { type: JavaScriptNodeType.CONDITIONAL_OPERATION, condition, valueIfTrue, valueIfFalse, line, column };
      } else if (head.name === "lambda") {
        if (ast.items[1].type !== SquirrelNodeType.LIST) {
          throw new Error("first argument to lambda must be list of parameters");
        }
        const paramList: SquirrelList = ast.items[1] as SquirrelList;
        const paramSymbols: SquirrelSymbol[] = paramList.items.map((item: SquirrelNode) => item as SquirrelSymbol);
        const params: string[] = paramSymbols.map((item: SquirrelSymbol) => item.name);
        const body: JavaScriptNode = convertToJavaScriptAST(ast.items[2]);
        return { type: JavaScriptNodeType.FUNCTION_DEFINITION, params, body, line, column };
      } else {
        const functionName: string = head.name;
        const args: JavaScriptNode[] = ast.items.slice(1).map((item: SquirrelNode) => convertToJavaScriptAST(item));
        return { type: JavaScriptNodeType.FUNCTION_CALL, functionName, args, line, column };
      }
    }
    const items: JavaScriptNode[] = ast.items.map((item: SquirrelNode) => convertToJavaScriptAST(item));
    return { type: JavaScriptNodeType.ARRAY, items, line, column };
  } else if (ast.type === SquirrelNodeType.BOOLEAN) {
    return { type: JavaScriptNodeType.BOOLEAN, value: ast.value, line, column };
  } else if (ast.type === SquirrelNodeType.NIL) {
    return { type: JavaScriptNodeType.NULL, line, column };
  } else if (ast.type === SquirrelNodeType.NUMBER) {
    return { type: JavaScriptNodeType.NUMBER, value: ast.value, line, column };
  } else if (ast.type === SquirrelNodeType.STRING) {
    return { type: JavaScriptNodeType.STRING, value: ast.value, line, column };
  } else if (ast.type === SquirrelNodeType.SYMBOL) {
    if (ast.name === "null") {
      return { type: JavaScriptNodeType.NULL, line, column };
    } else if (ast.name === "true") {
      return { type: JavaScriptNodeType.BOOLEAN, value: true, line, column };
    } else if (ast.name === "false") {
      return { type: JavaScriptNodeType.BOOLEAN, value: false, line, column };
    } else {
      return { type: JavaScriptNodeType.VARIABLE, name: ast.name, line, column };
    }
  }

  throw new Error("not implemented");
}

function compileJavaScriptArray(ast: JavaScriptArray,
                                sourceFile: string | null = null,
                                indent: number = 0): SourceNode {
  if (ast.items[0].type === JavaScriptNodeType.FUNCTION_DEFINITION) {
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
    [" ".repeat(indent), `_var['${ast.name}'] = `, valueNode, ";"],
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
  const outcomeIfTrueNode: SourceNode = compileJavaScript(ast.valueIfTrue, sourceFile, indent);
  const outcomeIfFalseNode: SourceNode = compileJavaScript(ast.valueIfFalse, sourceFile, indent);
  return new SourceNode(
    ast.line,
    ast.column,
    sourceFile,
    ["(", conditionNode, " ? ", outcomeIfTrueNode, " : ", outcomeIfFalseNode, ")"],
  );
}

function compileJavaScriptFunctionDefinition(ast: JavaScriptFunctionDefinition,
                                             sourceFile: string | null = null,
                                             indent: number = 0): SourceNode {
    const functionBodyNode: SourceNode = compileJavaScript(ast.body, sourceFile, indent);
    const argUnpackingChunks: any[] = [];
    for (let i: number = 0; i < ast.params.length; i++) {
      argUnpackingChunks.push(" ".repeat(indent + 2));
      argUnpackingChunks.push(`_var['${ast.params[i]}'] = _var['${i}'];\n`);
    }
    return new SourceNode(
      ast.line,
      ast.column,
      sourceFile,
      ["(function(_var) {\n", ...argUnpackingChunks,
      " ".repeat(indent + 2), "return ", functionBodyNode, ";\n", " ".repeat(indent), "})"],
    );
}

function compileJavaScriptFunctionCall(ast: JavaScriptFunctionCall,
                                       sourceFile: string | null = null,
                                       indent: number = 0): SourceNode {
  const argNodes: SourceNode[] = ast.args.map((item: JavaScriptNode) => compileJavaScript(item, sourceFile, indent));

  const argDictChunks: any[] = [];
  argDictChunks.push("{");
  for (let i: number = 0; i < argNodes.length; i++) {
    argDictChunks.push(`'${i}': `);
    argDictChunks.push(argNodes[i]);
    if (i !== argNodes.length - 1) {
      argDictChunks.push(", ");
    }
  }
  argDictChunks.push("}");

  return new SourceNode(
    ast.line,
    ast.column,
    sourceFile,
    [`_var['${ast.functionName}']`, "(Object.assign(_var, ", ...argDictChunks, "))"],
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
      ["(function() {\n", " ".repeat(indent + 2), "const _var = {};\n",
      ...statementNodes, "\n", " ".repeat(indent + 2), "return ", returnValueNode, ";\n})()"],
    );
  }
}

function compileJavaScript(ast: JavaScriptNode,
                           sourceFile: string | null = null,
                           indent: number = 0): SourceNode {
  if (ast.type === JavaScriptNodeType.ARRAY) {
    return compileJavaScriptArray(ast, sourceFile, indent);
  } else if (ast.type === JavaScriptNodeType.ASSIGNMENT_OPERATION) {
    return compileJavaScriptAssignmentOperation(ast, sourceFile, indent);
  } else if (ast.type === JavaScriptNodeType.BINARY_OPERATION) {
    return compileJavaScriptBinaryOperation(ast, sourceFile, indent);
  } else if (ast.type === JavaScriptNodeType.BOOLEAN) {
    return new SourceNode(
      ast.line,
      ast.column,
      sourceFile,
      ast.value ? "true" : "false",
    );
  } else if (ast.type === JavaScriptNodeType.CONDITIONAL_OPERATION) {
    return compileJavaScriptConditionalOperation(ast, sourceFile, indent);
  } else if (ast.type === JavaScriptNodeType.FUNCTION_CALL) {
    return compileJavaScriptFunctionCall(ast, sourceFile, indent);
  } else if (ast.type === JavaScriptNodeType.FUNCTION_DEFINITION) {
    return compileJavaScriptFunctionDefinition(ast, sourceFile, indent);
  } else if (ast.type === JavaScriptNodeType.IIFE) {
    return compileJavaScriptIIFE(ast, sourceFile, indent);
  } else if (ast.type === JavaScriptNodeType.NULL) {
    return new SourceNode(
      ast.line,
      ast.column,
      sourceFile,
      "null",
    );
  } else if (ast.type === JavaScriptNodeType.NUMBER) {
    return new SourceNode(
      ast.line,
      ast.column,
      sourceFile,
      ast.value.toString(),
    );
  } else if (ast.type === JavaScriptNodeType.STRING) {
    return new SourceNode(
      ast.line,
      ast.column,
      sourceFile,
      escapeString(ast.value),
    );
  } else if (ast.type === JavaScriptNodeType.VARIABLE) {
    return new SourceNode(
      ast.line,
      ast.column,
      sourceFile,
      `_var['${ast.name}']`,
    );
  } else {
    throw new Error("unrecognized node");
  }
}

function compileSquirrelFileToJavaScript(path: string): void {
  const input: string = fs.readFileSync(path).toString();
  const tokenizer: Tokenizer = new Tokenizer(input);
  const parser: Parser = new Parser(tokenizer.tokenize());
  const squirrelAst: SquirrelNode = parser.parse();

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
