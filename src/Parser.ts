import ChipmunkList from "./nodes/ChipmunkList";
import ChipmunkMap from "./nodes/ChipmunkMap";
import ChipmunkNode from "./nodes/ChipmunkNode";
import ChipmunkNodeType from "./nodes/ChipmunkNodeType";
import ChipmunkNumber from "./nodes/ChipmunkNumber";
import ChipmunkString from "./nodes/ChipmunkString";
import ChipmunkSymbol from "./nodes/ChipmunkSymbol";
import Token from "./tokens/Token";
import TokenType from "./tokens/TokenType";

class Parser {
  private position: number = 0;

  public constructor(private readonly tokens: Token[]) { }

  public parse(): ChipmunkNode {
    const result: ChipmunkNode = this.parseExpression();
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

  private parseExpression(): ChipmunkNode {
    switch (this.peek().type) {
      case TokenType.LEFT_CURLY_BRACE:
        return this.parseMap();
      case TokenType.LEFT_PARENTHESIS:
        return this.parseSymbolicExpression();
      case TokenType.NUMBER:
        return this.parseNumber();
      case TokenType.SINGLE_QUOTE:
        return this.parseQuotedExpression();
      case TokenType.STRING:
        return this.parseString();
      case TokenType.SYMBOL:
        return this.parseSymbol();
      default:
        const actualType: string = TokenType[this.peek().type];
        throw new Error(`expected expression but got token of type ${actualType}`);
    }
  }

  private parseMap(): ChipmunkMap {
    const firstToken: Token = this.consumeToken(TokenType.LEFT_CURLY_BRACE);
    const entries: Map<string, ChipmunkNode> = new Map();
    while (this.peek().type !== TokenType.RIGHT_CURLY_BRACE) {
      const key: ChipmunkNode = this.parseExpression();
      if (key.type !== ChipmunkNodeType.STRING) {
        const actualType: string = ChipmunkNodeType[key.type];
        throw new Error(`expected dictionary key to be of type STRING, but got type ${actualType}`);
      }
      const value: ChipmunkNode = this.parseExpression();
      entries.set(key.value, value);
    }
    this.consumeToken(TokenType.RIGHT_CURLY_BRACE);
    return {
      type: ChipmunkNodeType.MAP,
      entries,
      line: firstToken.line,
      column: firstToken.column,
    };
  }

  private parseNumber(): ChipmunkNumber {
    const token: Token = this.consumeToken(TokenType.NUMBER);
    return {
      type: ChipmunkNodeType.NUMBER,
      value: parseFloat(token.value),
      line: token.line,
      column: token.column,
    };
  }

  private parseString(): ChipmunkString {
    const token: Token = this.consumeToken(TokenType.STRING);
    return {
      type: ChipmunkNodeType.STRING,
      value: token.value,
      line: token.line,
      column: token.column,
    };
  }

  private parseSymbol(): ChipmunkSymbol {
    const token: Token = this.consumeToken(TokenType.SYMBOL);
    return {
      type: ChipmunkNodeType.SYMBOL,
      name: token.value,
      line: token.line,
      column: token.column,
    };
  }

  private parseSymbolicExpression(): ChipmunkList {
    const firstToken: Token = this.consumeToken(TokenType.LEFT_PARENTHESIS);
    const items: ChipmunkNode[] = [];
    while (this.peek().type !== TokenType.RIGHT_PARENTHESIS) {
      items.push(this.parseExpression());
    }
    this.consumeToken(TokenType.RIGHT_PARENTHESIS);
    return {
      type: ChipmunkNodeType.LIST,
      items,
      line: firstToken.line,
      column: firstToken.column,
    };
  }

  private parseQuotedExpression(): ChipmunkList {
    const firstToken: Token = this.consumeToken(TokenType.SINGLE_QUOTE);
    return {
      type: ChipmunkNodeType.LIST,
      items: [
        {
          type: ChipmunkNodeType.SYMBOL,
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
