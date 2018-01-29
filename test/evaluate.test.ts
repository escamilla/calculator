import { } from "jest";

import Environment from "../src/Environment";
import Lexer from "../src/Lexer";
import Parser from "../src/Parser";

import namespace from "../src/core";
import evaluate from "../src/evaluate";
import globals from "../src/globals";

import Token from "../src/tokens/Token";

import SquirrelBoolean from "../src/types/SquirrelBoolean";
import SquirrelFunction from "../src/types/SquirrelFunction";
import SquirrelList from "../src/types/SquirrelList";
import SquirrelNumber from "../src/types/SquirrelNumber";
import SquirrelString from "../src/types/SquirrelString";
import SquirrelSymbol from "../src/types/SquirrelSymbol";
import SquirrelType from "../src/types/SquirrelType";

function interpret(input: string): SquirrelType {
  const lexer: Lexer = new Lexer(input);
  const tokens: Token[] = lexer.lex();
  const parser: Parser = new Parser(tokens);
  return evaluate(parser.parse(), globals);
}

interface IPositiveTestCase {
  input: string;
  expectedOutput: SquirrelType;
}

interface INegativeTestCase {
  input: string;
  reason: string;
}

// tslint:disable:object-literal-sort-keys
const positiveTestCases: IPositiveTestCase[] = [
  { input: "1", expectedOutput: new SquirrelNumber(1) },
  { input: "-1", expectedOutput: new SquirrelNumber(-1) },
  { input: "0.1", expectedOutput: new SquirrelNumber(0.1) },
  { input: "-0.1", expectedOutput: new SquirrelNumber(-0.1) },
  { input: "(add 1 2)", expectedOutput: new SquirrelNumber(3) },
  { input: "(sub 3 2)", expectedOutput: new SquirrelNumber(1) },
  { input: "(mul 3 4)", expectedOutput: new SquirrelNumber(12) },
  { input: "(div 6 3)", expectedOutput: new SquirrelNumber(2) },
  { input: "(mod 9 6)", expectedOutput: new SquirrelNumber(3) },
  { input: "(pow 2 3)", expectedOutput: new SquirrelNumber(8) },
  { input: "(add (add 1 2) 3)", expectedOutput: new SquirrelNumber(6) },
  { input: "foo", expectedOutput: new SquirrelSymbol("foo") },
  { input: "foo-bar", expectedOutput: new SquirrelSymbol("foo-bar") },
  { input: "fooBar", expectedOutput: new SquirrelSymbol("fooBar") },
  { input: "'1", expectedOutput: new SquirrelNumber(1) },
  { input: "'-1", expectedOutput: new SquirrelNumber(-1) },
  { input: "'0.1", expectedOutput: new SquirrelNumber(0.1) },
  { input: "'-0.1", expectedOutput: new SquirrelNumber(-0.1) },
  { input: "'foo", expectedOutput: new SquirrelSymbol("foo") },
  { input: "'foo-bar", expectedOutput: new SquirrelSymbol("foo-bar") },
  { input: "'fooBar", expectedOutput: new SquirrelSymbol("fooBar") },
  {
    input: "'(add 1 2)",
    expectedOutput: new SquirrelList([
      new SquirrelSymbol("add"),
      new SquirrelNumber(1),
      new SquirrelNumber(2),
    ]),
  },
  {
    input: "'(add (add 1 2) 3)",
    expectedOutput: new SquirrelList([
      new SquirrelSymbol("add"),
      new SquirrelList([
        new SquirrelSymbol("add"),
        new SquirrelNumber(1),
        new SquirrelNumber(2),
      ]),
      new SquirrelNumber(3),
    ]),
  },
  {
    input: "(list a b c)",
    expectedOutput: new SquirrelList([
      new SquirrelSymbol("a"),
      new SquirrelSymbol("b"),
      new SquirrelSymbol("c"),
    ]),
  },
  { input: "(quote foo)", expectedOutput: new SquirrelSymbol("foo") },
  {
    input: "(quote (add 1 2))",
    expectedOutput: new SquirrelList([
      new SquirrelSymbol("add"),
      new SquirrelNumber(1),
      new SquirrelNumber(2),
    ]),
  },
  { input: "(sequence (add 1 2) (add 2 3))", expectedOutput: new SquirrelNumber(5) },
  { input: "((sequence add) 1 2)", expectedOutput: new SquirrelNumber(3) },
  { input: "(let pi 3.14)", expectedOutput: new SquirrelNumber(3.14) },
  { input: "(sequence (let pi 3.14) pi)", expectedOutput: new SquirrelNumber(3.14) },
  { input: "(sequence (let pi 3.14) (sequence pi))", expectedOutput: new SquirrelNumber(3.14) },
  { input: "(sequence (let pi 3.14) (let pi 3.142) pi)", expectedOutput: new SquirrelNumber(3.142) },
  { input: "((lambda (x y) (add x y)) 1 2)", expectedOutput: new SquirrelNumber(3) },
  {
    input: "(sequence (let factorial (lambda (x) (if (eq x 0) 1 (mul x (factorial (sub x 1)))))) (factorial 4))",
    expectedOutput: new SquirrelNumber(24),
  },
  { input: "(sequence (let x 1) ((lambda (y) (add x y)) 2))", expectedOutput: new SquirrelNumber(3) },
  { input: "(sequence (let x 1) (let y 2) ((lambda () (add x y))))", expectedOutput: new SquirrelNumber(3) },
  { input: "(sequence (let x 1) ((lambda (x y) (add x y)) 2 2))", expectedOutput: new SquirrelNumber(4) },
  { input: "(sequence (let square (lambda (x) (mul x x))) (square 3))", expectedOutput: new SquirrelNumber(9) },
  { input: "(eq 0 1)", expectedOutput: new SquirrelBoolean(false) },
  { input: "(eq 1 1)", expectedOutput: new SquirrelBoolean(true) },
  { input: "(lt 0 1)", expectedOutput: new SquirrelBoolean(true) },
  { input: "(lt 1 0)", expectedOutput: new SquirrelBoolean(false) },
  { input: "(lt 1 1)", expectedOutput: new SquirrelBoolean(false) },
  { input: "(gt 0 1)", expectedOutput: new SquirrelBoolean(false) },
  { input: "(gt 1 0)", expectedOutput: new SquirrelBoolean(true) },
  { input: "(gt 1 1)", expectedOutput: new SquirrelBoolean(false) },
  { input: "(if (lt 0 1) true false)", expectedOutput: new SquirrelBoolean(true) },
  { input: "(if (gt 0 1) true false)", expectedOutput: new SquirrelBoolean(false) },
  { input: "(length '())", expectedOutput: new SquirrelNumber(0) },
  { input: "(length '(a b c))", expectedOutput: new SquirrelNumber(3) },
  { input: "(nth '(a b c) 2)", expectedOutput: new SquirrelSymbol("b") },
  {
    input: "(join '(a) '(b c))",
    expectedOutput: new SquirrelList([
      new SquirrelSymbol("a"),
      new SquirrelSymbol("b"),
      new SquirrelSymbol("c"),
    ]),
  },
  {
    input: `(concat "a" "b" "c")`,
    expectedOutput: new SquirrelString("abc"),
  },
];

const negativeTestCases: INegativeTestCase[] = [
  { input: "(1)", reason: "the first item of a symbolic expression must be a symbol" },
  { input: "(foo)", reason: "the symbol is undefined" },
  { input: "-foo", reason: "a symbol cannot begin with a hyphen" },
  { input: "foo-", reason: "a symbol cannot end with a hyphen" },
  { input: ".1", reason: "a number cannot begin with a decimal point" },
  { input: "1.", reason: "a number cannot end with a decimal point" },
];

describe("Evaluator.evaluate()", () => {
  positiveTestCases.forEach((testCase: IPositiveTestCase) => {
    test(`the expression \`${testCase.input}\` is evaluated to \`${testCase.expectedOutput.toString()}\``, () => {
      expect(interpret(testCase.input)).toEqual(testCase.expectedOutput);
    });
  });

  negativeTestCases.forEach((testCase: INegativeTestCase) => {
    test(`the expression \`${testCase.input}\` cannot be evaluated because ${testCase.reason}`, () => {
      expect(() => interpret(testCase.input)).toThrow();
    });
  });
});
