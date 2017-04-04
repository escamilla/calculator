class Lexer {
  constructor(input) {
    this.input = input;
    this.position = 0;
    this.line = 1;
    this.column = 1;
  }

  die(message) {
    throw new Error(`${message} (${this.line}:${this.column})`);
  }

  peek() {
    return this.input.charAt(this.position);
  }

  next() {
    const char = this.input.charAt(this.position);
    this.position += 1;
    if (char === '\n') {
      this.line += 1;
      this.column = 1;
    } else {
      this.column += 1;
    }
    return char;
  }

  lookAhead() {
    return this.input.charAt(this.position + 1);
  }

  eof() {
    return this.peek() === '';
  }

  isWhitespace(char) {
    return /\s/.test(char);
  }

  isDigit(char) {
    return /\d/.test(char);
  }

  isAlpha(char) {
    return /[a-z]/i.test(char);
  }

  skipWhitespace() {
    while (this.isWhitespace(this.peek())) {
      this.next();
    }
  }

  readNumber() {
    let str = '';
    if (this.peek() === '-') {
      str += this.next();
    }
    while (this.isDigit(this.peek())) {
      str += this.next();
    }
    if (this.peek() === '.' && this.isDigit(this.lookAhead())) {
      str += this.next();
      while (this.isDigit(this.peek())) {
        str += this.next();
      }
    }
    return parseFloat(str);
  }

  readSymbol() {
    let str = '';
    if (this.peek() === '_') {
      return this.next();
    }
    while (this.isAlpha(this.peek()) || (this.peek() === '-' && this.isAlpha(this.lookAhead()))) {
      str += this.next();
    }
    return str;
  }

  readToken() {
    this.skipWhitespace();
    if (this.eof()) {
      return null;
    }
    const char = this.peek();

    if (this.isDigit(char) || (char === '-' && this.isDigit(this.lookAhead()))) {
      return {
        type: 'number',
        value: this.readNumber(),
      };
    }

    if (this.isAlpha(char) || char === '_') {
      return {
        type: 'symbol',
        value: this.readSymbol(),
      };
    }

    switch (char) {
      case '(':
        return {
          type: 'left-parenthesis',
          value: this.next(),
        };
      case ')':
        return {
          type: 'right-parenthesis',
          value: this.next(),
        };
      case "'":
        return {
          type: 'single-quote',
          value: this.next(),
        };
      default:
        this.die(`unknown character: ${char}`);
    }

    return null;
  }

  lex() {
    const tokens = [];
    let token;
    while ((token = this.readToken()) !== null) {
      tokens.push(token);
    }
    return tokens;
  }
}

module.exports = Lexer;
