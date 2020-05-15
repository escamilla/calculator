import * as readlineSync from "readline-sync";

import interpret from "./interpret";
import nodeIOHandler from "./nodeIOHandler";
import replEnv from "./replEnv";
import { ChipmunkNodeType, ChipmunkString, ChipmunkType } from "./types";
import toString from "./utils/toString";

const loadFileDefinition: string =
  `(def load-file (lambda (path)
     (eval (parse-string (concat "(do " (read-file path) ")")))))`;
interpret(loadFileDefinition, replEnv, nodeIOHandler);

if (process.argv.length > 2) {
  const paths: ChipmunkString[] = [];
  process.argv.slice(3).forEach((value: string): void => {
    paths.push({
      type: ChipmunkNodeType.String,
      value,
    });
  });
  replEnv.set("argv", {
    type: ChipmunkNodeType.List,
    items: paths,
  });
  interpret(`(load-file "${process.argv[2]}")`, replEnv, nodeIOHandler);
  process.exit(0);
}

process.stdout.write('Enter "exit" or press ^C to exit\n');
process.stdout.write('Tip: The underscore symbol ("_") always contains the value of the last expression\n');
readlineSync.setPrompt("> ");
while (true) {
  const line: string = readlineSync.prompt().trim();
  if (line) {
    if (line === "exit") {
      process.exit(0);
    }
    let result: ChipmunkType;
    try {
      result = interpret(line, replEnv, nodeIOHandler);
    } catch (e) {
      process.stdout.write(e.message + "\n");
      continue;
    }
    replEnv.set("_", result);
    if (result.type !== ChipmunkNodeType.Nil) {
      process.stdout.write(toString(result) + "\n");
    }
  }
}
