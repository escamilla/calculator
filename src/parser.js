const TokenStream = require('./token-stream');
const {
  NumberNode,
  SymbolNode,
  SymbolicExpressionNode,
  QuotedExpressionNode
} = require('./nodes');

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
      case 'single-quote':
        return this.parseQuotedExpression();
      default:
        throw new Error('Expected number, symbol, or symbolic expression');
    }
  }

  parseNumber() {
    return new NumberNode(this.consumeToken('number').value);
  }

  parseSymbol() {
    return new SymbolNode(this.consumeToken('symbol').value);
  }

  parseSymbolicExpression() {
    this.consumeToken('left-parenthesis');
    const operator = this.parseSymbol();
    const operands = [];
    while (this.tokenStream.peek().type !== 'right-parenthesis') {
      operands.push(this.parseExpression());
    }
    this.consumeToken('right-parenthesis');
    return new SymbolicExpressionNode(operator, operands);
  }

  parseQuotedExpression() {
    this.consumeToken('single-quote');
    return new QuotedExpressionNode(this.parseExpression());
  }
}

module.exports = Parser;
