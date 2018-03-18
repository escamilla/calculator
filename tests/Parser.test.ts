import Lexer from "../src/Lexer";
import Parser from "../src/Parser";
import Token from "../src/tokens/Token";

interface INegativeTestCase {
  input: string;
  reason: string;
}

const negativeTests: INegativeTestCase[] = [
  { input: "(", reason: "an opening parenthesis must have a matching closing parenthesis" },
  { input: ")", reason: "a closing parenthesis must have a matching opening parenthesis" },
  { input: "foo bar", reason: "there can only be one topmost expression" },
  { input: "(add 1 2) foo", reason: "there can only be one topmost expression" },
  { input: "foo (add 1 2)", reason: "there can only be one topmost expression" },
];

negativeTests.forEach((testCase: INegativeTestCase) => {
  test(`input cannot be parsed because ${testCase.reason}: ${testCase.input}`, () => {
    const lexer: Lexer = new Lexer(testCase.input);
    const tokens: Token[] = lexer.lex();
    const parser: Parser = new Parser(tokens);
    expect(() => parser.parse()).toThrow();
  });
});
