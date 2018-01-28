/* tslint:disable:no-console object-literal-sort-keys */

import * as fs from "fs";
import * as parseArgs from "minimist";
import * as readline from "readline";
import * as util from "util";

const argv: parseArgs.ParsedArgs = parseArgs(process.argv.slice(2), {
  boolean: "verbose",
  alias: {
    v: "verbose",
  },
});

import Environment from "./Environment";
import Lexer from "./Lexer";
import Parser from "./Parser";

import evaluate from "./evaluate";
import globals from "./globals";

import SquirrelType from "./types/SquirrelType";

import Token from "./tokens/Token";

function interpret(input: string, environment: Environment): SquirrelType {
  const lexer: Lexer = new Lexer(input);
  const parser: Parser = new Parser(lexer.lex());
  return evaluate(parser.parse(), environment);
}

function runFile(filename: string): void {
  let input: string | undefined;
  try {
    input = fs.readFileSync(filename, "utf8");
  } catch (e) {
    console.log(e.message);
    process.exit();
  }

  const debugInfo: any = {
    input,
    tokens: undefined,
    ast: undefined,
    output: undefined,
    prettyOutput: undefined,
  };

  try {
    const lexer: Lexer = new Lexer(input as string);
    const tokens: Token[] = lexer.lex();
    debugInfo.tokens = tokens;

    const parser: Parser = new Parser(tokens);
    const ast: SquirrelType = parser.parse();
    debugInfo.ast = ast;

    const output: SquirrelType = evaluate(ast, globals);
    debugInfo.output = output;
    debugInfo.prettyOutput = output.toString();
  } catch (e) {
    if (argv.verbose) {
      console.log(util.inspect(debugInfo, { depth: null, colors: true }));
    }
    throw e;
  }

  if (argv.verbose) {
    console.log(util.inspect(debugInfo, { depth: null, colors: true }));
  } else {
    console.log(debugInfo.prettyOutput);
  }
}

function runRepl(): void {
  const rl: readline.ReadLine = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const replEnv: Environment = new Environment(globals);

  console.log("tip: _ (underscore) always contains the result of the most recently evaluated expression");
  rl.prompt();
  rl.on("line", (line: any) => {
    if (line.trim()) {
      let result: SquirrelType | undefined;
      try {
        result = interpret(line, replEnv);
      } catch (e) {
        console.log(e.message);
      }
      if (result) {
        replEnv.set("_", result);
        console.log(result.toString());
      }
    }
    rl.prompt();
  }).on("close", () => {
    process.exit(0);
  });
}

if (argv._.length > 0) {
  runFile(argv._.shift() as string);
} else {
  runRepl();
}
