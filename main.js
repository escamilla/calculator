const util = require('util');

const parseArgs = require('minimist');
const argv = parseArgs(process.argv.slice(2), {
  boolean: 'verbose',
  alias: {
    v: 'verbose'
  }
});

const Parser = require('./parser');
const Evaluator = require('./evaluator');

if (argv._.length === 0) {
  console.log('no expression given');
  process.exit();
}

const input = argv._.shift();

const parser = new Parser(input);
const ast = parser.parseExpression();

const evaluator = new Evaluator(ast);
const output = evaluator.evaluate().value;

if (argv.verbose) {
  const details = { input, output, ast };
  console.log(util.inspect(details, { depth: null, colors: true}));
} else {
  console.log(output);
}
