import TokenType from "./TokenType";

interface Token {
  type: TokenType;
  value: any;
  line: number;
  column: number;
}

export default Token;
