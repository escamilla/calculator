import TokenType from "./TokenType";

class Token {
  public constructor(public readonly line: number,
                     public readonly column: number,
                     public readonly type: TokenType,
                     public readonly value: any) {}
}

export default Token;
