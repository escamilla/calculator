import ChipmunkNodeBase from "./ChipmunkNodeBase";
import ChipmunkNodeType from "./ChipmunkNodeType";

interface ChipmunkString extends ChipmunkNodeBase {
  type: ChipmunkNodeType.STRING;
  value: string;
}

export default ChipmunkString;
