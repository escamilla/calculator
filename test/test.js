const assert = require('assert');
const {describe, it} = require('mocha');

const Parser = require('../src/parser');
const Evaluator = require('../src/evaluator');

function interpret(input) {
  const parser = new Parser(input);
  const ast = parser.parse();
  const evaluator = new Evaluator(ast);
  return evaluator.evaluate();
}

describe('interpret()', function () {
  const positiveTests = [
    {input: '1', expected: {type: 'number', value: 1}},
    {input: '-1', expected: {type: 'number', value: -1}},
    {input: '0.1', expected: {type: 'number', value: 0.1}},
    {input: '-0.1', expected: {type: 'number', value: -0.1}},
    {input: '(add 1 2)', expected: {type: 'number', value: 3}},
    {input: '(sub 3 2)', expected: {type: 'number', value: 1}},
    {input: '(mul 2 3)', expected: {type: 'number', value: 6}},
    {input: '(div 6 3)', expected: {type: 'number', value: 2}},
    {input: '(mod 9 6)', expected: {type: 'number', value: 3}},
    {input: '(pow 2 3)', expected: {type: 'number', value: 8}},
    {input: '(add (add 1 2) 3)', expected: {type: 'number', value: 6}},
    {input: 'foo', expected: {type: 'symbol', value: 'foo'}},
    {input: 'foo-bar', expected: {type: 'symbol', value: 'foo-bar'}},
    {input: 'fooBar', expected: {type: 'symbol', value: 'fooBar'}},
    {input: "'1", expected: {type: 'quoted-expression', value: {type: 'number', value: 1}}},
    {input: "'-1", expected: {type: 'quoted-expression', value: {type: 'number', value: -1}}},
    {input: "'0.1", expected: {type: 'quoted-expression', value: {type: 'number', value: 0.1}}},
    {input: "'-0.1", expected: {type: 'quoted-expression', value: {type: 'number', value: -0.1}}},
    {input: "'foo", expected: {type: 'quoted-expression', value: {type: 'symbol', value: 'foo'}}},
    {input: "'foo-bar", expected: {type: 'quoted-expression', value: {type: 'symbol', value: 'foo-bar'}}},
    {input: "'fooBar", expected: {type: 'quoted-expression', value: {type: 'symbol', value: 'fooBar'}}},
    {
      input: "'(add 1 2)",
      expected: {
        type: 'quoted-expression',
        value: {
          type: 'symbolic-expression',
          operator: {type: 'symbol', value: 'add'},
          operands: [
            {type: 'number', value: 1},
            {type: 'number', value: 2}
          ]
        }
      }
    },
    {
      input: "'(add (add 1 2) 3)",
      expected: {
        type: 'quoted-expression',
        value: {
          type: 'symbolic-expression',
          operator: {type: 'symbol', value: 'add'},
          operands: [
            {
              type: 'symbolic-expression',
              operator: {type: 'symbol', value: 'add'},
              operands: [
                {type: 'number', value: 1},
                {type: 'number', value: 2}
              ]
            },
            {type: 'number', value: 3}
          ]
        }
      }
    },
  ];

  positiveTests.forEach(function (test) {
    it(`correctly evaluates ${test.input}`, function () {
      const actual = interpret(test.input);
      assert.deepStrictEqual(actual, test.expected);
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
