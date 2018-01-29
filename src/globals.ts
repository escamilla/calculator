import Environment from "./Environment";
import SquirrelBoolean from "./types/SquirrelBoolean";
import SquirrelFunction from "./types/SquirrelFunction";

import namespace from "./core";
import interpret from "./interpret";

const globals: Environment = new Environment();

globals.set("true", new SquirrelBoolean(true));
globals.set("false", new SquirrelBoolean(false));

namespace.forEach((fn: SquirrelFunction, name: string) => {
  globals.set(name, fn);
});

interpret(`(let load-file (lambda (path) (eval (parse-string (concat "(sequence " (read-file path) ")")))))`, globals);

export default globals;
