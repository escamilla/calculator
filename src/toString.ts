import escapeString from "./escapeString";
import SquirrelNode from "./nodes/SquirrelNode";
import SquirrelNodeType from "./nodes/SquirrelNodeType";
import SquirrelSymbol from "./nodes/SquirrelSymbol";

function toString(ast: SquirrelNode, printable: boolean = false): string {
  if (ast.type === SquirrelNodeType.BOOLEAN) {
    return ast.value ? "true" : "false";
  } else if (ast.type === SquirrelNodeType.FUNCTION) {
    if (ast.isUserDefined) {
      const stringParams: string = (ast.params as SquirrelSymbol[])
        .map((param: SquirrelSymbol) => param.name).join(" ");
      const stringBody: string = toString(ast.body as SquirrelNode);
      return `(lambda (${stringParams}) ${stringBody})`;
    } else {
      return ast.name as string;
    }
  } else if (ast.type === SquirrelNodeType.LIST) {
    return `(${ast.items.map((item: SquirrelNode) => toString(item)).join(" ")})`;
  } else if (ast.type === SquirrelNodeType.NIL) {
    return "nil";
  } else if (ast.type === SquirrelNodeType.NUMBER) {
    return `${ast.value}`;
  } else if (ast.type === SquirrelNodeType.STRING) {
    if (printable) {
      return ast.value;
    } else {
      return escapeString(ast.value);
    }
  } else if (ast.type === SquirrelNodeType.SYMBOL) {
    return ast.name;
  }
  throw new Error("unknown data type");
}

export default toString;
