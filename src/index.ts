import * as readlineSync from "readline-sync";

import {
  interpret,
  replEnv,
  SquirrelList,
  SquirrelNil,
  SquirrelString,
  SquirrelType,
  toString,
} from "squirrel-core";

if (process.argv.length > 2) {
  replEnv.set("argv", new SquirrelList(process.argv.slice(3).map((value: string) => new SquirrelString(value))));
  interpret(`(load-file "${process.argv[2]}")`, replEnv);
  process.exit(0);
}

process.stdout.write("tip: _ (underscore) always contains the result of the most recently evaluated expression\n");
readlineSync.setPrompt("> ");
while (true) {
  const line: string = readlineSync.prompt();
  if (line.trim()) {
    let result: SquirrelType;
    try {
      result = interpret(line, replEnv);
    } catch (e) {
      process.stdout.write(e.message + "\n");
      continue;
    }
    replEnv.set("_", result);
    if (!(result instanceof SquirrelNil)) {
      process.stdout.write(toString(result) + "\n");
    }
  }
}
