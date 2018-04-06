import SquirrelNodeBase from "./SquirrelNodeBase";
import SquirrelNodeType from "./SquirrelNodeType";

interface SquirrelNumber extends SquirrelNodeBase {
  type: SquirrelNodeType.NUMBER;
  value: number;
}

export default SquirrelNumber;
