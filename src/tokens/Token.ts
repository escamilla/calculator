import TokenType from "./TokenType";

class Token {
  public constructor(public readonly type: TokenType, public readonly value: any) { }
}

export default Token;
