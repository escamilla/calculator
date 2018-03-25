class SquirrelBoolean {
  public constructor(
    public readonly value: boolean,
    public readonly line?: number,
    public readonly column?: number,
  ) {}
}

export default SquirrelBoolean;
