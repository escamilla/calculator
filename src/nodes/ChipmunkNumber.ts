import ChipmunkNodeBase from "./ChipmunkNodeBase";
import ChipmunkNodeType from "./ChipmunkNodeType";

interface ChipmunkNumber extends ChipmunkNodeBase {
  type: ChipmunkNodeType.NUMBER;
  value: number;
}

export default ChipmunkNumber;
