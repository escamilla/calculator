import SquirrelNodeBase from "./SquirrelNodeBase";
import SquirrelNodeType from "./SquirrelNodeType";

interface SquirrelSymbol extends SquirrelNodeBase {
  type: SquirrelNodeType.SYMBOL;
  name: string;
}

export default SquirrelSymbol;
