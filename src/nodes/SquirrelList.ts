import SquirrelNode from "./SquirrelNode";
import SquirrelNodeBase from "./SquirrelNodeBase";
import SquirrelNodeType from "./SquirrelNodeType";

interface SquirrelList extends SquirrelNodeBase {
  type: SquirrelNodeType.LIST;
  items: SquirrelNode[];
}

export default SquirrelList;
