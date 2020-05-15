import Parser from "../src/Parser.ts";
import Tokenizer from "../src/Tokenizer.ts";
import { Token } from "../src/tokens.ts";
import { assertThrows } from "https://deno.land/std/testing/asserts.ts";

interface INegativeTestCase {
  input: string;
  reason: string;
}

const negativeTests: INegativeTestCase[] = [
  {
    input: "(",
    reason: "an opening parenthesis must have a matching closing parenthesis",
  },
  {
    input: ")",
    reason: "a closing parenthesis must have a matching opening parenthesis",
  },
  { input: "foo bar", reason: "there can only be one topmost expression" },
  {
    input: "(add 1 2) foo",
    reason: "there can only be one topmost expression",
  },
  {
    input: "foo (add 1 2)",
    reason: "there can only be one topmost expression",
  },
];

negativeTests.forEach((testCase: INegativeTestCase) => {
  Deno.test({
    name:
      `input cannot be parsed because ${testCase.reason}: ${testCase.input}`,
    fn: () => {
      const tokenizer: Tokenizer = new Tokenizer(testCase.input);
      const tokens: Token[] = tokenizer.tokenize();
      const parser: Parser = new Parser(tokens);
      assertThrows(() => parser.parse());
    },
  });
});
