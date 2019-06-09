export enum TokenType {
  LeftCurlyBrace,
  LeftParenthesis,
  Number,
  RightCurlyBrace,
  RightParenthesis,
  SingleQuote,
  String,
  Symbol,
}

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
}
