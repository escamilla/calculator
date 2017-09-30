import Token from "./tokens/Token";
import TokenType from "./tokens/TokenType";

class Lexer {
  private position: number = 0;
  private line: number = 1;
  private column: number = 1;

  constructor(private readonly input: string) { }

  public lex(): Token[] {
    const tokens: Token[] = [];
    let token: Token;
    while (true) {
      token = this.readToken();
      if (token === null) {
        break;
      }
      tokens.push(token);
    }
    return tokens;
  }

  private die(message: string): never {
    throw new Error(`${message} (${this.line}:${this.column})`);
  }

  private peek(): string {
    return this.input.charAt(this.position);
  }

  private next(): string {
    const char = this.input.charAt(this.position);
    this.position += 1;
    if (char === "\n") {
      this.line += 1;
      this.column = 1;
    } else {
      this.column += 1;
    }
    return char;
  }

  private lookAhead(): string {
    return this.input.charAt(this.position + 1);
  }

  private eof(): boolean {
    return this.peek() === "";
  }

  private isWhitespace(char: string): boolean {
    return /\s/.test(char);
  }

  private isDigit(char: string): boolean {
    return /\d/.test(char);
  }

  private isAlpha(char: string): boolean {
    return /[a-z]/i.test(char);
  }

  private skipWhitespace(): void {
    while (this.isWhitespace(this.peek())) {
      this.next();
    }
  }

  private readNumber(): number {
    let str = "";
    if (this.peek() === "-") {
      str += this.next();
    }
    while (this.isDigit(this.peek())) {
      str += this.next();
    }
    if (this.peek() === "." && this.isDigit(this.lookAhead())) {
      str += this.next();
      while (this.isDigit(this.peek())) {
        str += this.next();
      }
    }
    return parseFloat(str);
  }

  private readSymbol(): string {
    let str = "";
    if (this.peek() === "_") {
      return this.next();
    }
    while (this.isAlpha(this.peek()) || (this.peek() === "-" && this.isAlpha(this.lookAhead()))) {
      str += this.next();
    }
    return str;
  }

  private readString(): string {
    let str = "";
    this.next();
    while (this.peek() && this.peek() !== "\"") {
      if (this.peek() === "\\" && this.lookAhead() === "n") {
        str += "\n";
        this.next();
        this.next();
      } else {
        str += this.next();
      }
    }
    if (this.peek() === "'") {
      this.next();
    } else {
      throw new Error("unterminated string");
    }
    return str;
  }

  private readToken(): Token {
    this.skipWhitespace();
    if (this.eof()) {
      return null;
    }
    const char = this.peek();

    if (this.isDigit(char) || (char === "-" && this.isDigit(this.lookAhead()))) {
      return new Token(TokenType.NUMBER, this.readNumber());
    }

    if (this.isAlpha(char) || char === "_") {
      return new Token(TokenType.SYMBOL, this.readSymbol());
    }

    switch (char) {
      case "(":
        return new Token(TokenType.LEFT_PARENTHESIS, this.next());
      case ")":
        return new Token(TokenType.RIGHT_PARENTHESIS, this.next());
      case "\"":
        return new Token(TokenType.STRING, this.readString());
      case "'":
        return new Token(TokenType.SINGLE_QUOTE, this.next());
      default:
        this.die(`unknown character: ${char}`);
    }

    return null;
  }
}

export default Lexer;
