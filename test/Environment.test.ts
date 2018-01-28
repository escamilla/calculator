import { } from "jest";

import Environment from "../src/Environment";

import SquirrelNumber from "../src/types/SquirrelNumber";

describe("Environment.get()", () => {
  test("returns a value defined in the current scope", () => {
    const scope: Environment = new Environment();
    scope.set("pi", new SquirrelNumber(3.14));
    expect(scope.get("pi")).toEqual(new SquirrelNumber(3.14));
  });

  test("returns a value defined in the outer scope", () => {
    const outerScope: Environment = new Environment();
    const innerScope: Environment = new Environment(outerScope);
    outerScope.set("pi", new SquirrelNumber(3.14));
    expect(innerScope.get("pi")).toEqual(new SquirrelNumber(3.14));
  });

  test("returns a value defined in the outermost scope", () => {
    const outermostScope: Environment = new Environment();
    const outerScope: Environment = new Environment(outermostScope);
    const innerScope: Environment = new Environment(outerScope);
    outermostScope.set("pi", new SquirrelNumber(3.14));
    expect(innerScope.get("pi")).toEqual(new SquirrelNumber(3.14));
  });

  test("cannot return a value defined in the inner scope", () => {
    const outerScope: Environment = new Environment();
    const innerScope: Environment = new Environment(outerScope);
    innerScope.set("pi", new SquirrelNumber(3.14));
    expect(outerScope.get("pi")).toBeNull();
  });

  test("returns a value defined in the inner scope that shadows one defined in the outer scope", () => {
    const outerScope: Environment = new Environment();
    const innerScope: Environment = new Environment(outerScope);
    outerScope.set("pi", new SquirrelNumber(3.142));
    innerScope.set("pi", new SquirrelNumber(3.14));
    expect(innerScope.get("pi")).toEqual(new SquirrelNumber(3.14));
  });
});
