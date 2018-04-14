import ChipmunkBoolean from "./ChipmunkBoolean";
import ChipmunkFunction from "./ChipmunkFunction";
import ChipmunkList from "./ChipmunkList";
import ChipmunkNil from "./ChipmunkNil";
import ChipmunkNumber from "./ChipmunkNumber";
import ChipmunkString from "./ChipmunkString";
import ChipmunkSymbol from "./ChipmunkSymbol";

type ChipmunkNode = ChipmunkBoolean
                  | ChipmunkFunction
                  | ChipmunkList
                  | ChipmunkNil
                  | ChipmunkNumber
                  | ChipmunkString
                  | ChipmunkSymbol;

export default ChipmunkNode;
