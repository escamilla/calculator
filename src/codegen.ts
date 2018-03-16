import escapeString from "./escapeString";
import JavaScriptArray from "./js/JavaScriptArray";
import JavaScriptBinaryOperation from "./js/JavaScriptBinaryOperation";
import JavaScriptBoolean from "./js/JavaScriptBoolean";
import JavaScriptNode from "./js/JavaScriptNode";
import JavaScriptNull from "./js/JavaScriptNull";
import JavaScriptNumber from "./js/JavaScriptNumber";
import JavaScriptString from "./js/JavaScriptString";
import SquirrelBoolean from "./types/SquirrelBoolean";
import SquirrelList from "./types/SquirrelList";
import SquirrelNil from "./types/SquirrelNil";
import SquirrelNumber from "./types/SquirrelNumber";
import SquirrelString from "./types/SquirrelString";
import SquirrelSymbol from "./types/SquirrelSymbol";
import SquirrelType from "./types/SquirrelType";

const binaryOperators: string[] = ["+", "-", "*", "/", "%"];

function codegen(ast: SquirrelType): JavaScriptNode {
  if (ast instanceof SquirrelList) {
    const head: SquirrelType = ast.items[0];
    if (head instanceof SquirrelSymbol) {
      if (binaryOperators.includes(head.name)) {
        const operator: string = head.name;
        const leftSide: SquirrelType = ast.items[1];
        const rightSide: SquirrelType = ast.items[2];
        return new JavaScriptBinaryOperation(operator, codegen(leftSide), codegen(rightSide));
      }
    }
    const items: JavaScriptNode[] = ast.items.map((item: SquirrelType) => codegen(item));
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
    }
  }

  throw new Error("not implemented");
}

function convertToString(ast: JavaScriptNode): string {
  if (ast instanceof JavaScriptArray) {
    const itemStrings: string[] = ast.items.map((item: JavaScriptNode) => convertToString(item));
    return "[" + itemStrings.join(", ") + "]";
  } else if (ast instanceof JavaScriptBinaryOperation) {
    const leftSide: string = convertToString(ast.leftSide);
    const rightSide: string = convertToString(ast.rightSide);
    return `(${leftSide} ${ast.operator} ${rightSide})`;
  } else if (ast instanceof JavaScriptBoolean) {
    return ast.value ? "true" : "false";
  } else if (ast instanceof JavaScriptNull) {
    return "null";
  } else if (ast instanceof JavaScriptNumber) {
    return ast.value.toString();
  } else if (ast instanceof JavaScriptString) {
    return escapeString(ast.value);
  }

  throw new Error("not implemented");
}

export { codegen, convertToString };
