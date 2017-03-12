const util = require('util');

const parseArgs = require('minimist');
const argv = parseArgs(process.argv.slice(2), {
  boolean: 'verbose',
  alias: {
    v: 'verbose'
  }
});

const Lexer = require('./lexer');
const Parser = require('./parser');
const Evaluator = require('./evaluator');

if (argv._.length === 0) {
  console.log('no expression given');
  process.exit();
}

const input = argv._.shift().toString();
const debugInfo = {input};

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
} catch (e) {
  if (argv.verbose) {
    console.log(util.inspect(debugInfo, {depth: null, colors: true}));
  }
  throw e;
}

if (argv.verbose) {
  console.log(util.inspect(debugInfo, {depth: null, colors: true}));
} else {
  console.log(util.inspect(debugInfo.output), {depth: null, colors: true});
}
