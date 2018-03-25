class SquirrelNumber {
  public constructor(
    public readonly value: number,
    public readonly line?: number,
    public readonly column?: number,
  ) {}
}

export default SquirrelNumber;
