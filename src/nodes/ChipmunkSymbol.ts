import ChipmunkNodeBase from "./ChipmunkNodeBase";
import ChipmunkNodeType from "./ChipmunkNodeType";

interface ChipmunkSymbol extends ChipmunkNodeBase {
  type: ChipmunkNodeType.SYMBOL;
  name: string;
}

export default ChipmunkSymbol;
