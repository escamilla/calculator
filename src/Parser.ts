import SquirrelList from "./nodes/SquirrelList";
import SquirrelNode from "./nodes/SquirrelNode";
import SquirrelNodeType from "./nodes/SquirrelNodeType";
import SquirrelNumber from "./nodes/SquirrelNumber";
import SquirrelString from "./nodes/SquirrelString";
import SquirrelSymbol from "./nodes/SquirrelSymbol";
import Token from "./tokens/Token";
import TokenType from "./tokens/TokenType";

class Parser {
  private position: number = 0;

  public constructor(private readonly tokens: Token[]) { }

  public parse(): SquirrelNode {
    const result: SquirrelNode = this.parseExpression();
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

  private parseExpression(): SquirrelNode {
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
    return {
      type: SquirrelNodeType.NUMBER,
      value: token.value,
      line: token.line,
      column: token.column,
    };
  }

  private parseSymbol(): SquirrelSymbol {
    const token: Token = this.consumeToken(TokenType.SYMBOL);
    return {
      type: SquirrelNodeType.SYMBOL,
      name: token.value,
      line: token.line,
      column: token.column,
    };
  }

  private parseString(): SquirrelString {
    const token: Token = this.consumeToken(TokenType.STRING);
    return {
      type: SquirrelNodeType.STRING,
      value: token.value,
      line: token.line,
      column: token.column,
    };
  }

  private parseSymbolicExpression(): SquirrelList {
    const firstToken: Token = this.consumeToken(TokenType.LEFT_PARENTHESIS);
    const items: SquirrelNode[] = [];
    while (this.peek().type !== TokenType.RIGHT_PARENTHESIS) {
      items.push(this.parseExpression());
    }
    this.consumeToken(TokenType.RIGHT_PARENTHESIS);
    return {
      type: SquirrelNodeType.LIST,
      items,
      line: firstToken.line,
      column: firstToken.column,
    };
  }

  private parseQuotedExpression(): SquirrelList {
    const firstToken: Token = this.consumeToken(TokenType.SINGLE_QUOTE);
    return {
      type: SquirrelNodeType.LIST,
      items: [
        {
          type: SquirrelNodeType.SYMBOL,
          name: "quote",
        },
        this.parseExpression(),
      ],
      line: firstToken.line,
      column: firstToken.column,
    };
  }
}

export default Parser;
