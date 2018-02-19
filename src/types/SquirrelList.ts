import SquirrelType from "./SquirrelType";

class SquirrelList {
  public constructor(public readonly items: SquirrelType[]) {
  }

  public toString(): string {
    return `(${this.items.map((element: SquirrelType) => element.toString()).join(" ")})`;
  }
}

export default SquirrelList;
