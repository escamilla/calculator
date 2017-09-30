import Token from "./tokens/Token";
import TokenType from "./tokens/TokenType";

import INode from "./nodes/INode";
import ListNode from "./nodes/ListNode";
import NumberNode from "./nodes/NumberNode";
import StringNode from "./nodes/StringNode";
import SymbolNode from "./nodes/SymbolNode";

class Parser {
  private position: number = 0;

  constructor(private readonly tokens: Token[]) { }

  public parse(): INode {
    const result: INode = this.parseExpression();
    if (!this.eof()) {
      throw new Error("Expected end of file after expression");
    }
    return result;
  }

  private peek(): Token {
    return this.tokens[this.position];
  }

  private next(): Token {
    const token: Token = this.tokens[this.position];
    this.position += 1;
    return token;
  }

  private eof(): boolean {
    return this.position >= this.tokens.length;
  }

  private consumeToken(expectedType: TokenType): Token {
    const token: Token = this.next();
    if (token.type === expectedType) {
      return token;
    }
    throw new Error(`Expected token of type ${expectedType} but got token of type ${token.type}`);
  }

  private parseExpression(): INode {
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

  private parseNumber(): NumberNode {
    return new NumberNode(this.consumeToken(TokenType.NUMBER).value);
  }

  private parseSymbol(): SymbolNode {
    return new SymbolNode(this.consumeToken(TokenType.SYMBOL).value);
  }

  private parseString(): StringNode {
    return new StringNode(this.consumeToken(TokenType.STRING).value);
  }

  private parseSymbolicExpression(): ListNode {
    this.consumeToken(TokenType.LEFT_PARENTHESIS);
    const items: INode[] = [];
    while (this.peek().type !== TokenType.RIGHT_PARENTHESIS) {
      items.push(this.parseExpression());
    }
    this.consumeToken(TokenType.RIGHT_PARENTHESIS);
    return new ListNode(items);
  }

  private parseQuotedExpression(): ListNode {
    this.consumeToken(TokenType.SINGLE_QUOTE);
    return new ListNode([new SymbolNode("quote"), this.parseExpression()]);
  }
}

export default Parser;
