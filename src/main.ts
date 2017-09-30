/* tslint:disable:no-console object-literal-sort-keys */

import * as fs from "fs";
import * as parseArgs from "minimist";
import * as readline from "readline";
import * as util from "util";

const argv = parseArgs(process.argv.slice(2), {
  boolean: "verbose",
  alias: {
    v: "verbose",
  },
});

import Environment from "./Environment";
import Evaluator from "./Evaluator";
import Lexer from "./Lexer";
import Parser from "./Parser";

function interpret(input: string, environment: Environment = null) {
  const lexer = new Lexer(input);
  const parser = new Parser(lexer.lex());
  const evaluator = new Evaluator(parser.parse(), environment);
  return evaluator.evaluate();
}

function runFile(filename: string) {
  let input;
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
    const lexer = new Lexer(input);
    const tokens = lexer.lex();
    debugInfo.tokens = tokens;

    const parser = new Parser(tokens);
    const ast = parser.parse();
    debugInfo.ast = ast;

    const evaluator = new Evaluator(ast);
    const output = evaluator.evaluate();
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

function runRepl() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const replEnvironment = new Environment();

  console.log("tip: _ (underscore) always contains the result of the most recently evaluated expression");
  rl.prompt();
  rl.on("line", (line) => {
    if (line.trim()) {
      let result = null;
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
  runFile(argv._.shift());
} else {
  runRepl();
}
