import SquirrelNodeBase from "./SquirrelNodeBase";
import SquirrelNodeType from "./SquirrelNodeType";

interface SquirrelBoolean extends SquirrelNodeBase {
  type: SquirrelNodeType.BOOLEAN;
  value: boolean;
}

export default SquirrelBoolean;
