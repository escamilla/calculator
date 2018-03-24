import {
  Lexer,
  Parser,
  replEnv,
  SquirrelType,
  toString,
} from "squirrel-core";

import { convertToJavaScriptAST, generateJavaScriptSourceCode } from "../src/codegen";
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
  { input: `(def pi 3.14)`, expectedOutput: undefined },
  { input: `(do (def pi 3.14) pi)`, expectedOutput: 3.14 },
  { input: `(do (do (def pi 3.14) pi))`, expectedOutput: 3.14 },
  { input: `(do (def square (lambda (x) (* x x))) (square 3))`, expectedOutput: 9 },
];

describe("codegen() follows expected behavior", () => {
  positiveTestCases.forEach((testCase: IPositiveTestCase) => {
    test(`${testCase.input} => ${testCase.expectedOutput}`, () => {
      const lexer: Lexer = new Lexer(testCase.input);
      const parser: Parser = new Parser(lexer.lex());
      const squirrelAst: SquirrelType = parser.parse();
      const javaScriptAst: JavaScriptNode = convertToJavaScriptAST(squirrelAst);
      const javaScriptCode: string = generateJavaScriptSourceCode(javaScriptAst);
      // tslint:disable-next-line:no-eval
      const actualOutput: string = eval(javaScriptCode);
      expect(actualOutput).toEqual(testCase.expectedOutput);
    });
  });
});
