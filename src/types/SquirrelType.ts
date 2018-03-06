import SquirrelBoolean from "./SquirrelBoolean";
import SquirrelFunction from "./SquirrelFunction";
import SquirrelList from "./SquirrelList";
import SquirrelNil from "./SquirrelNil";
import SquirrelNumber from "./SquirrelNumber";
import SquirrelString from "./SquirrelString";
import SquirrelSymbol from "./SquirrelSymbol";

type SquirrelType =
  SquirrelBoolean |
  SquirrelFunction |
  SquirrelList |
  SquirrelNil |
  SquirrelNumber |
  SquirrelString |
  SquirrelSymbol;

export default SquirrelType;
