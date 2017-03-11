const assert = require('assert');

const Parser = require('../src/parser');
const Evaluator = require('../src/evaluator');

function interpret(input) {
  const parser = new Parser(input);
  const ast = parser.parseExpression();
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
    {input: '(+ 1 2)', expected: 3},
    {input: '(- 3 2)', expected: 1},
    {input: '(* 2 3)', expected: 6},
    {input: '(/ 6 3)', expected: 2},
    {input: '(+ (+ 1 2) 3)', expected: 6},
  ];

  tests.forEach(function (test) {
    it(`correctly evaluates ${test.input}`, function () {
      const actual = interpret(test.input);
      assert.equal(actual, test.expected);
    });
  });
});
