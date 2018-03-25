class SquirrelSymbol {
  public constructor(
    public readonly name: string,
    public readonly line?: number,
    public readonly column?: number,
  ) {}
}

export default SquirrelSymbol;
