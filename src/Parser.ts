import Token from "./tokens/Token";
import TokenType from "./tokens/TokenType";

import ListNode from "./nodes/ListNode";
import NumberNode from "./nodes/NumberNode";
import StringNode from "./nodes/StringNode";
import SymbolNode from "./nodes/SymbolNode";

class Parser {
  public position;

  constructor(public tokens: Token[]) {
    this.position = 0;
  }

  public parse() {
    const result = this.parseExpression();
    if (!this.eof()) {
      throw new Error("Expected end of file after expression");
    }
    return result;
  }

  private peek(): Token {
    return this.tokens[this.position];
  }

  private next(): Token {
    const token = this.tokens[this.position];
    this.position += 1;
    return token;
  }

  private eof() {
    return this.position >= this.tokens.length;
  }

  private consumeToken(expectedType: TokenType): Token {
    const token: Token = this.next();
    if (token.type === expectedType) {
      return token;
    }
    throw new Error(`Expected token of type ${expectedType} but got token of type ${token.type}`);
  }

  private parseExpression() {
    switch (this.peek().type) {
      case TokenType.LEFT_PARENTHESIS:
        return this.parseSymbolicExpression();
      case TokenType.NUMBER:
        return this.parseNumber();
      case TokenType.SYMBOL:
        return this.parseSymbol();
      case TokenType.STRING:
        return this.parseString();
      case TokenType.SINGLE_QUOTE:
        return this.parseQuotedExpression();
      default:
        throw new Error("Expected number, symbol, or symbolic expression");
    }
  }

  private parseNumber() {
    return new NumberNode(this.consumeToken(TokenType.NUMBER).value);
  }

  private parseSymbol() {
    return new SymbolNode(this.consumeToken(TokenType.SYMBOL).value);
  }

  private parseString() {
    return new StringNode(this.consumeToken(TokenType.STRING).value);
  }

  private parseSymbolicExpression() {
    this.consumeToken(TokenType.LEFT_PARENTHESIS);
    const items = [];
    while (this.peek().type !== TokenType.RIGHT_PARENTHESIS) {
      items.push(this.parseExpression());
    }
    this.consumeToken(TokenType.RIGHT_PARENTHESIS);
    return new ListNode(items);
  }

  private parseQuotedExpression() {
    this.consumeToken(TokenType.SINGLE_QUOTE);
    return new ListNode([new SymbolNode("quote"), this.parseExpression()]);
  }
}

export default Parser;
