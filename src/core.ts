import * as fs from "fs";

import * as readlineSync from "readline-sync";

import Lexer from "./Lexer";
import Parser from "./Parser";
import SquirrelBoolean from "./types/SquirrelBoolean";
import SquirrelFunction from "./types/SquirrelFunction";
import SquirrelList from "./types/SquirrelList";
import SquirrelNumber from "./types/SquirrelNumber";
import SquirrelString from "./types/SquirrelString";
import SquirrelType from "./types/SquirrelType";

const namespace: Map<string, SquirrelFunction> = new Map();

namespace.set("add", new SquirrelFunction(
  (args: SquirrelType[]): SquirrelNumber => {
    const x: SquirrelNumber = args[0] as SquirrelNumber;
    const y: SquirrelNumber = args[1] as SquirrelNumber;
    return new SquirrelNumber(x.value + y.value);
  },
));

namespace.set("sub", new SquirrelFunction(
  (args: SquirrelType[]): SquirrelNumber => {
    const x: SquirrelNumber = args[0] as SquirrelNumber;
    const y: SquirrelNumber = args[1] as SquirrelNumber;
    return new SquirrelNumber(x.value - y.value);
  },
));

namespace.set("mul", new SquirrelFunction(
  (args: SquirrelType[]): SquirrelNumber => {
    const x: SquirrelNumber = args[0] as SquirrelNumber;
    const y: SquirrelNumber = args[1] as SquirrelNumber;
    return new SquirrelNumber(x.value * y.value);
  },
));

namespace.set("div", new SquirrelFunction(
  (args: SquirrelType[]): SquirrelNumber => {
    const x: SquirrelNumber = args[0] as SquirrelNumber;
    const y: SquirrelNumber = args[1] as SquirrelNumber;
    return new SquirrelNumber(x.value / y.value);
  },
));

namespace.set("mod", new SquirrelFunction(
  (args: SquirrelType[]): SquirrelNumber => {
    const x: SquirrelNumber = args[0] as SquirrelNumber;
    const y: SquirrelNumber = args[1] as SquirrelNumber;
    return new SquirrelNumber(x.value % y.value);
  },
));

namespace.set("pow", new SquirrelFunction(
  (args: SquirrelType[]): SquirrelNumber => {
    const x: SquirrelNumber = args[0] as SquirrelNumber;
    const y: SquirrelNumber = args[1] as SquirrelNumber;
    return new SquirrelNumber(Math.pow(x.value, y.value));
  },
));

namespace.set("list", new SquirrelFunction(
  (args: SquirrelType[]): SquirrelList => {
    return new SquirrelList(args);
  },
));

namespace.set("sequence", new SquirrelFunction(
  (args: SquirrelType[]): SquirrelType => {
    return args[args.length - 1];
  },
));

namespace.set("eq", new SquirrelFunction(
  (args: SquirrelType[]): SquirrelBoolean => {
    const x: SquirrelNumber = args[0] as SquirrelNumber;
    const y: SquirrelNumber = args[1] as SquirrelNumber;
    return new SquirrelBoolean(x.value === y.value);
  },
));

namespace.set("lt", new SquirrelFunction(
  (args: SquirrelType[]): SquirrelBoolean => {
    const x: SquirrelNumber = args[0] as SquirrelNumber;
    const y: SquirrelNumber = args[1] as SquirrelNumber;
    return new SquirrelBoolean(x.value < y.value);
  },
));

namespace.set("gt", new SquirrelFunction(
  (args: SquirrelType[]): SquirrelType => {
    const x: SquirrelNumber = args[0] as SquirrelNumber;
    const y: SquirrelNumber = args[1] as SquirrelNumber;
    return new SquirrelBoolean(x.value > y.value);
  },
));

namespace.set("length", new SquirrelFunction(
  (args: SquirrelType[]): SquirrelNumber => {
    const list: SquirrelList = args[0] as SquirrelList;
    return new SquirrelNumber(list.items.length);
  },
));

namespace.set("nth", new SquirrelFunction(
  (args: SquirrelType[]): SquirrelType => {
    const list: SquirrelList = args[0] as SquirrelList;
    const n: SquirrelNumber = args[1] as SquirrelNumber;
    return list.items[n.value - 1];
  },
));

namespace.set("slice", new SquirrelFunction(
  (args: SquirrelType[]): SquirrelList => {
    const list: SquirrelList = args[0] as SquirrelList;
    const start: SquirrelNumber = args[1] as SquirrelNumber;
    const end: SquirrelNumber = args[2] as SquirrelNumber;
    return new SquirrelList(list.items.slice(start.value, end.value));
  },
));

namespace.set("join", new SquirrelFunction(
  (args: SquirrelType[]): SquirrelList => {
    const list1: SquirrelList = args[0] as SquirrelList;
    const list2: SquirrelList = args[1] as SquirrelList;
    return new SquirrelList(list1.items.concat(list2.items));
  },
));

namespace.set("print", new SquirrelFunction(
  (args: SquirrelType[]): SquirrelType => {
    // tslint:disable-next-line:no-console
    console.log(args[0].toString());
    return args[0];
  },
));

namespace.set("concat", new SquirrelFunction(
  (args: SquirrelType[]): SquirrelString => {
    const castedArgs: SquirrelString[] = args.map((arg: SquirrelType) => arg as SquirrelString);
    const strings: string[] = castedArgs.map((arg: SquirrelString) => arg.value);
    return new SquirrelString(strings.join(""));
  },
));

// Takes a string and parses it as Squirrel code without evaluating it
namespace.set("parse-string", new SquirrelFunction(
  (args: SquirrelType[]): SquirrelType => {
    const input: SquirrelString = args[0] as SquirrelString;
    const lexer: Lexer = new Lexer(input.value);
    const parser: Parser = new Parser(lexer.lex());
    return parser.parse();
  },
));

// Takes a file name and returns the contents of the file as a string
namespace.set("read-file", new SquirrelFunction(
  (args: SquirrelType[]): SquirrelString => {
    const path: string = (args[0] as SquirrelString).value;
    const contents: string = fs.readFileSync(path).toString();
    return new SquirrelString(contents);
  },
));

// Displays a prompt and reads a line entered by the user
namespace.set("read-line", new SquirrelFunction(
  (args: SquirrelType[]): SquirrelString => {
    const prompt: string = (args[0] as SquirrelString).value;
    const line: string = readlineSync.question(prompt);
    return new SquirrelString(line);
  },
));

namespace.forEach((fn: SquirrelFunction, name: string) => {
  fn.name = name;
});

export { namespace };
