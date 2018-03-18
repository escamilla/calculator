import Environment from "./Environment";
import evaluate from "./evaluate";
import IOHandler from "./IOHandler";
import Lexer from "./Lexer";
import Parser from "./Parser";
import SquirrelType from "./types/SquirrelType";

function interpret(input: string, environment: Environment, ioHandler: IOHandler): SquirrelType {
    const lexer: Lexer = new Lexer(input);
    const parser: Parser = new Parser(lexer.lex());
    return evaluate(parser.parse(), environment, ioHandler);
}

export default interpret;
