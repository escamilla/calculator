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
import Evaluator from "./Evaluator";
import Lexer from "./Lexer";
import Parser from "./Parser";

import INode from "./nodes/INode";

import Token from "./tokens/Token";

function interpret(input: string, environment?: Environment): INode {
  const lexer: Lexer = new Lexer(input);
  const parser: Parser = new Parser(lexer.lex());
  const evaluator: Evaluator = new Evaluator(parser.parse(), environment);
  return evaluator.evaluate();
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
    const ast: INode = parser.parse();
    debugInfo.ast = ast;

    const evaluator: Evaluator = new Evaluator(ast);
    const output: INode = evaluator.evaluate();
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

  const replEnvironment: Environment = new Environment();

  console.log("tip: _ (underscore) always contains the result of the most recently evaluated expression");
  rl.prompt();
  rl.on("line", (line: any) => {
    if (line.trim()) {
      let result: INode | undefined;
      try {
        result = interpret(line, replEnvironment);
      } catch (e) {
        console.log(e.message);
      }
      if (result) {
        replEnvironment.set("_", result);
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
