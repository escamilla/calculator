class JavaScriptNumber {
  public constructor(
    public readonly line: number,
    public readonly column: number,
    public readonly value: number,
  ) {}
}

export default JavaScriptNumber;
