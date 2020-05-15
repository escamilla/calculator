import { readLines } from "https://deno.land/std/io/bufio.ts";

import interpret from "./interpret.ts";
import nodeIOHandler from "./nodeIOHandler.ts";
import replEnv from "./replEnv.ts";
import { ChipmunkNodeType, ChipmunkString, ChipmunkType } from "./types.ts";
import toString from "./utils/toString.ts";

const loadFileDefinition: string = `(def load-file (lambda (path)
     (eval (parse-string (concat "(do " (read-file path) ")")))))`;
interpret(loadFileDefinition, replEnv, nodeIOHandler);

if (Deno.args.length > 0) {
  const paths: ChipmunkString[] = [];
  Deno.args.slice(1).forEach((value: string) => {
    paths.push({
      type: ChipmunkNodeType.String,
      value,
    });
  });
  replEnv.set("argv", {
    type: ChipmunkNodeType.List,
    items: paths,
  });
  interpret(`(load-file "${Deno.args[0]}")`, replEnv, nodeIOHandler);
  Deno.exit(0);
}

Deno.stdout.writeSync(
  new TextEncoder().encode('Enter "exit" or press ^C to exit\n'),
);
Deno.stdout.writeSync(
  new TextEncoder().encode(
    'Tip: The underscore symbol ("_") always contains the value of the last expression\n',
  ),
);
while (true) {
  Deno.stdout.writeSync(new TextEncoder().encode("> "));
  for await (const line of readLines(Deno.stdin)) {
    if (line) {
      if (line === "exit") {
        Deno.exit(0);
      }
      let result: ChipmunkType;
      try {
        result = interpret(line, replEnv, nodeIOHandler);
      } catch (e) {
        Deno.stdout.writeSync(new TextEncoder().encode(e.message + "\n"));
        continue;
      }
      replEnv.set("_", result);
      if (result.type !== ChipmunkNodeType.Nil) {
        Deno.stdout.writeSync(
          new TextEncoder().encode(toString(result) + "\n"),
        );
      }
    }
    Deno.stdout.writeSync(new TextEncoder().encode("> "));
  }
}
