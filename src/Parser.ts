import ListNode from "./nodes/ListNode";
import NumberNode from "./nodes/NumberNode";
import StringNode from "./nodes/StringNode";
import SymbolNode from "./nodes/SymbolNode";

class Parser {
  public position;

  constructor(public tokens) {
    this.tokens = tokens;
    this.position = 0;
  }

  public parse() {
    const result = this.parseExpression();
    if (!this.eof()) {
      throw new Error("Expected end of file after expression");
    }
    return result;
  }

  private peek() {
    return this.tokens[this.position];
  }

  private next() {
    const token = this.tokens[this.position];
    this.position += 1;
    return token;
  }

  private eof() {
    return this.position >= this.tokens.length;
  }

  private consumeToken(expectedType) {
    const token = this.next();
    if (token.type === expectedType) {
      return token;
    }
    throw new Error(`Expected token of type ${expectedType} but got token of type ${token.type}`);
  }

  private parseExpression() {
    switch (this.peek().type) {
      case "left-parenthesis":
        return this.parseSymbolicExpression();
      case "number":
        return this.parseNumber();
      case "symbol":
        return this.parseSymbol();
      case "string":
        return this.parseString();
      case "single-quote":
        return this.parseQuotedExpression();
      default:
        throw new Error("Expected number, symbol, or symbolic expression");
    }
  }

  private parseNumber() {
    return new NumberNode(this.consumeToken("number").value);
  }

  private parseSymbol() {
    return new SymbolNode(this.consumeToken("symbol").value);
  }

  private parseString() {
    return new StringNode(this.consumeToken("string").value);
  }

  private parseSymbolicExpression() {
    this.consumeToken("left-parenthesis");
    const items = [];
    while (this.peek().type !== "right-parenthesis") {
      items.push(this.parseExpression());
    }
    this.consumeToken("right-parenthesis");
    return new ListNode(items);
  }

  private parseQuotedExpression() {
    this.consumeToken("single-quote");
    return new ListNode([new SymbolNode("quote"), this.parseExpression()]);
  }
}

export default Parser;
