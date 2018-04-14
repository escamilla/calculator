import ChipmunkNode from "./ChipmunkNode";
import ChipmunkNodeBase from "./ChipmunkNodeBase";
import ChipmunkNodeType from "./ChipmunkNodeType";

interface ChipmunkList extends ChipmunkNodeBase {
  type: ChipmunkNodeType.LIST;
  items: ChipmunkNode[];
}

export default ChipmunkList;
