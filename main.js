const Parser = require('./parser');
const parser = new Parser("(* (+ 1 2) 3)");
const util = require('util');
console.log(util.inspect(parser.parseExpression(), { depth: null, colors: true }));
