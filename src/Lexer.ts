import Token from "./tokens/Token";
import TokenType from "./tokens/TokenType";

class Lexer {
  private position: number = 0;
  private line: number = 1;
  private column: number = 1;

  public constructor(private readonly input: string) { }

  public lex(): Token[] {
    const tokens: Token[] = [];
    let token: Token | null;
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
    const char: string = this.input.charAt(this.position);
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

  private isSymbolCharacter(char: string): boolean {
    return this.isAlpha(char) || "!%*+-/<=>?_".includes(char);
  }

  private isEscapeCharacter(char: string): boolean {
    return 'n"\\'.includes(char);
  }

  private skipWhitespace(): void {
    while (this.isWhitespace(this.peek())) {
      this.next();
    }
  }

  private skipComment(): void {
    const lineNumber: number = this.line;
    const columnNumber: number = this.column;
    while (!this.eof()) {
      if (this.peek() === "]") {
        this.next();
        return;
      }
      this.next();
    }
    this.die(`unterminated comment starting at ${lineNumber}:${columnNumber}`);
  }

  private skipWhitespaceAndComments(): void {
    while (true) {
      if (this.isWhitespace(this.peek())) {
        this.skipWhitespace();
      } else if (this.peek() === "[") {
        this.skipComment();
      } else {
        break;
      }
    }
  }

  private readNumber(): number {
    let str: string = "";
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
    let str: string = "";
    while (this.peek() && this.isSymbolCharacter(this.peek())) {
      str += this.next();
    }
    return str;
  }

  private readString(): string {
    let str: string = "";
    this.next();
    while (this.peek() && this.peek() !== '"') {
      if (this.peek() === "\\" && this.isEscapeCharacter(this.lookAhead())) {
        if (this.lookAhead() === "n") {
          str += "\n";
        } else if (this.lookAhead() === '"') {
          str += '"';
        } else if (this.lookAhead() === "\\") {
          str += "\\";
        }
        this.next();
        this.next();
        continue;
      } else {
        str += this.next();
      }
    }
    if (this.peek() === '"') {
      this.next();
    } else {
      throw new Error("unterminated string");
    }
    return str;
  }

  private readToken(): Token | null {
    this.skipWhitespaceAndComments();
    if (this.eof()) {
      return null;
    }

    const char: string = this.peek();

    const line: number = this.line;
    const column: number = this.column;

    if (this.isDigit(char) || (char === "-" && this.isDigit(this.lookAhead()))) {
      return { type: TokenType.NUMBER, value: this.readNumber(), line, column };
    }

    if (this.isSymbolCharacter(char)) {
      return { type: TokenType.SYMBOL, value: this.readSymbol(), line, column };
    }

    switch (char) {
      case "(":
        return { type: TokenType.LEFT_PARENTHESIS, value: this.next(), line, column };
      case ")":
        return { type: TokenType.RIGHT_PARENTHESIS, value: this.next(), line, column };
      case "\"":
        return { type: TokenType.STRING, value: this.readString(), line, column };
      case "'":
        return { type: TokenType.SINGLE_QUOTE, value: this.next(), line, column };
      default:
        this.die(`unexpected character: ${char}`);
    }

    return null;
  }
}

export default Lexer;
