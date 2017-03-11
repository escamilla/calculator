const InputStream = require('./input-stream');

class TokenStream {
  constructor(input) {
    this.inputStream = new InputStream(input);
    this.operators = ['+', '-', '*', '/'];
    this.current = null;
  }

  isWhitespace(char) {
    return /\s/.test(char);
  }

  isDigit(char) {
    return /\d/.test(char);
  }

  isOperator(char) {
    return this.operators.includes(char);
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

    if (this.isOperator(char)) {
      return {
        type: 'operator',
        value: this.inputStream.next()
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
}

module.exports = TokenStream;
