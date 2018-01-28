import Environment from "./Environment";
import Lexer from "./Lexer";
import Parser from "./Parser";

import namespace from "./core";
import evaluate from "./evaluate";

import SquirrelBoolean from "./types/SquirrelBoolean";
import SquirrelFunction from "./types/SquirrelFunction";

const globals: Environment = new Environment();

globals.set("true", new SquirrelBoolean(true));
globals.set("false", new SquirrelBoolean(false));

namespace.forEach((fn: SquirrelFunction, name: string) => {
  globals.set(name, fn);
});

const expressions: string[] = [
  "(let load-file (lambda (path) (eval (parse-string (read-file path)))))",
];

expressions.forEach((expression: string) => {
  const lexer: Lexer = new Lexer(expression);
  const parser: Parser = new Parser(lexer.lex());
  evaluate(parser.parse(), globals);
});

export default globals;
