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
  const tests = [
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

  tests.forEach(function (test) {
    it(`correctly evaluates ${test.input}`, function () {
      const actual = interpret(test.input);
      assert.equal(actual, test.expected);
    });
  });
});
