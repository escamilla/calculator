const InputStream = require('./input-stream');

class TokenStream {
  constructor(input) {
    this.inputStream = new InputStream(input);
    this.current = null;
  }

  isWhitespace(char) {
    return /\s/.test(char);
  }

  isDigit(char) {
    return /\d/.test(char);
  }

  isLetter(char) {
    return /[a-z]/i.test(char);
  }

  skipWhitespace() {
    while (this.isWhitespace(this.inputStream.peek())) {
      this.inputStream.next();
    }
  }

  readNumber() {
    let str = '';
    if (this.inputStream.peek() === '-') {
      str += this.inputStream.next();
    }
    while (this.isDigit(this.inputStream.peek())) {
      str += this.inputStream.next();
    }
    if (this.inputStream.peek() === '.') {
      str += this.inputStream.next();
      while (this.isDigit(this.inputStream.peek())) {
        str += this.inputStream.next();
      }
    }
    return parseFloat(str);
  }

  readSymbol() {
    let str = '';
    while (this.isLetter(this.inputStream.peek()) || (this.inputStream.peek() === '-' && this.isLetter(this.inputStream.lookAhead()))) {
      str += this.inputStream.next();
    }
    return str;
  }

  peek() {
    if (this.current === null) {
      this.current = this.readToken();
    }
    return this.current;
  }

  next() {
    const token = this.current;
    this.current = null;
    return token || this.readToken();
  }

  readToken() {
    this.skipWhitespace();
    if (this.inputStream.eof()) {
      return null;
    }
    const char = this.inputStream.peek();

    if (this.isDigit(char) || (char === '-' && this.isDigit(this.inputStream.lookAhead()))) {
      return {
        type: 'number',
        value: this.readNumber()
      };
    }

    if (this.isLetter(char)) {
      return {
        type: 'symbol',
        value: this.readSymbol()
      };
    }

    if (char === '(') {
      return {
        type: 'left-parenthesis',
        value: this.inputStream.next()
      };
    }

    if (char === ')') {
      return {
        type: 'right-parenthesis',
        value: this.inputStream.next()
      };
    }

    this.inputStream.die(`Unexpected character: '${char}'`)
  }

  eof() {
    return this.peek() === null;
  }
}

module.exports = TokenStream;
