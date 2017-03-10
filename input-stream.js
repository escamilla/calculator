class InputStream {
  constructor(input) {
    this.input = input;
    this.pos = 0;
    this.line = 1;
    this.col = 1;
  }

  peek() {
    return this.input.charAt(this.pos);
  }

  next() {
    let char = this.input.charAt(this.pos++);
    if (char === '\n') {
      this.line++;
      this.col = 1;
    } else {
      this.col++;
    }
    return char;
  }

  lookAhead() {
    return this.input.charAt(this.pos + 1);
  }

  eof() {
    return this.peek() === '';
  }

  die(message) {
    throw new Error(`${message} (${this.line}:${this.col})`);
  }
}

module.exports = InputStream;
