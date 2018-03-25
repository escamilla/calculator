class JavaScriptString {
  public constructor(
    public readonly line: number,
    public readonly column: number,
    public readonly value: string,
  ) {}
}

export default JavaScriptString;
