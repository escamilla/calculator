const util = require('util');

const Parser = require('./parser');
const Evaluator = require('./evaluator');

const input = "(* (+ 1 2) 3)";

const parser = new Parser(input);
const ast = parser.parseExpression();

const evaluator = new Evaluator(ast);
const output = evaluator.evaluate().value;

const details = { input, output, ast };
console.log(util.inspect(details, { depth: null, colors: true}));
