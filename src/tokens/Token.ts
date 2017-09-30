import TokenType from "./TokenType";

class Token {
  constructor(public readonly type: TokenType, public readonly value: any) { }
}

export default Token;
