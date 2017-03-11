const assert = require('assert');

const Parser = require('../src/parser');
const Evaluator = require('../src/evaluator');

function interpret(input) {
  const parser = new Parser(input);
  const ast = parser.parse();
  const evaluator = new Evaluator(ast);
  const output = evaluator.evaluate();
  return output.value;
}

describe('interpret()', function () {
  const positiveTests = [
    {input: '1', expected: 1},
    {input: '-1', expected: -1},
    {input: '0.1', expected: 0.1},
    {input: '-0.1', expected: -0.1},
    {input: '(add 1 2)', expected: 3},
    {input: '(sub 3 2)', expected: 1},
    {input: '(mul 2 3)', expected: 6},
    {input: '(div 6 3)', expected: 2},
    {input: '(mod 9 6)', expected: 3},
    {input: '(pow 2 3)', expected: 8},
    {input: '(add (add 1 2) 3)', expected: 6},
    {input: 'foo', expected: 'foo'},
    {input: 'foo-bar', expected: 'foo-bar'},
    {input: 'fooBar', expected: 'fooBar'},
  ];

  positiveTests.forEach(function (test) {
    it(`correctly evaluates ${test.input}`, function () {
      const actual = interpret(test.input);
      assert.equal(actual, test.expected);
    });
  });

  const negativeTests = [
    {input: '(', reason: 'unmatched parenthesis'},
    {input: ')', reason: 'unmatched parenthesis'},
    {input: '()', reason: 'empty symbolic expression'},
    {input: '(1)', reason: 'symbolic expression must begin with a symbol'},
    {input: '(foo)', reason: 'undefined symbol'},
    {input: 'foo bar', reason: 'must be single expression'},
    {input: '(add 1 2) foo', reason: 'must be single expression'},
    {input: 'foo (add 1 2)', reason: 'must be single expression'},
    {input: '-foo', reason: 'symbol cannot begin with a hyphen'},
    {input: 'foo-', reason: 'symbol cannot end with a hyphen'},
    {input: '.1', reason: 'number cannot begin with a decimal point'},
    {input: '1.', reason: 'number cannot end with a decimal point'},
  ];

  negativeTests.forEach(function (test) {
    it(`throws an error evaluating ${test.input} (${test.reason})`, function () {
      assert.throws(() => {
        interpret(test.input);
      });
    })
  });
});
