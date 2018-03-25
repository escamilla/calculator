class SquirrelString {
  public constructor(
    public readonly value: string,
    public readonly line?: number,
    public readonly column?: number,
  ) {}
}

export default SquirrelString;
