const TokenStream = require('./token-stream');

const tokenStream = new TokenStream("(+ 1 2)");
let token;
while ((token = tokenStream.next()) !== null) {
  console.log(token);
}
