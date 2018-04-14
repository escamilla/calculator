import IOHandler from "../io/IOHandler";
import ChipmunkNode from "./ChipmunkNode";
import ChipmunkNodeBase from "./ChipmunkNodeBase";
import ChipmunkNodeType from "./ChipmunkNodeType";
import ChipmunkSymbol from "./ChipmunkSymbol";

interface ChipmunkFunction extends ChipmunkNodeBase {
  type: ChipmunkNodeType.FUNCTION;
  callable: (args: ChipmunkNode[], ioHandler: IOHandler) => ChipmunkNode;
  isUserDefined: boolean;
  name?: string;
  params?: ChipmunkSymbol[];
  body?: ChipmunkNode;
}

export default ChipmunkFunction;
