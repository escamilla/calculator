import namespace from "./core";

import SquirrelBoolean from "./types/SquirrelBoolean";
import SquirrelFunction from "./types/SquirrelFunction";

import Environment from "./Environment";

const globals: Environment = new Environment();

namespace.forEach((fn: SquirrelFunction, name: string) => {
  globals.set(name, fn);
});

globals.set("true", new SquirrelBoolean(true));
globals.set("false", new SquirrelBoolean(false));

export default globals;
