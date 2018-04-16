import ChipmunkNode from "./ChipmunkNode";
import ChipmunkNodeBase from "./ChipmunkNodeBase";
import ChipmunkNodeType from "./ChipmunkNodeType";

interface ChipmunkMap extends ChipmunkNodeBase {
  type: ChipmunkNodeType.MAP;
  entries: Map<string, ChipmunkNode>;
}

export default ChipmunkMap;
