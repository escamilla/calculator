const fs = require('fs');
const util = require('util');
const parseArgs = require('minimist');
const readline = require('readline');

const argv = parseArgs(process.argv.slice(2), {
  boolean: 'verbose',
  alias: {
    v: 'verbose',
  },
});

import Lexer from './lexer';
import Parser from './parser';
import Evaluator from './evaluator';
import Environment from './environment';

function interpret(input, environment = null) {
  const lexer = new Lexer(input);
  const parser = new Parser(lexer.lex());
  const evaluator = new Evaluator(parser.parse(), environment);
  return evaluator.evaluate();
}

function runFile(filename) {
  let input;
  try {
    input = fs.readFileSync(filename, 'utf8');
  } catch (e) {
    console.log(e.message);
    process.exit();
  }

  const debugInfo = {
    input,
    tokens: undefined,
    ast: undefined,
    output: undefined,
    prettyOutput: undefined
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

  console.log('tip: the result of the most recently evaluated expression is assigned to the special variable _ (underscore)');
  rl.prompt();
  rl.on('line', (line) => {
    if (line.trim()) {
      let result = null;
      try {
        result = interpret(line, replEnvironment);
      } catch (e) {
        console.log(e.message);
      }
      if (result) {
        replEnvironment.set('_', result);
        console.log(result.toString());
      }
    }
    rl.prompt();
  }).on('close', () => {
    process.exit(0);
  });
}

if (argv._.length > 0) {
  runFile(argv._.shift());
} else {
  runRepl();
}
