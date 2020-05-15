import * as fs from "fs";

import {
  CodeWithSourceMap,
  SourceNode,
} from "source-map";

import JavaScriptArray from "./js/JavaScriptArray";
import JavaScriptArrayAccess from "./js/JavaScriptArrayAccess";
import JavaScriptAssignmentOperation from "./js/JavaScriptAssignmentOperation";
import JavaScriptBinaryOperation from "./js/JavaScriptBinaryOperation";
import JavaScriptConditionalOperation from "./js/JavaScriptConditionalOperation";
import JavaScriptConsoleLogStatement from "./js/JavaScriptConsoleLogStatement";
import JavaScriptFunctionCall from "./js/JavaScriptFunctionCall";
import JavaScriptFunctionDefinition from "./js/JavaScriptFunctionDefinition";
import JavaScriptIIFE from "./js/JavaScriptIIFE";
import JavaScriptMethodCall from "./js/JavaScriptMethodCall";
import JavaScriptNode from "./js/JavaScriptNode";
import JavaScriptNodeType from "./js/JavaScriptNodeType";
import Parser from "./Parser";
import Tokenizer from "./Tokenizer";
import { ChipmunkList, ChipmunkNodeType, ChipmunkSymbol, ChipmunkType } from "./types";
import escapeString from "./utils/escapeString";

const binaryOperators: string[] = ["!=", "%", "*", "+", "-", "/", "<", "<=", "=", ">", ">="];

function sanitizeJavaScriptIdentifier(identifier: string): string {
  return identifier.replace(/\W/g, "_");
}

function convertChipmunkNodeToJavaScriptNode(ast: ChipmunkType, root: boolean): JavaScriptNode {
  const line: number = ast.line as number;
  const column: number = (ast.column as number) - 1;

  if (root) {
    return {
      type: JavaScriptNodeType.IIFE,
      nodes: [convertChipmunkNodeToJavaScriptNode(ast, false)],
      isRootNode: true,
      line,
      column,
    };
  }

  if (ast.type === ChipmunkNodeType.List) {
    const head: ChipmunkType = ast.items[0];
    if (head.type === ChipmunkNodeType.Symbol) {
      if (binaryOperators.includes(head.name)) {
        let operator: string = head.name;
        if (operator === "=") {
          operator = "===";
        } else if (operator === "!=") {
          operator = "!==";
        }
        const leftSide: JavaScriptNode = convertChipmunkNodeToJavaScriptNode(ast.items[1], false);
        const rightSide: JavaScriptNode = convertChipmunkNodeToJavaScriptNode(ast.items[2], false);
        return { type: JavaScriptNodeType.BINARY_OPERATION, operator, leftSide, rightSide, line, column };
      } else if (head.name === "abs") {
        const argument: JavaScriptNode = convertChipmunkNodeToJavaScriptNode(ast.items[1], false);
        return {
          type: JavaScriptNodeType.METHOD_CALL,
          object: {
            type: JavaScriptNodeType.VARIABLE,
            name: "Math",
            line,
            column,
          },
          methodName: "abs",
          args: [argument],
          line,
          column,
        };
      } else if (head.name === "concat" || head.name === "join") {
        const firstList: JavaScriptNode = convertChipmunkNodeToJavaScriptNode(ast.items[1], false);
        const secondList: JavaScriptNode = convertChipmunkNodeToJavaScriptNode(ast.items[2], false);
        return {
          type: JavaScriptNodeType.METHOD_CALL,
          object: firstList,
          methodName: "concat",
          args: [secondList],
          line,
          column,
        };
      } else if (head.name === "def") {
        if (ast.items[1].type !== ChipmunkNodeType.Symbol) {
          throw new Error("first argument to def must be a symbol");
        }
        const name: string = sanitizeJavaScriptIdentifier((ast.items[1] as ChipmunkSymbol).name);
        const value: JavaScriptNode = convertChipmunkNodeToJavaScriptNode(ast.items[2], false);
        return { type: JavaScriptNodeType.ASSIGNMENT_OPERATION, name, value, line, column };
      } else if (head.name === "do") {
        const nodes: JavaScriptNode[] =
          ast.items.slice(1).map((item: ChipmunkType): JavaScriptNode => convertChipmunkNodeToJavaScriptNode(item, false));
        return { type: JavaScriptNodeType.IIFE, nodes, isRootNode: false, line, column };
      } else if (head.name === "if") {
        const condition: JavaScriptNode = convertChipmunkNodeToJavaScriptNode(ast.items[1], false);
        const valueIfTrue: JavaScriptNode = convertChipmunkNodeToJavaScriptNode(ast.items[2], false);
        const valueIfFalse: JavaScriptNode = convertChipmunkNodeToJavaScriptNode(ast.items[3], false);
        return { type: JavaScriptNodeType.CONDITIONAL_OPERATION, condition, valueIfTrue, valueIfFalse, line, column };
      } else if (head.name === "lambda") {
        if (ast.items[1].type !== ChipmunkNodeType.List) {
          throw new Error("first argument to lambda must be list of parameters");
        }
        const paramList: ChipmunkList = ast.items[1] as ChipmunkList;
        const paramSymbols: ChipmunkSymbol[] = paramList.items.map((item: ChipmunkType): ChipmunkSymbol => item as ChipmunkSymbol);
        const params: string[] = paramSymbols.map((item: ChipmunkSymbol): string => sanitizeJavaScriptIdentifier(item.name));
        const body: JavaScriptNode = convertChipmunkNodeToJavaScriptNode(ast.items[2], false);
        return { type: JavaScriptNodeType.FUNCTION_DEFINITION, params, body, line, column };
      } else if (head.name === "length") {
        const object: JavaScriptNode = convertChipmunkNodeToJavaScriptNode(ast.items[1], false);
        return {
          type: JavaScriptNodeType.PROPERTY_ACCESS,
          object,
          propertyName: "length",
          line,
          column,
        };
      } else if (head.name === "list") {
        const listItems: JavaScriptNode[] =
          ast.items.slice(1).map((item: ChipmunkType): JavaScriptNode => convertChipmunkNodeToJavaScriptNode(item, false));
        return { type: JavaScriptNodeType.ARRAY, items: listItems, line, column };
      } else if (head.name === "nth") {
        const array: JavaScriptNode = convertChipmunkNodeToJavaScriptNode(ast.items[1], false);
        const index: JavaScriptNode = convertChipmunkNodeToJavaScriptNode(ast.items[2], false);
        return { type: JavaScriptNodeType.ARRAY_ACCESS, array, index, line, column };
      } else if (head.name === "print-line") {
        const object: JavaScriptNode = convertChipmunkNodeToJavaScriptNode(ast.items[1], false);
        return { type: JavaScriptNodeType.CONSOLE_LOG_STATEMENT, object, line, column };
      } else if (head.name === "to-string") {
        const object: JavaScriptNode = convertChipmunkNodeToJavaScriptNode(ast.items[1], false);
        return { type: JavaScriptNodeType.FUNCTION_CALL, functionName: "String", args: [object], line, column };
      } else {
        const functionName: string = sanitizeJavaScriptIdentifier(head.name);
        const args: JavaScriptNode[] =
          ast.items.slice(1).map((item: ChipmunkType): JavaScriptNode => convertChipmunkNodeToJavaScriptNode(item, false));
        return { type: JavaScriptNodeType.FUNCTION_CALL, functionName, args, line, column };
      }
    }
    const items: JavaScriptNode[] =
      ast.items.map((item: ChipmunkType): JavaScriptNode => convertChipmunkNodeToJavaScriptNode(item, false));
    return { type: JavaScriptNodeType.ARRAY, items, line, column };
  } else if (ast.type === ChipmunkNodeType.Boolean) {
    return { type: JavaScriptNodeType.BOOLEAN, value: ast.value, line, column };
  } else if (ast.type === ChipmunkNodeType.Nil) {
    return { type: JavaScriptNodeType.NULL, line, column };
  } else if (ast.type === ChipmunkNodeType.Number) {
    return { type: JavaScriptNodeType.NUMBER, value: ast.value, line, column };
  } else if (ast.type === ChipmunkNodeType.String) {
    return { type: JavaScriptNodeType.STRING, value: ast.value, line, column };
  } else if (ast.type === ChipmunkNodeType.Symbol) {
    if (ast.name === "argv") {
      return { type: JavaScriptNodeType.VARIABLE, name: "process.argv.slice(2)", line, column };
    } else if (ast.name === "null") {
      return { type: JavaScriptNodeType.NULL, line, column };
    } else if (ast.name === "true") {
      return { type: JavaScriptNodeType.BOOLEAN, value: true, line, column };
    } else if (ast.name === "false") {
      return { type: JavaScriptNodeType.BOOLEAN, value: false, line, column };
    } else {
      return { type: JavaScriptNodeType.VARIABLE, name: sanitizeJavaScriptIdentifier(ast.name), line, column };
    }
  }

  throw new Error("not implemented");
}

function compileJavaScriptArray(ast: JavaScriptArray,
                                sourceFile: string | null = null,
                                indent: number = 0): SourceNode {
  if (ast.items.length === 0) {
    return new SourceNode(
      ast.line,
      ast.column,
      sourceFile,
      "[]",
    );
  }

  if (ast.items[0].type === JavaScriptNodeType.FUNCTION_DEFINITION) {
    const functionNode: SourceNode = compileJavaScriptToSourceNode(ast.items[0], sourceFile, indent);
    const argNodes: SourceNode[] =
      ast.items.slice(1).map((item: JavaScriptNode): JavaScriptNode => compileJavaScriptToSourceNode(item, sourceFile, indent));
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
      ast.items.map((item: JavaScriptNode): JavaScriptNode => compileJavaScriptToSourceNode(item, sourceFile, indent));
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

function compileJavaScriptArrayAccess(ast: JavaScriptArrayAccess,
                                      sourceFile: string | null = null,
                                      indent: number = 0): SourceNode {
  const arrayNode: SourceNode = compileJavaScriptToSourceNode(ast.array, sourceFile, indent);
  const indexNode: SourceNode = compileJavaScriptToSourceNode(ast.index, sourceFile, indent);
  return new SourceNode(
    ast.line,
    ast.column,
    sourceFile,
    [arrayNode, "[", indexNode, "]"],
  );
}

function compileJavaScriptAssignmentOperation(ast: JavaScriptAssignmentOperation,
                                              sourceFile: string | null = null,
                                              indent: number = 0): SourceNode {
  const valueNode: SourceNode = compileJavaScriptToSourceNode(ast.value, sourceFile, indent);
  return new SourceNode(
    ast.line,
    ast.column,
    sourceFile,
    [" ".repeat(indent), `const ${ast.name} = `, valueNode, ";\n"],
  );
}

function compileJavaScriptBinaryOperation(ast: JavaScriptBinaryOperation,
                                          sourceFile: string | null = null,
                                          indent: number = 0): SourceNode {
    const leftSideNode: SourceNode = compileJavaScriptToSourceNode(ast.leftSide, sourceFile, indent);
    const rightSideNode: SourceNode = compileJavaScriptToSourceNode(ast.rightSide, sourceFile, indent);
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
  const conditionNode: SourceNode = compileJavaScriptToSourceNode(ast.condition, sourceFile, indent);
  const valueIfTrueNode: SourceNode = compileJavaScriptToSourceNode(ast.valueIfTrue, sourceFile, indent);
  const valueIfFalseNode: SourceNode = compileJavaScriptToSourceNode(ast.valueIfFalse, sourceFile, indent);
  return new SourceNode(
    ast.line,
    ast.column,
    sourceFile,
    ["(", conditionNode, " ? ", valueIfTrueNode, " : ", valueIfFalseNode, ")"],
  );
}

function compileJavaScriptConsoleLogStatement(ast: JavaScriptConsoleLogStatement,
                                              sourceFile: string | null = null,
                                              indent: number = 0): SourceNode {
  const objectNode: SourceNode = compileJavaScriptToSourceNode(ast.object, sourceFile, indent);
  return new SourceNode(
    ast.line,
    ast.column,
    sourceFile,
    [
      "(function () {\n",
      " ".repeat(indent + 2), "const _ = ", objectNode, ";\n",
      " ".repeat(indent + 2), "console.log(_);\n",
      " ".repeat(indent + 2), "return _;\n",
      " ".repeat(indent), "})()",
    ],
  );
}

function compileJavaScriptFunctionCall(ast: JavaScriptFunctionCall,
                                       sourceFile: string | null = null,
                                       indent: number = 0): SourceNode {
  const argNodes: SourceNode[] =
    ast.args.map((item: JavaScriptNode): JavaScriptNode => compileJavaScriptToSourceNode(item, sourceFile, indent));
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

function compileJavaScriptFunctionDefinition(ast: JavaScriptFunctionDefinition,
                                             sourceFile: string | null = null,
                                             indent: number = 0): SourceNode {
    const functionBodyNode: SourceNode = compileJavaScriptToSourceNode(ast.body, sourceFile, indent + 2);
    return new SourceNode(
      ast.line,
      ast.column,
      sourceFile,
      ["(function (", ast.params.join(", "), ") {\n",
      " ".repeat(indent + 2), "return ", functionBodyNode, ";\n", " ".repeat(indent), "})"],
    );
}

function compileJavaScriptIIFE(ast: JavaScriptIIFE,
                               sourceFile: string | null = null,
                               indent: number = 0): SourceNode {
  const statementNodes: SourceNode[] = ast.nodes.slice(0, ast.nodes.length - 1)
    .map((node: JavaScriptNode): JavaScriptNode => compileJavaScriptToSourceNode(node, sourceFile, indent + 2));
  const statementNodesWithLineBreaks: any[] = [];
  statementNodes.forEach((statementNode: SourceNode): void => {
    statementNodesWithLineBreaks.push(" ".repeat(indent + 2));
    statementNodesWithLineBreaks.push(statementNode);
    statementNodesWithLineBreaks.push("\n");
  });
  const returnValueNode: SourceNode =
    compileJavaScriptToSourceNode(ast.nodes[ast.nodes.length - 1], sourceFile, indent + 2);

  if (statementNodes.length === 0) {
    return new SourceNode(
      ast.line,
      ast.column,
      sourceFile,
      [
        "(function () {\n",
        " ".repeat(indent + 2), "return ", returnValueNode, ";\n",
        " ".repeat(indent), "})()",
      ],
    );
  } else {
    return new SourceNode(
      ast.line,
      ast.column,
      sourceFile,
      [
        "(function () {\n",
        ...statementNodes,
        " ".repeat(indent + 2), "return ", returnValueNode, ";\n",
        " ".repeat(indent), "})()",
      ],
    );
  }
}

function compileJavaScriptMethodCall(ast: JavaScriptMethodCall,
                                     sourceFile: string | null = null,
                                     indent: number = 0): SourceNode {
  const objectNode: SourceNode = compileJavaScriptToSourceNode(ast.object, sourceFile, indent);
  const argNodes: SourceNode[] =
    ast.args.map((item: JavaScriptNode): JavaScriptNode => compileJavaScriptToSourceNode(item, sourceFile, indent));
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
    [objectNode, ".", ast.methodName, "(", ...argNodesWithCommas, ")"],
  );
}

function compileJavaScriptToSourceNode(ast: JavaScriptNode,
                                       sourceFile: string | null = null,
                                       indent: number = 0): SourceNode {
  if (ast.type === JavaScriptNodeType.ARRAY) {
    return compileJavaScriptArray(ast, sourceFile, indent);
  } else if (ast.type === JavaScriptNodeType.ARRAY_ACCESS) {
    return compileJavaScriptArrayAccess(ast, sourceFile, indent);
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
  } else if (ast.type === JavaScriptNodeType.CONSOLE_LOG_STATEMENT) {
    return compileJavaScriptConsoleLogStatement(ast, sourceFile, indent);
  } else if (ast.type === JavaScriptNodeType.FUNCTION_CALL) {
    return compileJavaScriptFunctionCall(ast, sourceFile, indent);
  } else if (ast.type === JavaScriptNodeType.FUNCTION_DEFINITION) {
    return compileJavaScriptFunctionDefinition(ast, sourceFile, indent);
  } else if (ast.type === JavaScriptNodeType.IIFE) {
    return compileJavaScriptIIFE(ast, sourceFile, indent);
  } else if (ast.type === JavaScriptNodeType.METHOD_CALL) {
    return compileJavaScriptMethodCall(ast, sourceFile, indent);
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
  } else if (ast.type === JavaScriptNodeType.PROPERTY_ACCESS) {
    const objectNode: SourceNode = compileJavaScriptToSourceNode(ast.object, sourceFile, indent);
    return new SourceNode(
      ast.line,
      ast.column,
      sourceFile,
      [objectNode, ".", ast.propertyName],
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
      ast.name,
    );
  } else {
    throw new Error("unrecognized node");
  }
}

function compileChipmunkFileToJavaScript(path: string): void {
  const input: string = fs.readFileSync(path).toString();
  const tokenizer: Tokenizer = new Tokenizer(input);
  const parser: Parser = new Parser(tokenizer.tokenize());
  const chipmunkAst: ChipmunkType = parser.parse();

  const javaScriptAst: JavaScriptNode = convertChipmunkNodeToJavaScriptNode(chipmunkAst, true);
  const javaScriptCodeFile: string = path.replace(/.\w+$/, ".js");
  const javaScriptSourceMapFile: string = javaScriptCodeFile + ".map";

  const generatedCode: CodeWithSourceMap = compileJavaScriptToSourceNode(javaScriptAst, path).toStringWithSourceMap({
    file: javaScriptCodeFile,
  });
  fs.writeFileSync(javaScriptCodeFile, generatedCode.code + "\n//# sourceMappingURL=" + javaScriptSourceMapFile + "\n");
  fs.writeFileSync(javaScriptSourceMapFile, generatedCode.map.toString());
}

export {
  compileJavaScriptToSourceNode,
  compileChipmunkFileToJavaScript,
  convertChipmunkNodeToJavaScriptNode,
};
