import Token from "./tokens/Token";
import TokenType from "./tokens/TokenType";
import SquirrelList from "./types/SquirrelList";
import SquirrelNumber from "./types/SquirrelNumber";
import SquirrelString from "./types/SquirrelString";
import SquirrelSymbol from "./types/SquirrelSymbol";
import SquirrelType from "./types/SquirrelType";

class Parser {
  private position: number = 0;

  public constructor(private readonly tokens: Token[]) { }

  public parse(): SquirrelType {
    const result: SquirrelType = this.parseExpression();
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

  private parseExpression(): SquirrelType {
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

  private parseNumber(): SquirrelNumber {
    const token: Token = this.consumeToken(TokenType.NUMBER);
    return new SquirrelNumber(token.value, token.line, token.column);
  }

  private parseSymbol(): SquirrelSymbol {
    const token: Token = this.consumeToken(TokenType.SYMBOL);
    return new SquirrelSymbol(token.value, token.line, token.column);
  }

  private parseString(): SquirrelString {
    const token: Token = this.consumeToken(TokenType.STRING);
    return new SquirrelString(token.value, token.line, token.column);
  }

  private parseSymbolicExpression(): SquirrelList {
    const firstToken: Token = this.consumeToken(TokenType.LEFT_PARENTHESIS);
    const items: SquirrelType[] = [];
    while (this.peek().type !== TokenType.RIGHT_PARENTHESIS) {
      items.push(this.parseExpression());
    }
    this.consumeToken(TokenType.RIGHT_PARENTHESIS);
    return new SquirrelList(items, firstToken.line, firstToken.column);
  }

  private parseQuotedExpression(): SquirrelList {
    const firstToken: Token = this.consumeToken(TokenType.SINGLE_QUOTE);
    return new SquirrelList([new SquirrelSymbol("quote"), this.parseExpression()], firstToken.column, firstToken.line);
  }
}

export default Parser;
