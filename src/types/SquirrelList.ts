import SquirrelType from "./SquirrelType";

class SquirrelList {
  public constructor(public readonly elements: SquirrelType[]) {
  }

  public toString(): string {
    return `(${this.elements.map((element: SquirrelType) => element.toString()).join(" ")})`;
  }
}

export default SquirrelList;
