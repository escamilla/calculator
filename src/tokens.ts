export enum TokenType {
  LeftCurlyBrace,
  LeftParenthesis,
  LeftSquareBracket,
  Number,
  RightCurlyBrace,
  RightParenthesis,
  RightSquareBracket,
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
