import interpret from "./interpret";
import dummyIOHandler from "./io/dummyIOHandler";
import replEnv from "./replEnv";
import toString from "./utils/toString";

interface IPositiveTestCase {
  input: string;
  expectedOutput: string;
}

interface INegativeTestCase {
  input: string;
  reason: string;
}

// tslint:disable:object-literal-sort-keys
const positiveTestCases: IPositiveTestCase[] = [
  { input: "1", expectedOutput: "1" },
  { input: "-1", expectedOutput: "-1" },
  { input: "0.1", expectedOutput: "0.1" },
  { input: "-0.1", expectedOutput: "-0.1" },
  { input: "(+ 1 2)", expectedOutput: "3" },
  { input: "(- 3 2)", expectedOutput: "1" },
  { input: "(* 3 4)", expectedOutput: "12" },
  { input: "(/ 6 3)", expectedOutput: "2" },
  { input: "(% 9 6)", expectedOutput: "3" },
  { input: "(pow 2 3)", expectedOutput: "8" },
  { input: "(+ (+ 1 2) 3)", expectedOutput: "6" },
  { input: "'1", expectedOutput: "1" },
  { input: "'-1", expectedOutput: "-1" },
  { input: "'0.1", expectedOutput: "0.1" },
  { input: "'-0.1", expectedOutput: "-0.1" },
  { input: "'foo", expectedOutput: "foo" },
  { input: "'foo-bar", expectedOutput: "foo-bar" },
  { input: "'fooBar", expectedOutput: "fooBar" },
  { input: "'(+ 1 2)", expectedOutput: "(+ 1 2)" },
  { input: "'(+ (+ 1 2) 3)", expectedOutput: "(+ (+ 1 2) 3)" },
  { input: "(list 1 2 3)", expectedOutput: "(1 2 3)" },
  { input: "(quote foo)", expectedOutput: "foo" },
  { input: "(quote (+ 1 2))", expectedOutput: "(+ 1 2)" },
  { input: "(do (+ 1 2) (+ 2 3))", expectedOutput: "5" },
  { input: "((do +) 1 2)", expectedOutput: "3" },
  { input: "(def pi 3.14)", expectedOutput: "3.14" },
  { input: "(do (def pi 3.14) pi)", expectedOutput: "3.14" },
  { input: "(do (def pi 3.14) (do pi))", expectedOutput: "3.14" },
  { input: "(do (def pi 3.14) (def pi 3.142) pi)", expectedOutput: "3.142" },
  { input: "((lambda (x y) (+ x y)) 1 2)", expectedOutput: "3" },
  {
    input: "(do (def factorial (lambda (x) (if (= x 0) 1 (* x (factorial (- x 1)))))) (factorial 4))",
    expectedOutput: "24",
  },
  { input: "(do (def x 1) ((lambda (y) (+ x y)) 2))", expectedOutput: "3" },
  { input: "(do (def x 1) (def y 2) ((lambda () (+ x y))))", expectedOutput: "3" },
  { input: "(do (def x 1) ((lambda (x y) (+ x y)) 2 2))", expectedOutput: "4" },
  { input: "(do (def square (lambda (x) (* x x))) (square 3))", expectedOutput: "9" },
  { input: "(= 0 1)", expectedOutput: "false" },
  { input: "(= 1 1)", expectedOutput: "true" },
  { input: "(!= 0 1)", expectedOutput: "true" },
  { input: "(!= 1 1)", expectedOutput: "false" },
  { input: "(< 0 1)", expectedOutput: "true" },
  { input: "(< 1 0)", expectedOutput: "false" },
  { input: "(< 1 1)", expectedOutput: "false" },
  { input: "(<= 0 1)", expectedOutput: "true" },
  { input: "(<= 1 0)", expectedOutput: "false" },
  { input: "(<= 1 1)", expectedOutput: "true" },
  { input: "(> 0 1)", expectedOutput: "false" },
  { input: "(> 1 0)", expectedOutput: "true" },
  { input: "(> 1 1)", expectedOutput: "false" },
  { input: "(>= 0 1)", expectedOutput: "false" },
  { input: "(>= 1 0)", expectedOutput: "true" },
  { input: "(>= 1 1)", expectedOutput: "true" },
  { input: "(if (< 0 1) true false)", expectedOutput: "true" },
  { input: "(if (> 0 1) true false)", expectedOutput: "false" },
  { input: "(length '())", expectedOutput: "0" },
  { input: "(length '(a b c))", expectedOutput: "3" },
  { input: '(length "")', expectedOutput: "0" },
  { input: '(length "hi")', expectedOutput: "2" },
  { input: "(nth '(a b c) 0)", expectedOutput: "a" },
  { input: "(nth '(a b c) 1)", expectedOutput: "b" },
  { input: "(nth '(a b c) 2)", expectedOutput: "c" },
  { input: '(nth "hi" 0)', expectedOutput: '"h"' },
  { input: '(nth "hi" 1)', expectedOutput: '"i"' },
  { input: "(join '(a) '(b c))", expectedOutput: "(a b c)" },
  { input: `(concat "a" "b" "c")`, expectedOutput: `"abc"` },
  { input: `(parse-integer "3")`, expectedOutput: "3" },
  { input: `(parse-float "3.14")`, expectedOutput: "3.14" },
  { input: `(do (def pi 3.14) (set pi 3.142) pi)`, expectedOutput: "3.142" },
  { input: `(do (def pi 3.14) (do (set pi 3.142)) pi)`, expectedOutput: "3.142" },
];

const negativeTestCases: INegativeTestCase[] = [
  { input: "(1)", reason: "the first item of a symbolic expression must be a symbol" },
  { input: "(foo)", reason: "the symbol is undefined" },
  { input: "-foo", reason: "a symbol cannot begin with a hyphen" },
  { input: "foo-", reason: "a symbol cannot end with a hyphen" },
  { input: ".1", reason: "a number cannot begin with a decimal point" },
  { input: "1.", reason: "a number cannot end with a decimal point" },
  { input: '(def "pi" 3.14)', reason: "the first argument to def must be a symbol" },
  { input: '(do (def pi 3.14) (set "pi" 3.142))', reason: "the first argument to set must be a symbol" },
  { input: "(if 1 true false)", reason: "the first argument to if must be a boolean" },
  { input: '(lambda "x" x)', reason: "the first argument to lambda must be a list of symbols" },
  { input: '(lambda ("x") x)', reason: "the first argument to lambda must be a list of symbols" },
];

describe("interpret() follows expected behavior", () => {
  positiveTestCases.forEach((testCase: IPositiveTestCase) => {
    test(`${testCase.input} => ${testCase.expectedOutput}`, () => {
      const actualOutput: string = toString(interpret(testCase.input, replEnv, dummyIOHandler));
      expect(actualOutput).toEqual(testCase.expectedOutput);
    });
  });

  negativeTestCases.forEach((testCase: INegativeTestCase) => {
    test(`${testCase.input} cannot be evaluated because ${testCase.reason}`, () => {
      expect(() => interpret(testCase.input, replEnv, dummyIOHandler)).toThrow();
    });
  });
});
