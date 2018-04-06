import SquirrelNodeType from "./SquirrelNodeType";

interface SquirrelNodeBase {
  type: SquirrelNodeType;
  line?: number;
  column?: number;
}

export default SquirrelNodeBase;
