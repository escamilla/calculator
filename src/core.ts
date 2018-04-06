import IOHandler from "./IOHandler";
import Lexer from "./Lexer";
import SquirrelBoolean from "./nodes/SquirrelBoolean";
import SquirrelFunction from "./nodes/SquirrelFunction";
import SquirrelList from "./nodes/SquirrelList";
import SquirrelNil from "./nodes/SquirrelNil";
import SquirrelNode from "./nodes/SquirrelNode";
import SquirrelNodeType from "./nodes/SquirrelNodeType";
import SquirrelNumber from "./nodes/SquirrelNumber";
import SquirrelString from "./nodes/SquirrelString";
import Parser from "./Parser";
import toString from "./toString";

const callables: Map<string, (args: SquirrelNode[], ioHandler: IOHandler) => SquirrelNode> = new Map();

callables.set("+",
  (args: SquirrelNode[]): SquirrelNumber => {
    const x: SquirrelNumber = args[0] as SquirrelNumber;
    const y: SquirrelNumber = args[1] as SquirrelNumber;
    return { type: SquirrelNodeType.NUMBER, value: x.value + y.value };
  },
);

callables.set("-",
  (args: SquirrelNode[]): SquirrelNumber => {
    const x: SquirrelNumber = args[0] as SquirrelNumber;
    const y: SquirrelNumber = args[1] as SquirrelNumber;
    return { type: SquirrelNodeType.NUMBER, value: x.value - y.value };
  },
);

callables.set("*",
  (args: SquirrelNode[]): SquirrelNumber => {
    const x: SquirrelNumber = args[0] as SquirrelNumber;
    const y: SquirrelNumber = args[1] as SquirrelNumber;
    return { type: SquirrelNodeType.NUMBER, value: x.value * y.value };
  },
);

callables.set("/",
  (args: SquirrelNode[]): SquirrelNumber => {
    const x: SquirrelNumber = args[0] as SquirrelNumber;
    const y: SquirrelNumber = args[1] as SquirrelNumber;
    return { type: SquirrelNodeType.NUMBER, value: x.value / y.value };
  },
);

callables.set("%",
  (args: SquirrelNode[]): SquirrelNumber => {
    const x: SquirrelNumber = args[0] as SquirrelNumber;
    const y: SquirrelNumber = args[1] as SquirrelNumber;
    return { type: SquirrelNodeType.NUMBER, value: x.value % y.value };
  },
);

callables.set("pow",
  (args: SquirrelNode[]): SquirrelNumber => {
    const x: SquirrelNumber = args[0] as SquirrelNumber;
    const y: SquirrelNumber = args[1] as SquirrelNumber;
    return { type: SquirrelNodeType.NUMBER, value: Math.pow(x.value, y.value) };
  },
);

callables.set("=",
  (args: SquirrelNode[]): SquirrelBoolean => {
    const x: SquirrelNumber = args[0] as SquirrelNumber;
    const y: SquirrelNumber = args[1] as SquirrelNumber;
    return { type: SquirrelNodeType.BOOLEAN, value: x.value === y.value };
  },
);

callables.set("<",
  (args: SquirrelNode[]): SquirrelBoolean => {
    const x: SquirrelNumber = args[0] as SquirrelNumber;
    const y: SquirrelNumber = args[1] as SquirrelNumber;
    return { type: SquirrelNodeType.BOOLEAN, value: x.value < y.value };
  },
);

callables.set(">",
  (args: SquirrelNode[]): SquirrelNode => {
    const x: SquirrelNumber = args[0] as SquirrelNumber;
    const y: SquirrelNumber = args[1] as SquirrelNumber;
    return { type: SquirrelNodeType.BOOLEAN, value: x.value > y.value };
  },
);

callables.set("list",
  (args: SquirrelNode[]): SquirrelList => {
    return { type: SquirrelNodeType.LIST, items: args };
  },
);

callables.set("length",
  (args: SquirrelNode[]): SquirrelNumber => {
    const arg: SquirrelNode = args[0];
    if (arg.type === SquirrelNodeType.LIST) {
      return { type: SquirrelNodeType.NUMBER, value: arg.items.length };
    } else if (arg.type === SquirrelNodeType.STRING) {
      return { type: SquirrelNodeType.NUMBER, value: arg.value.length };
    } else {
      throw new Error("length() takes a list or string");
    }
  },
);

callables.set("nth",
  (args: SquirrelNode[]): SquirrelNode => {
    const arg: SquirrelNode = args[0];
    const index: SquirrelNumber = args[1] as SquirrelNumber;

    if (arg.type === SquirrelNodeType.LIST) {
      return arg.items[index.value];
    } else if (arg.type === SquirrelNodeType.STRING) {
      return { type: SquirrelNodeType.STRING, value: arg.value.charAt(index.value) };
    } else {
      throw new Error("nth() takes a list or string");
    }
  },
);

callables.set("slice",
  (args: SquirrelNode[]): SquirrelList => {
    const list: SquirrelList = args[0] as SquirrelList;
    const start: SquirrelNumber = args[1] as SquirrelNumber;
    const end: SquirrelNumber = args[2] as SquirrelNumber;
    return { type: SquirrelNodeType.LIST, items: list.items.slice(start.value, end.value) };
  },
);

callables.set("join",
  (args: SquirrelNode[]): SquirrelList => {
    const list1: SquirrelList = args[0] as SquirrelList;
    const list2: SquirrelList = args[1] as SquirrelList;
    return { type: SquirrelNodeType.LIST, items: list1.items.concat(list2.items) };
  },
);

callables.set("concat",
  (args: SquirrelNode[]): SquirrelString => {
    const castedArgs: SquirrelString[] = args.map((arg: SquirrelNode) => arg as SquirrelString);
    const strings: string[] = castedArgs.map((arg: SquirrelString) => arg.value);
    return { type: SquirrelNodeType.STRING, value: strings.join("") };
  },
);

callables.set("to-string",
  (args: SquirrelNode[]): SquirrelString => {
    return { type: SquirrelNodeType.STRING, value: toString(args[0]) };
  },
);

callables.set("print",
  (args: SquirrelNode[], ioHandler: IOHandler): SquirrelNil => {
    const message: string = toString(args[0], true);
    ioHandler.print(message);
    return { type: SquirrelNodeType.NIL };
  },
);

callables.set("print-line",
  (args: SquirrelNode[], ioHandler: IOHandler): SquirrelNil => {
    if (args.length === 0) {
      ioHandler.printLine();
    } else {
      const message: string = toString(args[0], true);
      ioHandler.printLine(message);
    }
    return { type: SquirrelNodeType.NIL };
  },
);

callables.set("parse-string",
  (args: SquirrelNode[]): SquirrelNode => {
    const input: SquirrelString = args[0] as SquirrelString;
    const lexer: Lexer = new Lexer(input.value);
    const parser: Parser = new Parser(lexer.lex());
    return parser.parse();
  },
);

callables.set("read-file",
  (args: SquirrelNode[], ioHandler: IOHandler): SquirrelString => {
    const path: string = (args[0] as SquirrelString).value;
    const contents: string = ioHandler.readFile(path);
    return { type: SquirrelNodeType.STRING, value: contents };
  },
);

callables.set("read-line",
  (args: SquirrelNode[], ioHandler: IOHandler): SquirrelString => {
    const prompt: string = (args[0] as SquirrelString).value;
    const line: string = ioHandler.readLine(prompt);
    return { type: SquirrelNodeType.STRING, value: line };
  },
);

callables.set("do",
  (args: SquirrelNode[]): SquirrelNode => {
    return args[args.length - 1];
  },
);

const namespace: Map<string, SquirrelFunction> = new Map();
callables.forEach((callable: (args: SquirrelNode[], ioHandler: IOHandler) => SquirrelNode, name: string) => {
  namespace.set(name, {
    type: SquirrelNodeType.FUNCTION,
    callable,
    isUserDefined: false,
    name,
  });
});

export { namespace };
