class LambdaNode {
  constructor(public parameters: any[], public body: any) { }

  public toString(): string {
    return `(lambda ${this.parameters.toString()} ${this.body.toString()})`;
  }
}

export default LambdaNode;
