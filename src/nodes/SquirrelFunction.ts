import IOHandler from "../io/IOHandler";
import SquirrelNode from "./SquirrelNode";
import SquirrelNodeBase from "./SquirrelNodeBase";
import SquirrelNodeType from "./SquirrelNodeType";
import SquirrelSymbol from "./SquirrelSymbol";

interface SquirrelFunction extends SquirrelNodeBase {
  type: SquirrelNodeType.FUNCTION;
  callable: (args: SquirrelNode[], ioHandler: IOHandler) => SquirrelNode;
  isUserDefined: boolean;
  name?: string;
  params?: SquirrelSymbol[];
  body?: SquirrelNode;
}

export default SquirrelFunction;
