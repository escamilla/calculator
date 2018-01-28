class SquirrelString {
  public constructor(public readonly value: string) {
  }

  public toString(): string {
    return `"${this.value}"`;
  }
}

export default SquirrelString;
