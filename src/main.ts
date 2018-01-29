/* tslint:disable:no-console */

import * as readline from "readline";

import Environment from "./Environment";

import SquirrelType from "./types/SquirrelType";

import globals from "./globals";
import interpret from "./interpret";

function startRepl(): void {
  const rl: readline.ReadLine = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const replEnv: Environment = new Environment(globals);

  if (process.argv.length > 2) {
    interpret(`(load-file "${process.argv[2]}")`, replEnv);
    process.exit(0);
  }

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
}

startRepl();
