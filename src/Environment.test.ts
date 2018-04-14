import Environment from "./Environment";
import ChipmunkNodeType from "./nodes/ChipmunkNodeType";

describe("Environment.get()", () => {
  test("returns a value defined in the current environment", () => {
    const env: Environment = new Environment();
    env.set("pi", { type: ChipmunkNodeType.NUMBER, value: 3.14 });
    expect(env.get("pi")).toEqual({ type: ChipmunkNodeType.NUMBER, value: 3.14 });
  });

  test("returns a value defined in the immediate outer environment", () => {
    const outerEnv: Environment = new Environment();
    const innerEnv: Environment = new Environment(outerEnv);
    outerEnv.set("pi", { type: ChipmunkNodeType.NUMBER, value: 3.14 });
    expect(innerEnv.get("pi")).toEqual({ type: ChipmunkNodeType.NUMBER, value: 3.14 });
  });

  test("returns a value defined in the non-immediate outer environment", () => {
    const outermostEnv: Environment = new Environment();
    const outerEnv: Environment = new Environment(outermostEnv);
    const innerEnv: Environment = new Environment(outerEnv);
    outermostEnv.set("pi", { type: ChipmunkNodeType.NUMBER, value: 3.14 });
    expect(innerEnv.get("pi")).toEqual({ type: ChipmunkNodeType.NUMBER, value: 3.14 });
  });

  test("cannot return a value defined in the inner environment from the outer environment", () => {
    const outerEnv: Environment = new Environment();
    const innerEnv: Environment = new Environment(outerEnv);
    innerEnv.set("pi", { type: ChipmunkNodeType.NUMBER, value: 3.14 });
    expect(() => outerEnv.get("pi")).toThrow();
  });

  test("returns a value defined in the inner environment that shadows one defined in the outer environment", () => {
    const outerEnv: Environment = new Environment();
    const innerEnv: Environment = new Environment(outerEnv);
    outerEnv.set("pi", { type: ChipmunkNodeType.NUMBER, value: 3.142 });
    innerEnv.set("pi", { type: ChipmunkNodeType.NUMBER, value: 3.14 });
    expect(innerEnv.get("pi")).toEqual({ type: ChipmunkNodeType.NUMBER, value: 3.14 });
  });
});
