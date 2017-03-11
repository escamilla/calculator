const TokenStream = require('./token-stream');

class Parser {
  constructor(input) {
    this.tokenStream = new TokenStream(input);
  }

  consumeToken(expectedType) {
    const token = this.tokenStream.next();
    if (token.type === expectedType) {
      return token;
    }
    throw new Error(`Expected token of type ${expectedType} but got token of type ${token.type}`);
  }

  parseExpression() {
    switch (this.tokenStream.peek().type) {
      case 'left-parenthesis':
        return this.parseOperation();
      case 'number':
        return this.parseNumber();
      default:
        throw new Error('Expected number or arithmetic operation');
    }
  }

  parseNumber() {
    return {
      type: 'number',
      value: this.consumeToken('number').value
    };
  }

  parseOperation() {
    this.consumeToken('left-parenthesis');
    const operator = this.consumeToken('operator').value;
    const operands = [];
    while (this.tokenStream.peek().type !== 'right-parenthesis') {
      operands.push(this.parseExpression());
    }
    this.consumeToken('right-parenthesis');
    return {
      type: 'operation',
      operator,
      operands
    }
  }
}

module.exports = Parser;
