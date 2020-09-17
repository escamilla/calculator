import type Environment from "./Environment.ts";
import type { ChipmunkType } from "./types.ts";
import evaluate from "./evaluate.ts";
import Parser from "./Parser.ts";
import Tokenizer from "./Tokenizer.ts";

function interpret(
  input: string,
  environment: Environment,
): ChipmunkType {
  const tokenizer: Tokenizer = new Tokenizer(input);
  const parser: Parser = new Parser(tokenizer.tokenize());
  return evaluate(parser.parse(), environment);
}

export default interpret;
