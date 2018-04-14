import ChipmunkNode from "../nodes/ChipmunkNode";
import ChipmunkNodeType from "../nodes/ChipmunkNodeType";
import ChipmunkSymbol from "../nodes/ChipmunkSymbol";
import escapeString from "./escapeString";

function toString(ast: ChipmunkNode, printable: boolean = false): string {
  if (ast.type === ChipmunkNodeType.BOOLEAN) {
    return ast.value ? "true" : "false";
  } else if (ast.type === ChipmunkNodeType.FUNCTION) {
    if (ast.isUserDefined) {
      const stringParams: string = (ast.params as ChipmunkSymbol[])
        .map((param: ChipmunkSymbol) => param.name).join(" ");
      const stringBody: string = toString(ast.body as ChipmunkNode);
      return `(lambda (${stringParams}) ${stringBody})`;
    } else {
      return ast.name as string;
    }
  } else if (ast.type === ChipmunkNodeType.LIST) {
    return `(${ast.items.map((item: ChipmunkNode) => toString(item)).join(" ")})`;
  } else if (ast.type === ChipmunkNodeType.NIL) {
    return "nil";
  } else if (ast.type === ChipmunkNodeType.NUMBER) {
    return `${ast.value}`;
  } else if (ast.type === ChipmunkNodeType.STRING) {
    if (printable) {
      return ast.value;
    } else {
      return escapeString(ast.value);
    }
  } else if (ast.type === ChipmunkNodeType.SYMBOL) {
    return ast.name;
  }
  throw new Error("unknown data type");
}

export default toString;
