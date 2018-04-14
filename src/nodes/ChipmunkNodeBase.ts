import ChipmunkNodeType from "./ChipmunkNodeType";

interface ChipmunkNodeBase {
  type: ChipmunkNodeType;
  line?: number;
  column?: number;
}

export default ChipmunkNodeBase;
