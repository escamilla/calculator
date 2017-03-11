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

  parse() {
    const result = this.parseExpression();
    if (!this.tokenStream.eof()) {
      throw new Error('Expected end of file after expression');
    }
    return result;
  }

  parseExpression() {
    switch (this.tokenStream.peek().type) {
      case 'left-parenthesis':
        return this.parseSymbolicExpression();
      case 'number':
        return this.parseNumber();
      case 'symbol':
        return this.parseSymbol();
      default:
        throw new Error('Expected number, symbol, or symbolic expression');
    }
  }

  parseNumber() {
    return {
      type: 'number',
      value: this.consumeToken('number').value
    };
  }

  parseSymbol() {
    return {
      type: 'symbol',
      value: this.consumeToken('symbol').value
    };
  }

  parseSymbolicExpression() {
    this.consumeToken('left-parenthesis');
    const operator = this.consumeToken('symbol');
    const operands = [];
    while (this.tokenStream.peek().type !== 'right-parenthesis') {
      operands.push(this.parseExpression());
    }
    this.consumeToken('right-parenthesis');
    return {
      type: 'symbolic-expression',
      operator,
      operands
    }
  }
}

module.exports = Parser;
