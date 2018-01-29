import SquirrelSymbol from "./SquirrelSymbol";
import SquirrelType from "./SquirrelType";

class SquirrelFunction {
  public callable: (args: SquirrelType[]) => SquirrelType;
  public isUserDefined: boolean = false;
  public name: string;
  public params: SquirrelSymbol[];
  public body: SquirrelType;

  public constructor(callable: (args: SquirrelType[]) => SquirrelType) {
    this.callable = callable;
  }

  public toString(): string {
    if (this.isUserDefined) {
      const stringParams: string = this.params.map((param: SquirrelSymbol) => param.name).join(" ");
      const stringBody: string = this.body.toString();
      return `(lambda (${stringParams}) ${stringBody})`;
    } else {
      return this.name;
    }
  }
}

export default SquirrelFunction;
