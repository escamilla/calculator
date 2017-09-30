class LambdaNode {
  constructor(public readonly parameters: any[], public readonly body: any) { }

  public toString(): string {
    return `(lambda ${this.parameters.toString()} ${this.body.toString()})`;
  }
}

export default LambdaNode;
