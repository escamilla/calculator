class JavaScriptVariable {
  public constructor(
    public readonly line: number,
    public readonly column: number,
    public readonly name: string,
  ) {}
}

export default JavaScriptVariable;
