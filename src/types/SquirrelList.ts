import SquirrelType from "./SquirrelType";

class SquirrelList {
  public constructor(
    public readonly items: SquirrelType[],
    public readonly line?: number,
    public readonly column?: number,
  ) {}
}

export default SquirrelList;
