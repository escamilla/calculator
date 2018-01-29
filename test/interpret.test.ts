import { } from "jest";

import globals from "../src/globals";
import interpret from "../src/interpret";

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
  { input: "(add 1 2)", expectedOutput: "3" },
  { input: "(sub 3 2)", expectedOutput: "1" },
  { input: "(mul 3 4)", expectedOutput: "12" },
  { input: "(div 6 3)", expectedOutput: "2" },
  { input: "(mod 9 6)", expectedOutput: "3" },
  { input: "(pow 2 3)", expectedOutput: "8" },
  { input: "(add (add 1 2) 3)", expectedOutput: "6" },
  { input: "foo", expectedOutput: "foo" },
  { input: "foo-bar", expectedOutput: "foo-bar" },
  { input: "fooBar", expectedOutput: "fooBar" },
  { input: "'1", expectedOutput: "1" },
  { input: "'-1", expectedOutput: "-1" },
  { input: "'0.1", expectedOutput: "0.1" },
  { input: "'-0.1", expectedOutput: "-0.1" },
  { input: "'foo", expectedOutput: "foo" },
  { input: "'foo-bar", expectedOutput: "foo-bar" },
  { input: "'fooBar", expectedOutput: "fooBar" },
  { input: "'(add 1 2)", expectedOutput: "(add 1 2)" },
  { input: "'(add (add 1 2) 3)", expectedOutput: "(add (add 1 2) 3)" },
  { input: "(list a b c)", expectedOutput: "(a b c)" },
  { input: "(quote foo)", expectedOutput: "foo" },
  { input: "(quote (add 1 2))", expectedOutput: "(add 1 2)" },
  { input: "(sequence (add 1 2) (add 2 3))", expectedOutput: "5" },
  { input: "((sequence add) 1 2)", expectedOutput: "3" },
  { input: "(let pi 3.14)", expectedOutput: "3.14" },
  { input: "(sequence (let pi 3.14) pi)", expectedOutput: "3.14" },
  { input: "(sequence (let pi 3.14) (sequence pi))", expectedOutput: "3.14" },
  { input: "(sequence (let pi 3.14) (let pi 3.142) pi)", expectedOutput: "3.142" },
  { input: "((lambda (x y) (add x y)) 1 2)", expectedOutput: "3" },
  {
    input: "(sequence (let factorial (lambda (x) (if (eq x 0) 1 (mul x (factorial (sub x 1)))))) (factorial 4))",
    expectedOutput: "24",
  },
  { input: "(sequence (let x 1) ((lambda (y) (add x y)) 2))", expectedOutput: "3" },
  { input: "(sequence (let x 1) (let y 2) ((lambda () (add x y))))", expectedOutput: "3"},
  { input: "(sequence (let x 1) ((lambda (x y) (add x y)) 2 2))", expectedOutput: "4" },
  { input: "(sequence (let square (lambda (x) (mul x x))) (square 3))", expectedOutput: "9" },
  { input: "(eq 0 1)", expectedOutput: "false" },
  { input: "(eq 1 1)", expectedOutput: "true" },
  { input: "(lt 0 1)", expectedOutput: "true" },
  { input: "(lt 1 0)", expectedOutput: "false" },
  { input: "(lt 1 1)", expectedOutput: "false" },
  { input: "(gt 0 1)", expectedOutput: "false" },
  { input: "(gt 1 0)", expectedOutput: "true" },
  { input: "(gt 1 1)", expectedOutput: "false" },
  { input: "(if (lt 0 1) true false)", expectedOutput: "true" },
  { input: "(if (gt 0 1) true false)", expectedOutput: "false" },
  { input: "(length '())", expectedOutput: "0" },
  { input: "(length '(a b c))", expectedOutput: "3" },
  { input: "(nth '(a b c) 2)", expectedOutput: "b" },
  { input: "(join '(a) '(b c))", expectedOutput: "(a b c)" },
  { input: `(concat "a" "b" "c")`, expectedOutput: `"abc"` },
];

const negativeTestCases: INegativeTestCase[] = [
  { input: "(1)", reason: "the first item of a symbolic expression must be a symbol" },
  { input: "(foo)", reason: "the symbol is undefined" },
  { input: "-foo", reason: "a symbol cannot begin with a hyphen" },
  { input: "foo-", reason: "a symbol cannot end with a hyphen" },
  { input: ".1", reason: "a number cannot begin with a decimal point" },
  { input: "1.", reason: "a number cannot end with a decimal point" },
];

describe("interpret() follows expected behavior", () => {
  positiveTestCases.forEach((testCase: IPositiveTestCase) => {
    test(`${testCase.input} => ${testCase.expectedOutput}`, () => {
      expect(interpret(testCase.input, globals).toString()).toEqual(testCase.expectedOutput);
    });
  });

  negativeTestCases.forEach((testCase: INegativeTestCase) => {
    test(`${testCase.input} cannot be evaluated because ${testCase.reason}`, () => {
      expect(() => interpret(testCase.input, globals)).toThrow();
    });
  });
});
