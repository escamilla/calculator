import Environment from "./Environment";
import Lexer from "./Lexer";
import Parser from "./Parser";

import SquirrelType from "./types/SquirrelType";

import evaluate from "./evaluate";

function interpret(input: string, environment: Environment): SquirrelType {
    const lexer: Lexer = new Lexer(input);
    const parser: Parser = new Parser(lexer.lex());
    return evaluate(parser.parse(), environment);
}

export default interpret;
