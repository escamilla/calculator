import Token from "./Token";

class Lexer {
  public position;
  public line;
  public column;

  constructor(public input) {
    this.input = input;
    this.position = 0;
    this.line = 1;
    this.column = 1;
  }

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

  private die(message) {
    throw new Error(`${message} (${this.line}:${this.column})`);
  }

  private peek() {
    return this.input.charAt(this.position);
  }

  private next() {
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

  private lookAhead() {
    return this.input.charAt(this.position + 1);
  }

  private eof() {
    return this.peek() === "";
  }

  private isWhitespace(char) {
    return /\s/.test(char);
  }

  private isDigit(char) {
    return /\d/.test(char);
  }

  private isAlpha(char) {
    return /[a-z]/i.test(char);
  }

  private skipWhitespace() {
    while (this.isWhitespace(this.peek())) {
      this.next();
    }
  }

  private readNumber() {
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

  private readSymbol() {
    let str = "";
    if (this.peek() === "_") {
      return this.next();
    }
    while (this.isAlpha(this.peek()) || (this.peek() === "-" && this.isAlpha(this.lookAhead()))) {
      str += this.next();
    }
    return str;
  }

  private readString() {
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
      return new Token("number", this.readNumber());
    }

    if (this.isAlpha(char) || char === "_") {
      return new Token("symbol", this.readSymbol());
    }

    switch (char) {
      case "(":
        return new Token("left-parenthesis", this.next());
      case ")":
        return new Token("right-parenthesis", this.next());
      case "\"":
        return new Token("string", this.readString());
      case "'":
        return new Token("single-quote", this.next());
      default:
        this.die(`unknown character: ${char}`);
    }

    return null;
  }
}

export default Lexer;
