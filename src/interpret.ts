import Environment from "./Environment";
import evaluate from "./evaluate";
import IOHandler from "./io/IOHandler";
import SquirrelNode from "./nodes/SquirrelNode";
import Parser from "./Parser";
import Tokenizer from "./Tokenizer";

function interpret(input: string, environment: Environment, ioHandler: IOHandler): SquirrelNode {
    const tokenizer: Tokenizer = new Tokenizer(input);
    const parser: Parser = new Parser(tokenizer.tokenize());
    return evaluate(parser.parse(), environment, ioHandler);
}

export default interpret;
