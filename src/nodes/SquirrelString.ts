import SquirrelNodeBase from "./SquirrelNodeBase";
import SquirrelNodeType from "./SquirrelNodeType";

interface SquirrelString extends SquirrelNodeBase {
  type: SquirrelNodeType.STRING;
  value: string;
}

export default SquirrelString;
