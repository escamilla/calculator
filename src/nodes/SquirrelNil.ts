import SquirrelNodeBase from "./SquirrelNodeBase";
import SquirrelNodeType from "./SquirrelNodeType";

interface SquirrelNil extends SquirrelNodeBase {
  type: SquirrelNodeType.NIL;
}

export default SquirrelNil;
