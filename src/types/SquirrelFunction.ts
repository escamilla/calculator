import SquirrelSymbol from "./SquirrelSymbol";
import SquirrelType from "./SquirrelType";

class SquirrelFunction {
  public callable: (args: SquirrelType[]) => SquirrelType;
  public isUserDefined: boolean = false;
  public name: string | undefined;
  public params: SquirrelSymbol[] | undefined;
  public body: SquirrelType | undefined;

  public constructor(callable: (args: SquirrelType[]) => SquirrelType) {
    this.callable = callable;
  }

  public toString(): string {
    if (this.isUserDefined) {
      const stringParams: string = (this.params as SquirrelSymbol[])
        .map((param: SquirrelSymbol) => param.name).join(" ");
      const stringBody: string = (this.body as SquirrelType).toString();
      return `(lambda (${stringParams}) ${stringBody})`;
    } else {
      return this.name as string;
    }
  }
}

export default SquirrelFunction;
