import escapeString from "./escapeString";
import SquirrelBoolean from "./types/SquirrelBoolean";
import SquirrelFunction from "./types/SquirrelFunction";
import SquirrelList from "./types/SquirrelList";
import SquirrelNil from "./types/SquirrelNil";
import SquirrelNumber from "./types/SquirrelNumber";
import SquirrelString from "./types/SquirrelString";
import SquirrelSymbol from "./types/SquirrelSymbol";
import SquirrelType from "./types/SquirrelType";

function toString(input: SquirrelType, printable: boolean = false): string {
  if (input instanceof SquirrelBoolean) {
    return input.value ? "true" : "false";
  } else if (input instanceof SquirrelFunction) {
    if (input.isUserDefined) {
      const stringParams: string = (input.params as SquirrelSymbol[])
        .map((param: SquirrelSymbol) => param.name).join(" ");
      const stringBody: string = toString(input.body as SquirrelType);
      return `(lambda (${stringParams}) ${stringBody})`;
    } else {
      return input.name as string;
    }
  } else if (input instanceof SquirrelList) {
    return `(${input.items.map((item: SquirrelType) => toString(item)).join(" ")})`;
  } else if (input instanceof SquirrelNil) {
    return "nil";
  } else if (input instanceof SquirrelNumber) {
    return `${input.value}`;
  } else if (input instanceof SquirrelString) {
    if (printable) {
      return input.value;
    } else {
      return escapeString(input.value);
    }
  } else if (input instanceof SquirrelSymbol) {
    return input.name;
  }
  throw new Error("unknown data type");
}

export default toString;
