import Environment from "./Environment.ts";
import evaluate from "./evaluate.ts";
import IOHandler from "./io/IOHandler.ts";
import Parser from "./Parser.ts";
import Tokenizer from "./Tokenizer.ts";
import { ChipmunkType } from "./types.ts";

function interpret(
  input: string,
  environment: Environment,
  ioHandler: IOHandler,
): ChipmunkType {
  const tokenizer: Tokenizer = new Tokenizer(input);
  const parser: Parser = new Parser(tokenizer.tokenize());
  return evaluate(parser.parse(), environment, ioHandler);
}

export default interpret;
