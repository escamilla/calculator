import IOHandler from "./IOHandler";
import Lexer from "./Lexer";
import Parser from "./Parser";
import toString from "./toString";
import SquirrelBoolean from "./types/SquirrelBoolean";
import SquirrelFunction from "./types/SquirrelFunction";
import SquirrelList from "./types/SquirrelList";
import SquirrelNil from "./types/SquirrelNil";
import SquirrelNumber from "./types/SquirrelNumber";
import SquirrelString from "./types/SquirrelString";
import SquirrelType from "./types/SquirrelType";

const namespace: Map<string, SquirrelFunction> = new Map();

namespace.set("+", new SquirrelFunction(
  (args: SquirrelType[]): SquirrelNumber => {
    const x: SquirrelNumber = args[0] as SquirrelNumber;
    const y: SquirrelNumber = args[1] as SquirrelNumber;
    return new SquirrelNumber(x.value + y.value);
  },
));

namespace.set("-", new SquirrelFunction(
  (args: SquirrelType[]): SquirrelNumber => {
    const x: SquirrelNumber = args[0] as SquirrelNumber;
    const y: SquirrelNumber = args[1] as SquirrelNumber;
    return new SquirrelNumber(x.value - y.value);
  },
));

namespace.set("*", new SquirrelFunction(
  (args: SquirrelType[]): SquirrelNumber => {
    const x: SquirrelNumber = args[0] as SquirrelNumber;
    const y: SquirrelNumber = args[1] as SquirrelNumber;
    return new SquirrelNumber(x.value * y.value);
  },
));

namespace.set("/", new SquirrelFunction(
  (args: SquirrelType[]): SquirrelNumber => {
    const x: SquirrelNumber = args[0] as SquirrelNumber;
    const y: SquirrelNumber = args[1] as SquirrelNumber;
    return new SquirrelNumber(x.value / y.value);
  },
));

namespace.set("%", new SquirrelFunction(
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

namespace.set("=", new SquirrelFunction(
  (args: SquirrelType[]): SquirrelBoolean => {
    const x: SquirrelNumber = args[0] as SquirrelNumber;
    const y: SquirrelNumber = args[1] as SquirrelNumber;
    return new SquirrelBoolean(x.value === y.value);
  },
));

namespace.set("<", new SquirrelFunction(
  (args: SquirrelType[]): SquirrelBoolean => {
    const x: SquirrelNumber = args[0] as SquirrelNumber;
    const y: SquirrelNumber = args[1] as SquirrelNumber;
    return new SquirrelBoolean(x.value < y.value);
  },
));

namespace.set(">", new SquirrelFunction(
  (args: SquirrelType[]): SquirrelType => {
    const x: SquirrelNumber = args[0] as SquirrelNumber;
    const y: SquirrelNumber = args[1] as SquirrelNumber;
    return new SquirrelBoolean(x.value > y.value);
  },
));

namespace.set("list", new SquirrelFunction(
  (args: SquirrelType[]): SquirrelList => {
    return new SquirrelList(args);
  },
));

namespace.set("length", new SquirrelFunction(
  (args: SquirrelType[]): SquirrelNumber => {
    if (args[0] instanceof SquirrelList) {
      return new SquirrelNumber((args[0] as SquirrelList).items.length);
    } else if (args[0] instanceof SquirrelString) {
      return new SquirrelNumber((args[0] as SquirrelString).value.length);
    } else {
      throw new Error("length() takes a list or string");
    }
  },
));

namespace.set("nth", new SquirrelFunction(
  (args: SquirrelType[]): SquirrelType => {
    const index: SquirrelNumber = args[1] as SquirrelNumber;

    if (args[0] instanceof SquirrelList) {
      const list: SquirrelList = args[0] as SquirrelList;
      return list.items[index.value];
    } else if (args[0] instanceof SquirrelString) {
      const str: SquirrelString = args[0] as SquirrelString;
      return new SquirrelString(str.value.charAt(index.value));
    } else {
      throw new Error("nth() takes a list or string");
    }
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

namespace.set("concat", new SquirrelFunction(
  (args: SquirrelType[]): SquirrelString => {
    const castedArgs: SquirrelString[] = args.map((arg: SquirrelType) => arg as SquirrelString);
    const strings: string[] = castedArgs.map((arg: SquirrelString) => arg.value);
    return new SquirrelString(strings.join(""));
  },
));

namespace.set("to-string", new SquirrelFunction(
  (args: SquirrelType[]): SquirrelString => {
    return new SquirrelString(toString(args[0]));
  },
));

namespace.set("print", new SquirrelFunction(
  (args: SquirrelType[], ioHandler: IOHandler): SquirrelNil => {
    const message: string = toString(args[0], true);
    ioHandler.print(message);
    return new SquirrelNil();
  },
));

namespace.set("print-line", new SquirrelFunction(
  (args: SquirrelType[], ioHandler: IOHandler): SquirrelNil => {
    if (args.length === 0) {
      ioHandler.printLine();
    } else {
      const message: string = toString(args[0], true);
      ioHandler.printLine(message);
    }
    return new SquirrelNil();
  },
));

namespace.set("parse-string", new SquirrelFunction(
  (args: SquirrelType[]): SquirrelType => {
    const input: SquirrelString = args[0] as SquirrelString;
    const lexer: Lexer = new Lexer(input.value);
    const parser: Parser = new Parser(lexer.lex());
    return parser.parse();
  },
));

namespace.set("read-file", new SquirrelFunction(
  (args: SquirrelType[], ioHandler: IOHandler): SquirrelString => {
    const path: string = (args[0] as SquirrelString).value;
    const contents: string = ioHandler.readFile(path);
    return new SquirrelString(contents);
  },
));

namespace.set("read-line", new SquirrelFunction(
  (args: SquirrelType[], ioHandler: IOHandler): SquirrelString => {
    const prompt: string = (args[0] as SquirrelString).value;
    const line: string = ioHandler.readLine(prompt);
    return new SquirrelString(line);
  },
));

namespace.set("do", new SquirrelFunction(
  (args: SquirrelType[]): SquirrelType => {
    return args[args.length - 1];
  },
));

namespace.forEach((fn: SquirrelFunction, name: string) => {
  fn.name = name;
});

export { namespace };
