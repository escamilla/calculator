import ChipmunkNodeBase from "./ChipmunkNodeBase";
import ChipmunkNodeType from "./ChipmunkNodeType";

interface ChipmunkBoolean extends ChipmunkNodeBase {
  type: ChipmunkNodeType.BOOLEAN;
  value: boolean;
}

export default ChipmunkBoolean;
