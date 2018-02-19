import * as readline from "readline";

import interpret from "./interpret";
import replEnv from "./replEnv";
import SquirrelType from "./types/SquirrelType";

const rl: readline.ReadLine = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

if (process.argv.length > 2) {
  interpret(`(load-file "${process.argv[2]}")`, replEnv);
  process.exit(0);
}

/* tslint:disable:no-console */
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
