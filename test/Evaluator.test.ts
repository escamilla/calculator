import { } from "jest";

import Environment from "../src/Environment";
import Evaluator from "../src/Evaluator";
import Lexer from "../src/Lexer";
import Parser from "../src/Parser";

import Token from "../src/tokens/Token";

import INode from "../src/nodes/INode";
import ListNode from "../src/nodes/ListNode";
import NumberNode from "../src/nodes/NumberNode";
import SymbolNode from "../src/nodes/SymbolNode";

function interpret(input: string): INode {
  const lexer: Lexer = new Lexer(input);
  const tokens: Token[] = lexer.lex();
  const parser: Parser = new Parser(tokens);
  const ast: INode = parser.parse();
  const evaluator: Evaluator = new Evaluator(ast);
  return evaluator.evaluate();
}

interface IPositiveTestCase {
  input: string;
  expectedOutput: INode;
}

interface INegativeTestCase {
  input: string;
  reason: string;
}

// tslint:disable:object-literal-sort-keys
const positiveTestCases: IPositiveTestCase[] = [
  { input: "1", expectedOutput: new NumberNode(1) },
  { input: "-1", expectedOutput: new NumberNode(-1) },
  { input: "0.1", expectedOutput: new NumberNode(0.1) },
  { input: "-0.1", expectedOutput: new NumberNode(-0.1) },
  { input: "(add 1 2)", expectedOutput: new NumberNode(3) },
  { input: "(sub 3 2)", expectedOutput: new NumberNode(1) },
  { input: "(mul 3 4)", expectedOutput: new NumberNode(12) },
  { input: "(div 6 3)", expectedOutput: new NumberNode(2) },
  { input: "(mod 9 6)", expectedOutput: new NumberNode(3) },
  { input: "(pow 2 3)", expectedOutput: new NumberNode(8) },
  { input: "(add (add 1 2) 3)", expectedOutput: new NumberNode(6) },
  { input: "foo", expectedOutput: new SymbolNode("foo") },
  { input: "foo-bar", expectedOutput: new SymbolNode("foo-bar") },
  { input: "fooBar", expectedOutput: new SymbolNode("fooBar") },
  { input: "'1", expectedOutput: new NumberNode(1) },
  { input: "'-1", expectedOutput: new NumberNode(-1) },
  { input: "'0.1", expectedOutput: new NumberNode(0.1) },
  { input: "'-0.1", expectedOutput: new NumberNode(-0.1) },
  { input: "'foo", expectedOutput: new SymbolNode("foo") },
  { input: "'foo-bar", expectedOutput: new SymbolNode("foo-bar") },
  { input: "'fooBar", expectedOutput: new SymbolNode("fooBar") },
  {
    input: "'(add 1 2)",
    expectedOutput: new ListNode([
      new SymbolNode("add"),
      new NumberNode(1),
      new NumberNode(2),
    ]),
  },
  {
    input: "'(add (add 1 2) 3)",
    expectedOutput: new ListNode([
      new SymbolNode("add"),
      new ListNode([
        new SymbolNode("add"),
        new NumberNode(1),
        new NumberNode(2),
      ]),
      new NumberNode(3),
    ]),
  },
  {
    input: "(list a b c)",
    expectedOutput: new ListNode([
      new SymbolNode("a"),
      new SymbolNode("b"),
      new SymbolNode("c"),
    ]),
  },
  { input: "(quote foo)", expectedOutput: new SymbolNode("foo") },
  {
    input: "(quote (add 1 2))",
    expectedOutput: new ListNode([
      new SymbolNode("add"),
      new NumberNode(1),
      new NumberNode(2),
    ]),
  },
  { input: "(unquote 'foo)", expectedOutput: new SymbolNode("foo") },
  {
    input: "(unquote '(add 1 2))",
    expectedOutput: new ListNode([
      new SymbolNode("add"),
      new NumberNode(1),
      new NumberNode(2),
    ]),
  },
  { input: "(sequence (add 1 2) (add 2 3))", expectedOutput: new NumberNode(5) },
  { input: "((sequence add) 1 2)", expectedOutput: new NumberNode(3) },
  { input: "(let pi 3.14)", expectedOutput: new NumberNode(3.14) },
  { input: "(sequence (let pi 3.14) pi)", expectedOutput: new NumberNode(3.14) },
  { input: "(sequence (let pi 3.14) (sequence pi))", expectedOutput: new NumberNode(3.14) },
  { input: "(sequence (let pi 3.14) (let pi 3.142) pi)", expectedOutput: new NumberNode(3.142) },
  { input: "(sequence (let pi 3.14) (sequence (let pi 3.142)) pi)", expectedOutput: new NumberNode(3.14) },
  { input: "((lambda (x y) (add x y)) 1 2)", expectedOutput: new NumberNode(3) },
  { input: "(sequence (let x 1) ((lambda (y) (add x y)) 2))", expectedOutput: new NumberNode(3) },
  { input: "(sequence (let x 1) (let y 2) ((lambda () (add x y))))", expectedOutput: new NumberNode(3) },
  { input: "(sequence (let x 1) ((lambda (x y) (add x y)) 2 2))", expectedOutput: new NumberNode(4) },
  { input: "(sequence (let square (lambda (x) (mul x x))) (square 3))", expectedOutput: new NumberNode(9) },
  { input: "(eq 0 1)", expectedOutput: new NumberNode(1) },
  { input: "(eq 1 1)", expectedOutput: new NumberNode(0) },
  { input: "(lt 0 1)", expectedOutput: new NumberNode(0) },
  { input: "(lt 1 0)", expectedOutput: new NumberNode(1) },
  { input: "(lt 1 1)", expectedOutput: new NumberNode(1) },
  { input: "(gt 0 1)", expectedOutput: new NumberNode(1) },
  { input: "(gt 1 0)", expectedOutput: new NumberNode(0) },
  { input: "(gt 1 1)", expectedOutput: new NumberNode(1) },
  { input: "(if (lt 0 1) true false)", expectedOutput: new SymbolNode("true") },
  { input: "(if (gt 0 1) true false)", expectedOutput: new SymbolNode("false") },
  { input: "(length '())", expectedOutput: new NumberNode(0) },
  { input: "(length '(a b c))", expectedOutput: new NumberNode(3) },
  { input: "(nth '(a b c) 2)", expectedOutput: new SymbolNode("b") },
  {
    input: "(concat '(a) '(b c))",
    expectedOutput: new ListNode([
      new SymbolNode("a"),
      new SymbolNode("b"),
      new SymbolNode("c"),
    ]),
  },
];
// tslint:enable:object-literal-sort-keys

const negativeTestCases: INegativeTestCase[] = [
  { input: "()", reason: "a symbolic expression cannot be empty" },
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
