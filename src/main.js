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

const { SymbolNode } = require('./nodes');
const Lexer = require('./lexer');
const Parser = require('./parser');
const Evaluator = require('./evaluator');
const Environment = require('./environment');

(() => {
  function interpret(input, environment = null) {
    const lexer = new Lexer(input);
    const parser = new Parser(lexer.lex());
    const evaluator = new Evaluator(parser.parse(), environment);
    return evaluator.evaluate();
  }

  module.exports = {
    Lexer,
    Parser,
    Evaluator,
    interpret,
  };

  function runFile(filename) {
    let input;
    try {
      input = fs.readFileSync(filename, 'utf8');
    } catch (e) {
      console.log(e.message);
      process.exit();
    }

    const debugInfo = { input };

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
          replEnvironment.define(new SymbolNode('_'), result);
          console.log(result.toString());
        }
      }
      rl.prompt();
    }).on('close', () => {
      process.exit(0);
    });
  }

  if (!module.parent) {
    if (argv._.length > 0) {
      runFile(argv._.shift());
    } else {
      runRepl();
    }
  }
})();
