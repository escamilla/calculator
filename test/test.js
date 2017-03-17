const assert = require('assert');
const { describe, it } = require('mocha');

const Lexer = require('../src/lexer');
const Parser = require('../src/parser');
const Evaluator = require('../src/evaluator');
const Environment = require('../src/environment');

const {
  NumberNode,
  SymbolNode,
  SymbolicExpressionNode,
  QuotedExpressionNode,
} = require('../src/nodes');

function interpret(input) {
  const lexer = new Lexer(input);
  const tokens = lexer.lex();
  const parser = new Parser(tokens);
  const ast = parser.parse();
  const evaluator = new Evaluator(ast);
  return evaluator.evaluate();
}

describe('interpret()', () => {
  const positiveTests = [
    { input: '1', expected: new NumberNode(1) },
    { input: '-1', expected: new NumberNode(-1) },
    { input: '0.1', expected: new NumberNode(0.1) },
    { input: '-0.1', expected: new NumberNode(-0.1) },
    { input: '(add 1 2)', expected: new NumberNode(3) },
    { input: '(sub 3 2)', expected: new NumberNode(1) },
    { input: '(mul 2 3)', expected: new NumberNode(6) },
    { input: '(div 6 3)', expected: new NumberNode(2) },
    { input: '(mod 9 6)', expected: new NumberNode(3) },
    { input: '(pow 2 3)', expected: new NumberNode(8) },
    { input: '(add (add 1 2) 3)', expected: new NumberNode(6) },
    { input: 'foo', expected: new SymbolNode('foo') },
    { input: 'foo-bar', expected: new SymbolNode('foo-bar') },
    { input: 'fooBar', expected: new SymbolNode('fooBar') },
    { input: "'1", expected: new QuotedExpressionNode(new NumberNode(1)) },
    { input: "'-1", expected: new QuotedExpressionNode(new NumberNode(-1)) },
    { input: "'0.1", expected: new QuotedExpressionNode(new NumberNode(0.1)) },
    { input: "'-0.1", expected: new QuotedExpressionNode(new NumberNode(-0.1)) },
    { input: "'foo", expected: new QuotedExpressionNode(new SymbolNode('foo')) },
    { input: "'foo-bar", expected: new QuotedExpressionNode(new SymbolNode('foo-bar')) },
    { input: "'fooBar", expected: new QuotedExpressionNode(new SymbolNode('fooBar')) },
    {
      input: "'(add 1 2)",
      expected: new QuotedExpressionNode(
        new SymbolicExpressionNode([
          new SymbolNode('add'),
          new NumberNode(1),
          new NumberNode(2),
        ])),
    },
    {
      input: "'(add (add 1 2) 3)",
      expected: new QuotedExpressionNode(
        new SymbolicExpressionNode([
          new SymbolNode('add'),
          new SymbolicExpressionNode([
            new SymbolNode('add'),
            new NumberNode(1),
            new NumberNode(2),
          ]),
          new NumberNode(3),
        ])),
    },
    { input: '(quote foo)', expected: new QuotedExpressionNode(new SymbolNode('foo')) },
    { input: '(quote (add 1 2))', expected: new QuotedExpressionNode(new NumberNode(3)) },
    { input: "(unquote 'foo)", expected: new SymbolNode('foo') },
    { input: "(unquote '(add 1 2))", expected: new NumberNode(3) },
    { input: '(sequence (add 1 2) (add 2 3))', expected: new NumberNode(5) },
    { input: '((sequence add) 1 2)', expected: new NumberNode(3) },
    { input: "(let 'pi 3.14)", expected: new NumberNode(3.14) },
    { input: "(sequence (let 'pi 3.14) pi)", expected: new NumberNode(3.14) },
    { input: "(sequence (let 'pi 3.14) (sequence pi))", expected: new NumberNode(3.14) },
    { input: "(sequence (let 'pi 3.14) (let 'pi 3.142) pi)", expected: new NumberNode(3.142) },
    { input: "(sequence (let 'pi 3.14) (sequence (let 'pi 3.142)) pi)", expected: new NumberNode(3.14) },
  ];

  positiveTests.forEach((test) => {
    it(`correctly evaluates ${test.input}`, () => {
      const actual = interpret(test.input);
      assert.deepStrictEqual(actual, test.expected);
    });
  });

  const negativeTests = [
    { input: '(', reason: 'unmatched parenthesis' },
    { input: ')', reason: 'unmatched parenthesis' },
    { input: '()', reason: 'empty symbolic expression' },
    { input: '(1)', reason: 'symbolic expression must begin with a symbol' },
    { input: '(foo)', reason: 'undefined symbol' },
    { input: 'foo bar', reason: 'must be single expression' },
    { input: '(add 1 2) foo', reason: 'must be single expression' },
    { input: 'foo (add 1 2)', reason: 'must be single expression' },
    { input: '-foo', reason: 'symbol cannot begin with a hyphen' },
    { input: 'foo-', reason: 'symbol cannot end with a hyphen' },
    { input: '.1', reason: 'number cannot begin with a decimal point' },
    { input: '1.', reason: 'number cannot end with a decimal point' },
  ];

  negativeTests.forEach((test) => {
    it(`throws an error evaluating ${test.input} (${test.reason})`, () => {
      assert.throws(() => {
        interpret(test.input);
      });
    });
  });
});

describe('Environment', () => {
  describe('#lookUp', () => {
    it('returns value from the current scope', (done) => {
      const env = new Environment();
      env.define('pi', 3.14);
      assert.strictEqual(env.lookUp('pi'), 3.14);
      done();
    });

    it('returns value from the outer scope', (done) => {
      const parent = new Environment();
      const child = new Environment(parent);
      parent.define('pi', 3.14);
      assert.strictEqual(child.lookUp('pi'), 3.14);
      done();
    });

    it('returns value from the outermost scope', (done) => {
      const grandparent = new Environment();
      const parent = new Environment(grandparent);
      const child = new Environment(parent);
      grandparent.define('pi', 3.14);
      assert.strictEqual(child.lookUp('pi'), 3.14);
      done();
    });

    it('cannot return value from inner scope', (done) => {
      const parent = new Environment();
      const child = new Environment(parent);
      child.define('pi', 3.14);
      assert.strictEqual(parent.lookUp('pi'), null);
      done();
    });

    it('can shadow value from the outer scope', (done) => {
      const parent = new Environment();
      const child = new Environment(parent);
      parent.define('pi', 3.14);
      child.define('pi', 3.142);
      assert.strictEqual(parent.lookUp('pi'), 3.14);
      assert.strictEqual(child.lookUp('pi'), 3.142);
      done();
    });
  });
});
