import Environment from "./Environment";
import evaluate from "./evaluate";
import IOHandler from "./IOHandler";
import Lexer from "./Lexer";
import SquirrelNode from "./nodes/SquirrelNode";
import Parser from "./Parser";

function interpret(input: string, environment: Environment, ioHandler: IOHandler): SquirrelNode {
    const lexer: Lexer = new Lexer(input);
    const parser: Parser = new Parser(lexer.lex());
    return evaluate(parser.parse(), environment, ioHandler);
}

export default interpret;
