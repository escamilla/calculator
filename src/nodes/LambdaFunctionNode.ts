class LambdaFunctionNode {
  constructor(public parameters, public body) {
    this.parameters = parameters;
    this.body = body;
  }

  public toString() {
    return `(lambda ${this.parameters.toString()} ${this.body.toString()})`;
  }
}

export default LambdaFunctionNode;
