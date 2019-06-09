import {
  ChipmunkNode,
  Parser,
  Tokenizer,
} from "chipmunk-core";

import { compileJavaScriptToSourceNode, convertChipmunkNodeToJavaScriptNode } from "../src/codegen";
import JavaScriptNode from "../src/js/JavaScriptNode";

interface IPositiveTestCase {
  input: string;
  expectedOutput: any;
}

// tslint:disable:object-literal-sort-keys
const positiveTestCases: IPositiveTestCase[] = [
  { input: "1", expectedOutput: 1 },
  { input: "-1", expectedOutput: -1 },
  { input: "0.1", expectedOutput: 0.1 },
  { input: "-0.1", expectedOutput: -0.1 },
  { input: `"string"`, expectedOutput: "string" },
  { input: `null`, expectedOutput: null },
  { input: `true`, expectedOutput: true },
  { input: `false`, expectedOutput: false },
  { input: `(1 "string" null true false)`, expectedOutput: [1, "string", null, true, false] },
  { input: `(+ 1 2)`, expectedOutput: 3 },
  { input: `(- 3 2)`, expectedOutput: 1 },
  { input: `(* 2 3)`, expectedOutput: 6 },
  { input: `(/ 6 3)`, expectedOutput: 2 },
  { input: `(% 7 3)`, expectedOutput: 1 },
  { input: `(+ 1 (+ 1 1))`, expectedOutput: 3 },
  { input: `(= 1 0)`, expectedOutput: false },
  { input: `(= 1 1)`, expectedOutput: true },
  { input: `(!= 1 0)`, expectedOutput: true },
  { input: `(!= 1 1)`, expectedOutput: false },
  { input: `(> 1 0)`, expectedOutput: true },
  { input: `(> 0 1)`, expectedOutput: false },
  { input: `(< 1 0)`, expectedOutput: false },
  { input: `(< 0 1)`, expectedOutput: true },
  { input: `(>= 0 1)`, expectedOutput: false },
  { input: `(>= 1 1)`, expectedOutput: true },
  { input: `(>= 2 1)`, expectedOutput: true },
  { input: `(<= 0 1)`, expectedOutput: true },
  { input: `(<= 1 1)`, expectedOutput: true },
  { input: `(<= 2 1)`, expectedOutput: false },
  { input: `(do (def pi 3.14) pi)`, expectedOutput: 3.14 },
  { input: `(do (do (def pi 3.14) pi))`, expectedOutput: 3.14 },
  { input: `(do (def square (lambda (x) (* x x))) (square 3))`, expectedOutput: 9 },
  { input: `(if 1 "true" "false")`, expectedOutput: "true" },
  { input: `(if 1 "true" "false")`, expectedOutput: "true" },
  { input: `(if 0 "true" "false")`, expectedOutput: "false" },
  {
    input: `(do (def factorial (lambda (x) (if (= x 0) 1 (* x (factorial (- x 1)))))) (factorial 10))`,
    expectedOutput: 3628800,
  },
  { input: `(abs -1)`, expectedOutput: 1 },
  { input: `(join (list 1) (list 2 3))`, expectedOutput: [1, 2, 3]},
];

describe("code generation produces equivalent JavaScript code", () => {
  positiveTestCases.forEach((testCase: IPositiveTestCase) => {
    test(`${testCase.input} => ${testCase.expectedOutput}`, () => {
      const tokenizer: Tokenizer = new Tokenizer(testCase.input);
      const parser: Parser = new Parser(tokenizer.tokenize());
      const chipmunkAst: ChipmunkNode = parser.parse();
      const javaScriptAst: JavaScriptNode = convertChipmunkNodeToJavaScriptNode(chipmunkAst, true);
      const javaScriptCode: string = compileJavaScriptToSourceNode(javaScriptAst).toString();
      const actualOutput: string = eval(javaScriptCode); // tslint:disable-line:no-eval
      expect(actualOutput).toEqual(testCase.expectedOutput);
    });
  });
});
