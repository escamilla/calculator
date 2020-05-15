import interpret from "../../src/interpret.ts";
import dummyIOHandler from "../../src/io/dummyIOHandler.ts";
import replEnv from "../../src/replEnv.ts";
import toString from "../../src/utils/toString.ts";

import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

interface ITestCase {
  input: string;
  expectedOutput: string;
  printable?: boolean;
}

const testCases: ITestCase[] = [
  { input: "true", expectedOutput: "true" },
  { input: "false", expectedOutput: "false" },
  {
    input: `(lambda () (list true (lambda (x) (* x x)) + 3.14 'pi "pi"))`,
    expectedOutput:
      `(lambda () (list true (lambda (x) (* x x)) + 3.14 (quote pi) "pi"))`,
  },
  { input: "+", expectedOutput: "+" },
  {
    input: `(list true (lambda (x) (* x x)) + 3.14 'pi "pi")`,
    expectedOutput: `(true (lambda (x) (* x x)) + 3.14 pi "pi")`,
  },
  { input: "nil", expectedOutput: "nil" },
  { input: "3.14", expectedOutput: "3.14" },
  { input: "'pi", expectedOutput: "pi" },
  // ChipmunkString test cases (printable = false)
  { input: `"test"`, expectedOutput: `"test"`, printable: false },
  { input: `"test\\ntest"`, expectedOutput: `"test\\ntest"`, printable: false },
  { input: `"\\"test\\""`, expectedOutput: `"\\"test\\""`, printable: false },
  {
    input: `"\\\\test\\\\"`,
    expectedOutput: `"\\\\test\\\\"`,
    printable: false,
  },
  // ChipmunkString test cases (printable = true)
  { input: `"test"`, expectedOutput: `test`, printable: true },
  { input: `"test\\ntest"`, expectedOutput: `test\ntest`, printable: true },
  { input: `"\\"test\\""`, expectedOutput: `"test"`, printable: true },
  { input: `"\\\\test\\\\"`, expectedOutput: `\\test\\`, printable: true },
];

testCases.forEach((testCase: ITestCase) => {
  Deno.test({
    name:
      `\`${testCase.input}\` => \`${testCase.expectedOutput}\` (printable = ${testCase.printable})`,
    fn: () => {
      const actualOutput: string = toString(
        interpret(testCase.input, replEnv, dummyIOHandler),
        testCase.printable,
      );
      assertEquals(actualOutput, testCase.expectedOutput);
    },
  });
});
