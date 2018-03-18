import IOHandler from "../IOHandler";
import SquirrelSymbol from "./SquirrelSymbol";
import SquirrelType from "./SquirrelType";

class SquirrelFunction {
  public callable: (args: SquirrelType[], ioHandler: IOHandler) => SquirrelType;
  public isUserDefined: boolean = false;
  public name: string | undefined;
  public params: SquirrelSymbol[] | undefined;
  public body: SquirrelType | undefined;

  public constructor(callable: (args: SquirrelType[], ioHandler: IOHandler) => SquirrelType) {
    this.callable = callable;
  }
}

export default SquirrelFunction;
