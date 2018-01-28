class SquirrelBoolean {
  public constructor(public readonly value: boolean) {
  }

  public toString(): string {
    return this.value ? "true" : "false";
  }
}

export default SquirrelBoolean;
