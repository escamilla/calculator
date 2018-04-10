import TokenType from "./TokenType";

interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
}

export default Token;
